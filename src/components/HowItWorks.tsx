"use client";

import { useState } from "react";

const STEPS = [
  {
    num: "01",
    title: "Fill the form",
    desc: "Name, role, GitHub URL, a quick bio. Takes under 2 minutes — no fluff required.",
  },
  {
    num: "02",
    title: "Builder generates",
    desc: "Polished copy, extracted projects, structured resume — all assembled automatically.",
  },
  {
    num: "03",
    title: "Share instantly",
    desc: "Your public portfolio URL is live immediately. Link it in applications, bios, anywhere.",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-2">
      {STEPS.map((step, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-200 group border ${
            active === i
              ? "bg-navy-light border-navy-border"
              : "bg-transparent border-transparent hover:border-navy-border"
          }`}
        >
          <div className="flex items-start gap-5">
            <span
              className={`text-xs font-mono font-bold tracking-widest pt-0.5 flex-shrink-0 transition-colors ${
                active === i
                  ? "text-electric"
                  : "text-navy-border group-hover:text-muted"
              }`}
            >
              {step.num}
            </span>
            <div className="min-w-0">
              <p
                className={`font-semibold text-sm transition-colors ${
                  active === i ? "text-cream" : "text-muted group-hover:text-dim"
                }`}
              >
                {step.title}
              </p>
              <div
                className={`text-sm leading-relaxed text-muted transition-all duration-300 overflow-hidden ${
                  active === i ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                {step.desc}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
