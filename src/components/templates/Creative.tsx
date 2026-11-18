import Image from "next/image";
import type { UserProfile } from "@/lib/types";
import { SocialLinksRow } from "@/components/SocialLinks";

interface Props {
  profile: UserProfile;
  watermark?: boolean;
}

export function CreativeTemplate({ profile, watermark = true }: Props) {
  const { portfolio, name, title, photoURL, screenshotURLs, socialLinks } = profile;

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900 font-sans">
      {/* Asymmetric hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-12 grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-3 space-y-4">
          <p className="text-amber-600 font-bold text-sm uppercase tracking-widest">{title}</p>
          <h1 className="text-7xl font-black leading-none tracking-tighter">{name}</h1>
          <p className="text-2xl text-gray-500 font-light italic">{portfolio.tagline}</p>
          <p className="text-gray-600 leading-relaxed mt-4">{portfolio.bio}</p>
          <div className="mt-4">
            <SocialLinksRow links={socialLinks} />
          </div>
        </div>
        {photoURL && (
          <div className="md:col-span-2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-300 rounded-3xl translate-x-3 translate-y-3" />
              <Image
                src={photoURL}
                alt={name}
                width={240}
                height={240}
                className="relative rounded-3xl object-cover w-52 h-52 md:w-64 md:h-64"
              />
            </div>
          </div>
        )}
      </header>

      {/* Skills */}
      <section className="bg-amber-100/60 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {portfolio.skills.map((s) => (
            <span key={s} className="px-3 py-1.5 bg-white border border-amber-200 text-gray-700 text-sm rounded-full font-medium shadow-sm">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Projects: masonry-style */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-8">Work</h2>
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {portfolio.projects.map((p, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
            >
              {p.imageIndex !== null && screenshotURLs[p.imageIndex] && (
                <Image
                  src={screenshotURLs[p.imageIndex]}
                  alt={p.title}
                  width={600}
                  height={300}
                  className="w-full object-cover h-48"
                />
              )}
              <div className="p-5">
                <h3 className="font-bold text-gray-900">{p.title}</h3>
                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Open project ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {watermark && (
        <div className="text-center pb-8 text-xs text-gray-400">
          Made with <span className="text-amber-600 font-semibold">folio.ai</span>
        </div>
      )}
    </div>
  );
}
