import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import Envelope from "@/components/envelope";
import RsvpForm from "@/components/rsvp-form";
import FloatingElements from "@/components/floating-elements";
import { useIsMobile } from "@/hooks/use-mobile";

// @ts-ignore
import floralFrame from "@assets/WhatsApp_Image_2026-05-10_at_12.05.16_(1)_1778550657210.jpeg";

const WEDDING_DATE = new Date("2026-06-11T18:00:00");

function getTimeLeft() {
  const now = Date.now();
  const dist = WEDDING_DATE.getTime() - now;
  if (dist < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(dist / 86400000),
    hours: Math.floor((dist % 86400000) / 3600000),
    minutes: Math.floor((dist % 3600000) / 60000),
    seconds: Math.floor((dist % 60000) / 1000),
  };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <div className="h-px flex-1 max-w-[72px]" style={{ background: "linear-gradient(to right, transparent, hsl(var(--primary)/0.35))" }} />
      <motion.span
        style={{ color: "hsl(var(--primary))", opacity: 0.45, fontSize: "0.5rem", letterSpacing: "0.2em" }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        ✦ ✦ ✦
      </motion.span>
      <div className="h-px flex-1 max-w-[72px]" style={{ background: "linear-gradient(to left, transparent, hsl(var(--primary)/0.35))" }} />
    </div>
  );
}

function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center px-3 md:px-8">
      <span
        className="font-serif font-light"
        style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)", color, lineHeight: 1, display: "block" }}
      >
        {str}
      </span>
      <div className="my-3 h-px w-8" style={{ background: color, opacity: 0.35 }} />
      <span className="font-sans uppercase tracking-[0.28em]" style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.5)" }}>
        {label}
      </span>
    </div>
  );
}

const SECTIONS = [
  { id: "invitation", label: "Invitation" },
  { id: "countdown", label: "Countdown" },
  { id: "timeline", label: "Timeline" },
  { id: "venue", label: "Venue" },
  { id: "dresscode", label: "Dress Code" },
  { id: "rsvp", label: "RSVP" },
];

const PALETTE = [
  { color: "#C91255", label: "Deep Rose" },
  { color: "#EE88B4", label: "Blush" },
  { color: "#D44A18", label: "Coral" },
  { color: "#E8A86A", label: "Peach" },
  { color: "#D9B820", label: "Gold" },
  { color: "#82A85A", label: "Sage" },
  { color: "#4E7230", label: "Olive" },
];

function BrushSwatch({ color, label, rotate = 0 }: { color: string; label: string; rotate?: number }) {
  return (
    <div className="flex flex-col items-center gap-2.5" style={{ transform: `rotate(${rotate}deg)` }}>
      <svg viewBox="0 0 96 40" width="86" height="36" style={{ filter: `drop-shadow(0 3px 8px ${color}55)` }}>
        <path
          d="M 5,18 C 14,6 36,3 56,7 C 74,10 88,7 93,14 C 88,26 72,33 54,30 C 34,33 13,29 5,22 Z"
          fill={color}
        />
        <path
          d="M 18,14 C 30,9 50,8 66,11 C 78,13 87,11 91,15 C 86,17 76,18 66,17 C 50,18 30,18 18,15 Z"
          fill="rgba(255,255,255,0.22)"
        />
        <path
          d="M 10,22 C 20,20 38,20 54,21 C 66,21 80,20 90,22 C 82,26 68,28 54,27 C 38,28 20,27 10,24 Z"
          fill="rgba(0,0,0,0.08)"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.52rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "hsl(22 18% 35%)",
          transform: `rotate(${-rotate}deg)`,
        }}
      >
        {label}
      </span>
    </div>
  );
}

const timelineEvents = [
  {
    time: "6:00 PM",
    title: "The Ceremony",
    description: "In a sacred moment, two hearts become one",
    color: "hsl(var(--primary))",
  },
  {
    time: "7:00 PM",
    title: "Celebration",
    description: "First dance, toasts, and joyful tears",
    color: "hsl(var(--secondary))",
  },
  {
    time: "9:00 PM",
    title: "The Feast",
    description: "A lavish spread, crafted with love",
    color: "hsl(var(--accent))",
  },
  {
    time: "Late Night",
    title: "Dance Forever",
    description: "Let the music move your soul",
    color: "hsl(var(--muted))",
  },
];

// Section nav dots
function SectionNav({ active }: { active: string }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 hidden md:flex">
      {SECTIONS.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            title={s.label}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            className="group flex items-center justify-end gap-2"
            data-testid={`nav-dot-${s.id}`}
          >
            <span
              className="font-sans uppercase tracking-[0.2em] text-foreground/0 group-hover:text-foreground/40 transition-all duration-300"
              style={{ fontSize: "0.5rem" }}
            >
              {s.label}
            </span>
            <motion.div
              className="rounded-full"
              animate={{
                width: isActive ? 20 : 6,
                height: isActive ? 6 : 6,
                background: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.2)",
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        );
      })}
    </div>
  );
}

// Parallax floral image — disabled on mobile to avoid scroll-listener jank
function ParallaxFloral({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  if (isMobile) {
    return (
      <div className={`absolute overflow-hidden pointer-events-none ${className}`} style={style}>
        <img src={floralFrame} alt="" aria-hidden style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div ref={ref} className={`absolute overflow-hidden pointer-events-none ${className}`} style={style}>
      <motion.img src={floralFrame} alt="" aria-hidden style={{ y, width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [activeSection, setActiveSection] = useState("invitation");

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!opened) return;
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(id);
      }, { threshold: 0.4 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [opened]);

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden" style={{ background: "hsl(var(--background))" }}>

      {/* ── FLOATING FLOWERS & HEARTS ───────────────────────────── */}
      <FloatingElements />

      {/* ── ENVELOPE SCENE ──────────────────────────────────────── */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="envelope"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "hsl(var(--background))" }}
            exit={{ opacity: 0, transition: { duration: 0.7 } }}
          >
            {/* Very faint floral backdrop */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: `url(${floralFrame})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.055 }}
            />

            {/* Ambient light orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.07) 0%, transparent 70%)" }} />
              <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--secondary)/0.06) 0%, transparent 70%)" }} />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
              <motion.div
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-sans uppercase tracking-[0.48em] text-foreground/25" style={{ fontSize: "0.56rem" }}>
                  a letter for you
                </p>
                <p className="font-script" style={{ fontSize: "clamp(2.4rem, 8vw, 3.6rem)", color: "hsl(var(--primary))", lineHeight: 1.05 }}>
                  Hussam &amp; Yara
                </p>
              </motion.div>

              <Envelope onOpen={() => setOpened(true)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <AnimatePresence>
        {opened && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 0.15 }}>

            {/* Section nav dots */}
            <SectionNav active={activeSection} />

            {/* ── SECTION 1: HERO INVITATION ──────────────────── */}
            <section id="invitation" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
              {/* Floral frame — the main hero image */}
              <img
                src={floralFrame}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                style={{ opacity: 0.9 }}
              />
              {/* Cream vignette to ensure text readability */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 62% 58% at 50% 50%, rgba(250,248,243,0.91) 28%, rgba(250,248,243,0.35) 65%, transparent 100%)" }}
              />

              {/* Invitation card */}
              <motion.div
                className="relative z-10 flex flex-col items-center text-center px-8 py-10 max-w-[600px] mx-auto"
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.p
                  className="font-sans uppercase tracking-[0.5em] text-foreground/35 mb-5"
                  style={{ fontSize: "0.58rem" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  with great joy &amp; love
                </motion.p>

                <motion.h1
                  className="font-script leading-none mb-3"
                  data-testid="text-couple-names"
                  style={{
                    fontSize: "clamp(4.2rem, 15vw, 8rem)",
                    color: "hsl(var(--primary))",
                    textShadow: "0 4px 32px rgba(201,35,96,0.14)",
                    lineHeight: 1,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.95 }}
                >
                  Hussam &amp; Yara
                </motion.h1>

                <Ornament />

                <motion.div
                  className="flex flex-col items-center gap-2 mt-2 mb-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: 1.2 }}
                >
                  <p className="font-serif italic text-foreground/55 leading-relaxed" style={{ fontSize: "clamp(1rem, 3.2vw, 1.22rem)" }}>
                    invite you to witness the moment
                  </p>
                  <p className="font-serif text-foreground/75 font-medium" style={{ fontSize: "clamp(1rem, 3.2vw, 1.2rem)" }}>
                    love becomes forever
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-[2px] py-5 px-10 flex flex-col items-center gap-2 mb-6"
                  style={{ border: "1px solid hsl(var(--primary)/0.18)", background: "hsl(var(--primary)/0.03)" }}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.35 }}
                >
                  <p className="font-serif font-semibold text-foreground/80" style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)" }}>
                    Thursday, 11 June 2026
                  </p>
                  <p className="font-sans uppercase tracking-[0.32em] text-foreground/30" style={{ fontSize: "0.56rem" }}>
                    6 o&apos;clock in the evening
                  </p>
                </motion.div>

                <motion.p
                  className="font-sans uppercase tracking-[0.38em] text-foreground/25"
                  style={{ fontSize: "0.52rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                >
                  ✦ &nbsp; summer elegance welcomed &nbsp; ✦
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                  className="mt-12 flex flex-col items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                      <path d="M1 1L11 12L21 1" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                    </svg>
                  </motion.div>
                  <p className="font-sans uppercase tracking-[0.35em] text-foreground/20" style={{ fontSize: "0.5rem" }}>scroll</p>
                </motion.div>
              </motion.div>
            </section>

            {/* ── SECTION 2: COUNTDOWN ────────────────────────── */}
            <section id="countdown" className="py-28 px-6 overflow-hidden relative" style={{ background: "linear-gradient(160deg, hsl(335 40% 10%) 0%, hsl(315 35% 13%) 100%)" }}>
              {/* Decorative glow orbs */}
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%)" }} />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--secondary)/0.09) 0%, transparent 70%)" }} />

              <FadeUp className="text-center mb-16">
                <p className="font-sans uppercase tracking-[0.4em] mb-4" style={{ fontSize: "0.58rem", color: "hsl(var(--primary))", opacity: 0.75 }}>
                  the moment we&apos;ve been dreaming of
                </p>
                <h2 className="font-script" style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)", color: "hsl(44 50% 91%)", lineHeight: 1 }}>
                  Counting Down
                </h2>
              </FadeUp>

              <div className="max-w-2xl mx-auto flex justify-center">
                {[
                  { value: timeLeft.days, label: "Days", color: "hsl(var(--primary))" },
                  { value: timeLeft.hours, label: "Hours", color: "hsl(var(--secondary))" },
                  { value: timeLeft.minutes, label: "Minutes", color: "hsl(var(--accent))" },
                  { value: timeLeft.seconds, label: "Seconds", color: "hsl(44 55% 85%)" },
                ].map((u, i) => (
                  <div key={i} className="flex-1" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <CountdownUnit value={u.value} label={u.label} color={u.color} />
                  </div>
                ))}
              </div>

              <FadeUp delay={0.22} className="text-center mt-16">
                <p className="font-serif italic" style={{ fontSize: "1.05rem", color: "hsl(44 40% 80%)", opacity: 0.45 }}>
                  Every second brings us closer to forever
                </p>
              </FadeUp>
            </section>

            {/* ── SECTION 3: TIMELINE ─────────────────────────── */}
            <section id="timeline" className="py-28 px-6 relative overflow-hidden" style={{ background: "hsl(44 45% 96%)" }}>
              <ParallaxFloral className="absolute -bottom-12 -right-12 w-56 opacity-[0.1]" style={{ transform: "rotate(180deg)" }} />
              <ParallaxFloral className="absolute -top-12 -left-12 w-44 opacity-[0.08]" style={{}} />

              <FadeUp className="text-center mb-20">
                <p className="font-sans uppercase tracking-[0.4em] mb-2" style={{ fontSize: "0.58rem", color: "hsl(var(--secondary))", opacity: 0.9 }}>
                  an evening to remember
                </p>
                <h2 className="font-script" style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)", color: "hsl(var(--foreground))", lineHeight: 1 }}>
                  The Day Unfolds
                </h2>
              </FadeUp>

              <div className="max-w-2xl mx-auto relative">
                {/* Center line */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.2) 12%, hsl(var(--primary)/0.2) 88%, transparent)" }}
                />

                {timelineEvents.map((event, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <FadeUp key={i} delay={i * 0.12}>
                      <motion.div
                        className="relative flex items-center mb-16 last:mb-0 group"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Left side */}
                        <div className={`flex-1 ${isLeft ? "text-right pr-10" : "pl-10 order-last"}`}>
                          {isLeft ? (
                            <p className="font-script leading-none transition-all duration-300 group-hover:opacity-100 opacity-85"
                              style={{ fontSize: "clamp(1.9rem, 6vw, 2.7rem)", color: event.color }}>
                              {event.time}
                            </p>
                          ) : (
                            <div>
                              <p className="font-serif font-semibold text-foreground/85 group-hover:text-foreground transition-colors duration-200" style={{ fontSize: "clamp(1rem, 3vw, 1.22rem)" }}>{event.title}</p>
                              <p className="font-sans text-foreground/40 mt-1 group-hover:text-foreground/60 transition-colors duration-200" style={{ fontSize: "0.74rem" }}>{event.description}</p>
                            </div>
                          )}
                        </div>

                        {/* Center dot */}
                        <div className="relative z-10 flex-shrink-0">
                          <motion.div
                            className="w-[18px] h-[18px] rounded-full"
                            style={{ background: event.color, boxShadow: `0 0 0 4px hsl(var(--background)), 0 0 0 6px ${event.color}33` }}
                            whileHover={{ scale: 1.5 }}
                            transition={{ duration: 0.25 }}
                          />
                        </div>

                        {/* Right side */}
                        <div className={`flex-1 ${isLeft ? "pl-10" : "text-right pr-10 order-first"}`}>
                          {isLeft ? (
                            <div>
                              <p className="font-serif font-semibold text-foreground/85 group-hover:text-foreground transition-colors duration-200" style={{ fontSize: "clamp(1rem, 3vw, 1.22rem)" }}>{event.title}</p>
                              <p className="font-sans text-foreground/40 mt-1 group-hover:text-foreground/60 transition-colors duration-200" style={{ fontSize: "0.74rem" }}>{event.description}</p>
                            </div>
                          ) : (
                            <p className="font-script leading-none transition-all duration-300 group-hover:opacity-100 opacity-85"
                              style={{ fontSize: "clamp(1.9rem, 6vw, 2.7rem)", color: event.color }}>
                              {event.time}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </FadeUp>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 4: VENUE ────────────────────────────── */}
            <section id="venue" className="py-28 px-6 relative" style={{ background: "linear-gradient(160deg, hsl(162 35% 9%) 0%, hsl(180 30% 12%) 100%)" }}>
              <div className="absolute top-0 right-1/3 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(162 60% 40% / 0.1) 0%, transparent 70%)" }} />

              <FadeUp className="text-center mb-12">
                <p className="font-sans uppercase tracking-[0.42em] mb-3" style={{ fontSize: "0.58rem", color: "hsl(var(--accent))", opacity: 0.85 }}>
                  where love finds its home
                </p>
                <h2 className="font-script" style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)", color: "hsl(44 50% 91%)", lineHeight: 1 }}>
                  The Venue
                </h2>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="max-w-lg mx-auto">
                  {/* Venue card */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      border: "1px solid rgba(212,175,100,0.18)",
                      borderRadius: 6,
                      background: "hsl(162 35% 6%)",
                    }}
                  >
                    {/* Top accent line */}
                    <div style={{ height: 2, background: "linear-gradient(90deg, transparent, hsl(var(--accent)/0.6), transparent)" }} />

                    {/* Corner ornaments */}
                    {[{top:"10px",left:"10px"},{top:"10px",right:"10px"},{bottom:"10px",left:"10px"},{bottom:"10px",right:"10px"}].map((pos, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 14 14" style={{ position:"absolute", ...pos, opacity: 0.35 }} aria-hidden="true">
                        <path d="M0,0 L14,0 M0,0 L0,14" stroke="rgba(212,175,100,0.9)" strokeWidth="1.2" fill="none"
                          transform={i===1?"scale(-1,1) translate(-14,0)":i===2?"scale(1,-1) translate(0,-14)":i===3?"scale(-1,-1) translate(-14,-14)":""}
                        />
                      </svg>
                    ))}

                    <div className="px-8 py-10 flex flex-col items-center gap-6 text-center">
                      {/* Animated pin */}
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                      >
                        <svg width="30" height="38" viewBox="0 0 30 38" fill="none" aria-hidden="true">
                          <path d="M15 0C6.716 0 0 6.716 0 15c0 9.375 15 23 15 23S30 24.375 30 15C30 6.716 23.284 0 15 0z" fill="hsl(var(--primary))" opacity="0.85"/>
                          <circle cx="15" cy="15" r="5.5" fill="white" opacity="0.92"/>
                        </svg>
                      </motion.div>

                      {/* Venue name */}
                      <div>
                        <p className="font-sans uppercase tracking-[0.35em] mb-2" style={{ fontSize: "0.55rem", color: "hsl(var(--accent))", opacity: 0.7 }}>
                          Celebration Venue
                        </p>
                        <h3 className="font-script" style={{ fontSize: "clamp(2.4rem, 8vw, 3.2rem)", color: "hsl(44 50% 91%)", lineHeight: 1.1 }}>
                          The Vine
                        </h3>
                        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, hsl(var(--accent)/0.4), transparent)", marginTop: "1rem" }} />
                      </div>

                      {/* Date reminder */}
                      <p className="font-serif italic" style={{ fontSize: "0.95rem", color: "hsl(44 30% 68%)", opacity: 0.7 }}>
                        Thursday, June 11, 2026
                      </p>

                      {/* Get Directions button */}
                      <a
                        href="https://maps.app.goo.gl/HZEF9xn8pG4TPLw79?g_st=iw"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.75rem 2rem",
                          border: "1px solid hsl(var(--accent)/0.5)",
                          borderRadius: 3,
                          color: "hsl(44 50% 88%)",
                          textDecoration: "none",
                          background: "hsl(var(--accent)/0.08)",
                          transition: "background 0.2s, border-color 0.2s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--accent)/0.16)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(var(--accent)/0.8)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--accent)/0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(var(--accent)/0.5)"; }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span className="font-sans uppercase tracking-[0.25em]" style={{ fontSize: "0.6rem" }}>Get Directions</span>
                      </a>
                    </div>

                    {/* Bottom accent line */}
                    <div style={{ height: 2, background: "linear-gradient(90deg, transparent, hsl(var(--accent)/0.6), transparent)" }} />
                  </div>
                </div>
              </FadeUp>
            </section>

            {/* ── SECTION 5: DRESS CODE ───────────────────────── */}
            <section id="dresscode" className="py-28 px-6 relative overflow-hidden" style={{ background: "hsl(44 45% 96%)" }}>
              {/* Soft background texture — faint radial gradients */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(201,18,85,0.08) 0%, transparent 70%)" }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(78,114,48,0.09) 0%, transparent 70%)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(217,184,32,0.06) 0%, transparent 70%)" }} />
              </div>

              <div className="relative z-10 max-w-lg mx-auto">
                {/* Heading */}
                <FadeUp className="text-center mb-5">
                  <p className="font-sans uppercase tracking-[0.45em] mb-4" style={{ fontSize: "0.54rem", color: "hsl(var(--primary))", opacity: 0.75 }}>
                    wedding attire
                  </p>
                  <h2 className="font-script" style={{ fontSize: "clamp(3rem, 11vw, 5.2rem)", color: "hsl(22 35% 20%)", lineHeight: 1.05 }}>
                    Dress Code
                  </h2>
                </FadeUp>

                {/* Subtitle */}
                <FadeUp delay={0.1} className="text-center mb-14">
                  <p className="font-serif" style={{ fontSize: "clamp(0.88rem, 2.6vw, 1.05rem)", color: "hsl(22 18% 38%)", lineHeight: 1.85, maxWidth: "34ch", margin: "0 auto" }}>
                    We'd love for your outfit to complement our
                    celebration — any shade from our palette is
                    a beautiful choice.
                  </p>
                </FadeUp>

                {/* Colour swatches — row 1: 4 swatches */}
                <FadeUp delay={0.18}>
                  <div className="flex justify-center items-end gap-4 mb-6">
                    {PALETTE.slice(0, 4).map((p, i) => (
                      <BrushSwatch key={p.color} color={p.color} label={p.label} rotate={[-2, 1.5, -1, 2][i]} />
                    ))}
                  </div>
                </FadeUp>

                {/* Colour swatches — row 2: 3 swatches, centered */}
                <FadeUp delay={0.26}>
                  <div className="flex justify-center items-end gap-4 mb-14">
                    {PALETTE.slice(4).map((p, i) => (
                      <BrushSwatch key={p.color} color={p.color} label={p.label} rotate={[1, -2, 1.5][i]} />
                    ))}
                  </div>
                </FadeUp>

                {/* Divider */}
                <FadeUp delay={0.32} className="flex items-center gap-4 mb-14">
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(22 25% 70%))" }} />
                  <svg width="16" height="16" viewBox="0 0 16 16"><rect x="4" y="4" width="8" height="8" transform="rotate(45 8 8)" fill="hsl(22 25% 70%)" /></svg>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(22 25% 70%))" }} />
                </FadeUp>

                {/* Note */}
                <FadeUp delay={0.38} className="text-center">
                  <p className="font-serif italic" style={{ fontSize: "0.92rem", color: "hsl(22 18% 52%)", lineHeight: 1.7 }}>
                    "Wear what makes you feel beautiful —<br />
                    your presence is our greatest joy."
                  </p>
                </FadeUp>
              </div>
            </section>

            {/* ── SECTION 6: RSVP ─────────────────────────────── */}
            <section id="rsvp" className="relative py-28 px-6 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
              <img
                src={floralFrame}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center"
                style={{ opacity: 0.14 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 72% 82% at 50% 50%, hsl(var(--background)/0.97) 38%, hsl(var(--background)/0.65) 100%)" }}
              />
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(var(--primary)/0.2), transparent)" }} />

              <FadeUp className="relative z-10 text-center mb-12">
                <p className="font-sans uppercase tracking-[0.42em] mb-3" style={{ fontSize: "0.58rem", color: "hsl(var(--primary))", opacity: 0.75 }}>
                  seal your seat at our celebration
                </p>
                <h2 className="font-script" style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)", color: "hsl(var(--foreground))", lineHeight: 1 }}>
                  Will You Join Us?
                </h2>
              </FadeUp>

              <FadeUp delay={0.12} className="relative z-10">
                <div
                  className="max-w-lg mx-auto p-8 md:p-12"
                  style={{
                    background: "hsl(var(--card)/0.96)",
                    border: "1px solid hsl(var(--primary)/0.1)",
                    borderRadius: 3,
                    boxShadow: "0 32px 90px rgba(0,0,0,0.07), 0 8px 28px rgba(201,35,96,0.07)",
                  }}
                >
                  <RsvpForm />
                </div>
              </FadeUp>
            </section>

            {/* ── FOOTER ──────────────────────────────────────── */}
            <footer className="py-24 px-6 text-center relative overflow-hidden" style={{ background: "hsl(var(--primary))" }}>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `url(${floralFrame})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.07 }}
              />
              {/* Top & bottom decorative lines */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />

              <div className="relative z-10">
                <p className="font-sans uppercase tracking-[0.5em] text-white/40 mb-4" style={{ fontSize: "0.52rem" }}>
                  forever starts here
                </p>
                <p className="font-script text-white" style={{ fontSize: "clamp(2.8rem, 8vw, 4.5rem)", lineHeight: 1 }}>
                  Hussam &amp; Yara
                </p>
                <Ornament />
                <p className="font-sans uppercase tracking-[0.45em] text-white/35 mt-3" style={{ fontSize: "0.55rem" }}>
                  11 · VI · MMXXVI
                </p>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
