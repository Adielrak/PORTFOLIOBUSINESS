"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/provider";
import { AuthGuard } from "@/components/AuthGuard";
import { PortfolioPreview } from "@/components/PortfolioPreview";
import { ResumePreview } from "@/components/ResumePreview";
import { ShareBar } from "@/components/ShareBar";
import { ChatEditor } from "@/components/ChatEditor";
import type { UserProfile, PortfolioChange } from "@/lib/types";
import { TOKEN_LIMITS } from "@/lib/types";
import Link from "next/link";

function PreviewContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<"portfolio" | "resume">("portfolio");
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const [tokensRemaining, setTokensRemaining] = useState(0);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => {
      setAuthToken(token);
      import("firebase/firestore").then(({ doc, getDoc }) =>
        import("@/lib/firebase/client").then(({ getClientDb }) =>
          getDoc(doc(getClientDb(), "users", user.uid)).then((snap) => {
            if (snap.exists()) {
              const p = snap.data() as UserProfile;
              setProfile(p);
              const plan = p.plan ?? (p.isPaid ? "pro" : "free");
              const limit = TOKEN_LIMITS[plan];
              setTokensRemaining(Math.max(0, limit - (p.tokensUsedThisMonth ?? 0)));
            }
            setLoading(false);
          })
        )
      );
    });
  }, [user]);

  // Apply AI-suggested field changes to local profile state and save to Firestore
  async function handleApplyChanges(changes: PortfolioChange[]) {
    if (!profile || !user) return;

    let updated = { ...profile, portfolio: { ...profile.portfolio } };

    for (const change of changes) {
      const { path, value } = change;
      if (path === "portfolio.bio") updated.portfolio.bio = value as string;
      else if (path === "portfolio.tagline") updated.portfolio.tagline = value as string;
      else if (path === "portfolio.skills") updated.portfolio.skills = value as string[];
      else if (path === "portfolio.projects") updated.portfolio.projects = value as UserProfile["portfolio"]["projects"];
      else if (path === "resume.summary") updated = { ...updated, resume: { ...updated.resume, summary: value as string } };
    }

    setProfile(updated);

    // Persist to Firestore
    const { doc, setDoc } = await import("firebase/firestore");
    const { getClientDb } = await import("@/lib/firebase/client");
    await setDoc(doc(getClientDb(), "users", user.uid), updated, { merge: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-400 gap-4">
        <p className="text-lg">No portfolio generated yet.</p>
        <a href="/generate" className="text-indigo-400 hover:underline">Generate your portfolio →</a>
      </div>
    );
  }

  const plan = profile.plan ?? (profile.isPaid ? "pro" : "free");

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
        <div className="flex gap-2">
          {(["portfolio", "resume"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {plan === "free" && (
            <Link
              href="/upgrade"
              className="px-4 py-1.5 border border-indigo-600/50 text-indigo-400 hover:bg-indigo-600 hover:text-white text-xs font-semibold rounded-full transition-colors"
            >
              ✦ Upgrade to Pro
            </Link>
          )}
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          {user && <ShareBar uid={user.uid} name={profile.name} />}
        </div>
      </div>

      <div>
        {tab === "portfolio" ? (
          <PortfolioPreview profile={profile} watermark={plan === "free"} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-10">
            <ResumePreview resume={profile.resume} name={profile.name} title={profile.title} />
          </div>
        )}
      </div>

      {/* Floating AI Chat Editor */}
      {authToken && (
        <ChatEditor
          profile={profile}
          authToken={authToken}
          onApplyChanges={handleApplyChanges}
          tokensRemaining={tokensRemaining}
          onTokensUpdate={setTokensRemaining}
        />
      )}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <AuthGuard>
      <PreviewContent />
    </AuthGuard>
  );
}
