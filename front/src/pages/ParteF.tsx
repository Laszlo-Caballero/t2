import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { motion, AnimatePresence } from "motion/react";
import type { ParteFRes } from "../interface/parte-f.interface";

// Utility styling for recommendation cards
const getRecomendacionStyle = (rec: string) => {
  const r = rec.toLowerCase();
  if (r.includes("detener") || r.includes("crítica")) {
    return {
      border: "border-red-500/30",
      bg: "bg-red-950/10",
      text: "text-red-400 border-red-500/20",
      icon: (
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: "Crítico",
    };
  }
  if (r.includes("riesgo") || r.includes("mecánico") || r.includes("fajas")) {
    return {
      border: "border-amber-500/30",
      bg: "bg-amber-950/10",
      text: "text-amber-400 border-amber-500/20",
      icon: (
        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      badge: "Riesgo Mecánico",
    };
  }
  if (r.includes("ambiental") || r.includes("ventilación")) {
    return {
      border: "border-blue-500/30",
      bg: "bg-blue-950/10",
      text: "text-blue-400 border-blue-500/20",
      icon: (
        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      badge: "Alerta Ambiental",
    };
  }
  if (r.includes("despacho") || r.includes("prioritario")) {
    return {
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/10",
      text: "text-emerald-400 border-emerald-500/20",
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
        </svg>
      ),
      badge: "Despacho",
    };
  }
  if (r.includes("reubicar") || r.includes("despejar") || r.includes("ruta")) {
    return {
      border: "border-purple-500/30",
      bg: "bg-purple-950/10",
      text: "text-purple-400 border-purple-500/20",
      icon: (
        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      badge: "Logística",
    };
  }
  if (r.includes("inspeccionar") || r.includes("revisión") || r.includes("manual")) {
    return {
      border: "border-slate-500/30",
      bg: "bg-slate-900/40",
      text: "text-slate-300 border-slate-700/50",
      icon: (
        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      badge: "Inspección",
    };
  }
  return {
    border: "border-slate-800",
    bg: "bg-slate-900/20",
    text: "text-slate-400 border-slate-850",
    icon: (
      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: "Normal",
  };
};

const getFactBadgeStyle = (fact: string) => {
  switch (fact) {
    case "temperatura_alta":
    case "paquete_danado":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "vibracion_anomala":
    case "mantenimiento_pendiente":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "humedad_excesiva":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "zona_saturada":
    case "ruta_obstruida":
      return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "zona_libre":
    case "ruta_libre":
    case "paquete_correcto":
    case "prioridad_alta_pedido":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    default:
      return "bg-slate-850 text-slate-300 border border-slate-800";
  }
};

const formatFactLabel = (fact: string) => {
  return fact.replace(/_/g, " ").toUpperCase();
};

export function ParteF() {
  const [temperatura, setTemperatura] = useState(20);
  const [humedad, setHumedad] = useState(50);
  const [vibracion, setVibracion] = useState(0.0);
  const [ocupacion, setOcupacion] = useState(50);
  
  // Extra facts set
  const [mantenimientoPendiente, setMantenimientoPendiente] = useState(false);
  const [prioridadAltaPedido, setPrioridadAltaPedido] = useState(false);

  // Files state
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([]);
  const [fileObjectUrls, setFileObjectUrls] = useState<Map<string, string>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Request mutation
  const { data, isPending, mutate, isError } = useMutation({
    mutationKey: ["parte-f"],
    mutationFn: async () => {
      if (archivosSeleccionados.length === 0) {
        throw new Error("Debe seleccionar al menos una imagen");
      }

      const formData = new FormData();
      
      // Append files
      archivosSeleccionados.forEach((file) => {
        formData.append("imagenes", file);
      });

      // Append text fields
      formData.append("temperatura", temperatura.toString());
      formData.append("humedad", humedad.toString());
      formData.append("vibracion", vibracion.toString());
      formData.append("ocupacion", ocupacion.toString());

      // Append extra facts
      if (mantenimientoPendiente) {
        formData.append("hechos_extra", "mantenimiento_pendiente");
      }
      if (prioridadAltaPedido) {
        formData.append("hechos_extra", "prioridad_alta_pedido");
      }

      const res = await api.post("partef", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data as ParteFRes;
    }
  });

  // Preload sample images on mount
  useEffect(() => {
    const preloadingSamples = async () => {
      const samples = [
        "paquete_bueno.jpg",
        "paquete_danado.jpg",
        "zona_obstruida.jpg",
      ];
      const files: File[] = [];

      for (const sample of samples) {
        try {
          const response = await fetch(`/${sample}`);
          const blob = await response.blob();
          const file = new File([blob], sample, { type: blob.type || "image/jpeg" });
          files.push(file);
        } catch (err) {
          console.error(`Error loading sample ${sample}:`, err);
        }
      }

      if (files.length > 0) {
        setArchivosSeleccionados(files);
      }
    };
    preloadingSamples();
  }, []);

  // Cleanup object URLs on unmount or file selection change
  useEffect(() => {
    return () => {
      fileObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileObjectUrls]);

  // Handle new files helper
  const handleAddNewFiles = (newFiles: File[]) => {
    const updatedUrls = new Map(fileObjectUrls);
    const updatedFiles = [...archivosSeleccionados];

    newFiles.forEach((file) => {
      // Avoid adding duplicate filenames in the list if already exists
      if (!updatedFiles.some((f) => f.name === file.name)) {
        updatedFiles.push(file);
        if (!file.name.includes("paquete_bueno") && !file.name.includes("paquete_danado") && !file.name.includes("zona_obstruida")) {
          // It's a custom uploaded image, create an object URL for local preview
          const url = URL.createObjectURL(file);
          updatedUrls.set(file.name, url);
        }
      }
    });

    setFileObjectUrls(updatedUrls);
    setArchivosSeleccionados(updatedFiles);
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = archivosSeleccionados[index];
    const updatedFiles = archivosSeleccionados.filter((_, i) => i !== index);
    
    if (fileObjectUrls.has(fileToRemove.name)) {
      const url = fileObjectUrls.get(fileToRemove.name);
      if (url) URL.revokeObjectURL(url);
      const updatedUrls = new Map(fileObjectUrls);
      updatedUrls.delete(fileToRemove.name);
      setFileObjectUrls(updatedUrls);
    }
    
    setArchivosSeleccionados(updatedFiles);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAddNewFiles(Array.from(e.target.files));
    }
  };

  // Reset to default sample set
  const loadDefaultSamples = async () => {
    const samples = [
      "paquete_bueno.jpg",
      "paquete_danado.jpg",
      "zona_obstruida.jpg",
    ];
    const files: File[] = [];

    for (const sample of samples) {
      try {
        const response = await fetch(`/${sample}`);
        const blob = await response.blob();
        const file = new File([blob], sample, { type: blob.type || "image/jpeg" });
        files.push(file);
      } catch (err) {
        console.error(err);
      }
    }
    
    // Revoke any existing custom urls
    fileObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    setFileObjectUrls(new Map());
    setArchivosSeleccionados(files);
  };

  const getPreviewSrc = (fileName: string) => {
    const isSample = ["paquete_bueno.jpg", "paquete_danado.jpg", "zona_obstruida.jpg"].includes(fileName);
    if (isSample) {
      return `/${fileName}`;
    }
    return fileObjectUrls.get(fileName) || "";
  };

  return (
    <div className="space-y-6 flex flex-col pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Control Cooperativo Inteligente
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte F: Sistema Multiagente de Soporte a Decisiones
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              Simulando Agentes...
            </div>
          )}
          {data && !isPending && (
            <span className="text-xs px-3.5 py-1.5 rounded-full font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Simulación Ejecutada con Éxito
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Este panel coordina un sistema multiagente cooperativo. Los agentes de <strong>Sensores</strong>,{" "}
        <strong>Análisis de Señales</strong> y <strong>Visión de Imágenes</strong> se ejecutan de manera descentralizada 
        para nutrir a un <strong>Agente Decisor</strong> con un conjunto consolidado de hechos, emitiendo 
        prescripciones operacionales unificadas en tiempo real.
      </p>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Parameters & Input Controls (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-6">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800/50 pb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Parámetros de Simulación
            </h3>

            {/* Telemetry Sliders */}
            <div className="space-y-4">
              {/* Temperatura Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Temperatura
                  </span>
                  <span className="text-red-400 font-mono font-bold text-right">{temperatura} °C</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={temperatura}
                  onChange={(e) => setTemperatura(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Humedad Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Humedad Relativa
                  </span>
                  <span className="text-blue-400 font-mono font-bold text-right">{humedad} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={humedad}
                  onChange={(e) => setHumedad(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Vibracion Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Vibración de Maquinaria
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-right">{vibracion.toFixed(1)} mm/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={vibracion}
                  onChange={(e) => setVibracion(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Ocupacion Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Nivel de Ocupación
                  </span>
                  <span className="text-purple-400 font-mono font-bold text-right">{ocupacion} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={ocupacion}
                  onChange={(e) => setOcupacion(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Extra Facts Checklist */}
            <div className="space-y-3 pt-3 border-t border-slate-900/60">
              <span className="text-xs text-slate-400 font-semibold block">Hechos Adicionales (Entorno / Contexto)</span>
              
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mantenimientoPendiente}
                    onChange={(e) => setMantenimientoPendiente(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Mantenimiento Pendiente</span>
                    <span className="text-[10px] text-slate-500">
                      Indica que la maquinaria tiene tareas de mantenimiento retrasadas.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-900/60 hover:border-slate-800 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={prioridadAltaPedido}
                    onChange={(e) => setPrioridadAltaPedido(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500 focus:ring-offset-slate-900"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Pedido de Prioridad Alta</span>
                    <span className="text-[10px] text-slate-500">
                      Señala la urgencia extrema de liberar un lote logístico.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Image Upload Zone */}
            <div className="space-y-3 pt-3 border-t border-slate-900/60">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">Imágenes de Almacén</span>
                <button
                  type="button"
                  onClick={loadDefaultSamples}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Restaurar muestras
                </button>
              </div>

              {/* Drag Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`py-6 px-4 rounded-xl border border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-slate-850 bg-slate-950/30 hover:border-slate-800 hover:bg-slate-950/60"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <svg className="w-8 h-8 text-indigo-400/80 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold text-slate-300 block">
                  Cargar imágenes o arrastrar aquí
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Admite múltiples fotos (JPG, PNG)
                </span>
              </div>

              {/* Selected Files List */}
              {archivosSeleccionados.length > 0 && (
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 border border-slate-950/60 rounded-xl p-2 bg-slate-950/20">
                  {archivosSeleccionados.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/80 border border-slate-900/60 text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                        {/* Thumbnail */}
                        <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src={getPreviewSrc(file.name)}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If loading preview fails (e.g. mock object url issues), show standard icon
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-300 truncate font-mono">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1 hover:bg-slate-900 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Eliminar de la lista"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Execute Simulation Button */}
            <button
              type="button"
              disabled={isPending || archivosSeleccionados.length === 0}
              onClick={() => mutate()}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                archivosSeleccionados.length === 0
                  ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:shadow-indigo-600/35 border border-indigo-500/20"
              }`}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando Simulación...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Ejecutar Simulación Multiagente
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Process Execution Tracker / Simulation Dashboard (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Loading Overlay */}
            {isPending && (
              <motion.div
                key="loading-tracker"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-xl flex flex-col justify-center min-h-[450px]"
              >
                <div className="max-w-md mx-auto w-full text-center space-y-8">
                  {/* Rotating agent radar */}
                  <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/20 border-b-indigo-500/10 border-l-indigo-500/40"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute w-16 h-16 rounded-full border-4 border-t-purple-500/10 border-r-purple-500 border-b-purple-500/40 border-l-purple-500/20"
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                    />
                    <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.187m6 0l5.096-.813M9 21V3m0 18h12" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white tracking-wide">Secuencia de Inferencia Activa</h4>
                    <p className="text-xs text-slate-500">Monitoreando el intercambio de hechos cooperativos del sistema experto...</p>
                  </div>

                  {/* Staggered progress checkpoints simulated layout */}
                  <div className="space-y-3.5 text-left border border-slate-900/80 p-4 rounded-xl bg-slate-950/40 max-w-sm mx-auto font-mono text-[11px]">
                    <div className="flex items-center gap-3 text-red-400">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>[AGENTE SENSOR] Generando datos de telemetría...</span>
                    </div>
                    <div className="flex items-center gap-3 text-indigo-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span>[ANALIZADOR SEÑALES] Procesando alarmas físicas...</span>
                    </div>
                    <div className="flex items-center gap-3 text-purple-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                      <span>[ANALIZADOR IMÁGENES] Clasificando obstrucciones...</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-slate-800" />
                      <span>[AGENTE DECISOR] Evaluando recomendaciones finales...</span>
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
                className="p-8 rounded-2xl bg-red-950/15 border border-red-900/30 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center min-h-[450px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Fallo en la Simulación Multiagente</h4>
                <p className="text-slate-400 text-xs max-w-sm mb-6 leading-relaxed">
                  No se pudo procesar la solicitud en el backend. Asegúrate de que el servidor FastAPI esté encendido en `http://localhost:8000`.
                </p>
                <button
                  type="button"
                  onClick={() => mutate()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Reintentar Simulación
                </button>
              </motion.div>
            )}

            {/* Empty State */}
            {!data && !isPending && !isError && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-2xl bg-slate-900/10 border border-slate-850 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center min-h-[450px]"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-400/60 mb-5 animate-pulse">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-slate-300">Simulador Inicializado</h4>
                <p className="text-slate-500 text-xs max-w-sm mt-1 leading-relaxed">
                  Configura los sliders en el panel izquierdo y pulsa en "Ejecutar Simulación Multiagente" para visualizar el diagnóstico cooperativo de los agentes inteligentes.
                </p>
              </motion.div>
            )}

            {/* Simulation Dashboard Result */}
            {data && !isPending && !isError && (
              <motion.div
                key="results-dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                className="space-y-6"
              >
                {/* Aggregate Summary Header Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/20 to-purple-950/10 border border-slate-800/80 backdrop-blur-sm shadow-md grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Fotos Procesadas</span>
                    <span className="text-lg font-extrabold text-white">{data.imagenes.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Hechos Derivados</span>
                    <span className="text-lg font-extrabold text-indigo-400">{data.hechos_totales.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Recomendaciones</span>
                    <span className="text-lg font-extrabold text-emerald-400">{data.recomendaciones.length}</span>
                  </div>
                </div>

                {/* Cooperative Pipeline Summary */}
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-md space-y-4">
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800/50 pb-2.5">
                    Hechos Consolidados Globales (Consensus)
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {data.hechos_totales.length > 0 ? (
                      data.hechos_totales.map((fact, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded border ${getFactBadgeStyle(fact)}`}
                        >
                          {formatFactLabel(fact)}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No se derivaron hechos operacionales.</span>
                    )}
                  </div>
                </div>

                {/* Per-Image Diagnosis breakdown */}
                <div className="space-y-6">
                  {data.analisis_por_imagen.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-lg space-y-5"
                    >
                      {/* Image header */}
                      <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                        <div className="flex items-center gap-2 overflow-hidden mr-3">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          <h4 className="text-xs font-extrabold text-slate-200 font-mono tracking-tight truncate">
                            {item.imagen}
                          </h4>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex-shrink-0">
                          ID: #{(idx + 1).toString().padStart(2, "0")}
                        </span>
                      </div>

                      {/* Side-by-side card grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        
                        {/* Image preview & Sensor context */}
                        <div className="md:col-span-4 space-y-4">
                          <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-850 p-1.5 flex items-center justify-center min-h-[140px]">
                            <img
                              src={getPreviewSrc(item.imagen)}
                              alt={item.imagen}
                              className="w-full h-auto object-contain rounded hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>

                          {/* Telemetry log for this image */}
                          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 font-mono text-[10px] space-y-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                              Lecturas de Entrada:
                            </span>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Temperatura:</span>
                              <span className="text-red-400 font-semibold">{item.datos.temperatura} °C</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Humedad:</span>
                              <span className="text-blue-400 font-semibold">{item.datos.humedad} %</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Vibración:</span>
                              <span className="text-amber-400 font-semibold">{item.datos.vibracion} mm/s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Ocupación:</span>
                              <span className="text-purple-400 font-semibold">{item.datos.ocupacion} %</span>
                            </div>
                          </div>
                        </div>

                        {/* Agent reasoning timeline */}
                        <div className="md:col-span-8 space-y-4">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            Traza de Razonamiento Multiagente
                          </span>

                          <div className="relative border-l border-slate-800 pl-4 ml-2.5 space-y-4">
                            
                            {/* Agente Sensor Node */}
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-indigo-500 bg-slate-950" />
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                                  Agente Sensor
                                </span>
                                <p className="text-[11px] text-slate-300">
                                  Registró telemetría física del entorno del almacén de manera satisfactoria.
                                </p>
                              </div>
                            </div>

                            {/* Agente Analizador de Señales Node */}
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-amber-500 bg-slate-950" />
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                  Agente Analizador de Señales
                                </span>
                                <p className="text-[11px] text-slate-400">
                                  Evaluó umbrales y alarmas sobre las señales de sensores:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {item.hechos_sensores.map((h, hIdx) => (
                                    <span key={hIdx} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${getFactBadgeStyle(h)}`}>
                                      {formatFactLabel(h)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Agente Analizador de Imágenes Node */}
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-purple-500 bg-slate-950" />
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                                  Agente Analizador de Imágenes
                                </span>
                                <p className="text-[11px] text-slate-400">
                                  Analizó las anomalías visuales e integró el descriptor de imagen:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {item.hechos_imagen.map((h, hIdx) => (
                                    <span key={hIdx} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${getFactBadgeStyle(h)}`}>
                                      {formatFactLabel(h)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Agente Decisor / Recomendaciones */}
                            <div className="relative">
                              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-slate-950" />
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                  Agente Decisor (Prescripciones)
                                </span>
                                <p className="text-[11px] text-slate-400">
                                  Evaluó la base de hechos totales y emitió las siguientes acciones de mitigación:
                                </p>
                                
                                <div className="space-y-2">
                                  {item.recomendaciones.map((rec, rIdx) => {
                                    const recStyle = getRecomendacionStyle(rec);
                                    return (
                                      <div
                                        key={rIdx}
                                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${recStyle.border} ${recStyle.bg}`}
                                      >
                                        <div className="flex items-center gap-2.5 text-slate-200">
                                          <div className="flex-shrink-0">{recStyle.icon}</div>
                                          <span className="font-medium">{rec}</span>
                                        </div>
                                        <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded border ${recStyle.text}`}>
                                          {recStyle.badge}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
