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
                style={{ top: "40%", left: "50%", marginLeft: -45 }}
                animate={isOpening ? { scale: 0, opacity: 0, rotate: 15 } : { scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.28, ease: [0.76, 0, 0.24, 1] }}
                whileHover={!isOpening ? { scale: 1.08 } : {}}
              >
                {/* Seal outer glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: -8,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,32,96,0.2) 0%, transparent 70%)",
                    filter: "blur(6px)",
                    animation: "pulse 2.5s ease-in-out infinite",
                  }}
                />
                {/* Main seal circle */}
                <div
                  className="relative flex items-center justify-center overflow-hidden"
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 38% 30%, #ED6E9A, #C92060 52%, #8D1340)",
                    boxShadow:
                      "0 0 0 2px #9E1748, 0 0 0 5px rgba(158,23,72,0.3), 0 10px 32px rgba(201,32,96,0.55), inset 0 -5px 14px rgba(0,0,0,0.28), inset 0 3px 8px rgba(255,255,255,0.2)",
                  }}
                >
                  {/* Artistic calligraphy SVG composition */}
                  <svg
                    viewBox="0 0 96 96"
                    width="96"
                    height="96"
                    style={{ position: "absolute", inset: 0 }}
                    aria-label="ح ي"
                  >
                    {/* Inner decorative ring */}
                    <circle cx="48" cy="48" r="43" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

                    {/* Top ornament — delicate crown flourish */}
                    <g transform="translate(48, 12)" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" strokeLinecap="round">
                      <line x1="0" y1="0" x2="-10" y2="0" />
                      <line x1="0" y1="0" x2="10" y2="0" />
                      <path d="M-10,0 Q-8,-4 -5,-3 Q-3,-2 0,-4 Q3,-2 5,-3 Q8,-4 10,0" />
                      <circle cx="0" cy="-5.5" r="0.8" fill="rgba(255,255,255,0.55)" stroke="none" />
                    </g>

                    {/* Bottom ornament — mirrored */}
                    <g transform="translate(48, 84)" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" strokeLinecap="round">
                      <line x1="0" y1="0" x2="-10" y2="0" />
                      <line x1="0" y1="0" x2="10" y2="0" />
                      <path d="M-10,0 Q-8,4 -5,3 Q-3,2 0,4 Q3,2 5,3 Q8,4 10,0" />
                      <circle cx="0" cy="5.5" r="0.8" fill="rgba(255,255,255,0.55)" stroke="none" />
                    </g>

                    {/* Thin dividing line between letters */}
                    <line x1="48" y1="20" x2="48" y2="76" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />

                    {/* Diamond accent center */}
                    <g transform="translate(48,52)">
                      <rect x="-2.5" y="-2.5" width="5" height="5" transform="rotate(45)" fill="rgba(255,255,255,0.45)" />
                    </g>
                  </svg>

                  {/* Amiri Arabic calligraphy letters — ح first (left), ي second (right) */}
                  <div
                    dir="ltr"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0,
                      direction: "ltr",
                      unicodeBidi: "isolate",
                    }}
                  >
                    {/* ح — left position, slightly higher */}
                    <span
                      style={{
                        fontFamily: "'Amiri', serif",
                        fontSize: 38,
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "white",
                        lineHeight: 1,
                        textShadow: "0 2px 8px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.2)",
                        transform: "translateY(-3px) rotate(-5deg)",
                        display: "inline-block",
                      }}
                    >
                      ح
                    </span>
                    {/* Small decorative diamond between letters */}
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        background: "rgba(255,255,255,0.5)",
                        transform: "rotate(45deg) translateY(1px)",
                        margin: "0 5px",
                        flexShrink: 0,
                      }}
                    />
                    {/* ي — right position, slightly lower */}
                    <span
                      style={{
                        fontFamily: "'Amiri', serif",
                        fontSize: 38,
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "white",
                        lineHeight: 1,
                        textShadow: "0 2px 8px rgba(0,0,0,0.35), 0 0 18px rgba(255,255,255,0.2)",
                        transform: "translateY(3px) rotate(4deg)",
                        display: "inline-block",
                      }}
                    >
                      ي
                    </span>
                  </div>
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
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
