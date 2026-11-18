"use client";

import { useState } from "react";

interface ShareBarProps {
  uid: string;
  name: string;
}

export function ShareBar({ uid, name }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/p/${uid}`
    : `/p/${uid}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const text = encodeURIComponent(`Check out ${name}'s AI-generated portfolio`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={copy}
        className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
      >
        {copied ? "✓ Copied!" : "🔗 Copy link"}
      </button>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 bg-[#0077b5] hover:bg-[#006097] text-white text-sm rounded-lg transition-colors"
      >
        LinkedIn
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-900 text-white text-sm rounded-lg transition-colors border border-gray-700"
      >
        𝕏 Share
      </a>

      <a
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 bg-[#25d366] hover:bg-[#1eb355] text-white text-sm rounded-lg transition-colors"
      >
        WhatsApp
      </a>
    </div>
  );
}
