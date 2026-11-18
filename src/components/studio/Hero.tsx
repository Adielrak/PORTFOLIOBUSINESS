"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { site } from "./content";

const ease = [0.33, 1, 0.68, 1] as const;

/** Infinite horizontal marquee; direction flips with scroll direction, speed boosts while scrolling. */
function Marquee({ text }: { text: string }) {
  const first = useRef<HTMLParagraphElement>(null);
  const second = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let x = 0;
    let dir = -1;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (delta !== 0) dir = delta > 0 ? -1 : 1;
      boost = Math.min(Math.abs(delta) * 0.02, 0.6);
      lastY = y;
    };
    const tick = () => {
      if (x < -100) x = 0;
      else if (x > 0) x = -100;
      if (first.current && second.current) {
        first.current.style.transform = `translateX(${x}%)`;
        second.current.style.transform = `translateX(${x}%)`;
      }
      x += (0.06 + boost) * dir;
      boost *= 0.9;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const cls = "m-0 whitespace-nowrap pr-[50px] text-[clamp(120px,16vw,230px)] font-medium leading-none text-white";
  return (
    <div className="absolute bottom-[8vh] flex w-full overflow-hidden">
      <div className="relative flex">
        <p ref={first} className={cls}>
          {text}
        </p>
        <p ref={second} className={`${cls} absolute left-full top-0`}>
          {text}
        </p>
      </div>
    </div>
  );
}

function Globe() {
  return (
    <svg viewBox="0 0 40 40" className="studio-globe h-[38px] w-[38px]" fill="none" stroke="#1C1D20" strokeWidth="1.4">
      <circle cx="20" cy="20" r="14" />
      <ellipse className="studio-globe-meridian" cx="20" cy="20" rx="6" ry="14" />
      <path d="M6 20h28M8.5 13h23M8.5 27h23" />
    </svg>
  );
}

function Portrait() {
  if (site.heroImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={site.heroImage} alt={`${site.firstName} ${site.lastName}`} className="h-full w-full object-cover" />;
  }
  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax meet" className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 opacity-90">
      <defs>
        <linearGradient id="studio-sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c8081" />
          <stop offset="1" stopColor="#5d6162" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="170" r="95" fill="url(#studio-sil)" />
      <path d="M20 600 C30 400 110 310 200 310 C290 310 370 400 380 600 Z" fill="url(#studio-sil)" />
    </svg>
  );
}

export function Hero() {
  return (
    <motion.section
      id="home"
      initial={{ y: 300 }}
      animate={{ y: 0, transition: { duration: 0.6, ease, delay: 2.5 } }}
      className="relative flex h-screen overflow-hidden bg-[#999D9E]"
    >
      <div className="absolute inset-0">
        <Portrait />
      </div>

      <div className="absolute left-0 top-[42%] hidden items-center gap-8 rounded-r-full bg-[#1C1D20] py-6 pl-10 pr-5 text-white md:flex">
        <p className="text-[17px] leading-tight">
          {site.location[0]}
          <br />
          {site.location[1]}
          <br />
          {site.location[2]}
        </p>
        <span className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#999D9E]">
          <Globe />
        </span>
      </div>

      <div className="absolute left-[8vw] top-[35%] text-white md:left-[65%]">
        <svg width="18" height="18" viewBox="0 0 9 9" fill="none" className="mb-[90px] rotate-0 md:mb-[100px]">
          <path d="M8 8.5c.27 0 .5-.22.5-.5V1.5a.5.5 0 0 0-1 0v6h-6a.5.5 0 0 0 0 1H8ZM.65 1.35l7 7 .7-.7-7-7-.7.7Z" fill="white" />
        </svg>
        <p className="m-0 mb-[10px] text-[clamp(1.5em,2.4vw,2.6em)] leading-none">{site.role[0]}</p>
        <p className="m-0 text-[clamp(1.5em,2.4vw,2.6em)] leading-none">{site.role[1]}</p>
      </div>

      <Marquee text={`${site.firstName} ${site.lastName} —`} />
    </motion.section>
  );
}
