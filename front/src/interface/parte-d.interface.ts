export interface ParteDRes {
  hechos: Hecho[];
  reglas: Regla[];
  riesgo_mecanico: string[];
  alerta_ambiental: string[];
  revision_manual: string[];
  reubicar_carga: string[];
  despacho_inmediato: string[];
  detener_maquinaria: string[];
}

export interface Hecho {
  predicado: string;
  valor: string;
}

export interface Regla {
  nombre: string;
  si: string[];
  entonces: string;
}
