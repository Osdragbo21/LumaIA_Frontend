// Ruta: src/features/auth/RegistroPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registrarUsuario } from './services/registro.service';
import { Loader2, AlertCircle, User, ShieldAlert, ArrowLeft } from 'lucide-react';
import type { Enum_Rol } from '../../types';

export const RegistroPage = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<Enum_Rol | null>(null);

  // Mapeamos el estado visual al enumerador que espera GraphQL
  const mapRolToBackend = (rolSeleccionado: Enum_Rol): string => {
    return rolSeleccionado === 'Adulto Mayor' ? 'ADULTO_MAYOR' : 'CUIDADOR';
  };

  const mutation = useMutation({
    mutationFn: () => registrarUsuario({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      password: password, // Se envía en texto plano, el backend lo encripta en password_hash[cite: 17, 19]
      rol: mapRolToBackend(rol!)
    }),
    onSuccess: () => {
      // Redirigimos al Login enviando un mensaje de éxito por el estado del router
      navigate('/login', { state: { mensajeExito: '¡Cuenta creada con éxito! Por favor, inicia sesión.' } });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !correo || !password || !rol) return;
    mutation.mutate();
  };

  const isPending = mutation.isPending;

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-8">
      {/* Cabecera */}
      <header className="flex items-center gap-4 mb-8">
        <Link 
          to="/login"
          className="min-w-touch min-h-touch flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/20"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </Link>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Crear Cuenta</h1>
      </header>

      {/* Manejo de Errores */}
      {mutation.isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-2xl flex items-start gap-3 mb-6 animate-in fade-in">
          <AlertCircle className="text-sos flex-shrink-0 mt-1" size={28} />
          <p className="text-text font-bold text-lg">{mutation.error instanceof Error ? mutation.error.message : 'Error al registrar usuario'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        
        {/* Selección de Rol (RF-001.2)[cite: 17] */}
        <div className="flex flex-col gap-3">
          <label className="text-xl font-extrabold text-text">¿Cómo usarás LumaIA?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRol('Adulto Mayor')}
              disabled={isPending}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-4 min-h-[120px] transition-all focus:outline-none ${rol === 'Adulto Mayor' ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <User size={40} className={rol === 'Adulto Mayor' ? 'text-primary mb-2' : 'text-slate-400 mb-2'} />
              <span className={`font-extrabold text-lg ${rol === 'Adulto Mayor' ? 'text-primary' : 'text-slate-600'}`}>Adulto Mayor</span>
            </button>
            <button
              type="button"
              onClick={() => setRol('Cuidador')}
              disabled={isPending}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-4 min-h-[120px] transition-all focus:outline-none ${rol === 'Cuidador' ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <ShieldAlert size={40} className={rol === 'Cuidador' ? 'text-teal-600 mb-2' : 'text-slate-400 mb-2'} />
              <span className={`font-extrabold text-lg ${rol === 'Cuidador' ? 'text-teal-600' : 'text-slate-600'}`}>Cuidador</span>
            </button>
          </div>
        </div>

        {/* Datos Básicos (RF-001.1)[cite: 17] */}
        <div className="flex flex-col gap-4 mt-2 pb-24">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Nombre completo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white" placeholder="Ej. Juan Pérez" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Correo electrónico</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white" placeholder="ejemplo@correo.com" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white" placeholder="••••••••" required />
          </div>
        </div>

        <div className="fixed bottom-6 left-0 w-full px-6 md:max-w-md md:mx-auto">
          <button 
            type="submit" 
            disabled={isPending || !rol}
            className="w-full min-h-touch py-4 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:text-slate-500 text-primary-content font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/40"
          >
            {isPending ? <Loader2 className="animate-spin" size={32} /> : 'Crear Cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
};