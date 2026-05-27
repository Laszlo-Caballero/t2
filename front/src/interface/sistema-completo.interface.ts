export interface SistemaCompletoData {
  simulacion: Simulacion;
  analisis_senales: AnalisisSenales;
  multiagente: Multiagente;
  optimizacion: Optimizacion;
}

export interface Simulacion {
  datos: Dato[];
  ruta_grafica_temperatura: string;
  ruta_grafica_vibracion: string;
}

export interface Dato {
  Tiempo: number;
  Temperatura: number;
  Humedad: number;
  Vibracion: number;
  Ocupacion: number;
}

export interface AnalisisSenales {
  anomalias_temperatura: AnomaliasTemperatura[];
  anomalias_vibracion: AnomaliasVibracion[];
}

export interface AnomaliasTemperatura {
  Tiempo: number;
  Temperatura: number;
  Humedad: number;
  Vibracion: number;
  Ocupacion: number;
}

export interface AnomaliasVibracion {
  Tiempo: number;
  Temperatura: number;
  Humedad: number;
  Vibracion: number;
  Ocupacion: number;
}

export interface Multiagente {
  datos_actuales: DatosActuales;
  imagen_analizada: string;
  imagen_gris?: string;
  imagen_umbral?: string;
  imagen_canny?: string;
  hechos_detectados: string[];
  riesgos: Riesgos;
  recomendaciones: string[];
  logs: string[];
  tiempo_concurrente_segundos: number;
}

export interface DatosActuales {
  temperatura: number;
  humedad: number;
  vibracion: number;
  ocupacion: number;
}

export type Riesgos = Record<string, number>;

export interface Optimizacion {
  todos_los_pedidos: TodosLosPedido[];
  pedidos_validos: PedidosValido[];
  orden_optimo: OrdenOptimo[];
  mejor_pedido_a_despachar: MejorPedidoADespachar;
}

export interface TodosLosPedido {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
  Puntaje: number;
}

export interface PedidosValido {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
  Puntaje: number;
}

export interface OrdenOptimo {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
  Puntaje: number;
}

export interface MejorPedidoADespachar {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
  Puntaje: number;
}

export type RegistroFlexible = Record<string, any>;

export interface PedidosInputRequest {
  Pedido: string[];
  Prioridad: number[];
  Tiempo_espera: number[];
  Distancia: number[];
  Paquete_danado: boolean[];
  Zona_saturada: boolean[];
}

export interface SistemaCompletoRequest {
  seed: number;
  registros: number;
  temp_limite: number;
  vib_limite: number;
  hum_limite: number;
  ocu_limite: number;
  pedidos: PedidosInputRequest;
}

export type SistemaCompletoResponse = SistemaCompletoData;
