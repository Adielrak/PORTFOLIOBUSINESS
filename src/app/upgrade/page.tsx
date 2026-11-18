"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/provider";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { TOKEN_LIMITS } from "@/lib/types";

const FREE_FEATURES = [
  "1 AI-generated portfolio",
  "3 templates",
  "Public shareable URL",
  "ATS-ready resume PDF",
  "View counter",
];

const PRO_FEATURES = [
  "Everything in Free",
  "AI chat editor (edit by talking to AI)",
  `${TOKEN_LIMITS.pro.toLocaleString()} tokens / month`,
  "Remove folio.ai watermark",
  "Contact form on your portfolio",
  "Analytics dashboard (30-day chart)",
  "Priority support",
];

function UpgradeContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/upgrade", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Upgrade failed");
      router.push("/preview?upgraded=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
          Upgrade
        </p>
        <h1 className="text-4xl font-black tracking-tighter mb-4">
          Unlock the full power of folio.ai
        </h1>
        <p className="text-gray-400 mb-14 max-w-md mx-auto leading-relaxed">
          Edit your portfolio by chatting with AI, remove the watermark, and get detailed analytics.
        </p>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-2 gap-5 text-left max-w-2xl mx-auto mb-10">
          {/* Free */}
          <div className="border border-white/8 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Free</p>
            <p className="text-3xl font-black mb-1">$0</p>
            <p className="text-gray-500 text-sm mb-5">Forever</p>
            <ul className="space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-gray-600 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="border-2 border-indigo-500 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
              Popular
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">Pro</p>
            <p className="text-3xl font-black mb-1">$9</p>
            <p className="text-gray-500 text-sm mb-5">per month</p>
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-indigo-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/30 text-sm"
        >
          {loading ? "Activating Pro…" : "Upgrade to Pro — $9/mo →"}
        </button>
        <p className="text-gray-600 text-xs mt-3">
          Demo mode: clicking upgrade activates Pro immediately (no real payment).
        </p>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <AuthGuard>
      <UpgradeContent />
    </AuthGuard>
  );
}
