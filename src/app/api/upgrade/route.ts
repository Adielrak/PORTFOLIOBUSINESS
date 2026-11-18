export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin-auth";
import { savePortfolio } from "@/lib/firebase/firestore";

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

  // In production this would be after a Stripe checkout confirmation.
  // For now, mark the account as Pro directly.
  await savePortfolio(uid, {
    plan: "pro",
    isPaid: true,
    tokensUsedThisMonth: 0,
    tokenResetAt: Date.now(),
  });

  return NextResponse.json({ success: true, plan: "pro" });
}
