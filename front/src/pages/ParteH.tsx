import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";

// Styling helper for the POST risk evaluation results
const getRiskResultStyle = (result: string) => {
  switch (result) {
    case "Monitorear situación":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Emitir advertencia":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Generar alerta":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/25";
    case "Acción inmediata":
      return "bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/5 font-extrabold animate-pulse";
    default:
      return "bg-slate-950/40 text-slate-450 border border-slate-900";
  }
};

export function ParteH() {
  // POST Form State
  const [probabilidadFalla, setProbabilidadFalla] = useState(0.50);

  // POST Risk Evaluation (Submitting to POST /parteh)
  const riskMutation = useMutation({
    mutationKey: ["parte-h-post"],
    mutationFn: async (prob: number) => {
      const formData = new FormData();
      formData.append("probabilidad_falla", prob.toString());
      const res = await api.post("parteh", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as string;
    },
  });

  return (
    <div className="space-y-6 flex flex-col pb-12 max-w-2xl mx-auto">
      {/* Header */}
      <div className="pb-5 border-b border-slate-900">
        <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
          Razonamiento Probabilístico
        </p>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Parte H: Evaluación de Riesgo de Falla
        </h2>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">
        Este módulo calcula el nivel de riesgo operativo del almacén mediante el motor de razonamiento probabilístico. 
        Ajusta la probabilidad de falla calculada por los sensores y prescribe una acción inmediata de mitigación.
      </p>

      {/* Risk Evaluator Card */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-xl space-y-6">
        <div className="border-b border-slate-800/50 pb-3 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Consola de Evaluación Operativa
          </h3>
          <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
            POST /parteh
          </span>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Probabilidad de Falla de Componente</span>
              <span className="text-indigo-400 font-mono font-extrabold text-sm">
                {(probabilidadFalla * 100).toFixed(0)}% ({probabilidadFalla.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.01"
              value={probabilidadFalla}
              onChange={(e) => setProbabilidadFalla(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => riskMutation.mutate(probabilidadFalla)}
            disabled={riskMutation.isPending}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-650 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 cursor-pointer flex items-center justify-center gap-2 border border-indigo-500/20"
          >
            {riskMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando Evaluación...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Enviar Probabilidad a Inferencia
              </>
            )}
          </button>
        </div>

        {/* Risk Mutation Result Alert */}
        <AnimatePresence mode="wait">
          {riskMutation.data && (
            <motion.div
              key="risk-result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`p-5 rounded-xl border flex flex-col items-center justify-center ${getRiskResultStyle(riskMutation.data)}`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-550 tracking-wider block mb-1">
                Acción Prescrita por el Motor Lógico:
              </span>
              <span className="text-base font-extrabold tracking-wide uppercase">{riskMutation.data}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
