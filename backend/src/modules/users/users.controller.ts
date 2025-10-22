import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { AppError } from "../common/error.handler";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    res.json({ users });
  } catch (error) {
    throw error;
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      throw new AppError(400, "ID inválido");
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            id: true,
            name: true
          }
        },
        paciente: {
          select: {
            id: true,
            rut: true,
            firstName: true,
            lastName: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }
    
    res.json({ user });
  } catch (error) {
    throw error;
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const { roleId } = req.body;
    
    if (isNaN(id) || !roleId) {
      throw new AppError(400, "ID o roleId inválido");
    }
    
    // Verificar que el rol existe
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });
    
    if (!role) {
      throw new AppError(400, "Role ID inválido");
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: { roleId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    res.json({
      message: "Rol actualizado exitosamente",
      user
    });
  } catch (error) {
    throw error;
  }
}

export async function getRoles(req: Request, res: Response) {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { id: "asc" }
    });
    
    res.json({ roles });
  } catch (error) {
    throw error;
  }
}

