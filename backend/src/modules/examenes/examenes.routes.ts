import { Router } from "express";
import { createExamen, getExamenes, getExamen, updateExamen } from "./examenes.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Solo profesionales clínicos pueden gestionar exámenes
router.post("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), createExamen);
router.get("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), getExamenes);
router.get("/:id", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), getExamen);
router.put("/:id", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), updateExamen);

export default router;

