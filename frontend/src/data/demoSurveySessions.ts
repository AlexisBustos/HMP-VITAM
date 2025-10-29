/**
 * Datos demo de sesiones de encuestas completadas
 */

import { SurveySession } from '../types/surveys';

export const demoSurveySessions: SurveySession[] = [
  // PHQ-9 - María González (Paciente 2) - Depresión moderada
  {
    id: 1,
    patientId: 2,
    patientName: 'María González Silva',
    surveyId: 1,
    surveyCode: 'PHQ9',
    surveyName: 'Patient Health Questionnaire-9',
    clinicianId: 1,
    clinicianName: 'Dr. Admin Demo',
    startedAt: new Date('2024-10-01T10:00:00'),
    completedAt: new Date('2024-10-01T10:05:00'),
    responses: [
      { id: 1, sessionId: 1, itemId: 1, itemCode: 'P1', itemText: 'Poco interés o placer en hacer cosas', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:01:00') },
      { id: 2, sessionId: 1, itemId: 2, itemCode: 'P2', itemText: 'Se ha sentido decaído(a), deprimido(a) o sin esperanzas', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:01:30') },
      { id: 3, sessionId: 1, itemId: 3, itemCode: 'P3', itemText: 'Ha tenido dificultad para quedarse o permanecer dormido(a)', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-01T10:02:00') },
      { id: 4, sessionId: 1, itemId: 4, itemCode: 'P4', itemText: 'Se ha sentido cansado(a) o con poca energía', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:02:30') },
      { id: 5, sessionId: 1, itemId: 5, itemCode: 'P5', itemText: 'Sin apetito o ha comido en exceso', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-01T10:03:00') },
      { id: 6, sessionId: 1, itemId: 6, itemCode: 'P6', itemText: 'Se ha sentido mal con usted mismo(a)', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:03:30') },
      { id: 7, sessionId: 1, itemId: 7, itemCode: 'P7', itemText: 'Ha tenido dificultad para concentrarse', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-01T10:04:00') },
      { id: 8, sessionId: 1, itemId: 8, itemCode: 'P8', itemText: 'Se ha movido o hablado tan lento', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-01T10:04:30') },
      { id: 9, sessionId: 1, itemId: 9, itemCode: 'P9', itemText: 'Pensamientos de que estaría mejor muerto(a)', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-01T10:05:00') }
    ],
    scores: {
      id: 1,
      sessionId: 1,
      totalScore: 11,
      severityBand: 'Moderada',
      interpretation: 'Depresión moderada - Considerar tratamiento',
      createdAt: new Date('2024-10-01T10:05:00')
    },
    alerts: [
      {
        id: 1,
        sessionId: 1,
        ruleCode: 'PHQ9_MODERATE',
        severity: 'WARN',
        message: 'Depresión moderada detectada (PHQ-9 = 11)',
        actionPlan: 'Considerar inicio de tratamiento psicoterapéutico y/o farmacológico. Reevaluar en 2 semanas.',
        createdAt: new Date('2024-10-01T10:05:00')
      }
    ]
  },

  // GAD-7 - María González (Paciente 2) - Ansiedad moderada
  {
    id: 2,
    patientId: 2,
    patientName: 'María González Silva',
    surveyId: 2,
    surveyCode: 'GAD7',
    surveyName: 'Generalized Anxiety Disorder-7',
    clinicianId: 1,
    startedAt: new Date('2024-10-01T10:10:00'),
    completedAt: new Date('2024-10-01T10:13:00'),
    responses: [
      { id: 10, sessionId: 2, itemId: 10, itemCode: 'G1', itemText: 'Sentirse nervioso(a), ansioso(a)', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:10:30') },
      { id: 11, sessionId: 2, itemId: 11, itemCode: 'G2', itemText: 'No ser capaz de parar o controlar su preocupación', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:11:00') },
      { id: 12, sessionId: 2, itemId: 12, itemCode: 'G3', itemText: 'Preocuparse demasiado por diferentes cosas', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:11:30') },
      { id: 13, sessionId: 2, itemId: 13, itemCode: 'G4', itemText: 'Dificultad para relajarse', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-01T10:12:00') },
      { id: 14, sessionId: 2, itemId: 14, itemCode: 'G5', itemText: 'Estar tan inquieto(a)', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-01T10:12:30') },
      { id: 15, sessionId: 2, itemId: 15, itemCode: 'G6', itemText: 'Irritarse o enojarse con facilidad', valueRaw: '2', valueNorm: 2, answeredAt: new Date('2024-10-01T10:12:50') },
      { id: 16, sessionId: 2, itemId: 16, itemCode: 'G7', itemText: 'Sentir miedo como si algo terrible fuera a pasar', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-01T10:13:00') }
    ],
    scores: {
      id: 2,
      sessionId: 2,
      totalScore: 11,
      severityBand: 'Moderada',
      interpretation: 'Ansiedad moderada - Considerar intervención',
      createdAt: new Date('2024-10-01T10:13:00')
    },
    alerts: [
      {
        id: 2,
        sessionId: 2,
        ruleCode: 'GAD7_MODERATE',
        severity: 'WARN',
        message: 'Ansiedad moderada detectada (GAD-7 = 11)',
        actionPlan: 'Considerar terapia cognitivo-conductual y técnicas de relajación. Reevaluar en 4 semanas.',
        createdAt: new Date('2024-10-01T10:13:00')
      }
    ]
  },

  // AUDIT - Juan Pérez (Paciente 1) - Bajo riesgo
  {
    id: 3,
    patientId: 1,
    patientName: 'Juan Pérez González',
    surveyId: 3,
    surveyCode: 'AUDIT',
    surveyName: 'Alcohol Use Disorders Identification Test',
    clinicianId: 1,
    startedAt: new Date('2024-10-05T14:00:00'),
    completedAt: new Date('2024-10-05T14:04:00'),
    responses: [
      { id: 17, sessionId: 3, itemId: 17, itemCode: 'A1', itemText: '¿Con qué frecuencia consume alcohol?', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-05T14:00:30') },
      { id: 18, sessionId: 3, itemId: 18, itemCode: 'A2', itemText: '¿Cuántas consumiciones?', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:01:00') },
      { id: 19, sessionId: 3, itemId: 19, itemCode: 'A3', itemText: '¿6 o más bebidas?', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:01:30') },
      { id: 20, sessionId: 3, itemId: 20, itemCode: 'A4', itemText: 'Incapaz de parar de beber', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:02:00') },
      { id: 21, sessionId: 3, itemId: 21, itemCode: 'A5', itemText: 'No pudo hacer lo esperado', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:02:30') },
      { id: 22, sessionId: 3, itemId: 22, itemCode: 'A6', itemText: 'Beber en ayunas', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:03:00') },
      { id: 23, sessionId: 3, itemId: 23, itemCode: 'A7', itemText: 'Remordimientos', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:03:20') },
      { id: 24, sessionId: 3, itemId: 24, itemCode: 'A8', itemText: 'No recordar', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:03:40') },
      { id: 25, sessionId: 3, itemId: 25, itemCode: 'A9', itemText: 'Alguien herido', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:04:00') },
      { id: 26, sessionId: 3, itemId: 26, itemCode: 'A10', itemText: 'Preocupación de otros', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-05T14:04:20') }
    ],
    scores: {
      id: 3,
      sessionId: 3,
      totalScore: 1,
      subscaleScores: { consumo: 1, dependencia: 0, dano: 0 },
      severityBand: 'Bajo Riesgo',
      interpretation: 'Consumo de bajo riesgo',
      createdAt: new Date('2024-10-05T14:04:20')
    },
    alerts: []
  },

  // PHQ-9 - María González (seguimiento 30 días después) - Mejorando
  {
    id: 4,
    patientId: 2,
    patientName: 'María González Silva',
    surveyId: 1,
    surveyCode: 'PHQ9',
    surveyName: 'Patient Health Questionnaire-9',
    clinicianId: 1,
    startedAt: new Date('2024-11-01T10:00:00'),
    completedAt: new Date('2024-11-01T10:05:00'),
    responses: [
      { id: 27, sessionId: 4, itemId: 1, itemCode: 'P1', itemText: 'Poco interés o placer en hacer cosas', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-11-01T10:01:00') },
      { id: 28, sessionId: 4, itemId: 2, itemCode: 'P2', itemText: 'Se ha sentido decaído(a), deprimido(a)', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-11-01T10:01:30') },
      { id: 29, sessionId: 4, itemId: 3, itemCode: 'P3', itemText: 'Dificultad para dormir', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-11-01T10:02:00') },
      { id: 30, sessionId: 4, itemId: 4, itemCode: 'P4', itemText: 'Cansado(a) o con poca energía', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-11-01T10:02:30') },
      { id: 31, sessionId: 4, itemId: 5, itemCode: 'P5', itemText: 'Sin apetito', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-11-01T10:03:00') },
      { id: 32, sessionId: 4, itemId: 6, itemCode: 'P6', itemText: 'Sentirse mal consigo mismo', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-11-01T10:03:30') },
      { id: 33, sessionId: 4, itemId: 7, itemCode: 'P7', itemText: 'Dificultad para concentrarse', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-11-01T10:04:00') },
      { id: 34, sessionId: 4, itemId: 8, itemCode: 'P8', itemText: 'Movimiento lento', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-11-01T10:04:30') },
      { id: 35, sessionId: 4, itemId: 9, itemCode: 'P9', itemText: 'Pensamientos de muerte', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-11-01T10:05:00') }
    ],
    scores: {
      id: 4,
      sessionId: 4,
      totalScore: 5,
      severityBand: 'Leve',
      interpretation: 'Depresión leve',
      createdAt: new Date('2024-11-01T10:05:00')
    },
    alerts: []
  },

  // PHQ-9 - Pedro Martínez (Paciente 3) - Mínima
  {
    id: 5,
    patientId: 3,
    patientName: 'Pedro Martínez López',
    surveyId: 1,
    surveyCode: 'PHQ9',
    surveyName: 'Patient Health Questionnaire-9',
    clinicianId: 1,
    startedAt: new Date('2024-10-15T09:00:00'),
    completedAt: new Date('2024-10-15T09:04:00'),
    responses: [
      { id: 36, sessionId: 5, itemId: 1, itemCode: 'P1', itemText: 'Poco interés', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:00:30') },
      { id: 37, sessionId: 5, itemId: 2, itemCode: 'P2', itemText: 'Deprimido', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:01:00') },
      { id: 38, sessionId: 5, itemId: 3, itemCode: 'P3', itemText: 'Dificultad dormir', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:01:30') },
      { id: 39, sessionId: 5, itemId: 4, itemCode: 'P4', itemText: 'Cansado', valueRaw: '1', valueNorm: 1, answeredAt: new Date('2024-10-15T09:02:00') },
      { id: 40, sessionId: 5, itemId: 5, itemCode: 'P5', itemText: 'Sin apetito', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:02:30') },
      { id: 41, sessionId: 5, itemId: 6, itemCode: 'P6', itemText: 'Mal consigo mismo', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:03:00') },
      { id: 42, sessionId: 5, itemId: 7, itemCode: 'P7', itemText: 'Concentración', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:03:30') },
      { id: 43, sessionId: 5, itemId: 8, itemCode: 'P8', itemText: 'Movimiento', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:03:50') },
      { id: 44, sessionId: 5, itemId: 9, itemCode: 'P9', itemText: 'Pensamientos muerte', valueRaw: '0', valueNorm: 0, answeredAt: new Date('2024-10-15T09:04:00') }
    ],
    scores: {
      id: 5,
      sessionId: 5,
      totalScore: 1,
      severityBand: 'Mínima',
      interpretation: 'Síntomas mínimos de depresión',
      createdAt: new Date('2024-10-15T09:04:00')
    },
    alerts: []
  }
];

export default demoSurveySessions;

