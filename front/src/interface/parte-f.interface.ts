export interface TelemetryData {
  temperatura: number;
  humedad: number;
  vibracion: number;
  ocupacion: number;
}

export interface AnalisisImagen {
  datos: TelemetryData;
  imagen: string;
  hechos_sensores: string[];
  hechos_imagen: string[];
  hechos_extra: string[];
  hechos_totales: string[];
  recomendaciones: string[];
}

export interface ParteFRes {
  imagenes: string[];
  datos: TelemetryData;
  hechos_extra: string[];
  analisis_por_imagen: AnalisisImagen[];
  hechos_totales: string[];
  recomendaciones: string[];
}
