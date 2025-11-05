import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Login } from './pages/Auth/Login';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PacientesList } from './pages/Pacientes/PacientesList';
import { PacienteForm } from './pages/Pacientes/PacienteForm';
import { PacienteDetail } from './pages/Pacientes/PacienteDetail';
import { ConsultasList } from './pages/Consultas/ConsultasList';
import { ExamenesList } from './pages/Examenes/ExamenesList';
import { SeguimientoList } from './pages/Seguimiento/SeguimientoList';
import EncuestasList from './pages/Encuestas/EncuestasList';
import { Perfil } from './pages/Perfil/Perfil';

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Redireccionar raíz a dashboard si está autenticado, sino a login */}
        <Route 
          path="/" 
          element={
            <Navigate 
              to={useAuthStore.getState().isAuthenticated() ? "/dashboard" : "/login"} 
              replace 
            />
          } 
        />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/pacientes" element={<PrivateRoute><PacientesList /></PrivateRoute>} />
        <Route path="/pacientes/nuevo" element={<PrivateRoute><PacienteForm /></PrivateRoute>} />
        <Route path="/pacientes/:id" element={<PrivateRoute><PacienteDetail /></PrivateRoute>} />
        <Route path="/consultas" element={<PrivateRoute><ConsultasList /></PrivateRoute>} />
        <Route path="/examenes" element={<PrivateRoute><ExamenesList /></PrivateRoute>} />
        <Route path="/seguimiento" element={<PrivateRoute><SeguimientoList /></PrivateRoute>} />
        <Route path="/encuestas" element={<PrivateRoute><EncuestasList /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        
        {/* Ruta catch-all para rutas no encontradas */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={useAuthStore.getState().isAuthenticated() ? "/dashboard" : "/login"} 
              replace 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

