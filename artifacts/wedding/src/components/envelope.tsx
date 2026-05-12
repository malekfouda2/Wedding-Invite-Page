import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "opening" | "done";

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("opening");

    // After full animation, trigger the reveal
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2200);
  };

  const isOpening = phase === "opening" || phase === "done";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="envelope-scene"
          className="flex flex-col items-center gap-8 cursor-pointer select-none"
          onClick={handleClick}
          exit={{ opacity: 0, y: 60, scale: 0.96, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Envelope wrapper with 3D perspective */}
          <div className="relative" style={{ perspective: "1400px", perspectiveOrigin: "50% 80%" }}>
            {/* Letter card — sits behind envelope body, slides up */}
            <motion.div
              className="absolute left-[10%] right-[10%] bg-[#FFFDF9] rounded-sm shadow-lg z-[5] flex flex-col items-center justify-center gap-2 overflow-hidden border border-[#EDE8DC]"
              style={{ top: "14%", bottom: 0 }}
              animate={isOpening ? { y: "-62%", opacity: 1 } : { y: "0%", opacity: 0.7 }}
              transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-script text-[clamp(1.4rem,5vw,2.2rem)] text-primary/80 leading-tight">Hussam & Yara</p>
              <div className="flex items-center gap-3 px-4">
                <div className="h-px w-8 bg-primary/20" />
                <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-foreground/40">11 June 2026</span>
                <div className="h-px w-8 bg-primary/20" />
              </div>
            </motion.div>

            {/* Envelope body */}
            <motion.div
              className="relative overflow-visible z-[10]"
              style={{ width: "min(360px, 88vw)", aspectRatio: "1.6/1" }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Envelope base */}
              <div className="absolute inset-0 bg-[#FAF7EF] shadow-[0_20px_80px_rgba(0,0,0,0.12),0_4px_20px_rgba(0,0,0,0.06)] rounded-[2px]" />

              {/* Left V-flap */}
              <div
                className="absolute inset-0"
                style={{ clipPath: "polygon(0 0, 50% 52%, 0 100%)", background: "#F2EBD9" }}
              />
              {/* Right V-flap */}
              <div
                className="absolute inset-0"
                style={{ clipPath: "polygon(100% 0, 50% 52%, 100% 100%)", background: "#EDE5CF" }}
              />
              {/* Bottom V-flap */}
              <div
                className="absolute inset-0"
                style={{ clipPath: "polygon(0 100%, 50% 52%, 100% 100%)", background: "#E8E0CA" }}
              />

              {/* Top flap — animated open */}
              <motion.div
                className="absolute top-0 left-0 right-0 z-[20]"
                style={{
                  height: "60%",
                  clipPath: "polygon(0 0, 100% 0, 50% 80%)",
                  background: "linear-gradient(170deg, #FFFDF9 0%, #F5EDDA 100%)",
                  transformOrigin: "50% 0%",
                  transformStyle: "preserve-3d",
                }}
                animate={isOpening ? { rotateX: -178 } : { rotateX: 0 }}
                transition={{ duration: 0.85, delay: 0.18, ease: [0.76, 0, 0.24, 1] }}
              />

              {/* Wax seal */}
              <motion.div
                className="absolute z-[30] left-1/2 -translate-x-1/2"
                style={{ top: "42%" }}
                animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.22, ease: "easeIn" }}
              >
                {/* Outer ring */}
                <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 35% 30%, #E85C8A, #C92060 60%, #9E1748)",
                      boxShadow: "0 4px 20px rgba(201,32,96,0.45), inset 0 -2px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.15)",
                    }}
                  />
                  {/* Ridged border ring */}
                  <div
                    className="absolute inset-[3px] rounded-full border-2 border-white/15"
                    style={{ boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.06)" }}
                  />
                  {/* Arabic initials */}
                  <span
                    className="relative font-script text-white leading-none"
                    style={{ fontSize: 26, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                  >
                    ح ي
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Prompt text */}
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={isOpening ? { opacity: 0 } : { opacity: [0.4, 0.95, 0.4] }}
            transition={isOpening ? { duration: 0.2 } : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          >
            <div className="h-px w-12 bg-primary/30" />
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-foreground/45">
              click to open
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
