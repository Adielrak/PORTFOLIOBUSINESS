export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin-auth";
import { getPortfolio, deductTokens } from "@/lib/firebase/firestore";
import { chatEditPortfolio } from "@/lib/claude";
import { TOKEN_LIMITS } from "@/lib/types";
import type { ChatMessage } from "@/lib/types";

const MS_PER_MONTH = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let uid: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const profile = await getPortfolio(uid);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Plan check
  const plan = profile.plan ?? (profile.isPaid ? "pro" : "free");
  if (plan === "free") {
    return NextResponse.json(
      { error: "Chat editing requires a Pro plan. Upgrade to unlock." },
      { status: 403 }
    );
  }

  // Monthly token reset check
  const now = Date.now();
  const resetAt = profile.tokenResetAt ?? now;
  const isNewMonth = now - resetAt > MS_PER_MONTH;
  const effectiveResetAt = isNewMonth ? now : resetAt;
  const currentUsage = isNewMonth ? 0 : (profile.tokensUsedThisMonth ?? 0);
  const limit = TOKEN_LIMITS[plan];

  if (currentUsage >= limit) {
    return NextResponse.json(
      { error: `Monthly token limit reached (${limit.toLocaleString()} tokens). Resets in ${Math.ceil((effectiveResetAt + MS_PER_MONTH - now) / 86400000)} days.` },
      { status: 429 }
    );
  }

  const body = await req.json() as { messages: ChatMessage[] };
  const { messages } = body;

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  // Call Claude
  const portfolioContext = {
    portfolio: profile.portfolio,
    resume: profile.resume,
    name: profile.name,
    title: profile.title,
  };

  const result = await chatEditPortfolio(messages, portfolioContext);

  // Deduct tokens
  await deductTokens(uid, result.tokensUsed, effectiveResetAt);

  return NextResponse.json({
    changes: result.changes,
    explanation: result.explanation,
    tokensUsed: result.tokensUsed,
    tokensRemaining: Math.max(0, limit - currentUsage - result.tokensUsed),
  });
}
