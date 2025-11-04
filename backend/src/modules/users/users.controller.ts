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
        rut: true,
        isActive: true,
        userRoles: {
          include: {
            role: true
          }
        },
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    // Transform to include roles array
    const transformedUsers = users.map(user => ({
      ...user,
      roles: user.userRoles.map(ur => ur.role.name),
      userRoles: undefined
    }));
    
    res.json({ users: transformedUsers });
  } catch (error) {
    throw error;
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        rut: true,
        phone: true,
        isActive: true,
        userRoles: {
          include: {
            role: true
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
    
    // Transform to include roles array
    const transformedUser = {
      ...user,
      roles: user.userRoles.map(ur => ur.role.name),
      userRoles: undefined
    };
    
    res.json({ user: transformedUser });
  } catch (error) {
    throw error;
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { roleName } = req.body;
    
    if (!id || !roleName) {
      throw new AppError(400, "ID o roleName inválido");
    }
    
    // Verificar que el rol existe
    const role = await prisma.role.findUnique({
      where: { name: roleName }
    });
    
    if (!role) {
      throw new AppError(400, "Role name inválido");
    }
    
    // Remove existing roles and add new one
    await prisma.userRole.deleteMany({
      where: { userId: id }
    });
    
    await prisma.userRole.create({
      data: {
        userId: id,
        roleId: role.id
      }
    });
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });
    
    if (!user) {
      throw new AppError(404, "Usuario no encontrado");
    }
    
    const transformedUser = {
      ...user,
      roles: user.userRoles.map(ur => ur.role.name),
      userRoles: undefined
    };
    
    res.json({
      message: "Rol actualizado exitosamente",
      user: transformedUser
    });
  } catch (error) {
    throw error;
  }
}

export async function getRoles(req: Request, res: Response) {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" }
    });
    
    res.json({ roles });
  } catch (error) {
    throw error;
  }
}

