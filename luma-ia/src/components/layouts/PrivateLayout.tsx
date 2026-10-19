// [FRONTEND] Ruta: src/components/layouts/PrivateLayout.tsx

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
    <div className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 relative pb-24 md:max-w-md md:mx-auto md:shadow-2xl md:border-x-2 md:border-slate-200">
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-slate-200 px-2 py-3 z-50 flex justify-around items-center md:max-w-md md:left-1/2 md:-translate-x-1/2 pb-safe shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.08)]">
        
        <button onClick={() => navigate(`${basePath}/inicio`)} 
          className={`flex flex-col items-center gap-1 w-20 min-h-[56px] justify-center focus:outline-none rounded-2xl transition-all active:scale-[0.95] ${isActive('/inicio') ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
          <Home size={28} strokeWidth={isActive('/inicio') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-wide">Inicio</span>
        </button>

        <button onClick={() => navigate(`${basePath}/asistente`)} 
          className={`flex flex-col items-center gap-1 w-20 min-h-[56px] justify-center focus:outline-none rounded-2xl transition-all active:scale-[0.95] ${isActive('/asistente') ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
          <Mic size={28} strokeWidth={isActive('/asistente') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-wide">Luma</span>
        </button>

        <button onClick={() => navigate(`${basePath}/tareas`)} 
          className={`flex flex-col items-center gap-1 w-20 min-h-[56px] justify-center focus:outline-none rounded-2xl transition-all active:scale-[0.95] ${isActive('/tareas') ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}>
          <CalendarDays size={28} strokeWidth={isActive('/tareas') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-wide">Agenda</span>
        </button>

        <button onClick={() => navigate(`${basePath}/red-apoyo`)} 
          className={`flex flex-col items-center gap-1 w-20 min-h-[56px] justify-center focus:outline-none rounded-2xl transition-all active:scale-[0.95] ${isActive('/red-apoyo') ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'}`}>
          <PhoneCall size={28} strokeWidth={isActive('/red-apoyo') ? 2.5 : 2} />
          <span className="text-xs font-bold tracking-wide">Apoyo</span>
        </button>
        
      </nav>
    </div>
  );
};