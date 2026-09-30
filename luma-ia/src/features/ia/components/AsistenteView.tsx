// Ruta: src/features/ia/components/AsistenteView.tsx

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { consultarAsistente } from '../services/ia.service';
import { Bot, User, ArrowLeft, Loader2 } from 'lucide-react';
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

  // Inicializamos el historial con un saludo del asistente[cite: 17]
  const [historial, setHistorial] = useState<Mensaje[]>([
    { id: 'init', emisor: 'bot', texto: '¡Hola! Soy tu asistente LumaIA. Toca una de las preguntas de abajo para ayudarte.' }
  ]);

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  const mutation = useMutation({
    mutationFn: (pregunta_id: string) => consultarAsistente({
      usuario_id: usuarioId!,
      pregunta_id
    }),
    onSuccess: (respuesta) => {
      setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'bot', texto: respuesta }]);
    },
    onError: (error) => {
      const msjError = error instanceof Error ? error.message : 'Lo siento, tuve un problema para procesar tu consulta.';
      setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'bot', texto: `Error: ${msjError}` }]);
    }
  });

  // Auto-scroll al final del chat cuando hay nuevos mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historial, mutation.isPending]);

  const hacerPregunta = (textoPregunta: string, idPregunta: string) => {
    if (mutation.isPending) return;
    
    // 1. Añadir la pregunta del usuario a la pantalla
    setHistorial(prev => [...prev, { id: Date.now().toString(), emisor: 'user', texto: textoPregunta }]);
    
    // 2. Disparar la consulta a GraphQL
    mutation.mutate(idPregunta);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      
      {/* Cabecera Fija */}
      <header className="flex items-center gap-4 p-6 bg-white shadow-sm z-10">
        <button onClick={irAInicio} className="min-w-touch min-h-touch flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-text hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-primary/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full text-primary">
            <Bot size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-text tracking-tight">Asistente LumaIA</h1>
        </div>
      </header>

      {/* Historial de Conversación */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-40">
        {historial.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.emisor === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.emisor === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className="flex-shrink-0 mt-auto">
                {msg.emisor === 'user' ? (
                  <div className="bg-slate-200 text-slate-600 p-2 rounded-full shadow-sm"><User size={24} /></div>
                ) : (
                  <div className="bg-primary text-white p-2 rounded-full shadow-sm"><Bot size={24} /></div>
                )}
              </div>

              {/* Burbuja de texto (Alto contraste) */}
              <div className={`p-4 rounded-3xl shadow-sm ${msg.emisor === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border-2 border-slate-200 text-text rounded-bl-sm'}`}>
                <p className="text-xl font-medium leading-snug">{msg.texto}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Indicador de "Pensando..." */}
        {mutation.isPending && (
          <div className="flex w-full justify-start animate-in fade-in zoom-in duration-300">
            <div className="flex max-w-[85%] gap-3 flex-row">
              <div className="flex-shrink-0 mt-auto">
                <div className="bg-primary text-white p-2 rounded-full shadow-sm"><Bot size={24} /></div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-4 rounded-3xl rounded-bl-sm shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-primary" size={24} />
                <p className="text-xl font-medium text-slate-500">Pensando...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel Inferior Fijo de Controles (Sin input libre) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-slate-200 p-4 pb-8 z-20 md:max-w-md md:mx-auto">
        <p className="text-center text-slate-500 font-bold mb-3">Opciones disponibles:</p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => hacerPregunta('¿A qué hora es mi próxima medicina?', 'PROXIMA_TOMA')}
            disabled={mutation.isPending}
            className="w-full min-h-touch py-4 px-6 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-text font-extrabold text-xl rounded-2xl shadow-sm text-left border-2 border-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/40 transition-colors"
          >
            ¿A qué hora es mi próxima medicina?
          </button>
          
          {/* Espacio para futuras preguntas predefinidas */}
          {/* <button ...>¿Tengo citas médicas hoy?</button> */}
        </div>
      </div>
    </div>
  );
};