
import { SurveySession, Survey } from '../types/surveys';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface SurveyTrendChartProps {
  sessions: SurveySession[];
  survey: Survey;
  height?: number;
}

export default function SurveyTrendChart({ 
  sessions, 
  survey,
  height = 300 
}: SurveyTrendChartProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos suficientes para mostrar tendencia
      </div>
    );
  }

  // Ordenar sesiones por fecha
  const sortedSessions = [...sessions]
    .filter(s => s.completedAt && s.scores?.totalScore !== undefined)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());

  if (sortedSessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay sesiones completadas
      </div>
    );
  }

  // Calcular rangos
  const scores = sortedSessions.map(s => s.scores!.totalScore!);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const scoreRange = maxScore - minScore || 1;
  const padding = scoreRange * 0.1;

  // Obtener bandas de severidad para referencia
  const severityBands = survey.scoringRules.sort((a, b) => a.minScore - b.minScore);

  // Dimensiones del gráfico
  const chartWidth = 800;
  const chartHeight = height;
  const marginTop = 20;
  const marginBottom = 60;
  const marginLeft = 60;
  const marginRight = 20;
  const plotWidth = chartWidth - marginLeft - marginRight;
  const plotHeight = chartHeight - marginTop - marginBottom;

  // Función para mapear puntaje a coordenada Y
  const scoreToY = (score: number) => {
    const normalized = (score - (minScore - padding)) / (scoreRange + 2 * padding);
    return marginTop + plotHeight - (normalized * plotHeight);
  };

  // Función para mapear índice a coordenada X
  const indexToX = (index: number) => {
    return marginLeft + (index / (sortedSessions.length - 1)) * plotWidth;
  };

  // Generar path del gráfico de línea
  const linePath = sortedSessions
    .map((session, index) => {
      const x = indexToX(index);
      const y = scoreToY(session.scores!.totalScore!);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generar path del área bajo la curva
  const areaPath = `
    ${linePath}
    L ${indexToX(sortedSessions.length - 1)} ${marginTop + plotHeight}
    L ${marginLeft} ${marginTop + plotHeight}
    Z
  `;

  // Calcular tendencia general
  const firstScore = sortedSessions[0].scores!.totalScore!;
  const lastScore = sortedSessions[sortedSessions.length - 1].scores!.totalScore!;
  const scoreDiff = lastScore - firstScore;
  const percentChange = ((scoreDiff / firstScore) * 100).toFixed(1);

  const getTrendInfo = () => {
    if (Math.abs(scoreDiff) < 2) {
      return { icon: Minus, text: 'Estable', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
    // Para la mayoría de escalas, menor = mejor
    if (scoreDiff < 0) {
      return { icon: TrendingDown, text: 'Mejorando', color: 'text-green-600', bgColor: 'bg-green-100' };
    }
    return { icon: TrendingUp, text: 'Empeorando', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const trendInfo = getTrendInfo();
  const TrendIcon = trendInfo.icon;

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Tendencia Longitudinal</h3>
          <p className="text-sm text-gray-600">{survey.name}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${trendInfo.bgColor}`}>
          <TrendIcon className={`w-5 h-5 ${trendInfo.color}`} />
          <div>
            <div className={`font-bold ${trendInfo.color}`}>{trendInfo.text}</div>
            <div className="text-xs text-gray-600">
              {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)} ({percentChange}%)
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Bandas de severidad de fondo */}
          {severityBands.map((band, idx) => {
            const y1 = scoreToY(band.maxScore);
            const y2 = scoreToY(band.minScore);
            const bandHeight = y2 - y1;
            
            const colors: Record<string, string> = {
              green: '#dcfce7',
              yellow: '#fef9c3',
              orange: '#fed7aa',
              red: '#fecaca'
            };
            
            return (
              <g key={idx}>
                <rect
                  x={marginLeft}
                  y={y1}
                  width={plotWidth}
                  height={bandHeight}
                  fill={colors[band.colorCode || 'gray']}
                  opacity={0.3}
                />
                <text
                  x={chartWidth - marginRight - 5}
                  y={y1 + bandHeight / 2}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-gray-600"
                >
                  {band.bandName}
                </text>
              </g>
            );
          })}

          {/* Eje Y */}
          <line
            x1={marginLeft}
            y1={marginTop}
            x2={marginLeft}
            y2={marginTop + plotHeight}
            stroke="#9ca3af"
            strokeWidth={2}
          />

          {/* Eje X */}
          <line
            x1={marginLeft}
            y1={marginTop + plotHeight}
            x2={marginLeft + plotWidth}
            y2={marginTop + plotHeight}
            stroke="#9ca3af"
            strokeWidth={2}
          />

          {/* Área bajo la curva */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            opacity={0.3}
          />

          {/* Línea de tendencia */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos de datos */}
          {sortedSessions.map((session, index) => {
            const x = indexToX(index);
            const y = scoreToY(session.scores!.totalScore!);
            
            return (
              <g key={session.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="#2563eb"
                  stroke="white"
                  strokeWidth={2}
                  className="cursor-pointer hover:r-8 transition-all"
                />
                <title>
                  {format(new Date(session.completedAt!), "d 'de' MMM, yyyy", { locale: es })}
                  {'\n'}Puntaje: {session.scores!.totalScore!.toFixed(1)}
                  {'\n'}{session.scores!.severityBand}
                </title>
              </g>
            );
          })}

          {/* Etiquetas del eje X */}
          {sortedSessions.map((session, index) => {
            const x = indexToX(index);
            return (
              <text
                key={`label-${session.id}`}
                x={x}
                y={marginTop + plotHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {format(new Date(session.completedAt!), 'd MMM', { locale: es })}
              </text>
            );
          })}

          {/* Etiquetas del eje Y */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const score = (minScore - padding) + fraction * (scoreRange + 2 * padding);
            const y = scoreToY(score);
            return (
              <text
                key={fraction}
                x={marginLeft - 10}
                y={y}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs fill-gray-600"
              >
                {score.toFixed(0)}
              </text>
            );
          })}

          {/* Gradiente para área */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Primera evaluación</div>
          <div className="font-bold text-gray-900">
            {format(new Date(sortedSessions[0].completedAt!), "d 'de' MMM, yyyy", { locale: es })}
          </div>
          <div className="text-blue-600 font-medium">{firstScore.toFixed(1)} pts</div>
        </div>
        <div>
          <div className="text-gray-600">Última evaluación</div>
          <div className="font-bold text-gray-900">
            {format(new Date(sortedSessions[sortedSessions.length - 1].completedAt!), "d 'de' MMM, yyyy", { locale: es })}
          </div>
          <div className="text-blue-600 font-medium">{lastScore.toFixed(1)} pts</div>
        </div>
        <div>
          <div className="text-gray-600">Total evaluaciones</div>
          <div className="font-bold text-gray-900">{sortedSessions.length}</div>
        </div>
        <div>
          <div className="text-gray-600">Cambio total</div>
          <div className={`font-bold ${trendInfo.color}`}>
            {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)} pts
          </div>
        </div>
      </div>
    </div>
  );
}

