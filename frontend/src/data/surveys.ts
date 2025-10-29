/**
 * Datos de instrumentos estandarizados para modo demo
 * Basado en seed-surveys.ts del backend
 */

const surveysData = [
  // ============ SALUD MENTAL ============
  {
    id: 1,
    code: 'PHQ9',
    name: 'Patient Health Questionnaire-9 (Cuestionario de Salud del Paciente-9)',
    version: '1.0',
    ownerOrg: 'Pfizer Inc.',
    licenseType: 'OPEN' as const,
    licenseNotes: 'Dominio público. Desarrollado por Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke.',
    language: 'es-CL',
    active: true,
    estimatedMins: 3,
    loincCode: '44249-1',
    items: [
      { id: 1, surveyId: 1, itemCode: 'P1', orderNum: 1, text: 'Poco interés o placer en hacer cosas', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 2, surveyId: 1, itemCode: 'P2', orderNum: 2, text: 'Se ha sentido decaído(a), deprimido(a) o sin esperanzas', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 3, surveyId: 1, itemCode: 'P3', orderNum: 3, text: 'Ha tenido dificultad para quedarse o permanecer dormido(a), o ha dormido demasiado', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 4, surveyId: 1, itemCode: 'P4', orderNum: 4, text: 'Se ha sentido cansado(a) o con poca energía', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 5, surveyId: 1, itemCode: 'P5', orderNum: 5, text: 'Sin apetito o ha comido en exceso', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 6, surveyId: 1, itemCode: 'P6', orderNum: 6, text: 'Se ha sentido mal con usted mismo(a) o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 7, surveyId: 1, itemCode: 'P7', orderNum: 7, text: 'Ha tenido dificultad para concentrarse en cosas, tales como leer el periódico o ver la televisión', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 8, surveyId: 1, itemCode: 'P8', orderNum: 8, text: 'Se ha movido o hablado tan lento que otras personas podrían haberlo notado, o lo contrario - muy inquieto(a) o agitado(a) que ha estado moviéndose mucho más de lo normal', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 9, surveyId: 1, itemCode: 'P9', orderNum: 9, text: 'Pensamientos de que estaría mejor muerto(a) o de lastimarse de alguna manera', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true }
    ],
    scoringRules: [
      { id: 1, surveyId: 1, bandName: 'Mínima', minScore: 0, maxScore: 4, interpretation: 'Síntomas mínimos de depresión', colorCode: 'green' },
      { id: 2, surveyId: 1, bandName: 'Leve', minScore: 5, maxScore: 9, interpretation: 'Depresión leve', colorCode: 'yellow' },
      { id: 3, surveyId: 1, bandName: 'Moderada', minScore: 10, maxScore: 14, interpretation: 'Depresión moderada - Considerar tratamiento', colorCode: 'orange' },
      { id: 4, surveyId: 1, bandName: 'Moderadamente Severa', minScore: 15, maxScore: 19, interpretation: 'Depresión moderadamente severa - Tratamiento activo recomendado', colorCode: 'red' },
      { id: 5, surveyId: 1, bandName: 'Severa', minScore: 20, maxScore: 27, interpretation: 'Depresión severa - Tratamiento inmediato requerido', colorCode: 'red' }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  
  {
    id: 2,
    code: 'GAD7',
    name: 'Generalized Anxiety Disorder-7 (Trastorno de Ansiedad Generalizada-7)',
    version: '1.0',
    ownerOrg: 'Pfizer Inc.',
    licenseType: 'OPEN' as const,
    licenseNotes: 'Dominio público. Desarrollado por Drs. Robert L. Spitzer, Kurt Kroenke, Janet B.W. Williams, Bernd Löwe.',
    language: 'es-CL',
    active: true,
    estimatedMins: 2,
    loincCode: '69737-5',
    items: [
      { id: 10, surveyId: 2, itemCode: 'G1', orderNum: 1, text: 'Sentirse nervioso(a), ansioso(a) o con los nervios de punta', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 11, surveyId: 2, itemCode: 'G2', orderNum: 2, text: 'No ser capaz de parar o controlar su preocupación', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 12, surveyId: 2, itemCode: 'G3', orderNum: 3, text: 'Preocuparse demasiado por diferentes cosas', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 13, surveyId: 2, itemCode: 'G4', orderNum: 4, text: 'Dificultad para relajarse', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 14, surveyId: 2, itemCode: 'G5', orderNum: 5, text: 'Estar tan inquieto(a) que es difícil quedarse quieto(a)', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 15, surveyId: 2, itemCode: 'G6', orderNum: 6, text: 'Irritarse o enojarse con facilidad', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true },
      { id: 16, surveyId: 2, itemCode: 'G7', orderNum: 7, text: 'Sentir miedo como si algo terrible fuera a pasar', responseType: 'LIKERT_0_3' as const, reverseScored: false, required: true }
    ],
    scoringRules: [
      { id: 6, surveyId: 2, bandName: 'Mínima', minScore: 0, maxScore: 4, interpretation: 'Ansiedad mínima', colorCode: 'green' },
      { id: 7, surveyId: 2, bandName: 'Leve', minScore: 5, maxScore: 9, interpretation: 'Ansiedad leve', colorCode: 'yellow' },
      { id: 8, surveyId: 2, bandName: 'Moderada', minScore: 10, maxScore: 14, interpretation: 'Ansiedad moderada - Considerar intervención', colorCode: 'orange' },
      { id: 9, surveyId: 2, bandName: 'Severa', minScore: 15, maxScore: 21, interpretation: 'Ansiedad severa - Intervención activa recomendada', colorCode: 'red' }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  {
    id: 3,
    code: 'AUDIT',
    name: 'Alcohol Use Disorders Identification Test (Test de Identificación de Trastornos por Uso de Alcohol)',
    version: '1.0',
    ownerOrg: 'World Health Organization',
    licenseType: 'OPEN' as const,
    licenseNotes: 'Dominio público. Desarrollado por WHO.',
    language: 'es-CL',
    active: true,
    estimatedMins: 3,
    loincCode: '75626-2',
    items: [
      { id: 17, surveyId: 3, itemCode: 'A1', orderNum: 1, text: '¿Con qué frecuencia consume alguna bebida alcohólica?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true, optionsJson: JSON.stringify([{value:0,label:'Nunca'},{value:1,label:'Una vez al mes o menos'},{value:2,label:'2-4 veces al mes'},{value:3,label:'2-3 veces por semana'},{value:4,label:'4 o más veces por semana'}]) },
      { id: 18, surveyId: 3, itemCode: 'A2', orderNum: 2, text: '¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true, optionsJson: JSON.stringify([{value:0,label:'1-2'},{value:1,label:'3-4'},{value:2,label:'5-6'},{value:3,label:'7-9'},{value:4,label:'10 o más'}]) },
      { id: 19, surveyId: 3, itemCode: 'A3', orderNum: 3, text: '¿Con qué frecuencia toma 6 o más bebidas alcohólicas en un solo día?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true, optionsJson: JSON.stringify([{value:0,label:'Nunca'},{value:1,label:'Menos de una vez al mes'},{value:2,label:'Mensualmente'},{value:3,label:'Semanalmente'},{value:4,label:'A diario o casi a diario'}]) },
      { id: 20, surveyId: 3, itemCode: 'A4', orderNum: 4, text: '¿Con qué frecuencia en el curso del último año ha sido incapaz de parar de beber una vez había empezado?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true },
      { id: 21, surveyId: 3, itemCode: 'A5', orderNum: 5, text: '¿Con qué frecuencia en el curso del último año no pudo hacer lo que se esperaba de usted porque había bebido?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true },
      { id: 22, surveyId: 3, itemCode: 'A6', orderNum: 6, text: '¿Con qué frecuencia en el curso del último año ha necesitado beber en ayunas para recuperarse después de haber bebido mucho el día anterior?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true },
      { id: 23, surveyId: 3, itemCode: 'A7', orderNum: 7, text: '¿Con qué frecuencia en el curso del último año ha tenido remordimientos o sentimientos de culpa después de haber bebido?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true },
      { id: 24, surveyId: 3, itemCode: 'A8', orderNum: 8, text: '¿Con qué frecuencia en el curso del último año no ha podido recordar lo que sucedió la noche anterior porque había estado bebiendo?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true },
      { id: 25, surveyId: 3, itemCode: 'A9', orderNum: 9, text: '¿Usted o alguna otra persona ha resultado herido porque usted había bebido?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true, optionsJson: JSON.stringify([{value:0,label:'No'},{value:2,label:'Sí, pero no en el último año'},{value:4,label:'Sí, en el último año'}]) },
      { id: 26, surveyId: 3, itemCode: 'A10', orderNum: 10, text: '¿Algún familiar, amigo, médico o profesional sanitario ha mostrado preocupación por su consumo de bebidas alcohólicas o le ha sugerido que deje de beber?', responseType: 'MULTIPLE_CHOICE' as const, reverseScored: false, required: true, optionsJson: JSON.stringify([{value:0,label:'No'},{value:2,label:'Sí, pero no en el último año'},{value:4,label:'Sí, en el último año'}]) }
    ],
    scoringRules: [
      { id: 10, surveyId: 3, bandName: 'Bajo Riesgo', minScore: 0, maxScore: 7, interpretation: 'Consumo de bajo riesgo', colorCode: 'green' },
      { id: 11, surveyId: 3, bandName: 'Riesgo', minScore: 8, maxScore: 15, interpretation: 'Consumo de riesgo - Consejería breve recomendada', colorCode: 'yellow' },
      { id: 12, surveyId: 3, bandName: 'Perjudicial', minScore: 16, maxScore: 19, interpretation: 'Consumo perjudicial - Intervención breve + seguimiento', colorCode: 'orange' },
      { id: 13, surveyId: 3, bandName: 'Dependencia', minScore: 20, maxScore: 40, interpretation: 'Probable dependencia - Derivación a especialista', colorCode: 'red' }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  // Nota: Por brevedad, incluimos solo 3 instrumentos en el demo inicial
  // Los demás (K10, WHO-5, FTND, PSS-10, PROMIS, MOS-SSS, SEMCD, MARS-5, VAS) 
  // pueden agregarse siguiendo el mismo patrón
];

export default surveysData;

