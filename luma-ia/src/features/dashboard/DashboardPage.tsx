// [FRONTEND] Ruta: src/features/dashboard/DashboardPage.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Pill, Stethoscope, Check, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { obtenerMedicamentos } from '../medicamentos/services/medicamentos.service';
import { obtenerCitas } from '../citas/services/citas.service';
import { confirmarToma } from './services/registros-toma.service'; // <-- NUEVO

export const DashboardPage = () => {
  const { rol, usuarioId, logout } = useAuthStore();
  const navigate = useNavigate();

  // Estado local para los medicamentos ya confirmados visualmente
  const [tomasConfirmadas, setTomasConfirmadas] = useState<Set<string>>(new Set());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fechaGenerada = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const fechaFormateada = fechaGenerada.split(', ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(', ');

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

  // Mutación para confirmar toma
  const mutationToma = useMutation({
    mutationFn: (medicamento_id: string) => confirmarToma(medicamento_id),
    onSuccess: (_, variables) => {
      // Añadir al Set para cambiar estado visual inmediatamente
      setTomasConfirmadas(prev => new Set(prev).add(variables));
    }
  });

  const handleConfirmarToma = (id: string) => {
    if (!tomasConfirmadas.has(id)) {
      mutationToma.mutate(id);
    }
  };

  const isLoading = loadMed || loadCitas;
  const isError = errMed || errCitas;

  const hoy = new Date();
  const citasDeHoy = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha_hora);
    return fechaCita.getDate() === hoy.getDate() && fechaCita.getMonth() === hoy.getMonth() && fechaCita.getFullYear() === hoy.getFullYear();
  });

  return (
    <div className="flex flex-col min-h-full p-5 sm:p-6 pb-28 w-full">
      
      <header className="flex items-start justify-between mb-6 w-full">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-200 rounded-full border-2 border-slate-300 overflow-hidden flex-shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rol || 'User'}&backgroundColor=b6e3f4`} alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
              ¡Hola,<br />{rol ? rol : 'Usuario'}!
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <img src="/logo_LumaIA.png" alt="LumaIA" className="h-6 w-auto opacity-80" />
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">LumaIA</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm min-h-touch focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span className="text-xs font-bold">Salir</span>
          </button>
        </div>
      </header>

      <div className="mb-6 w-full">
        <p className="text-lg sm:text-xl text-slate-600 font-medium leading-snug">
          Esto es lo que tenemos para hoy,<br/>
          <span className="font-extrabold text-slate-800">{fechaFormateada}</span>:
        </p>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-4 w-full">Recordatorios Pendientes</h2>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 w-full">
          <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
          <p className="text-slate-600 font-bold">Sincronizando agenda...</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 mb-4 w-full">
          <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
          <p className="text-red-800 font-bold text-sm sm:text-base">No pudimos conectar con tus recordatorios.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4 w-full">
          
          {medicamentos.map((med) => {
            const isConfirmado = tomasConfirmadas.has(med._id);
            return (
              <div key={med._id} className="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 shadow-sm border border-slate-100 w-full">
                <div className="flex gap-3 sm:gap-4">
                  <div className="mt-1">
                    <Pill size={36} className="text-red-500" strokeWidth={2.5} fill="#fca5a5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight truncate whitespace-normal">
                      {med.nombre_farmaco}
                    </h3>
                    <p className="text-orange-700 font-semibold text-base sm:text-lg mt-1">
                      {med.horarios_especificos?.length > 0 ? `A las ${med.horarios_especificos[0]}` : `Cada ${med.frecuencia_horas} hrs`}
                    </p>
                    <p className="text-slate-500 font-medium text-sm">Dosis: {med.dosis}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  {/* BOTÓN "LISTO ✔" AHORA FUNCIONAL */}
                  <button 
                    onClick={() => handleConfirmarToma(med._id)}
                    disabled={isConfirmado || mutationToma.isPending}
                    className={`min-h-[48px] px-6 py-2 transition-all rounded-xl text-white font-extrabold text-lg flex items-center gap-2 shadow-sm focus:outline-none focus:ring-4 
                      ${isConfirmado 
                        ? 'bg-green-600 focus:ring-green-600/30' 
                        : 'bg-blue-700 hover:bg-blue-800 active:scale-95 focus:ring-blue-700/30'}`}
                  >
                    {isConfirmado ? 'Confirmado' : 'Listo'} <Check strokeWidth={3} size={20} />
                  </button>
                </div>
              </div>
            );
          })}

          {citasDeHoy.map((cita) => (
            <div key={cita._id} className="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 shadow-sm border border-slate-100 w-full">
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="mt-1 bg-slate-100 p-2 sm:p-3 rounded-xl text-slate-600 flex-shrink-0">
                    <Stethoscope size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-tight truncate whitespace-normal">
                      {cita.titulo_evento}
                    </h3>
                    <p className="text-slate-600 font-medium mt-1 text-sm sm:text-base">
                      {new Date(cita.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {medicamentos.length === 0 && citasDeHoy.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center mt-4 w-full">
              <p className="text-lg text-slate-500 font-bold">No tienes recordatorios pendientes para hoy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};