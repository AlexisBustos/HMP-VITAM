import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { seguimientoSchema } from "../common/validators";
import { AppError } from "../common/error.handler";

export async function createSeguimiento(req: Request, res: Response) {
  try {
    const data = seguimientoSchema.parse(req.body);
    
    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: data.pacienteId }
    });
    
    if (!paciente) {
      throw new AppError(404, "Paciente no encontrado");
    }
    
    const seguimiento = await prisma.seguimiento.create({
      data: {
        ...data,
        fecha: new Date(data.fecha),
        proximoCtrl: data.proximoCtrl ? new Date(data.proximoCtrl) : null
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
      message: "Seguimiento registrado exitosamente",
      seguimiento
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

export async function getSeguimientos(req: Request, res: Response) {
  try {
    const { pacienteId, patologia } = req.query;
    
    const where: any = {};
    
    if (pacienteId) {
      const id = parseInt(pacienteId as string);
      where.pacienteId = id;
    }
    
    if (patologia) {
      where.patologia = patologia;
    }
    
    const seguimientos = await prisma.seguimiento.findMany({
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
    
    res.json({ seguimientos });
  } catch (error) {
    throw error;
  }
}

export async function getSeguimiento(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    
    const seguimiento = await prisma.seguimiento.findUnique({
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
    
    if (!seguimiento) {
      throw new AppError(404, "Seguimiento no encontrado");
    }
    
    res.json({ seguimiento });
  } catch (error) {
    throw error;
  }
}

export async function updateSeguimiento(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    
    const existing = await prisma.seguimiento.findUnique({
      where: { id }
    });
    
    if (!existing) {
      throw new AppError(404, "Seguimiento no encontrado");
    }
    
    const data = seguimientoSchema.partial().parse(req.body);
    
    const seguimiento = await prisma.seguimiento.update({
      where: { id },
      data: {
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
        proximoCtrl: data.proximoCtrl ? new Date(data.proximoCtrl) : undefined
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
      message: "Seguimiento actualizado exitosamente",
      seguimiento
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

