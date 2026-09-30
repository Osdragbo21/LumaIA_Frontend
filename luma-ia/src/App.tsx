// Ruta: src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';
import { PrivateLayout } from './components/layouts/PrivateLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MedicamentosPage } from './features/medicamentos/MedicamentosPage';
import { CitasPage } from './features/citas/CitasPage';
import { NotasPage } from './features/notas/NotasPage';
import { RedApoyoPage } from './features/red-apoyo/RedApoyoPage';
import { RegistroPage } from './features/auth/RegistroPage';
import { VinculacionPage } from './features/vinculacion/VinculacionPage';
import { AsistenteView } from './features/ia/components/AsistenteView';
import { TareasPage } from './features/tareas/TareasPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const rol = useAuthStore((state) => state.rol);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={ rol === 'Adulto Mayor' ? <Navigate to="/paciente/inicio" replace /> : <Navigate to="/cuidador/inicio" replace /> } />
        <Route path="/vinculacion" element={<VinculacionPage />} />
        <Route path="/paciente/inicio" element={<DashboardPage />} />
        <Route path="/cuidador/inicio" element={<DashboardPage />} />
        
        <Route path="/paciente/medicamentos" element={<MedicamentosPage />} />
        <Route path="/cuidador/medicamentos" element={<MedicamentosPage />} />

        <Route path="/paciente/citas" element={<CitasPage />} />
        <Route path="/cuidador/citas" element={<CitasPage />} />

        <Route path="/paciente/notas" element={<NotasPage />} />
        <Route path="/cuidador/notas" element={<NotasPage />} />

        <Route path="/paciente/red-apoyo" element={<RedApoyoPage />} />
        <Route path="/cuidador/red-apoyo" element={<RedApoyoPage />} />

        <Route path="/paciente/tareas" element={<TareasPage />} />
        <Route path="/cuidador/tareas" element={<TareasPage />} />

        {/* SOLUCIÓN: Rutas añadidas para el Asistente Lógico */}
        <Route path="/paciente/asistente" element={<AsistenteView />} />
        <Route path="/cuidador/asistente" element={<AsistenteView />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;