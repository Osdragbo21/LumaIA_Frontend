// Ruta: src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

function App() {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <BrowserRouter>
        {/* Contenedor estricto Mobile-First */}
        <div className="w-full min-h-screen bg-slate-50 text-slate-900 md:max-w-md md:mx-auto md:shadow-2xl md:overflow-hidden relative flex flex-col">
            <Routes>
            {/* Rutas Públicas (Borrador) */}
            <Route path="/login" element={<div className="p-4 text-center mt-20">Vista de Login (Próximamente)</div>} />
            
            {/* Rutas Privadas simuladas */}
            <Route 
                path="/" 
                element={
                !isAuthenticated ? (
                    <Navigate to="/login" replace />
                ) : user?.rol === 'Adulto Mayor' ? (
                    <Navigate to="/paciente/inicio" replace />
                ) : (
                    <Navigate to="/cuidador/inicio" replace />
                )
                } 
            />
            
            <Route path="/paciente/inicio" element={<div className="p-4">Inicio - Adulto Mayor</div>} />
            <Route path="/cuidador/inicio" element={<div className="p-4">Inicio - Cuidador</div>} />
            </Routes>
        </div>
        </BrowserRouter>
    );
}

export default App;