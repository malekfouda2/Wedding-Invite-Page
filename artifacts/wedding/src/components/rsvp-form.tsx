import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitRsvp } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const rsvpSchema = z
  .object({
    attending: z.enum(["yes", "no"]),
    guestName: z.string().optional(),
    hasPlusOne: z.boolean().default(false),
    plusOneName: z.string().optional(),
  })
  .refine(
    (d) => {
      if (d.attending === "yes" && (!d.guestName || d.guestName.trim().length < 2)) return false;
      return true;
    },
    { message: "Please enter your name", path: ["guestName"] }
  );

type FormValues = z.infer<typeof rsvpSchema>;

export default function RsvpForm() {
  const [submitted, setSubmitted] = useState<"yes" | "no" | null>(null);
  const submitRsvp = useSubmitRsvp();

  const form = useForm<FormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: { attending: undefined as unknown as "yes", guestName: "", hasPlusOne: false, plusOneName: "" },
  });

  const attending = form.watch("attending");
  const hasPlusOne = form.watch("hasPlusOne");

  const onSubmit = (data: FormValues) => {
    const isAttending = data.attending === "yes";
    submitRsvp.mutate(
      {
        data: {
          attending: isAttending,
          guestName: isAttending ? data.guestName! : "Not Attending",
          hasPlusOne: data.hasPlusOne,
          plusOneName: data.hasPlusOne ? data.plusOneName : null,
        },
      },
      {
        onSuccess: () => setSubmitted(isAttending ? "yes" : "no"),
      }
    );
  };

  if (submitted !== null) {
    return (
      <motion.div
        className="text-center py-10 flex flex-col items-center gap-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        data-testid="rsvp-success"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: submitted === "yes" ? "hsl(var(--primary)/0.1)" : "hsl(var(--muted)/0.2)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={submitted === "yes" ? "hsl(var(--primary))" : "hsl(var(--muted))"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {submitted === "yes" ? (
              <path d="M20 6L9 17l-5-5" />
            ) : (
              <path d="M12 21C12 21 4 14 4 9a8 8 0 0116 0c0 5-8 12-8 12z" />
            )}
          </svg>
        </div>
        <div>
          <p className="font-script mb-1" style={{ fontSize: "2rem", color: "hsl(var(--primary))", lineHeight: 1.1 }}>
            {submitted === "yes" ? "We cannot wait!" : "We will miss you"}
          </p>
          <p className="font-sans text-foreground/45 tracking-wide" style={{ fontSize: "0.75rem" }}>
            {submitted === "yes"
              ? "Your reply has been received. See you on June 11th."
              : "Thank you for letting us know. You are in our hearts."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Attendance selection */}
        <FormField
          control={form.control}
          name="attending"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-sans uppercase tracking-[0.25em] text-foreground/50 block mb-4" style={{ fontSize: "0.62rem" }}>
                Will you be joining us?
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  {(["yes", "no"] as const).map((val) => {
                    const selected = field.value === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        data-testid={`radio-attend-${val}`}
                        onClick={() => field.onChange(val)}
                        className="relative py-4 px-4 rounded-[2px] transition-all duration-300 text-left"
                        style={{
                          border: selected
                            ? "1px solid hsl(var(--primary)/0.6)"
                            : "1px solid hsl(var(--border))",
                          background: selected
                            ? "hsl(var(--primary)/0.05)"
                            : "transparent",
                        }}
                      >
                        <span
                          className="font-serif block"
                          style={{
                            fontSize: "1.15rem",
                            color: selected ? "hsl(var(--primary))" : "hsl(var(--foreground)/0.6)",
                          }}
                        >
                          {val === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                        </span>
                        {selected && (
                          <span
                            className="absolute top-2 right-2"
                            style={{ color: "hsl(var(--primary))", fontSize: "0.6rem", opacity: 0.6 }}
                          >
                            ✦
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attending fields */}
        <AnimatePresence>
          {attending === "yes" && (
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-sans uppercase tracking-[0.22em] text-foreground/45" style={{ fontSize: "0.6rem" }}>
                      Your Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        data-testid="input-guest-name"
                        className="rounded-[2px] font-serif text-base"
                        style={{ borderColor: "hsl(var(--primary)/0.2)", height: "2.8rem" }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plus one toggle */}
              <button
                type="button"
                data-testid="toggle-plus-one"
                onClick={() => form.setValue("hasPlusOne", !hasPlusOne)}
                className="w-full py-3 px-4 rounded-[2px] flex items-center justify-between transition-all duration-200"
                style={{
                  border: hasPlusOne ? "1px solid hsl(var(--primary)/0.5)" : "1px solid hsl(var(--border))",
                  background: hasPlusOne ? "hsl(var(--primary)/0.04)" : "transparent",
                }}
              >
                <span className="font-sans text-foreground/60 uppercase tracking-[0.2em]" style={{ fontSize: "0.65rem" }}>
                  Bringing a guest?
                </span>
                <div
                  className="w-8 h-4 rounded-full transition-all duration-300 relative"
                  style={{ background: hasPlusOne ? "hsl(var(--primary))" : "hsl(var(--border))" }}
                >
                  <div
                    className="absolute top-[3px] w-[10px] h-[10px] rounded-full bg-white transition-all duration-300"
                    style={{ left: hasPlusOne ? "calc(100% - 13px)" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                  />
                </div>
              </button>

              <AnimatePresence>
                {hasPlusOne && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="plusOneName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-sans uppercase tracking-[0.22em] text-foreground/45" style={{ fontSize: "0.6rem" }}>
                            Guest&apos;s Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Guest's name"
                              data-testid="input-plus-one-name"
                              className="rounded-[2px] font-serif text-base"
                              style={{ borderColor: "hsl(var(--primary)/0.2)", height: "2.8rem" }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          data-testid="button-submit-rsvp"
          disabled={!attending || submitRsvp.isPending}
          className="w-full py-4 rounded-[2px] font-sans uppercase tracking-[0.3em] transition-all duration-300 disabled:opacity-40"
          style={{
            fontSize: "0.7rem",
            background: attending ? "hsl(var(--primary))" : "transparent",
            color: attending ? "white" : "hsl(var(--foreground)/0.4)",
            border: attending ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
          }}
        >
          {submitRsvp.isPending ? "Sending..." : "Send My Reply"}
        </button>
      </form>
    </Form>
  );
}
