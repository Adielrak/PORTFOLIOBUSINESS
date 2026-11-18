import Link from "next/link";
import { HeroGeometry } from "@/components/HeroCarousel";
import { AnimatedSection } from "@/components/AnimatedSection";
import { HowItWorks } from "@/components/HowItWorks";

/* ── Inline SVG icons ── */
function IconBolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M11 2L4 11h6l-1 7 7-9h-6l1-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M8 10a4 4 0 0 0 4 4h1a4 4 0 0 0 0-8h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10a4 4 0 0 0-4-4H7a4 4 0 0 0 0 8h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconBar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 17V10M8 17V6M13 17V12M18 17V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M14 3l3 3-9 9H5v-3L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Feature data ── */
const FEATURES = [
  {
    icon: <IconBolt />,
    title: "60-second flow",
    desc: "Name, role, GitHub URL. The builder structures your entire portfolio without back-and-forth.",
  },
  {
    icon: <IconGrid />,
    title: "Three sharp templates",
    desc: "Minimal, Bold, or Creative. Switch anytime — your data travels with it.",
  },
  {
    icon: <IconLink />,
    title: "Public URL, instantly",
    desc: "Every portfolio gets a permanent link the moment it generates. No publishing step.",
  },
  {
    icon: <IconDoc />,
    title: "Print-ready resume",
    desc: "Download a clean, ATS-compatible PDF resume alongside your portfolio site.",
  },
  {
    icon: <IconBar />,
    title: "View analytics",
    desc: "See how many people have opened your portfolio. Live, without any setup.",
  },
  {
    icon: <IconEdit />,
    title: "Refined copy",
    desc: "Your experience is rewritten for clarity and impact — specific, not generic.",
  },
];

/* ── Landing page ── */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-navy text-cream overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Copy */}
        <div className="hero-enter">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-navy-border rounded-full text-muted text-xs font-medium mb-9 tracking-wider">
            <span className="w-1.5 h-1.5 bg-electric rounded-full" />
            Portfolio builder — free to start
          </div>

          <h1 className="text-[clamp(52px,8vw,84px)] font-black tracking-tighter leading-[0.88] mb-7">
            Your portfolio.
            <br />
            <span className="text-electric">Built right.</span>
          </h1>

          <p className="text-muted text-lg leading-relaxed mb-10 max-w-md">
            Paste your GitHub. Upload your resume. Get a polished portfolio
            site and print-ready resume in under 2 minutes.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/generate" className="btn-primary">
              Build yours &rarr;
            </Link>
            <Link href="/p/demo" className="btn-secondary">
              See an example
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <div className="h-px w-10 bg-navy-border" />
            <p className="text-xs text-muted tracking-wider">
              Free to start &middot; No card required
            </p>
          </div>
        </div>

        {/* 3D geometry element */}
        <div className="hero-enter-delay">
          <HeroGeometry />
        </div>
      </section>

      {/* ── Social strip ── */}
      <div className="border-y border-navy-border py-5">
        <p className="text-center text-sm text-muted">
          <span className="text-cream font-semibold">1,000+</span>{" "}
          engineers now have a live portfolio
        </p>
      </div>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <AnimatedSection className="mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-electric mb-5">
            What you get
          </p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-cream">
            Everything you need.
          </h2>
          <p className="text-4xl sm:text-5xl font-black tracking-tighter text-navy-border mt-1">
            Nothing you don&apos;t.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 60}>
              <div className="tilt-card h-full p-7 rounded-xl border border-navy-border bg-navy-light hover:border-electric/30 hover:bg-[#0F1830] cursor-default">
                <div className="mb-5 text-electric">{f.icon}</div>
                <h3 className="font-bold text-cream mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <AnimatedSection>
            <p className="text-xs font-semibold tracking-widest uppercase text-electric mb-5">
              How it works
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-cream">
              Zero to live
            </h2>
            <p className="text-4xl sm:text-5xl font-black tracking-tighter text-navy-border mt-1 mb-10">
              in under 2 minutes.
            </p>
            <HowItWorks />
          </AnimatedSection>

          <AnimatedSection delay={180} className="lg:sticky lg:top-28">
            <PortfolioMockup />
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA block ── */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <AnimatedSection>
          <div className="bg-electric rounded-2xl px-10 py-20 sm:py-24 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-6">
              Get started
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-4">
              Your portfolio is waiting.
            </h2>
            <p className="text-white/60 mb-12 text-base">
              Under 2 minutes. No card required.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center px-9 py-4 bg-navy hover:bg-navy-light text-cream font-bold rounded-full text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get started free
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-navy-border py-10 text-center">
        <p className="text-sm text-muted">
          folio<span className="text-electric">.</span>ai
        </p>
        <p className="mt-2 text-xs text-navy-border">Sign in with Google to get started</p>
      </footer>
    </main>
  );
}

/* ── Portfolio preview mockup ── */
function PortfolioMockup() {
  return (
    <div className="rounded-xl border border-navy-border bg-navy-light overflow-hidden shadow-2xl shadow-black/50">
      {/* Browser chrome */}
      <div className="bg-navy border-b border-navy-border px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-navy-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-navy-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-navy-border" />
        </div>
        <div className="flex-1 mx-2 bg-navy-border/50 rounded px-3 py-1 text-[10px] text-muted font-mono">
          folio.ai/p/alex-chen
        </div>
      </div>

      {/* Mock content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-navy-border flex-shrink-0" />
          <div>
            <div className="h-3 w-24 bg-cream/80 rounded mb-2" />
            <div className="h-2 w-36 bg-navy-border rounded" />
          </div>
        </div>

        {/* Bio lines */}
        <div className="space-y-2 mb-5">
          <div className="h-2 w-full bg-navy-border rounded" />
          <div className="h-2 w-5/6 bg-navy-border rounded" />
          <div className="h-2 w-3/5 bg-navy-border rounded" />
        </div>

        {/* Skill tags */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {["TypeScript", "React", "Node.js"].map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[10px] border border-navy-border rounded text-muted font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Projects label */}
        <div className="text-[10px] font-semibold uppercase tracking-widest text-navy-border mb-3">
          Projects
        </div>

        {/* Project cards */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="border border-navy-border rounded-lg p-4 mb-3 last:mb-0 group hover:border-electric/30 transition-all duration-200"
          >
            <div className="h-3 w-40 bg-cream/80 rounded mb-2 group-hover:bg-electric/80 transition-colors duration-200" />
            <div className="h-2 w-full bg-navy-border rounded mb-1.5" />
            <div className="h-2 w-4/5 bg-navy-border rounded" />
            <div className="flex gap-2 mt-3">
              <div className="h-5 w-14 rounded bg-electric/20" />
              <div className="h-5 w-14 rounded bg-navy-border" />
              <div className="h-5 w-14 rounded bg-navy-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
