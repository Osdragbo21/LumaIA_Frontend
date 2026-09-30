// Ruta: src/features/medicamentos/MedicamentosPage.tsx

import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Pill, Plus, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Medicamento } from '../../types';

export const MedicamentosPage = () => {
  const { rol } = useAuthStore();
  const navigate = useNavigate();

  // Simulación de estados para control de errores visual (Regla 4)
  const isLoading = false; 
  const isError = false;
  const medicamentos: Medicamento[] = []; // Array vacío temporal

  const irAInicio = () => {
    navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');
  };

  return (
    <div className="flex flex-col min-h-full bg-background p-6">
      {/* Encabezado con navegación */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={irAInicio}
            className="min-w-touch min-h-touch flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/20"
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Mis Medicamentos</h1>
        </div>
      </header>

      {/* Manejo de Estados Asíncronos */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-primary">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="text-xl font-bold">Cargando medicamentos...</p>
        </div>
      )}

      {isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-start gap-3 mb-6">
          <AlertCircle className="text-sos flex-shrink-0 mt-1" size={28} />
          <div>
            <h3 className="text-text font-bold text-lg">Ocurrió un problema</h3>
            <p className="text-text/80 text-base">No pudimos cargar tu lista de medicamentos. Intenta nuevamente.</p>
          </div>
        </div>
      )}

      {/* Estado Vacío */}
      {!isLoading && !isError && medicamentos.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center mt-4">
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full mb-4">
            <Pill size={48} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-2">Aún no hay medicamentos</h2>
          <p className="text-lg text-text/80 mb-6 font-medium">Agrega tu primer tratamiento para comenzar a recibir recordatorios.</p>
        </div>
      )}

      {/* Botón Flotante / Principal para Agregar */}
      <div className="mt-auto pt-8">
        <button 
          className="w-full min-h-touch py-4 bg-primary hover:bg-primary-hover text-primary-content font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-primary/40 transition-transform active:scale-95"
        >
          <Plus size={32} strokeWidth={3} />
          Agregar Medicamento
        </button>
      </div>
    </div>
  );
};