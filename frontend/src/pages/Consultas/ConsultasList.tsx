import { useState, useMemo } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SnomedSearch } from '../../components/common/SnomedSearch';
import { SearchAndFilter, FilterConfig } from '../../components/common/SearchAndFilter';
import { demoConsultas } from '../../data/demo';

export const ConsultasList = () => {
  const [consultas] = useState(demoConsultas);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    pacienteId: '',
    motivo: '',
    diagnostico: '',
    diagnosticoSnomedId: '',
    cie10: '',
    indicaciones: '',
    medicamentos: '',
    medicamentosSnomedId: '',
    dosisMedicamentos: ''
  });

  // Configuración de filtros
  const filterConfig: FilterConfig[] = [
    {
      id: 'profesional',
      label: 'Profesional Tratante',
      type: 'select',
      options: [
        { value: 'Dr. Juan Pérez', label: 'Dr. Juan Pérez' },
        { value: 'Dra. María González', label: 'Dra. María González' },
        { value: 'Dr. Carlos Fernández', label: 'Dr. Carlos Fernández' }
      ]
    },
    {
      id: 'fecha',
      label: 'Fecha de Atención',
      type: 'daterange'
    }
  ];

  // Filtrar consultas
  const filteredConsultas = useMemo(() => {
    return consultas.filter(consulta => {
      // Búsqueda general
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          consulta.paciente.firstName.toLowerCase().includes(search) ||
          consulta.paciente.lastName.toLowerCase().includes(search) ||
          consulta.motivo.toLowerCase().includes(search) ||
          consulta.cie10?.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      // Filtro de fecha
      if (filters.fecha_from) {
        const consultaDate = new Date(consulta.createdAt);
        const fromDate = new Date(filters.fecha_from);
        if (consultaDate < fromDate) return false;
      }

      if (filters.fecha_to) {
        const consultaDate = new Date(consulta.createdAt);
        const toDate = new Date(filters.fecha_to);
        if (consultaDate > toDate) return false;
      }

      return true;
    });
  }, [consultas, searchTerm, filters]);

  const handleSearch = (term: string, filterValues: Record<string, any>) => {
    setSearchTerm(term);
    setFilters(filterValues);
  };

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
      medicamentos: '',
      medicamentosSnomedId: '',
      dosisMedicamentos: ''
    });
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card
          title="Consultas Médicas"
          subtitle={`${filteredConsultas.length} consulta(s) encontrada(s)`}
          headerAction={
            <Button onClick={() => setShowModal(true)}>
              Nueva Consulta
            </Button>
          }
        >
          <SearchAndFilter
            searchPlaceholder="Buscar por paciente, motivo o CIE-10..."
            filters={filterConfig}
            onSearch={handleSearch}
          />

          {filteredConsultas.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No existen registros que coincidan con los filtros seleccionados
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o limpiarlos para ver más resultados
              </p>
            </div>
          ) : (
            <Table
              data={filteredConsultas}
              columns={columns}
              emptyMessage="No hay consultas registradas"
            />
          )}
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

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800 font-medium mb-1">
                💊 Búsqueda de Medicamentos
              </p>
              <p className="text-xs text-blue-700">
                Busca medicamentos estandarizados con SNOMED CT
              </p>
            </div>

            <SnomedSearch
              type="medicamentos"
              value={formData.medicamentos}
              onChange={(value, conceptId) => 
                setFormData({ 
                  ...formData, 
                  medicamentos: value,
                  medicamentosSnomedId: conceptId || ''
                })
              }
              label="Medicamentos Indicados (SNOMED CT)"
              placeholder="Ej: paracetamol, ibuprofeno, amoxicilina..."
            />

            {formData.medicamentosSnomedId && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  <strong>✓ Código SNOMED CT:</strong> {formData.medicamentosSnomedId}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosis e Indicaciones de Uso
              </label>
              <textarea
                value={formData.dosisMedicamentos}
                onChange={(e) => setFormData({ ...formData, dosisMedicamentos: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 500mg cada 8 horas por 7 días"
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

