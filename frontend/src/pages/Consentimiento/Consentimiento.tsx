import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import apiClient from '../../api/client';
import ReactMarkdown from 'react-markdown';

interface ConsentTemplate {
  id: string;
  version: number;
  title: string;
  bodyMarkdown: string;
  hash: string;
}

export const Consentimiento = () => {
  const navigate = useNavigate();
  const { user, setMustAcceptConsent } = useAuthStore();
  const [template, setTemplate] = useState<ConsentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveConsent();
  }, []);

  const fetchActiveConsent = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/consents/active');
      setTemplate(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar el consentimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!template) return;

    try {
      setAccepting(true);
      setError('');

      await apiClient.post('/consents/accept', {
        templateId: template.id,
      });

      // Update store
      setMustAcceptConsent(false);

      // Redirect based on role
      if (user?.roles.includes('PERSON')) {
        navigate('/mi-ficha');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al aceptar el consentimiento');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        {loading && (
          <div className="text-center">
            <p className="text-gray-600">Cargando consentimiento...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && template && (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {template.title}
              </h1>
              <p className="text-sm text-gray-500">Versión {template.version}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Para continuar utilizando el sistema, 
                debes leer y aceptar el siguiente consentimiento informado sobre el 
                tratamiento de tus datos de salud.
              </p>
            </div>

            <div className="prose max-w-none mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <ReactMarkdown>{template.bodyMarkdown}</ReactMarkdown>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                Al hacer clic en "Aceptar y continuar", confirmas que has leído y 
                comprendido el consentimiento informado, y aceptas el tratamiento de 
                tus datos de salud conforme a lo establecido.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {accepting ? 'Procesando...' : 'Aceptar y continuar'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Si tienes dudas o consultas, contacta a: soporte@vitamhc.cl
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

