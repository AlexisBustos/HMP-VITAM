import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { seguimientoApi, Seguimiento, Patologia } from '../../api/seguimiento';
import { pacientesApi } from '../../api/pacientes';
import { useForm } from 'react-hook-form';

const PATOLOGIAS: { value: Patologia; label: string }[] = [
  { value: 'HTA', label: 'Hipertensión Arterial' },
  { value: 'DM2', label: 'Diabetes Mellitus Tipo 2' },
  { value: 'DISLI', label: 'Dislipidemia' },
  { value: 'OBESIDAD', label: 'Obesidad' },
  { value: 'SALUD_MENTAL', label: 'Salud Mental' }
];

export const SeguimientoList = () => {
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Seguimiento>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [seguimientosData, pacientesData] = await Promise.all([
        seguimientoApi.getAll(),
        pacientesApi.getAll()
      ]);
      setSeguimientos(seguimientosData.seguimientos);
      setPacientes(pacientesData.pacientes);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Seguimiento) => {
    try {
      setSubmitting(true);
      await seguimientoApi.create(data);
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear seguimiento');
    } finally {
      setSubmitting(false);
    }
  };

  const getPatologiaLabel = (patologia: string) => {
    return PATOLOGIAS.find(p => p.value === patologia)?.label || patologia;
  };

  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (item: Seguimiento) => new Date(item.fecha).toLocaleDateString('es-CL')
    },
    {
      key: 'paciente',
      header: 'Paciente',
      render: (item: Seguimiento) => 
        item.paciente ? `${item.paciente.firstName} ${item.paciente.lastName}` : '-'
    },
    {
      key: 'patologia',
      header: 'Patología',
      render: (item: Seguimiento) => getPatologiaLabel(item.patologia)
    },
    {
      key: 'proximoCtrl',
      header: 'Próximo Control',
      render: (item: Seguimiento) => 
        item.proximoCtrl ? new Date(item.proximoCtrl).toLocaleDateString('es-CL') : '-'
    }
  ];

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Card
          title="Seguimiento de Patologías Crónicas"
          subtitle="Control y monitoreo de condiciones crónicas"
          headerAction={
            <Button onClick={() => setIsModalOpen(true)}>
              Nuevo Seguimiento
            </Button>
          }
        >
          <Table
            data={seguimientos}
            columns={columns}
            loading={loading}
            emptyMessage="No hay seguimientos registrados"
          />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nuevo Seguimiento"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente <span className="text-red-500">*</span>
              </label>
              <select
                {...register('pacienteId', { 
                  required: 'Paciente es requerido',
                  valueAsNumber: true 
                })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} - {p.rut}
                  </option>
                ))}
              </select>
              {errors.pacienteId && (
                <p className="mt-1 text-sm text-red-600">{errors.pacienteId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patología <span className="text-red-500">*</span>
              </label>
              <select
                {...register('patologia', { required: 'Patología es requerida' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seleccione una patología</option>
                {PATOLOGIAS.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {errors.patologia && (
                <p className="mt-1 text-sm text-red-600">{errors.patologia.message}</p>
              )}
            </div>

            <Input
              label="Fecha del Control"
              type="date"
              {...register('fecha', { required: 'Fecha es requerida' })}
              error={errors.fecha?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parámetros (JSON)
              </label>
              <textarea
                {...register('parametros')}
                rows={3}
                placeholder='{"pa": "120/80", "glicemia": "95 mg/dL", "imc": "24.5"}'
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato JSON con los parámetros medidos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adherencia (JSON)
              </label>
              <textarea
                {...register('adherencia')}
                rows={2}
                placeholder='{"medicamentos": "buena", "dieta": "regular", "ejercicio": "mala"}'
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Adherencia a medicamentos, dieta y hábitos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                {...register('notas')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <Input
              label="Próximo Control"
              type="date"
              {...register('proximoCtrl')}
              helperText="Fecha programada para el siguiente control"
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={submitting}>
                Guardar Seguimiento
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

