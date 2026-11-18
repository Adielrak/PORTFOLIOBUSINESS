"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/provider";
import { AuthGuard } from "@/components/AuthGuard";
import type { ContactMessage, DailyViews, UserProfile } from "@/lib/types";
import { TOKEN_LIMITS } from "@/lib/types";
import Link from "next/link";

function DashboardContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [views, setViews] = useState<DailyViews>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"analytics" | "inbox">("analytics");

  useEffect(() => {
    if (!user) return;
    const token = user.getIdToken();
    token.then(async (t) => {
      const [profSnap, msgSnap, viewSnap] = await Promise.all([
        fetch("/api/dashboard", { headers: { Authorization: `Bearer ${t}` } }),
        fetch("/api/dashboard/messages", { headers: { Authorization: `Bearer ${t}` } }),
        fetch("/api/dashboard/views", { headers: { Authorization: `Bearer ${t}` } }),
      ]);
      const [p, m, v] = await Promise.all([profSnap.json(), msgSnap.json(), viewSnap.json()]);
      setProfile(p.profile ?? null);
      setMessages(m.messages ?? []);
      setViews(v.views ?? {});
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const plan = profile?.plan ?? (profile?.isPaid ? "pro" : "free");
  const tokensUsed = profile?.tokensUsedThisMonth ?? 0;
  const tokenLimit = TOKEN_LIMITS[plan];
  const unreadCount = messages.filter((m) => !m.read).length;

  // Build last-30-days chart data
  const chartData = getLast30Days(views);
  const maxViews = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {profile?.name ?? "Your portfolio"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {plan === "free" && (
              <Link
                href="/upgrade"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-full transition-colors"
              >
                Upgrade to Pro
              </Link>
            )}
            {plan === "pro" && (
              <span className="px-3 py-1 bg-indigo-900/50 border border-indigo-700/40 text-indigo-300 text-xs font-semibold rounded-full">
                ✦ Pro
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Stat label="Total views" value={profile?.viewCount?.toLocaleString() ?? "0"} />
          <Stat label="Last 30 days" value={chartData.reduce((s, d) => s + d.count, 0).toLocaleString()} />
          <Stat label="Messages" value={messages.length.toString()} badge={unreadCount > 0 ? unreadCount.toString() : undefined} />
          <Stat
            label="Tokens used"
            value={plan === "free" ? "—" : `${tokensUsed.toLocaleString()} / ${tokenLimit.toLocaleString()}`}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {(["analytics", "inbox"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {t}
              {t === "inbox" && unreadCount > 0 && (
                <span className="ml-2 w-4 h-4 inline-flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Analytics tab */}
        {tab === "analytics" && (
          <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
              Daily views — last 30 days
            </p>
            <div className="flex items-end gap-1 h-32">
              {chartData.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-indigo-600/40 hover:bg-indigo-500 rounded-sm transition-colors"
                    style={{ height: `${(d.count / maxViews) * 100}%`, minHeight: d.count > 0 ? "4px" : "2px" }}
                  />
                  {d.count > 0 && (
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {d.count} view{d.count !== 1 ? "s" : ""} · {d.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-600">{chartData[0]?.label}</span>
              <span className="text-xs text-gray-600">Today</span>
            </div>
          </div>
        )}

        {/* Inbox tab */}
        {tab === "inbox" && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-12 text-center">
                <p className="text-gray-500 text-sm">No messages yet.</p>
                <p className="text-gray-600 text-xs mt-1">Messages from your portfolio visitors will appear here.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`border rounded-2xl p-5 transition-colors ${
                    msg.read ? "bg-gray-900/40 border-white/5" : "bg-gray-900/80 border-indigo-700/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-white">{msg.fromName}</p>
                        {!msg.read && (
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{msg.fromEmail}</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{msg.message}</p>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-white">{value}</p>
        {badge && (
          <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function getLast30Days(views: DailyViews) {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      date: key,
      count: views[key] ?? 0,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
