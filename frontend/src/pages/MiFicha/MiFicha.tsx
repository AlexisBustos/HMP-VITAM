import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import apiClient from '../../api/client';

interface PatientData {
  id: string;
  rut: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  chronic?: string;
  allergies?: string;
  meds?: string;
}

export const MiFicha = () => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/pacientes/me/patient');
      setPatient(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Ficha Médica</h1>
          <p className="mt-2 text-sm text-gray-600">
            Información personal y antecedentes médicos
          </p>
        </div>

        {loading && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-600">Cargando información...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && patient && (
          <div className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">RUT</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.rut}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(patient.birthDate).toLocaleDateString('es-CL')} ({calculateAge(patient.birthDate)} años)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexo</label>
                  <p className="mt-1 text-sm text-gray-900">{patient.sex === 'M' ? 'Masculino' : patient.sex === 'F' ? 'Femenino' : 'Otro'}</p>
                </div>
                {patient.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.email}</p>
                  </div>
                )}
                {patient.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.phone}</p>
                  </div>
                )}
                {patient.address && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {patient.address}
                      {patient.city && `, ${patient.city}`}
                      {patient.region && `, ${patient.region}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Antecedentes Médicos */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Antecedentes Médicos
              </h2>
              <div className="space-y-4">
                {patient.chronic && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Enfermedades Crónicas</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.chronic}</p>
                  </div>
                )}
                {patient.allergies && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alergias</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.allergies}</p>
                  </div>
                )}
                {patient.meds && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medicamentos Actuales</label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{patient.meds}</p>
                  </div>
                )}
                {!patient.chronic && !patient.allergies && !patient.meds && (
                  <p className="text-sm text-gray-500">No hay antecedentes médicos registrados</p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Si necesitas actualizar tu información personal o antecedentes médicos, 
                por favor contacta a tu médico tratante o al personal administrativo.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

