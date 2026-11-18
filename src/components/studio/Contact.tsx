"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RoundedButton } from "./RoundedButton";
import { fullNames, people, site } from "./content";

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    if (!timeZone) return;
    const fmt = () => {
      const t = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", timeZoneName: "short" });
      setTime(t.format(new Date()));
    };
    fmt();
    const id = setInterval(fmt, 1000 * 30);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);
  const time = useLocalTime(site.timezone);

  return (
    <motion.footer id="contact" ref={container} style={{ y }} className="flex flex-col items-center justify-center bg-[#141516] text-white">
      <div className="w-full max-w-[1800px] bg-[#141516] pt-[200px]">
        <div className="relative mx-[6vw] border-b border-[rgb(134,134,134)] pb-[100px] md:mx-[200px]">
          <span className="flex items-center">
            <span className="flex">
              {people.map((p, i) => (
                <span
                  key={p.initials}
                  title={`${p.firstName} ${p.lastName}`}
                  className={`flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-full border-2 border-[#141516] text-[20px] text-[#1C1D20] md:h-[100px] md:w-[100px] ${i > 0 ? "-ml-[22px] bg-[#C9CCCD]" : "bg-[#999D9E]"}`}
                >
                  {p.initials}
                </span>
              ))}
            </span>
            <h2 className="m-0 ml-[0.3em] text-[clamp(44px,5vw,96px)] font-light">Let&apos;s work</h2>
          </span>
          <h2 className="m-0 text-[clamp(44px,5vw,96px)] font-light">together</h2>

          {site.email && (
            <motion.div style={{ x }} className="absolute left-[calc(100%-200px)] top-[calc(100%-75px)] md:left-[calc(100%-400px)]">
              <RoundedButton href={`mailto:${site.email}`} fill="#334BD3" className="h-[150px] w-[150px] bg-[#455CE9] text-white md:h-[180px] md:w-[180px]">
                <span className="text-[16px] font-light">Get in touch</span>
              </RoundedButton>
            </motion.div>
          )}

          <motion.svg
            style={{ rotate, scale: 2 }}
            className="absolute left-full top-[30%]"
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
          >
            <path d="M8 8.5c.27 0 .5-.22.5-.5V1.5a.5.5 0 0 0-1 0v6h-6a.5.5 0 0 0 0 1H8ZM.65 1.35l7 7 .7-.7-7-7-.7.7Z" fill="white" />
          </motion.svg>
        </div>

        {(site.email || site.phone) && (
          <div className="mx-[6vw] mt-[100px] flex flex-wrap gap-5 md:mx-[200px]">
            {site.email && (
              <RoundedButton href={`mailto:${site.email}`} className="border border-[rgb(136,136,136)] px-[30px] py-[20px] md:px-[60px] md:py-[25px]">
                <span>{site.email}</span>
              </RoundedButton>
            )}
            {site.phone && (
              <RoundedButton href={`tel:${site.phone.replace(/\s/g, "")}`} className="border border-[rgb(136,136,136)] px-[30px] py-[20px] md:px-[60px] md:py-[25px]">
                <span>{site.phone}</span>
              </RoundedButton>
            )}
          </div>
        )}

        <div className="mt-[200px] flex flex-col justify-between gap-8 p-5 md:flex-row">
          <div className="flex items-end gap-[10px]">
            <span className="flex flex-col gap-[15px]">
              <h3 className="m-0 cursor-default text-[11px] font-light uppercase text-[#999]">Version</h3>
              <p className="m-0">{new Date().getFullYear()} © Edition</p>
            </span>
            {site.timezone && (
              <span className="ml-8 flex flex-col gap-[15px]">
                <h3 className="m-0 cursor-default text-[11px] font-light uppercase text-[#999]">Local time</h3>
                <p className="m-0" suppressHydrationWarning>
                  {time}
                </p>
              </span>
            )}
            <span className="ml-8 flex flex-col gap-[15px]">
              <h3 className="m-0 cursor-default text-[11px] font-light uppercase text-[#999]">Made by</h3>
              <p className="m-0">{fullNames}</p>
            </span>
          </div>
          <div className={`items-end gap-[10px] ${site.socials.length ? "flex" : "hidden"}`}>
            <span className="flex flex-col gap-[15px]">
              <h3 className="m-0 cursor-default text-[11px] font-light uppercase text-[#999]">Socials</h3>
              <span className="flex gap-6">
                {site.socials.map((s) => (
                  <a key={s.title} href={s.href} className="studio-navlink relative">
                    {s.title}
                    <span className="studio-underline" />
                  </a>
                ))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
