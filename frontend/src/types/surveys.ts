/**
 * Tipos TypeScript para módulo de encuestas estandarizadas
 */

export type LicenseType = 'OPEN' | 'PERMISSION' | 'PAID' | 'NON_COMMERCIAL';

export type ResponseType = 
  | 'LIKERT_0_3'    // 0-3 (PHQ-9, GAD-7)
  | 'LIKERT_0_4'    // 0-4 (K10)
  | 'LIKERT_1_5'    // 1-5 (WHO-5, PROMIS)
  | 'LIKERT_1_10'   // 1-10 (SEMCD)
  | 'VAS_0_100'     // Visual Analog Scale
  | 'YES_NO'
  | 'MULTIPLE_CHOICE'
  | 'NUMERIC';

export type AlertSeverity = 'INFO' | 'WARN' | 'CRITICAL';

export interface Survey {
  id: number;
  code: string;
  name: string;
  version: string;
  ownerOrg: string;
  licenseType: LicenseType;
  licenseNotes?: string;
  language: string;
  active: boolean;
  estimatedMins?: number;
  loincCode?: string;
  items: SurveyItem[];
  scoringRules: SurveyScoring[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SurveyItem {
  id: number;
  surveyId: number;
  itemCode: string;
  orderNum: number;
  text: string;
  responseType: ResponseType;
  optionsJson?: string;
  reverseScored: boolean;
  subscale?: string;
  required: boolean;
}

export interface SurveySession {
  id: number;
  patientId: number;
  patientName?: string;
  surveyId: number;
  surveyCode?: string;
  surveyName?: string;
  clinicianId?: number;
  clinicianName?: string;
  startedAt: Date;
  completedAt?: Date;
  contextJson?: string;
  consentId?: number;
  responses: SurveyResponse[];
  scores?: SurveyScore;
  alerts: SurveyAlert[];
}

export interface SurveyResponse {
  id: number;
  sessionId: number;
  itemId: number;
  itemCode?: string;
  itemText?: string;
  valueRaw: string;
  valueNorm?: number;
  answeredAt: Date;
}

export interface SurveyScore {
  id: number;
  sessionId: number;
  totalScore?: number;
  subscaleScores?: Record<string, number>;
  severityBand?: string;
  tScore?: number;
  percentile?: number;
  interpretation?: string;
  createdAt: Date;
}

export interface SurveyAlert {
  id: number;
  sessionId: number;
  ruleCode: string;
  severity: AlertSeverity;
  message: string;
  actionPlan?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: number;
}

export interface SurveyScoring {
  id: number;
  surveyId: number;
  bandName: string;
  minScore: number;
  maxScore: number;
  interpretation: string;
  colorCode?: string;
}

export interface ResponseOption {
  value: number | string;
  label: string;
}

export interface SurveyContext {
  motivo?: string;
  patologiaRelacionada?: string;
  notas?: string;
}

// Tipos para análisis y visualización
export interface SurveyTrend {
  sessionId: number;
  date: Date;
  totalScore: number;
  severityBand: string;
  colorCode: string;
}

export interface SurveyStats {
  surveyCode: string;
  surveyName: string;
  totalSessions: number;
  completedSessions: number;
  avgScore: number;
  lastScore?: number;
  trend: 'improving' | 'stable' | 'worsening' | 'unknown';
  lastCompletedAt?: Date;
}

export interface PatientSurveyHistory {
  patientId: number;
  patientName: string;
  surveys: {
    [surveyCode: string]: {
      sessions: SurveySession[];
      trends: SurveyTrend[];
      stats: SurveyStats;
    };
  };
}

// Tipos para configuración de frecuencia
export interface SurveyFrequencyConfig {
  surveyCode: string;
  condition: string;
  frequencyDays: number;
  description: string;
}

export const SURVEY_FREQUENCIES: SurveyFrequencyConfig[] = [
  { surveyCode: 'PHQ9', condition: 'Depresión', frequencyDays: 60, description: 'Cada 60 días para trastornos del ánimo' },
  { surveyCode: 'GAD7', condition: 'Ansiedad', frequencyDays: 60, description: 'Cada 60 días para trastornos de ansiedad' },
  { surveyCode: 'K10', condition: 'Distrés psicológico', frequencyDays: 90, description: 'Cada 90 días para screening general' },
  { surveyCode: 'WHO5', condition: 'Bienestar general', frequencyDays: 90, description: 'Cada 90 días para evaluación de bienestar' },
  { surveyCode: 'AUDIT', condition: 'Consumo de alcohol', frequencyDays: 90, description: 'Cada 90 días para trastornos por uso de sustancias' },
  { surveyCode: 'FTND', condition: 'Dependencia nicotina', frequencyDays: 90, description: 'Cada 90 días para cesación tabáquica' },
  { surveyCode: 'PSS10', condition: 'Estrés percibido', frequencyDays: 90, description: 'Cada 90 días para manejo de estrés' },
  { surveyCode: 'PROMIS_GH10', condition: 'Salud global', frequencyDays: 90, description: 'Cada 90 días para condiciones crónicas' },
  { surveyCode: 'PROMIS_SLEEP', condition: 'Alteración del sueño', frequencyDays: 90, description: 'Cada 90 días para trastornos del sueño' },
  { surveyCode: 'PROMIS_FATIGUE', condition: 'Fatiga', frequencyDays: 90, description: 'Cada 90 días para condiciones crónicas' },
  { surveyCode: 'MOS_SSS', condition: 'Apoyo social', frequencyDays: 90, description: 'Cada 90 días para evaluación psicosocial' },
  { surveyCode: 'SEMCD', condition: 'Autoeficacia', frequencyDays: 90, description: 'Cada 90 días para enfermedades crónicas' },
  { surveyCode: 'MARS5', condition: 'Adherencia medicamentos', frequencyDays: 90, description: 'Cada 90 días para tratamientos crónicos' },
  { surveyCode: 'VAS_ADHERENCE', condition: 'Adherencia medicamentos', frequencyDays: 90, description: 'Cada 90 días para tratamientos crónicos' }
];

// Mapeo de códigos LOINC
export const LOINC_MAPPING: Record<string, string> = {
  'PHQ9': '44249-1',
  'GAD7': '69737-5',
  'AUDIT': '75626-2',
  'FTND': '64396-7',
  'PROMIS_GH10': '71969-0',
  'PROMIS_SLEEP': '89207-4',
  'PROMIS_FATIGUE': '89208-2'
};

// Reglas de alerta clínica
export interface AlertRule {
  ruleCode: string;
  surveyCode: string;
  condition: (session: SurveySession) => boolean;
  severity: AlertSeverity;
  messageTemplate: string;
  actionPlan: string;
}

export const ALERT_RULES: AlertRule[] = [
  {
    ruleCode: 'PHQ9_SUICIDE_RISK',
    surveyCode: 'PHQ9',
    condition: (session) => {
      const item9 = session.responses.find(r => r.itemCode === 'P9');
      return !!(item9 && parseInt(item9.valueRaw) > 0);
    },
    severity: 'CRITICAL',
    messageTemplate: 'Riesgo de suicidio detectado (PHQ-9 ítem 9 > 0)',
    actionPlan: 'Evaluación inmediata de riesgo suicida. Considerar derivación urgente a salud mental. No dejar solo al paciente.'
  },
  {
    ruleCode: 'PHQ9_SEVERE',
    surveyCode: 'PHQ9',
    condition: (session) => {
      return (session.scores?.totalScore ?? 0) >= 20;
    },
    severity: 'CRITICAL',
    messageTemplate: 'Depresión severa detectada (PHQ-9 ≥ 20)',
    actionPlan: 'Tratamiento inmediato requerido. Considerar derivación a psiquiatría. Evaluar necesidad de hospitalización.'
  },
  {
    ruleCode: 'GAD7_SEVERE',
    surveyCode: 'GAD7',
    condition: (session) => {
      return (session.scores?.totalScore ?? 0) >= 15;
    },
    severity: 'WARN',
    messageTemplate: 'Ansiedad severa detectada (GAD-7 ≥ 15)',
    actionPlan: 'Intervención activa recomendada. Considerar terapia cognitivo-conductual y/o farmacoterapia.'
  },
  {
    ruleCode: 'K10_VERY_HIGH',
    surveyCode: 'K10',
    condition: (session) => {
      return (session.scores?.totalScore ?? 0) >= 30;
    },
    severity: 'CRITICAL',
    messageTemplate: 'Distrés psicológico muy alto (K10 ≥ 30)',
    actionPlan: 'Intervención urgente requerida. Evaluación psiquiátrica inmediata.'
  },
  {
    ruleCode: 'WHO5_LOW_WELLBEING',
    surveyCode: 'WHO5',
    condition: (session) => {
      return (session.scores?.totalScore ?? 100) < 50;
    },
    severity: 'WARN',
    messageTemplate: 'Bajo bienestar detectado (WHO-5 < 50)',
    actionPlan: 'Screening para depresión recomendado. Considerar aplicar PHQ-9.'
  },
  {
    ruleCode: 'AUDIT_DEPENDENCE',
    surveyCode: 'AUDIT',
    condition: (session) => {
      return (session.scores?.totalScore ?? 0) >= 20;
    },
    severity: 'CRITICAL',
    messageTemplate: 'Probable dependencia alcohólica (AUDIT ≥ 20)',
    actionPlan: 'Derivación a especialista en adicciones. Evaluación para tratamiento intensivo.'
  },
  {
    ruleCode: 'FTND_HIGH_DEPENDENCE',
    surveyCode: 'FTND',
    condition: (session) => {
      return (session.scores?.totalScore ?? 0) >= 8;
    },
    severity: 'WARN',
    messageTemplate: 'Alta dependencia a nicotina (FTND ≥ 8)',
    actionPlan: 'Tratamiento farmacológico + apoyo conductual intensivo recomendado para cesación.'
  },
  {
    ruleCode: 'MARS5_LOW_ADHERENCE',
    surveyCode: 'MARS5',
    condition: (session) => {
      return (session.scores?.totalScore ?? 25) < 20;
    },
    severity: 'WARN',
    messageTemplate: 'Baja adherencia a medicamentos (MARS-5 < 20)',
    actionPlan: 'Intervención educativa urgente. Identificar barreras para adherencia. Simplificar régimen si es posible.'
  },
  {
    ruleCode: 'VAS_LOW_ADHERENCE',
    surveyCode: 'VAS_ADHERENCE',
    condition: (session) => {
      const vas = session.responses[0];
      return !!(vas && parseInt(vas.valueRaw) < 80);
    },
    severity: 'WARN',
    messageTemplate: 'Adherencia autoreportada < 80%',
    actionPlan: 'Reforzar educación sobre importancia de adherencia. Evaluar efectos adversos y barreras.'
  }
];

