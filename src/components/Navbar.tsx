"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth/provider";

export function Navbar() {
  const { user, loading, signIn, signOut } = useAuth();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-navy/90 backdrop-blur border-b border-navy-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-cream text-base tracking-tight">
          folio<span className="text-electric">.</span>ai
        </Link>

        <div className="flex items-center gap-5">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-5">
                  <Link href="/generate" className="text-sm text-muted hover:text-cream transition-colors">
                    Generate
                  </Link>
                  <Link href="/preview" className="text-sm text-muted hover:text-cream transition-colors">
                    Preview
                  </Link>
                  <Link href="/dashboard" className="text-sm text-muted hover:text-cream transition-colors">
                    Dashboard
                  </Link>
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName ?? ""}
                      width={28}
                      height={28}
                      className="rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    />
                  )}
                  <button
                    onClick={signOut}
                    className="text-sm text-muted hover:text-cream transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="px-4 py-1.5 bg-electric hover:bg-electric-hover text-white text-sm font-medium rounded-full transition-colors"
                >
                  Sign in
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
