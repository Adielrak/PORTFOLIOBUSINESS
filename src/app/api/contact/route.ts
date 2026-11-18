export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/firebase/firestore";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    uid: string;
    fromName: string;
    fromEmail: string;
    message: string;
  };

  const { uid, fromName, fromEmail, message } = body;

  if (!uid || !fromName?.trim() || !fromEmail?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  // Basic email format check at the boundary
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Length guards
  if (fromName.length > 100 || fromEmail.length > 200 || message.length > 2000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  await saveContactMessage(uid, {
    fromName: fromName.trim(),
    fromEmail: fromEmail.trim(),
    message: message.trim(),
    createdAt: Date.now(),
    read: false,
  });

  return NextResponse.json({ success: true });
}
