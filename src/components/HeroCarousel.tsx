"use client";

import React, { useEffect, useRef, useState } from "react";

const S = 160; // cube face size in px

// Floating code-like labels that parallax with mouse
const LABELS = [
  { text: "src / portfolio.tsx", x: 8, y: 20, depth: 0.4 },
  { text: "01 / build", x: 72, y: 8, depth: 0.7 },
  { text: "02 / ship", x: 80, y: 78, depth: 0.5 },
  { text: "03 / share", x: 5, y: 82, depth: 0.3 },
];

const DOTS = [
  [18, 22], [84, 16], [12, 72], [88, 65], [50, 90], [93, 40],
] as const;

export function HeroGeometry() {
  const [autoAngle, setAutoAngle] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const t0Ref = useRef<number | null>(null);

  // Slow auto-rotation along Y axis
  useEffect(() => {
    const tick = (ts: number) => {
      if (t0Ref.current === null) t0Ref.current = ts;
      setAutoAngle(((ts - t0Ref.current) * 0.016) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mouse-reactive tilt
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const half = S / 2;
  const rotX = 20 + mouse.y * -16;
  const rotY = autoAngle + mouse.x * 16;

  // Each face: [CSS transform, is front face]
  const faces: [string, boolean][] = [
    [`rotateY(0deg) translateZ(${half}px)`, true],
    [`rotateY(180deg) translateZ(${half}px)`, false],
    [`rotateY(90deg) translateZ(${half}px)`, false],
    [`rotateY(-90deg) translateZ(${half}px)`, false],
    [`rotateX(90deg) translateZ(${half}px)`, false],
    [`rotateX(-90deg) translateZ(${half}px)`, false],
  ];

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: 440 }}
    >
      {/* Corner bracket marks */}
      {(
        [
          { top: 28, left: 28, borderTop: "1px solid #1B2640", borderLeft: "1px solid #1B2640" },
          { top: 28, right: 28, borderTop: "1px solid #1B2640", borderRight: "1px solid #1B2640" },
          { bottom: 28, left: 28, borderBottom: "1px solid #1B2640", borderLeft: "1px solid #1B2640" },
          { bottom: 28, right: 28, borderBottom: "1px solid #1B2640", borderRight: "1px solid #1B2640" },
        ] as React.CSSProperties[]
      ).map((style, i) => (
        <div key={i} style={{ position: "absolute", width: 24, height: 24, ...style }} />
      ))}

      {/* Scattered depth dots (parallax at varying rates) */}
      {DOTS.map(([px, py], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${px}%`,
            top: `${py}%`,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#1B2640",
            transform: `translate(${mouse.x * (i - 2.5) * 5}px, ${mouse.y * (i - 2.5) * 5}px)`,
            transition: "transform 0.25s ease-out",
          }}
        />
      ))}

      {/* Floating monospace labels (parallax) */}
      {LABELS.map((label, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${label.x}%`,
            top: `${label.y}%`,
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#253558",
            whiteSpace: "nowrap",
            transform: `translate(${mouse.x * label.depth * 14}px, ${mouse.y * label.depth * 10}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          {label.text}
        </div>
      ))}

      {/* 3D wireframe cube */}
      <div style={{ perspective: 700 }}>
        <div
          style={{
            width: S,
            height: S,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {faces.map(([tr, isFront], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: S,
                height: S,
                transform: tr,
                border: `1px solid rgba(23, 104, 255, ${isFront ? 0.65 : 0.18})`,
                background: isFront
                  ? "rgba(23, 104, 255, 0.04)"
                  : "rgba(8, 12, 24, 0.2)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Version label */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 44,
          fontFamily: "monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#1B2640",
          transform: `translate(${mouse.x * 8}px, ${mouse.y * 5}px)`,
          transition: "transform 0.25s ease-out",
        }}
      >
        folio.ai / geometry.v2
      </div>
    </div>
  );
}

// Keep old name as alias so any other imports don't break
export { HeroGeometry as HeroCarousel };
