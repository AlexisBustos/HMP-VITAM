import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { consultasApi, Consulta } from '../../api/consultas';
import { pacientesApi } from '../../api/pacientes';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth';

export const ConsultasList = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Consulta>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [consultasData, pacientesData] = await Promise.all([
        consultasApi.getAll(),
        pacientesApi.getAll()
      ]);
      setConsultas(consultasData.consultas);
      setPacientes(pacientesData.pacientes);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Consulta) => {
    try {
      setSubmitting(true);
      await consultasApi.create({
        ...data,
        createdBy: user!.id
      });
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear consulta');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (item: Consulta) => new Date(item.createdAt!).toLocaleDateString('es-CL')
    },
    {
      key: 'paciente',
      header: 'Paciente',
      render: (item: Consulta) => 
        item.paciente ? `${item.paciente.firstName} ${item.paciente.lastName}` : '-'
    },
    {
      key: 'motivo',
      header: 'Motivo',
      render: (item: Consulta) => 
        item.motivo.length > 50 ? `${item.motivo.substring(0, 50)}...` : item.motivo
    },
    {
      key: 'cie10',
      header: 'CIE-10'
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
          title="Consultas Médicas"
          subtitle="Registro de atenciones y consultas"
          headerAction={
            <Button onClick={() => setIsModalOpen(true)}>
              Nueva Consulta
            </Button>
          }
        >
          <Table
            data={consultas}
            columns={columns}
            loading={loading}
            emptyMessage="No hay consultas registradas"
          />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nueva Consulta"
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
                Motivo de Consulta <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('motivo', { required: 'Motivo es requerido' })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.motivo && (
                <p className="mt-1 text-sm text-red-600">{errors.motivo.message}</p>
              )}
            </div>

            <Input
              label="Código CIE-10"
              {...register('cie10')}
              placeholder="Ej: J06.9"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Indicaciones
              </label>
              <textarea
                {...register('indicaciones')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicamentos Indicados
              </label>
              <textarea
                {...register('medsIndicadas')}
                rows={2}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={submitting}>
                Guardar Consulta
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

