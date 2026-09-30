// Ruta: src/features/ia/components/AsistenteView.tsx

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { consultarAsistente } from '../services/ia.service';
import { ArrowLeft, Volume2, Loader2, Pill, Calendar } from 'lucide-react';
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

  // Inicializamos el historial con el saludo de Luma basado en el mockup[cite: 16, 18]
  const [historial, setHistorial] = useState<Mensaje[]>([
    { 
      id: 'init', 
      emisor: 'bot', 
      texto: `¡Hola ${rol === 'Adulto Mayor' ? 'Carmen' : 'Juan'}! Qué bueno escucharte hoy. ¿Cómo te sientes? ¿Quieres que te recuerde alguna tarea o que charlemos? 😊` 
    }
  ]);

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  // Función temporal para simular Text-to-Speech nativo
  const reproducirAudio = (texto: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-MX';
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
      reproducirAudio(respuesta); // Auto-reproducir al recibir respuesta (opcional)
    },
    onError: (error) => {
      const msjError = error instanceof Error ? error.message : 'Lo siento, tuve un problema para procesar tu consulta.';
      setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'bot', texto: `Error: ${msjError}` }]);
    }
  });

  // Auto-scroll al final del chat
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
    <div className="flex flex-col min-h-screen bg-slate-50 relative md:max-w-md md:mx-auto md:shadow-2xl">
      
      {/* Cabecera (Mockup: Botón oscuro "Atrás" y Logo a la derecha)[cite: 18] */}
      <header className="flex items-center justify-between p-5 pt-6 bg-slate-50 z-10">
        <button 
          onClick={irAInicio} 
          className="min-h-[48px] px-5 flex items-center justify-center gap-2 bg-slate-800 text-white rounded-full shadow-sm active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-slate-400"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
          <span className="font-bold text-lg">Atrás</span>
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo_LumaIA.png" alt="LumaIA" className="h-6 w-auto opacity-80" />
          <span className="font-extrabold text-slate-800 tracking-tight">LumaIA</span>
        </div>
      </header>

      {/* Título de la sección[cite: 18] */}
      <div className="px-6 mb-2">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          Platicar con Luma <span className="text-3xl">💬</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium mt-2 leading-snug">
          Luma está lista para escucharte y ayudarte.
        </p>
      </div>

      {/* Historial de Conversación */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6 pb-40">
        {historial.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.emisor === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] gap-3 ${msg.emisor === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar Luma[cite: 16, 18] */}
              {msg.emisor === 'bot' && (
                <div className="flex-shrink-0 mt-1 w-14 h-14 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=LumaBot&backgroundColor=dbeafe" alt="Luma" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Burbujas de texto */}
              <div className="flex flex-col gap-2">
                <div 
                  className={`p-5 shadow-sm border ${
                    msg.emisor === 'user' 
                      ? 'bg-blue-200 border-blue-300 text-slate-900 rounded-[28px] rounded-br-sm' // Burbuja Usuario[cite: 16, 18]
                      : 'bg-[#eef2f6] border-slate-200 text-slate-800 rounded-[28px] rounded-tl-sm' // Burbuja Luma[cite: 16, 18]
                  }`}
                >
                  <p className="text-xl font-medium leading-snug">{msg.texto}</p>
                </div>

                {/* Botón Escuchar (Solo Luma)[cite: 16, 18] */}
                {msg.emisor === 'bot' && (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => reproducirAudio(msg.texto)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 active:scale-95 transition-colors border border-slate-300 rounded-full text-slate-800 font-bold text-sm min-h-[44px] shadow-sm"
                    >
                      <Volume2 size={20} strokeWidth={2.5} />
                      Escuchar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de Carga */}
        {mutation.isPending && (
          <div className="flex w-full justify-start animate-in fade-in zoom-in duration-300">
            <div className="flex max-w-[85%] gap-3 flex-row">
              <div className="flex-shrink-0 mt-1 w-14 h-14 bg-blue-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=LumaBot&backgroundColor=dbeafe" alt="Luma" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#eef2f6] border border-slate-200 p-5 rounded-[28px] rounded-tl-sm shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={28} />
                <p className="text-xl font-medium text-slate-600">Procesando...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controles Inferiores (Scroll horizontal de píldoras)[cite: 17] */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pt-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 md:max-w-md md:mx-auto">
        <div className="flex overflow-x-auto gap-3 px-5 pb-4 snap-x scrollbar-hide">
          
          {/* Opción Funcional 1 */}
          <button 
            onClick={() => hacerPregunta('¿A qué hora me toca mi próxima medicina?', 'PROXIMA_TOMA')}
            disabled={mutation.isPending}
            className="snap-start flex items-center gap-2 px-5 py-3 min-h-[48px] bg-slate-100 hover:bg-slate-200 active:scale-95 border-2 border-slate-300 rounded-full flex-shrink-0 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <Pill className="text-red-500" size={24} strokeWidth={2.5} />
            <span className="font-extrabold text-lg text-slate-700 whitespace-nowrap">¿Próxima medicina?</span>
          </button>

          {/* Opción Funcional 2 (Preparada para el backend) */}
          <button 
            onClick={() => hacerPregunta('¿Tengo citas programadas para hoy?', 'CITAS_HOY')}
            disabled={mutation.isPending}
            className="snap-start flex items-center gap-2 px-5 py-3 min-h-[48px] bg-slate-100 hover:bg-slate-200 active:scale-95 border-2 border-slate-300 rounded-full flex-shrink-0 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            <Calendar className="text-teal-600" size={24} strokeWidth={2.5} />
            <span className="font-extrabold text-lg text-slate-700 whitespace-nowrap">¿Qué tengo hoy?</span>
          </button>

          {/* Opción Visual (Aún sin ID en backend)[cite: 17] */}
          <button 
            disabled={true}
            className="snap-start flex items-center gap-2 px-5 py-3 min-h-[48px] bg-slate-50 border-2 border-slate-200 rounded-full flex-shrink-0 opacity-60"
          >
            <span className="text-2xl">🎵</span>
            <span className="font-extrabold text-lg text-slate-500 whitespace-nowrap">Pon música</span>
          </button>

        </div>
      </div>
    </div>
  );
};