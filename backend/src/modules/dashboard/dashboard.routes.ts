import { Router } from "express";
import { getDashboardMetrics } from "./dashboard.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Solo profesionales pueden ver el dashboard
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"),
  getDashboardMetrics
);

export default router;

