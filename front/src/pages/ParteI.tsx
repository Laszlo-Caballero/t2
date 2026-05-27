import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";
import { getImageUrl } from "../utils/image";
import type { ParteIRes } from "../interface/parte-i.interface";

export function ParteI() {
  const [imageSalt, setImageSalt] = useState(() => Date.now());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["parte-i"],
    queryFn: async () => {
      const res = await api.get("partei");
      return res.data as ParteIRes;
    },
  });

  const handleSync = () => {
    refetch().then(() => {
      setImageSalt(Date.now());
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <motion.div
          className="relative flex items-center justify-center w-24 h-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/35 border-b-indigo-500/10 border-l-indigo-500/50"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div
            className="absolute w-16 h-16 rounded-full border-4 border-t-purple-500/30 border-r-purple-500 border-b-purple-500/50 border-l-purple-500/15"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          />
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
        </motion.div>
        <motion.p
          className="mt-6 text-sm font-semibold tracking-wider text-indigo-400 uppercase animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Cargando diagrama de interacción...
        </motion.p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-red-950/10 border border-red-900/30 rounded-2xl max-w-xl mx-auto my-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 border border-red-500/20">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Error al Cargar Diagrama</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          No se pudo recuperar el diagrama de interacción del servidor. Verifica que el backend esté en ejecución.
        </p>
        <button
          onClick={handleSync}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/35"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Monitoreo de Flujo de Mensajes
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte I: {data.titulo || "Diagrama de Interacción del Sistema"}
          </h2>
        </div>
        <button
          onClick={handleSync}
          className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-slate-700"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Sincronizar Diagrama
        </button>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">
        Este diagrama ilustra la secuencia de intercambio de mensajes entre los agentes autónomos de control 
        de almacén. Muestra la interacción cronológica desde la recolección física inicial del <strong>Agente Sensor</strong> 
        hasta la emisión y propagación de alertas críticas del <strong>Sistema de Alertas</strong>.
      </p>

      {/* Main Container */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            Flujo de Secuencia y Activaciones
          </h3>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2 animate-pulse"
          >
            Ver pantalla completa
          </button>
        </div>

        <div
          onClick={() => setIsPreviewOpen(true)}
          className="w-full rounded-xl overflow-hidden bg-white border border-slate-900/60 p-4 flex items-center justify-center min-h-[300px] cursor-pointer hover:shadow-2xl transition-all duration-300 group"
        >
          <img
            src={getImageUrl(data.ruta_diagrama, imageSalt)}
            alt="Diagrama de secuencia multiagente"
            className="w-full h-auto object-contain rounded max-h-[500px] group-hover:scale-[1.01] transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 20l-5.447-2.724A2 2 0 012.5 15.485V5.196a2 2 0 011.053-1.76l6-3a2 2 0 011.894 0l6 3a2 2 0 011.053 1.76v10.289a2 2 0 01-1.053 1.76L12 20m0 0V9m0 11l-5.447-2.724A2 2 0 015.5 15.485V9m13 0l-5.447 2.724a2 2 0 01-1.894 0L6 9.362'/%3E%3C/svg%3E";
            }}
          />
        </div>
        <p className="text-[10px] text-slate-500 font-mono text-center">
          Ubicación del Recurso: {data.ruta_diagrama}
        </p>
      </div>

      {/* Diagram Preview Overlay Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewOpen(false)}
            className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-6xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-800">
                <img
                  src={getImageUrl(data.ruta_diagrama, imageSalt)}
                  alt="Diagrama de interacción ampliado"
                  className="w-full h-auto object-contain max-h-[75vh]"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -top-10 right-0 text-slate-400 hover:text-white font-bold text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Cerrar Diagrama
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
