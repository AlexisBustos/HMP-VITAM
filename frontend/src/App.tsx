import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PacientesList } from './pages/Pacientes/PacientesList';
import { PacienteForm } from './pages/Pacientes/PacienteForm';
import { ConsultasList } from './pages/Consultas/ConsultasList';
import { ExamenesList } from './pages/Examenes/ExamenesList';
import { SeguimientoList } from './pages/Seguimiento/SeguimientoList';
import { Perfil } from './pages/Perfil/Perfil';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuthStore } from './store/auth';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN_GENERAL', 'ADMIN_PRO_CLINICO']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <PacientesList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/pacientes/nuevo"
          element={
            <ProtectedRoute roles={['ADMIN_GENERAL', 'ADMIN_PRO_CLINICO']}>
              <PacienteForm />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/consultas"
          element={
            <ProtectedRoute roles={['ADMIN_GENERAL', 'ADMIN_PRO_CLINICO']}>
              <ConsultasList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/examenes"
          element={
            <ProtectedRoute roles={['ADMIN_GENERAL', 'ADMIN_PRO_CLINICO']}>
              <ExamenesList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/seguimiento"
          element={
            <ProtectedRoute roles={['ADMIN_GENERAL', 'ADMIN_PRO_CLINICO']}>
              <SeguimientoList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/403"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta página</p>
                <a href="/dashboard" className="text-primary-600 hover:text-primary-700">
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Página no encontrada</p>
                <a href="/dashboard" className="text-primary-600 hover:text-primary-700">
                  Volver al inicio
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

