// Ruta: src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { LoginPage } from './features/auth/LoginPage';

function App() {
    // Extraemos el estado individualmente para evitar renderizados innecesarios y errores de hook
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const rol = useAuthStore((state) => state.rol);

    return (
        <div className="w-full min-h-screen bg-background text-text md:max-w-md md:mx-auto md:shadow-2xl md:overflow-x-hidden relative flex flex-col font-sans">
        <Routes>
            <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
            />
            
            {/* Enrutador principal dinámico según el rol de la BD */}
            <Route 
            path="/" 
            element={
                !isAuthenticated ? (
                <Navigate to="/login" replace />
                ) : rol === 'Adulto Mayor' ? (
                <Navigate to="/paciente/inicio" replace />
                ) : (
                <Navigate to="/cuidador/inicio" replace />
                )
            } 
            />
            
            {/* Vistas de comprobación temporal */}
            <Route path="/paciente/inicio" element={<div className="p-6 text-2xl font-bold">Inicio - Adulto Mayor</div>} />
            <Route path="/cuidador/inicio" element={<div className="p-6 text-2xl font-bold">Inicio - Cuidador</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
    );
}

export default App;