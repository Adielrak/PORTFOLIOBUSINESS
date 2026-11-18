"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { fullNames, site } from "./content";

const ease = [0.76, 0, 0.24, 1] as const;

function Curve() {
  const [h, setH] = useState(0);
  useEffect(() => setH(window.innerHeight), []);
  if (!h) return null;
  const initial = `M100 0 L200 0 L200 ${h} L100 ${h} Q-100 ${h / 2} 100 0`;
  const target = `M100 0 L200 0 L200 ${h} L100 ${h} Q100 ${h / 2} 100 0`;
  return (
    <svg className="pointer-events-none absolute -left-[99px] top-0 h-full w-[100px] stroke-none" style={{ fill: "#292929" }}>
      <motion.path
        initial={{ d: initial }}
        animate={{ d: target, transition: { duration: 1, ease } }}
        exit={{ d: initial, transition: { duration: 0.8, ease } }}
      />
    </svg>
  );
}

function SideMenu({ onNavigate }: { onNavigate: () => void }) {
  const [active, setActive] = useState("#home");
  return (
    <motion.div
      initial={{ x: "calc(100% + 100px)" }}
      animate={{ x: 0, transition: { duration: 0.8, ease } }}
      exit={{ x: "calc(100% + 100px)", transition: { duration: 0.8, ease } }}
      className="fixed right-0 top-0 z-[3] h-screen w-full bg-[#292929] text-white sm:w-[480px]"
    >
      <div className="box-border flex h-full flex-col justify-between p-10 sm:p-[100px]">
        <div className="mt-20 flex flex-col gap-3 text-[44px] sm:text-[56px]">
          <div className="mb-10 border-b border-[#999999] pb-4 text-[11px] uppercase text-[#999999]">Navigation</div>
          {site.nav.map((item, i) => (
            <motion.div
              key={item.href}
              className="relative flex items-center"
              onMouseEnter={() => setActive(item.href)}
              initial={{ x: 80 }}
              animate={{ x: 0, transition: { duration: 0.8, ease, delay: 0.05 * i } }}
              exit={{ x: 80, transition: { duration: 0.8, ease, delay: 0.05 * i } }}
            >
              <motion.span
                className="absolute -left-[30px] h-2.5 w-2.5 rounded-full bg-white"
                animate={{ scale: active === item.href ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <a href={item.href} onClick={onNavigate} className="font-light">
                {item.title}
              </a>
            </motion.div>
          ))}
        </div>
        <div className="flex w-full justify-start gap-6 text-[12px]">
          {site.socials.map((s) => (
            <a key={s.title} href={s.href}>
              {s.title}
            </a>
          ))}
        </div>
      </div>
      <Curve />
    </motion.div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!scrolled) setOpen(false);
  }, [scrolled]);

  return (
    <>
      <header className="absolute top-0 z-[2] box-border flex w-full items-center justify-between p-[35px] font-light text-white">
        <a href="#home" className="group flex cursor-pointer whitespace-nowrap" aria-label={fullNames}>
          <span className="m-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:rotate-[360deg]">©</span>
          <span className="ml-[5px]">{site.brand}</span>
          <span className="ml-[0.3em] inline-grid h-[1.5em] overflow-hidden">
            <span className="col-start-1 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
              {site.brandShort}
            </span>
            <span className="col-start-1 row-start-1 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
              {site.brandFull}
            </span>
          </span>
        </a>
        <nav className="hidden items-center sm:flex">
          {site.nav.slice(1).map((item) => (
            <Magnetic key={item.href}>
              <a href={item.href} className="studio-navlink relative flex cursor-pointer flex-col p-[15px]">
                {item.title}
                <span className="studio-navdot" />
              </a>
            </Magnetic>
          ))}
        </nav>
        <button className="sm:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          Menu
        </button>
      </header>

      <motion.div
        initial={false}
        animate={{ scale: scrolled || open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed right-0 z-[4] m-5"
      >
        <Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="studio-rounded group relative flex h-[80px] w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#1C1D20]"
          >
            <span className={`studio-burger ${open ? "is-open" : ""}`} />
            <span className="studio-rounded-fill" style={{ background: "#455CE9" }} aria-hidden />
          </button>
        </Magnetic>
      </motion.div>

      <AnimatePresence mode="wait">{open && <SideMenu onNavigate={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
