import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { examenesApi, Examen } from '../../api/examenes';
import { pacientesApi } from '../../api/pacientes';
import { useForm } from 'react-hook-form';

export const ExamenesList = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Examen>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [examenesData, pacientesData] = await Promise.all([
        examenesApi.getAll(),
        pacientesApi.getAll()
      ]);
      setExamenes(examenesData.examenes);
      setPacientes(pacientesData.pacientes);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Examen) => {
    try {
      setSubmitting(true);
      const result = await examenesApi.create(data);
      
      // Si hay archivo, subirlo
      if (selectedFile && result.examen) {
        setUploadingPdf(true);
        await examenesApi.uploadPdf(result.examen.id!, selectedFile);
      }
      
      setIsModalOpen(false);
      reset();
      setSelectedFile(null);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear examen');
    } finally {
      setSubmitting(false);
      setUploadingPdf(false);
    }
  };

  const handleDownloadPdf = async (examenId: number) => {
    try {
      const { url } = await examenesApi.getPdfUrl(examenId);
      window.open(url, '_blank');
    } catch (err: any) {
      setError('Error al obtener PDF');
    }
  };

  const getInterpretacionBadge = (interpretacion?: string) => {
    const classes = {
      normal: 'bg-green-100 text-green-800',
      alterado: 'bg-red-100 text-red-800',
      pendiente: 'bg-yellow-100 text-yellow-800'
    };
    
    const className = classes[interpretacion as keyof typeof classes] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
        {interpretacion || 'Sin definir'}
      </span>
    );
  };

  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (item: Examen) => new Date(item.fecha).toLocaleDateString('es-CL')
    },
    {
      key: 'paciente',
      header: 'Paciente',
      render: (item: Examen) => 
        item.paciente ? `${item.paciente.firstName} ${item.paciente.lastName}` : '-'
    },
    {
      key: 'tipo',
      header: 'Tipo de Examen'
    },
    {
      key: 'interpretacion',
      header: 'Interpretación',
      render: (item: Examen) => getInterpretacionBadge(item.interpretacion)
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item: Examen) => (
        <div className="flex space-x-2">
          {item.pdfKey && (
            <button
              onClick={() => handleDownloadPdf(item.id!)}
              className="text-primary-600 hover:text-primary-900"
            >
              Ver PDF
            </button>
          )}
        </div>
      )
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
          title="Exámenes de Laboratorio"
          subtitle="Registro de resultados y análisis"
          headerAction={
            <Button onClick={() => setIsModalOpen(true)}>
              Nuevo Examen
            </Button>
          }
        >
          <Table
            data={examenes}
            columns={columns}
            loading={loading}
            emptyMessage="No hay exámenes registrados"
          />
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Nuevo Examen"
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

            <Input
              label="Tipo de Examen"
              {...register('tipo', { required: 'Tipo es requerido' })}
              error={errors.tipo?.message}
              placeholder="Ej: Hemograma completo"
            />

            <Input
              label="Fecha del Examen"
              type="date"
              {...register('fecha', { required: 'Fecha es requerida' })}
              error={errors.fecha?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resultados (JSON)
              </label>
              <textarea
                {...register('resultados')}
                rows={3}
                placeholder='{"hemoglobina": "14.5 g/dL", "leucocitos": "7000/mm3"}'
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              />
            </div>

            <Input
              label="Valores de Referencia"
              {...register('referencia')}
              placeholder="Ej: 12-16 g/dL"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interpretación
              </label>
              <select
                {...register('interpretacion')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Seleccione...</option>
                <option value="normal">Normal</option>
                <option value="alterado">Alterado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              {selectedFile && (
                <p className="mt-1 text-sm text-gray-500">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                {...register('notas')}
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
              <Button type="submit" loading={submitting || uploadingPdf}>
                {uploadingPdf ? 'Subiendo PDF...' : 'Guardar Examen'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

