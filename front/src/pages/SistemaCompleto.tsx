import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { api } from "../utils/api";
import { getImageUrl } from "../utils/image";
import type {
  PedidosInputRequest,
  RegistroFlexible,
  SistemaCompletoRequest,
  SistemaCompletoResponse,
} from "../interface/sistema-completo.interface";

interface PedidoRow {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
}

const defaultRows: PedidoRow[] = [
  {
    Pedido: "P001",
    Prioridad: 9,
    Tiempo_espera: 15,
    Distancia: 12,
    Paquete_danado: false,
    Zona_saturada: false,
  },
  {
    Pedido: "P002",
    Prioridad: 6,
    Tiempo_espera: 40,
    Distancia: 8,
    Paquete_danado: false,
    Zona_saturada: false,
  },
  {
    Pedido: "P003",
    Prioridad: 8,
    Tiempo_espera: 25,
    Distancia: 20,
    Paquete_danado: true,
    Zona_saturada: false,
  },
  {
    Pedido: "P004",
    Prioridad: 10,
    Tiempo_espera: 10,
    Distancia: 6,
    Paquete_danado: false,
    Zona_saturada: true,
  },
  {
    Pedido: "P005",
    Prioridad: 7,
    Tiempo_espera: 35,
    Distancia: 10,
    Paquete_danado: false,
    Zona_saturada: false,
  },
];

function formatValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "number")
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return value;
}

function getBadgeStyle(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("alta") || normalized.includes("crit")) {
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  }
  if (normalized.includes("riesgo") || normalized.includes("alert")) {
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }
  if (
    normalized.includes("baja") ||
    normalized.includes("libre") ||
    normalized.includes("normal")
  ) {
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  }
  return "bg-slate-900/70 text-slate-300 border border-slate-800";
}

function GenericTable({
  title,
  records,
}: {
  title: string;
  records: RegistroFlexible[];
}) {
  const columns = records.length > 0 ? Object.keys(records[0]) : [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/35 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-[10px] font-semibold text-slate-500">
          {records.length} registros
        </span>
      </div>
      {records.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-500">
          Sin datos para mostrar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2 whitespace-nowrap">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {records.map((record, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-slate-950/40 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-3 py-2 text-slate-300 whitespace-nowrap"
                    >
                      {formatValue(record[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function SistemaCompleto() {
  const [seed, setSeed] = useState(10);
  const [registros, setRegistros] = useState(120);
  const [tempLimite, setTempLimite] = useState(32);
  const [vibLimite, setVibLimite] = useState(5);
  const [humLimite, setHumLimite] = useState(70);
  const [ocuLimite, setOcuLimite] = useState(85);
  const [rows, setRows] = useState<PedidoRow[]>(defaultRows);

  const mutation = useMutation({
    mutationKey: ["sistema-completo"],
    mutationFn: async (payload: SistemaCompletoRequest) => {
      const res = await api.post("/sistemacompleto", payload);
      return res.data as SistemaCompletoResponse;
    },
  });

  const pedidosPayload: PedidosInputRequest = useMemo(
    () => ({
      Pedido: rows.map((row) => row.Pedido),
      Prioridad: rows.map((row) => row.Prioridad),
      Tiempo_espera: rows.map((row) => row.Tiempo_espera),
      Distancia: rows.map((row) => row.Distancia),
      Paquete_danado: rows.map((row) => row.Paquete_danado),
      Zona_saturada: rows.map((row) => row.Zona_saturada),
    }),
    [rows],
  );

  const handleCellChange = (
    index: number,
    field: keyof PedidoRow,
    value: string | number | boolean,
  ) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleAddRow = () => {
    setRows((current) => {
      const nextIndex = current.length + 1;
      return [
        ...current,
        {
          Pedido: `P${nextIndex.toString().padStart(3, "0")}`,
          Prioridad: 5,
          Tiempo_espera: 20,
          Distancia: 10,
          Paquete_danado: false,
          Zona_saturada: false,
        },
      ];
    });
  };

  const handleRemoveRow = (index: number) => {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleReset = () => {
    setRows(defaultRows);
    setSeed(10);
    setRegistros(120);
    setTempLimite(32);
    setVibLimite(5);
    setHumLimite(70);
    setOcuLimite(85);
  };

  const handleRun = () => {
    mutation.mutate({
      seed,
      registros,
      temp_limite: tempLimite,
      vib_limite: vibLimite,
      hum_limite: humLimite,
      ocu_limite: ocuLimite,
      pedidos: pedidosPayload,
    });
  };

  const data = mutation.data;

  return (
    <div className="space-y-6 flex flex-col pb-12">
      <div className="flex flex-col gap-4 pb-5 border-b border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
              Panel Integrado Final
            </p>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Sistema Completo
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mutation.isPending && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                Ejecutando sistema completo...
              </div>
            )}
            {data && !mutation.isPending && (
              <span className="text-xs px-3.5 py-1.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Sistema procesado correctamente
              </span>
            )}
          </div>
        </div>
        <p className="text-slate-400 text-sm max-w-4xl leading-relaxed">
          Esta es la pantalla final del proyecto. Consolida la simulación, el
          análisis de señales, la orquestación multiagente y la optimización
          logística en una sola ejecución del backend.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Parámetros de Ejecución
              </h3>
              <span className="text-[10px] font-semibold text-slate-500">
                POST /sistemacompleto
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1.5">
                <span className="text-slate-400 font-semibold">Seed</span>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-slate-400 font-semibold">Registros</span>
                <input
                  type="number"
                  value={registros}
                  onChange={(e) => setRegistros(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-slate-400 font-semibold">
                  Límite temperatura
                </span>
                <input
                  type="number"
                  value={tempLimite}
                  onChange={(e) => setTempLimite(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-slate-400 font-semibold">
                  Límite vibración
                </span>
                <input
                  type="number"
                  value={vibLimite}
                  onChange={(e) => setVibLimite(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-slate-400 font-semibold">
                  Límite humedad
                </span>
                <input
                  type="number"
                  value={humLimite}
                  onChange={(e) => setHumLimite(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-slate-400 font-semibold">
                  Límite ocupación
                </span>
                <input
                  type="number"
                  value={ocuLimite}
                  onChange={(e) => setOcuLimite(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">
                  Pedidos de despacho
                </span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  Agregar pedido
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-900">
                    <tr>
                      <th className="px-2.5 py-2 w-16">Pedido</th>
                      <th className="px-2.5 py-2 w-16">Prioridad</th>
                      <th className="px-2.5 py-2 w-20">Espera</th>
                      <th className="px-2.5 py-2 w-20">Distancia</th>
                      <th className="px-2.5 py-2 text-center w-14">Dañado</th>
                      <th className="px-2.5 py-2 text-center w-14">Saturado</th>
                      <th className="px-2.5 py-2 text-center w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {rows.map((row, idx) => (
                      <tr
                        key={row.Pedido + idx}
                        className="hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.Pedido}
                            onChange={(e) =>
                              handleCellChange(idx, "Pedido", e.target.value)
                            }
                            className="w-12 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={row.Prioridad}
                            onChange={(e) =>
                              handleCellChange(
                                idx,
                                "Prioridad",
                                Number(e.target.value),
                              )
                            }
                            className="w-12 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            value={row.Tiempo_espera}
                            onChange={(e) =>
                              handleCellChange(
                                idx,
                                "Tiempo_espera",
                                Number(e.target.value),
                              )
                            }
                            className="w-14 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            value={row.Distancia}
                            onChange={(e) =>
                              handleCellChange(
                                idx,
                                "Distancia",
                                Number(e.target.value),
                              )
                            }
                            className="w-14 bg-slate-900 text-slate-200 border border-slate-850 px-1 py-0.5 rounded focus:outline-none focus:border-indigo-500 font-mono text-[11px] text-center"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.Paquete_danado}
                            onChange={(e) =>
                              handleCellChange(
                                idx,
                                "Paquete_danado",
                                e.target.checked,
                              )
                            }
                            className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.Zona_saturada}
                            onChange={(e) =>
                              handleCellChange(
                                idx,
                                "Zona_saturada",
                                e.target.checked,
                              )
                            }
                            className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 hover:bg-slate-900 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={mutation.isPending}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/35 border border-indigo-500/20 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {mutation.isPending
                  ? "Procesando..."
                  : "Ejecutar Sistema Completo"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 bg-slate-900/50 cursor-pointer"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {mutation.isPending && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-xl min-h-[420px] flex flex-col items-center justify-center text-center"
              >
                <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/20 border-b-indigo-500/10 border-l-indigo-500/40"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute w-16 h-16 rounded-full border-4 border-t-purple-500/10 border-r-purple-500 border-b-purple-500/40 border-l-purple-500/20"
                    animate={{ rotate: -360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "linear",
                    }}
                  />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
                </div>
                <h4 className="mt-6 text-base font-bold text-white">
                  Procesando sistema completo
                </h4>
                <p className="text-slate-500 text-xs max-w-sm mt-2">
                  Se están generando la simulación, los análisis de señales, el
                  razonamiento multiagente y la optimización logística.
                </p>
              </motion.div>
            )}

            {mutation.isError && !mutation.isPending && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-2xl bg-red-950/15 border border-red-900/30 backdrop-blur-sm shadow-xl min-h-[420px] flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
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
                <h4 className="text-lg font-bold text-white mb-2">
                  Fallo en el sistema completo
                </h4>
                <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">
                  No se pudo procesar la solicitud. Verifica que FastAPI esté
                  activo en http://localhost:8000 y que el endpoint
                  `/sistemacompleto` esté disponible.
                </p>
                <button
                  type="button"
                  onClick={handleRun}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Reintentar
                </button>
              </motion.div>
            )}

            {!data && !mutation.isPending && !mutation.isError && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-2xl bg-slate-900/10 border border-slate-850 backdrop-blur-sm shadow-xl min-h-[420px] flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400/60 mb-5 animate-pulse">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-slate-300">
                  Pantalla final lista
                </h4>
                <p className="text-slate-500 text-xs max-w-sm mt-1 leading-relaxed">
                  Ajusta parámetros y pedidos, luego ejecuta el sistema completo
                  para ver la salida consolidada.
                </p>
              </motion.div>
            )}

            {data && !mutation.isPending && !mutation.isError && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                      Simulación
                    </span>
                    <div className="text-lg font-extrabold text-white">
                      {data.simulacion.datos.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                      Anomalías
                    </span>
                    <div className="text-lg font-extrabold text-white">
                      {data.analisis_senales.anomalias_temperatura.length +
                        data.analisis_senales.anomalias_vibracion.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                      Pedidos válidos
                    </span>
                    <div className="text-lg font-extrabold text-white">
                      {data.optimizacion.pedidos_validos.length}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                      Tiempo concurrente
                    </span>
                    <div className="text-lg font-extrabold text-white">
                      {data.multiagente.tiempo_concurrente_segundos.toFixed(2)}s
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Datos actuales
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        multiagente
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {Object.entries(data.multiagente.datos_actuales).map(
                        ([key, value]: [string, any]) => (
                          <div
                            key={key}
                            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
                          >
                            <span className="block text-slate-500 uppercase tracking-wider text-[10px] mb-1">
                              {key}
                            </span>
                            <span className="text-slate-200 font-semibold">
                              {formatValue(value)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Mejor pedido
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        optimización
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-2">
                      {data.optimizacion.mejor_pedido_a_despachar ? (
                        Object.entries(
                          data.optimizacion.mejor_pedido_a_despachar,
                        ).map(([key, value]: [string, any]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-slate-500 uppercase tracking-wider text-[10px]">
                              {key}
                            </span>
                            <span className="text-slate-200 font-semibold text-right">
                              {formatValue(value)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500">
                          No hay pedido recomendado
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/35 backdrop-blur-sm shadow-lg p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Gráfica temperatura
                    </h3>
                    <img
                      src={getImageUrl(
                        data.simulacion.ruta_grafica_temperatura,
                        Date.now(),
                      )}
                      alt="Gráfica de temperatura"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950"
                    />
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/35 backdrop-blur-sm shadow-lg p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Gráfica vibración
                    </h3>
                    <img
                      src={getImageUrl(
                        data.simulacion.ruta_grafica_vibracion,
                        Date.now(),
                      )}
                      alt="Gráfica de vibración"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <GenericTable
                    title="Anomalías de temperatura"
                    records={data.analisis_senales.anomalias_temperatura}
                  />
                  <GenericTable
                    title="Anomalías de vibración"
                    records={data.analisis_senales.anomalias_vibracion}
                  />
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Hechos, riesgos y recomendaciones
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      multiagente
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.multiagente.hechos_detectados.map((fact: string) => (
                      <span
                        key={fact}
                        className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded border ${getBadgeStyle(fact)}`}
                      >
                        {fact.replace(/_/g, " ")}
                      </span>
                    ))}
                    {data.multiagente.hechos_detectados.length === 0 && (
                      <span className="text-sm text-slate-500 italic">
                        No se detectaron hechos.
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(data.multiagente.riesgos).map(([risk, val]: [string, number]) => (
                      <span
                        key={risk}
                        className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded border ${getBadgeStyle(risk)}`}
                      >
                        {risk.replace(/_/g, " ")} ({Math.round(val * 100)}%)
                      </span>
                    ))}
                    {Object.keys(data.multiagente.riesgos).length === 0 && (
                      <span className="text-sm text-slate-500 italic">
                        Sin riesgos reportados.
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {data.multiagente.recomendaciones.map((rec: string) => (
                      <div
                        key={rec}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200"
                      >
                        {rec}
                      </div>
                    ))}
                    {data.multiagente.recomendaciones.length === 0 && (
                      <span className="text-sm text-slate-500 italic">
                        Sin recomendaciones.
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                  <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">
                      multiagent_run.log
                    </span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="max-h-[320px] overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1.5">
                    {data.multiagente.logs.map((line: string, index: number) => (
                      <div key={`${line}-${index}`} className="flex">
                        <span className="w-10 flex-shrink-0 text-slate-700 select-none">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="text-emerald-400/90 whitespace-pre-wrap">
                          {line}
                        </span>
                      </div>
                    ))}
                    {data.multiagente.logs.length === 0 && (
                      <div className="text-slate-500">
                        Sin registros de ejecución.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <GenericTable
                    title="Todos los pedidos"
                    records={data.optimizacion.todos_los_pedidos}
                  />
                  <GenericTable
                    title="Pedidos válidos"
                    records={data.optimizacion.pedidos_validos}
                  />
                  <GenericTable
                    title="Orden óptimo"
                    records={data.optimizacion.orden_optimo}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
