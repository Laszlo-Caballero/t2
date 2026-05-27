import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { motion } from "motion/react";
import { getImageUrl } from "../utils/image";
import type { ParteCRes } from "../interface/parte-c.interface";

export function ParteC() {
  const [imageSalt, setImageSalt] = useState(() => Date.now());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isPending, mutate } = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("archivos", file);
      });
      const res = await api.post("partec", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data as ParteCRes[];
    },
  });

  // Load default demo images on initial mount
  useEffect(() => {
    const cargarImagenes = async () => {
      const rutas = [
        "/paquete_bueno.jpg",
        "/paquete_danado.jpg",
        "/zona_obstruida.jpg",
      ];

      const files: File[] = [];

      for (const ruta of rutas) {
        try {
          const response = await fetch(ruta);
          const blob = await response.blob();
          const nombre = ruta.split("/").pop() || "imagen.jpg";
          const file = new File([blob], nombre, {
            type: blob.type,
          });
          files.push(file);
        } catch (err) {
          console.error(`Error al precargar ${ruta}:`, err);
        }
      }

      if (files.length > 0) {
        mutate(files);
      }
    };

    cargarImagenes();
  }, [mutate]);

  // Update salt whenever new data arrives to reload images
  useEffect(() => {
    if (data) {
      setImageSalt(Date.now());
    }
  }, [data]);

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
      const filesArray = Array.from(e.dataTransfer.files);
      mutate(filesArray);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      mutate(filesArray);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 flex flex-col pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-900">
        <div>
          <p className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">
            Procesamiento de Imágenes
          </p>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Parte C: Visión Artificial
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full font-medium">
              <svg className="animate-spin h-3.5 w-3.5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          )}
          {data && (
            <span className="text-xs px-3 py-1.5 rounded-full font-medium border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              {data.length} Imágenes Procesadas
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
        Este módulo implementa algoritmos de filtrado e inspección visual en tiempo real. 
        Sube nuevas imágenes para convertirlas a escala de grises, binarizarlas mediante umbralización y extraer bordes mediante Canny.
      </p>

      {/* Upload Box Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`p-8 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
            : "border-slate-800 bg-slate-900/10 hover:border-slate-700/80 hover:bg-slate-900/20"
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
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-200">
          Arrastra tus imágenes aquí o haz clic para subir
        </p>
        <p className="text-xs text-slate-500 mt-1.5">
          Formatos admitidos: PNG, JPG, JPEG (puedes seleccionar múltiples archivos)
        </p>
      </motion.div>

      {/* Processing Results Area */}
      <div className="relative min-h-[250px]">
        {/* Full-width spinner if loading first batch */}
        {isPending && !data && (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-900/10 border border-slate-800/80 rounded-2xl">
            <motion.div
              className="relative flex items-center justify-center w-16 h-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/30 border-b-indigo-500/10 border-l-indigo-500/50"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              />
              <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
            </motion.div>
            <p className="mt-4 text-xs font-semibold tracking-wider text-indigo-400 uppercase animate-pulse">
              Analizando imágenes en el servidor...
            </p>
          </div>
        )}

        {/* Fading Glassmorphic Loader Overlay for live updates */}
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
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                </motion.div>
                <span className="mt-3 text-xs font-semibold text-indigo-400 animate-pulse">
                  Procesando nuevos archivos...
                </span>
              </div>
            )}

            {/* Grid of processed images cards */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`space-y-6 transition-all duration-300 ${
                isPending ? "blur-[1.5px] opacity-60" : "opacity-100"
              }`}
            >
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm space-y-4 shadow-lg"
                >
                  {/* Card Title */}
                  <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3 justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <h3 className="text-sm font-bold text-slate-200 font-mono tracking-tight">
                        {item.nombre}
                      </h3>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Filtro OpenCV
                    </span>
                  </div>

                  {/* Grid of 3 processed image states */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Grayscale Version */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        1. Escala de Grises
                      </span>
                      <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 p-2 flex items-center justify-center min-h-[180px]">
                        <img
                          src={getImageUrl(item.ruta_gris, imageSalt)}
                          alt="Gris"
                          className="w-full h-auto object-contain rounded hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    </div>

                    {/* Threshold Version */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        2. Umbralización
                      </span>
                      <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 p-2 flex items-center justify-center min-h-[180px]">
                        <img
                          src={getImageUrl(item.ruta_umbral, imageSalt)}
                          alt="Umbral"
                          className="w-full h-auto object-contain rounded hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    </div>

                    {/* Canny Version */}
                    <div className="space-y-2">
                      <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        3. Extracción de Bordes (Canny)
                      </span>
                      <div className="w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900/50 p-2 flex items-center justify-center min-h-[180px]">
                        <img
                          src={getImageUrl(item.ruta_canny, imageSalt)}
                          alt="Canny"
                          className="w-full h-auto object-contain rounded hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

