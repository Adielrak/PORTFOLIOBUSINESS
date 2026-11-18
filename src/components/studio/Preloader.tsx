"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { site } from "./content";

const ease = [0.76, 0, 0.24, 1] as const;

/** Cycles through greetings, then slides up with a curved bottom edge. */
export function Preloader() {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setSize({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === site.greetings.length - 1) return;
    const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? 1000 : 150);
    return () => clearTimeout(t);
  }, [index]);

  const { w, h } = size;
  const initialPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0`;
  const targetPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;

  return (
    <motion.div
      initial={{ top: 0 }}
      exit={{ top: "-100vh", transition: { duration: 0.8, ease, delay: 0.2 } }}
      className="fixed inset-x-0 z-[99] flex h-screen w-screen items-center justify-center bg-[#141516]"
    >
      {w > 0 && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75, transition: { duration: 1, delay: 0.2 } }}
            className="absolute z-[1] flex items-center text-[42px] text-white"
          >
            <span className="mr-3 block h-2.5 w-2.5 rounded-full bg-white" />
            {site.greetings[index]}
          </motion.p>
          <svg className="absolute top-0 h-[calc(100%+300px)] w-full">
            <motion.path
              fill="#141516"
              initial={{ d: initialPath }}
              exit={{ d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }}
            />
          </svg>
        </>
      )}
    </motion.div>
  );
}
