from pydantic import BaseModel
from typing import Optional

class PartebRequest(BaseModel):
    temperatura: Optional[list] = None
    vibracion: Optional[list] = None
    tiempo: Optional[list] = None
    a_temp: float = 32.0
    a_vib: float = 5.0