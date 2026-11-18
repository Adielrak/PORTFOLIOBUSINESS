"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RoundedButton } from "./RoundedButton";
import { site } from "./content";

const ease = [0.33, 1, 0.68, 1] as const;

export function Description() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px" });

  return (
    <section id="about" ref={ref} className="mt-[120px] flex justify-center px-[8vw] md:mt-[200px] md:px-[200px]">
      <div className="relative flex max-w-[1400px] flex-col gap-12 md:flex-row md:gap-[50px]">
        <p className="m-0 flex flex-wrap gap-x-[8px] text-[clamp(26px,3vw,36px)] leading-[1.3]">
          {site.intro.split(" ").map((word, i) => (
            <span key={i} className="relative inline-flex overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: inView ? "0%" : "100%" }}
                transition={{ duration: 0.5, ease, delay: inView ? 0.01 * i : 0 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="m-0 w-full text-[18px] font-light md:w-[80%]"
        >
          {site.introAside}
        </motion.p>
        <div className="md:absolute md:right-0 md:top-[80%] md:right-[-40px]">
          <RoundedButton href="#contact" className="h-[180px] w-[180px] bg-[#1C1D20] text-white">
            <span className="text-[16px] font-light">Work with us</span>
          </RoundedButton>
        </div>
      </div>
    </section>
  );
}
