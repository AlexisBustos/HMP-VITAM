import { useState } from 'react';
import { Search, X, FileText, User, Calendar } from 'lucide-react';
import { Survey } from '../types/surveys';
import { Button } from './common/Button';
import { Card } from './common/Card';

interface Patient {
  id: number;
  rut: string;
  nombre?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  sex?: string;
}

interface NewSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveys: Survey[];
  patients: Patient[];
  onStartSurvey: (survey: Survey, patient: Patient) => void;
}

export default function NewSurveyModal({
  isOpen,
  onClose,
  surveys,
  patients,
  onStartSurvey
}: NewSurveyModalProps) {
  const [step, setStep] = useState<'search' | 'select'>('search');
  const [searchRUT, setSearchRUT] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  if (!isOpen) return null;

  const handleRUTSearch = () => {
    // Normalizar RUT (remover puntos y guión)
    const normalizedRUT = searchRUT.replace(/\./g, '').replace(/-/g, '');
    
    const found = patients.find(p => {
      const patientRUT = p.rut.replace(/\./g, '').replace(/-/g, '');
      return patientRUT === normalizedRUT;
    });

    if (found) {
      setSelectedPatient(found);
      setStep('select');
    } else {
      alert('Paciente no encontrado. Verifique el RUT ingresado.');
    }
  };

  const handleSurveySelect = (survey: Survey) => {
    setSelectedSurvey(survey);
  };

  const handleStart = () => {
    if (selectedPatient && selectedSurvey) {
      onStartSurvey(selectedSurvey, selectedPatient);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('search');
    setSearchRUT('');
    setSelectedPatient(null);
    setSelectedSurvey(null);
    onClose();
  };

  const handleBack = () => {
    setStep('search');
    setSelectedSurvey(null);
  };

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

  const activeSurveys = surveys.filter(s => s.active);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nueva Evaluación</h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'search' ? 'Buscar paciente por RUT' : 'Seleccionar instrumento'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'search' ? (
            <>
              {/* Search Patient */}
              <Card className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RUT del Paciente
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ej: 12.345.678-9"
                      value={searchRUT}
                      onChange={(e) => setSearchRUT(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleRUTSearch()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={handleRUTSearch}
                    disabled={!searchRUT.trim()}
                    className="px-6"
                  >
                    Buscar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ingrese el RUT con o sin puntos y guión
                </p>
              </Card>

              {/* Quick Access - Recent Patients */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacientes Recientes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {patients.slice(0, 6).map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setStep('select');
                      }}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                    >
                      <div className="bg-primary-100 rounded-full p-2">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {patient.nombre || `${patient.firstName} ${patient.lastName}`}
                        </p>
                        <p className="text-sm text-gray-600">{patient.rut}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Selected Patient Info */}
              {selectedPatient && (
                <Card className="mb-6 bg-primary-50 border-primary-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-100 rounded-full p-3">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {selectedPatient.nombre || `${selectedPatient.firstName} ${selectedPatient.lastName}`}
                      </h3>
                      <div className="flex gap-4 mt-1 text-sm text-gray-600">
                        <span>RUT: {selectedPatient.rut}</span>
                        {selectedPatient.birthDate && (
                          <span>{calculateAge(selectedPatient.birthDate)} años</span>
                        )}
                        {selectedPatient.sex && (
                          <span>{selectedPatient.sex === 'M' ? 'Masculino' : 'Femenino'}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleBack}
                      variant="secondary"
                      size="sm"
                    >
                      Cambiar Paciente
                    </Button>
                  </div>
                </Card>
              )}

              {/* Survey Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seleccionar Instrumento de Evaluación
                </h3>
                
                <div className="space-y-3">
                  {activeSurveys.map(survey => (
                    <button
                      key={survey.id}
                      onClick={() => handleSurveySelect(survey)}
                      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                        selectedSurvey?.id === survey.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`rounded-lg p-2 ${
                          selectedSurvey?.id === survey.id
                            ? 'bg-primary-100'
                            : 'bg-gray-100'
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            selectedSurvey?.id === survey.id
                              ? 'text-primary-600'
                              : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-primary-600">{survey.code}</span>
                            {survey.estimatedMins && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                ~{survey.estimatedMins} min
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{survey.name}</h4>
                          {survey.licenseNotes && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {survey.licenseNotes}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {survey.items.length} ítems
                            </span>
                            {survey.loincCode && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                LOINC: {survey.loincCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step === 'select' && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-between">
            <Button
              onClick={handleBack}
              variant="secondary"
            >
              Volver
            </Button>
            <Button
              onClick={handleStart}
              disabled={!selectedSurvey}
            >
              Iniciar Evaluación
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

