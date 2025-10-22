import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { loginSchema, registerSchema } from "../common/validators";
import { AppError } from "../common/error.handler";

const SALT_ROUNDS = 12;

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);
    
    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existing) {
      throw new AppError(400, "Email ya registrado");
    }
    
    // Verificar que el rol existe
    const role = await prisma.role.findUnique({
      where: { id: data.roleId }
    });
    
    if (!role) {
      throw new AppError(400, "Role ID inválido");
    }
    
    // Hash del password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId: data.roleId
      },
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
        createdAt: true
      }
    });
    
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        role: true
      }
    });
    
    if (!user) {
      throw new AppError(401, "Credenciales inválidas");
    }
    
    // Verificar password
    const isValid = await bcrypt.compare(data.password, user.password);
    
    if (!isValid) {
      throw new AppError(401, "Credenciales inválidas");
    }
    
    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role.name
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES || "1d" } as jwt.SignOptions
    );
    
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name
      }
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === "ZodError") {
      throw new AppError(400, error.errors[0].message);
    }
    throw error;
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const user = req.user!;
    
    // Generar nuevo token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES || "1d" } as jwt.SignOptions
    );
    
    res.json({
      message: "Token renovado",
      token
    });
  } catch (error) {
    throw error;
  }
}

