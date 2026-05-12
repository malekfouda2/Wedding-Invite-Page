import { Router } from "express";
import { db, rsvpTable } from "@workspace/db";
import { SubmitRsvpBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router = Router();

router.post("/rsvp", async (req, res): Promise<void> => {
  const parsed = SubmitRsvpBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid RSVP body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { guestName, attending, hasPlusOne, plusOneName } = parsed.data;

  const [rsvp] = await db
    .insert(rsvpTable)
    .values({
      guestName,
      attending,
      hasPlusOne: hasPlusOne ?? false,
      plusOneName: hasPlusOne && plusOneName ? plusOneName : null,
    })
    .returning();

  res.status(201).json({
    id: rsvp.id,
    guestName: rsvp.guestName,
    attending: rsvp.attending,
    hasPlusOne: rsvp.hasPlusOne,
    plusOneName: rsvp.plusOneName,
    submittedAt: rsvp.submittedAt.toISOString(),
  });
});

router.get("/rsvp/all", async (req, res): Promise<void> => {
  const session = (req as any).session as { adminAuthenticated?: boolean };
  if (!session.adminAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rsvps = await db.select().from(rsvpTable).orderBy(desc(rsvpTable.submittedAt));

  res.json(
    rsvps.map((r) => ({
      id: r.id,
      guestName: r.guestName,
      attending: r.attending,
      hasPlusOne: r.hasPlusOne,
      plusOneName: r.plusOneName,
      submittedAt: r.submittedAt.toISOString(),
    }))
  );
});

export default router;
