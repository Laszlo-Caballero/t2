from pydantic import BaseModel
from typing import List, Optional

class PedidosInput(BaseModel):
    Pedido: List[str]
    Prioridad: List[int]
    Tiempo_espera: List[int]
    Distancia: List[int]
    Paquete_danado: List[bool]
    Zona_saturada: List[bool]

class SistemaCompletoRequest(BaseModel):
    seed: Optional[int] = 10
    registros: Optional[int] = 120
    temp_limite: Optional[float] = 32.0
    vib_limite: Optional[float] = 5.0
    hum_limite: Optional[float] = 70.0
    ocu_limite: Optional[float] = 85.0
    pedidos: Optional[PedidosInput] = None
