import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type Phase = "idle" | "opening" | "done";

function makeSealPath(cx: number, cy: number, outerR: number, innerR: number, bumps: number): string {
  const pts: [number, number][] = [];
  const total = bumps * 2;

  for (let i = 0; i < total; i++) {
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  return `${d} Z`;
}

const SEAL_PATH = makeSealPath(65, 65, 58, 51, 9);

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const isOpening = phase !== "idle";
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { damping: 26, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { damping: 26, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const open = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, shouldReduceMotion ? 650 : 3300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    open();
  };

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-scene"
          role="button"
          tabIndex={0}
          aria-label="Open Hussam and Yara's wedding invitation"
          aria-disabled={isOpening}
          className="flex min-h-[calc(100dvh-3rem)] w-full flex-col items-center justify-center gap-5 py-6 md:gap-8 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-8 focus-visible:ring-offset-background"
          onClick={open}
          onKeyDown={handleKeyDown}
          exit={{ opacity: 0, scale: 0.96, y: 70, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.p
            className="font-script leading-none"
            initial={{ opacity: 0, y: -16 }}
            animate={isOpening ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.25 : 0.8, delay: isOpening ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              color: "hsl(340 78% 42%)",
              fontSize: "clamp(2.9rem, 9vw, 5.35rem)",
              textShadow: "0 1px 0 rgba(255,255,255,0.55)",
            }}
          >
            Open Me
          </motion.p>

          <motion.div
            className="relative w-full max-w-[860px]"
            style={{ perspective: 1800, rotateX, rotateY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
          >
            <motion.div
              className="absolute left-[8%] right-[8%] top-[9%] z-[2] flex h-[78%] flex-col items-center justify-center overflow-hidden rounded-[3px]"
              style={{
                background:
                  "repeating-linear-gradient(94deg, rgba(112,86,55,0.025) 0 1px, transparent 1px 8px), linear-gradient(170deg, #fffaf0 0%, #f5ead5 100%)",
                border: "1px solid rgba(137,112,74,0.18)",
                boxShadow: "0 24px 60px rgba(64,50,34,0.12)",
              }}
              animate={
                isOpening
                  ? shouldReduceMotion
                    ? { y: "-76%", opacity: 1 }
                    : { y: ["0%", "-8%", "-58%", "-76%"], opacity: [0, 0.55, 1, 1], scale: [0.985, 0.995, 1, 1] }
                  : { y: "0%", opacity: 0, scale: 0.985 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.35, delay: 0.15 }
                  : { duration: 1.28, delay: 1.34, times: [0, 0.18, 0.72, 1], ease: [0.2, 0.74, 0.22, 1] }
              }
            >
              <p className="font-sans uppercase tracking-[0.34em]" style={{ fontSize: "0.55rem", color: "hsl(332 35% 36% / 0.78)" }}>
                with love
              </p>
              <p className="font-script mt-3 leading-none" style={{ color: "hsl(var(--primary))", fontSize: "clamp(2rem, 5vw, 3.3rem)" }}>
                Hussam &amp; Yara
              </p>
            </motion.div>

            <motion.div
              className="relative z-10 mx-auto aspect-[1.5/1] w-[min(86vw,864px)] overflow-visible"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={
                isOpening && !shouldReduceMotion
                  ? { opacity: 1, scale: [1, 0.996, 1.01, 0.98], y: [0, 8, 2, 26], rotateX: [0, -1.2, 0.8, 0] }
                  : { opacity: 1, scale: 1, y: 0, rotateX: 0 }
              }
              transition={
                isOpening && !shouldReduceMotion
                  ? { duration: 2.8, times: [0, 0.22, 0.58, 1], ease: [0.22, 1, 0.36, 1] }
                  : { duration: shouldReduceMotion ? 0.25 : 1, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <motion.div
                className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
                animate={isOpening ? { opacity: [1, 1, 0] } : { opacity: 1 }}
                transition={shouldReduceMotion ? { duration: 0.18 } : { duration: 0.62, delay: 0.1, times: [0, 0.32, 1] }}
                aria-hidden="true"
                style={{
                  WebkitMaskImage: "radial-gradient(circle at 50% 55%, transparent 0 16%, black 17%)",
                  maskImage: "radial-gradient(circle at 50% 55%, transparent 0 16%, black 17%)",
                }}
              >
                <img
                  src="/envelope-reference.jpeg"
                  alt=""
                  className="absolute h-auto max-w-none select-none"
                  draggable={false}
                  style={{
                    width: "125%",
                    left: "-12.5%",
                    top: "-86.25%",
                  }}
                />
              </motion.div>

              <div
                className="absolute inset-0"
                style={{
                  filter: "drop-shadow(0 28px 44px rgba(52,42,30,0.18)) drop-shadow(0 8px 18px rgba(52,42,30,0.09))",
                }}
              >
                <svg viewBox="0 0 920 610" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="paper-grain">
                      <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="7" />
                      <feColorMatrix type="saturate" values="0" />
                      <feComponentTransfer>
                        <feFuncA type="table" tableValues="0 0.08" />
                      </feComponentTransfer>
                    </filter>
                    <linearGradient id="paper-base" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#DCD8C4" />
                      <stop offset="55%" stopColor="#D2CCB5" />
                      <stop offset="100%" stopColor="#BEB79E" />
                    </linearGradient>
                    <linearGradient id="panel-left" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#DED9C5" />
                      <stop offset="100%" stopColor="#C7C0A6" />
                    </linearGradient>
                    <linearGradient id="panel-right" x1="1" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#D6D0BA" />
                      <stop offset="100%" stopColor="#B8B098" />
                    </linearGradient>
                    <filter id="fold-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="7" />
                    </filter>
                    <linearGradient id="right-cavity" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="rgba(30,27,22,0)" />
                      <stop offset="100%" stopColor="rgba(30,27,22,0.32)" />
                    </linearGradient>
                  </defs>

                  <rect width="920" height="610" rx="1" fill="url(#paper-base)" />
                  <rect width="920" height="610" rx="1" filter="url(#paper-grain)" opacity="0.7" />

                  <path d="M0 125 L460 355 L0 610 Z" fill="url(#panel-left)" />
                  <path d="M920 125 L460 355 L920 610 Z" fill="url(#panel-right)" />
                  <path d="M0 610 L460 355 L920 610 Z" fill="#C6BEA3" opacity="0.72" />
                  <path d="M462 352 L920 125 L920 610 Z" fill="url(#right-cavity)" opacity="0.55" />

                  <path d="M0 610 L460 355 L920 610" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="3" />
                  <path d="M0 125 L460 355 L920 125" fill="none" stroke="rgba(49,43,34,0.24)" strokeWidth="4" filter="url(#fold-shadow)" />
                  <path d="M0 125 L460 355 L920 125" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
                </svg>
              </div>

              <motion.div
                className="pointer-events-none absolute left-[5%] right-[5%] top-[33%] z-[19] h-[18%]"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(35,27,18,0.3) 0%, rgba(77,62,39,0.16) 38%, rgba(77,62,39,0) 72%)",
                  filter: "blur(8px)",
                  transformOrigin: "50% 0%",
                }}
                animate={
                  isOpening && !shouldReduceMotion
                    ? { opacity: [0, 0.2, 0.5, 0.18, 0], scaleY: [0.2, 0.7, 1.05, 0.65, 0.25], y: [0, 2, 5, 1, -4] }
                    : { opacity: 0, scaleY: 0.2, y: 0 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : { duration: 1.45, delay: 0.48, times: [0, 0.18, 0.48, 0.76, 1], ease: [0.2, 0.74, 0.26, 1] }
                }
              />

              <motion.div
                className="absolute left-0 right-0 top-0 z-20 h-[58%]"
                style={{
                  transformOrigin: "50% 0%",
                  transformStyle: "preserve-3d",
                  filter: "drop-shadow(0 26px 22px rgba(42,35,25,0.23))",
                }}
                animate={
                  isOpening
                    ? shouldReduceMotion
                      ? { rotateX: -172, y: -4, zIndex: 1, filter: "drop-shadow(0 8px 12px rgba(42,35,25,0.14))" }
                      : {
                          rotateX: [0, -7, -18, -104, -166, -178],
                          y: [0, 1, 3, -8, -8, -3],
                          scaleY: [1, 0.99, 1.01, 1, 0.995, 1],
                          zIndex: [20, 20, 20, 8, 1, 1],
                          filter: [
                            "drop-shadow(0 26px 22px rgba(42,35,25,0.23))",
                            "drop-shadow(0 28px 24px rgba(42,35,25,0.25))",
                            "drop-shadow(0 34px 26px rgba(42,35,25,0.28))",
                            "drop-shadow(0 16px 20px rgba(42,35,25,0.18))",
                            "drop-shadow(0 8px 12px rgba(42,35,25,0.14))",
                            "drop-shadow(0 6px 9px rgba(42,35,25,0.1))",
                          ],
                        }
                    : { rotateX: 0, y: 0, scaleY: 1, zIndex: 20, filter: "drop-shadow(0 26px 22px rgba(42,35,25,0.23))" }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.35, delay: 0.08 }
                    : { duration: 1.36, delay: 0.52, times: [0, 0.12, 0.26, 0.62, 0.86, 1], ease: [0.18, 0.82, 0.24, 1] }
                }
              >
                <svg viewBox="0 0 920 360" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <filter id="top-grain">
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="13" />
                      <feColorMatrix type="saturate" values="0" />
                      <feComponentTransfer>
                        <feFuncA type="table" tableValues="0 0.07" />
                      </feComponentTransfer>
                    </filter>
                    <linearGradient id="top-paper" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#E5E0CC" />
                      <stop offset="62%" stopColor="#D8D1B9" />
                      <stop offset="100%" stopColor="#C7BEA3" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 0 H920 V116 C920 156 897 181 856 205 L460 352 L64 205 C23 181 0 156 0 116 Z"
                    fill="url(#top-paper)"
                  />
                  <path
                    d="M0 0 H920 V116 C920 156 897 181 856 205 L460 352 L64 205 C23 181 0 156 0 116 Z"
                    filter="url(#top-grain)"
                  />
                  <path d="M64 205 L460 352 L856 205" fill="none" stroke="rgba(45,39,31,0.18)" strokeWidth="4" />
                  <path d="M64 205 L460 352 L856 205" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.5" />
                </svg>
              </motion.div>

              <div
                className="pointer-events-none absolute left-1/2 top-[48.4%] z-[49] h-[17%] w-[34%] -translate-x-1/2 rounded-full"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(216,211,190,1) 0%, rgba(216,211,190,0.98) 62%, rgba(216,211,190,0) 80%)",
                  filter: "blur(4px)",
                }}
              />

              <motion.div
                className="absolute left-1/2 top-[54.2%] z-50 size-[clamp(92px,21vw,132px)] overflow-visible"
                animate={
                  isOpening
                    ? shouldReduceMotion
                      ? { x: "-50%", y: "-50%", scale: 0, opacity: 0, rotate: 10 }
                      : {
                          scale: [1, 1.06, 0.98, 0.72, 0.42],
                          opacity: [1, 1, 0.96, 0.62, 0],
                          rotate: [0, -3, 5, 12, 20],
                          x: ["-50%", "-50%", "-50%", "-43%", "-38%"],
                          y: ["-50%", "-51%", "-47%", "-30%", "-12%"],
                        }
                    : { scale: 1, opacity: 1, rotate: 0, x: "-50%", y: "-50%" }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : { duration: 0.78, times: [0, 0.24, 0.48, 0.76, 1], ease: [0.2, 0.84, 0.3, 1] }
                }
                whileHover={!isOpening ? { scale: 1.05 } : undefined}
              >
                <div
                  className="absolute left-1/2 top-1/2 h-[112%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  aria-hidden="true"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(218,213,192,0.98) 0%, rgba(211,205,184,0.98) 58%, rgba(198,190,164,0.84) 100%)",
                    filter: "blur(2px)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-[26%] h-[42%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  aria-hidden="true"
                  style={{
                    background: "rgba(216,211,190,0.98)",
                    filter: "blur(4px)",
                  }}
                />
                <svg viewBox="0 0 130 130" className="absolute inset-0 h-full w-full overflow-visible" aria-label="Pink wax seal with embossed Arabic initials">
                  <defs>
                    <filter id="wax-shadow" x="-35%" y="-35%" width="170%" height="170%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="blur" />
                      <feOffset in="blur" dy="7" result="offset" />
                      <feFlood floodColor="#8F3D56" floodOpacity="0.34" result="shadow" />
                      <feComposite in="shadow" in2="offset" operator="in" result="drop" />
                      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="innerBlur" />
                      <feOffset in="innerBlur" dy="-1" result="innerOffset" />
                      <feFlood floodColor="#ffd7e2" floodOpacity="0.32" result="innerLight" />
                      <feComposite in="innerLight" in2="innerOffset" operator="in" result="topLight" />
                      <feMerge>
                        <feMergeNode in="drop" />
                        <feMergeNode in="topLight" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="wax-fill" cx="30%" cy="20%" r="84%">
                      <stop offset="0%" stopColor="#F4AAB6" />
                      <stop offset="36%" stopColor="#DF7487" />
                      <stop offset="74%" stopColor="#C64D65" />
                      <stop offset="100%" stopColor="#9B344A" />
                    </radialGradient>
                    <radialGradient id="wax-gloss" cx="28%" cy="16%" r="55%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.64)" />
                      <stop offset="58%" stopColor="rgba(255,255,255,0.14)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                  </defs>
                  <path d={SEAL_PATH} fill="url(#wax-fill)" filter="url(#wax-shadow)" />
                  <path d={SEAL_PATH} fill="url(#wax-gloss)" />
                  <circle cx="65" cy="65" r="45" fill="none" stroke="rgba(255,190,204,0.58)" strokeWidth="4.2" />
                  <circle cx="65" cy="65" r="38" fill="none" stroke="rgba(106,26,43,0.22)" strokeWidth="1.8" />
                </svg>
                <div
                  className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
                  style={{
                    filter: "drop-shadow(0 1px 1px rgba(111,24,43,0.42))",
                  }}
                >
                  <img
                    src="/yara-letter-white.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 object-cover"
                    draggable={false}
                    style={{
                      filter: "drop-shadow(0 -1px 0 rgba(255,244,247,0.56)) drop-shadow(0 1px 1px rgba(115,28,47,0.34))",
                      mixBlendMode: "screen",
                      opacity: 0.86,
                      objectPosition: "50% 52%",
                    }}
                  />
                  <img
                    src="/yara-letter-white.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-[55%] object-cover"
                    draggable={false}
                    style={{
                      mixBlendMode: "normal",
                      opacity: 0.5,
                      objectPosition: "50% 52%",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.p
            className="font-sans uppercase"
            style={{ color: "hsl(332 35% 36% / 0.74)", fontSize: "0.58rem", letterSpacing: "0.34em" }}
            animate={isOpening ? { opacity: 0, y: -8 } : { opacity: [0.35, 0.7, 0.35], y: [0, 3, 0] }}
            transition={isOpening ? { duration: shouldReduceMotion ? 0.15 : 0.25 } : { repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >
            tap to reveal
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
