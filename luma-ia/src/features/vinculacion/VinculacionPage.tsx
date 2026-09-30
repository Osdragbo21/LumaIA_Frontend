// Ruta: src/features/vinculacion/VinculacionPage.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery, useMutation } from '@tanstack/react-query';
import { generarPin, vincularCuidador } from './services/vinculacion.service';
import { ShieldAlert, Key, AlertCircle, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VinculacionPage = () => {
  const { rol, usuarioId } = useAuthStore();
  const navigate = useNavigate();
  const [pinIngresado, setPinIngresado] = useState('');
  const [exito, setExito] = useState(false);

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  // Lógica para Adulto Mayor: Obtener/Generar su PIN automáticamente al entrar[cite: 17]
  const { data: pinGenerado, isLoading: cargandoPin, isError: errorPin, error: errorDetallePin } = useQuery({
    queryKey: ['pin_vinculacion', usuarioId],
    queryFn: () => generarPin(usuarioId!),
    enabled: rol === 'Adulto Mayor' && !!usuarioId,
    refetchOnWindowFocus: false, // Evita regenerar el PIN si cambian de app
  });

  // Lógica para Cuidador: Enviar el PIN
  const mutationVinculacion = useMutation({
    mutationFn: () => vincularCuidador({ 
      cuidador_id: usuarioId!, 
      pin: pinIngresado.trim() 
    }),
    onSuccess: () => setExito(true),
  });

  const handleVincular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinIngresado.trim()) return;
    mutationVinculacion.mutate();
  };

  return (
    <div className="flex flex-col min-h-full bg-background p-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={irAInicio} className="min-w-[48px] min-h-[48px] flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Vinculación</h1>
      </header>

      {/* VISTA: ADULTO MAYOR (Generador de PIN) */}
      {rol === 'Adulto Mayor' && (
        <div className="flex flex-col items-center justify-center flex-1 text-center mt-4 pb-24">
          <div className="bg-primary/10 text-primary p-6 rounded-full mb-6">
            <Key size={64} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-4">Código de Enlace</h2>
          <p className="text-lg text-text/80 font-medium mb-8">
            Comparte este código con tu familiar o cuidador para que puedan ayudarte a gestionar tu rutina.
          </p>

          {cargandoPin ? (
            <Loader2 className="animate-spin text-primary" size={48} />
          ) : errorPin ? (
            <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="text-sos flex-shrink-0" size={24} />
              <p className="text-text font-bold">{errorDetallePin instanceof Error ? errorDetallePin.message : 'Error al generar tu código.'}</p>
            </div>
          ) : (
            <div className="bg-white border-4 border-primary/20 rounded-3xl py-6 px-12 shadow-sm w-full max-w-[300px]">
              <span className="text-5xl font-extrabold text-primary tracking-widest">{pinGenerado}</span>
            </div>
          )}
        </div>
      )}

      {/* VISTA: CUIDADOR (Ingreso de PIN) */}
      {rol === 'Cuidador' && (
        <div className="flex flex-col flex-1 mt-4 pb-24">
          <div className="flex items-center justify-center bg-teal-50 text-teal-600 p-6 rounded-full mb-6 mx-auto w-32 h-32 shadow-sm">
            <ShieldAlert size={64} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-4 text-center">Conectar con Paciente</h2>
          <p className="text-lg text-text/80 font-medium mb-8 text-center">
            Ingresa el código temporal que aparece en la pantalla del dispositivo del adulto mayor.
          </p>

          {exito ? (
            <div className="bg-green-100 border-2 border-green-500 p-6 rounded-3xl flex flex-col items-center text-center gap-4 animate-in zoom-in duration-300">
              <CheckCircle className="text-green-600" size={64} />
              <h3 className="text-2xl font-extrabold text-green-900">¡Cuentas Vinculadas!</h3>
              <p className="text-green-800 text-lg font-medium">Ya puedes monitorear y asistir al paciente.</p>
              <button onClick={irAInicio} className="mt-4 min-h-[48px] px-8 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xl rounded-2xl transition-colors">
                Ir al Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleVincular} className="flex flex-col gap-6 w-full">
              {mutationVinculacion.isError && (
                <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="text-sos flex-shrink-0 mt-1" size={24} />
                  <p className="text-text font-bold text-lg">{mutationVinculacion.error instanceof Error ? mutationVinculacion.error.message : 'Código incorrecto o expirado'}</p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={pinIngresado} 
                  onChange={e => setPinIngresado(e.target.value.toUpperCase())} 
                  disabled={mutationVinculacion.isPending}
                  className="min-h-[64px] text-center tracking-[0.5em] px-4 rounded-2xl border-4 border-slate-200 text-3xl font-extrabold focus:outline-none focus:border-teal-500 bg-white uppercase transition-colors" 
                  placeholder="------" 
                  required 
                />
              </div>

              <div className="fixed bottom-6 left-0 w-full px-6 md:max-w-md md:mx-auto">
                <button 
                  type="submit" 
                  disabled={mutationVinculacion.isPending || !pinIngresado.trim()}
                  className="w-full min-h-touch py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-600/40"
                >
                  {mutationVinculacion.isPending ? <Loader2 className="animate-spin" size={32} /> : 'Vincular Cuentas'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};