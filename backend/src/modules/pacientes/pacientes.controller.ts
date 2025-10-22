import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { pacienteSchema } from "../common/validators";
import { AppError } from "../common/error.handler";

export async function createPaciente(req: Request, res: Response) {
  try {
    const data = pacienteSchema.parse(req.body);
    
    // Verificar si el RUT ya existe
    const existing = await prisma.paciente.findUnique({
      where: { rut: data.rut }
    });
    
    if (existing) {
      throw new AppError(400, "RUT ya registrado");
    }
    
    // Si se proporciona userId, verificar que existe y no está asignado
    if (data.userId) {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        include: { paciente: true }
      });
      
      if (!user) {
        throw new AppError(400, "Usuario no encontrado");
      }
      
      if (user.paciente) {
        throw new AppError(400, "Usuario ya tiene un paciente asignado");
      }
    }
    
    const paciente = await prisma.paciente.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate)
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    res.status(201).json({
      message: "Paciente creado exitosamente",
      paciente
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

export async function getPacientes(req: Request, res: Response) {
  try {
    const user = req.user!;
    
    // PERSONA_NATURAL solo puede ver su propio paciente
    if (user.role === "PERSONA_NATURAL") {
      const paciente = await prisma.paciente.findFirst({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      return res.json({ pacientes: paciente ? [paciente] : [] });
    }
    
    // ADMIN_GENERAL y ADMIN_PRO_CLINICO pueden ver todos
    const pacientes = await prisma.paciente.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            consultas: true,
            examenes: true,
            seguimientos: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    res.json({ pacientes });
  } catch (error) {
    throw error;
  }
}

export async function getPaciente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user!;
    
    if (isNaN(id)) {
      throw new AppError(400, "ID inválido");
    }
    
    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        consultas: {
          orderBy: { createdAt: "desc" },
          take: 10
        },
        examenes: {
          orderBy: { fecha: "desc" },
          take: 10
        },
        seguimientos: {
          orderBy: { fecha: "desc" },
          take: 10
        }
      }
    });
    
    if (!paciente) {
      throw new AppError(404, "Paciente no encontrado");
    }
    
    // PERSONA_NATURAL solo puede ver su propio paciente
    if (user.role === "PERSONA_NATURAL" && paciente.userId !== user.id) {
      throw new AppError(403, "No tiene permisos para ver este paciente");
    }
    
    res.json({ paciente });
  } catch (error) {
    throw error;
  }
}

export async function updatePaciente(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const user = req.user!;
    
    if (isNaN(id)) {
      throw new AppError(400, "ID inválido");
    }
    
    const existing = await prisma.paciente.findUnique({
      where: { id }
    });
    
    if (!existing) {
      throw new AppError(404, "Paciente no encontrado");
    }
    
    // PERSONA_NATURAL solo puede actualizar su propio paciente y solo datos básicos
    if (user.role === "PERSONA_NATURAL") {
      if (existing.userId !== user.id) {
        throw new AppError(403, "No tiene permisos para actualizar este paciente");
      }
      
      // Solo permitir actualizar datos personales básicos
      const allowedFields = ["address", "city", "region", "phone", "email", "emergency"];
      const updateData: any = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }
      
      const paciente = await prisma.paciente.update({
        where: { id },
        data: updateData
      });
      
      return res.json({
        message: "Paciente actualizado exitosamente",
        paciente
      });
    }
    
    // ADMIN_GENERAL y ADMIN_PRO_CLINICO pueden actualizar todo
    const data = pacienteSchema.partial().parse(req.body);
    
    const paciente = await prisma.paciente.update({
      where: { id },
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    res.json({
      message: "Paciente actualizado exitosamente",
      paciente
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

