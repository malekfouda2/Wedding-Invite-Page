import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import Envelope from "@/components/envelope";
import RsvpForm from "@/components/rsvp-form";

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

// Flip countdown digit
function FlipDigit({ value, color }: { value: number; color: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="relative overflow-hidden" style={{ height: "clamp(3.8rem, 11vw, 6.5rem)" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={str}
          className="font-serif font-light absolute inset-0 flex items-center justify-center leading-none"
          style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)", color }}
          initial={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {str}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center px-2 md:px-6">
      <FlipDigit value={value} color={color} />
      <div className="my-2 h-px w-8" style={{ background: color, opacity: 0.3 }} />
      <span className="font-sans uppercase tracking-[0.28em] text-white/30" style={{ fontSize: "0.55rem" }}>{label}</span>
    </div>
  );
}

const SECTIONS = [
  { id: "invitation", label: "Invitation" },
  { id: "countdown", label: "Countdown" },
  { id: "timeline", label: "Timeline" },
  { id: "venue", label: "Venue" },
  { id: "rsvp", label: "RSVP" },
];

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

// Ambient floating particles for the invitation section
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 96 + 2,
      top: Math.random() * 90 + 2,
      color: ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"][i % 4],
      delay: Math.random() * 6,
      duration: Math.random() * 5 + 7,
      opacity: Math.random() * 0.25 + 0.06,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, background: p.color }}
          animate={{
            y: [0, -18, 0, 10, 0],
            x: [0, 8, -5, 3, 0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.6, p.opacity, p.opacity * 0.4],
            scale: [1, 1.3, 0.9, 1.1, 1],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

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

// Parallax floral image
function ParallaxFloral({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
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

              {/* Ambient floating particles */}
              <FloatingParticles />

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
            <section id="countdown" className="py-28 px-6 overflow-hidden relative" style={{ background: "hsl(22 28% 12%)" }}>
              {/* Decorative glow orbs */}
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--secondary)/0.07) 0%, transparent 70%)", filter: "blur(30px)" }} />

              <FadeUp className="text-center mb-16">
                <p className="font-sans uppercase tracking-[0.4em] mb-4" style={{ fontSize: "0.58rem", color: "hsl(var(--primary))", opacity: 0.75 }}>
                  the moment we&apos;ve been dreaming of
                </p>
                <h2 className="font-script" style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)", color: "hsl(44 50% 91%)", lineHeight: 1 }}>
                  Counting Down
                </h2>
              </FadeUp>

              <FadeUp delay={0.12}>
                <div className="max-w-2xl mx-auto flex justify-center">
                  {[
                    { value: timeLeft.days, label: "Days", color: "hsl(var(--primary))" },
                    { value: timeLeft.hours, label: "Hours", color: "hsl(var(--secondary))" },
                    { value: timeLeft.minutes, label: "Minutes", color: "hsl(var(--accent))" },
                    { value: timeLeft.seconds, label: "Seconds", color: "hsl(44 55% 85%)" },
                  ].map((u, i) => (
                    <div key={i} className="flex-1" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <CountdownUnit value={u.value} label={u.label} color={u.color} />
                    </div>
                  ))}
                </div>
              </FadeUp>

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
                            style={{ background: event.color }}
                            whileHover={{ scale: 1.5 }}
                            animate={{ boxShadow: [`0 0 0 4px hsl(var(--background)), 0 0 0 6px ${event.color}33`, `0 0 0 4px hsl(var(--background)), 0 0 12px 8px ${event.color}22`] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
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
            <section id="venue" className="py-28 px-6 relative" style={{ background: "hsl(22 28% 12%)" }}>
              <div className="absolute top-0 right-1/3 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent)/0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />

              <FadeUp className="text-center mb-12">
                <p className="font-sans uppercase tracking-[0.42em] mb-3" style={{ fontSize: "0.58rem", color: "hsl(var(--accent))", opacity: 0.85 }}>
                  where love finds its home
                </p>
                <h2 className="font-script" style={{ fontSize: "clamp(2.8rem, 9vw, 5rem)", color: "hsl(44 50% 91%)", lineHeight: 1 }}>
                  The Venue
                </h2>
                <p className="font-serif italic mt-5" style={{ fontSize: "1.05rem", color: "hsl(44 30% 68%)", opacity: 0.65 }}>
                  Location details coming soon — stay tuned
                </p>
              </FadeUp>

              <FadeUp delay={0.1}>
                {/* Venue placeholder — replace with actual details when confirmed */}
                <div
                  className="max-w-3xl mx-auto relative overflow-hidden"
                  style={{
                    aspectRatio: "16/7",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 4,
                    background: "hsl(22 28% 9%)",
                  }}
                >
                  {/* Subtle grid pattern */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                  {/* Soft glow in center */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, hsl(var(--accent)/0.08) 0%, transparent 70%)" }}
                  />
                  {/* Pin icon + text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    >
                      <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                        <path
                          d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
                          fill="hsl(var(--primary))"
                          opacity="0.8"
                        />
                        <circle cx="16" cy="16" r="6" fill="white" opacity="0.9" />
                      </svg>
                    </motion.div>
                    <div className="flex flex-col items-center gap-2 text-center px-6">
                      <p className="font-serif italic" style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)", color: "hsl(44 50% 88%)", opacity: 0.75 }}>
                        Venue to be announced
                      </p>
                      <p className="font-sans uppercase tracking-[0.3em]" style={{ fontSize: "0.52rem", color: "rgba(255,255,255,0.2)" }}>
                        Details will be shared with guests shortly
                      </p>
                    </div>
                  </div>
                  {/* Decorative corner dots */}
                  {[["6px","6px"],["6px","auto"],["auto","6px"],["auto","auto"]].map(([top, bottom, ], i) => (
                    <div key={i} className="absolute w-1 h-1 rounded-full" style={{ top: top === "auto" ? undefined : top, bottom: top === "auto" ? "6px" : undefined, left: i < 2 ? "6px" : undefined, right: i >= 2 ? "6px" : undefined, background: "rgba(255,255,255,0.12)" }} />
                  ))}
                </div>
              </FadeUp>
            </section>

            {/* ── SECTION 5: RSVP ─────────────────────────────── */}
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
