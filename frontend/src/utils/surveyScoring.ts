/**
 * Utilidades para cálculo de puntajes y scoring de encuestas
 */

import type { 
  Survey, 
  SurveySession, 
  SurveyResponse, 
  SurveyScore, 
  SurveyAlert,
  SurveyScoring,
  ResponseType 
} from '../types/surveys';
import { ALERT_RULES } from '../types/surveys';

/**
 * Calcula el puntaje de una sesión de encuesta
 */
export function calculateSurveyScore(
  survey: Survey,
  responses: SurveyResponse[]
): SurveyScore {
  const surveyCode = survey.code;
  
  // Calcular puntaje según el tipo de encuesta
  switch (surveyCode) {
    case 'PHQ9':
    case 'GAD7':
      return calculateLikertSum(survey, responses);
    
    case 'K10':
    case 'PSS10':
      return calculateLikertSumWithReverse(survey, responses);
    
    case 'WHO5':
      return calculateWHO5Score(survey, responses);
    
    case 'AUDIT':
      return calculateAUDITScore(survey, responses);
    
    case 'FTND':
      return calculateFTNDScore(survey, responses);
    
    case 'PROMIS_GH10':
      return calculatePROMISGH10Score(survey, responses);
    
    case 'PROMIS_SLEEP':
    case 'PROMIS_FATIGUE':
      return calculatePROMISTScore(survey, responses);
    
    case 'MOS_SSS':
      return calculateMOSSSSScore(survey, responses);
    
    case 'SEMCD':
      return calculateSEMCDScore(survey, responses);
    
    case 'MARS5':
      return calculateMARS5Score(survey, responses);
    
    case 'VAS_ADHERENCE':
      return calculateVASScore(survey, responses);
    
    default:
      return calculateLikertSum(survey, responses);
  }
}

/**
 * Suma simple de Likert (PHQ-9, GAD-7)
 */
function calculateLikertSum(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const totalScore = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * Suma Likert con ítems invertidos (K10, PSS-10)
 */
function calculateLikertSumWithReverse(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  let totalScore = 0;
  
  responses.forEach(response => {
    const item = survey.items.find(i => i.id === response.itemId);
    const value = response.valueNorm ?? 0;
    
    if (item?.reverseScored) {
      // Para PSS-10: invertir escala 0-4
      const maxValue = 4;
      totalScore += maxValue - value;
    } else {
      totalScore += value;
    }
  });
  
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * WHO-5: Convertir a escala 0-100
 */
function calculateWHO5Score(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  // Suma raw (0-25), luego multiplicar por 4 para obtener 0-100
  const rawSum = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const totalScore = rawSum * 4;
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * AUDIT: Scoring específico por ítem
 */
function calculateAUDITScore(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const totalScore = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const severityBand = getSeverityBand(survey, totalScore);
  
  // Calcular sub-escalas
  const consumo = responses.slice(0, 3).reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const dependencia = responses.slice(3, 6).reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const dano = responses.slice(6, 10).reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    subscaleScores: { consumo, dependencia, dano },
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * FTND: Scoring específico
 */
function calculateFTNDScore(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const totalScore = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * PROMIS Global Health-10: Calcular sub-escalas física y mental
 */
function calculatePROMISGH10Score(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const physicalItems = responses.filter(r => {
    const item = survey.items.find(i => i.id === r.itemId);
    return item?.subscale === 'Physical';
  });
  
  const mentalItems = responses.filter(r => {
    const item = survey.items.find(i => i.id === r.itemId);
    return item?.subscale === 'Mental';
  });
  
  const physicalScore = physicalItems.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const mentalScore = mentalItems.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const totalScore = physicalScore + mentalScore;
  
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    subscaleScores: { physical: physicalScore, mental: mentalScore },
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * PROMIS T-Score (Sleep, Fatigue)
 * Nota: Implementación simplificada. Para T-scores precisos se requieren tablas de conversión IRT.
 */
function calculatePROMISTScore(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  let totalScore = 0;
  
  responses.forEach(response => {
    const item = survey.items.find(i => i.id === response.itemId);
    const value = response.valueNorm ?? 0;
    
    if (item?.reverseScored) {
      const maxValue = 5;
      totalScore += maxValue - value + 1;
    } else {
      totalScore += value;
    }
  });
  
  // Conversión aproximada a T-score (media=50, SD=10)
  // Fórmula simplificada: T = 50 + 10 * (raw - mean) / SD
  const itemCount = responses.length;
  const meanRaw = itemCount * 3; // Punto medio de escala 1-5
  const sdRaw = itemCount * 0.8;
  const tScore = Math.round(50 + 10 * (totalScore - meanRaw) / sdRaw);
  
  const severityBand = getSeverityBand(survey, tScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    tScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * MOS Social Support: Convertir a escala 0-100
 */
function calculateMOSSSSScore(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const rawSum = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const maxPossible = responses.length * 5;
  const totalScore = Math.round((rawSum / maxPossible) * 100);
  
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * SEMCD: Promedio de escala 1-10
 */
function calculateSEMCDScore(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const sum = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const totalScore = sum / responses.length;
  
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore: Math.round(totalScore * 10) / 10, // 1 decimal
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * MARS-5: Suma directa
 */
function calculateMARS5Score(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const totalScore = responses.reduce((sum, r) => sum + (r.valueNorm ?? 0), 0);
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * VAS: Valor directo 0-100
 */
function calculateVASScore(survey: Survey, responses: SurveyResponse[]): SurveyScore {
  const totalScore = responses[0]?.valueNorm ?? 0;
  const severityBand = getSeverityBand(survey, totalScore);
  
  return {
    id: 0,
    sessionId: 0,
    totalScore,
    severityBand: severityBand?.bandName,
    interpretation: severityBand?.interpretation,
    createdAt: new Date()
  };
}

/**
 * Obtener banda de severidad según puntaje
 */
function getSeverityBand(survey: Survey, score: number): SurveyScoring | undefined {
  return survey.scoringRules.find(
    rule => score >= rule.minScore && score <= rule.maxScore
  );
}

/**
 * Evaluar reglas de alerta clínica
 */
export function evaluateAlerts(session: SurveySession, survey: Survey): SurveyAlert[] {
  const alerts: SurveyAlert[] = [];
  
  const relevantRules = ALERT_RULES.filter(rule => rule.surveyCode === survey.code);
  
  for (const rule of relevantRules) {
    if (rule.condition(session)) {
      alerts.push({
        id: 0,
        sessionId: session.id,
        ruleCode: rule.ruleCode,
        severity: rule.severity,
        message: rule.messageTemplate,
        actionPlan: rule.actionPlan,
        createdAt: new Date()
      });
    }
  }
  
  return alerts;
}

/**
 * Normalizar valor de respuesta según tipo
 */
export function normalizeResponseValue(responseType: ResponseType, rawValue: string): number {
  switch (responseType) {
    case 'LIKERT_0_3':
    case 'LIKERT_0_4':
      return parseInt(rawValue);
    
    case 'LIKERT_1_5':
    case 'LIKERT_1_10':
      return parseInt(rawValue);
    
    case 'VAS_0_100':
      return parseInt(rawValue);
    
    case 'YES_NO':
      return rawValue === 'yes' ? 1 : 0;
    
    case 'MULTIPLE_CHOICE':
    case 'NUMERIC':
      return parseInt(rawValue);
    
    default:
      return 0;
  }
}

/**
 * Obtener opciones de respuesta según tipo
 */
export function getResponseOptions(responseType: ResponseType, optionsJson?: string): any[] {
  if (optionsJson) {
    try {
      return JSON.parse(optionsJson);
    } catch {
      // Continuar con opciones por defecto
    }
  }
  
  switch (responseType) {
    case 'LIKERT_0_3':
      return [
        { value: 0, label: 'Nunca' },
        { value: 1, label: 'Varios días' },
        { value: 2, label: 'Más de la mitad de los días' },
        { value: 3, label: 'Casi todos los días' }
      ];
    
    case 'LIKERT_0_4':
      return [
        { value: 0, label: 'Nunca' },
        { value: 1, label: 'Pocas veces' },
        { value: 2, label: 'Algunas veces' },
        { value: 3, label: 'La mayoría del tiempo' },
        { value: 4, label: 'Todo el tiempo' }
      ];
    
    case 'LIKERT_1_5':
      return [
        { value: 1, label: 'Nada' },
        { value: 2, label: 'Un poco' },
        { value: 3, label: 'Algo' },
        { value: 4, label: 'Bastante' },
        { value: 5, label: 'Mucho' }
      ];
    
    case 'LIKERT_1_10':
      return Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}`
      }));
    
    case 'YES_NO':
      return [
        { value: 'yes', label: 'Sí' },
        { value: 'no', label: 'No' }
      ];
    
    case 'VAS_0_100':
      return [
        { value: 0, label: '0%' },
        { value: 25, label: '25%' },
        { value: 50, label: '50%' },
        { value: 75, label: '75%' },
        { value: 100, label: '100%' }
      ];
    
    default:
      return [];
  }
}

/**
 * Validar que todas las respuestas requeridas estén completas
 */
export function validateSurveyCompletion(survey: Survey, responses: SurveyResponse[]): {
  isComplete: boolean;
  missingItems: string[];
} {
  const requiredItems = survey.items.filter(item => item.required);
  const answeredItemIds = new Set(responses.map(r => r.itemId));
  
  const missingItems = requiredItems
    .filter(item => !answeredItemIds.has(item.id))
    .map(item => item.itemCode);
  
  return {
    isComplete: missingItems.length === 0,
    missingItems
  };
}

/**
 * Calcular tendencia entre dos puntajes
 */
export function calculateTrend(previousScore: number, currentScore: number): 'improving' | 'stable' | 'worsening' {
  const diff = currentScore - previousScore;
  const threshold = 0.1 * previousScore; // 10% de cambio
  
  if (Math.abs(diff) < threshold) {
    return 'stable';
  }
  
  // Para escalas donde mayor = peor (PHQ-9, GAD-7, etc.)
  return diff < 0 ? 'improving' : 'worsening';
}

