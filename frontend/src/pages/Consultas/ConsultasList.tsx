import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SnomedSearch } from '../../components/common/SnomedSearch';
import { demoConsultas } from '../../data/demo';

export const ConsultasList = () => {
  const [consultas] = useState(demoConsultas);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pacienteId: '',
    motivo: '',
    diagnostico: '',
    diagnosticoSnomedId: '',
    cie10: '',
    indicaciones: '',
    medicamentos: ''
  });

  const columns = [
    {
      key: 'paciente',
      header: 'Paciente',
      render: (item: any) => `${item.paciente.firstName} ${item.paciente.lastName}`
    },
    {
      key: 'motivo',
      header: 'Motivo de Consulta',
      render: (item: any) => 
        item.motivo.length > 50 ? `${item.motivo.substring(0, 50)}...` : item.motivo
    },
    {
      key: 'cie10',
      header: 'CIE-10'
    },
    {
      key: 'createdAt',
      header: 'Fecha',
      render: (item: any) => new Date(item.createdAt).toLocaleDateString('es-CL')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nueva consulta:', formData);
    alert('Consulta registrada (modo demostración)');
    setShowModal(false);
    setFormData({
      pacienteId: '',
      motivo: '',
      diagnostico: '',
      diagnosticoSnomedId: '',
      cie10: '',
      indicaciones: '',
      medicamentos: ''
    });
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card
          title="Consultas Médicas"
          subtitle="Registro de atenciones y consultas (Datos de demostración)"
          headerAction={
            <Button onClick={() => setShowModal(true)}>
              Nueva Consulta
            </Button>
          }
        >
          <Table
            data={consultas}
            columns={columns}
            emptyMessage="No hay consultas registradas"
          />
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nueva Consulta Médica"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Consulta <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el motivo de la consulta..."
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800 font-medium mb-1">
                🔍 Búsqueda con SNOMED CT
              </p>
              <p className="text-xs text-blue-700">
                Escribe al menos 2 caracteres para buscar diagnósticos estandarizados
              </p>
            </div>

            <SnomedSearch
              type="diagnosticos"
              value={formData.diagnostico}
              onChange={(value, conceptId) => 
                setFormData({ 
                  ...formData, 
                  diagnostico: value,
                  diagnosticoSnomedId: conceptId || ''
                })
              }
              label="Diagnóstico (SNOMED CT)"
              placeholder="Ej: diabetes, hipertensión, neumonía..."
            />

            {formData.diagnosticoSnomedId && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  <strong>✓ Código SNOMED CT:</strong> {formData.diagnosticoSnomedId}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Diagnóstico estandarizado seleccionado
                </p>
              </div>
            )}

            <Input
              label="Código CIE-10 (opcional)"
              value={formData.cie10}
              onChange={(e) => setFormData({ ...formData, cie10: e.target.value })}
              placeholder="Ej: I10"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indicaciones
              </label>
              <textarea
                value={formData.indicaciones}
                onChange={(e) => setFormData({ ...formData, indicaciones: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Indicaciones médicas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicamentos Indicados
              </label>
              <textarea
                value={formData.medicamentos}
                onChange={(e) => setFormData({ ...formData, medicamentos: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Medicamentos y dosis..."
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
                Guardar Consulta
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

