"use client";

import { useEffect } from "react";

export function IncrementViews({ uid }: { uid: string }) {
  useEffect(() => {
    fetch("/api/increment-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    }).catch(() => {});
  }, [uid]);

  return null;
}
