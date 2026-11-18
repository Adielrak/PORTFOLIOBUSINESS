"use client";

import { useRef, type ReactElement, type MouseEvent } from "react";
import { motion, useSpring } from "framer-motion";

/** Pulls its child toward the cursor while hovered, springs back on leave. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactElement; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const spring = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    x.set((e.clientX - (left + width / 2)) * strength);
    y.set((e.clientY - (top + height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset} className="inline-block">
      {children}
    </motion.div>
  );
}
