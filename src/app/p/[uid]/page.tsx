export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPortfolio } from "@/lib/firebase/firestore";
import { PortfolioPreview } from "@/components/PortfolioPreview";
import { ViewCounter } from "@/components/ViewCounter";
import { ShareBar } from "@/components/ShareBar";
import { ContactForm } from "@/components/ContactForm";
import { IncrementViews } from "./IncrementViews";

interface Props {
  params: { uid: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getPortfolio(params.uid);
  if (!profile) return { title: "Portfolio not found" };

  return {
    title: `${profile.name} — ${profile.title}`,
    description: profile.portfolio?.tagline,
    openGraph: {
      title: `${profile.name} — ${profile.title}`,
      description: profile.portfolio?.tagline,
      type: "profile",
      images: profile.photoURL ? [{ url: profile.photoURL }] : [],
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const profile = await getPortfolio(params.uid);

  if (!profile || !profile.portfolio) {
    notFound();
  }

  return (
    <div>
      {/* Increment view count on load */}
      <IncrementViews uid={params.uid} />

      {/* Sticky share bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-4 shadow-2xl">
        <ViewCounter uid={params.uid} initialCount={profile.viewCount ?? 0} />
        <div className="w-px h-4 bg-white/10" />
        <ShareBar uid={params.uid} name={profile.name} />
        <div className="w-px h-4 bg-white/10" />
        <ContactForm uid={params.uid} ownerName={profile.name} />
      </div>

      {/* Portfolio content */}
      <PortfolioPreview profile={profile} watermark={!profile.isPaid} />
    </div>
  );
}
