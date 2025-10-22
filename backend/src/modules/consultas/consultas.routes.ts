import { Router } from "express";
import { createConsulta, getConsultas, getConsulta } from "./consultas.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Solo profesionales clínicos pueden crear consultas
router.post("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), createConsulta);

// Profesionales pueden ver todas las consultas
router.get("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), getConsultas);
router.get("/:id", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), getConsulta);

export default router;

