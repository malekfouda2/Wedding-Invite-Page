import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitRsvp } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";

const rsvpSchema = z.object({
  attending: z.enum(["yes", "no"]),
  guestName: z.string().min(2, "Please enter your name").optional(),
  hasPlusOne: z.boolean().default(false).optional(),
  plusOneName: z.string().optional()
}).refine(data => {
  if (data.attending === "yes" && !data.guestName) {
    return false;
  }
  return true;
}, {
  message: "Please enter your name",
  path: ["guestName"]
});

type RsvpFormValues = z.infer<typeof rsvpSchema>;

export default function RsvpForm() {
  const [submitted, setSubmitted] = useState(false);
  const submitRsvp = useSubmitRsvp();

  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attending: undefined,
      guestName: "",
      hasPlusOne: false,
      plusOneName: ""
    }
  });

  const attending = form.watch("attending");
  const hasPlusOne = form.watch("hasPlusOne");

  const onSubmit = (data: RsvpFormValues) => {
    const isAttending = data.attending === "yes";
    
    submitRsvp.mutate({
      data: {
        attending: isAttending,
        guestName: isAttending ? data.guestName! : "Not Attending",
        hasPlusOne: data.hasPlusOne,
        plusOneName: data.hasPlusOne ? data.plusOneName : null
      }
    }, {
      onSuccess: () => {
        setSubmitted(true);
        toast.success(isAttending ? "We can't wait to see you!" : "We will miss you!");
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-serif text-primary mb-2">Thank You</h3>
        <p className="text-muted-foreground">Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="attending"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-lg font-serif text-foreground">Will you be joining us?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-xl hover:bg-card/50 transition-colors">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-medium flex-1 cursor-pointer">
                      Joyfully Accept
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-xl hover:bg-card/50 transition-colors">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-medium flex-1 cursor-pointer">
                      Regretfully Decline
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {attending === "yes" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-background/50 border-primary/20 focus-visible:ring-primary" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasPlusOne"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-primary/20 rounded-xl bg-background/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I am bringing a guest
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {hasPlusOne && (
              <FormField
                control={form.control}
                name="plusOneName"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in">
                    <FormLabel>Guest's Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} className="bg-background/50 border-primary/20 focus-visible:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-serif bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all"
          disabled={!attending || submitRsvp.isPending}
        >
          {submitRsvp.isPending ? "Submitting..." : "Send RSVP"}
        </Button>
      </form>
    </Form>
  );
}
