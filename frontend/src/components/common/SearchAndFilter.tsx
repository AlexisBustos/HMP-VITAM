import { useState, useEffect } from 'react';
import { Button } from './Button';

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'daterange' | 'agerange';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  filters: FilterConfig[];
  onSearch: (searchTerm: string, filters: Record<string, any>) => void;
  debounceMs?: number;
}

export const SearchAndFilter = ({ 
  searchPlaceholder = 'Buscar por nombre, RUT o código...',
  filters,
  onSearch,
  debounceMs = 500
}: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  // Rangos etarios según Calendario de Medicina Preventiva de Chile
  const ageRanges = [
    { value: '0-9', label: '0 a 9 años' },
    { value: '10-19', label: '10 a 19 años' },
    { value: '20-39', label: '20 a 39 años' },
    { value: '40-64', label: '40 a 64 años' },
    { value: '65+', label: '65 años y más' }
  ];

  // Ejecutar búsqueda con debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(searchTerm, filterValues);
    }, debounceMs);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchTerm, filterValues]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterValues({});
    onSearch('', {});
  };

  const hasActiveFilters = searchTerm || Object.keys(filterValues).some(key => filterValues[key]);

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            value={filterValues[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={filter.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={filterValues[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {filter.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'agerange':
        return (
          <select
            value={filterValues[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los rangos</option>
            {ageRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        );

      case 'daterange':
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filterValues[`${filter.id}_from`] || ''}
              onChange={(e) => handleFilterChange(`${filter.id}_from`, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Desde"
            />
            <input
              type="date"
              value={filterValues[`${filter.id}_to`] || ''}
              onChange={(e) => handleFilterChange(`${filter.id}_to`, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hasta"
            />
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filter.options?.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filterValues[filter.id] || []).includes(opt.value)}
                  onChange={(e) => {
                    const current = filterValues[filter.id] || [];
                    const updated = e.target.checked
                      ? [...current, opt.value]
                      : current.filter((v: string) => v !== opt.value);
                    handleFilterChange(filter.id, updated);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Búsqueda principal */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar Filtros' : 'Filtros Avanzados'}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={handleClearFilters}
          >
            Limpiar
          </Button>
        )}
      </div>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros Avanzados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map(filter => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Búsqueda: "{searchTerm}"
            </span>
          )}
          {Object.entries(filterValues).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            const filter = filters.find(f => f.id === key || key.startsWith(f.id));
            if (!filter) return null;
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {filter.label}: {Array.isArray(value) ? value.join(', ') : value}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

