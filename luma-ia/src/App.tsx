// Ruta: src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';
import { PrivateLayout } from './components/layouts/PrivateLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
// Importamos la nueva vista
import { MedicamentosPage } from './features/medicamentos/MedicamentosPage';
import { CitasPage } from './features/citas/CitasPage';
import { NotasPage } from './features/notas/NotasPage';
import { RedApoyoPage } from './features/red-apoyo/RedApoyoPage';
import { RegistroPage } from './features/auth/RegistroPage';
import { VinculacionPage } from './features/vinculacion/VinculacionPage';
import { asistenteView } from './features/ia/components/AsistenteView';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const rol = useAuthStore((state) => state.rol);

  return (
    <div className="w-full min-h-screen bg-background text-text md:max-w-md md:mx-auto md:shadow-2xl md:overflow-x-hidden relative flex flex-col font-sans">
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/registro" element={<RegistroPage />} />
        
        <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={ rol === 'Adulto Mayor' ? <Navigate to="/paciente/inicio" replace /> : <Navigate to="/cuidador/inicio" replace /> } />
          <Route path="/vinculacion" element={<VinculacionPage />} />
          <Route path="/paciente/inicio" element={<DashboardPage />} />
          <Route path="/cuidador/inicio" element={<DashboardPage />} />
          
          {/* Registro del nuevo módulo de Medicamentos */}
          <Route path="/paciente/medicamentos" element={<MedicamentosPage />} />
          <Route path="/cuidador/medicamentos" element={<MedicamentosPage />} />

          <Route path="/paciente/citas" element={<CitasPage />} />
          <Route path="/cuidador/citas" element={<CitasPage />} />

          <Route path="/paciente/notas" element={<NotasPage />} />
          <Route path="/cuidador/notas" element={<NotasPage />} />

          <Route path="/paciente/red-apoyo" element={<RedApoyoPage />} />
          <Route path="/cuidador/red-apoyo" element={<RedApoyoPage />} />

          <AppRoute path="/paciente/asistente" element={<asistenteView />} />
          <AppRoute path="/cuidador/asistente" element={<asistenteView />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;