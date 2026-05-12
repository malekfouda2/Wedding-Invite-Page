import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Envelope from "@/components/envelope";
import Countdown from "@/components/countdown";
import Timeline from "@/components/timeline";
import RsvpForm from "@/components/rsvp-form";
// @ts-ignore
import floralFrame from "@assets/WhatsApp_Image_2026-05-10_at_12.05.16_(1)_1778550657210.jpeg";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-background overflow-hidden font-sans text-foreground">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope-view"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
            exit={{ opacity: 0, y: "100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
          >
            <Envelope onOpen={() => setIsOpen(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="content-view"
            className="relative min-h-[100dvh] w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            {/* Hero Invitation Section */}
            <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 py-20 text-center">
              <div 
                className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url(${floralFrame})` }}
              />
              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-serif mb-4 shadow-lg shadow-primary/20"
                >
                  ح & ي
                </motion.div>
                
                <h2 className="text-sm md:text-base tracking-[0.2em] uppercase text-muted-foreground font-sans">
                  Together with their families
                </h2>
                
                <h1 className="text-6xl md:text-8xl font-serif text-primary mb-2">
                  Hussam & Yara
                </h1>
                
                <p className="text-lg md:text-xl text-foreground/80 max-w-lg mx-auto leading-relaxed font-serif italic">
                  request the honor of your presence at their wedding celebration
                </p>
                
                <div className="mt-8 border-y border-primary/20 py-6 px-12">
                  <h3 className="text-2xl md:text-3xl font-serif text-secondary mb-2">
                    Thursday, 11 June 2026
                  </h3>
                  <p className="text-sm tracking-widest uppercase text-muted-foreground">
                    Save the Date
                  </p>
                </div>
              </div>
            </section>

            {/* Countdown Section */}
            <section className="py-24 bg-card border-y border-border px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-serif text-primary mb-12">The Countdown Begins</h2>
                <Countdown targetDate={new Date("2026-06-11T18:00:00")} />
              </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 px-4 bg-background">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-serif text-center text-primary mb-16">Wedding Day Timeline</h2>
                <Timeline />
              </div>
            </section>

            {/* Location Section */}
            <section className="py-24 px-4 bg-muted/10 border-y border-border">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-serif text-primary mb-8">The Venue</h2>
                <p className="text-lg mb-12 text-foreground/80 font-serif italic">
                  Location details will be updated soon.
                </p>
                <div className="aspect-video w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-card flex items-center justify-center">
                  <div className="text-muted-foreground text-sm flex flex-col items-center gap-2">
                    <span className="text-4xl">📍</span>
                    <span>Map placeholder</span>
                  </div>
                </div>
              </div>
            </section>

            {/* RSVP Section */}
            <section className="py-24 px-4 bg-background relative overflow-hidden">
               <div 
                className="absolute inset-0 z-0 opacity-10 bg-cover bg-center bg-no-repeat pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url(${floralFrame})` }}
              />
              <div className="max-w-xl mx-auto relative z-10 bg-card/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-primary/10">
                <h2 className="text-4xl font-serif text-center text-primary mb-2">RSVP</h2>
                <p className="text-center text-muted-foreground mb-8">Kindly respond by May 1st, 2026</p>
                <RsvpForm />
              </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center bg-primary text-primary-foreground border-t-4 border-secondary">
              <div className="max-w-md mx-auto px-4">
                <h2 className="text-2xl font-serif mb-2">Hussam & Yara</h2>
                <p className="text-sm opacity-80 tracking-widest uppercase">11.06.2026</p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
