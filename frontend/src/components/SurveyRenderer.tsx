import { useState } from 'react';
import { 
  Survey, 
  SurveyItem, 
  SurveyResponse, 
  SurveySession
} from '../types/surveys';
import { 
  getResponseOptions, 
  normalizeResponseValue,
  validateSurveyCompletion,
  calculateSurveyScore,
  evaluateAlerts
} from '../utils/surveyScoring';
import { AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';

interface SurveyRendererProps {
  survey: Survey;
  patientId: number;
  patientName: string;
  clinicianId?: number;
  onComplete: (session: SurveySession) => void;
  onCancel: () => void;
}

export default function SurveyRenderer({
  survey,
  patientId,
  patientName,
  clinicianId,
  onComplete,
  onCancel
}: SurveyRendererProps) {
  const [responses, setResponses] = useState<Map<number, string>>(new Map());
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [startTime] = useState(new Date());
  const [showValidation, setShowValidation] = useState(false);

  const sortedItems = [...survey.items].sort((a, b) => a.orderNum - b.orderNum);
  const currentItem = sortedItems[currentItemIndex];
  const progress = ((currentItemIndex + 1) / sortedItems.length) * 100;

  const handleResponse = (itemId: number, value: string) => {
    const newResponses = new Map(responses);
    newResponses.set(itemId, value);
    setResponses(newResponses);
    setShowValidation(false);
  };

  const handleNext = () => {
    if (!responses.has(currentItem.id) && currentItem.required) {
      setShowValidation(true);
      return;
    }

    if (currentItemIndex < sortedItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setShowValidation(false);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setShowValidation(false);
    }
  };

  const handleSubmit = () => {
    // Crear respuestas
    const surveyResponses: SurveyResponse[] = Array.from(responses.entries()).map(([itemId, valueRaw]) => {
      const item = survey.items.find(i => i.id === itemId)!;
      return {
        id: 0,
        sessionId: 0,
        itemId,
        itemCode: item.itemCode,
        itemText: item.text,
        valueRaw,
        valueNorm: normalizeResponseValue(item.responseType, valueRaw),
        answeredAt: new Date()
      };
    });

    // Validar completitud
    const validation = validateSurveyCompletion(survey, surveyResponses);
    if (!validation.isComplete) {
      alert(`Faltan respuestas requeridas: ${validation.missingItems.join(', ')}`);
      return;
    }

    // Crear sesión temporal para calcular score
    const tempSession: SurveySession = {
      id: Date.now(),
      patientId,
      patientName,
      surveyId: survey.id,
      surveyCode: survey.code,
      surveyName: survey.name,
      clinicianId,
      startedAt: startTime,
      completedAt: new Date(),
      responses: surveyResponses,
      alerts: []
    };

    // Calcular puntaje
    const score = calculateSurveyScore(survey, surveyResponses);
    tempSession.scores = score;

    // Evaluar alertas
    const alerts = evaluateAlerts(tempSession, survey);
    tempSession.alerts = alerts;

    onComplete(tempSession);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{survey.name}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Paciente: <span className="font-medium">{patientName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>~{survey.estimatedMins} min</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {currentItemIndex + 1} de {sortedItems.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* License Info */}
        {survey.licenseNotes && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-900">{survey.licenseNotes}</p>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
              {currentItemIndex + 1}
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-900 leading-relaxed">
                {currentItem.text}
              </p>
              {currentItem.required && (
                <span className="text-xs text-red-600 mt-1 inline-block">* Requerido</span>
              )}
            </div>
          </div>
        </div>

        {/* Response Options */}
        <div className="space-y-3">
          <SurveyItemRenderer
            item={currentItem}
            value={responses.get(currentItem.id)}
            onChange={(value) => handleResponse(currentItem.id, value)}
          />
        </div>

        {/* Validation Message */}
        {showValidation && currentItem.required && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Por favor responda esta pregunta antes de continuar</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancelar
        </button>

        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentItemIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {currentItemIndex < sortedItems.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Finalizar Encuesta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface SurveyItemRendererProps {
  item: SurveyItem;
  value?: string;
  onChange: (value: string) => void;
}

function SurveyItemRenderer({ item, value, onChange }: SurveyItemRendererProps) {
  const options = getResponseOptions(item.responseType, item.optionsJson);

  switch (item.responseType) {
    case 'LIKERT_0_3':
    case 'LIKERT_0_4':
    case 'LIKERT_1_5':
    case 'MULTIPLE_CHOICE':
    case 'YES_NO':
      return (
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                value === String(option.value)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`item-${item.id}`}
                value={option.value}
                checked={value === String(option.value)}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      );

    case 'LIKERT_1_10':
      return (
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onChange(String(option.value))}
                className={`flex-1 h-12 rounded-lg font-medium transition-all ${
                  value === String(option.value)
                    ? 'bg-blue-600 text-white scale-110'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 px-1">
            <span>Nada seguro</span>
            <span>Totalmente seguro</span>
          </div>
        </div>
      );

    case 'VAS_0_100':
      return (
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={value || '50'}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">{value || 50}%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>0% - Ninguno</span>
            <span>100% - Todos</span>
          </div>
        </div>
      );

    case 'NUMERIC':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
          placeholder="Ingrese un número"
        />
      );

    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
        />
      );
  }
}

