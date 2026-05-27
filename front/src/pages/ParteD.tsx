import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import { motion } from "motion/react";
import type { ParteDRes } from "../interface/parte-d.interface";

// Utility mapper to translate pyDatalog rules to user-friendly Spanish labels and alert styles
const ruleMeta = {
  detener_maquinaria: {
    title: "Parada de Emergencia",
    description: "Detención inmediata recomendada debido a fallas mecánicas críticas concurrentes.",
    color: "border-red-500/30 bg-red-950/10 text-red-400",
    badge: "Crítico",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  riesgo_mecanico: {
    title: "Riesgo Mecánico Detectado",
    description: "Vibraciones fuera de rango anormales. Requiere revisión de mantenimiento.",
    color: "border-amber-500/30 bg-amber-950/10 text-amber-400",
    badge: "Advertencia",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  alerta_ambiental: {
    title: "Alerta Ambiental Activa",
    description: "Humedad y temperatura elevadas simultáneamente. Peligro de deterioro de stock.",
    color: "border-blue-500/30 bg-blue-950/10 text-blue-400",
    badge: "Ambiente",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  despacho_inmediato: {
    title: "Orden de Despacho Inmediato",
    description: "Pedidos prioritarios aprobados para despacho automático en zonas liberadas.",
    color: "border-emerald-500/30 bg-emerald-950/10 text-emerald-400",
    badge: "Prioridad",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a3 3 0 106 0m-6 0a3 3 0 116 0" />
      </svg>
    ),
  },
  reubicar_carga: {
    title: "Plan de Reubicación de Carga",
    description: "La zona está colapsada y la ruta principal obstruida. Reubicar containers.",
    color: "border-purple-500/30 bg-purple-950/10 text-purple-400",
    badge: "Logística",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  revision_manual: {
    title: "Revisión Manual de Lote",
    description: "Inspección física requerida por detección óptica de empaque dañado.",
    color: "border-slate-500/30 bg-slate-900/40 text-slate-300",
    badge: "Inspección",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
};

export default function ParteD() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["parte-d"],
    queryFn: async () => {
      const res = await api.get("/parted");
      return res.data as ParteDRes;
    },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <motion.div
          className="relative flex items-center justify-center w-24 h-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/30 border-b-indigo-500/10 border-l-indigo-500/50"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div
            className="absolute w-16 h-16 rounded-full border-4 border-t-purple-500/30 border-r-purple-500 border-b-purple-500/50 border-l-purple-500/10"
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
          Compilando base de hechos...
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
        <h2 className="text-2xl font-extrabold text-white mb-2">Error del Sistema Experto</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          No se pudo consultar el motor de reglas en el servidor. Por favor verifica que el backend esté activo.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
        >
          Reintentar Consulta
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Inferencia Declarativa
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte D: Sistema Experto (pyDatalog)
          </h2>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-slate-700/80"
        >
          <svg className="w-4 h-4 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Evaluar Reglas
        </button>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Este panel monitorea un motor de inferencia declarativo basado en <strong>pyDatalog</strong>. 
        El sistema procesa la base de hechos operacionales y evalúa las reglas preestablecidas para deducir alarmas y recomendaciones de despacho logística automáticamente.
      </p>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Knowledge Base (Facts & Rules) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Facts Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800/50 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              Base de Hechos (Facts)
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
              {data.hechos.map((hecho, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-colors"
                >
                  <span className="text-xs font-mono text-indigo-400">{hecho.predicado}</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800/50">
                    "{hecho.valor}"
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rules Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800/50 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              Reglas Lógicas (Rules)
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
              {data.reglas.map((regla, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-colors space-y-2"
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                    {regla.nombre}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 leading-normal space-y-1">
                    <span className="text-slate-500 block">SI:</span>
                    <div className="pl-3 space-y-0.5">
                      {regla.si.map((cond, cIdx) => (
                        <div key={cIdx} className="text-indigo-300">
                          {cond}
                        </div>
                      ))}
                    </div>
                    <span className="text-slate-500 block mt-1">ENTONCES:</span>
                    <div className="pl-3 text-emerald-400">{regla.entonces}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column: Active Deductions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800/50 pb-3 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Deducciones Activas (Inferences)
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded-full">
                Motor pyDatalog Activo
              </span>
            </h3>

            {/* Inferences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(ruleMeta).map(([key, meta]) => {
                const results = (data as any)[key] as string[];
                const isSatisfied = results && results.length > 0;

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-colors min-h-[170px] ${
                      isSatisfied
                        ? meta.color
                        : "border-slate-800/50 bg-slate-950/20 text-slate-500"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={isSatisfied ? "text-inherit" : "text-slate-600"}>
                            {meta.icon}
                          </div>
                          <h4 className={`text-sm font-bold ${isSatisfied ? "text-slate-100" : "text-slate-500"}`}>
                            {meta.title}
                          </h4>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          isSatisfied 
                            ? (key === "detener_maquinaria" ? "bg-red-500/20 text-red-300" : "bg-indigo-500/20 text-indigo-300")
                            : "bg-slate-800/50 text-slate-600"
                        }`}>
                          {meta.badge}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isSatisfied ? "text-slate-300/90" : "text-slate-600"}`}>
                        {meta.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        Estado
                      </span>
                      {isSatisfied ? (
                        <div className="flex flex-wrap gap-1 items-center">
                          {results.map((val, vIdx) => (
                            <span
                              key={vIdx}
                              className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-900/80 rounded border border-slate-700/30"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold italic text-slate-600">
                          No activado
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

