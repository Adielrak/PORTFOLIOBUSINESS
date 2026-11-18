"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, type Variants } from "framer-motion";
import { RoundedButton } from "./RoundedButton";
import { projects, type Project } from "./content";

const scaleVariants: Variants = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
  closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
};

function ProjectRow({ project, index, onHover }: { project: Project; index: number; onHover: (i: number, on: boolean) => void }) {
  return (
    <a
      href="#work"
      onMouseEnter={() => onHover(index, true)}
      onMouseLeave={() => onHover(index, false)}
      className="group flex w-full cursor-pointer items-center justify-between border-t border-[rgb(201,201,201)] px-[2vw] py-[40px] transition-all duration-200 last:border-b hover:opacity-50 md:px-[100px] md:py-[50px]"
    >
      <h2 className="m-0 text-[clamp(32px,5.5vw,60px)] font-normal transition-transform duration-[400ms] group-hover:-translate-x-[10px]">
        {project.title}
      </h2>
      <p className="hidden font-light transition-transform duration-[400ms] group-hover:translate-x-[10px] md:block">
        {project.tag}
      </p>
    </a>
  );
}

/** Placeholder artwork for a project; replace with <img> once you have real shots. */
function ProjectArt({ project }: { project: Project }) {
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ background: project.color }}>
      <div
        className="flex h-[70%] w-[75%] items-end rounded-[4px] p-4 text-[12px] uppercase tracking-wide shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${project.accent}, ${project.color === "#000000" ? "#2a2a2a" : "#ffffff"})`, color: "#1C1D20" }}
      >
        {project.title}
      </div>
    </div>
  );
}

function FollowModal({ active, index }: { active: boolean; index: number }) {
  const container = useSpring(0, { stiffness: 300, damping: 30 });
  const containerY = useSpring(0, { stiffness: 300, damping: 30 });
  const cursorX = useSpring(0, { stiffness: 500, damping: 35 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      container.set(e.clientX);
      containerY.set(e.clientY);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [container, containerY, cursorX, cursorY]);

  return (
    <>
      <motion.div
        variants={scaleVariants}
        initial="initial"
        animate={active ? "enter" : "closed"}
        style={{ left: container, top: containerY }}
        className="pointer-events-none fixed z-[3] hidden h-[350px] w-[400px] overflow-hidden bg-white md:block"
      >
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${index * -100}%` }}
        >
          {projects.map((p) => (
            <div key={p.title} className="h-full w-full">
              <ProjectArt project={p} />
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        variants={scaleVariants}
        initial="initial"
        animate={active ? "enter" : "closed"}
        style={{ left: cursorX, top: cursorY }}
        className="pointer-events-none fixed z-[3] hidden h-[80px] w-[80px] items-center justify-center rounded-full bg-[#455CE9] text-[14px] font-light text-white md:flex"
      >
        View
      </motion.div>
    </>
  );
}

export function Projects() {
  const [modal, setModal] = useState({ active: false, index: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" className="mt-[220px] flex flex-col items-center px-[4vw] md:mt-[300px] md:px-[200px]">
      <div ref={listRef} className="mb-[100px] flex w-full max-w-[1400px] flex-col">
        <p className="mb-[40px] pl-[2vw] text-[11px] uppercase text-[#999D9E] md:pl-0">Recent work</p>
        {projects.map((p, i) => (
          <ProjectRow key={p.title} project={p} index={i} onHover={(index, active) => setModal({ active, index })} />
        ))}
      </div>
      <RoundedButton href="#work" className="border border-[rgb(136,136,136)] px-[60px] py-[15px]">
        <span className="text-[16px]">More work</span>
      </RoundedButton>
      <FollowModal active={modal.active} index={modal.index} />
    </section>
  );
}
