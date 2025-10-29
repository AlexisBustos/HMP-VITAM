import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { SearchAndFilter, FilterConfig } from '../../components/common/SearchAndFilter';
import { demoPacientes } from '../../data/demo';

export const PacientesList = () => {
  const navigate = useNavigate();
  const [pacientes] = useState(demoPacientes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Configuración de filtros
  const filterConfig: FilterConfig[] = [
    {
      id: 'rut',
      label: 'RUT',
      type: 'text',
      placeholder: '12.345.678-9'
    },
    {
      id: 'city',
      label: 'Ciudad',
      type: 'select',
      options: [
        { value: 'Santiago', label: 'Santiago' },
        { value: 'Valparaíso', label: 'Valparaíso' },
        { value: 'Concepción', label: 'Concepción' },
        { value: 'La Serena', label: 'La Serena' },
        { value: 'Temuco', label: 'Temuco' }
      ]
    },
    {
      id: 'sex',
      label: 'Sexo',
      type: 'select',
      options: [
        { value: 'M', label: 'Masculino' },
        { value: 'F', label: 'Femenino' }
      ]
    },
    {
      id: 'ageRange',
      label: 'Rango Etario',
      type: 'agerange'
    },
    {
      id: 'chronic',
      label: 'Enfermedades Crónicas',
      type: 'multiselect',
      options: [
        { value: 'HTA', label: 'Hipertensión Arterial' },
        { value: 'DM2', label: 'Diabetes Mellitus tipo 2' },
        { value: 'Dislipidemia', label: 'Dislipidemia' },
        { value: 'Obesidad', label: 'Obesidad' },
        { value: 'Hipotiroidismo', label: 'Hipotiroidismo' }
      ]
    }
  ];

  // Calcular edad a partir de fecha de nacimiento
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

  // Verificar si edad está en rango
  const isInAgeRange = (age: number, range: string) => {
    if (range === '0-9') return age >= 0 && age <= 9;
    if (range === '10-19') return age >= 10 && age <= 19;
    if (range === '20-39') return age >= 20 && age <= 39;
    if (range === '40-64') return age >= 40 && age <= 64;
    if (range === '65+') return age >= 65;
    return true;
  };

  // Filtrar pacientes
  const filteredPacientes = useMemo(() => {
    return pacientes.filter(paciente => {
      // Búsqueda general
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          paciente.firstName.toLowerCase().includes(search) ||
          paciente.lastName.toLowerCase().includes(search) ||
          paciente.rut.toLowerCase().includes(search) ||
          paciente.email.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      // Filtro RUT
      if (filters.rut) {
        const rutFilter = filters.rut.replace(/\./g, '').toLowerCase();
        const rutPaciente = paciente.rut.replace(/\./g, '').toLowerCase();
        if (!rutPaciente.includes(rutFilter)) return false;
      }

      // Filtro Ciudad
      if (filters.city && paciente.city !== filters.city) {
        return false;
      }

      // Filtro Sexo
      if (filters.sex && paciente.sex !== filters.sex) {
        return false;
      }

      // Filtro Rango Etario
      if (filters.ageRange) {
        const age = calculateAge(paciente.birthDate);
        if (!isInAgeRange(age, filters.ageRange)) return false;
      }

      // Filtro Enfermedades Crónicas
      if (filters.chronic && filters.chronic.length > 0) {
        const hasChronicDisease = filters.chronic.some((disease: string) =>
          paciente.chronic?.toLowerCase().includes(disease.toLowerCase())
        );
        if (!hasChronicDisease) return false;
      }

      return true;
    });
  }, [pacientes, searchTerm, filters]);

  const handleSearch = (term: string, filterValues: Record<string, any>) => {
    setSearchTerm(term);
    setFilters(filterValues);
  };

  const columns = [
    {
      key: 'rut',
      header: 'RUT'
    },
    {
      key: 'firstName',
      header: 'Nombres'
    },
    {
      key: 'lastName',
      header: 'Apellidos'
    },
    {
      key: 'birthDate',
      header: 'Edad',
      render: (item: any) => `${calculateAge(item.birthDate)} años`
    },
    {
      key: 'city',
      header: 'Ciudad'
    },
    {
      key: 'phone',
      header: 'Teléfono'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (item: any) => (
        <Button
          onClick={() => navigate(`/pacientes/${item.id}`)}
          variant="secondary"
        >
          Ver Ficha
        </Button>
      )
    }
  ];

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card
          title="Pacientes"
          subtitle={`${filteredPacientes.length} paciente(s) encontrado(s)`}
          headerAction={
            <Button onClick={() => navigate('/pacientes/nuevo')}>
              Nuevo Paciente
            </Button>
          }
        >
          <SearchAndFilter
            searchPlaceholder="Buscar por nombre, RUT o email..."
            filters={filterConfig}
            onSearch={handleSearch}
          />

          {filteredPacientes.length === 0 ? (
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
              data={filteredPacientes}
              columns={columns}
              emptyMessage="No hay pacientes registrados"
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

