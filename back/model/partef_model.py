from pydantic import BaseModel
from typing import Optional

class PartebRequest(BaseModel):
    temperatura: float = 20.0
    vibracion: float = 0.0
    humedad: float = 50.0
    ocupacion: float = 50.0
    hechos_extra: Optional[list] = []