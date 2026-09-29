// Ruta: src/features/auth/components/LoginForm.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState<{ correo?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { correo?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo) {
      newErrors.correo = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido.';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      login('jwt_simulado_123', {
        _id: 'user_123',
        nombre: 'Usuario de Prueba',
        correo: correo,
        rol: 'Adulto Mayor',
        estado_activo: true,
        tokens_dispositivo: [],
        contactos_emergencia: []
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 mt-6" noValidate>
      {/* Campo Correo */}
      <div className="flex flex-col gap-2">
        <label htmlFor="correo" className="text-lg font-extrabold text-text">
          Correo electrónico
        </label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          disabled={isLoading}
          className={`w-full min-h-touch px-4 rounded-2xl border-2 text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-white ${
            errors.correo ? 'border-sos' : 'border-slate-300 focus:border-primary'
          }`}
          placeholder="ejemplo@correo.com"
          autoComplete="email"
        />
        {errors.correo && (
          <span className="text-sos font-medium text-base" role="alert">
            {errors.correo}
          </span>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-lg font-extrabold text-text">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={`w-full min-h-touch pl-4 pr-14 rounded-2xl border-2 text-lg focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-white ${
              errors.password ? 'border-sos' : 'border-slate-300 focus:border-primary'
            }`}
            placeholder="••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-touch min-h-touch flex items-center justify-center text-slate-500 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-xl"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-sos font-medium text-base" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      {/* Enlace de recuperación */}
      <div className="flex justify-start">
        <Link 
          to="/recuperar" 
          className="text-primary font-bold text-lg hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Botón de Envío */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full min-h-touch mt-2 bg-primary hover:bg-primary-hover text-primary-content text-xl font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Iniciando sesión...
          </>
        ) : (
          <>
            Iniciar sesión
            <ArrowRight size={24} strokeWidth={2.5} />
          </>
        )}
      </button>
    </form>
  );
};