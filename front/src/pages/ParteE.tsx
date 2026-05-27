import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../utils/api";
import { motion } from "motion/react";
import type { ParteERes } from "../interface/parte-e.interface";

// Utility helpers for styling badges depending on the conclusion category
const getConclusionBadgeStyle = (conclusion: string) => {
  switch (conclusion) {
    case "detener_maquinaria":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "riesgo_mecanico":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "alerta_ambiental":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "despacho_inmediato":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "reubicar_carga":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "revision_manual":
      return "bg-slate-500/10 text-slate-300 border border-slate-700/50";
    default:
      return "bg-slate-800 text-slate-400 border border-slate-700/30";
  }
};

const getActionBadgeStyle = (action: string) => {
  if (action.includes("Detener") || action.includes("Apagar")) {
    return "bg-red-500 text-white shadow-lg shadow-red-500/20";
  }
  if (action.includes("Revisar") || action.includes("Inspeccionar")) {
    return "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold";
  }
  if (action.includes("Activar") || action.includes("Reducir")) {
    return "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold";
  }
  if (action.includes("Mover") || action.includes("Despejar") || action.includes("Priorizar")) {
    return "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20";
  }
  return "bg-slate-800 text-slate-200 border border-slate-700";
};

// Framer motion animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
} as const;

export function ParteE() {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["parte-e"],
    queryFn: async () => {
      const res = await api.get("partee");
      return res.data as ParteERes[];
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
          Cargando matriz de conocimiento...
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
        <h2 className="text-2xl font-extrabold text-white mb-2">Error al recuperar Matriz</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          No se pudieron recuperar las reglas del servidor. Por favor, verifica el estado del backend.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50"
        >
          Reintentar Carga
        </button>
      </div>
    );
  }

  // Filter and search logic
  const filteredData = data.filter((row) => {
    // Text search matching (hecho, regla, conclusion, accion)
    const matchesSearch =
      row.Hecho.toLowerCase().includes(search.toLowerCase()) ||
      row["Regla aplicada"].toLowerCase().includes(search.toLowerCase()) ||
      row.Conclusión.toLowerCase().includes(search.toLowerCase()) ||
      row["Acción recomendada"].toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Category button filter match
    if (filter === "Todos") return true;
    if (filter === "Ambiental") return row.Conclusión === "alerta_ambiental";
    if (filter === "Crítico") return row.Conclusión === "detener_maquinaria" || row.Conclusión === "riesgo_mecanico";
    if (filter === "Logística") return ["reubicar_carga", "despacho_inmediato", "revision_manual"].includes(row.Conclusión);

    return true;
  });

  return (
    <div className="space-y-6 flex flex-col pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Ingeniería del Conocimiento
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte E: Representación del Conocimiento
          </h2>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-slate-700/80"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Sincronizar Reglas
        </button>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Esta matriz tabular representa el conocimiento estructurado del sistema experto. 
        Mapea hechos operacionales específicos a reglas de inferencia para llegar a conclusiones lógicas y prescribir recomendaciones en tiempo de ejecución.
      </p>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-slate-900/20 border border-slate-850">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["Todos", "Ambiental", "Crítico", "Logística"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border ${
                filter === cat
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10"
                  : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar regla, hecho o acción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-medium placeholder-slate-600"
          />
          <svg className="w-4 h-4 text-slate-600 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabular Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <h3 className="text-sm font-bold text-slate-100">Matriz de Inferencia del Sistema</h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold bg-slate-800/50 border border-slate-700/30 px-2.5 py-1 rounded-full">
            {filteredData.length} Mapeos cargados
          </span>
        </div>

        {/* Knowledge Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Hecho Iniciador (Fact)</th>
                <th className="px-5 py-3.5">Regla de Inferencia</th>
                <th className="px-5 py-3.5">Conclusión Deducida</th>
                <th className="px-5 py-3.5">Acción Recomendada</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-850"
            >
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    variants={itemVariants}
                    className="hover:bg-slate-900/30 transition-colors"
                  >
                    {/* Hecho */}
                    <td className="px-5 py-4 font-mono font-medium text-indigo-400">
                      <span className="bg-indigo-950/30 px-2.5 py-1 rounded border border-indigo-900/30">
                        {row.Hecho}
                      </span>
                    </td>

                    {/* Regla Aplicada */}
                    <td className="px-5 py-4 text-slate-300 font-medium leading-relaxed max-w-[280px]">
                      {row["Regla aplicada"]}
                    </td>

                    {/* Conclusion */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${getConclusionBadgeStyle(row.Conclusión)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {row.Conclusión}
                      </span>
                    </td>

                    {/* Accion recomendada */}
                    <td className="px-5 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-semibold text-center tracking-wide ${getActionBadgeStyle(row["Acción recomendada"])}`}>
                        {row["Acción recomendada"]}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-500 italic text-sm">
                    No se encontraron registros de conocimiento coincidentes con los filtros actuales.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

