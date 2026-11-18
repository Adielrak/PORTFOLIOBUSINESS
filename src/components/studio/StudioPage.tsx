"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Preloader } from "./Preloader";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Description } from "./Description";
import { Projects } from "./Projects";
import { SlidingImages } from "./SlidingImages";
import { Contact } from "./Contact";

export function StudioPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ anchors: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.scrollTo(0, 0);
    lenis.stop();
    document.body.style.cursor = "wait";
    const t = setTimeout(() => {
      setLoading(false);
      lenis.start();
      document.body.style.cursor = "";
    }, 2000);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <main className="studio-root">
      <AnimatePresence mode="wait">{loading && <Preloader />}</AnimatePresence>
      <Header />
      <Hero />
      <Description />
      <Projects />
      <SlidingImages />
      <Contact />
    </main>
  );
}
