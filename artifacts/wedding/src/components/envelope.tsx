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

              {/* ══════════════════════════════════════════════════
                  WAX SEAL — completely redesigned
                  Arabic RTL reading order: ح (Hussam) is FIRST
                  so it sits on the RIGHT. ي (Yara) is SECOND
                  so it sits on the LEFT.
                  Letters use fixed left/right CSS — bidi-proof.
                  ══════════════════════════════════════════════════ */}
              <motion.div
                className="absolute z-[30]"
                style={{ top: "40%", left: "50%", marginLeft: -70 }}
                animate={isOpening ? { scale: 0, opacity: 0, rotate: 20 } : { scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                whileHover={!isOpening ? { scale: 1.06 } : {}}
              >
                {/* Pulsing crimson outer glow */}
                <div style={{ position: "absolute", inset: -18, borderRadius: "50%", background: "radial-gradient(circle, rgba(160,15,50,0.4) 0%, transparent 65%)", filter: "blur(16px)", animation: "pulse 3s ease-in-out infinite" }} />

                {/* Spinning gold dashed ring outside the seal */}
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: "absolute", inset: 0, animation: "sealSpin 28s linear infinite" }} aria-hidden="true">
                  <circle cx="70" cy="70" r="67.5" fill="none" stroke="rgba(212,175,100,0.45)" strokeWidth="1" strokeDasharray="2 4" />
                </svg>

                {/* Seal body — relative container for absolute-positioned letters, clipped to circle */}
                <div style={{ position: "relative", width: 140, height: 140, borderRadius: "50%", overflow: "hidden" }}>

                  {/* ── ORNAMENTAL SVG (no letters) ─────────────── */}
                  <svg
                    width="140" height="140" viewBox="0 0 140 140"
                    style={{ position: "absolute", inset: 0, display: "block",
                      filter: "drop-shadow(0 12px 32px rgba(140,10,40,0.7)) drop-shadow(0 3px 10px rgba(0,0,0,0.55))" }}
                    aria-hidden="true"
                  >
                    <defs>
                      {/* Rich deep-wax radial gradient */}
                      <radialGradient id="waxBg" cx="30%" cy="20%" r="80%">
                        <stop offset="0%" stopColor="#E8607A" />
                        <stop offset="30%" stopColor="#AA1540" />
                        <stop offset="68%" stopColor="#6E0820" />
                        <stop offset="100%" stopColor="#3E0410" />
                      </radialGradient>
                      {/* Convex gloss at top-left — like light on a dome */}
                      <radialGradient id="waxGloss" cx="30%" cy="18%" r="42%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
                        <stop offset="60%" stopColor="rgba(255,255,255,0.06)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </radialGradient>
                      {/* Gold letter background bloom */}
                      <radialGradient id="goldBloom" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(212,175,100,0.18)" />
                        <stop offset="100%" stopColor="rgba(212,175,100,0)" />
                      </radialGradient>
                    </defs>

                    {/* Outer shadow ring */}
                    <circle cx="70" cy="70" r="67" fill="rgba(0,0,0,0.35)" />
                    {/* Main wax body */}
                    <circle cx="70" cy="70" r="65" fill="url(#waxBg)" />
                    {/* Convex gloss highlight */}
                    <circle cx="70" cy="70" r="65" fill="url(#waxGloss)" />
                    {/* Warm gold bloom behind letter zone */}
                    <circle cx="70" cy="70" r="50" fill="url(#goldBloom)" />

                    {/* ── Border ring system ── */}
                    {/* Outer dark emboss */}
                    <circle cx="70" cy="70" r="62.5" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                    {/* Bright inner edge of outer emboss */}
                    <circle cx="70" cy="70" r="61" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                    {/* Primary gold ring */}
                    <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(212,175,100,0.7)" strokeWidth="1.2" />
                    {/* Fine white inner ring */}
                    <circle cx="70" cy="70" r="55.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7" />
                    {/* Secondary gold ring — inner border */}
                    <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(212,175,100,0.35)" strokeWidth="0.8" />

                    {/* ── 8 gold diamond jewels on primary ring ── */}
                    {[0,45,90,135,180,225,270,315].map((deg) => {
                      const rad = deg * Math.PI / 180;
                      const x = 70 + 58 * Math.sin(rad);
                      const y = 70 - 58 * Math.cos(rad);
                      return (
                        <g key={deg} transform={`translate(${x},${y})`}>
                          <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="rgba(212,175,100,0.9)" />
                          <rect x="-1.5" y="-1.5" width="3" height="3" transform="rotate(45)" fill="rgba(255,240,200,0.85)" />
                        </g>
                      );
                    })}

                    {/* ── 16 dot accents on secondary inner ring ── */}
                    {Array.from({ length: 16 }, (_, i) => {
                      const rad = i * 22.5 * Math.PI / 180;
                      const x = 70 + 52 * Math.sin(rad);
                      const y = 70 - 52 * Math.cos(rad);
                      return <circle key={i} cx={x} cy={y} r="1.1" fill="rgba(212,175,100,0.45)" />;
                    })}

                    {/* ── Top ornament: elegant crown arch ── */}
                    <g transform="translate(70,13)" stroke="rgba(212,175,100,0.95)" strokeWidth="1.1" strokeLinecap="round" fill="none">
                      <line x1="-18" y1="0" x2="18" y2="0" />
                      <path d="M-18,0 Q-14,-5 -9,-3.5 Q-5,-2 0,-7 Q5,-2 9,-3.5 Q14,-5 18,0" />
                      <circle cx="0" cy="-10" r="1.8" fill="rgba(212,175,100,0.95)" stroke="none" />
                      <circle cx="-18" cy="0" r="1.4" fill="rgba(212,175,100,0.8)" stroke="none" />
                      <circle cx="18" cy="0" r="1.4" fill="rgba(212,175,100,0.8)" stroke="none" />
                      <line x1="-5" y1="-7" x2="5" y2="-7" stroke="rgba(212,175,100,0.5)" strokeWidth="0.6" />
                    </g>

                    {/* ── Bottom ornament: mirror of crown ── */}
                    <g transform="translate(70,127)" stroke="rgba(212,175,100,0.95)" strokeWidth="1.1" strokeLinecap="round" fill="none">
                      <line x1="-18" y1="0" x2="18" y2="0" />
                      <path d="M-18,0 Q-14,5 -9,3.5 Q-5,2 0,7 Q5,2 9,3.5 Q14,5 18,0" />
                      <circle cx="0" cy="10" r="1.8" fill="rgba(212,175,100,0.95)" stroke="none" />
                      <circle cx="-18" cy="0" r="1.4" fill="rgba(212,175,100,0.8)" stroke="none" />
                      <circle cx="18" cy="0" r="1.4" fill="rgba(212,175,100,0.8)" stroke="none" />
                    </g>

                    {/* ── Left ornament ── */}
                    <g transform="translate(11,70)" stroke="rgba(212,175,100,0.75)" strokeWidth="0.9" strokeLinecap="round" fill="none">
                      <path d="M0,-12 C-6,-8 -7,-1 -3,2 C-7,5 -6,11 0,13" />
                      <circle cx="-5.5" cy="1" r="1.2" fill="rgba(212,175,100,0.75)" stroke="none" />
                    </g>

                    {/* ── Right ornament ── */}
                    <g transform="translate(129,70)" stroke="rgba(212,175,100,0.75)" strokeWidth="0.9" strokeLinecap="round" fill="none">
                      <path d="M0,-12 C6,-8 7,-1 3,2 C7,5 6,11 0,13" />
                      <circle cx="5.5" cy="1" r="1.2" fill="rgba(212,175,100,0.75)" stroke="none" />
                    </g>

                    {/* ── Diagonal divider — follows the letter composition ── */}
                    <line x1="54" y1="28" x2="86" y2="112" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

                    {/* ── Center jewel ── */}
                    <g transform="translate(70,70)">
                      <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" fill="rgba(212,175,100,1)" />
                      <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="rgba(255,240,190,0.9)" />
                      <rect x="-1.3" y="-1.3" width="2.6" height="2.6" transform="rotate(45)" fill="rgba(255,255,255,1)" />
                    </g>
                  </svg>

                  {/* ══════════════════════════════════════════════
                      LETTERS — guaranteed bidi-safe via CSS right/left
                      Arabic RTL: ح (first) → RIGHT side
                                  ي (second) → LEFT side
                      Each letter is in its own half-width box with
                      text-align center. Single char = no reordering.
                      ══════════════════════════════════════════════ */}

                  {/* ي — Yara — LEFT half, upper zone */}
                  <span
                    aria-label="ي"
                    style={{
                      position: "absolute",
                      left: 0,
                      width: 74,
                      textAlign: "center",
                      top: 6,
                      fontFamily: "'Amiri', serif",
                      fontSize: 64,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "#FFF3E2",
                      lineHeight: 1,
                      display: "block",
                      transform: "rotate(8deg)",
                      transformOrigin: "50% 50%",
                      textShadow: "0 3px 14px rgba(0,0,0,0.7), 0 0 28px rgba(255,210,140,0.2)",
                      userSelect: "none",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    ي
                  </span>

                  {/* ح — Hussam — RIGHT half, lower zone */}
                  <span
                    aria-label="ح"
                    style={{
                      position: "absolute",
                      right: 0,
                      width: 74,
                      textAlign: "center",
                      top: 58,
                      fontFamily: "'Amiri', serif",
                      fontSize: 64,
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "#FFF3E2",
                      lineHeight: 1,
                      display: "block",
                      transform: "rotate(-8deg)",
                      transformOrigin: "50% 50%",
                      textShadow: "0 3px 14px rgba(0,0,0,0.7), 0 0 28px rgba(255,210,140,0.2)",
                      userSelect: "none",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    ح
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
