// [FRONTEND] Ruta: src/features/ia/components/AsistenteView.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { consultarAsistente } from '../services/ia.service';
import { ArrowLeft, Volume2, Pill, CalendarDays, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Mensaje {
  id: string;
  emisor: 'user' | 'bot';
  texto: string;
}

export const AsistenteView = () => {
  const { rol, usuarioId } = useAuthStore();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [historial, setHistorial] = useState<Mensaje[]>([
    { 
      id: 'init', 
      emisor: 'bot', 
      texto: `¡Hola! Qué bueno escucharte hoy. ¿Quieres que te recuerde alguna tarea o que charlemos? 😊` 
    }
  ]);

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  const reproducirAudio = (texto: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Detiene cualquier audio previo
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-MX';
      utterance.rate = 0.9; // Un poco más lento para mejor comprensión
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu dispositivo no soporta lectura en voz alta nativa.");
    }
  };

  const mutation = useMutation({
    mutationFn: (pregunta_id: string) => consultarAsistente({
      usuario_id: usuarioId!,
      pregunta_id
    }),
    onSuccess: (respuesta) => {
      setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'bot', texto: respuesta }]);
      reproducirAudio(respuesta); 
    },
    onError: (error) => {
      const msjError = error instanceof Error ? error.message : 'Lo siento, tuve un problema para procesar tu consulta.';
      setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'bot', texto: `Error: ${msjError}` }]);
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historial, mutation.isPending]);

  const hacerPregunta = (textoPregunta: string, idPregunta: string) => {
    if (mutation.isPending) return;
    setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'user', texto: textoPregunta }]);
    mutation.mutate(idPregunta);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 w-full relative">
      
      {/* HEADER STICKY */}
      <header className="flex items-center justify-between p-4 bg-white border-b-2 border-slate-200 z-10 sticky top-0 shadow-sm">
        <button 
          onClick={irAInicio} 
          className="min-w-[56px] min-h-[56px] flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-all active:scale-[0.95] focus:outline-none focus:ring-4 focus:ring-slate-300"
          aria-label="Volver atrás"
        >
          <ArrowLeft size={32} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-full">
             <Sparkles className="text-indigo-600" size={24} strokeWidth={2.5} />
          </div>
          <h1 className="font-black text-2xl text-slate-900 tracking-tight">LumaIA</h1>
        </div>
      </header>

      {/* ÁREA DE CHAT (Historial) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 scroll-smooth pb-[140px]">
        {historial.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.emisor === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.emisor === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar Bot */}
              {msg.emisor === 'bot' && (
                <div className="flex-shrink-0 mt-2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                  <Sparkles className="text-white" size={20} strokeWidth={2.5} />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div 
                  className={`p-4 shadow-sm border-2 ${
                    msg.emisor === 'user' 
                      ? 'bg-blue-600 border-blue-700 text-white rounded-3xl rounded-tr-sm' 
                      : 'bg-white border-slate-200 text-slate-900 rounded-3xl rounded-tl-sm'
                  }`}
                >
                  <p className="text-xl font-semibold leading-snug">{msg.texto}</p>
                </div>

                {/* Botón Escuchar Solo para Bot */}
                {msg.emisor === 'bot' && (
                  <div className="flex justify-start pl-2">
                    <button 
                      onClick={() => reproducirAudio(msg.texto)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 transition-all rounded-full text-slate-800 font-bold text-sm min-h-[44px] focus:outline-none focus:ring-4 focus:ring-slate-300"
                    >
                      <Volume2 size={20} strokeWidth={2.5} />
                      Escuchar en voz alta
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* INDICADOR DE CARGA (LUMA PENSANDO) */}
        {mutation.isPending && (
          <div className="flex w-full justify-start animate-in fade-in duration-300">
            <div className="flex max-w-[85%] gap-3 flex-row">
              <div className="flex-shrink-0 mt-2 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="text-white animate-pulse" size={20} strokeWidth={2.5} />
              </div>
              <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2">
                 <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTONERA INFERIOR FIJA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-slate-200 px-4 py-4 z-20 md:max-w-md md:left-1/2 md:-translate-x-1/2 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide pb-2">
          
          <button 
            onClick={() => hacerPregunta('¿A qué hora me toca mi próxima medicina?', 'PROXIMA_TOMA')}
            disabled={mutation.isPending}
            className="snap-start flex-1 flex flex-col items-center justify-center gap-2 px-4 py-4 min-h-[80px] bg-white hover:bg-slate-50 active:scale-[0.98] border-2 border-slate-300 rounded-2xl flex-shrink-0 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm disabled:opacity-50"
          >
            <Pill className="text-blue-600" size={32} strokeWidth={2.5} />
            <span className="font-bold text-sm text-slate-800 text-center leading-tight">Próxima<br/>Medicina</span>
          </button>

          <button 
            onClick={() => hacerPregunta('¿Tengo citas programadas para hoy?', 'CITAS_HOY')}
            disabled={mutation.isPending}
            className="snap-start flex-1 flex flex-col items-center justify-center gap-2 px-4 py-4 min-h-[80px] bg-white hover:bg-slate-50 active:scale-[0.98] border-2 border-slate-300 rounded-2xl flex-shrink-0 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-sm disabled:opacity-50"
          >
            <CalendarDays className="text-indigo-600" size={32} strokeWidth={2.5} />
            <span className="font-bold text-sm text-slate-800 text-center leading-tight">Citas<br/>de Hoy</span>
          </button>

        </div>
      </div>
    </div>
  );
};