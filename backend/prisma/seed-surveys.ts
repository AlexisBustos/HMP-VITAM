/**
 * Seed de instrumentos estandarizados de salud mental y calidad de vida
 * Configuración: FTND completo, sin WHOQOL-BREF, con MARS-5 (no comercial)
 */

export const surveysData = [
  // ============ SALUD MENTAL ============
  {
    code: 'PHQ9',
    name: 'Patient Health Questionnaire-9 (Cuestionario de Salud del Paciente-9)',
    version: '1.0',
    ownerOrg: 'Pfizer Inc.',
    licenseType: 'OPEN',
    licenseNotes: 'Dominio público. Desarrollado por Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: '44249-1',
    items: [
      { itemCode: 'P1', orderNum: 1, text: 'Poco interés o placer en hacer cosas', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P2', orderNum: 2, text: 'Se ha sentido decaído(a), deprimido(a) o sin esperanzas', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P3', orderNum: 3, text: 'Ha tenido dificultad para quedarse o permanecer dormido(a), o ha dormido demasiado', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P4', orderNum: 4, text: 'Se ha sentido cansado(a) o con poca energía', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P5', orderNum: 5, text: 'Sin apetito o ha comido en exceso', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P6', orderNum: 6, text: 'Se ha sentido mal con usted mismo(a) o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P7', orderNum: 7, text: 'Ha tenido dificultad para concentrarse en cosas, tales como leer el periódico o ver la televisión', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P8', orderNum: 8, text: 'Se ha movido o hablado tan lento que otras personas podrían haberlo notado, o lo contrario - muy inquieto(a) o agitado(a) que ha estado moviéndose mucho más de lo normal', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'P9', orderNum: 9, text: 'Pensamientos de que estaría mejor muerto(a) o de lastimarse de alguna manera', responseType: 'LIKERT_0_3', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Mínima', minScore: 0, maxScore: 4, interpretation: 'Síntomas mínimos de depresión', colorCode: 'green' },
      { bandName: 'Leve', minScore: 5, maxScore: 9, interpretation: 'Depresión leve', colorCode: 'yellow' },
      { bandName: 'Moderada', minScore: 10, maxScore: 14, interpretation: 'Depresión moderada - Considerar tratamiento', colorCode: 'orange' },
      { bandName: 'Moderadamente Severa', minScore: 15, maxScore: 19, interpretation: 'Depresión moderadamente severa - Tratamiento activo recomendado', colorCode: 'red' },
      { bandName: 'Severa', minScore: 20, maxScore: 27, interpretation: 'Depresión severa - Tratamiento inmediato requerido', colorCode: 'red' }
    ],
    optionsJson: JSON.stringify([
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Varios días' },
      { value: 2, label: 'Más de la mitad de los días' },
      { value: 3, label: 'Casi todos los días' }
    ])
  },
  
  {
    code: 'GAD7',
    name: 'Generalized Anxiety Disorder-7 (Trastorno de Ansiedad Generalizada-7)',
    version: '1.0',
    ownerOrg: 'Pfizer Inc.',
    licenseType: 'OPEN',
    licenseNotes: 'Dominio público. Desarrollado por Drs. Robert L. Spitzer, Kurt Kroenke, Janet B.W. Williams, Bernd Löwe.',
    language: 'es-CL',
    estimatedMins: 2,
    loincCode: '69737-5',
    items: [
      { itemCode: 'G1', orderNum: 1, text: 'Sentirse nervioso(a), ansioso(a) o con los nervios de punta', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'G2', orderNum: 2, text: 'No ser capaz de parar o controlar su preocupación', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'G3', orderNum: 3, text: 'Preocuparse demasiado por diferentes cosas', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'G4', orderNum: 4, text: 'Dificultad para relajarse', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'G5', orderNum: 5, text: 'Estar tan inquieto(a) que es difícil quedarse quieto(a)', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'G6', orderNum: 6, text: 'Irritarse o enojarse con facilidad', responseType: 'LIKERT_0_3', subscale: null },
      { itemCode: 'G7', orderNum: 7, text: 'Sentir miedo como si algo terrible fuera a pasar', responseType: 'LIKERT_0_3', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Mínima', minScore: 0, maxScore: 4, interpretation: 'Ansiedad mínima', colorCode: 'green' },
      { bandName: 'Leve', minScore: 5, maxScore: 9, interpretation: 'Ansiedad leve', colorCode: 'yellow' },
      { bandName: 'Moderada', minScore: 10, maxScore: 14, interpretation: 'Ansiedad moderada - Considerar intervención', colorCode: 'orange' },
      { bandName: 'Severa', minScore: 15, maxScore: 21, interpretation: 'Ansiedad severa - Intervención activa recomendada', colorCode: 'red' }
    ],
    optionsJson: JSON.stringify([
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Varios días' },
      { value: 2, label: 'Más de la mitad de los días' },
      { value: 3, label: 'Casi todos los días' }
    ])
  },
  
  {
    code: 'K10',
    name: 'Kessler Psychological Distress Scale (Escala de Distrés Psicológico de Kessler)',
    version: '1.0',
    ownerOrg: 'Harvard Medical School',
    licenseType: 'OPEN',
    licenseNotes: 'Dominio público. Desarrollado por Prof. Ronald C. Kessler.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: null,
    items: [
      { itemCode: 'K1', orderNum: 1, text: '¿Con qué frecuencia se sintió cansado(a) sin una buena razón?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K2', orderNum: 2, text: '¿Con qué frecuencia se sintió nervioso(a)?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K3', orderNum: 3, text: '¿Con qué frecuencia se sintió tan nervioso(a) que nada podía calmarlo(a)?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K4', orderNum: 4, text: '¿Con qué frecuencia se sintió sin esperanza?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K5', orderNum: 5, text: '¿Con qué frecuencia se sintió inquieto(a) o agitado(a)?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K6', orderNum: 6, text: '¿Con qué frecuencia se sintió tan inquieto(a) que no podía quedarse quieto(a)?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K7', orderNum: 7, text: '¿Con qué frecuencia se sintió deprimido(a)?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K8', orderNum: 8, text: '¿Con qué frecuencia sintió que todo requería un esfuerzo?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K9', orderNum: 9, text: '¿Con qué frecuencia se sintió tan triste que nada podía animarlo(a)?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'K10', orderNum: 10, text: '¿Con qué frecuencia se sintió inútil?', responseType: 'LIKERT_0_4', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Bajo', minScore: 10, maxScore: 15, interpretation: 'Distrés psicológico bajo', colorCode: 'green' },
      { bandName: 'Moderado', minScore: 16, maxScore: 21, interpretation: 'Distrés psicológico moderado', colorCode: 'yellow' },
      { bandName: 'Alto', minScore: 22, maxScore: 29, interpretation: 'Distrés psicológico alto - Evaluación recomendada', colorCode: 'orange' },
      { bandName: 'Muy Alto', minScore: 30, maxScore: 50, interpretation: 'Distrés psicológico muy alto - Intervención urgente', colorCode: 'red' }
    ],
    optionsJson: JSON.stringify([
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Pocas veces' },
      { value: 2, label: 'Algunas veces' },
      { value: 3, label: 'La mayoría del tiempo' },
      { value: 4, label: 'Todo el tiempo' }
    ])
  },
  
  {
    code: 'WHO5',
    name: 'WHO-5 Well-Being Index (Índice de Bienestar de la OMS)',
    version: '1.0',
    ownerOrg: 'World Health Organization',
    licenseType: 'OPEN',
    licenseNotes: 'Libre uso. Desarrollado por la Colaboración WHO.',
    language: 'es-CL',
    estimatedMins: 2,
    loincCode: null,
    items: [
      { itemCode: 'W1', orderNum: 1, text: 'Me he sentido alegre y de buen ánimo', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'W2', orderNum: 2, text: 'Me he sentido calmado(a) y relajado(a)', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'W3', orderNum: 3, text: 'Me he sentido activo(a) y vigoroso(a)', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'W4', orderNum: 4, text: 'Me desperté sintiéndome fresco(a) y descansado(a)', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'W5', orderNum: 5, text: 'Mi vida diaria ha estado llena de cosas que me interesan', responseType: 'LIKERT_1_5', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Bajo Bienestar', minScore: 0, maxScore: 49, interpretation: 'Bajo bienestar - Screening para depresión recomendado', colorCode: 'red' },
      { bandName: 'Bienestar Adecuado', minScore: 50, maxScore: 100, interpretation: 'Bienestar adecuado', colorCode: 'green' }
    ],
    optionsJson: JSON.stringify([
      { value: 0, label: 'En ningún momento' },
      { value: 1, label: 'Pocas veces' },
      { value: 2, label: 'Menos de la mitad del tiempo' },
      { value: 3, label: 'Más de la mitad del tiempo' },
      { value: 4, label: 'La mayor parte del tiempo' },
      { value: 5, label: 'Todo el tiempo' }
    ])
  },
  
  // ============ CONSUMO / ADICCIONES ============
  {
    code: 'AUDIT',
    name: 'Alcohol Use Disorders Identification Test (Test de Identificación de Trastornos por Uso de Alcohol)',
    version: '1.0',
    ownerOrg: 'World Health Organization',
    licenseType: 'OPEN',
    licenseNotes: 'Dominio público. Desarrollado por WHO.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: '75626-2',
    items: [
      { itemCode: 'A1', orderNum: 1, text: '¿Con qué frecuencia consume alguna bebida alcohólica?', responseType: 'MULTIPLE_CHOICE', subscale: 'Consumo' },
      { itemCode: 'A2', orderNum: 2, text: '¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?', responseType: 'MULTIPLE_CHOICE', subscale: 'Consumo' },
      { itemCode: 'A3', orderNum: 3, text: '¿Con qué frecuencia toma 6 o más bebidas alcohólicas en un solo día?', responseType: 'MULTIPLE_CHOICE', subscale: 'Consumo' },
      { itemCode: 'A4', orderNum: 4, text: '¿Con qué frecuencia en el curso del último año ha sido incapaz de parar de beber una vez había empezado?', responseType: 'MULTIPLE_CHOICE', subscale: 'Dependencia' },
      { itemCode: 'A5', orderNum: 5, text: '¿Con qué frecuencia en el curso del último año no pudo hacer lo que se esperaba de usted porque había bebido?', responseType: 'MULTIPLE_CHOICE', subscale: 'Dependencia' },
      { itemCode: 'A6', orderNum: 6, text: '¿Con qué frecuencia en el curso del último año ha necesitado beber en ayunas para recuperarse después de haber bebido mucho el día anterior?', responseType: 'MULTIPLE_CHOICE', subscale: 'Dependencia' },
      { itemCode: 'A7', orderNum: 7, text: '¿Con qué frecuencia en el curso del último año ha tenido remordimientos o sentimientos de culpa después de haber bebido?', responseType: 'MULTIPLE_CHOICE', subscale: 'Daño' },
      { itemCode: 'A8', orderNum: 8, text: '¿Con qué frecuencia en el curso del último año no ha podido recordar lo que sucedió la noche anterior porque había estado bebiendo?', responseType: 'MULTIPLE_CHOICE', subscale: 'Daño' },
      { itemCode: 'A9', orderNum: 9, text: '¿Usted o alguna otra persona ha resultado herido porque usted había bebido?', responseType: 'MULTIPLE_CHOICE', subscale: 'Daño' },
      { itemCode: 'A10', orderNum: 10, text: '¿Algún familiar, amigo, médico o profesional sanitario ha mostrado preocupación por su consumo de bebidas alcohólicas o le ha sugerido que deje de beber?', responseType: 'MULTIPLE_CHOICE', subscale: 'Daño' }
    ],
    scoringBands: [
      { bandName: 'Bajo Riesgo', minScore: 0, maxScore: 7, interpretation: 'Consumo de bajo riesgo', colorCode: 'green' },
      { bandName: 'Riesgo', minScore: 8, maxScore: 15, interpretation: 'Consumo de riesgo - Consejería breve recomendada', colorCode: 'yellow' },
      { bandName: 'Perjudicial', minScore: 16, maxScore: 19, interpretation: 'Consumo perjudicial - Intervención breve + seguimiento', colorCode: 'orange' },
      { bandName: 'Dependencia', minScore: 20, maxScore: 40, interpretation: 'Probable dependencia - Derivación a especialista', colorCode: 'red' }
    ]
  }
];

// Continúa en siguiente archivo...



// Continuación de surveysData...

  // ============ TABAQUISMO ============
  {
    code: 'FTND',
    name: 'Fagerström Test for Nicotine Dependence (Test de Fagerström para Dependencia de Nicotina)',
    version: '1.0',
    ownerOrg: 'Karl Fagerström',
    licenseType: 'OPEN',
    licenseNotes: 'Dominio público.',
    language: 'es-CL',
    estimatedMins: 2,
    loincCode: '64396-7',
    items: [
      { itemCode: 'F1', orderNum: 1, text: '¿Cuánto tiempo después de despertarse fuma su primer cigarrillo?', responseType: 'MULTIPLE_CHOICE', subscale: null },
      { itemCode: 'F2', orderNum: 2, text: '¿Encuentra difícil no fumar en lugares donde está prohibido?', responseType: 'YES_NO', subscale: null },
      { itemCode: 'F3', orderNum: 3, text: '¿Qué cigarrillo le costaría más dejar?', responseType: 'MULTIPLE_CHOICE', subscale: null },
      { itemCode: 'F4', orderNum: 4, text: '¿Cuántos cigarrillos fuma al día?', responseType: 'MULTIPLE_CHOICE', subscale: null },
      { itemCode: 'F5', orderNum: 5, text: '¿Fuma más durante las primeras horas después de levantarse que durante el resto del día?', responseType: 'YES_NO', subscale: null },
      { itemCode: 'F6', orderNum: 6, text: '¿Fuma aunque esté tan enfermo que tenga que guardar cama la mayor parte del día?', responseType: 'YES_NO', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Baja Dependencia', minScore: 0, maxScore: 2, interpretation: 'Dependencia baja a la nicotina', colorCode: 'green' },
      { bandName: 'Dependencia Leve', minScore: 3, maxScore: 4, interpretation: 'Dependencia leve a la nicotina', colorCode: 'yellow' },
      { bandName: 'Dependencia Moderada', minScore: 5, maxScore: 7, interpretation: 'Dependencia moderada - Apoyo para cesación recomendado', colorCode: 'orange' },
      { bandName: 'Alta Dependencia', minScore: 8, maxScore: 10, interpretation: 'Alta dependencia - Tratamiento farmacológico + apoyo intensivo', colorCode: 'red' }
    ]
  },

  // ============ ESTRÉS ============
  {
    code: 'PSS10',
    name: 'Perceived Stress Scale-10 (Escala de Estrés Percibido-10)',
    version: '1.0',
    ownerOrg: 'Sheldon Cohen',
    licenseType: 'OPEN',
    licenseNotes: 'Dominio público. Desarrollado por Dr. Sheldon Cohen.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: null,
    items: [
      { itemCode: 'S1', orderNum: 1, text: '¿Con qué frecuencia ha estado afectado por algo que ha ocurrido inesperadamente?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'S2', orderNum: 2, text: '¿Con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'S3', orderNum: 3, text: '¿Con qué frecuencia se ha sentido nervioso o estresado?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'S4', orderNum: 4, text: '¿Con qué frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?', responseType: 'LIKERT_0_4', subscale: null, reverseScored: true },
      { itemCode: 'S5', orderNum: 5, text: '¿Con qué frecuencia ha sentido que ha afrontado efectivamente los cambios importantes que han estado ocurriendo en su vida?', responseType: 'LIKERT_0_4', subscale: null, reverseScored: true },
      { itemCode: 'S6', orderNum: 6, text: '¿Con qué frecuencia ha estado seguro sobre su capacidad para manejar sus problemas personales?', responseType: 'LIKERT_0_4', subscale: null, reverseScored: true },
      { itemCode: 'S7', orderNum: 7, text: '¿Con qué frecuencia ha sentido que las cosas le van bien?', responseType: 'LIKERT_0_4', subscale: null, reverseScored: true },
      { itemCode: 'S8', orderNum: 8, text: '¿Con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?', responseType: 'LIKERT_0_4', subscale: null },
      { itemCode: 'S9', orderNum: 9, text: '¿Con qué frecuencia ha podido controlar las dificultades de su vida?', responseType: 'LIKERT_0_4', subscale: null, reverseScored: true },
      { itemCode: 'S10', orderNum: 10, text: '¿Con qué frecuencia se ha sentido que tenía todo bajo control?', responseType: 'LIKERT_0_4', subscale: null, reverseScored: true }
    ],
    scoringBands: [
      { bandName: 'Estrés Bajo', minScore: 0, maxScore: 13, interpretation: 'Nivel de estrés bajo', colorCode: 'green' },
      { bandName: 'Estrés Moderado', minScore: 14, maxScore: 26, interpretation: 'Nivel de estrés moderado', colorCode: 'yellow' },
      { bandName: 'Estrés Alto', minScore: 27, maxScore: 40, interpretation: 'Nivel de estrés alto - Intervención recomendada', colorCode: 'red' }
    ],
    optionsJson: JSON.stringify([
      { value: 0, label: 'Nunca' },
      { value: 1, label: 'Casi nunca' },
      { value: 2, label: 'De vez en cuando' },
      { value: 3, label: 'A menudo' },
      { value: 4, label: 'Muy a menudo' }
    ])
  },

  // ============ CALIDAD DE VIDA ============
  {
    code: 'PROMIS_GH10',
    name: 'PROMIS Global Health-10 (Salud Global PROMIS-10)',
    version: '1.2',
    ownerOrg: 'HealthMeasures (NIH)',
    licenseType: 'OPEN',
    licenseNotes: 'Uso libre para investigación y práctica clínica. Copyright © 2008-2024 PROMIS Health Organization.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: '71969-0',
    items: [
      { itemCode: 'GH1', orderNum: 1, text: 'En general, diría que su salud es:', responseType: 'LIKERT_1_5', subscale: 'Physical' },
      { itemCode: 'GH2', orderNum: 2, text: 'En general, diría que su calidad de vida es:', responseType: 'LIKERT_1_5', subscale: 'Mental' },
      { itemCode: 'GH3', orderNum: 3, text: 'En general, ¿cómo calificaría su salud física?', responseType: 'LIKERT_1_5', subscale: 'Physical' },
      { itemCode: 'GH4', orderNum: 4, text: 'En general, ¿cómo calificaría su salud mental, incluyendo su estado de ánimo y su capacidad para pensar?', responseType: 'LIKERT_1_5', subscale: 'Mental' },
      { itemCode: 'GH5', orderNum: 5, text: 'En general, ¿cómo calificaría su satisfacción con sus actividades sociales y relaciones?', responseType: 'LIKERT_1_5', subscale: 'Mental' },
      { itemCode: 'GH6', orderNum: 6, text: 'En general, por favor califique qué tan bien lleva a cabo sus actividades y obligaciones habituales:', responseType: 'LIKERT_1_5', subscale: 'Physical' },
      { itemCode: 'GH7', orderNum: 7, text: '¿Hasta qué punto es capaz de llevar a cabo sus actividades físicas diarias habituales, como caminar, subir escaleras, cargar las compras o mover una silla?', responseType: 'LIKERT_1_5', subscale: 'Physical' },
      { itemCode: 'GH8', orderNum: 8, text: 'En los últimos 7 días, ¿cómo calificaría su fatiga en promedio?', responseType: 'LIKERT_1_5', subscale: 'Physical' },
      { itemCode: 'GH9', orderNum: 9, text: 'En los últimos 7 días, ¿cómo calificaría su dolor en promedio?', responseType: 'LIKERT_1_5', subscale: 'Physical' },
      { itemCode: 'GH10', orderNum: 10, text: 'En los últimos 7 días, ¿con qué frecuencia se ha visto afectado emocionalmente por problemas de salud?', responseType: 'LIKERT_1_5', subscale: 'Mental' }
    ],
    scoringBands: [
      { bandName: 'Salud Global Baja', minScore: 10, maxScore: 30, interpretation: 'Salud global baja', colorCode: 'red' },
      { bandName: 'Salud Global Moderada', minScore: 31, maxScore: 40, interpretation: 'Salud global moderada', colorCode: 'yellow' },
      { bandName: 'Salud Global Buena', minScore: 41, maxScore: 50, interpretation: 'Salud global buena', colorCode: 'green' }
    ]
  },

  // ============ SUEÑO ============
  {
    code: 'PROMIS_SLEEP',
    name: 'PROMIS Sleep Disturbance Short Form 8a (Alteración del Sueño PROMIS 8a)',
    version: '1.0',
    ownerOrg: 'HealthMeasures (NIH)',
    licenseType: 'OPEN',
    licenseNotes: 'Uso libre. Copyright © PROMIS Health Organization.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: '89207-4',
    items: [
      { itemCode: 'SL1', orderNum: 1, text: 'Mi sueño fue de mala calidad', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'SL2', orderNum: 2, text: 'Mi sueño no fue reparador', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'SL3', orderNum: 3, text: 'Tuve problemas para dormir', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'SL4', orderNum: 4, text: 'Tuve dificultad para quedarme dormido', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'SL5', orderNum: 5, text: 'Tuve problemas para permanecer dormido', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'SL6', orderNum: 6, text: 'Tuve dificultad para volver a dormirme después de despertarme', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'SL7', orderNum: 7, text: 'Estuve satisfecho con mi sueño', responseType: 'LIKERT_1_5', subscale: null, reverseScored: true },
      { itemCode: 'SL8', orderNum: 8, text: 'Mi sueño fue tranquilo', responseType: 'LIKERT_1_5', subscale: null, reverseScored: true }
    ],
    scoringBands: [
      { bandName: 'Normal', minScore: 0, maxScore: 54, interpretation: 'Sueño normal (T-score <55)', colorCode: 'green' },
      { bandName: 'Leve', minScore: 55, maxScore: 59, interpretation: 'Alteración leve del sueño', colorCode: 'yellow' },
      { bandName: 'Moderada', minScore: 60, maxScore: 69, interpretation: 'Alteración moderada - Higiene del sueño recomendada', colorCode: 'orange' },
      { bandName: 'Severa', minScore: 70, maxScore: 100, interpretation: 'Alteración severa - Evaluación especializada', colorCode: 'red' }
    ],
    optionsJson: JSON.stringify([
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Un poco' },
      { value: 3, label: 'Algo' },
      { value: 4, label: 'Bastante' },
      { value: 5, label: 'Mucho' }
    ])
  },

  // ============ FATIGA ============
  {
    code: 'PROMIS_FATIGUE',
    name: 'PROMIS Fatigue Short Form 7a (Fatiga PROMIS 7a)',
    version: '1.0',
    ownerOrg: 'HealthMeasures (NIH)',
    licenseType: 'OPEN',
    licenseNotes: 'Uso libre. Copyright © PROMIS Health Organization.',
    language: 'es-CL',
    estimatedMins: 2,
    loincCode: '89208-2',
    items: [
      { itemCode: 'FA1', orderNum: 1, text: 'Me sentí cansado', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'FA2', orderNum: 2, text: 'Tuve problemas para empezar las cosas porque estaba cansado', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'FA3', orderNum: 3, text: 'Me quedé sin energía', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'FA4', orderNum: 4, text: 'Mi cuerpo se sintió débil en general', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'FA5', orderNum: 5, text: 'Me sentí agotado', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'FA6', orderNum: 6, text: 'Estuve cansado incluso cuando no había hecho nada', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'FA7', orderNum: 7, text: '¿Qué tan cansado se sintió en promedio?', responseType: 'LIKERT_1_5', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Normal', minScore: 0, maxScore: 54, interpretation: 'Fatiga normal (T-score <55)', colorCode: 'green' },
      { bandName: 'Leve', minScore: 55, maxScore: 59, interpretation: 'Fatiga leve', colorCode: 'yellow' },
      { bandName: 'Moderada', minScore: 60, maxScore: 69, interpretation: 'Fatiga moderada - Plan de manejo de energía', colorCode: 'orange' },
      { bandName: 'Severa', minScore: 70, maxScore: 100, interpretation: 'Fatiga severa - Evaluación médica recomendada', colorCode: 'red' }
    ],
    optionsJson: JSON.stringify([
      { value: 1, label: 'Nada' },
      { value: 2, label: 'Un poco' },
      { value: 3, label: 'Algo' },
      { value: 4, label: 'Bastante' },
      { value: 5, label: 'Mucho' }
    ])
  },

  // ============ APOYO SOCIAL ============
  {
    code: 'MOS_SSS',
    name: 'MOS Social Support Survey (Encuesta de Apoyo Social MOS)',
    version: '1.0',
    ownerOrg: 'RAND Corporation',
    licenseType: 'NON_COMMERCIAL',
    licenseNotes: 'Uso libre para investigación y práctica clínica no comercial. RAND Corporation.',
    language: 'es-CL',
    estimatedMins: 3,
    loincCode: null,
    items: [
      { itemCode: 'M1', orderNum: 1, text: 'Alguien que le ayude cuando tenga que estar en cama', responseType: 'LIKERT_1_5', subscale: 'Tangible' },
      { itemCode: 'M2', orderNum: 2, text: 'Alguien con quien pueda contar cuando necesita hablar', responseType: 'LIKERT_1_5', subscale: 'Emocional' },
      { itemCode: 'M3', orderNum: 3, text: 'Alguien que le aconseje cuando tenga problemas', responseType: 'LIKERT_1_5', subscale: 'Informacional' },
      { itemCode: 'M4', orderNum: 4, text: 'Alguien que le lleve al médico cuando lo necesita', responseType: 'LIKERT_1_5', subscale: 'Tangible' },
      { itemCode: 'M5', orderNum: 5, text: 'Alguien que le muestre amor y afecto', responseType: 'LIKERT_1_5', subscale: 'Afectivo' },
      { itemCode: 'M6', orderNum: 6, text: 'Alguien con quien pasar un buen rato', responseType: 'LIKERT_1_5', subscale: 'Interacción Social' },
      { itemCode: 'M7', orderNum: 7, text: 'Alguien que le dé información para ayudarle a entender una situación', responseType: 'LIKERT_1_5', subscale: 'Informacional' },
      { itemCode: 'M8', orderNum: 8, text: 'Alguien en quien confiar o con quien hablar de sí mismo y sus preocupaciones', responseType: 'LIKERT_1_5', subscale: 'Emocional' }
    ],
    scoringBands: [
      { bandName: 'Apoyo Bajo', minScore: 0, maxScore: 50, interpretation: 'Bajo apoyo social percibido', colorCode: 'red' },
      { bandName: 'Apoyo Moderado', minScore: 51, maxScore: 75, interpretation: 'Apoyo social moderado', colorCode: 'yellow' },
      { bandName: 'Apoyo Alto', minScore: 76, maxScore: 100, interpretation: 'Alto apoyo social percibido', colorCode: 'green' }
    ],
    optionsJson: JSON.stringify([
      { value: 1, label: 'Nunca' },
      { value: 2, label: 'Pocas veces' },
      { value: 3, label: 'Algunas veces' },
      { value: 4, label: 'La mayoría de las veces' },
      { value: 5, label: 'Siempre' }
    ])
  },

  // ============ ADHERENCIA / AUTOCUIDADO ============
  {
    code: 'SEMCD',
    name: 'Self-Efficacy for Managing Chronic Disease 6-Item Scale (Autoeficacia para Manejo de Enfermedad Crónica)',
    version: '1.0',
    ownerOrg: 'Stanford Patient Education Research Center',
    licenseType: 'OPEN',
    licenseNotes: 'Uso libre. Desarrollado por Stanford University.',
    language: 'es-CL',
    estimatedMins: 2,
    loincCode: null,
    items: [
      { itemCode: 'SE1', orderNum: 1, text: '¿Qué tan seguro está de que puede mantener la fatiga causada por su enfermedad de interferir con las cosas que quiere hacer?', responseType: 'LIKERT_1_10', subscale: null },
      { itemCode: 'SE2', orderNum: 2, text: '¿Qué tan seguro está de que puede mantener el malestar físico o dolor de su enfermedad de interferir con las cosas que quiere hacer?', responseType: 'LIKERT_1_10', subscale: null },
      { itemCode: 'SE3', orderNum: 3, text: '¿Qué tan seguro está de que puede mantener el malestar emocional causado por su enfermedad de interferir con las cosas que quiere hacer?', responseType: 'LIKERT_1_10', subscale: null },
      { itemCode: 'SE4', orderNum: 4, text: '¿Qué tan seguro está de que puede mantener cualquier otro síntoma o problema de salud que tenga de interferir con las cosas que quiere hacer?', responseType: 'LIKERT_1_10', subscale: null },
      { itemCode: 'SE5', orderNum: 5, text: '¿Qué tan seguro está de que puede hacer las diferentes tareas y actividades necesarias para manejar su condición de salud de manera que reduzca su necesidad de ver a un médico?', responseType: 'LIKERT_1_10', subscale: null },
      { itemCode: 'SE6', orderNum: 6, text: '¿Qué tan seguro está de que puede hacer cosas diferentes de tomar medicamentos para reducir cómo su enfermedad afecta su vida diaria?', responseType: 'LIKERT_1_10', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Baja Autoeficacia', minScore: 1, maxScore: 5.9, interpretation: 'Baja autoeficacia - Intervención educativa recomendada', colorCode: 'red' },
      { bandName: 'Autoeficacia Moderada', minScore: 6, maxScore: 7.9, interpretation: 'Autoeficacia moderada', colorCode: 'yellow' },
      { bandName: 'Alta Autoeficacia', minScore: 8, maxScore: 10, interpretation: 'Alta autoeficacia para autocuidado', colorCode: 'green' }
    ],
    optionsJson: JSON.stringify([
      { value: 1, label: '1 - Nada seguro' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
      { value: 6, label: '6' },
      { value: 7, label: '7' },
      { value: 8, label: '8' },
      { value: 9, label: '9' },
      { value: 10, label: '10 - Totalmente seguro' }
    ])
  },

  {
    code: 'MARS5',
    name: 'Medication Adherence Report Scale-5 (Escala de Reporte de Adherencia a Medicamentos-5)',
    version: '1.0',
    ownerOrg: 'Rob Horne',
    licenseType: 'NON_COMMERCIAL',
    licenseNotes: 'Uso libre solo para práctica clínica e investigación no comercial. Requiere permiso para uso comercial.',
    language: 'es-CL',
    estimatedMins: 1,
    loincCode: null,
    items: [
      { itemCode: 'MA1', orderNum: 1, text: 'Olvido tomar mis medicamentos', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'MA2', orderNum: 2, text: 'Altero la dosis de mis medicamentos', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'MA3', orderNum: 3, text: 'Dejo de tomar mis medicamentos por un tiempo', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'MA4', orderNum: 4, text: 'Decido saltarme una dosis', responseType: 'LIKERT_1_5', subscale: null },
      { itemCode: 'MA5', orderNum: 5, text: 'Tomo menos medicamentos de los indicados', responseType: 'LIKERT_1_5', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Baja Adherencia', minScore: 5, maxScore: 19, interpretation: 'Baja adherencia - Intervención urgente', colorCode: 'red' },
      { bandName: 'Adherencia Moderada', minScore: 20, maxScore: 23, interpretation: 'Adherencia moderada - Reforzar educación', colorCode: 'yellow' },
      { bandName: 'Alta Adherencia', minScore: 24, maxScore: 25, interpretation: 'Alta adherencia a medicamentos', colorCode: 'green' }
    ],
    optionsJson: JSON.stringify([
      { value: 1, label: 'Siempre' },
      { value: 2, label: 'A menudo' },
      { value: 3, label: 'A veces' },
      { value: 4, label: 'Rara vez' },
      { value: 5, label: 'Nunca' }
    ])
  },

  {
    code: 'VAS_ADHERENCE',
    name: 'Visual Analog Scale - Medication Adherence (Escala Visual Análoga - Adherencia a Medicamentos)',
    version: '1.0',
    ownerOrg: 'Dominio Público',
    licenseType: 'OPEN',
    licenseNotes: 'Instrumento de dominio público.',
    language: 'es-CL',
    estimatedMins: 1,
    loincCode: null,
    items: [
      { itemCode: 'VA1', orderNum: 1, text: 'En los últimos 30 días, ¿qué porcentaje de sus medicamentos tomó según lo indicado?', responseType: 'VAS_0_100', subscale: null }
    ],
    scoringBands: [
      { bandName: 'Baja Adherencia', minScore: 0, maxScore: 79, interpretation: 'Adherencia <80% - Intervención requerida', colorCode: 'red' },
      { bandName: 'Adherencia Adecuada', minScore: 80, maxScore: 100, interpretation: 'Adherencia adecuada (≥80%)', colorCode: 'green' }
    ],
    optionsJson: JSON.stringify([
      { value: 0, label: '0% - No tomé ninguno' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100% - Tomé todos' }
    ])
  }
];

export default surveysData;

