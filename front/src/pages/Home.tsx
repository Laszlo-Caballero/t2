import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { api } from "../utils/api";
import { useUtils } from "../context/UtilsProvider";
import { getImageUrl } from "../utils/image";
import type { ParteAData } from "../interface/parte-a.interface";

export default function Home() {
  const { setData } = useUtils();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await api.get("/partea");
      return res.data as ParteAData;
    },
  });

  const [imageSalt, setImageSalt] = useState(() => Date.now());

  // Update salt whenever backend returns new query data
  useEffect(() => {
    if (data) {
      setImageSalt(Date.now());
      setData(data);
    }
  }, [data]);

  const handleSync = async () => {
    await refetch();
    setImageSalt(Date.now());
  };

  // Render global animated loader while fetching
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
          Cargando datos de telemetría...
        </motion.p>
      </div>
    );
  }

  // Render a detailed connection error state with retry option
  if (isError || !data) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-red-950/10 border border-red-900/30 rounded-2xl max-w-xl mx-auto my-auto shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mb-6 border border-red-500/20">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">
          Error de Sincronización
        </h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          No se pudieron recuperar los registros del servidor. Por favor
          verifica que el backend esté activo en{" "}
          <code className="text-indigo-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded text-xs">
            http://localhost:8000
          </code>
          .
        </p>
        <button
          onClick={handleSync}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  // Calculate statistics based on fetched datos
  const datos = data.datos || [];
  const totalRecords = datos.length;

  const avgTemp =
    totalRecords > 0
      ? (
          datos.reduce((acc, curr) => acc + curr.Temperatura, 0) / totalRecords
        ).toFixed(1)
      : "0.0";

  const avgHumidity =
    totalRecords > 0
      ? (
          datos.reduce((acc, curr) => acc + curr.Humedad, 0) / totalRecords
        ).toFixed(1)
      : "0.0";

  const maxVibration =
    totalRecords > 0
      ? Math.max(...datos.map((d) => d.Vibracion)).toFixed(2)
      : "0.00";

  const activeOcupacion =
    totalRecords > 0 ? datos[totalRecords - 1].Ocupacion : 0;

  return (
    <div className="space-y-6 flex flex-col pb-8">
      {/* View Sub-Header / Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <button
          onClick={handleSync}
          className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-slate-700/80"
        >
          <svg
            className="w-4 h-4 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"
            />
          </svg>
          Sincronizar Sensores
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temp KPI */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between shadow-lg"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">
              Temperatura Promedio
            </span>
            <div className="text-2xl font-bold text-white tracking-tight">
              {avgTemp} <span className="text-indigo-400 text-lg">°C</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Humidity KPI */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between shadow-lg"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">
              Humedad Promedio
            </span>
            <div className="text-2xl font-bold text-white tracking-tight">
              {avgHumidity} <span className="text-indigo-400 text-lg">%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Vib KPI */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between shadow-lg"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">
              Vibración Máxima
            </span>
            <div className="text-2xl font-bold text-white tracking-tight">
              {maxVibration}{" "}
              <span className="text-indigo-400 text-sm">m/s²</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Occupancy KPI */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between shadow-lg"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">
              Estado de Ocupación
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${activeOcupacion === 1 ? "bg-red-500 animate-ping" : "bg-emerald-500"}`}
              />
              <div className="text-xl font-bold text-white tracking-tight">
                {activeOcupacion === 1 ? "Ocupado" : "Libre"}
              </div>
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              activeOcupacion === 1
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Backend Generated Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex flex-col shadow-lg space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-sm font-bold text-slate-100">
              Tendencia de Temperatura
            </h3>
          </div>
          <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 flex items-center justify-center p-2 min-h-[220px]">
            {data.ruta_temperatura ? (
              <img
                src={getImageUrl(data.ruta_temperatura, imageSalt)}
                alt="Gráfico de Temperatura"
                className="w-full h-auto object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80";
                }}
              />
            ) : (
              <span className="text-xs text-slate-500 italic">
                No hay gráfico de temperatura disponible
              </span>
            )}
          </div>
        </motion.div>

        {/* Vibration Chart */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex flex-col shadow-lg space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <h3 className="text-sm font-bold text-slate-100">
              Análisis de Vibración
            </h3>
          </div>
          <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 flex items-center justify-center p-2 min-h-[220px]">
            {data.ruta_vibracion ? (
              <img
                src={getImageUrl(data.ruta_vibracion, imageSalt)}
                alt="Gráfico de Vibración"
                className="w-full h-auto object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80";
                }}
              />
            ) : (
              <span className="text-xs text-slate-500 italic">
                No hay gráfico de vibración disponible
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Telemetry Data Table Section */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm flex flex-col shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <h3 className="text-sm font-bold text-slate-100">
              Registros de Telemetría Recientes
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold bg-slate-800/50 border border-slate-700/30 px-2.5 py-1 rounded-full">
            {totalRecords} Muestras
          </span>
        </div>

        {/* Scrollable table container */}
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
              <tr>
                <th className="px-5 py-3">Tiempo (s)</th>
                <th className="px-5 py-3">Temperatura (°C)</th>
                <th className="px-5 py-3">Humedad (%)</th>
                <th className="px-5 py-3">Vibración (m/s²)</th>
                <th className="px-5 py-3">Ocupación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {datos.length > 0 ? (
                datos.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-5 py-3 text-slate-300 font-mono font-medium">
                      {row.Tiempo}s
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-200">
                      <span className="text-orange-400">{row.Temperatura}</span>{" "}
                      °C
                    </td>
                    <td className="px-5 py-3 text-slate-200">
                      <span className="text-cyan-400">{row.Humedad}</span> %
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-300">
                      <span className="text-purple-400">
                        {row.Vibracion.toFixed(3)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          row.Ocupacion === 1
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${row.Ocupacion === 1 ? "bg-red-500" : "bg-emerald-500"}`}
                        />
                        {row.Ocupacion === 1 ? "Ocupado" : "Libre"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-slate-500 italic"
                  >
                    No se encontraron registros de telemetría disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
