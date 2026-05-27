import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";
import { getImageUrl } from "../utils/image";
import type { ParetGRes } from "../interface/parte-g.interface";

// Utility styling helper for node/proposition badges
const getSymbolBadgeStyle = (symbol: string) => {
  const code = symbol.trim().toUpperCase();
  if (code.startsWith("E") || code.includes("TEMP") || code.includes("VIB")) {
    return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
  }
  if (code.startsWith("H") || code.includes("HECHO")) {
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  }
  if (code.startsWith("R") || code.includes("REC") || code.includes("ACTION")) {
    return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
  }
  return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
};

export function ParteG() {
  const [imageSalt, setImageSalt] = useState(() => Date.now());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"proposiciones" | "reglas">("proposiciones");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // GET Grafo & Proposiciones
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["parte-g"],
    queryFn: async () => {
      const res = await api.get("parteg");
      return res.data as ParetGRes;
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
          Cargando grafo de inferencia...
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
        <h2 className="text-2xl font-extrabold text-white mb-2">Error al Cargar Grafo</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          No se pudieron recuperar las proposiciones y reglas de la base de conocimiento. Verifica que el backend esté en ejecución.
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

  // Filter propositions and rules based on search
  const filteredProposiciones = data.proposiciones.filter(
    (prop) =>
      prop.simbolo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReglas = data.reglas.filter(
    (rule) =>
      rule.origen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.destino.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.regla.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 flex flex-col pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Topología del Conocimiento
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte G: {data.titulo || "Consola del Grafo de Inferencia"}
          </h2>
        </div>
        <button
          onClick={handleSync}
          className="px-4 py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-slate-700"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
          </svg>
          Sincronizar Grafo
        </button>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Esta sección expone la representación topológica de la base de conocimiento. A través de un grafo dirigido 
        de deducción lógica, se asocian proposiciones atómicas y se visualizan los caminos de transición formados 
        por las reglas de inferencia.
      </p>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Graph Visualization (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                Grafo de Inferencia Visual
              </h3>
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Expandir vista
              </button>
            </div>

            <div
              onClick={() => setIsPreviewOpen(true)}
              className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/60 p-2 flex items-center justify-center min-h-[260px] cursor-pointer hover:border-slate-850 transition-colors group"
            >
              <img
                src={getImageUrl(data.ruta_grafo, imageSalt)}
                alt="Grafo de conocimiento"
                className="w-full h-auto object-contain rounded max-h-[350px] group-hover:scale-[1.015] transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 20l-5.447-2.724A2 2 0 012.5 15.485V5.196a2 2 0 011.053-1.76l6-3a2 2 0 011.894 0l6 3a2 2 0 011.053 1.76v10.289a2 2 0 01-1.053 1.76L12 20m0 0V9m0 11l-5.447-2.724A2 2 0 015.5 15.485V9m13 0l-5.447 2.724a2 2 0 01-1.894 0L6 9.362'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono text-center">
              Ruta: {data.ruta_grafo}
            </p>
          </div>
        </div>

        {/* Right Side: Tabbed Propositions & Rule Connections (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-5">
            
            {/* Tabs & Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/50 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("proposiciones")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                    activeTab === "proposiciones"
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-950/40 text-slate-400 border-slate-900 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  Proposiciones ({filteredProposiciones.length})
                </button>
                <button
                  onClick={() => setActiveTab("reglas")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                    activeTab === "reglas"
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/10"
                      : "bg-slate-950/40 text-slate-400 border-slate-900 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  Reglas de Transición ({filteredReglas.length})
                </button>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-60">
                <input
                  type="text"
                  placeholder="Buscar símbolo o texto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-medium placeholder-slate-650"
                />
                <svg className="w-4 h-4 text-slate-650 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* List panel */}
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                
                {/* Propositions Tab Panel */}
                {activeTab === "proposiciones" && (
                  <motion.div
                    key="tab-proposiciones"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="w-full overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/60">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900">
                          <tr>
                            <th className="px-4 py-3 w-28">Proposición</th>
                            <th className="px-4 py-3">Descripción / Significado Semántico</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {filteredProposiciones.length > 0 ? (
                            filteredProposiciones.map((prop, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                                <td className="px-4 py-3.5 font-mono font-bold">
                                  <span className={`px-2 py-0.5 rounded text-[11px] ${getSymbolBadgeStyle(prop.simbolo)}`}>
                                    {prop.simbolo}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-slate-300 font-medium leading-relaxed">
                                  {prop.descripcion}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center py-10 text-slate-500 italic">
                                No se encontraron proposiciones que coincidan con la búsqueda.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* Transition Rules Tab Panel */}
                {activeTab === "reglas" && (
                  <motion.div
                    key="tab-reglas"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
                      {filteredReglas.length > 0 ? (
                        filteredReglas.map((rule, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 transition-colors space-y-2.5"
                          >
                            {/* Connection node header */}
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${getSymbolBadgeStyle(rule.origen)}`}>
                                {rule.origen}
                              </span>
                              
                              {/* Glowing connection arrow */}
                              <svg className="w-5 h-4 text-slate-650" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>

                              <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${getSymbolBadgeStyle(rule.destino)}`}>
                                {rule.destino}
                              </span>

                              <span className="text-[9px] uppercase font-extrabold text-slate-500 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-full ml-auto">
                                Regla de Transición
                              </span>
                            </div>

                            {/* Transition details */}
                            <div className="p-3 rounded bg-slate-950 border border-slate-900/60 text-xs font-mono text-indigo-300 leading-normal">
                              <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider mb-1">
                                Lógica Aplicada:
                              </span>
                              {rule.regla}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-500 italic text-sm bg-slate-950/60 rounded-xl border border-slate-900">
                          No se encontraron reglas de transición coincidentes.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>

      {/* Image Preview Overlay Modal */}
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
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(data.ruta_grafo, imageSalt)}
                alt="Grafo de conocimiento ampliado"
                className="w-full h-auto object-contain max-h-[80vh] rounded-xl shadow-2xl border border-slate-800"
              />
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -top-10 right-0 text-slate-400 hover:text-white font-bold text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Cerrar vista
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
