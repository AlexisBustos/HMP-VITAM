import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';
import {
  SurveyItemNormalized,
  SurveyTemplateNormalized,
  SurveyAnswerSubmit,
  SurveyResponseSubmitPayload,
} from '../../types/surveys';

type FormValues = Record<string, any>; // cada item.id => valor

export function ResponderEncuesta() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState<SurveyTemplateNormalized | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({ mode: 'onSubmit' });

  // 1) Cargar plantilla por :id o query param
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        setError(null);

        const surveyId = id || searchParams.get('id');
        if (!surveyId) {
          throw new Error('No se especificó ID de encuesta');
        }

        const response = await apiClient.get(`/surveys/templates/${surveyId}`);
        const rawTemplate = response.data.data || response.data;

        // Normalizar plantilla
        const normalized = normalizeTemplate(rawTemplate);
        setTemplate(normalized);

        // Inicializar valores por defecto para arrays (multi)
        normalized.items.forEach((item) => {
          if (item.type === 'multi') {
            setValue(item.id, []);
          }
        });
      } catch (err: any) {
        console.error('Error cargando plantilla:', err);
        setError(err.response?.data?.message || err.message || 'Error cargando encuesta');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id, searchParams, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (!template) return;

    try {
      setSubmitting(true);
      setError(null);

      // Construir answers: [{itemId, value}]
      const answers: SurveyAnswerSubmit[] = template.items.map((item) => {
        let v = values[item.id];

        // Coerción de tipos según el tipo de pregunta
        if (item.type === 'number' || item.type === 'likert' || item.type === 'single') {
          // Intentar convertir a número si corresponde
          if (v !== null && v !== undefined && v !== '' && !Array.isArray(v)) {
            const num = Number(v);
            if (!isNaN(num)) {
              v = num;
            }
          }
        }

        return { itemId: item.id, value: v };
      });

      const payload: SurveyResponseSubmitPayload = {
        surveyId: template.id,
        answers,
      };

      await apiClient.post('/api/surveys/responses', payload);

      // Feedback exitoso
      alert('✅ Encuesta enviada con éxito');
      navigate('/encuestas');
    } catch (err: any) {
      console.error('Error enviando encuesta:', err);
      setError(err.response?.data?.message || err.message || 'Error enviando respuestas');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/encuestas')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Volver a Encuestas
          </button>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600">No se encontró la encuesta</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
        {template.description && (
          <p className="text-sm text-gray-600 mt-2">{template.description}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span>Versión: {template.version}</span>
          <span>•</span>
          <span>{template.items.length} preguntas</span>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {template.items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </span>
              <div className="flex-1">
                <label className="block font-medium text-gray-900 mb-3">
                  {item.text}
                  {item.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                <Controller
                  name={item.id}
                  control={control}
                  rules={{
                    required: item.required ? 'Este campo es obligatorio' : false,
                  }}
                  render={({ field }) => <SurveyInput item={item} field={field} />}
                />

                {errors[item.id] && (
                  <p className="text-red-600 text-sm mt-2">
                    {(errors[item.id]?.message as string) || 'Campo requerido'}
                  </p>
                )}

                {item.help && (
                  <p className="text-xs text-gray-500 mt-2 italic">{item.help}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => navigate('/encuestas')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {submitting ? 'Enviando...' : 'Enviar respuestas'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// Componente de entrada dinámico según tipo de pregunta
// ============================================================================
function SurveyInput({ item, field }: { item: SurveyItemNormalized; field: any }) {
  switch (item.type) {
    case 'single':
      // Radio buttons (opción única)
      return (
        <div className="space-y-2">
          {item.options?.map((opt) => (
            <label
              key={String(opt.value)}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                value={String(opt.value)}
                checked={String(field.value) === String(opt.value)}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'multi':
      // Checkboxes (múltiple selección)
      return (
        <div className="space-y-2">
          {item.options?.map((opt) => {
            const checked =
              Array.isArray(field.value) &&
              field.value.some((v: any) => String(v) === String(opt.value));
            return (
              <label
                key={String(opt.value)}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checked}
                  onChange={(e) => {
                    const arr = Array.isArray(field.value) ? [...field.value] : [];
                    if (e.target.checked) {
                      if (!arr.some((v: any) => String(v) === String(opt.value))) {
                        arr.push(opt.value);
                      }
                    } else {
                      const idx = arr.findIndex((v: any) => String(v) === String(opt.value));
                      if (idx >= 0) arr.splice(idx, 1);
                    }
                    field.onChange(arr);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-900">{opt.label}</span>
              </label>
            );
          })}
        </div>
      );

    case 'likert':
      // Escala Likert (radio buttons en línea)
      return (
        <div className="flex flex-wrap gap-3">
          {item.options?.map((opt) => (
            <label
              key={String(opt.value)}
              className={`flex items-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                String(field.value) === String(opt.value)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                value={String(opt.value)}
                checked={String(field.value) === String(opt.value)}
                onChange={(e) => field.onChange(e.target.value)}
                className="sr-only"
              />
              <span className="font-medium text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={item.placeholder}
          value={field.value ?? ''}
          min={item.min}
          max={item.max}
          step={item.step ?? 1}
          onChange={(e) => field.onChange(e.target.value)}
        />
      );

    case 'text':
      return (
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          placeholder={item.placeholder}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e.target.value)}
        />
      );

    default:
      return (
        <div className="text-sm text-gray-500 italic">
          Tipo de pregunta no soportado: {item.type}
        </div>
      );
  }
}

// ============================================================================
// Normalizador de plantillas (mapea formato backend → formato FE)
// ============================================================================
function normalizeTemplate(raw: any): SurveyTemplateNormalized {
  // Si raw.items ya está en el formato correcto, retornar tal cual
  // Si no, mapear según el formato real del backend

  const items: SurveyItemNormalized[] = (raw.items || []).map((it: any, index: number) => {
    // Detectar tipo según el formato del backend
    let type: SurveyItemNormalized['type'] = 'likert'; // Default para PHQ-9, GAD-7, AUDIT
    let options: SurveyItemNormalized['options'] = undefined;

    // Si el item ya tiene type, usarlo
    if (it.type) {
      type = it.type;
    }

    // Si tiene options, usarlas
    if (it.options && Array.isArray(it.options)) {
      options = it.options;
    }

    // Para PHQ-9, GAD-7, AUDIT (likert 0-3)
    // Si no tiene options pero es tipo likert, generar opciones estándar
    if (type === 'likert' && !options) {
      options = [
        { value: 0, label: 'Nunca' },
        { value: 1, label: 'Varios días' },
        { value: 2, label: 'Más de la mitad de los días' },
        { value: 3, label: 'Casi todos los días' },
      ];
    }

    return {
      id: it.id || `q${index + 1}`,
      text: it.text || it.question || '',
      type,
      required: it.required ?? true,
      options,
      min: it.min,
      max: it.max,
      step: it.step,
      placeholder: it.placeholder,
      help: it.help,
    };
  });

  return {
    id: raw.id,
    version: raw.version || 'v1',
    title: raw.title || raw.name || 'Encuesta',
    description: raw.description,
    items,
    scoring: raw.scoring,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

