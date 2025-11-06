import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PacientesList } from './pages/Pacientes/PacientesList';
import { PacienteForm } from './pages/Pacientes/PacienteForm';
import { PacienteDetail } from './pages/Pacientes/PacienteDetail';
import { ConsultasList } from './pages/Consultas/ConsultasList';
import { ExamenesList } from './pages/Examenes/ExamenesList';
import { SeguimientoList } from './pages/Seguimiento/SeguimientoList';
import EncuestasList from './pages/Encuestas/EncuestasList';
import { MisEncuestas } from './pages/Encuestas/MisEncuestas';
import { ResponderEncuesta } from './pages/Encuestas/ResponderEncuesta';
import { MiFicha } from './pages/MiFicha/MiFicha';
import { Perfil } from './pages/Perfil/Perfil';

// Componente para redireccionar si ya está autenticado
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated() && user) {
    // Redirect based on role
    if (user.roles.includes('PERSON')) {
      return <Navigate to="/mi-ficha" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Componente para redireccionar la raíz según autenticación y rol
function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on role
  if (user.roles.includes('PERSON')) {
    return <Navigate to="/mi-ficha" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de login */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Redireccionar raíz según autenticación y rol */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* ===== RUTAS PARA PERSON ===== */}
        <Route 
          path="/mi-ficha" 
          element={
            <ProtectedRoute requirePerson>
              <MiFicha />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mis-encuestas" 
          element={
            <ProtectedRoute requirePerson>
              <MisEncuestas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/encuestas/responder/:id" 
          element={
            <ProtectedRoute requirePerson>
              <ResponderEncuesta />
            </ProtectedRoute>
          } 
        />
        
        {/* ===== RUTAS PARA ADMIN ===== */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pacientes" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <PacientesList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pacientes/nuevo" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <PacienteForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pacientes/:id" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <PacienteDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/consultas" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <ConsultasList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/examenes" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <ExamenesList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/seguimiento" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <SeguimientoList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/encuestas" 
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'CLINICAL_ADMIN']}>
              <EncuestasList />
            </ProtectedRoute>
          } 
        />
        
        {/* ===== RUTAS COMPARTIDAS ===== */}
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta catch-all - redirigir según rol */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

