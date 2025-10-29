import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SnomedSearch } from '../../components/common/SnomedSearch';
import { demoExamenes } from '../../data/demo';

export const ExamenesList = () => {
  const [examenes] = useState(demoExamenes);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pacienteId: '',
    tipo: '',
    tipoSnomedId: '',
    fecha: '',
    resultados: '',
    referencia: '',
    interpretacion: '',
    notas: ''
  });

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
      render: (item: any) => new Date(item.fecha).toLocaleDateString('es-CL')
    },
    {
      key: 'paciente',
      header: 'Paciente',
      render: (item: any) => `${item.paciente.firstName} ${item.paciente.lastName}`
    },
    {
      key: 'tipo',
      header: 'Tipo de Examen'
    },
    {
      key: 'interpretacion',
      header: 'Interpretación',
      render: (item: any) => getInterpretacionBadge(item.interpretacion)
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nuevo examen:', formData);
    alert('Examen registrado (modo demostración)');
    setShowModal(false);
    setFormData({
      pacienteId: '',
      tipo: '',
      tipoSnomedId: '',
      fecha: '',
      resultados: '',
      referencia: '',
      interpretacion: '',
      notas: ''
    });
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card
          title="Exámenes de Laboratorio"
          subtitle="Registro de resultados y análisis (Datos de demostración)"
          headerAction={
            <Button onClick={() => setShowModal(true)}>
              Nuevo Examen
            </Button>
          }
        >
          <Table
            data={examenes}
            columns={columns}
            emptyMessage="No hay exámenes registrados"
          />
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Examen de Laboratorio"
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="ID del Paciente"
              value={formData.pacienteId}
              onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
              placeholder="Ej: 1"
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800 font-medium mb-1">
                🔬 Búsqueda con SNOMED CT
              </p>
              <p className="text-xs text-blue-700">
                Busca el tipo de examen estandarizado
              </p>
            </div>

            <SnomedSearch
              type="examenes"
              value={formData.tipo}
              onChange={(value, conceptId) => 
                setFormData({ 
                  ...formData, 
                  tipo: value,
                  tipoSnomedId: conceptId || ''
                })
              }
              label="Tipo de Examen (SNOMED CT)"
              placeholder="Ej: hemograma, glicemia, perfil lipídico..."
            />

            {formData.tipoSnomedId && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  <strong>✓ Código SNOMED CT:</strong> {formData.tipoSnomedId}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Tipo de examen estandarizado seleccionado
                </p>
              </div>
            )}

            <Input
              label="Fecha del Examen"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultados (JSON)
              </label>
              <textarea
                value={formData.resultados}
                onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
                rows={3}
                placeholder='{"hemoglobina": "14.5 g/dL", "leucocitos": "7000/mm3"}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <Input
              label="Valores de Referencia"
              value={formData.referencia}
              onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
              placeholder="Ej: 12-16 g/dL"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interpretación
              </label>
              <select
                value={formData.interpretacion}
                onChange={(e) => setFormData({ ...formData, interpretacion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione...</option>
                <option value="normal">Normal</option>
                <option value="alterado">Alterado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones adicionales..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Examen
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

