"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, UserProfile, PortfolioChange } from "@/lib/types";

interface Props {
  profile: UserProfile;
  authToken: string;
  onApplyChanges: (changes: PortfolioChange[]) => void;
  tokensRemaining: number;
  onTokensUpdate: (remaining: number) => void;
}

export function ChatEditor({ profile, authToken, onApplyChanges, tokensRemaining, onTokensUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isPro = (profile.plan === "pro") || profile.isPaid;

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    setInput("");

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json() as {
        changes?: PortfolioChange[];
        explanation?: string;
        tokensRemaining?: number;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setMessages((m) => m.slice(0, -1));
        return;
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.explanation ?? "Done!" },
      ]);

      if (data.changes?.length) {
        onApplyChanges(data.changes);
      }
      if (data.tokensRemaining !== undefined) {
        onTokensUpdate(data.tokensRemaining);
      }
    } catch {
      setError("Network error. Please try again.");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-full shadow-xl shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95"
        title="Edit with AI"
      >
        <span>✦</span>
        <span>Edit with AI</span>
        {!isPro && <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Pro</span>}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex pointer-events-none">
          {/* Backdrop */}
          <div
            className="flex-1 pointer-events-auto"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="w-full max-w-sm bg-gray-950 border-l border-white/10 flex flex-col pointer-events-auto shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div>
                <p className="font-semibold text-white text-sm">AI Portfolio Editor</p>
                {isPro ? (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {tokensRemaining.toLocaleString()} tokens remaining
                  </p>
                ) : (
                  <p className="text-xs text-indigo-400 mt-0.5">Pro feature</p>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-white transition-colors text-lg"
              >
                ×
              </button>
            </div>

            {!isPro ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="text-4xl mb-4">✦</div>
                <p className="font-semibold text-white mb-2">Upgrade to Pro</p>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Chat with AI to edit your bio, tagline, projects, and more. 100,000 tokens per month.
                </p>
                <a
                  href="/upgrade"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Upgrade for $9/mo →
                </a>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
                  {messages.length === 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs text-gray-500 text-center mb-4">
                        Tell the AI what to change in your portfolio.
                      </p>
                      {[
                        "Make my bio more casual",
                        "Add a stronger tagline",
                        "Polish my project descriptions",
                      ].map((hint) => (
                        <button
                          key={hint}
                          onClick={() => setInput(hint)}
                          className="w-full text-left px-3 py-2.5 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl text-xs text-gray-300 transition-colors"
                        >
                          {hint}
                        </button>
                      ))}
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-white/8 text-gray-200 border border-white/8"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 bg-white/5 border border-white/8 rounded-2xl">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 150}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-xs text-red-400 text-center px-2">{error}</p>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 pb-4 pt-2 border-t border-white/5">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                      placeholder="What should I change?"
                      className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm rounded-xl transition-colors"
                    >
                      ↑
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
