import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Survey, SurveySession } from '../types/surveys';
import surveysData from '../data/surveys';
import demoSurveySessions from '../data/demoSurveySessions';

// Importar datos demo existentes
import { 
  demoPacientes, 
  demoConsultas, 
  demoExamenes, 
  demoSeguimientos 
} from '../data/demo';

interface DemoState {
  // Datos existentes
  pacientes: any[];
  consultas: any[];
  examenes: any[];
  seguimientos: any[];
  
  // Nuevos datos de encuestas
  surveys: Survey[];
  surveySessions: SurveySession[];
  
  // Acciones
  addSurveySession: (session: SurveySession) => void;
  getSurveysByPatient: (patientId: number) => SurveySession[];
  getLatestSessionBySurvey: (patientId: number, surveyId: number) => SurveySession | undefined;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      // Datos existentes
      pacientes: demoPacientes,
      consultas: demoConsultas,
      examenes: demoExamenes,
      seguimientos: demoSeguimientos,
      
      // Datos de encuestas
      surveys: surveysData as Survey[],
      surveySessions: demoSurveySessions,
      
      // Acciones
      addSurveySession: (session) => {
        set((state) => ({
          surveySessions: [...state.surveySessions, session]
        }));
      },
      
      getSurveysByPatient: (patientId) => {
        const { surveySessions } = get();
        return surveySessions.filter(s => s.patientId === patientId);
      },
      
      getLatestSessionBySurvey: (patientId, surveyId) => {
        const { surveySessions } = get();
        const sessions = surveySessions
          .filter(s => s.patientId === patientId && s.surveyId === surveyId && s.completedAt)
          .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
        return sessions[0];
      }
    }),
    {
      name: 'hmp-demo-storage'
    }
  )
);

