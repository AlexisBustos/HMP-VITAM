import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { PacientesList } from './pages/Pacientes/PacientesList';
import { PacienteForm } from './pages/Pacientes/PacienteForm';
import { PacienteDetail } from './pages/Pacientes/PacienteDetail';
import { ConsultasList } from './pages/Consultas/ConsultasList';
import { ExamenesList } from './pages/Examenes/ExamenesList';
import { SeguimientoList } from './pages/Seguimiento/SeguimientoList';
import { Perfil } from './pages/Perfil/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pacientes" element={<PacientesList />} />
        <Route path="/pacientes/nuevo" element={<PacienteForm />} />
        <Route path="/pacientes/:id" element={<PacienteDetail />} />
        <Route path="/consultas" element={<ConsultasList />} />
        <Route path="/examenes" element={<ExamenesList />} />
        <Route path="/seguimiento" element={<SeguimientoList />} />
        <Route path="/perfil" element={<Perfil />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

