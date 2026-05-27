import { useMutation } from "@tanstack/react-query";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";
import type { ParteJRes } from "../interface/parte-j.interface";

// Utility styling helper for node/proposition badges
const getFactBadgeStyle = (fact: string) => {
  switch (fact) {
    case "temperatura_alta":
    case "paquete_danado":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "vibracion_anomala":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "humedad_excesiva":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "zona_saturada":
    case "ruta_obstruida":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "zona_libre":
    case "ruta_libre":
    case "paquete_correcto":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    default:
      return "bg-slate-850 text-slate-300 border border-slate-800";
  }
};

const getRecommendationStyle = (rec: string) => {
  const r = rec.toLowerCase();
  if (r.includes("riesgo") || r.includes("mecánico") || r.includes("fajas")) {
    return "border-amber-500/30 bg-amber-950/10 text-amber-400 border-amber-500/20";
  }
  if (r.includes("temperatura") || r.includes("humedad") || r.includes("ventilación")) {
    return "border-blue-500/30 bg-blue-950/10 text-blue-400 border-blue-500/20";
  }
  if (r.includes("revisión") || r.includes("manual") || r.includes("inspeccionar")) {
    return "border-slate-500/30 bg-slate-900/40 text-slate-350 border-slate-700/40";
  }
  if (r.includes("reubicar") || r.includes("despejar") || r.includes("ruta")) {
    return "border-purple-500/30 bg-purple-950/10 text-purple-400 border-purple-500/20";
  }
  if (r.includes("normal") || r.includes("despachar") || r.includes("pedido")) {
    return "border-emerald-500/30 bg-emerald-950/10 text-emerald-400 border-emerald-500/20";
  }
  return "border-slate-800 bg-slate-900/20 text-slate-400 border-slate-850";
};

const formatFactLabel = (fact: string) => {
  return fact.replace(/_/g, " ").toUpperCase();
};

export function ParteJ() {
  const { data, isPending, mutate, isError } = useMutation({
    mutationKey: ["parte-j"],
    mutationFn: async () => {
      const res = await api.get("partej");
      return res.data as ParteJRes;
    },
  });

  return (
    <div className="space-y-6 flex flex-col pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Procesamiento Paralelo de Hilos
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte J: Ejecución Concurrente Multiagente
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Hilos de Agentes Activos...
            </div>
          )}
          {data && !isPending && (
            <span className="text-xs px-3.5 py-1.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Hilos Finalizados ({data.tiempo_total.toFixed(2)}s)
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Este panel monitorea la ejecución paralela y asíncrona de agentes mediante subprocesos concurrentes (threading). 
        El <strong>Agente Sensor</strong> y el <strong>Agente Analizador de Imágenes</strong> corren simultáneamente 
        en hilos separados compartiendo una base de hechos crítica protegida por exclusión mutua (locks).
      </p>

      {/* Control trigger button */}
      {!data && !isPending && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center max-w-xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 mb-5 animate-pulse">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.795 9.547 4.75 10.768 4.75 12s.045 2.453.137 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5v4.5h-4.5z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-slate-200">Consola de Concurrencia</h4>
          <p className="text-slate-500 text-xs mt-1.5 mb-6 max-w-sm leading-relaxed">
            Inicia la simulación concurrente para lanzar hilos separados del Agente Sensor y del Agente de Visión, midiendo el paralelismo en el servidor.
          </p>
          <button
            type="button"
            onClick={() => mutate()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 border border-indigo-500/20 cursor-pointer"
          >
            Iniciar Simulación Paralela
          </button>
        </motion.div>
      )}

      {/* Main Grid Layout for Results */}
      <AnimatePresence mode="wait">
        
        {/* Loading execution states */}
        {isPending && (
          <motion.div
            key="threading-loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-xl flex flex-col justify-center min-h-[380px]"
          >
            <div className="max-w-md mx-auto w-full text-center space-y-8">
              {/* Spinning thread orbits */}
              <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full border-3 border-t-indigo-500 border-r-indigo-500/20 border-b-indigo-500/10 border-l-indigo-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-12 h-12 rounded-full border-3 border-t-purple-500/10 border-r-purple-500 border-b-purple-500/30 border-l-purple-500/20"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white tracking-wide">Ejecución del Planificador de Hilos</h4>
                <p className="text-xs text-slate-500">
                  Lanzando hilos concurrentes en el servidor (`threading.Thread`)...
                </p>
              </div>

              {/* Progress bars of active threads */}
              <div className="space-y-3.5 max-w-sm mx-auto text-left font-mono text-[10px]">
                <div className="space-y-1">
                  <div className="flex justify-between text-indigo-400 font-semibold">
                    <span>Thread-1 (Agente Sensor)</span>
                    <span className="animate-pulse">EJECUTANDO (2s)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                    <motion.div
                      className="bg-indigo-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.0, ease: "linear" }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-purple-400 font-semibold">
                    <span>Thread-2 (Analizador de Imágenes)</span>
                    <span className="animate-pulse">EJECUTANDO (1s)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                    <motion.div
                      className="bg-purple-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.0, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Screen */}
        {isError && !isPending && (
          <motion.div
            key="error-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 rounded-2xl bg-red-950/15 border border-red-900/30 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center min-h-[380px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white mb-2">Error de Ejecución Concurrente</h4>
            <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">
              No se pudo ejecutar el hilo paralelo. Asegúrate de que el backend FastAPI esté activo y el endpoint `/partej` esté disponible.
            </p>
            <button
              type="button"
              onClick={() => mutate()}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Reintentar Ejecución
            </button>
          </motion.div>
        )}

        {/* Dynamic simulation results */}
        {data && !isPending && !isError && (
          <motion.div
            key="threading-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Retro Terminal Logs (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                {/* Terminal header */}
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">
                    thread_scheduler_monitor.sh
                  </span>
                  <span className="w-4" /> {/* Spacer */}
                </div>

                {/* Terminal content */}
                <div className="p-5 font-mono text-xs leading-relaxed max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800/80 space-y-1.5">
                  {data.logs.map((logLine, logIdx) => (
                    <div key={logIdx} className="flex select-text">
                      <span className="text-slate-700 w-8 select-none flex-shrink-0">
                        {(logIdx + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="text-emerald-400/90 whitespace-pre-wrap">{logLine}</span>
                    </div>
                  ))}
                  {/* Final success output */}
                  <div className="flex select-text pt-2 border-t border-slate-900/60 mt-2 text-indigo-400">
                    <span className="text-slate-700 w-8 select-none flex-shrink-0">
                      {(data.logs.length + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-semibold">
                      [INFO] Concurrency join completed. Elapsed: {data.tiempo_total.toFixed(4)}s.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action trigger retry button */}
              <button
                type="button"
                onClick={() => mutate()}
                className="w-full py-2.5 px-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
                Relanzar Hilos Concurrentes
              </button>
            </div>

            {/* Right Column: Execution Diagnosis (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Thread Stats Card */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-md grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-550 font-semibold uppercase tracking-wider block mb-0.5">Hilos Activos</span>
                  <span className="text-base font-extrabold text-indigo-400">2 Threads</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-550 font-semibold uppercase tracking-wider block mb-0.5">Tiempo Total</span>
                  <span className="text-base font-extrabold text-emerald-400">{data.tiempo_total.toFixed(2)}s</span>
                </div>
              </div>

              {/* Facts Card */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800/50 pb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Hechos Registrados (Shared Memory)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.hechos_detectados.length > 0 ? (
                    data.hechos_detectados.map((fact, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${getFactBadgeStyle(fact)}`}
                      >
                        {formatFactLabel(fact)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No se recolectaron hechos.</span>
                  )}
                </div>
              </div>

              {/* Decisions Card */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800/50 pb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Acciones Prescritas (Agente Decisor)
                </h3>
                <div className="space-y-2">
                  {data.recomendaciones.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs font-medium ${getRecommendationStyle(rec)}`}
                    >
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
