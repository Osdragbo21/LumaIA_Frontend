// Ruta: src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Layouts
import { PrivateLayout } from './components/layouts/PrivateLayout';

// Páginas (Asegúrate de tener estos imports)
import { LoginPage } from './features/auth/LoginPage';
import { RegistroPage } from './features/auth/RegistroPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TareasPage } from './features/tareas/TareasPage';
import { AsistenteView } from './features/ia/components/AsistenteView';
import { RedApoyoPage } from './features/red-apoyo/RedApoyoPage';
// ... importa las demás vistas (medicamentos, citas, notas)

export const App = () => {
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* 1. RUTAS PÚBLICAS */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/registro" element={!isAuthenticated ? <RegistroPage /> : <Navigate to="/" replace />} />

      {/* 2. RUTAS PROTEGIDAS (ENVUELTAS POR EL LAYOUT) */}
      <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />}>
        
        {/* Inicio / Dashboard */}
        <Route path="/paciente/inicio" element={<DashboardPage />} />
        <Route path="/cuidador/inicio" element={<DashboardPage />} />
        
        {/* Hub de Tareas */}
        <Route path="/paciente/tareas" element={<TareasPage />} />
        <Route path="/cuidador/tareas" element={<TareasPage />} />

        {/* Asistente Lógico */}
        <Route path="/paciente/asistente" element={<AsistenteView />} />
        <Route path="/cuidador/asistente" element={<AsistenteView />} />

        {/* Red de Apoyo */}
        <Route path="/paciente/red-apoyo" element={<RedApoyoPage />} />
        <Route path="/cuidador/red-apoyo" element={<RedApoyoPage />} />

        {/* 
          NOTA: Si tienes rutas para los submódulos (ej. /paciente/medicamentos) 
          también deben ir AQUÍ ADENTRO para que conserven la barra inferior. 
        */}

      </Route>

      {/* 3. REDIRECCIÓN RAÍZ Y FALLBACK */}
      <Route path="/" element={<Navigate to={isAuthenticated ? (useAuthStore.getState().rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio') : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};