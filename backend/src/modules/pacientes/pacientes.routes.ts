import { Router } from "express";
import { createPaciente, getPacientes, getPaciente, updatePaciente, getMyPatient } from "./pacientes.controller";
import { requireAuth, requireRole, requirePersonWithPatient } from "../../middleware/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// GET /me/patient - Get own patient record (PERSON only)
router.get("/me/patient", requirePersonWithPatient, getMyPatient);

// ADMIN_GENERAL y ADMIN_PRO_CLINICO pueden crear pacientes
router.post("/", requireRole("SUPER_ADMIN", "CLINICAL_ADMIN"), createPaciente);

// Todos los roles autenticados pueden listar (con restricciones en el controlador)
router.get("/", getPacientes);

// Todos los roles autenticados pueden ver un paciente (con restricciones en el controlador)
router.get("/:id", getPaciente);

// Todos los roles autenticados pueden actualizar (con restricciones en el controlador)
router.put("/:id", updatePaciente);

export default router;

