import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Envelope from "@/components/envelope";
import RsvpForm from "@/components/rsvp-form";

// @ts-ignore
import floralFrame from "@assets/WhatsApp_Image_2026-05-10_at_12.05.16_(1)_1778550657210.jpeg";

const WEDDING_DATE = new Date("2026-06-11T18:00:00");

function getTimeLeft() {
  const now = new Date().getTime();
  const dist = WEDDING_DATE.getTime() - now;
  if (dist < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(dist / (1000 * 60 * 60 * 24)),
    hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((dist % (1000 * 60)) / 1000),
  };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 my-2">
      <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, hsl(var(--primary)/0.3))" }} />
      <span style={{ color: "hsl(var(--primary))", opacity: 0.5, fontSize: "0.45rem", letterSpacing: "0.15em" }}>✦ ✦ ✦</span>
      <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, hsl(var(--primary)/0.3))" }} />
    </div>
  );
}

function CountdownUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif leading-none font-light" style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)", color, lineHeight: 1 }}>
        {String(value).padStart(2, "0")}
      </span>
      <div className="my-3 h-px w-10" style={{ background: color, opacity: 0.35 }} />
      <span className="font-sans uppercase tracking-[0.25em] text-foreground/40" style={{ fontSize: "0.6rem" }}>{label}</span>
    </div>
  );
}

const timelineEvents = [
  { time: "6:00", period: "PM", title: "The Ceremony", description: "Witness the sacred exchange of vows" },
  { time: "7:00", period: "PM", title: "Celebration Begins", description: "First dance, joy, and laughter" },
  { time: "9:00", period: "PM", title: "The Feast", description: "A curated buffet opens its doors" },
  { time: "Late", period: "", title: "Dance the Night", description: "The music carries on till morning" },
];

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden" style={{ background: "hsl(var(--background))" }}>
      {/* ── ENVELOPE SCENE ─────────────────────────────────── */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="envelope"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "hsl(var(--background))" }}
            exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.1 } }}
          >
            {/* Subtle top/bottom floral accents */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: `url(${floralFrame})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                className="flex flex-col items-center gap-1 mb-6"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <p className="font-sans uppercase tracking-[0.4em] text-foreground/30" style={{ fontSize: "0.6rem" }}>
                  You are invited to
                </p>
                <p className="font-script" style={{ fontSize: "clamp(2.2rem, 7vw, 3.2rem)", color: "hsl(var(--primary))", lineHeight: 1.1 }}>
                  Hussam &amp; Yara
                </p>
              </motion.div>
              <Envelope onOpen={() => setOpened(true)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INVITATION CONTENT ─────────────────────────────── */}
      <AnimatePresence>
        {opened && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* ── SECTION 1: HERO INVITATION ─────────────────── */}
            <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
              {/* Full floral frame — this IS the design */}
              <img
                src={floralFrame}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                style={{ opacity: 0.92 }}
                aria-hidden="true"
              />
              {/* Ivory vignette center so text reads cleanly */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 65% 60% at 50% 50%, rgba(250,248,243,0.88) 30%, rgba(250,248,243,0.3) 70%, transparent 100%)",
                }}
              />

              {/* Invitation card */}
              <motion.div
                className="relative z-10 flex flex-col items-center text-center px-8 py-10 max-w-[580px] mx-auto"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-sans uppercase tracking-[0.42em] text-foreground/40 mb-6" style={{ fontSize: "0.6rem" }}>
                  Together with their families
                </p>

                <h1
                  className="font-script leading-none mb-4"
                  style={{
                    fontSize: "clamp(4rem, 14vw, 7.5rem)",
                    color: "hsl(var(--primary))",
                    textShadow: "0 2px 20px rgba(201,35,96,0.12)",
                  }}
                  data-testid="text-couple-names"
                >
                  Hussam &amp; Yara
                </h1>

                <Divider />

                <p className="font-serif italic text-foreground/60 mt-4 mb-1 leading-relaxed" style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}>
                  request the honour of your presence
                </p>
                <p className="font-serif text-foreground/80 mb-6" style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)" }}>
                  at their wedding celebration
                </p>

                <div
                  className="w-full max-w-[280px] rounded-[1px] py-5 px-8 mb-5 flex flex-col items-center gap-1"
                  style={{ border: "1px solid hsl(var(--primary)/0.2)", background: "hsl(var(--primary)/0.04)" }}
                >
                  <p className="font-serif font-semibold text-foreground/80" style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)" }}>
                    Thursday, 11 June 2026
                  </p>
                  <p className="font-sans uppercase tracking-[0.3em] text-foreground/35" style={{ fontSize: "0.58rem" }}>
                    6 o&apos;clock in the evening
                  </p>
                </div>

                <p className="font-sans uppercase tracking-[0.32em] text-foreground/30" style={{ fontSize: "0.55rem" }}>
                  ✦ &nbsp; black tie optional &nbsp; ✦
                </p>
              </motion.div>
            </section>

            {/* ── SECTION 2: COUNTDOWN ───────────────────────── */}
            <section
              className="py-24 px-6 overflow-hidden"
              style={{ background: "hsl(22 30% 14%)" }}
            >
              <FadeUp className="text-center mb-16">
                <p className="font-sans uppercase tracking-[0.38em] mb-3" style={{ fontSize: "0.6rem", color: "hsl(var(--primary))", opacity: 0.8 }}>
                  counting down to the big day
                </p>
                <h2
                  className="font-script"
                  style={{ fontSize: "clamp(2.8rem, 8vw, 4.5rem)", color: "hsl(44 50% 92%)", lineHeight: 1 }}
                >
                  The Big Day
                </h2>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="max-w-3xl mx-auto grid grid-cols-4 gap-0">
                  {[
                    { value: timeLeft.days, label: "Days", color: "hsl(var(--primary))" },
                    { value: timeLeft.hours, label: "Hours", color: "hsl(var(--secondary))" },
                    { value: timeLeft.minutes, label: "Minutes", color: "hsl(var(--accent))" },
                    { value: timeLeft.seconds, label: "Seconds", color: "hsl(var(--muted))" },
                  ].map((u, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center py-8"
                      style={{
                        borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}
                    >
                      <CountdownUnit value={u.value} label={u.label} color={u.color} />
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.25} className="text-center mt-16">
                <p className="font-serif italic" style={{ fontSize: "1.1rem", color: "hsl(44 40% 80%)", opacity: 0.5 }}>
                  June 11, 2026 — for ever and always
                </p>
              </FadeUp>
            </section>

            {/* ── SECTION 3: TIMELINE ────────────────────────── */}
            <section className="py-24 px-6 relative overflow-hidden" style={{ background: "hsl(44 45% 96%)" }}>
              {/* Faint floral in corner */}
              <img
                src={floralFrame}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 -right-8 w-64 opacity-[0.12]"
                style={{ transform: "rotate(180deg)" }}
              />

              <FadeUp className="text-center mb-20">
                <p className="font-sans uppercase tracking-[0.38em] mb-2" style={{ fontSize: "0.6rem", color: "hsl(var(--secondary))", opacity: 0.9 }}>
                  The programme
                </p>
                <h2
                  className="font-script"
                  style={{ fontSize: "clamp(2.8rem, 8vw, 4.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.05 }}
                >
                  The Day Unfolds
                </h2>
              </FadeUp>

              <div className="max-w-2xl mx-auto relative">
                {/* Center vertical line */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.25) 15%, hsl(var(--primary)/0.25) 85%, transparent)" }}
                />

                {timelineEvents.map((event, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <FadeUp key={i} delay={i * 0.1} className="relative flex items-center mb-14 last:mb-0">
                      {/* Left side */}
                      <div className={`flex-1 ${isLeft ? "text-right pr-10" : "pl-10 order-last"}`}>
                        {isLeft ? (
                          <>
                            <p
                              className="font-script leading-none"
                              style={{ fontSize: "clamp(2rem, 6vw, 2.8rem)", color: "hsl(var(--primary))" }}
                            >
                              {event.time}
                              {event.period && <span className="font-sans text-sm ml-1 tracking-wide" style={{ color: "hsl(var(--primary))", opacity: 0.55 }}>{event.period}</span>}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-serif font-medium text-foreground/90" style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}>{event.title}</p>
                            <p className="font-sans text-foreground/40 mt-1" style={{ fontSize: "0.75rem" }}>{event.description}</p>
                          </>
                        )}
                      </div>

                      {/* Center dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            background: "hsl(var(--primary))",
                            boxShadow: "0 0 0 4px hsl(var(--background)), 0 0 0 6px hsl(var(--primary)/0.25)",
                          }}
                        />
                      </div>

                      {/* Right side */}
                      <div className={`flex-1 ${isLeft ? "pl-10" : "text-right pr-10 order-first"}`}>
                        {isLeft ? (
                          <>
                            <p className="font-serif font-medium text-foreground/90" style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}>{event.title}</p>
                            <p className="font-sans text-foreground/40 mt-1" style={{ fontSize: "0.75rem" }}>{event.description}</p>
                          </>
                        ) : (
                          <>
                            <p
                              className="font-script leading-none"
                              style={{ fontSize: "clamp(2rem, 6vw, 2.8rem)", color: "hsl(var(--primary))" }}
                            >
                              {event.time}
                              {event.period && <span className="font-sans text-sm ml-1 tracking-wide" style={{ color: "hsl(var(--primary))", opacity: 0.55 }}>{event.period}</span>}
                            </p>
                          </>
                        )}
                      </div>
                    </FadeUp>
                  );
                })}
              </div>
            </section>

            {/* ── SECTION 4: LOCATION ────────────────────────── */}
            <section className="py-24 px-6" style={{ background: "hsl(22 30% 14%)" }}>
              <FadeUp className="text-center mb-12">
                <p className="font-sans uppercase tracking-[0.38em] mb-2" style={{ fontSize: "0.6rem", color: "hsl(var(--accent))", opacity: 0.9 }}>
                  where love awaits
                </p>
                <h2
                  className="font-script"
                  style={{ fontSize: "clamp(2.8rem, 8vw, 4.5rem)", color: "hsl(44 50% 92%)", lineHeight: 1 }}
                >
                  The Venue
                </h2>
                <p className="font-serif italic mt-4" style={{ fontSize: "1rem", color: "hsl(44 30% 70%)", opacity: 0.7 }}>
                  Location details will be updated soon
                </p>
              </FadeUp>

              <FadeUp delay={0.1}>
                {/* CUSTOMIZE: Replace this iframe src with your Google Maps embed URL */}
                <div className="max-w-3xl mx-auto rounded-sm overflow-hidden" style={{ aspectRatio: "16/7", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <iframe
                    title="Wedding Venue Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=35.5,30.0,36.5,31.5&layer=mapnik"
                    className="w-full h-full"
                    style={{ filter: "grayscale(30%) sepia(15%) brightness(0.9)", border: "none" }}
                    loading="lazy"
                  />
                </div>
                <p className="text-center font-sans mt-5 uppercase tracking-[0.3em]" style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.2)" }}>
                  ✦ update iframe src above with venue coordinates ✦
                </p>
              </FadeUp>
            </section>

            {/* ── SECTION 5: RSVP ────────────────────────────── */}
            <section className="relative py-24 px-6 overflow-hidden" style={{ background: "hsl(var(--background))" }}>
              {/* Floral decoration */}
              <img
                src={floralFrame}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center"
                style={{ opacity: 0.12 }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 70% 80% at 50% 50%, hsl(var(--background)/0.97) 40%, hsl(var(--background)/0.7) 100%)",
                }}
              />

              <FadeUp className="relative z-10 text-center mb-12">
                <p className="font-sans uppercase tracking-[0.38em] mb-2" style={{ fontSize: "0.6rem", color: "hsl(var(--primary))", opacity: 0.8 }}>
                  kindly reply by May 2026
                </p>
                <h2
                  className="font-script"
                  style={{ fontSize: "clamp(2.8rem, 8vw, 4.5rem)", color: "hsl(var(--foreground))", lineHeight: 1 }}
                >
                  Will You Join Us?
                </h2>
              </FadeUp>

              <FadeUp delay={0.1} className="relative z-10">
                <div
                  className="max-w-lg mx-auto rounded-[2px] p-8 md:p-12"
                  style={{
                    background: "hsl(var(--card)/0.95)",
                    border: "1px solid hsl(var(--primary)/0.12)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.06), 0 8px 24px rgba(201,35,96,0.06)",
                  }}
                >
                  <RsvpForm />
                </div>
              </FadeUp>
            </section>

            {/* ── FOOTER ─────────────────────────────────────── */}
            <footer className="py-20 px-6 text-center relative overflow-hidden" style={{ background: "hsl(var(--primary))" }}>
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{ backgroundImage: `url(${floralFrame})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
              <div className="relative z-10">
                <p className="font-sans uppercase tracking-[0.45em] text-white/50 mb-3" style={{ fontSize: "0.55rem" }}>
                  forever starts here
                </p>
                <p
                  className="font-script text-white"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", lineHeight: 1 }}
                >
                  Hussam &amp; Yara
                </p>
                <Divider />
                <p className="font-sans uppercase tracking-[0.4em] text-white/40 mt-4" style={{ fontSize: "0.58rem" }}>
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
