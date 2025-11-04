import { Request, Response } from "express";
import multer from "multer";
import { uploadPdfToS3, getSignedUrl } from "./s3.service";
import prisma from "../../config/prisma";
import { AppError } from "../common/error.handler";

// Configurar multer para almacenar en memoria
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export async function uploadExamenPdf(req: Request, res: Response) {
  try {
    if (!req.file) {
      throw new AppError(400, "No se proporcionó ningún archivo");
    }
    
    const { examenId } = req.body;
    
    if (!examenId) {
      throw new AppError(400, "examenId es requerido");
    }
    
    const id = parseInt(examenId);
    
    // Verificar que el examen existe
    const examen = await prisma.examen.findUnique({
      where: { id }
    });
    
    if (!examen) {
      throw new AppError(404, "Examen no encontrado");
    }
    
    // Generar key único para S3
    const timestamp = Date.now();
    const key = `examenes/${examen.pacienteId}/${id}_${timestamp}.pdf`;
    
    // Subir a S3
    const s3Uri = await uploadPdfToS3(key, req.file.buffer);
    
    // Actualizar examen con el pdfKey
    const updatedExamen = await prisma.examen.update({
      where: { id },
      data: { pdfKey: key }
    });
    
    res.json({
      message: "Archivo subido exitosamente",
      examen: updatedExamen,
      s3Uri
    });
  } catch (error) {
    throw error;
  }
}

export async function getExamenPdfUrl(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.examenId);
    
    
    const examen = await prisma.examen.findUnique({
      where: { id }
    });
    
    if (!examen) {
      throw new AppError(404, "Examen no encontrado");
    }
    
    if (!examen.pdfKey) {
      throw new AppError(404, "Este examen no tiene PDF asociado");
    }
    
    // Generar URL firmada
    const signedUrl = getSignedUrl(examen.pdfKey);
    
    res.json({
      url: signedUrl,
      expiresIn: 300 // segundos
    });
  } catch (error) {
    throw error;
  }
}

