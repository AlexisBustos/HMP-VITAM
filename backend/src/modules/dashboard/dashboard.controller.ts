import { Request, Response } from "express";
import prisma from "../../config/prisma";

export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    // Pacientes activos (total)
    const totalPacientes = await prisma.paciente.count();
    
    // Exámenes totales
    const totalExamenes = await prisma.examen.count();
    
    // Exámenes alterados
    const examenesAlterados = await prisma.examen.count({
      where: {
        interpretacion: "alterado"
      }
    });
    
    // Porcentaje de exámenes alterados
    const porcentajeAlterados = totalExamenes > 0 
      ? ((examenesAlterados / totalExamenes) * 100).toFixed(2)
      : "0.00";
    
    // Controles pendientes (seguimientos con próximo control en el futuro)
    const now = new Date();
    const controlesPendientes = await prisma.seguimiento.count({
      where: {
        proximoCtrl: {
          gte: now
        }
      }
    });
    
    // Consultas del último mes
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const consultasUltimoMes = await prisma.consulta.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });
    
    // Distribución de patologías en seguimiento
    const seguimientos = await prisma.seguimiento.findMany({
      select: {
        patologia: true
      }
    });
    
    const patologiasCount: Record<string, number> = {};
    seguimientos.forEach(s => {
      patologiasCount[s.patologia] = (patologiasCount[s.patologia] || 0) + 1;
    });
    
    // Últimos pacientes registrados
    const ultimosPacientes = await prisma.paciente.findMany({
      select: {
        id: true,
        rut: true,
        firstName: true,
        lastName: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });
    
    res.json({
      metrics: {
        pacientesActivos: totalPacientes,
        totalExamenes,
        examenesAlterados,
        porcentajeExamenesAlterados: parseFloat(porcentajeAlterados),
        controlesPendientes,
        consultasUltimoMes
      },
      patologias: patologiasCount,
      ultimosPacientes
    });
  } catch (error) {
    throw error;
  }
}

