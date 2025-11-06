import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import apiClient from '../../api/client';

interface SurveyItem {
  id: string;
  text: string;
  type: 'radio' | 'checkbox' | 'text';
  options?: Array<{ value: number | string; label: string }>;
  required?: boolean;
}

interface SurveyTemplate {
  id: string;
  code: string;
  title: string;
  description?: string;
  items: SurveyItem[];
}

export const ResponderEncuesta = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<SurveyTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/surveys/templates/${id}`);
      setTemplate(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar encuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (itemId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template) return;

    // Validate required fields
    const requiredItems = template.items.filter((item) => item.required !== false);
    const missingAnswers = requiredItems.filter((item) => !answers[item.id]);
    
    if (missingAnswers.length > 0) {
      setError('Por favor responde todas las preguntas requeridas');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([itemId, value]) => ({
        itemId,
        value,
      }));

      await apiClient.post('/surveys/responses', {
        surveyId: template.id,
        answers: formattedAnswers,
      });

      // Success - redirect to encuestas list
      navigate('/mis-encuestas', {
        state: { message: 'Encuesta enviada exitosamente' },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar encuesta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-600">Cargando encuesta...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && template && (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
              {template.description && (
                <p className="mt-2 text-sm text-gray-600">{template.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {template.items.map((item, index) => (
                <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    {index + 1}. {item.text}
                    {item.required !== false && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {item.type === 'radio' && item.options && (
                    <div className="space-y-2">
                      {item.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name={item.id}
                            value={option.value}
                            checked={answers[item.id] === option.value}
                            onChange={(e) => handleAnswerChange(item.id, Number(e.target.value))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {item.type === 'checkbox' && item.options && (
                    <div className="space-y-2">
                      {item.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={answers[item.id]?.includes(option.value) || false}
                            onChange={(e) => {
                              const currentValues = answers[item.id] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter((v: any) => v !== option.value);
                              handleAnswerChange(item.id, newValues);
                            }}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {item.type === 'text' && (
                    <textarea
                      value={answers[item.id] || ''}
                      onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Escribe tu respuesta aquí..."
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/mis-encuestas')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Enviando...' : 'Enviar Respuestas'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

