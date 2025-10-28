import { useState, useEffect, useRef } from 'react';
import { Input } from './Input';

interface SnomedTerm {
  id: string;
  term: string;
  fullTerm: string;
}

interface SnomedSearchProps {
  type: 'diagnosticos' | 'medicamentos' | 'examenes';
  value: string;
  onChange: (value: string, conceptId?: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
}

export const SnomedSearch = ({ 
  type, 
  value, 
  onChange, 
  label, 
  placeholder,
  error 
}: SnomedSearchProps) => {
  const [terms, setTerms] = useState<SnomedTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<SnomedTerm[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cargar términos SNOMED
  useEffect(() => {
    const loadTerms = async () => {
      try {
        const response = await fetch(`/data/snomed_${type}.json`);
        const data = await response.json();
        setTerms(data);
        setLoading(false);
      } catch (error) {
        console.error(`Error loading SNOMED ${type}:`, error);
        setLoading(false);
      }
    };

    loadTerms();
  }, [type]);

  // Filtrar términos cuando cambia el valor
  useEffect(() => {
    if (value.length < 2) {
      setFilteredTerms([]);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = terms
      .filter(term => term.term.toLowerCase().includes(searchTerm))
      .slice(0, 10); // Mostrar máximo 10 sugerencias

    setFilteredTerms(filtered);
  }, [value, terms]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectTerm = (term: SnomedTerm) => {
    onChange(term.term, term.id);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        label={label}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder || 'Escribe para buscar...'}
        error={error}
      />
      
      {loading && value.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2">
          <p className="text-sm text-gray-500">Cargando términos SNOMED...</p>
        </div>
      )}

      {showSuggestions && filteredTerms.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredTerms.map((term) => (
            <button
              key={term.id}
              type="button"
              onClick={() => handleSelectTerm(term)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="text-sm font-medium text-gray-900">{term.term}</div>
              <div className="text-xs text-gray-500">SNOMED: {term.id}</div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value.length >= 2 && filteredTerms.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <p className="text-sm text-gray-500">
            No se encontraron resultados. Puedes escribir el término manualmente.
          </p>
        </div>
      )}
    </div>
  );
};

