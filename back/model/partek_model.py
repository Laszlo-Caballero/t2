from pydantic import BaseModel
from typing import List


class PedidosIniciales(BaseModel):
    Pedido: List[str]
    Prioridad: List[int]
    Tiempo_espera: List[int]
    Distancia: List[int]
    Paquete_danado: List[bool]
    Zona_saturada: List[bool]


class PedidoItem(BaseModel):
    pedido: str
    prioridad: float = 0.0
    tiempo_espera: float = 0.0
    distancia: float = 0.0
    paquete_danado: bool = False
    zona_saturada: bool = False
