import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rsvpRouter from "./rsvp";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rsvpRouter);
router.use(adminRouter);

export default router;
