# Módulo de Encuestas Estandarizadas - HMP Vitam

## 📋 Descripción General

El módulo de encuestas estandarizadas permite la aplicación, scoring automático y seguimiento longitudinal de instrumentos clínicos validados para evaluación de salud mental, calidad de vida y adherencia terapéutica.

## 🎯 Características Principales

### 1. Instrumentos Implementados (13 total)

#### Salud Mental
- **PHQ-9** - Patient Health Questionnaire-9 (Depresión)
  - 9 ítems, escala 0-3
  - Rango: 0-27
  - Bandas: Mínima (0-4), Leve (5-9), Moderada (10-14), Moderadamente Severa (15-19), Severa (20-27)
  - LOINC: 44249-1
  - **Alerta crítica**: Riesgo suicida (ítem 9 > 0)

- **GAD-7** - Generalized Anxiety Disorder-7 (Ansiedad)
  - 7 ítems, escala 0-3
  - Rango: 0-21
  - Bandas: Mínima (0-4), Leve (5-9), Moderada (10-14), Severa (15-21)
  - LOINC: 69737-5

- **K10** - Kessler Psychological Distress Scale
  - 10 ítems, escala 0-4
  - Rango: 10-50
  - Bandas: Bajo (10-15), Moderado (16-21), Alto (22-29), Muy Alto (30-50)

- **WHO-5** - WHO Well-Being Index
  - 5 ítems, escala 1-5
  - Rango: 0-100 (convertido)
  - Umbral: <50 sugiere screening para depresión

- **PSS-10** - Perceived Stress Scale
  - 10 ítems, escala 0-4
  - Incluye ítems invertidos
  - Rango: 0-40

#### Consumo y Adicciones
- **AUDIT** - Alcohol Use Disorders Identification Test
  - 10 ítems, scoring variable
  - Rango: 0-40
  - Sub-escalas: Consumo, Dependencia, Daño
  - LOINC: 75626-2

- **FTND** - Fagerström Test for Nicotine Dependence
  - 6 ítems, scoring variable
  - Rango: 0-10
  - Bandas: Baja (0-2), Leve (3-4), Moderada (5-7), Alta (8-10)
  - LOINC: 64396-7

#### Calidad de Vida
- **PROMIS Global Health-10**
  - 10 ítems, escala 1-5
  - Sub-escalas: Física y Mental
  - LOINC: 71969-0

- **PROMIS Sleep Disturbance SF 8a**
  - 8 ítems, escala 1-5
  - T-score calculado
  - LOINC: 89207-4

- **PROMIS Fatigue SF 7a**
  - 7 ítems, escala 1-5
  - T-score calculado
  - LOINC: 89208-2

- **MOS Social Support Survey**
  - 8 ítems, escala 1-5
  - Convertido a escala 0-100
  - Licencia: No comercial

#### Adherencia y Autocuidado
- **SEMCD** - Self-Efficacy for Managing Chronic Disease
  - 6 ítems, escala 1-10
  - Promedio calculado
  - Fuente: Stanford University

- **MARS-5** - Medication Adherence Report Scale
  - 5 ítems, escala 1-5
  - Rango: 5-25
  - Licencia: No comercial

- **VAS Adherence** - Visual Analog Scale
  - 1 ítem, escala 0-100
  - Umbral: ≥80% = adherencia adecuada

### 2. Sistema de Scoring Automático

Cada instrumento tiene su algoritmo de scoring específico:

```typescript
// Ejemplo: PHQ-9
totalScore = sum(responses) // 0-27
severityBand = determineBand(totalScore)
interpretation = getInterpretation(severityBand)
```

**Características:**
- Cálculo automático al completar encuesta
- Ítems invertidos (PSS-10, PROMIS)
- Sub-escalas (AUDIT, PROMIS GH-10)
- T-scores (PROMIS Sleep, Fatigue)
- Conversiones de escala (WHO-5, MOS-SSS)

### 3. Sistema de Alertas Clínicas

**Niveles de Severidad:**
- 🔵 **INFO**: Informativo
- 🟡 **WARN**: Advertencia - requiere atención
- 🔴 **CRITICAL**: Crítico - acción inmediata

**Reglas Implementadas:**

| Código | Instrumento | Condición | Severidad | Acción |
|--------|-------------|-----------|-----------|--------|
| PHQ9_SUICIDE_RISK | PHQ-9 | Ítem 9 > 0 | CRITICAL | Evaluación inmediata de riesgo suicida |
| PHQ9_SEVERE | PHQ-9 | Score ≥ 20 | CRITICAL | Tratamiento inmediato |
| GAD7_SEVERE | GAD-7 | Score ≥ 15 | WARN | Intervención activa |
| K10_VERY_HIGH | K10 | Score ≥ 30 | CRITICAL | Evaluación psiquiátrica urgente |
| WHO5_LOW_WELLBEING | WHO-5 | Score < 50 | WARN | Screening para depresión |
| AUDIT_DEPENDENCE | AUDIT | Score ≥ 20 | CRITICAL | Derivación a especialista |
| FTND_HIGH_DEPENDENCE | FTND | Score ≥ 8 | WARN | Tratamiento farmacológico |
| MARS5_LOW_ADHERENCE | MARS-5 | Score < 20 | WARN | Intervención educativa |
| VAS_LOW_ADHERENCE | VAS | Score < 80 | WARN | Reforzar educación |

### 4. Visualización Longitudinal

**Gráfico de Tendencias:**
- Eje X: Fechas de evaluación
- Eje Y: Puntaje total
- Bandas de severidad como fondo
- Línea de tendencia con área bajo la curva
- Puntos interactivos con tooltips
- Cálculo de cambio porcentual
- Indicador de tendencia (mejorando/estable/empeorando)

**Estadísticas:**
- Primera y última evaluación
- Total de evaluaciones
- Cambio total (puntos y porcentaje)
- Promedio de puntajes
- Tendencia general

### 5. Dashboard Analítico

**Métricas Globales:**
- Total de evaluaciones
- Evaluaciones completadas
- Sesiones con alertas
- Alertas críticas activas

**Filtros:**
- Por instrumento
- Por paciente
- Búsqueda por texto
- Rango de fechas

**Exportación:**
- CSV con todas las columnas
- Datos filtrados
- Formato compatible con Excel

## 🏗️ Arquitectura Técnica

### Frontend

```
src/
├── types/
│   └── surveys.ts              # Tipos TypeScript completos
├── utils/
│   └── surveyScoring.ts        # Lógica de scoring y alertas
├── components/
│   ├── SurveyRenderer.tsx      # Renderizado dinámico de encuestas
│   ├── SurveyResults.tsx       # Visualización de resultados
│   └── SurveyTrendChart.tsx    # Gráficos longitudinales
├── pages/
│   └── Encuestas/
│       └── EncuestasList.tsx   # Vista principal
├── data/
│   ├── surveys.ts              # Definición de instrumentos
│   └── demoSurveySessions.ts   # Datos demo
└── store/
    └── demo.ts                 # Store de Zustand
```

### Backend

```
backend/
└── prisma/
    ├── schema-surveys.prisma   # Modelos de datos
    └── seed-surveys.ts         # Seed de instrumentos
```

### Modelos de Datos

**Survey** (Instrumento)
- Metadatos: código, nombre, versión, organización
- Licencia y notas
- Tiempo estimado
- Código LOINC
- Items y reglas de scoring

**SurveyItem** (Ítem)
- Código y orden
- Texto de la pregunta
- Tipo de respuesta
- Opciones (JSON)
- Inversión de puntaje
- Sub-escala

**SurveySession** (Sesión)
- Paciente y clínico
- Fechas inicio/fin
- Contexto (JSON)
- Respuestas
- Puntajes
- Alertas

**SurveyResponse** (Respuesta)
- Valor raw y normalizado
- Timestamp

**SurveyScore** (Puntaje)
- Total y sub-escalas
- Banda de severidad
- T-score (PROMIS)
- Interpretación

**SurveyAlert** (Alerta)
- Código de regla
- Severidad
- Mensaje y plan de acción
- Estado (resuelta/pendiente)

**SurveyScoring** (Banda de Severidad)
- Nombre de banda
- Rango (min-max)
- Interpretación
- Color para UI

## 📊 Datos Demo

### Sesiones Incluidas

1. **María González - PHQ-9** (01/10/2024)
   - Score: 11 (Moderada)
   - Alerta: Depresión moderada

2. **María González - GAD-7** (01/10/2024)
   - Score: 11 (Moderada)
   - Alerta: Ansiedad moderada

3. **Juan Pérez - AUDIT** (05/10/2024)
   - Score: 1 (Bajo riesgo)
   - Sin alertas

4. **María González - PHQ-9** (01/11/2024)
   - Score: 5 (Leve)
   - Mejora de 6 puntos vs. evaluación anterior
   - Sin alertas

5. **Pedro Martínez - PHQ-9** (15/10/2024)
   - Score: 1 (Mínima)
   - Sin alertas

## 🚀 Uso del Módulo

### Aplicar una Encuesta

1. Ir a **Encuestas** en el menú
2. Hacer clic en botón **+** (Nueva Evaluación)
3. Seleccionar paciente e instrumento
4. Completar todos los ítems
5. Revisar resultados y alertas

### Ver Resultados

1. En lista de encuestas, clic en **Ver Resultados**
2. Se muestra:
   - Alertas críticas (si existen)
   - Puntaje total y banda de severidad
   - Cambio vs. evaluación anterior
   - Interpretación clínica
   - Respuestas detalladas
   - Código LOINC

### Dashboard de Tendencias

1. Cambiar a vista **Dashboard**
2. Ver gráficos longitudinales por instrumento
3. Analizar tendencias de cada paciente
4. Identificar patrones de mejora/empeoramiento

### Exportar Datos

1. Aplicar filtros deseados
2. Clic en **Exportar CSV**
3. Abrir en Excel o software estadístico

## 🔧 Configuración

### Frecuencias Recomendadas

| Instrumento | Condición | Frecuencia |
|-------------|-----------|------------|
| PHQ-9 | Depresión | 60 días |
| GAD-7 | Ansiedad | 60 días |
| K10 | Screening general | 90 días |
| WHO-5 | Bienestar | 90 días |
| AUDIT | Uso de alcohol | 90 días |
| FTND | Cesación tabáquica | 90 días |
| PSS-10 | Estrés | 90 días |
| PROMIS | Condiciones crónicas | 90 días |
| MARS-5 | Tratamientos crónicos | 90 días |

### Umbrales Clínicos

Los umbrales están configurados según literatura internacional:
- PHQ-9: ≥10 sugiere depresión clínicamente significativa
- GAD-7: ≥10 sugiere ansiedad clínicamente significativa
- WHO-5: <50 sugiere bajo bienestar
- AUDIT: ≥8 sugiere consumo de riesgo
- MARS-5: <20 sugiere baja adherencia

## 📚 Referencias

### Instrumentos de Dominio Público
- PHQ-9: Spitzer et al., 1999
- GAD-7: Spitzer et al., 2006
- K10: Kessler et al., 2002
- WHO-5: WHO, 1998
- AUDIT: WHO, 2001
- PSS-10: Cohen et al., 1983
- SEMCD: Stanford Patient Education Research Center

### PROMIS
- Copyright © 2008-2024 PROMIS Health Organization
- Uso libre para investigación y práctica clínica
- www.healthmeasures.net

### Instrumentos No Comerciales
- MARS-5: Horne et al., 2001 (requiere permiso para uso comercial)
- MOS-SSS: RAND Corporation (libre para uso no comercial)

## 🔐 Licencias y Atribuciones

Todos los instrumentos incluyen:
- Tipo de licencia (OPEN, NON_COMMERCIAL, etc.)
- Notas de licencia con atribución
- Organización propietaria
- Versión del instrumento

**Importante:** Este sistema es para uso clínico y de investigación no comercial. Para uso comercial, verificar licencias individuales.

## 🎨 Personalización

### Agregar Nuevo Instrumento

1. Definir en `surveys.ts`:
```typescript
{
  id: X,
  code: 'CODIGO',
  name: 'Nombre Completo',
  items: [...],
  scoringRules: [...]
}
```

2. Agregar lógica de scoring en `surveyScoring.ts`:
```typescript
case 'CODIGO':
  return calculateCustomScore(survey, responses);
```

3. Agregar reglas de alerta en `types/surveys.ts`:
```typescript
{
  ruleCode: 'CODIGO_ALERT',
  surveyCode: 'CODIGO',
  condition: (session) => ...,
  severity: 'WARN',
  messageTemplate: '...',
  actionPlan: '...'
}
```

### Modificar Umbrales

Editar `scoringRules` en definición del instrumento:
```typescript
scoringRules: [
  { 
    bandName: 'Leve', 
    minScore: 5, 
    maxScore: 9, 
    interpretation: '...', 
    colorCode: 'yellow' 
  }
]
```

## 🐛 Troubleshooting

### Problema: Puntaje no se calcula
- Verificar que todos los ítems requeridos estén respondidos
- Revisar función de scoring en `surveyScoring.ts`
- Verificar normalización de valores

### Problema: Alertas no se generan
- Verificar condiciones en `ALERT_RULES`
- Confirmar que el puntaje cumple la condición
- Revisar severidad configurada

### Problema: Gráfico no se muestra
- Verificar que existan al menos 2 sesiones completadas
- Confirmar que las sesiones tengan `completedAt` y `scores`
- Revisar rangos de puntajes

## 📈 Roadmap Futuro

- [ ] Agregar más instrumentos (WHOQOL-BREF, HADS, etc.)
- [ ] Implementar recordatorios automáticos
- [ ] Generar informes PDF
- [ ] Comparación entre pacientes (agregado)
- [ ] Integración con calendario
- [ ] Notificaciones de alertas críticas
- [ ] Análisis predictivo con ML
- [ ] Soporte multiidioma
- [ ] Versión móvil para pacientes
- [ ] Firma digital de consentimiento

## 👥 Contribuciones

Para agregar nuevos instrumentos o mejorar el módulo:
1. Fork del repositorio
2. Crear branch con nombre descriptivo
3. Implementar cambios siguiendo la arquitectura existente
4. Agregar tests si es posible
5. Crear Pull Request con descripción detallada

---

**Versión:** 1.0.0  
**Fecha:** Octubre 2024  
**Autor:** HMP Vitam Development Team  
**Licencia:** Uso clínico y de investigación no comercial

