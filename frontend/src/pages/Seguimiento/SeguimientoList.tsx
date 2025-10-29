import { useState, useMemo } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { SearchAndFilter, FilterConfig } from '../../components/common/SearchAndFilter';
import { demoSeguimientos } from '../../data/demo';

const PATOLOGIAS = [
  { value: 'HTA', label: 'Hipertensión Arterial' },
  { value: 'DM2', label: 'Diabetes Mellitus Tipo 2' },
  { value: 'DISLI', label: 'Dislipidemia' },
  { value: 'OBESIDAD', label: 'Obesidad' },
  { value: 'SALUD_MENTAL', label: 'Salud Mental' }
];

export const SeguimientoList = () => {
  const [seguimientos] = useState(demoSeguimientos);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    pacienteId: '',
    patologia: '',
    fecha: '',
    parametros: '',
    adherencia: '',
    notas: '',
    proximoCtrl: ''
  });

  // Configuración de filtros
  const filterConfig: FilterConfig[] = [
    {
      id: 'patologia',
      label: 'Tipo de Patología',
      type: 'select',
      options: PATOLOGIAS
    },
    {
      id: 'fecha',
      label: 'Fecha de Control',
      type: 'daterange'
    }
  ];

  const getPatologiaLabel = (patologia: string) => {
    return PATOLOGIAS.find(p => p.value === patologia)?.label || patologia;
  };

  // Filtrar seguimientos
  const filteredSeguimientos = useMemo(() => {
    return seguimientos.filter(seguimiento => {
      // Búsqueda general
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          seguimiento.paciente.firstName.toLowerCase().includes(search) ||
          seguimiento.paciente.lastName.toLowerCase().includes(search) ||
          seguimiento.patologia.toLowerCase().includes(search) ||
          seguimiento.notas?.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      // Filtro de patología
      if (filters.patologia && seguimiento.patologia !== filters.patologia) {
        return false;
      }

      // Filtro de fecha
      if (filters.fecha_from) {
        const seguimientoDate = new Date(seguimiento.fecha);
        const fromDate = new Date(filters.fecha_from);
        if (seguimientoDate < fromDate) return false;
      }

      if (filters.fecha_to) {
        const seguimientoDate = new Date(seguimiento.fecha);
        const toDate = new Date(filters.fecha_to);
        if (seguimientoDate > toDate) return false;
      }

      return true;
    });
  }, [seguimientos, searchTerm, filters]);

  const handleSearch = (term: string, filterValues: Record<string, any>) => {
    setSearchTerm(term);
    setFilters(filterValues);
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
      key: 'patologia',
      header: 'Patología',
      render: (item: any) => getPatologiaLabel(item.patologia)
    },
    {
      key: 'proximoCtrl',
      header: 'Próximo Control',
      render: (item: any) => 
        item.proximoCtrl 
          ? new Date(item.proximoCtrl).toLocaleDateString('es-CL')
          : 'No programado'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nuevo seguimiento:', formData);
    alert('Seguimiento registrado (modo demostración)');
    setShowModal(false);
    setFormData({
      pacienteId: '',
      patologia: '',
      fecha: '',
      parametros: '',
      adherencia: '',
      notas: '',
      proximoCtrl: ''
    });
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card
          title="Seguimiento de Patologías Crónicas"
          subtitle={`${filteredSeguimientos.length} seguimiento(s) encontrado(s)`}
          headerAction={
            <Button onClick={() => setShowModal(true)}>
              Nuevo Seguimiento
            </Button>
          }
        >
          <SearchAndFilter
            searchPlaceholder="Buscar por paciente o patología..."
            filters={filterConfig}
            onSearch={handleSearch}
          />

          {filteredSeguimientos.length === 0 ? (
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
              data={filteredSeguimientos}
              columns={columns}
              emptyMessage="No hay seguimientos registrados"
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Seguimiento de Patología Crónica"
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
                Patología <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.patologia}
                onChange={(e) => setFormData({ ...formData, patologia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una patología</option>
                {PATOLOGIAS.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Fecha del Control"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parámetros (JSON)
              </label>
              <textarea
                value={formData.parametros}
                onChange={(e) => setFormData({ ...formData, parametros: e.target.value })}
                rows={3}
                placeholder='{"pa": "120/80", "glicemia": "95 mg/dL", "imc": "24.5"}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato JSON con los parámetros medidos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adherencia (JSON)
              </label>
              <textarea
                value={formData.adherencia}
                onChange={(e) => setFormData({ ...formData, adherencia: e.target.value })}
                rows={2}
                placeholder='{"medicamentos": "buena", "dieta": "regular", "ejercicio": "mala"}'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Adherencia a medicamentos, dieta y hábitos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observaciones del control..."
              />
            </div>

            <Input
              label="Próximo Control (opcional)"
              type="date"
              value={formData.proximoCtrl}
              onChange={(e) => setFormData({ ...formData, proximoCtrl: e.target.value })}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Seguimiento
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

