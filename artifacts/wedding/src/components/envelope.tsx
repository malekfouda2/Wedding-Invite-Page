import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

type Phase = "idle" | "opening" | "done";

// Catmull-Rom smooth scalloped path for wax seal edge
function makeSealPath(cx: number, cy: number, outerR: number, innerR: number, bumps: number): string {
  const pts: [number, number][] = [];
  const total = bumps * 2;
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

// 14 gentle bumps — matches the pearlescent scalloped wax seal in the references
const SEAL_PATH = makeSealPath(65, 65, 62, 55, 14);

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { damping: 25, stiffness: 180 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-9, 9]), { damping: 25, stiffness: 180 });

  const isOpening = phase === "opening" || phase === "done";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2400);
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-scene"
          className="flex flex-col items-center gap-10 cursor-pointer select-none"
          onClick={handleClick}
          exit={{ opacity: 0, y: 80, scale: 0.94, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* 3D tilt wrapper */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1400, perspectiveOrigin: "50% 80%", rotateX, rotateY }}
            className="relative"
          >
            {/* Letter card — peeks up during opening */}
            <motion.div
              className="absolute left-[8%] right-[8%] flex flex-col items-center justify-center gap-3 overflow-hidden"
              style={{
                top: "12%",
                bottom: 0,
                background: "linear-gradient(170deg, #FFFEF9, #FDF6E8)",
                border: "1px solid #EDE8DC",
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                zIndex: 5,
              }}
              animate={isOpening ? { y: "-65%", opacity: 1 } : { y: "0%", opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 px-4">
                <div className="h-px w-6" style={{ background: "hsl(var(--primary)/0.2)" }} />
                <span className="font-sans uppercase tracking-[0.3em] text-foreground/30" style={{ fontSize: "0.55rem" }}>
                  with love
                </span>
                <div className="h-px w-6" style={{ background: "hsl(var(--primary)/0.2)" }} />
              </div>
              <p
                className="font-script text-center leading-tight px-4"
                style={{ fontSize: "clamp(1.6rem, 5vw, 2.4rem)", color: "hsl(var(--primary))" }}
              >
                Hussam &amp; Yara
              </p>
              <p
                className="font-sans uppercase tracking-[0.25em] text-foreground/25"
                style={{ fontSize: "0.55rem" }}
              >
                11 June 2026
              </p>
            </motion.div>

            {/* ── ENVELOPE BODY ── */}
            <motion.div
              className="relative overflow-visible"
              style={{ width: "min(380px, 90vw)", aspectRatio: "1.65/1", zIndex: 10 }}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Base — cream linen */}
              <div
                className="absolute inset-0 rounded-[3px]"
                style={{
                  background: "#FAF7EF",
                  boxShadow: "0 24px 100px rgba(0,0,0,0.13), 0 6px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
                }}
              />

              {/* Side V-flaps */}
              <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 50% 53%, 0 100%)", background: "#EEE5D2" }} />
              <div className="absolute inset-0" style={{ clipPath: "polygon(100% 0, 50% 53%, 100% 100%)", background: "#E8DEC9" }} />
              {/* Bottom flap */}
              <div className="absolute inset-0" style={{ clipPath: "polygon(0 100%, 50% 53%, 100% 100%)", background: "#E0D5BF" }} />

              {/* Paper texture */}
              <div
                className="absolute inset-0 rounded-[3px] pointer-events-none"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.012) 24px, rgba(0,0,0,0.012) 25px)",
                }}
              />

              {/* Top flap — rotates back on open */}
              <motion.div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: "60%",
                  clipPath: "polygon(0 0, 100% 0, 50% 82%)",
                  background: "linear-gradient(165deg, #FFFDF9 0%, #F7EDD8 100%)",
                  transformOrigin: "50% 0%",
                  transformStyle: "preserve-3d",
                  zIndex: 20,
                  boxShadow: isOpening ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
                }}
                animate={isOpening ? { rotateX: -179 } : { rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* ── WAX SEAL ─────────────────────────────────── */}
              <motion.div
                className="absolute z-[30]"
                style={{ top: "38%", left: "50%", marginLeft: -65 }}
                animate={isOpening ? { scale: 0, opacity: 0, rotate: 15 } : { scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                whileHover={!isOpening ? { scale: 1.07 } : {}}
              >
                <svg
                  width="130" height="130" viewBox="0 0 130 130"
                  style={{ overflow: "visible", display: "block" }}
                  aria-label="Wax seal with Hussam and Yara's initials"
                >
                  <defs>
                    {/* Drop shadow — inside SVG so Safari renders it against the shape, not bounding box */}
                    <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b1"/>
                      <feOffset in="b1" dx="0" dy="7" result="o1"/>
                      <feFlood floodColor="#A04060" floodOpacity="0.38" result="c1"/>
                      <feComposite in="c1" in2="o1" operator="in" result="s1"/>
                      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b2"/>
                      <feOffset in="b2" dx="0" dy="2" result="o2"/>
                      <feFlood floodColor="#000000" floodOpacity="0.15" result="c2"/>
                      <feComposite in="c2" in2="o2" operator="in" result="s2"/>
                      <feMerge>
                        <feMergeNode in="s1"/>
                        <feMergeNode in="s2"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>

                    {/* Pearlescent blush gradient — light catches upper-left like real wax */}
                    <radialGradient id="waxBlush" cx="32%" cy="22%" r="78%">
                      <stop offset="0%"   stopColor="#F2C0D0"/>
                      <stop offset="35%"  stopColor="#D9789A"/>
                      <stop offset="75%"  stopColor="#C05878"/>
                      <stop offset="100%" stopColor="#A84060"/>
                    </radialGradient>

                    {/* Pearlescent sheen — broad gloss at upper-left */}
                    <radialGradient id="waxSheen" cx="28%" cy="18%" r="52%">
                      <stop offset="0%"   stopColor="rgba(255,255,255,0.55)"/>
                      <stop offset="55%"  stopColor="rgba(255,255,255,0.12)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </radialGradient>

                    {/* Clip calligraphy image to seal shape */}
                    <clipPath id="sealClip">
                      <path d={SEAL_PATH}/>
                    </clipPath>
                  </defs>

                  {/* Wax body with shadow */}
                  <g filter="url(#sealShadow)">
                    <path d={SEAL_PATH} fill="url(#waxBlush)"/>
                  </g>

                  {/* Pearlescent sheen overlay */}
                  <path d={SEAL_PATH} fill="url(#waxSheen)"/>

                  {/* Inner embossed ring — thin, like the references */}
                  <circle cx="65" cy="65" r="45" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5"/>
                  <circle cx="65" cy="65" r="43.5" fill="none" stroke="rgba(80,10,30,0.12)" strokeWidth="0.8"/>

                  {/* Calligraphy initials — white on black PNG, screen blend makes black transparent */}
                  <image
                    href="/initials-white.png"
                    x="22" y="7"
                    width="82" height="116"
                    clipPath="url(#sealClip)"
                    style={{ mixBlendMode: "screen" as const }}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </svg>
              </motion.div>
              {/* ──────────────────────────────────────────────── */}

            </motion.div>
          </motion.div>

          {/* "Open Me" prompt — script style matching the reference */}
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={isOpening ? { opacity: 0, y: -8 } : { opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ opacity: [0.35, 0.9, 0.35] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
            >
              <p
                className="font-script"
                style={{ fontSize: "clamp(1.4rem, 4.5vw, 1.9rem)", color: "hsl(var(--foreground)/0.5)" }}
              >
                Open Me
              </p>
              <div className="flex flex-col items-center" style={{ gap: 2 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 0.8, 0.2], y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.18, ease: "easeInOut" }}
                  >
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                      <path d="M1 1L6 6L11 1" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
