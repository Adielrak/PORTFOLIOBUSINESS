"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  uid: string;
  initialCount?: number;
}

export function ViewCounter({ uid, initialCount = 0 }: ViewCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return;

    let unsub: (() => void) | undefined;
    import("firebase/firestore").then(({ doc, onSnapshot }) =>
      import("@/lib/firebase/client").then(({ getClientDb }) => {
        unsub = onSnapshot(doc(getClientDb(), "users", uid), (snap) => {
          if (snap.exists()) setCount(snap.data().viewCount ?? 0);
        });
      })
    );
    return () => unsub?.();
  }, [uid]);

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
      <span>👁</span>
      <span>{count.toLocaleString()} views</span>
    </span>
  );
}
