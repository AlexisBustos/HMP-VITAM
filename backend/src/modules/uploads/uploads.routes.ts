import { Router } from "express";
import { upload, uploadExamenPdf, getExamenPdfUrl } from "./uploads.controller";
import { requireAuth, requireRole } from "../common/auth.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Solo profesionales clínicos pueden subir archivos
router.post(
  "/examen-pdf",
  requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"),
  upload.single("file"),
  uploadExamenPdf
);

// Profesionales pueden obtener URLs firmadas
router.get(
  "/examen-pdf/:examenId",
  requireRole("ADMIN_GENERAL", "ADMIN_PRO_CLINICO"),
  getExamenPdfUrl
);

export default router;

