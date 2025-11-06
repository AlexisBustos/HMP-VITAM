import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
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
        where: { id: data.userId as string }
      });
      
      if (!user) {
        throw new AppError(400, "Usuario no encontrado");
      }
      
      // Check if user already has a paciente
      const existingPaciente = await prisma.paciente.findFirst({
        where: { userId: data.userId as string }
      });
      
      if (existingPaciente) {
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

export async function getPacientes(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    
    // PERSONA_NATURAL solo puede ver su propio paciente
    if (user.roles.includes("PERSON")) {
      const paciente = await prisma.paciente.findFirst({
        where: { userId: user.userId },
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

export async function getPaciente(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    const user = req.user!;
    
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
    if (user.roles.includes("PERSON") && paciente.userId !== user.userId) {
      throw new AppError(403, "No tiene permisos para ver este paciente");
    }
    
    res.json({ paciente });
  } catch (error) {
    throw error;
  }
}

export async function updatePaciente(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    const user = req.user!;
    
    const existing = await prisma.paciente.findUnique({
      where: { id }
    });
    
    if (!existing) {
      throw new AppError(404, "Paciente no encontrado");
    }
    
    // PERSONA_NATURAL solo puede actualizar su propio paciente y solo datos básicos
    if (user.roles.includes("PERSON")) {
      if (existing.userId !== user.userId) {
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



/**
 * GET /me/patient
 * Get the patient record for the authenticated PERSON user
 */
export async function getMyPatient(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;

    if (!user.patientId) {
      return res.status(404).json({
        success: false,
        message: 'No patient record found for your account',
        suggestion: 'Please contact support to complete your registration',
      });
    }

    const paciente = await prisma.paciente.findUnique({
      where: { id: user.patientId },
      include: {
        consultas: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        examenes: {
          orderBy: { fecha: 'desc' },
          take: 10,
        },
        seguimientos: {
          orderBy: { fecha: 'desc' },
          take: 10,
        },
        surveyResponses: {
          include: {
            template: {
              select: {
                code: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found',
      });
    }

    res.json({
      success: true,
      data: paciente,
    });
  } catch (error) {
    console.error('Error getting patient record:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get patient record',
    });
  }
}

