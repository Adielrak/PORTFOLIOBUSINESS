export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/firebase/firestore";

// Simple in-memory rate limit: IP → last increment timestamp
const rateMap = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes per IP per portfolio

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const key = `${ip}:${uid}`;
  const last = rateMap.get(key) ?? 0;
  const now = Date.now();

  if (now - last > RATE_LIMIT_MS) {
    rateMap.set(key, now);
    await incrementViewCount(uid);
  }

  return NextResponse.json({ success: true });
}
