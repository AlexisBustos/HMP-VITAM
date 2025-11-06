import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import apiClient from '../../api/client';

interface SurveyTemplate {
  id: string;
  code: string;
  title: string;
  description?: string;
  isActive: boolean;
}

interface SurveyResponse {
  id: string;
  createdAt: string;
  score: number;
  interpretation: string;
  template: {
    code: string;
    title: string;
  };
}

export const MisEncuestas = () => {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [templatesRes, responsesRes] = await Promise.all([
        apiClient.get('/surveys/templates?active=true'),
        apiClient.get('/surveys/responses/mine'),
      ]);
      setTemplates(templatesRes.data.data);
      setResponses(responsesRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar encuestas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Encuestas</h1>
          <p className="mt-2 text-sm text-gray-600">
            Completa encuestas de salud y revisa tus respuestas anteriores
          </p>
        </div>

        {loading && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-600">Cargando encuestas...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-8">
            {/* Encuestas Disponibles */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Encuestas Disponibles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description || 'Sin descripción'}
                    </p>
                    <Link
                      to={`/encuestas/responder/${template.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Responder
                    </Link>
                  </div>
                ))}
              </div>
              {templates.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">No hay encuestas disponibles en este momento</p>
                </div>
              )}
            </div>

            {/* Mis Respuestas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mis Respuestas Anteriores
              </h2>
              {responses.length > 0 ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Encuesta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puntaje
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interpretación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response) => (
                        <tr key={response.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {response.template.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {response.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              response.interpretation.includes('severo') || response.interpretation.includes('grave')
                                ? 'bg-red-100 text-red-800'
                                : response.interpretation.includes('moderado')
                                ? 'bg-yellow-100 text-yellow-800'
                                : response.interpretation.includes('leve') || response.interpretation.includes('mínimo')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {response.interpretation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">Aún no has completado ninguna encuesta</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

