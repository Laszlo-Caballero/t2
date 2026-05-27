export interface ParetGRes {
  titulo: string;
  ruta_grafo: string;
  proposiciones: Proposicione[];
  reglas: Regla[];
}

export interface Proposicione {
  simbolo: string;
  descripcion: string;
}

export interface Regla {
  origen: string;
  destino: string;
  regla: string;
}
