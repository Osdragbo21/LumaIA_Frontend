// Ruta: src/components/layouts/PrivateLayout.tsx

import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Bell, PhoneCall } from 'lucide-react';

export const PrivateLayout = () => {
  const { logout, rol } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      {/* Cabecera Superior */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <img src="/logo_LumaIA.png" alt="LumaIA" className="h-10 w-auto object-contain" />
          <span className="font-extrabold text-text text-2xl tracking-tight">LumaIA</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="min-h-touch min-w-touch flex items-center justify-center text-slate-600 hover:text-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
            aria-label="Notificaciones"
          >
            <Bell size={28} strokeWidth={2.5} />
          </button>
          <button 
            onClick={handleLogout} 
            className="min-h-touch min-w-touch flex items-center justify-center text-slate-600 hover:text-sos rounded-xl focus:outline-none focus:ring-4 focus:ring-sos/20"
            aria-label="Cerrar sesión"
          >
            <LogOut size={28} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* Contenedor Principal Dinámico */}
      <main className="flex-1 overflow-y-auto pb-32">
        <Outlet />
      </main>

      {/* Botón SOS Persistente (Exclusivo para Adulto Mayor según RF-07.2) */}
      {rol === 'Adulto Mayor' && (
        <div className="fixed bottom-6 left-0 w-full px-6 md:max-w-md md:mx-auto flex justify-center z-50">
           <button 
             className="w-full min-h-touch py-4 bg-sos hover:bg-sos-hover text-sos-content font-extrabold text-2xl rounded-2xl shadow-lg flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-sos/40 transition-transform active:scale-95"
           >
             <PhoneCall size={32} strokeWidth={3} />
             BOTÓN SOS
           </button>
        </div>
      )}
    </div>
  );
};