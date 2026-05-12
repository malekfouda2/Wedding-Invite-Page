import { Router } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const router = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const { username, password } = parsed.data;
  const session = (req as any).session as { adminAuthenticated?: boolean };

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    session.adminAuthenticated = true;
    req.log.info("Admin logged in");
    res.json({ authenticated: true, message: "Login successful" });
  } else {
    req.log.warn("Failed admin login attempt");
    res.status(401).json({ error: "Invalid username or password" });
  }
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  const session = (req as any).session as { adminAuthenticated?: boolean };
  session.adminAuthenticated = false;
  req.log.info("Admin logged out");
  res.json({ authenticated: false, message: null });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = (req as any).session as { adminAuthenticated?: boolean };
  if (session.adminAuthenticated) {
    res.json({ authenticated: true, message: null });
  } else {
    res.json({ authenticated: false, message: null });
  }
});

export default router;
