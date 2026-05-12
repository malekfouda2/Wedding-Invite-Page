import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";


type Phase = "idle" | "opening" | "done";

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");

  // 3D tilt on hover
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
            style={{ perspective: 1400, perspectiveOrigin: "50% 80%", rotateX, rotateY, transformStyle: "preserve-3d" }}
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
              animate={isOpening ? { y: "-65%", opacity: 1 } : { y: "0%", opacity: 0.75 }}
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

            {/* Envelope body */}
            <motion.div
              className="relative overflow-visible"
              style={{ width: "min(380px, 90vw)", aspectRatio: "1.65/1", zIndex: 10 }}
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Base */}
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

              {/* Paper texture lines */}
              <div
                className="absolute inset-0 rounded-[3px] pointer-events-none"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.015) 24px, rgba(0,0,0,0.015) 25px)",
                }}
              />

              {/* Top flap — rotates back */}
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

              {/* Wax seal — centered via left/marginLeft to avoid transform conflict */}
              <motion.div
                className="absolute z-[30]"
                style={{ top: "40%", left: "50%", marginLeft: -60 }}
                animate={isOpening ? { scale: 0, opacity: 0, rotate: 15 } : { scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1] }}
                whileHover={!isOpening ? { scale: 1.07 } : {}}
              >
                {/* Pulsing outer glow */}
                <div style={{ position: "absolute", inset: -14, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,32,96,0.3) 0%, transparent 65%)", filter: "blur(12px)", animation: "pulse 2.8s ease-in-out infinite" }} />

                {/* Seal wrapper — relative so letters can use absolute positioning */}
                <div style={{ position: "relative", width: 120, height: 120 }}>

                  {/* Slowly-spinning gold dashed outer ring */}
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", inset: 0, animation: "sealSpin 22s linear infinite" }} aria-hidden="true">
                    <circle cx="60" cy="60" r="57" fill="none" stroke="rgba(212,175,100,0.5)" strokeWidth="1" strokeDasharray="3 4.5" />
                  </svg>

                  {/* Main ornamental SVG — everything except the letters */}
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    style={{ position: "absolute", inset: 0, display: "block", filter: "drop-shadow(0 10px 28px rgba(201,32,96,0.65)) drop-shadow(0 2px 8px rgba(0,0,0,0.45))" }}
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id="sealBg" cx="36%" cy="26%" r="72%">
                        <stop offset="0%" stopColor="#F285B4" />
                        <stop offset="45%" stopColor="#C42060" />
                        <stop offset="100%" stopColor="#730A30" />
                      </radialGradient>
                      <radialGradient id="sealGloss" cx="38%" cy="22%" r="50%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </radialGradient>
                    </defs>

                    {/* Base crimson circle */}
                    <circle cx="60" cy="60" r="56" fill="url(#sealBg)" />
                    {/* Gloss highlight */}
                    <circle cx="60" cy="60" r="56" fill="url(#sealGloss)" />

                    {/* Concentric embossed rings */}
                    <circle cx="60" cy="60" r="53" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="51" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(212,175,100,0.4)" strokeWidth="0.9" />
                    <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

                    {/* 12 gold petal marks around the gold ring */}
                    {Array.from({ length: 12 }, (_, i) => {
                      const deg = i * 30;
                      const rad = (deg * Math.PI) / 180;
                      const r = 48;
                      const x = 60 + r * Math.sin(rad);
                      const y = 60 - r * Math.cos(rad);
                      return i % 3 === 0
                        ? <rect key={i} x={x - 2} y={y - 2} width="4" height="4" transform={`rotate(45 ${x} ${y})`} fill="rgba(212,175,100,0.85)" />
                        : <circle key={i} cx={x} cy={y} r="1" fill="rgba(212,175,100,0.5)" />;
                    })}

                    {/* Top crown — 3-peak arch */}
                    <g transform="translate(60,17)" stroke="rgba(212,175,100,0.9)" strokeWidth="1" strokeLinecap="round" fill="none">
                      <line x1="-15" y1="0" x2="15" y2="0" />
                      <path d="M-15,0 Q-12,-4 -8,-3 Q-5,-2 0,-6 Q5,-2 8,-3 Q12,-4 15,0" />
                      <circle cx="0" cy="-8.5" r="1.5" fill="rgba(212,175,100,0.9)" stroke="none" />
                      <circle cx="-15" cy="0" r="1.2" fill="rgba(212,175,100,0.7)" stroke="none" />
                      <circle cx="15" cy="0" r="1.2" fill="rgba(212,175,100,0.7)" stroke="none" />
                    </g>

                    {/* Bottom mirror crown */}
                    <g transform="translate(60,103)" stroke="rgba(212,175,100,0.9)" strokeWidth="1" strokeLinecap="round" fill="none">
                      <line x1="-15" y1="0" x2="15" y2="0" />
                      <path d="M-15,0 Q-12,4 -8,3 Q-5,2 0,6 Q5,2 8,3 Q12,4 15,0" />
                      <circle cx="0" cy="8.5" r="1.5" fill="rgba(212,175,100,0.9)" stroke="none" />
                      <circle cx="-15" cy="0" r="1.2" fill="rgba(212,175,100,0.7)" stroke="none" />
                      <circle cx="15" cy="0" r="1.2" fill="rgba(212,175,100,0.7)" stroke="none" />
                    </g>

                    {/* Left vine flourish */}
                    <g transform="translate(12,60)" stroke="rgba(212,175,100,0.7)" strokeWidth="0.9" strokeLinecap="round" fill="none">
                      <path d="M0,-10 C-5,-7 -6,-2 -3,1 C-6,4 -5,8 0,10" />
                      <circle cx="-5" cy="0" r="1" fill="rgba(212,175,100,0.7)" stroke="none" />
                    </g>

                    {/* Right vine flourish */}
                    <g transform="translate(108,60)" stroke="rgba(212,175,100,0.7)" strokeWidth="0.9" strokeLinecap="round" fill="none">
                      <path d="M0,-10 C5,-7 6,-2 3,1 C6,4 5,8 0,10" />
                      <circle cx="5" cy="0" r="1" fill="rgba(212,175,100,0.7)" stroke="none" />
                    </g>

                    {/* Vertical divider with tapered ends */}
                    <line x1="60" y1="26" x2="60" y2="94" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
                    <circle cx="60" cy="26" r="1.2" fill="rgba(212,175,100,0.6)" />
                    <circle cx="60" cy="94" r="1.2" fill="rgba(212,175,100,0.6)" />

                    {/* Center jewel — stacked diamonds */}
                    <g transform="translate(60,60)">
                      <rect x="-4.5" y="-4.5" width="9" height="9" transform="rotate(45)" fill="rgba(212,175,100,0.95)" />
                      <rect x="-2.8" y="-2.8" width="5.6" height="5.6" transform="rotate(45)" fill="rgba(255,240,190,0.85)" />
                      <rect x="-1.2" y="-1.2" width="2.4" height="2.4" transform="rotate(45)" fill="rgba(255,255,255,0.9)" />
                    </g>
                  </svg>

                  {/* ════════════════════════════════════════════
                      LETTERS — CSS absolute positioning so bidi
                      algorithm cannot touch them. ح is always
                      left (25% = 30px center). ي is always right
                      (75% = 90px center). No flex, no text flow.
                      ════════════════════════════════════════════ */}

                  {/* ح — Hussam — left half center */}
                  <span
                    aria-label="ح"
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "48%",
                      transform: "translate(-50%, -60%) rotate(-6deg)",
                      fontFamily: "'Amiri', serif",
                      fontSize: 46,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "white",
                      lineHeight: 1,
                      textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.18)",
                      userSelect: "none",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    ح
                  </span>

                  {/* ي — Yara — right half center */}
                  <span
                    aria-label="ي"
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "52%",
                      transform: "translate(-50%, -40%) rotate(5deg)",
                      fontFamily: "'Amiri', serif",
                      fontSize: 46,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "white",
                      lineHeight: 1,
                      textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.18)",
                      userSelect: "none",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    ي
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated prompt */}
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
              <p className="font-sans uppercase tracking-[0.38em] text-foreground/40" style={{ fontSize: "0.58rem" }}>
                tap to open
              </p>
              {/* Animated down arrows */}
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

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.1); }
            }
            @keyframes sealSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
