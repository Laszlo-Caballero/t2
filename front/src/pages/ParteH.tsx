import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";

interface ProbabilidadInfo {
  probabilidad: number;
  justificacion: string;
}

type ProbabilidadesResponse = Record<string, ProbabilidadInfo>;

const getRiskAction = (prob: number) => {
  const p = prob / 100;
  if (p < 0.50) return "Monitorear situación";
  if (p < 0.70) return "Emitir advertencia";
  if (p < 0.85) return "Generar alerta";
  return "Acción inmediata";
};

const getRiskResultStyle = (action: string) => {
  switch (action) {
    case "Monitorear situación":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Emitir advertencia":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Generar alerta":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/25";
    case "Acción inmediata":
      return "bg-red-500/20 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/5 font-extrabold animate-pulse";
    default:
      return "bg-slate-950/40 text-slate-400 border border-slate-900";
  }
};

const getProgressBarColor = (prob: number) => {
  if (prob < 50) return "from-emerald-500 to-teal-500";
  if (prob < 70) return "from-amber-500 to-orange-500";
  if (prob < 85) return "from-orange-500 to-red-500";
  return "from-red-500 to-rose-600";
};

const formatRiskName = (name: string) => {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const HECHOS_OPTIONS = [
  { id: "vibracion_anomala", label: "Vibración Anómala", desc: "Sensado de vibraciones mecánicas anormales en estanterías o fajas." },
  { id: "paquete_danado", label: "Paquete Dañado", desc: "Identificación visual de roturas o aplastamientos en mercancía." },
  { id: "temperatura_alta", label: "Temperatura Alta", desc: "Condiciones térmicas críticas superiores al umbral crítico." },
  { id: "humedad_excesiva", label: "Humedad Excesiva", desc: "Niveles de humedad ambiental crítica por encima del 70%." },
  { id: "ruta_obstruida", label: "Ruta Obstruida", desc: "Detección de obstáculos físicos bloqueando los pasillos de despacho." },
  { id: "zona_saturada", label: "Zona Saturada", desc: "Ocupación espacial del almacén sobrepasando el 85% de capacidad." },
  { id: "mantenimiento_pendiente", label: "Mantenimiento Pendiente", desc: "Alertas de servicios mecánicos preventivos retrasados." },
];

export function ParteH() {
  const [selectedHechos, setSelectedHechos] = useState<string[]>([]);

  const handleToggleHecho = (id: string) => {
    setSelectedHechos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedHechos.length === HECHOS_OPTIONS.length) {
      setSelectedHechos([]);
    } else {
      setSelectedHechos(HECHOS_OPTIONS.map((h) => h.id));
    }
  };

  const riskMutation = useMutation({
    mutationKey: ["parte-h-post"],
    mutationFn: async (hechos: string[]) => {
      const formData = new FormData();
      hechos.forEach((h) => {
        formData.append("hechos", h);
      });
      const res = await api.post("parteh", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data as ProbabilidadesResponse;
    },
  });

  return (
    <div className="space-y-6 flex flex-col pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-5 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Razonamiento Probabilístico
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte H: Evaluación de Riesgo de Falla
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {riskMutation.isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Calculando probabilidades...
            </div>
          )}
          {riskMutation.data && !riskMutation.isPending && (
            <span className="text-xs px-3.5 py-1.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Evaluación Completada
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">
        Este módulo utiliza un motor de razonamiento probabilístico bayesiano simplificado para evaluar el riesgo e impacto de fallas operativas concurrentes. 
        Selecciona los hechos (hechos) detectados actualmente en el almacén para calcular las probabilidades de riesgos específicos y prescribir decisiones correctivas.
      </p>

      {/* Main Grid: Toggle facts and Show results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Facts selector (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-xl space-y-4">
            <div className="border-b border-slate-800/50 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                Hechos del Almacén
              </h3>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {selectedHechos.length === HECHOS_OPTIONS.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </button>
            </div>

            {/* Checklist of cards */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {HECHOS_OPTIONS.map((hecho) => {
                const isSelected = selectedHechos.includes(hecho.id);
                return (
                  <div
                    key={hecho.id}
                    onClick={() => handleToggleHecho(hecho.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                      isSelected
                        ? "bg-indigo-600/10 border-indigo-500/50 shadow-indigo-600/5 shadow-md"
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected ? "bg-indigo-500 border-indigo-400 text-white" : "border-slate-700 bg-slate-900"
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <span className={`text-xs font-bold block transition-colors ${isSelected ? "text-indigo-300" : "text-slate-200"}`}>
                        {hecho.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-normal">
                        {hecho.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => riskMutation.mutate(selectedHechos)}
              disabled={riskMutation.isPending}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-650 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 cursor-pointer flex items-center justify-center gap-2 border border-indigo-500/20"
            >
              {riskMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando Análisis...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Ejecutar Inferencia de Riesgo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Probabilistic Results (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            {riskMutation.isError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-2xl bg-red-950/15 border border-red-900/30 backdrop-blur-sm text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-white">Error de Comunicación</h4>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  No se pudo conectar con el motor de inferencia. Asegúrate de que el backend FastAPI esté activo.
                </p>
              </motion.div>
            )}

            {!riskMutation.data && !riskMutation.isPending && !riskMutation.isError && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-2xl bg-slate-900/10 border border-slate-850 backdrop-blur-sm shadow-xl text-center py-16 space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400/60 mx-auto animate-pulse">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-slate-350">Esperando Selección</h4>
                <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                  Activa los hechos detectados a la izquierda y presiona "Ejecutar Inferencia de Riesgo" para procesar el diagnóstico bayesiano.
                </p>
              </motion.div>
            )}

            {riskMutation.data && !riskMutation.isPending && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/60 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Análisis de Riesgo y Justificaciones
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    {Object.keys(riskMutation.data).length} riesgos evaluados
                  </span>
                </div>

                {Object.keys(riskMutation.data).length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-850 text-center text-slate-500 text-xs">
                    Sin hechos seleccionados. La probabilidad de incidentes es mínima y el almacén se encuentra en un estado normal y seguro.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(riskMutation.data).map(([riskKey, riskInfo]) => {
                      const action = getRiskAction(riskInfo.probabilidad);
                      const badgeStyle = getRiskResultStyle(action);
                      const barColor = getProgressBarColor(riskInfo.probabilidad);

                      return (
                        <div
                          key={riskKey}
                          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-4 hover:border-slate-700/60 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-extrabold text-slate-100 font-sans tracking-tight">
                                {formatRiskName(riskKey)}
                              </h4>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ID: #{riskKey.toLowerCase()}
                              </span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-3 py-1 rounded-full border ${badgeStyle}`}>
                              {action}
                            </span>
                          </div>

                          {/* Probability bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-slate-500">Probabilidad Estimada:</span>
                              <span className="text-indigo-400 font-bold">{riskInfo.probabilidad}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-850">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${riskInfo.probabilidad}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                              />
                            </div>
                          </div>

                          {/* Justification details */}
                          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">
                              Justificación de Inferencia:
                            </span>
                            <p className="text-slate-355 text-xs leading-relaxed">
                              {riskInfo.justificacion}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
