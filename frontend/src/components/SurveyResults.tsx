
import { SurveySession, Survey } from '../types/surveys';
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SurveyResultsProps {
  session: SurveySession;
  survey: Survey;
  previousSession?: SurveySession;
  onClose: () => void;
}

export default function SurveyResults({ 
  session, 
  survey, 
  previousSession,
  onClose 
}: SurveyResultsProps) {
  const score = session.scores;
  const hasAlerts = session.alerts.length > 0;
  const criticalAlerts = session.alerts.filter(a => a.severity === 'CRITICAL');
  const warningAlerts = session.alerts.filter(a => a.severity === 'WARN');

  // Calcular cambio respecto a sesión anterior
  const scoreDiff = previousSession?.scores?.totalScore 
    ? (score?.totalScore ?? 0) - previousSession.scores.totalScore 
    : null;

  const getTrendIcon = () => {
    if (scoreDiff === null) return <Minus className="w-5 h-5" />;
    if (Math.abs(scoreDiff) < 2) return <Minus className="w-5 h-5 text-gray-500" />;
    // Para la mayoría de escalas, menor puntaje = mejor
    return scoreDiff < 0 
      ? <TrendingDown className="w-5 h-5 text-green-600" />
      : <TrendingUp className="w-5 h-5 text-red-600" />;
  };

  const getScoreColor = () => {
    const colorCode = survey.scoringRules.find(
      rule => (score?.totalScore ?? 0) >= rule.minScore && (score?.totalScore ?? 0) <= rule.maxScore
    )?.colorCode;

    switch (colorCode) {
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'red': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{survey.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Resultados de Evaluación</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>{session.patientName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(session.completedAt!), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}</span>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="p-6 bg-red-50 border-b border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">⚠️ ALERTAS CRÍTICAS</h3>
                {criticalAlerts.map((alert, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <p className="font-medium text-red-800">{alert.message}</p>
                    {alert.actionPlan && (
                      <p className="text-sm text-red-700 mt-1 pl-4 border-l-2 border-red-300">
                        <strong>Plan de acción:</strong> {alert.actionPlan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div className="p-6 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2">Alertas Clínicas</h3>
                {warningAlerts.map((alert, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <p className="font-medium text-yellow-800">{alert.message}</p>
                    {alert.actionPlan && (
                      <p className="text-sm text-yellow-700 mt-1 pl-4 border-l-2 border-yellow-300">
                        <strong>Plan de acción:</strong> {alert.actionPlan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Alerts */}
        {!hasAlerts && (
          <div className="p-6 bg-green-50 border-b border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <p className="text-green-800 font-medium">No se detectaron alertas clínicas</p>
            </div>
          </div>
        )}

        {/* Score Summary */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Puntaje Total</h3>
          
          <div className={`border-2 rounded-lg p-6 ${getScoreColor()}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-5xl font-bold mb-2">
                  {score?.totalScore?.toFixed(1) ?? 'N/A'}
                </div>
                <div className="text-lg font-semibold">
                  {score?.severityBand ?? 'Sin clasificar'}
                </div>
              </div>
              
              {scoreDiff !== null && (
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    {getTrendIcon()}
                    <span className="text-2xl font-bold">
                      {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-sm opacity-75">vs. evaluación anterior</div>
                </div>
              )}
            </div>

            {score?.interpretation && (
              <div className="pt-4 border-t border-current border-opacity-20">
                <p className="font-medium">{score.interpretation}</p>
              </div>
            )}
          </div>

          {/* T-Score for PROMIS */}
          {score?.tScore && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">T-Score (PROMIS):</span>
                <span className="text-2xl font-bold text-gray-900">{score.tScore}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Media poblacional = 50, Desviación estándar = 10
              </p>
            </div>
          )}

          {/* Subscales */}
          {score?.subscaleScores && Object.keys(score.subscaleScores).length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-gray-900 mb-3">Sub-escalas</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(score.subscaleScores).map(([subscale, value]) => (
                  <div key={subscale} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1 capitalize">{subscale}</div>
                    <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Responses */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Respuestas Detalladas
          </h3>
          
          <div className="space-y-3">
            {session.responses.map((response, idx) => (
              <div key={response.id} className="bg-white p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{response.itemText}</p>
                    <p className="text-sm font-medium text-blue-600">
                      Respuesta: {response.valueRaw}
                      {response.valueNorm !== undefined && (
                        <span className="text-gray-500 ml-2">(Valor: {response.valueNorm})</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOINC Code */}
        {survey.loincCode && (
          <div className="p-6 border-t border-gray-200 bg-blue-50">
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <Info className="w-4 h-4" />
              <span>Código LOINC: <strong>{survey.loincCode}</strong></span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

