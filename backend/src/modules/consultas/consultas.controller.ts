import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { consultaSchema } from "../common/validators";
import { AppError } from "../common/error.handler";

export async function createConsulta(req: Request, res: Response) {
  try {
    const user = req.user!;
    const data = consultaSchema.parse({
      ...req.body,
      createdBy: user.id
    });
    
    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: data.pacienteId }
    });
    
    if (!paciente) {
      throw new AppError(404, "Paciente no encontrado");
    }
    
    const consulta = await prisma.consulta.create({
      data,
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
      message: "Consulta registrada exitosamente",
      consulta
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

export async function getConsultas(req: Request, res: Response) {
  try {
    const { pacienteId } = req.query;
    
    const where: any = {};
    
    if (pacienteId) {
      const id = parseInt(pacienteId as string);
      if (isNaN(id)) {
        throw new AppError(400, "pacienteId inválido");
      }
      where.pacienteId = id;
    }
    
    const consultas = await prisma.consulta.findMany({
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
        createdAt: "desc"
      }
    });
    
    res.json({ consultas });
  } catch (error) {
    throw error;
  }
}

export async function getConsulta(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new AppError(400, "ID inválido");
    }
    
    const consulta = await prisma.consulta.findUnique({
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
    
    if (!consulta) {
      throw new AppError(404, "Consulta no encontrada");
    }
    
    res.json({ consulta });
  } catch (error) {
    throw error;
  }
}

