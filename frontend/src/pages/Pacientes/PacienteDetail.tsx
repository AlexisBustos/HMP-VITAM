import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { demoPacientes } from '../../data/demo';

export const PacienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const paciente = demoPacientes.find(p => p.id === Number(id));

  if (!paciente) {
    return (
      <Layout>
        <div className="px-4 py-6">
          <Card title="Paciente no encontrado">
            <p className="text-gray-600">El paciente solicitado no existe.</p>
            <Button onClick={() => navigate('/pacientes')} className="mt-4">
              Volver a Pacientes
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const parseJSON = (jsonString: string | undefined) => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  const habits = parseJSON(paciente.habits);
  const anthropo = parseJSON(paciente.anthropo);
  const vitals = parseJSON(paciente.vitals);
  const mental = parseJSON(paciente.mental);

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ficha de Paciente
            </h1>
            <p className="text-gray-600 mt-1">
              {paciente.firstName} {paciente.lastName}
            </p>
          </div>
          <Button onClick={() => navigate('/pacientes')} variant="secondary">
            ← Volver
          </Button>
        </div>

        {/* Datos Personales */}
        <Card title="Datos Personales" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">RUT</label>
              <p className="mt-1 text-gray-900">{paciente.rut}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <p className="mt-1 text-gray-900">{paciente.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellidos</label>
              <p className="mt-1 text-gray-900">{paciente.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <p className="mt-1 text-gray-900">
                {new Date(paciente.birthDate).toLocaleDateString('es-CL')} ({calcularEdad(paciente.birthDate)} años)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sexo</label>
              <p className="mt-1 text-gray-900">{paciente.genderId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
              <p className="mt-1 text-gray-900">{paciente.marital}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nacionalidad</label>
              <p className="mt-1 text-gray-900">{paciente.nationality}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Educación</label>
              <p className="mt-1 text-gray-900">{paciente.education}</p>
            </div>
          </div>
        </Card>

        {/* Datos de Contacto */}
        <Card title="Datos de Contacto" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <p className="mt-1 text-gray-900">{paciente.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{paciente.email}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <p className="mt-1 text-gray-900">{paciente.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <p className="mt-1 text-gray-900">{paciente.city}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Región</label>
              <p className="mt-1 text-gray-900">{paciente.region}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Contacto de Emergencia</label>
              <p className="mt-1 text-gray-900">{paciente.emergency}</p>
            </div>
          </div>
        </Card>

        {/* Ficha Médica */}
        <Card title="Ficha Médica" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enfermedades Crónicas</label>
              <p className="mt-1 text-gray-900">{paciente.chronic || 'Ninguna'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alergias</label>
              <p className="mt-1 text-gray-900">{paciente.allergies || 'Ninguna conocida'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cirugías Previas</label>
              <p className="mt-1 text-gray-900">{paciente.surgeries || 'Ninguna'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medicamentos Actuales</label>
              <p className="mt-1 text-gray-900">{paciente.meds || 'Ninguno'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Antecedentes Familiares</label>
              <p className="mt-1 text-gray-900">{paciente.familyHx || 'Sin antecedentes relevantes'}</p>
            </div>
          </div>
        </Card>

        {/* Hábitos */}
        {habits && (
          <Card title="Hábitos de Vida" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tabaco</label>
                <p className="mt-1 text-gray-900">{habits.tabaco || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alcohol</label>
                <p className="mt-1 text-gray-900">{habits.alcohol || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ejercicio</label>
                <p className="mt-1 text-gray-900">{habits.ejercicio || 'No especificado'}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Antropometría */}
        {anthropo && (
          <Card title="Datos Antropométricos" className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Peso</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{anthropo.peso}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Talla</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{anthropo.talla}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IMC</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{anthropo.imc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cintura</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{anthropo.cintura}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Signos Vitales */}
        {vitals && (
          <Card title="Signos Vitales" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Presión Arterial</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{vitals.pa} mmHg</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frecuencia Cardíaca</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{vitals.fc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Saturación O₂</label>
                <p className="mt-1 text-xl font-semibold text-gray-900">{vitals.spo2}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Salud Mental */}
        {mental && (
          <Card title="Salud Mental" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nivel de Estrés</label>
                <p className="mt-1 text-gray-900">{mental.estres}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Síntomas</label>
                <p className="mt-1 text-gray-900">{mental.sintomas}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Notas Adicionales */}
        {paciente.notes && (
          <Card title="Notas Adicionales" className="mb-6">
            <p className="text-gray-900">{paciente.notes}</p>
          </Card>
        )}

        {/* Información del Registro */}
        <Card title="Información del Registro">
          <div className="text-sm text-gray-600">
            <p>Fecha de registro: {new Date(paciente.createdAt).toLocaleString('es-CL')}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

