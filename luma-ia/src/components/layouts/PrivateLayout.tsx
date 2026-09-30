// Ruta: src/components/layouts/PrivateLayout.tsx

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Home, Mic, CalendarDays, PhoneCall } from 'lucide-react';

export const PrivateLayout = () => {
  const { rol } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = rol === 'Adulto Mayor' ? '/paciente' : '/cuidador';
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 relative pb-20 md:max-w-md md:mx-auto md:shadow-2xl">
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-2 py-2 z-50 flex justify-around items-center md:max-w-md md:left-1/2 md:-translate-x-1/2 pb-safe shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <button onClick={() => navigate(`${basePath}/inicio`)} 
          className={`flex flex-col items-center gap-1 w-16 min-h-[48px] justify-center focus:outline-none rounded-xl transition-colors ${isActive('/inicio') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <Home size={26} strokeWidth={isActive('/inicio') ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Inicio</span>
        </button>

        <button onClick={() => navigate(`${basePath}/asistente`)} 
          className={`flex flex-col items-center gap-1 w-16 min-h-[48px] justify-center focus:outline-none rounded-xl transition-colors ${isActive('/asistente') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <Mic size={26} strokeWidth={isActive('/asistente') ? 2.5 : 2} />
          <span className="text-[10px] font-bold text-center leading-tight">Hablar con<br/>Luma</span>
        </button>

        <button onClick={() => navigate(`${basePath}/tareas`)} 
          className={`flex flex-col items-center gap-1 w-16 min-h-[48px] justify-center focus:outline-none rounded-xl transition-colors ${isActive('/tareas') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <CalendarDays size={26} strokeWidth={isActive('/tareas') ? 2.5 : 2} />
          <span className="text-[10px] font-bold text-center leading-tight">Mis<br/>tareas</span>
        </button>

        <button onClick={() => navigate(`${basePath}/red-apoyo`)} 
          className={`flex flex-col items-center gap-1 w-16 min-h-[48px] justify-center focus:outline-none rounded-xl transition-colors ${isActive('/red-apoyo') ? 'text-blue-700' : 'text-slate-500 hover:text-blue-600'}`}>
          <PhoneCall size={26} strokeWidth={isActive('/red-apoyo') ? 2.5 : 2} />
          <span className="text-[10px] font-bold text-center leading-tight">Red de<br/>Apoyo</span>
        </button>
      </nav>
    </div>
  );
};