import { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Search,
  Download
} from 'lucide-react';
import { Survey, SurveySession } from '../../types/surveys';
import { useDemoStore } from '../../store/demo';
import SurveyRenderer from '../../components/SurveyRenderer';
import SurveyResults from '../../components/SurveyResults';
import SurveyTrendChart from '../../components/SurveyTrendChart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function EncuestasList() {
  const { surveys, surveySessions, addSurveySession, pacientes } = useDemoStore();
  const [selectedSurvey] = useState<Survey | null>(null);
  const [selectedPatientId] = useState<number | null>(null);
  const [showRenderer, setShowRenderer] = useState(false);
  const [viewingSession, setViewingSession] = useState<SurveySession | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'dashboard'>('list');
  const [filterSurvey, setFilterSurvey] = useState<string>('all');
  const [filterPatient, setFilterPatient] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar sesiones
  const filteredSessions = useMemo(() => {
    return surveySessions.filter(session => {
      if (filterSurvey !== 'all' && session.surveyCode !== filterSurvey) return false;
      if (filterPatient !== 'all' && session.patientId !== parseInt(filterPatient)) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          session.patientName?.toLowerCase().includes(term) ||
          session.surveyName?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [surveySessions, filterSurvey, filterPatient, searchTerm]);

  // Estadísticas generales
  const stats = useMemo(() => {
    const total = surveySessions.length;
    const completed = surveySessions.filter(s => s.completedAt).length;
    const withAlerts = surveySessions.filter(s => s.alerts.length > 0).length;
    const criticalAlerts = surveySessions.filter(s => 
      s.alerts.some(a => a.severity === 'CRITICAL')
    ).length;

    return { total, completed, withAlerts, criticalAlerts };
  }, [surveySessions]);

  // Función comentada - se usará en futuras versiones
  // const handleStartSurvey = (survey: Survey, patientId: number) => {
  //   setSelectedSurvey(survey);
  //   setSelectedPatientId(patientId);
  //   setShowRenderer(true);
  // };

  const handleSurveyComplete = (session: SurveySession) => {
    addSurveySession(session);
    setShowRenderer(false);
    setViewingSession(session);
  };

  const handleViewSession = (session: SurveySession) => {
    setViewingSession(session);
  };

  const exportToCSV = () => {
    const headers = [
      'Fecha',
      'Paciente',
      'Encuesta',
      'Puntaje Total',
      'Severidad',
      'Alertas',
      'Completada'
    ];

    const rows = filteredSessions.map(session => [
      session.completedAt ? format(new Date(session.completedAt), 'dd/MM/yyyy HH:mm') : 'En progreso',
      session.patientName || '',
      session.surveyName || '',
      session.scores?.totalScore?.toFixed(1) || 'N/A',
      session.scores?.severityBand || 'N/A',
      session.alerts.length,
      session.completedAt ? 'Sí' : 'No'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encuestas_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (showRenderer && selectedSurvey && selectedPatientId) {
    const patient = pacientes.find(p => p.id === selectedPatientId);
    return (
      <SurveyRenderer
        survey={selectedSurvey}
        patientId={selectedPatientId}
        patientName={patient?.nombre || ''}
        onComplete={handleSurveyComplete}
        onCancel={() => setShowRenderer(false)}
      />
    );
  }

  if (viewingSession) {
    const survey = surveys.find(s => s.id === viewingSession.surveyId);
    const previousSessions = surveySessions
      .filter(s => 
        s.patientId === viewingSession.patientId && 
        s.surveyId === viewingSession.surveyId &&
        s.completedAt &&
        new Date(s.completedAt) < new Date(viewingSession.completedAt!)
      )
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    return survey ? (
      <SurveyResults
        session={viewingSession}
        survey={survey}
        previousSession={previousSessions[0]}
        onClose={() => setViewingSession(null)}
      />
    ) : null;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Encuestas Estandarizadas</h1>
        <p className="text-gray-600">
          Instrumentos validados para evaluación clínica y seguimiento longitudinal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Evaluaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Alertas</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.withAlerts}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alertas Críticas</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Lista
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterSurvey}
                onChange={(e) => setFilterSurvey(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las encuestas</option>
                {surveys.map(survey => (
                  <option key={survey.code} value={survey.code}>{survey.code}</option>
                ))}
              </select>

              <select
                value={filterPatient}
                onChange={(e) => setFilterPatient(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los pacientes</option>
                {pacientes.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sessions List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Encuesta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alertas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.completedAt 
                        ? format(new Date(session.completedAt), "d 'de' MMM, yyyy", { locale: es })
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {session.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {session.surveyCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {session.scores?.totalScore?.toFixed(1) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.scores?.severityBand && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getSeverityColor(session.scores.severityBand)
                        }`}>
                          {session.scores.severityBand}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.alerts.length > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className={`w-4 h-4 ${
                            session.alerts.some(a => a.severity === 'CRITICAL')
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`} />
                          <span className="text-sm font-medium">{session.alerts.length}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.completedAt ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Completada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          En progreso
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleViewSession(session)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver Resultados
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSessions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron evaluaciones
              </div>
            )}
          </div>
        </>
      ) : (
        <DashboardView 
          surveys={surveys}
          sessions={surveySessions}
          onViewSession={handleViewSession}
        />
      )}

      {/* Nueva Evaluación Button */}
      <button
        onClick={() => {
          // Aquí se abriría un modal para seleccionar paciente y encuesta
          alert('Funcionalidad de nueva evaluación - Seleccionar paciente y encuesta');
        }}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  const lower = severity.toLowerCase();
  if (lower.includes('severa') || lower.includes('crítica') || lower.includes('alta') || lower.includes('muy')) {
    return 'bg-red-100 text-red-800';
  }
  if (lower.includes('moderada') || lower.includes('medio')) {
    return 'bg-orange-100 text-orange-800';
  }
  if (lower.includes('leve') || lower.includes('bajo')) {
    return 'bg-yellow-100 text-yellow-800';
  }
  return 'bg-green-100 text-green-800';
}

interface DashboardViewProps {
  surveys: Survey[];
  sessions: SurveySession[];
  onViewSession: (session: SurveySession) => void;
}

function DashboardView({ surveys, sessions }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {surveys.map(survey => {
        const surveySessions = sessions.filter(s => s.surveyId === survey.id && s.completedAt);
        
        if (surveySessions.length === 0) return null;

        return (
          <div key={survey.id} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{survey.name}</h3>
            <SurveyTrendChart sessions={surveySessions} survey={survey} />
          </div>
        );
      })}
    </div>
  );
}

