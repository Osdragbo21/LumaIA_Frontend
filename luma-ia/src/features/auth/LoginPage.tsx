// Ruta: src/features/auth/LoginPage.tsx

import { Link } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';

export const LoginPage = () => {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-8 min-h-screen bg-background">
      <div className="text-center flex flex-col items-center">
        <img 
          src="/logo_LumaIA.png" 
          alt="Logotipo de LumaIA" 
          className="w-32 md:w-40 object-contain mb-4 drop-shadow-sm" 
        />
        <h1 className="text-4xl font-extrabold text-text mb-2 tracking-tight">
          Iniciar sesión
        </h1>
        <p className="text-xl text-text/80 font-medium">
          Ingresa a tu cuenta de LumaIA
        </p>
      </div>

      <LoginForm />

      <div className="mt-12 flex flex-col items-center gap-4 text-xl w-full">
        <p className="text-text/80 font-bold">¿Aún no tienes una cuenta?</p>
        <Link 
          to="/registro" 
          className="w-full min-h-touch flex items-center justify-center bg-secondary text-secondary-content font-bold rounded-2xl shadow-sm"
        >
          Crear cuenta nueva
        </Link>
      </div>
    </main>
  );
};