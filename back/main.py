from fastapi import FastAPI
from functions.partea import simular_datos
from functions.parteb import analizar_senales
from functions.parted import sistema_experto
from functions.partef import sistema_multiagente
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from model.parteb_model import PartebRequest
import time
from typing import List, Optional
from fastapi import UploadFile, File, Form
from functions.partec import analizar_imagenes
from functions.partee import representar_conocimiento
from functions.parteg import sistemagraphic
from functions.parteh import evaluar_probabilidades
from functions.partei import generar_diagrama_interaccion
from functions.partej import ejecutar_paralelo
from functions.partek import obtener_datos_iniciales, optimizar_pedidos
from model.partek_model import PedidosIniciales
from functions.sistemacompleto import ejecutar_sistema_completo
from model.sistemacompleto_model import SistemaCompletoRequest, PedidosInput

os.makedirs("static", exist_ok=True)


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()


app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)  

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"(https://.*\.brs\.devtunnels\.ms|https://.*\.ngrok-free\.app|http://localhost(:\d+)?)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/partea")
async def read_partea():
    return simular_datos(seed=int(time.time()))

@app.post("/parteb")
async def read_parteb(
    request: PartebRequest
):
    return analizar_senales(
        temperatura=request.temperatura,
        vibracion=request.vibracion,
        tiempo=request.tiempo,
        a_temp=request.a_temp,
        a_vib=request.a_vib
    )


@app.post("/partec")
async def read_partec(
    archivos: List[UploadFile] = File(...)
):
    return await analizar_imagenes(
        imagenes=archivos
    )
@app.get("/parted")
async def read_parted():
    return sistema_experto()

@app.get("/partee")
async def read_partee():
    return representar_conocimiento()


@app.post("/partef")
async def read_partef(
    imagenes: List[UploadFile] = File(...),
    temperatura: float = Form(20.0),
    humedad: float = Form(50.0),
    vibracion: float = Form(0.0),
    ocupacion: float = Form(50.0),
    hechos_extra: List[str] = Form([]),
):
    analisis = []
    hechos_totales = []
    recomendaciones_totales = []

    for archivo in imagenes:
        resultado = sistema_multiagente(
            temperatura=temperatura,
            humedad=humedad,
            vibracion=vibracion,
            ocupacion=ocupacion,
            imagen=archivo.filename,
            hechos_extra=hechos_extra,
        )

        analisis.append(resultado)
        hechos_totales.extend(resultado["hechos_totales"])
        recomendaciones_totales.extend(resultado["recomendaciones"])

    hechos_totales_unicos = list(dict.fromkeys(hechos_totales))
    recomendaciones_totales_unicas = list(dict.fromkeys(recomendaciones_totales))

    return {
        "imagenes": [archivo.filename for archivo in imagenes],
        "datos": {
            "temperatura": temperatura,
            "humedad": humedad,
            "vibracion": vibracion,
            "ocupacion": ocupacion,
        },
        "hechos_extra": hechos_extra,
        "analisis_por_imagen": analisis,
        "hechos_totales": hechos_totales_unicos,
        "recomendaciones": recomendaciones_totales_unicas,
    }

@app.get("/parteg")
async def read_parteg():
    return sistemagraphic()

@app.post("/parteh")
async def read_parteg_post(
    hechos: List[str] = Form([])
):
    print("HECHOS RECIBIDOS EN BACKEND /PARTEH:", hechos)
    return evaluar_probabilidades(hechos)

@app.get("/partei")
async def read_parteh():
    return generar_diagrama_interaccion()

@app.get("/partej")
async def read_partej():
    return ejecutar_paralelo()

@app.post("/partek")
async def read_partek(
    request: PedidosIniciales
):
    val =  obtener_datos_iniciales(datos=request)
    
    return optimizar_pedidos(val)


@app.post("/sistemacompleto")
async def read_sistemacompleto(
    imagenes: Optional[List[UploadFile]] = File(None),
    seed: Optional[int] = Form(10),
    registros: Optional[int] = Form(120),
    temp_limite: Optional[float] = Form(32.0),
    vib_limite: Optional[float] = Form(5.0),
    hum_limite: Optional[float] = Form(70.0),
    ocu_limite: Optional[float] = Form(85.0),
    pedidos: Optional[str] = Form(None)
):
    pedidos_input = None
    if pedidos:
        try:
            import json
            pedidos_data = json.loads(pedidos)
            pedidos_input = PedidosInput(**pedidos_data)
        except Exception as e:
            print("Error parsing pedidos JSON in /sistemacompleto:", e)

    return ejecutar_sistema_completo(
        seed=seed,
        registros=registros,
        temp_limite=temp_limite,
        vib_limite=vib_limite,
        hum_limite=hum_limite,
        ocu_limite=ocu_limite,
        pedidos_input=pedidos_input,
        imagenes_input=imagenes
    )