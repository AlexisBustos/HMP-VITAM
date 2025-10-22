import { Router } from "express";
import { getUsers, getUser, updateUserRole, getRoles } from "./users.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Solo ADMIN_GENERAL puede gestionar usuarios
router.get("/", requireRole("ADMIN_GENERAL"), getUsers);
router.get("/roles", getRoles);
router.get("/:id", requireRole("ADMIN_GENERAL"), getUser);
router.patch("/:id/role", requireRole("ADMIN_GENERAL"), updateUserRole);

export default router;

