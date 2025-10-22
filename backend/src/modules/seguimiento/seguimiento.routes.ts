import { Router } from "express";
import { createSeguimiento, getSeguimientos, getSeguimiento, updateSeguimiento } from "./seguimiento.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Solo profesionales clínicos pueden gestionar seguimientos
router.post("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), createSeguimiento);
router.get("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), getSeguimientos);
router.get("/:id", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), getSeguimiento);
router.put("/:id", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), updateSeguimiento);

export default router;

