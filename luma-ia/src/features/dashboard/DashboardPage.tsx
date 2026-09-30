// Ruta: src/features/dashboard/DashboardPage.tsx

import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Pill, Stethoscope, Check, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { obtenerMedicamentos } from '../medicamentos/services/medicamentos.service';
import { obtenerCitas } from '../citas/services/citas.service';

export const DashboardPage = () => {
  const { rol, usuarioId, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fecha capitalizada (Ej. Miércoles, 30 De Septiembre)
  const fechaGenerada = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const fechaFormateada = fechaGenerada.split(', ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(', ');

  // Consumo de datos reales desde MongoDB Atlas
  const { data: medicamentos = [], isLoading: loadMed, isError: errMed } = useQuery({
    queryKey: ['medicamentos', usuarioId],
    queryFn: () => obtenerMedicamentos(usuarioId!),
    enabled: !!usuarioId,
  });

  const { data: citas = [], isLoading: loadCitas, isError: errCitas } = useQuery({
    queryKey: ['citas', usuarioId],
    queryFn: () => obtenerCitas(usuarioId!),
    enabled: !!usuarioId,
  });

  const isLoading = loadMed || loadCitas;
  const isError = errMed || errCitas;

  // Filtro de citas para el día de hoy
  const hoy = new Date();
  const citasDeHoy = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha_hora);
    return fechaCita.getDate() === hoy.getDate() && fechaCita.getMonth() === hoy.getMonth() && fechaCita.getFullYear() === hoy.getFullYear();
  });

  return (
    <div className="flex flex-col min-h-full p-5 sm:p-6 pb-28 w-full">
      
      {/* Cabecera con Cerrar Sesión restaurado */}
      <header className="flex items-start justify-between mb-6 w-full">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-16 h-16 bg-[#ff6b6b] rounded-full border-2 border-slate-200 overflow-hidden flex-shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rol || rol}&backgroundColor=ff6b6b`} alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight leading-tight">
              ¡Hola,<br />{rol}!
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <img src="/logo_LumaIA.png" alt="LumaIA" className="h-6 w-auto opacity-80" />
            <span className="font-extrabold text-[#1e293b] text-sm tracking-tight">LumaIA</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm min-h-[48px] focus:outline-none focus:ring-2 focus:ring-red-200"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span className="text-xs font-bold">Salir</span>
          </button>
        </div>
      </header>

      <div className="mb-6 w-full">
        <p className="text-lg text-[#334155] font-medium leading-snug">
          Esto es lo que tenemos para hoy,<br/>
          <span className="font-extrabold text-[#1e293b]">{fechaFormateada}</span>:
        </p>
      </div>

      <h2 className="text-2xl font-extrabold text-[#1e293b] mb-4 w-full">Recordatorios Pendientes</h2>

      {/* Control de Estados Asíncronos */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 w-full">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
          <p className="text-slate-600 font-bold">Sincronizando agenda...</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 mb-4 w-full">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <p className="text-red-800 font-bold text-sm">No pudimos conectar con tus recordatorios.</p>
        </div>
      )}

      {/* Renderizado de Datos Reales */}
      {!isLoading && !isError && (
        <div className="flex flex-col gap-5 w-full">
          
          {/* Mapeo de Medicamentos (Base de datos real) */}
          {medicamentos.map((med) => (
            <div key={med._id} className="bg-white rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Pill size={40} className="text-[#ff4757]" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-extrabold text-[#1e293b] leading-tight truncate whitespace-normal">
                    {med.nombre_farmaco}
                  </h3>
                  <p className="text-[#d35400] font-bold text-lg mt-1">
                    {med.horarios_especificos?.length > 0 ? `A las ${med.horarios_especificos[0]}` : `Cada ${med.frecuencia_horas} hrs`}
                  </p>
                  {/* Nota: Visual estático por ahora según requerimiento */}
                  <p className="text-slate-500 font-medium text-sm">A esta hora tienes que tomarlo</p>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <button className="min-h-[48px] px-6 py-2 bg-[#1d4ed8] hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-lg flex items-center gap-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-700/30">
                  Listo <Check strokeWidth={3} size={20} />
                </button>
              </div>
            </div>
          ))}

          {/* Mapeo de Citas Médicas (Filtradas para HOY) */}
          {citasDeHoy.map((cita) => (
            <div key={cita._id} className="bg-white rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="mt-1 bg-slate-100 p-2 rounded-xl text-[#475569] flex-shrink-0">
                    <Stethoscope size={32} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-extrabold text-[#1e293b] leading-tight truncate whitespace-normal">
                      {cita.titulo_evento}
                    </h3>
                    <p className="text-[#475569] font-medium mt-1 text-base">
                      {new Date(cita.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {cita.ubicacion && (
                  <button className="text-[#1d4ed8] font-bold border-2 border-blue-100 bg-blue-50 px-3 py-1.5 rounded-full text-xs flex-shrink-0 active:bg-blue-200 transition-colors">
                    Ver mapa
                  </button>
                )}
              </div>
              <div className="flex justify-end mt-1">
                 <button className="min-h-[48px] px-6 py-2 bg-white border-2 border-[#1d4ed8] text-[#1d4ed8] active:bg-blue-50 transition-colors rounded-2xl font-extrabold text-lg focus:outline-none focus:ring-4 focus:ring-blue-700/20">
                  Ver más
                </button>
              </div>
            </div>
          ))}

          {/* Empty State Dinámico */}
          {!isLoading && !isError && medicamentos.length === 0 && citasDeHoy.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center mt-4 w-full">
              <p className="text-lg text-slate-500 font-bold">No tienes recordatorios pendientes para hoy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};