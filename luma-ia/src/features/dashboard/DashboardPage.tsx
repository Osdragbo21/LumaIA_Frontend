// [FRONTEND] Ruta: src/features/dashboard/DashboardPage.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Pill, Stethoscope, Check, LogOut, Loader2, AlertCircle, Phone, Clock } from 'lucide-react';
import { obtenerMedicamentos } from '../medicamentos/services/medicamentos.service';
import { obtenerCitas } from '../citas/services/citas.service';
import { confirmarToma } from './services/registros-toma.service';

export const DashboardPage = () => {
  const { rol, usuarioId, logout } = useAuthStore();
  const navigate = useNavigate();
  const basePath = rol === 'Adulto Mayor' ? '/paciente' : '/cuidador';

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

  const mutationToma = useMutation({
    mutationFn: (medicamento_id: string) => confirmarToma(medicamento_id),
    onSuccess: (_, variables) => {
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
    <div className="flex flex-col min-h-full p-6 w-full">
      
      {/* HEADER PROFESIONAL */}
      <header className="flex items-center justify-between mb-8 w-full bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 bg-blue-100 rounded-full border-4 border-blue-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
             <span className="text-2xl font-black text-blue-700">{rol?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Bienvenido</span>
            <h1 className="text-2xl font-black text-slate-900 leading-tight truncate">
              {rol ? rol : 'Usuario'}
            </h1>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-700 transition-colors p-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-200 active:scale-[0.98]"
        >
          <LogOut size={24} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Salir</span>
        </button>
      </header>

      {/* BOTÓN EMERGENCIA (SOS) */}
      <button 
        onClick={() => navigate(`${basePath}/red-apoyo`)}
        className="w-full min-h-[72px] mb-8 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] transition-all rounded-3xl flex items-center justify-center gap-4 shadow-[0_8px_20px_-6px_rgba(225,29,72,0.4)] focus:outline-none focus:ring-4 focus:ring-rose-300 border-b-4 border-rose-800"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <Phone className="text-white" size={32} strokeWidth={2.5} />
        </div>
        <span className="text-white font-black text-2xl tracking-wide">EMERGENCIA SOS</span>
      </button>

      <div className="mb-6 w-full flex items-center gap-3">
        <Clock className="text-slate-400" size={24} />
        <h2 className="text-xl font-bold text-slate-700 capitalize">
          {fechaFormateada}
        </h2>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 w-full bg-white rounded-3xl border-2 border-slate-200 border-dashed">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-slate-600 font-bold text-lg">Preparando tu día...</p>
        </div>
      )}

      {isError && (
        <div className="bg-rose-50 border-2 border-rose-200 p-5 rounded-3xl flex items-center gap-4 mb-4 w-full shadow-sm">
          <AlertCircle className="text-rose-600 flex-shrink-0" size={32} />
          <p className="text-rose-900 font-bold text-lg leading-snug">Ocurrió un problema al cargar tu información médica.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-5 w-full">
          
          {/* MEDICAMENTOS */}
          {medicamentos.map((med) => {
            const isConfirmado = tomasConfirmadas.has(med._id);
            return (
              <div key={med._id} className={`rounded-3xl p-5 flex flex-col gap-4 shadow-sm border-2 transition-all duration-300 ${isConfirmado ? 'bg-emerald-50 border-emerald-200 opacity-80' : 'bg-white border-slate-200'}`}>
                <div className="flex gap-4">
                  <div className={`mt-1 p-3 rounded-2xl flex-shrink-0 h-fit ${isConfirmado ? 'bg-emerald-200 text-emerald-700' : 'bg-blue-100 text-blue-600'}`}>
                    <Pill size={32} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-2xl font-black leading-tight truncate whitespace-normal ${isConfirmado ? 'text-emerald-900 line-through decoration-emerald-400' : 'text-slate-900'}`}>
                      {med.nombre_farmaco}
                    </h3>
                    <p className={`font-bold text-lg mt-1 ${isConfirmado ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {med.horarios_especificos?.length > 0 ? `A las ${med.horarios_especificos[0]}` : `Cada ${med.frecuencia_horas} hrs`}
                    </p>
                    <p className="text-slate-600 font-medium text-base mt-1">Dosis: {med.dosis}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleConfirmarToma(med._id)}
                  disabled={isConfirmado || mutationToma.isPending}
                  className={`min-h-[56px] w-full px-6 py-3 transition-all rounded-2xl font-black text-xl flex items-center justify-center gap-3 focus:outline-none focus:ring-4 active:scale-[0.98] 
                    ${isConfirmado 
                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' 
                      : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:ring-blue-300 border-b-4 border-blue-800'}`}
                >
                  {mutationToma.isPending && !isConfirmado ? (
                    <Loader2 className="animate-spin" size={28} />
                  ) : (
                    <>
                      {isConfirmado ? 'Toma Confirmada' : 'Ya lo tomé'} <Check strokeWidth={3.5} size={24} />
                    </>
                  )}
                </button>
              </div>
            );
          })}

          {/* CITAS MÉDICAS DE HOY */}
          {citasDeHoy.map((cita) => (
            <div key={cita._id} className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-sm border-2 border-indigo-100 w-full relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-500"></div>
              <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 flex-shrink-0">
                <Stethoscope size={32} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-slate-900 leading-tight truncate whitespace-normal">
                  {cita.titulo_evento}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-lg text-sm">
                    {new Date(cita.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {cita.ubicacion && (
                    <span className="text-slate-600 font-medium text-sm truncate">{cita.ubicacion}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* ESTADO VACÍO */}
          {medicamentos.length === 0 && citasDeHoy.length === 0 && (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center flex flex-col items-center gap-4 w-full">
               <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                  <Check size={48} strokeWidth={2} />
               </div>
              <h3 className="text-2xl font-black text-slate-800">¡Todo al día!</h3>
              <p className="text-lg text-slate-500 font-medium">No tienes tareas médicas pendientes para hoy.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};