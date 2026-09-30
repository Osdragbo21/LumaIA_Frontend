// Ruta: src/features/dashboard/DashboardPage.tsx

import { useAuthStore } from '../../store/useAuthStore';
import { Pill, Calendar, StickyNote, Users } from 'lucide-react';

export const DashboardPage = () => {
  const { rol } = useAuthStore();

  // Fecha dinámica en español
  const fechaHoy = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  const modulos = [
    { id: 1, titulo: 'Medicamentos', icon: <Pill size={36} />, colorBg: 'bg-orange-100', colorIcon: 'text-orange-600' },
    { id: 2, titulo: 'Citas', icon: <Calendar size={36} />, colorBg: 'bg-teal-100', colorIcon: 'text-teal-600' },
    { id: 3, titulo: 'Notas', icon: <StickyNote size={36} />, colorBg: 'bg-yellow-100', colorIcon: 'text-yellow-600' },
    { id: 4, titulo: 'Red de Apoyo', icon: <Users size={36} />, colorBg: 'bg-red-100', colorIcon: 'text-red-600' },
  ];

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Saludo y Resumen */}
      <section className="flex flex-col gap-2">
        <p className="text-primary font-bold text-xl capitalize">{fechaHoy}</p>
        <h1 className="text-4xl font-extrabold text-text leading-tight">
          Bienvenido, <br />
          <span className="text-primary">{rol}</span>
        </h1>
        <p className="text-xl text-text/80 mt-2 font-medium">
          Todo lo importante de tu día, en un solo lugar.
        </p>
      </section>

      {/* Cuadrícula de Módulos */}
      <section className="grid grid-cols-2 gap-4">
        {modulos.map((mod) => (
          <button 
            key={mod.id} 
            className="flex flex-col items-start p-5 bg-white rounded-3xl shadow-sm border border-slate-100 min-h-touch focus:outline-none focus:ring-4 focus:ring-primary/20 hover:bg-slate-50 transition-colors"
          >
            <div className={`p-4 rounded-2xl ${mod.colorBg} ${mod.colorIcon} mb-4`}>
              {mod.icon}
            </div>
            <span className="font-extrabold text-xl text-text">{mod.titulo}</span>
          </button>
        ))}
      </section>
    </div>
  );
};