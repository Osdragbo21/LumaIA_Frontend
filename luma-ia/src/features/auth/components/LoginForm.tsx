// Ruta: src/features/auth/components/LoginForm.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginMutation } from '../services/auth.service';

export const LoginForm = () => {
  const loginFn = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ correo?: string; password?: string }>({});

  const mutation = useMutation({
    mutationFn: () => loginMutation(correo, password),
    onSuccess: (data) => {
      loginFn(data.access_token, data.usuario_id, data.rol);
      navigate('/');
    },
  });

  const validateForm = () => {
    const newErrors: { correo?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo) newErrors.correo = 'Obligatorio';
    else if (!emailRegex.test(correo)) newErrors.correo = 'Correo inválido';
    if (!password) newErrors.password = 'Obligatorio';
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) mutation.mutate();
  };

  const isLoading = mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 mt-6" noValidate>
      {mutation.isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-r-2xl flex items-center gap-3">
          <AlertCircle className="text-sos flex-shrink-0" size={28} />
          <p className="text-text font-bold text-lg">
            {mutation.error instanceof Error ? mutation.error.message : 'Error de conexión'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="correo" className="text-xl font-extrabold text-text">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          disabled={isLoading}
          className={`w-full min-h-touch px-4 rounded-2xl border-2 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-white ${
            validationErrors.correo ? 'border-sos' : 'border-slate-300 focus:border-primary'
          }`}
          placeholder="ejemplo@correo.com"
        />
        {validationErrors.correo && <span className="text-sos font-bold text-lg">{validationErrors.correo}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xl font-extrabold text-text">Contraseña</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={`w-full min-h-touch pl-4 pr-16 rounded-2xl border-2 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-white ${
              validationErrors.password ? 'border-sos' : 'border-slate-300 focus:border-primary'
            }`}
            placeholder="••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-touch min-h-touch flex items-center justify-center text-slate-500 hover:text-primary"
          >
            {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
          </button>
        </div>
        {validationErrors.password && <span className="text-sos font-bold text-lg">{validationErrors.password}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full min-h-touch mt-4 bg-primary hover:bg-primary-hover text-primary-content text-2xl font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70 shadow-md"
      >
        {isLoading ? <><Loader2 className="animate-spin" size={32} /> Entrando...</> : <><ArrowRight size={32} strokeWidth={3} /> Iniciar sesión</>}
      </button>
    </form>
  );
};