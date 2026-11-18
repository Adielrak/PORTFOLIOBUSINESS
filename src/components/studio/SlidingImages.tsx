"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { slider1, slider2 } from "./content";

type Slide = { color: string; accent: string };

function Card({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-[20vw] w-1/4 items-center justify-center" style={{ background: slide.color }}>
      <div className="relative h-[80%] w-[80%] overflow-hidden rounded-[2px] shadow-lg" style={{ background: "#ffffff" }}>
        <div className="absolute inset-x-0 top-0 h-[12%]" style={{ background: slide.accent }} />
        <div className="absolute left-[8%] top-[24%] h-[10%] w-[55%] rounded-sm bg-[#1C1D20]/80" />
        <div className="absolute left-[8%] top-[40%] h-[4%] w-[40%] rounded-sm bg-[#1C1D20]/30" />
        <div className="absolute bottom-[8%] right-[8%] h-[40%] w-[38%] rounded-sm" style={{ background: slide.accent, opacity: 0.6 }} />
      </div>
    </div>
  );
}

/** Two rows of cards that slide in opposite directions with scroll, plus a curved bottom edge. */
export function SlidingImages() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [50, 0]);

  return (
    <div ref={container} className="relative z-[1] mt-[200px] flex flex-col gap-[3vw] bg-white">
      <motion.div style={{ x: x1 }} className="relative left-[-10vw] flex w-[120vw] gap-[3vw]">
        {slider1.map((s, i) => (
          <Card key={i} slide={s} />
        ))}
      </motion.div>
      <motion.div style={{ x: x2 }} className="relative left-[-10vw] flex w-[120vw] gap-[3vw]">
        {slider2.map((s, i) => (
          <Card key={i} slide={s} />
        ))}
      </motion.div>
      <motion.div style={{ height }} className="relative mt-[100px]">
        <div className="absolute left-[-10%] z-[1] h-[1550%] w-[120%] rounded-[0_0_50%_50%] bg-white shadow-[0px_60px_50px_rgba(0,0,0,0.75)]" />
      </motion.div>
    </div>
  );
}
