"use client";

import type { ReactNode } from "react";
import { Magnetic } from "./Magnetic";

type Props = {
  children: ReactNode;
  href?: string;
  className?: string;
  fill?: string;
  onClick?: () => void;
};

/** Pill/circle button with a magnetic pull and a fill that rises from below on hover. */
export function RoundedButton({ children, href, className = "", fill = "#455CE9", onClick }: Props) {
  const Tag = href ? "a" : "button";
  return (
    <Magnetic>
      <Tag
        href={href}
        onClick={onClick}
        className={`studio-rounded group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full ${className}`}
      >
        <span className="relative z-[1] transition-colors duration-300 group-hover:text-white">{children}</span>
        <span className="studio-rounded-fill" style={{ background: fill }} aria-hidden />
      </Tag>
    </Magnetic>
  );
}
