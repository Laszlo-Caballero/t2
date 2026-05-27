export interface ParteAData {
  datos: Dato[];
  ruta_temperatura: string;
  ruta_vibracion: string;
  temperatura: number[];
  vibracion: number[];
  tiempo: number[];
}

export interface Dato {
  Tiempo: number;
  Temperatura: number;
  Humedad: number;
  Vibracion: number;
  Ocupacion: number;
}
