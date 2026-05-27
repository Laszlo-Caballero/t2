import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";
import type { ParteKRes } from "../interface/parte-k.interface";

interface PedidoRow {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
}

const defaultInitialRows: PedidoRow[] = [
  { Pedido: "P001", Prioridad: 9, Tiempo_espera: 15, Distancia: 12, Paquete_danado: false, Zona_saturada: false },
  { Pedido: "P002", Prioridad: 6, Tiempo_espera: 40, Distancia: 8, Paquete_danado: false, Zona_saturada: false },
  { Pedido: "P003", Prioridad: 8, Tiempo_espera: 25, Distancia: 20, Paquete_danado: true, Zona_saturada: false },
  { Pedido: "P004", Prioridad: 10, Tiempo_espera: 10, Distancia: 6, Paquete_danado: false, Zona_saturada: true },
  { Pedido: "P005", Prioridad: 7, Tiempo_espera: 35, Distancia: 10, Paquete_danado: false, Zona_saturada: false }
];

export function ParteK() {
  const [rows, setRows] = useState<PedidoRow[]>(defaultInitialRows);
  const [activeTab, setActiveTab] = useState<"evaluacion" | "validos" | "priorizados">("priorizados");

  // POST Mutation for partek
  const mutation = useMutation({
    mutationKey: ["parte-k-post"],
    mutationFn: async (payload: {
      Pedido: string[];
      Prioridad: number[];
      Tiempo_espera: number[];
      Distancia: number[];
      Paquete_danado: boolean[];
      Zona_saturada: boolean[];
    }) => {
      const res = await api.post("partek", payload);
      return res.data as ParteKRes;
    },
  });

  // Run initial default optimization on mount
  useEffect(() => {
    handleOptimize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCellChange = (index: number, field: keyof PedidoRow, value: any) => {
    setRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleDeleteRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = () => {
    setRows(prev => {
      const nextIndex = prev.length + 1;
      const name = `P${nextIndex.toString().padStart(3, "0")}`;
      return [
        ...prev,
        {
          Pedido: name,
          Prioridad: 5,
          Tiempo_espera: 20,
          Distancia: 10,
          Paquete_danado: false,
          Zona_saturada: false
        }
      ];
    });
  };

  const handleOptimize = () => {
    if (rows.length === 0) return;

    // Convert row-based state into column-based lists
    const payload = {
      Pedido: rows.map(r => r.Pedido),
      Prioridad: rows.map(r => r.Prioridad),
      Tiempo_espera: rows.map(r => r.Tiempo_espera),
      Distancia: rows.map(r => r.Distancia),
      Paquete_danado: rows.map(r => r.Paquete_danado),
      Zona_saturada: rows.map(r => r.Zona_saturada)
    };

    mutation.mutate(payload);
  };

  const restoreDefaults = () => {
    setRows(defaultInitialRows);
  };

  return (
    <div className="space-y-6 flex flex-col pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Optimización y Logística
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte K: Optimización de Pedidos y Selección de Alternativas
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {mutation.isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Calculando Alternativas...
            </div>
          )}
          {mutation.data && !mutation.isPending && (
            <span className="text-xs px-3.5 py-1.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Alternativas Optimizadas
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Este módulo implementa un algoritmo de despacho prioritario multi-criterio. 
        Ajusta y edita las propiedades de los pedidos en cola. El sistema filtrará automáticamente aquellos 
        bloqueados por restricciones (paquetes dañados o zonas saturadas) y calculará el puntaje de optimización basado en 
        prioridad, tiempo de espera y distancia.
      </p>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Editable Grid (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Edición de Cola de Pedidos
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={restoreDefaults}
                  className="text-[10px] text-slate-400 hover:text-slate-300 font-semibold cursor-pointer"
                >
                  Restaurar valores
                </button>
              </div>
            </div>

            {/* Editable Table */}
            <div className="w-full overflow-x-auto rounded-xl border border-slate-900 bg-slate-950">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900">
                  <tr>
                    <th className="px-3 py-3 w-16">Pedido</th>
                    <th className="px-3 py-3 w-16">Prioridad</th>
                    <th className="px-3 py-3 w-20">Espera (min)</th>
                    <th className="px-3 py-3 w-20">Distancia (km)</th>
                    <th className="px-3 py-3 w-16 text-center">Dañado</th>
                    <th className="px-3 py-3 w-16 text-center">Saturado</th>
                    <th className="px-3 py-3 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                      {/* Name */}
                      <td className="px-2.5 py-2 font-mono">
                        <input
                          type="text"
                          value={row.Pedido}
                          onChange={(e) => handleCellChange(idx, "Pedido", e.target.value)}
                          className="w-12 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                        />
                      </td>

                      {/* Prioridad */}
                      <td className="px-2.5 py-2">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={row.Prioridad}
                          onChange={(e) => handleCellChange(idx, "Prioridad", Number(e.target.value))}
                          className="w-12 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                        />
                      </td>

                      {/* Wait Time */}
                      <td className="px-2.5 py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.Tiempo_espera}
                          onChange={(e) => handleCellChange(idx, "Tiempo_espera", Number(e.target.value))}
                          className="w-14 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                        />
                      </td>

                      {/* Distance */}
                      <td className="px-2.5 py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.Distancia}
                          onChange={(e) => handleCellChange(idx, "Distancia", Number(e.target.value))}
                          className="w-14 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                        />
                      </td>

                      {/* Paquete danado */}
                      <td className="px-2.5 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={row.Paquete_danado}
                          onChange={(e) => handleCellChange(idx, "Paquete_danado", e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* Zona saturada */}
                      <td className="px-2.5 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={row.Zona_saturada}
                          onChange={(e) => handleCellChange(idx, "Zona_saturada", e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* Delete button */}
                      <td className="px-2.5 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1 hover:bg-slate-900 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-500 italic">
                        No hay pedidos en cola. Haz clic en "Agregar Pedido".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddRow}
                className="px-4 py-2.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Agregar Pedido
              </button>

              <button
                type="button"
                onClick={handleOptimize}
                disabled={mutation.isPending || rows.length === 0}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-650 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 cursor-pointer flex items-center justify-center gap-2 border border-indigo-500/20"
              >
                {mutation.isPending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculando...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Enviar y Optimizar Pedidos
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Optimization Results (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Best Option Card */}
          <AnimatePresence mode="wait">
            {mutation.data && !mutation.isPending && (
              <motion.div
                key="best-alternative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/20 to-purple-950/15 border border-indigo-500/20 backdrop-blur-sm shadow-xl space-y-4"
              >
                <div className="border-b border-indigo-500/20 pb-2.5 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Recomendación de Despacho
                  </span>
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-400 bg-slate-900/60 border border-slate-800/80 px-2 py-0.5 rounded">
                    Mejor Alternativa
                  </span>
                </div>

                {mutation.data.mejor_alternativa ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {mutation.data.mejor_alternativa.Pedido}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Satisface las restricciones de faja/zona y posee el mayor puntaje de prioridad.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/10 text-center font-mono flex-shrink-0">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider mb-0.5">Puntaje</span>
                      <span className="text-lg font-black text-indigo-400">
                        {mutation.data.mejor_alternativa.Puntaje.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-2 text-slate-500">
                    <svg className="w-8 h-8 mx-auto text-red-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs font-semibold text-slate-400">No hay alternativas válidas disponibles</p>
                    <p className="text-[9px]">Todos los pedidos de la cola están dañados o bloqueados en zonas saturadas.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Tab Table */}
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-5">
            {/* Tabs Header */}
            <div className="flex gap-1.5 border-b border-slate-800/60 pb-3 overflow-x-auto scrollbar-none">
              {(["priorizados", "validos", "evaluacion"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer flex-shrink-0 ${
                    activeTab === tab
                      ? "bg-slate-900 border-slate-700 text-white font-black"
                      : "bg-slate-950/40 text-slate-500 border-slate-950 hover:text-slate-400 hover:bg-slate-950/80"
                  }`}
                >
                  {tab === "evaluacion" ? "Evaluación" : tab === "validos" ? "Válidos" : "Ordenados"}
                </button>
              ))}
            </div>

            {/* List Panels */}
            <div className="relative min-h-[180px]">
              {mutation.isPending && (
                <div className="absolute inset-0 bg-slate-950/10 backdrop-blur-[1px] flex flex-col justify-center items-center z-10 rounded-xl">
                  <div className="w-6 h-6 rounded-full border-2 border-t-indigo-500 border-r-indigo-500/20 border-b-indigo-500/10 border-l-indigo-500/30 animate-spin" />
                </div>
              )}

              {mutation.data ? (
                <AnimatePresence mode="wait">
                  {/* Tab Render */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-2.5"
                  >
                    {/* Render table based on tab */}
                    <div className="w-full overflow-hidden rounded-xl border border-slate-900 bg-slate-950">
                      <table className="w-full border-collapse text-left text-[11px]">
                        <thead className="bg-slate-900 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900">
                          <tr>
                            <th className="px-3.5 py-2.5">Pedido</th>
                            <th className="px-3.5 py-2.5 text-center">Puntaje</th>
                            <th className="px-3.5 py-2.5 text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {(activeTab === "evaluacion"
                            ? mutation.data.df_pedidos
                            : activeTab === "validos"
                            ? mutation.data.pedidos_validos
                            : mutation.data.pedidos_ordenados
                          ).map((item, idx) => {
                            const isBlocked = item.Paquete_danado || item.Zona_saturada;
                            return (
                              <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                                <td className="px-3.5 py-3 font-mono font-bold text-slate-350">{item.Pedido}</td>
                                <td className="px-3.5 py-3 text-center font-mono font-bold text-indigo-400">
                                  {item.Puntaje.toFixed(1)}
                                </td>
                                <td className="px-3.5 py-3 text-center">
                                  {isBlocked ? (
                                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded">
                                      Bloqueado
                                    </span>
                                  ) : (
                                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">
                                      Válido
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {(activeTab === "evaluacion"
                            ? mutation.data.df_pedidos
                            : activeTab === "validos"
                            ? mutation.data.pedidos_validos
                            : mutation.data.pedidos_ordenados
                          ).length === 0 && (
                            <tr>
                              <td colSpan={3} className="text-center py-8 text-slate-500 italic">
                                No hay registros disponibles para mostrar.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-550 italic text-xs">
                  Ajusta la cola a la izquierda y presiona "Enviar y Optimizar Pedidos" para calcular la tabla.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
