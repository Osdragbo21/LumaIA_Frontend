// Ruta: src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';
import { PrivateLayout } from './components/layouts/PrivateLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const rol = useAuthStore((state) => state.rol);

  return (
    <div className="w-full min-h-screen bg-background text-text md:max-w-md md:mx-auto md:shadow-2xl md:overflow-x-hidden relative flex flex-col font-sans">
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
        />
        
        {/* Rutas Privadas envueltas en el Layout */}
        <Route element={isAuthenticated ? <PrivateLayout /> : <Navigate to="/login" replace />}>
          
          <Route 
            path="/" 
            element={
              rol === 'Adulto Mayor' ? (
                <Navigate to="/paciente/inicio" replace />
              ) : (
                <Navigate to="/cuidador/inicio" replace />
              )
            } 
          />
          
          {/* Mapeo de Vistas Iniciales */}
          <Route path="/paciente/inicio" element={<DashboardPage />} />
          <Route path="/cuidador/inicio" element={<DashboardPage />} />
          
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;