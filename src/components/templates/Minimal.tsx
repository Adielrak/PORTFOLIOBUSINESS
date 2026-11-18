"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { UserProfile } from "@/lib/types";
import { SocialLinksRow } from "@/components/SocialLinks";

interface Props {
  profile: UserProfile;
  watermark?: boolean;
}

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("in-view"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

export function MinimalTemplate({ profile, watermark = true }: Props) {
  const { portfolio, name, title, photoURL, screenshotURLs, socialLinks } = profile;

  const headerRef = useScrollReveal(0);
  const skillsRef = useScrollReveal(80);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        <div ref={headerRef} className="scroll-reveal flex items-start gap-6">
          {photoURL && (
            <Image
              src={photoURL}
              alt={name}
              width={80}
              height={80}
              className="rounded-full object-cover flex-shrink-0 ring-4 ring-gray-100"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{name}</h1>
            <p className="text-lg text-gray-400 mt-1">{title}</p>
            <p className="text-indigo-600 mt-2 font-medium italic">{portfolio.tagline}</p>
            <div className="mt-3">
              <SocialLinksRow links={socialLinks} />
            </div>
          </div>
        </div>
        <p className="mt-6 text-gray-500 leading-relaxed max-w-xl">{portfolio.bio}</p>
      </header>

      {/* Skills */}
      <section className="max-w-3xl mx-auto px-6 pb-12">
        <div ref={skillsRef} className="scroll-reveal">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-sm rounded-full hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-700 transition-colors duration-150"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-6">
          Projects
        </h2>
        <div className="grid gap-5">
          {portfolio.projects.map((p, i) => (
            <ProjectCard
              key={i}
              project={p}
              screenshotURLs={screenshotURLs}
              delay={i * 80}
            />
          ))}
        </div>
      </section>

      {watermark && (
        <div className="text-center pb-8 text-xs text-gray-300">
          Made with{" "}
          <span className="text-indigo-500 font-medium">folio.ai</span>
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: UserProfile["portfolio"]["projects"][number];
  screenshotURLs: string[];
  delay: number;
}

function ProjectCard({ project: p, screenshotURLs, delay }: ProjectCardProps) {
  const ref = useScrollReveal(delay);

  return (
    <div
      ref={ref}
      className="scroll-reveal border border-gray-100 rounded-2xl p-6 group hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/60 hover:-translate-y-0.5 transition-all duration-200"
    >
      {p.imageIndex !== null && screenshotURLs[p.imageIndex] && (
        <Image
          src={screenshotURLs[p.imageIndex]}
          alt={p.title}
          width={600}
          height={300}
          className="rounded-xl mb-4 object-cover w-full h-44 group-hover:opacity-95 transition-opacity"
        />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
            {p.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">{p.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.tech.map((t) => (
              <span
                key={t}
                className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline whitespace-nowrap flex-shrink-0 font-medium transition-colors"
          >
            View →
          </a>
        )}
      </div>
    </div>
  );
}
