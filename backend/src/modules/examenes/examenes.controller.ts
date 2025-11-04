import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { examenSchema } from "../common/validators";
import { AppError } from "../common/error.handler";

export async function createExamen(req: Request, res: Response) {
  try {
    const data = examenSchema.parse(req.body);
    
    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: data.pacienteId }
    });
    
    if (!paciente) {
      throw new AppError(404, "Paciente no encontrado");
    }
    
    // pdfKey se manejará en el upload (fase siguiente)
    const examen = await prisma.examen.create({
      data: {
        ...data,
        fecha: new Date(data.fecha)
      },
      include: {
        paciente: {
          select: {
            id: true,
            rut: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    res.status(201).json({
      message: "Examen registrado exitosamente",
      examen
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

export async function getExamenes(req: Request, res: Response) {
  try {
    const { pacienteId } = req.query;
    
    const where: any = {};
    
    if (pacienteId) {
      const id = parseInt(pacienteId as string);
      where.pacienteId = id;
    }
    
    const examenes = await prisma.examen.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            rut: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        fecha: "desc"
      }
    });
    
    res.json({ examenes });
  } catch (error) {
    throw error;
  }
}

export async function getExamen(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    
    const examen = await prisma.examen.findUnique({
      where: { id },
      include: {
        paciente: {
          select: {
            id: true,
            rut: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    if (!examen) {
      throw new AppError(404, "Examen no encontrado");
    }
    
    res.json({ examen });
  } catch (error) {
    throw error;
  }
}

export async function updateExamen(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    
    const existing = await prisma.examen.findUnique({
      where: { id }
    });
    
    if (!existing) {
      throw new AppError(404, "Examen no encontrado");
    }
    
    const data = examenSchema.partial().parse(req.body);
    
    const examen = await prisma.examen.update({
      where: { id },
      data: {
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : undefined
      },
      include: {
        paciente: {
          select: {
            id: true,
            rut: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    res.json({
      message: "Examen actualizado exitosamente",
      examen
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

