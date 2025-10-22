import { Router } from "express";
import { createPaciente, getPacientes, getPaciente, updatePaciente } from "./pacientes.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// ADMIN_GENERAL y ADMIN_PRO_CLINICO pueden crear pacientes
router.post("/", requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"), createPaciente);

// Todos los roles autenticados pueden listar (con restricciones en el controlador)
router.get("/", getPacientes);

// Todos los roles autenticados pueden ver un paciente (con restricciones en el controlador)
router.get("/:id", getPaciente);

// Todos los roles autenticados pueden actualizar (con restricciones en el controlador)
router.put("/:id", updatePaciente);

export default router;

