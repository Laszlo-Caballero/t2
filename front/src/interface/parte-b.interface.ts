export interface ParteBRes {
  anomalias_temperatura: AnomaliasTemperatura[];
  anomalias_vibracion: AnomaliasVibracion[];
  temperatura: number[];
  vibracion: number[];
  tiempo: number[];
  ruta_temperatura: string;
  ruta_vibracion: string;
}

export interface AnomaliasTemperatura {
  Tiempo: number;
  Temperatura: number;
  Vibracion: number;
}

export interface AnomaliasVibracion {
  Tiempo: number;
  Temperatura: number;
  Vibracion: number;
}
