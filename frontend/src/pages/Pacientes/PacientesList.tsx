import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { pacientesApi } from '../../api/pacientes';
import { useAuthStore } from '../../store/auth';

export const PacientesList = () => {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { hasRole } = useAuthStore();

  const canCreate = hasRole('ADMIN_GENERAL', 'ADMIN_PRO_CLINICO');

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      const data = await pacientesApi.getAll();
      setPacientes(data.pacientes);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando pacientes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          {canCreate && (
            <Link
              to="/pacientes/nuevo"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Nuevo Paciente
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sexo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {paciente.rut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {paciente.firstName} {paciente.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.sex}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paciente.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/pacientes/${paciente.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Ver
                    </Link>
                    {canCreate && (
                      <Link
                        to={`/pacientes/${paciente.id}/editar`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Editar
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pacientes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay pacientes registrados</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

