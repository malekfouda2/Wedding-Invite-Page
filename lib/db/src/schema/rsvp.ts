import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rsvpTable = pgTable("rsvp", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  attending: boolean("attending").notNull(),
  hasPlusOne: boolean("has_plus_one").notNull().default(false),
  plusOneName: text("plus_one_name"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertRsvpSchema = createInsertSchema(rsvpTable).omit({ id: true, submittedAt: true });
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvpTable.$inferSelect;
