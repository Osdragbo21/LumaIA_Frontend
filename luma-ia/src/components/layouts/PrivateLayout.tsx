// Ruta: src/components/layouts/PrivateLayout.tsx

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Home, Mic, CalendarDays, PhoneCall } from 'lucide-react';

export const PrivateLayout = () => {
  const { rol } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = rol === 'Adulto Mayor' ? '/paciente' : '/cuidador';

  // Función para determinar si el tab está activo
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 relative pb-24 md:max-w-md md:mx-auto md:shadow-2xl overflow-x-hidden">
      
      {/* Contenedor Principal Dinámico */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Barra de Navegación Inferior (Bottom Nav) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-2 py-3 z-50 flex justify-around items-center md:max-w-md md:left-1/2 md:-translate-x-1/2 pb-safe">
        
        <button onClick={() => navigate(`${basePath}/inicio`)} 
          className={`flex flex-col items-center gap-1 min-w-[64px] min-h-touch focus:outline-none rounded-xl transition-colors ${isActive('/inicio') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <Home size={28} strokeWidth={isActive('/inicio') ? 3 : 2} />
          <span className="text-xs font-bold">Inicio</span>
        </button>

        <button onClick={() => navigate(`${basePath}/asistente`)} 
          className={`flex flex-col items-center gap-1 min-w-[64px] min-h-touch focus:outline-none rounded-xl transition-colors ${isActive('/asistente') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <Mic size={28} strokeWidth={isActive('/asistente') ? 3 : 2} />
          <span className="text-xs font-bold text-center leading-tight">Hablar con<br/>Luma</span>
        </button>

        <button onClick={() => navigate(`${basePath}/tareas`)} 
          className={`flex flex-col items-center gap-1 min-w-[64px] min-h-touch focus:outline-none rounded-xl transition-colors ${isActive('/tareas') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <CalendarDays size={28} strokeWidth={isActive('/tareas') ? 3 : 2} />
          <span className="text-xs font-bold text-center leading-tight">Mis<br/>tareas</span>
        </button>

        <button onClick={() => navigate(`${basePath}/red-apoyo`)} 
          className={`flex flex-col items-center gap-1 min-w-[64px] min-h-touch focus:outline-none rounded-xl transition-colors ${isActive('/red-apoyo') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <PhoneCall size={28} strokeWidth={isActive('/red-apoyo') ? 3 : 2} />
          <span className="text-xs font-bold text-center leading-tight">Red de<br/>Apoyo</span>
        </button>

      </nav>
    </div>
  );
};