// Ruta: src/features/dashboard/DashboardPage.tsx

import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Pill, Stethoscope, Footprints, Check } from 'lucide-react';

export const DashboardPage = () => {
  // Nota: Asegúrate de que useAuthStore tenga 'nombre', si no, usa 'rol' temporalmente
  const { rol } = useAuthStore(); 
  
  // Generar fecha en formato amigable
  const fechaHoy = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="flex flex-col min-h-full p-6 pb-32">
      
      {/* Cabecera Superior (Saludo y Logo) */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full border-2 border-slate-300 overflow-hidden flex-shrink-0">
            {/* Imagen de perfil de prueba (Avatar genérico) */}
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen&backgroundColor=b6e3f4" alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
              ¡Hola,<br />{rol || 'Carmen'}!
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/logo_LumaIA.png" alt="LumaIA" className="h-8 w-auto opacity-80" />
          <span className="font-extrabold text-slate-800 text-lg tracking-tight">LumaIA</span>
        </div>
      </header>

      {/* Subtítulo y Fecha */}
      <div className="mb-8">
        <p className="text-xl text-slate-600 font-medium">
          Esto es lo que tenemos para hoy, <span className="font-bold text-slate-800 capitalize">{fechaHoy}</span>:
        </p>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Recordatorios Pendientes</h2>

      {/* Lista de Recordatorios (Mocks visuales basados en la imagen) */}
      <div className="flex flex-col gap-4">
        
        {/* Tarjeta Medicamento */}
        <div className="bg-white rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="flex gap-4">
            <div className="mt-1">
              <Pill size={40} className="text-red-500" strokeWidth={2.5} fill="#fca5a5" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">Tomar pastilla <br/>(Presión)</h3>
              <p className="text-orange-700 font-semibold text-lg mt-1">A las 8:00 AM</p>
              <p className="text-slate-500 font-medium">(Faltan 15 min)</p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button className="min-h-touch px-6 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-xl flex items-center gap-2 shadow-md">
              Listo <Check strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Tarjeta Cita Médica */}
        <div className="bg-white rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="flex justify-between items-start gap-2">
            <div className="flex gap-4">
              <div className="mt-1 bg-slate-100 p-2 rounded-xl text-slate-600">
                <Stethoscope size={32} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 leading-tight">Consulta con<br/>Dr. Gómez</h3>
                <p className="text-slate-600 font-medium mt-1">10:30 AM (Cardiólogo)</p>
              </div>
            </div>
            <button className="text-blue-700 font-bold border-2 border-blue-100 bg-blue-50 px-3 py-1 rounded-full text-sm flex items-center gap-1 active:bg-blue-200">
              Ver mapa
            </button>
          </div>
          <div className="flex justify-end mt-2">
             <button className="min-h-touch px-6 py-2 bg-white border-2 border-blue-700 text-blue-700 active:bg-blue-50 transition-colors rounded-2xl font-extrabold text-xl flex items-center justify-center">
              Ver más
            </button>
          </div>
        </div>

        {/* Tarjeta Actividad */}
        <div className="bg-white rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
          <div className="flex gap-4">
            <div className="mt-1 bg-orange-50 p-2 rounded-xl text-orange-700">
              <Footprints size={32} strokeWidth={2.5} />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 leading-tight">Caminata <br/>diaria</h3>
                <p className="text-slate-600 font-medium mt-1">Por la tarde (5:00 PM)</p>
              </div>
              <button className="min-h-touch px-6 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                Registrar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};