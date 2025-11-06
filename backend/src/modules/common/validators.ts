import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Password debe tener al menos 6 caracteres")
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(10, "Password debe tener al menos 10 caracteres"),
  firstName: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "Apellido debe tener al menos 2 caracteres"),
  roleId: z.number().int().positive("Role ID debe ser un número positivo")
});

export const pacienteSchema = z.object({
  rut: z.string().min(8, "RUT inválido"),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  birthDate: z.string().datetime().or(z.date()),
  sex: z.enum(["M", "F", "Otro"]),
  genderId: z.string().optional(),
  marital: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  education: z.string().optional(),
  emergency: z.string().optional(),
  chronic: z.string().optional(),
  allergies: z.string().optional(),
  surgeries: z.string().optional(),
  meds: z.string().optional(),
  familyHx: z.string().optional(),
  habits: z.string().optional(),
  anthropo: z.string().optional(),
  vitals: z.string().optional(),
  mental: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().uuid().optional()
});

export const consultaSchema = z.object({
  pacienteId: z.number().int().positive(),
  motivo: z.string().min(5, "Motivo debe tener al menos 5 caracteres"),
  cie10: z.string().optional(),
  indicaciones: z.string().optional(),
  medsIndicadas: z.string().optional(),
  createdBy: z.number().int().positive()
});

export const examenSchema = z.object({
  pacienteId: z.number().int().positive(),
  tipo: z.string().min(2),
  fecha: z.string().datetime().or(z.date()),
  resultados: z.string().optional(),
  referencia: z.string().optional(),
  interpretacion: z.enum(["normal", "alterado", "pendiente"]).optional(),
  notas: z.string().optional()
});

export const seguimientoSchema = z.object({
  pacienteId: z.number().int().positive(),
  patologia: z.enum(["HTA", "DM2", "DISLI", "OBESIDAD", "SALUD_MENTAL"]),
  fecha: z.string().datetime().or(z.date()),
  parametros: z.string().optional(),
  adherencia: z.string().optional(),
  notas: z.string().optional(),
  proximoCtrl: z.string().datetime().or(z.date()).optional()
});

