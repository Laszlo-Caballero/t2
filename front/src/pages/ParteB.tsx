import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useUtils } from "../context/UtilsProvider";
import { useForm } from "react-hook-form";
import { ParteBSchema } from "../schema/parteb.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../utils/api";
import { motion } from "motion/react";
import { getImageUrl } from "../utils/image";
import type { ParteBRes } from "../interface/parte-b.interface";

export default function ParteB() {
  const { data: utils } = useUtils();
  const [imageSalt, setImageSalt] = useState(() => Date.now());

  const { data, mutate, isPending, isError } = useMutation({
    mutationKey: ["parteb"],
    mutationFn: async (formData: { a_temp: number; a_vib: number }) => {
      const payload = {
        a_temp: formData.a_temp,
        a_vib: formData.a_vib,
        ...utils,
      };

      // Only send arrays if they are simulated/saved in the parent context
      if (utils && utils.temperatura && utils.temperatura.length > 0) {
        payload.temperatura = utils.temperatura;
        payload.vibracion = utils.vibracion;
        payload.tiempo = utils.tiempo;
      }

      const response = await api.post("/parteb", payload);
      return response.data as ParteBRes;
    },
  });

  const { register, watch } = useForm({
    resolver: zodResolver(ParteBSchema),
    defaultValues: {
      a_temp: 32,
      a_vib: 5.0,
    },
  });

  const watchTemp = watch("a_temp");
  const watchVib = watch("a_vib");

  const [debouncedParams, setDebouncedParams] = useState({
    a_temp: 32,
    a_vib: 5.0,
  });

  // Debounce the slider adjustments to avoid flooding the backend with requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({
        a_temp: watchTemp ?? 32,
        a_vib: watchVib ?? 5.0,
      });
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [watchTemp, watchVib]);

  // Trigger mutate when debounced limits change
  useEffect(() => {
    mutate({
      a_temp: debouncedParams.a_temp,
      a_vib: debouncedParams.a_vib,
    });
  }, [debouncedParams.a_temp, debouncedParams.a_vib, mutate]);

  useEffect(() => {
    if (data) {
      setImageSalt(Date.now());
    }
  }, [data]);

  const hasSourceData =
    utils && utils.temperatura && utils.temperatura.length > 0;

  return (
    <div className="space-y-6 flex flex-col pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Procesamiento de Señales
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte B: Detección de Anomalías
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full font-medium">
              <svg
                className="animate-spin h-3.5 w-3.5 text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analizando...
            </div>
          )}
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
              hasSourceData
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {hasSourceData ? "Datos de Parte A Activos" : "Usando Señal Base"}
          </span>
        </div>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        En esta sección, se aplican técnicas de detección de anomalías sobre los
        datos de temperatura y vibración. Ajusta los umbrales críticos usando
        los controles deslizantes para recalcular los puntos de anomalía en
        tiempo real.
      </p>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sliders Parameter Control Panel */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-1 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-6"
        >
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800/80 pb-3 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Umbrales Críticos
          </h3>

          <div className="space-y-5">
            {/* Temp Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Límite Temp
                </label>
                <span className="text-sm font-bold text-orange-400">
                  {watchTemp}°C
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                step="0.5"
                {...register("a_temp", { valueAsNumber: true })}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-slate-800"
              />
            </div>

            {/* Vib Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Límite Vibración
                </label>
                <span className="text-sm font-bold text-purple-400">
                  {watchVib} m/s²
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                {...register("a_vib", { valueAsNumber: true })}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-slate-800"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-[11px] text-slate-500 leading-normal space-y-1">
            <span className="font-semibold text-slate-400 block">
              Información:
            </span>
            <span>
              El análisis calcula las anomalías filtrando los valores de
              telemetría que superan los límites definidos.
            </span>
          </div>
        </motion.div>

        {/* Results Area (Charts and Tables) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-3 space-y-6"
        >
          {isError && (
            <div className="p-5 rounded-2xl bg-red-950/10 border border-red-900/30 text-center space-y-3">
              <p className="text-sm text-red-400 font-semibold">
                Error al sincronizar con el servidor de análisis
              </p>
              <button
                onClick={() =>
                  mutate({ a_temp: watchTemp || 32, a_vib: watchVib || 5 })
                }
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          )}

          {isPending && !data && (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-900/10 border border-slate-800/80 rounded-2xl shadow-inner">
              <motion.div
                className="relative flex items-center justify-center w-16 h-16"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/30 border-b-indigo-500/10 border-l-indigo-500/50"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear",
                  }}
                />
                <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
              </motion.div>
              <p className="mt-4 text-xs font-semibold tracking-wider text-indigo-400 uppercase animate-pulse">
                Analizando señales...
              </p>
            </div>
          )}

          {data && (
            <div className="relative">
              {isPending && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center rounded-2xl transition-all duration-300">
                  <motion.div
                    className="relative flex items-center justify-center w-12 h-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full border-3 border-t-indigo-500 border-r-indigo-500/20 border-b-indigo-500/10 border-l-indigo-500/40"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                  <span className="mt-3 text-xs font-semibold text-indigo-400 animate-pulse">
                    Actualizando análisis...
                  </span>
                </div>
              )}

              <div
                className={`space-y-6 transition-all duration-300 ${
                  isPending ? "blur-[1px] opacity-70" : "opacity-100"
                }`}
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">
                        Anomalías de Temperatura
                      </span>
                      <div className="text-xl font-extrabold text-white mt-1">
                        {data.anomalias_temperatura.length}{" "}
                        <span className="text-xs text-slate-500 font-normal">
                          puntos detectados
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        data.anomalias_temperatura.length > 0
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {data.anomalias_temperatura.length > 0
                        ? "Alerta"
                        : "Normal"}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">
                        Anomalías de Vibración
                      </span>
                      <div className="text-xl font-extrabold text-white mt-1">
                        {data.anomalias_vibracion.length}{" "}
                        <span className="text-xs text-slate-500 font-normal">
                          puntos detectados
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        data.anomalias_vibracion.length > 0
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {data.anomalias_vibracion.length > 0
                        ? "Alerta"
                        : "Normal"}
                    </span>
                  </div>
                </div>

                {/* Pyplot Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Temp Pyplot */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-lg">
                    <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                        Temperatura Detectada
                      </h3>
                    </div>
                    <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 p-2 min-h-[220px] flex items-center justify-center">
                      <img
                        src={getImageUrl(data.ruta_temperatura, imageSalt)}
                        alt="Detección de Anomalías Temperatura"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Vib Pyplot */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-lg">
                    <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                        Vibración Detectada
                      </h3>
                    </div>
                    <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 p-2 min-h-[220px] flex items-center justify-center">
                      <img
                        src={getImageUrl(data.ruta_vibracion, imageSalt)}
                        alt="Detección de Anomalías Vibración"
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Dataframe Tables Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Temp Anomalies Table */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                      Anomalías Temperatura
                    </h4>
                    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider z-10">
                          <tr>
                            <th className="px-4 py-2.5">Tiempo</th>
                            <th className="px-4 py-2.5 text-orange-400">
                              Temperatura
                            </th>
                            <th className="px-4 py-2.5">Vibración</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {data.anomalias_temperatura.length > 0 ? (
                            data.anomalias_temperatura.map((row, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-slate-900/40 transition-colors"
                              >
                                <td className="px-4 py-2 font-mono text-slate-300">
                                  {row.Tiempo}s
                                </td>
                                <td className="px-4 py-2 font-bold text-orange-400">
                                  {row.Temperatura}°C
                                </td>
                                <td className="px-4 py-2 text-slate-400">
                                  {row.Vibracion} m/s²
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center py-6 text-slate-500 italic"
                              >
                                No se detectaron anomalías
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Vib Anomalies Table */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                      Anomalías Vibración
                    </h4>
                    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-900 sticky top-0 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider z-10">
                          <tr>
                            <th className="px-4 py-2.5">Tiempo</th>
                            <th className="px-4 py-2.5">Temperatura</th>
                            <th className="px-4 py-2.5 text-purple-400">
                              Vibración
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {data.anomalias_vibracion.length > 0 ? (
                            data.anomalias_vibracion.map((row, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-slate-900/40 transition-colors"
                              >
                                <td className="px-4 py-2 font-mono text-slate-300">
                                  {row.Tiempo}s
                                </td>
                                <td className="px-4 py-2 text-slate-400">
                                  {row.Temperatura}°C
                                </td>
                                <td className="px-4 py-2 font-bold text-purple-400">
                                  {row.Vibracion} m/s²
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center py-6 text-slate-500 italic"
                              >
                                No se detectaron anomalías
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
