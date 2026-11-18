import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "./admin";
import type { UserProfile, ContactMessage, DailyViews } from "@/lib/types";

export async function getPortfolio(uid: string): Promise<UserProfile | null> {
  const doc = await getAdminDb().collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return doc.data() as UserProfile;
}

export async function savePortfolio(uid: string, data: Partial<UserProfile>): Promise<void> {
  await getAdminDb().collection("users").doc(uid).set(data, { merge: true });
}

export async function incrementViewCount(uid: string): Promise<void> {
  const db = getAdminDb();
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  await Promise.all([
    db.collection("users").doc(uid).update({
      viewCount: FieldValue.increment(1),
    }),
    db
      .collection("users")
      .doc(uid)
      .collection("analytics")
      .doc("views")
      .set({ [today]: FieldValue.increment(1) }, { merge: true }),
  ]);
}

export async function getDailyViews(uid: string): Promise<DailyViews> {
  const doc = await getAdminDb()
    .collection("users")
    .doc(uid)
    .collection("analytics")
    .doc("views")
    .get();
  if (!doc.exists) return {};
  return doc.data() as DailyViews;
}

export async function saveContactMessage(
  uid: string,
  msg: Omit<ContactMessage, "id">
): Promise<void> {
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .collection("messages")
    .add(msg);
}

export async function getContactMessages(uid: string): Promise<ContactMessage[]> {
  const snap = await getAdminDb()
    .collection("users")
    .doc(uid)
    .collection("messages")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, "id">) }));
}

export async function markMessageRead(uid: string, messageId: string): Promise<void> {
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .collection("messages")
    .doc(messageId)
    .update({ read: true });
}

export async function deductTokens(
  uid: string,
  tokensUsed: number,
  resetAt: number
): Promise<void> {
  await getAdminDb()
    .collection("users")
    .doc(uid)
    .update({
      tokensUsedThisMonth: FieldValue.increment(tokensUsed),
      tokenResetAt: resetAt,
    });
}
