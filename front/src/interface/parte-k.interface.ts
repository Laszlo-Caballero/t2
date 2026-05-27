export interface ParteKRes {
  df_pedidos: DfPedido[];
  pedidos_validos: PedidosValido[];
  pedidos_ordenados: PedidosOrdenado[];
  mejor_alternativa: MejorAlternativa;
}

export interface DfPedido {
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

export interface PedidosOrdenado {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
  Puntaje: number;
}

export interface MejorAlternativa {
  Pedido: string;
  Prioridad: number;
  Tiempo_espera: number;
  Distancia: number;
  Paquete_danado: boolean;
  Zona_saturada: boolean;
  Puntaje: number;
}
