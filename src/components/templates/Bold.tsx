import Image from "next/image";
import type { UserProfile } from "@/lib/types";
import { SocialLinksRow } from "@/components/SocialLinks";

interface Props {
  profile: UserProfile;
  watermark?: boolean;
}

export function BoldTemplate({ profile, watermark = true }: Props) {
  const { portfolio, name, title, photoURL, screenshotURLs, socialLinks } = profile;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/20" />
        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20">
          <div className="flex items-center gap-8">
            {photoURL && (
              <Image
                src={photoURL}
                alt={name}
                width={100}
                height={100}
                className="rounded-2xl object-cover flex-shrink-0 ring-2 ring-indigo-500/30"
              />
            )}
            <div>
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">
                {title}
              </p>
              <h1 className="text-6xl font-black tracking-tighter leading-none">{name}</h1>
              <p className="text-xl text-gray-400 mt-3 font-light italic">{portfolio.tagline}</p>
              <div className="mt-4">
                <SocialLinksRow links={socialLinks} dark />
              </div>
            </div>
          </div>
          <p className="mt-8 text-gray-300 text-lg leading-relaxed max-w-2xl">{portfolio.bio}</p>
        </div>
      </header>

      {/* Skills */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-white/5">
        <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
          Tech Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {portfolio.skills.map((s) => (
            <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
          Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {portfolio.projects.map((p, i) => (
            <div key={i} className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-colors group">
              {p.imageIndex !== null && screenshotURLs[p.imageIndex] && (
                <Image
                  src={screenshotURLs[p.imageIndex]}
                  alt={p.title}
                  width={600}
                  height={250}
                  className="w-full h-44 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="font-bold text-lg text-white">{p.title}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300 group-hover:underline"
                  >
                    View project →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {watermark && (
        <div className="text-center pb-8 text-xs text-gray-600">
          Made with <span className="text-indigo-400 font-medium">folio.ai</span>
        </div>
      )}
    </div>
  );
}
