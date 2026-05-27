import os
import shutil
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import threading
import time
import random
from typing import List, Optional
from model.sistemacompleto_model import PedidosInput

# Copiar las imágenes de almacén a la carpeta static para que sean accesibles mediante la API
os.makedirs("static", exist_ok=True)
for img in ["paquete_bueno.jpg", "paquete_danado.jpg", "zona_obstruida.jpg"]:
    src_path = os.path.join("images", img)
    dst_path = os.path.join("static", img)
    if os.path.exists(src_path) and not os.path.exists(dst_path):
        shutil.copy(src_path, dst_path)


def ejecutar_sistema_completo(
    seed: int = 10,
    registros: int = 120,
    temp_limite: float = 32.0,
    vib_limite: float = 5.0,
    hum_limite: float = 70.0,
    ocu_limite: float = 85.0,
    pedidos_input: PedidosInput = None,
    imagenes_input: Optional[List] = None
):
    # Guardar imágenes subidas si existen
    imagenes_disponibles = []
    if imagenes_input:
        for file in imagenes_input:
            filename = file.filename
            ruta_destino = os.path.join("static", filename)
            try:
                contents = file.file.read()
                with open(ruta_destino, "wb") as buffer:
                    buffer.write(contents)
                imagenes_disponibles.append(filename)
            except Exception as e:
                print(f"Error saving uploaded file {filename}:", e)

    # ============================================================
    # 1. SIMULACIÓN DE DATOS DEL ALMACÉN
    # ============================================================
    np.random.seed(seed)
    random.seed(seed)  # Sync random seed too

    tiempo = np.arange(1, registros + 1)
    temperatura = []
    humedad = []
    vibracion = []
    ocupacion = []

    for i in range(registros):
        # Valores normales
        temp = np.random.normal(24, 3)
        hum = np.random.normal(55, 8)
        vib = np.random.normal(2.5, 0.7)
        ocu = np.random.randint(40, 85)

        # Probabilidad de anomalías simuladas
        if np.random.rand() < 0.08:
            temp = np.random.uniform(33, 40)

        if np.random.rand() < 0.10:
            hum = np.random.uniform(71, 90)

        if np.random.rand() < 0.07:
            vib = np.random.uniform(5.5, 8)

        if np.random.rand() < 0.12:
            ocu = np.random.randint(86, 100)

        temperatura.append(temp)
        humedad.append(hum)
        vibracion.append(vib)
        ocupacion.append(ocu)

    datos = pd.DataFrame({
        "Tiempo": tiempo,
        "Temperatura": np.round(temperatura, 2),
        "Humedad": np.round(humedad, 2),
        "Vibracion": np.round(vibracion, 2),
        "Ocupacion": ocupacion
    })

    # ============================================================
    # 2. ANÁLISIS DE SEÑALES Y GENERACIÓN DE GRÁFICOS
    # ============================================================
    # Graficar temperatura
    fig_temp, ax_temp = plt.subplots(figsize=(10, 5))
    ax_temp.plot(datos["Tiempo"], datos["Temperatura"], label="Temperatura", color="blue")
    ax_temp.axhline(y=temp_limite, color="red", linestyle="--", label="Límite crítico")
    ax_temp.set_title("Señal temporal de temperatura")
    ax_temp.set_xlabel("Tiempo")
    ax_temp.set_ylabel("Temperatura °C")
    ax_temp.legend()
    ax_temp.grid(True)
    
    ruta_temp = "static/temperatura-completo.png"
    fig_temp.savefig(ruta_temp)
    plt.close(fig_temp)

    # Graficar vibración
    fig_vib, ax_vib = plt.subplots(figsize=(10, 5))
    ax_vib.plot(datos["Tiempo"], datos["Vibracion"], label="Vibración", color="orange")
    ax_vib.axhline(y=vib_limite, color="red", linestyle="--", label="Límite crítico")
    ax_vib.set_title("Señal temporal de vibración")
    ax_vib.set_xlabel("Tiempo")
    ax_vib.set_ylabel("Vibración")
    ax_vib.legend()
    ax_vib.grid(True)

    ruta_vib = "static/vibracion-completo.png"
    fig_vib.savefig(ruta_vib)
    plt.close(fig_vib)

    anomalias_temperatura = datos[datos["Temperatura"] > temp_limite]
    anomalias_vibracion = datos[datos["Vibracion"] > vib_limite]

    # ============================================================
    # 3. AGENTES DEL SISTEMA
    # ============================================================
    class AgenteSensor:
        def obtener_datos_actuales(self):
            fila = datos.sample(1).iloc[0]
            return {
                "temperatura": float(fila["Temperatura"]),
                "humedad": float(fila["Humedad"]),
                "vibracion": float(fila["Vibracion"]),
                "ocupacion": int(fila["Ocupacion"])
            }

    class AgenteAnalizadorSenales:
        def analizar(self, datos_sensor):
            hechos = []
            if datos_sensor["temperatura"] > temp_limite:
                hechos.append("temperatura_alta")
            if datos_sensor["humedad"] > hum_limite:
                hechos.append("humedad_excesiva")
            if datos_sensor["vibracion"] > vib_limite:
                hechos.append("vibracion_anomala")
            if datos_sensor["ocupacion"] > ocu_limite:
                hechos.append("zona_saturada")
            else:
                hechos.append("zona_libre")
            return hechos

    class AgenteAnalizadorImagenes:
        def __init__(self, imagenes_disponibles=None):
            self.imagenes_disponibles = imagenes_disponibles if imagenes_disponibles else [
                "paquete_bueno.jpg",
                "paquete_danado.jpg",
                "zona_obstruida.jpg"
            ]

        def analizar_imagen(self):
            imagen = random.choice(self.imagenes_disponibles)
            hechos = []
            nombre = imagen.lower()
            if "danado" in nombre or "roto" in nombre or "paquete_danado" in nombre:
                hechos.append("paquete_danado")
            elif "obstruida" in nombre or "bloqueada" in nombre or "ruta_obstruida" in nombre or "zona_obstruida" in nombre:
                hechos.append("ruta_obstruida")
            else:
                hechos.append("paquete_correcto")
            return imagen, hechos

    class AgenteProbabilistico:
        def evaluar_probabilidad(self, hechos):
            riesgos = {}
            if "vibracion_anomala" in hechos:
                riesgos["falla_mecanica"] = 0.75
            if "paquete_danado" in hechos:
                riesgos["daño_paquete"] = 0.80
            if "temperatura_alta" in hechos:
                riesgos["riesgo_ambiental"] = 0.70
            if "ruta_obstruida" in hechos:
                riesgos["bloqueo_operativo"] = 0.85
            if "zona_saturada" in hechos:
                riesgos["retraso_logistico"] = 0.65
            return riesgos

    class AgenteDecisor:
        def decidir(self, hechos, riesgos):
            recomendaciones = []
            if "vibracion_anomala" in hechos:
                recomendaciones.append("Revisar fajas o estanterías por riesgo mecánico.")
            if "temperatura_alta" in hechos and "humedad_excesiva" in hechos:
                recomendaciones.append("Activar ventilación y control de humedad.")
            if "paquete_danado" in hechos:
                recomendaciones.append("Enviar paquete a revisión manual.")
            if "zona_saturada" in hechos and "ruta_obstruida" in hechos:
                recomendaciones.append("Reubicar carga y despejar ruta.")
            if "zona_libre" in hechos and "paquete_correcto" in hechos:
                recomendaciones.append("Continuar operación normal o despachar pedido.")

            for riesgo, probabilidad in riesgos.items():
                if probabilidad >= 0.85:
                    recomendaciones.append(f"Acción inmediata por {riesgo}.")
                elif probabilidad >= 0.70:
                    recomendaciones.append(f"Generar alerta por {riesgo}.")
                elif probabilidad >= 0.50:
                    recomendaciones.append(f"Emitir advertencia por {riesgo}.")

            if len(recomendaciones) == 0:
                recomendaciones.append("Estado normal del almacén.")
            return recomendaciones

    # ============================================================
    # 4. CONCURRENCIA ENTRE AGENTES
    # ============================================================
    sensor = AgenteSensor()
    analizador_senales = AgenteAnalizadorSenales()
    analizador_imagenes = AgenteAnalizadorImagenes(imagenes_disponibles=imagenes_disponibles)
    agente_probabilistico = AgenteProbabilistico()
    decisor = AgenteDecisor()

    hechos_detectados = []
    bloqueo = threading.Lock()
    datos_actuales = {}
    imagen_analizada = ""
    logs = []

    inicio = time.time()

    def tarea_sensor_y_senales():
        nonlocal datos_actuales
        logs.append(f"[{time.time() - inicio:.2f}s] Agente Sensor iniciado...")
        time.sleep(2)
        datos_actuales = sensor.obtener_datos_actuales()
        hechos = analizador_senales.analizar(datos_actuales)
        with bloqueo:
            hechos_detectados.extend(hechos)
        logs.append(f"[{time.time() - inicio:.2f}s] Agente Sensor y Señales terminó. Datos: {datos_actuales}, hechos: {hechos}")

    def tarea_imagenes():
        nonlocal imagen_analizada
        logs.append(f"[{time.time() - inicio:.2f}s] Agente Analizador de Imágenes iniciado...")
        time.sleep(3)
        imagen_analizada, hechos = analizador_imagenes.analizar_imagen()
        with bloqueo:
            hechos_detectados.extend(hechos)
        logs.append(f"[{time.time() - inicio:.2f}s] Agente de Imágenes terminó. Imagen: {imagen_analizada}, hechos: {hechos}")

    hilo1 = threading.Thread(target=tarea_sensor_y_senales)
    hilo2 = threading.Thread(target=tarea_imagenes)

    hilo1.start()
    hilo2.start()

    hilo1.join()
    hilo2.join()

    fin = time.time()
    tiempo_total_concurrente = fin - inicio

    # ============================================================
    # 5. SISTEMA EXPERTO + RAZONAMIENTO PROBABILÍSTICO
    # ============================================================
    riesgos = agente_probabilistico.evaluar_probabilidad(hechos_detectados)
    recomendaciones = decisor.decidir(hechos_detectados, riesgos)

    # ============================================================
    # 6. OPTIMIZACIÓN DE DESPACHO
    # ============================================================
    if pedidos_input is not None:
        pedidos_dict = pedidos_input.model_dump() if hasattr(pedidos_input, "model_dump") else pedidos_input.dict()
        pedidos = pd.DataFrame(pedidos_dict)
    else:
        pedidos = pd.DataFrame({
            "Pedido": ["P001", "P002", "P003", "P004", "P005"],
            "Prioridad": [9, 6, 8, 10, 7],
            "Tiempo_espera": [15, 40, 25, 10, 35],
            "Distancia": [12, 8, 20, 6, 10],
            "Paquete_danado": [False, False, True, False, False],
            "Zona_saturada": [False, False, False, True, False]
        })

    pedidos["Puntaje"] = (
        pedidos["Prioridad"] * 0.5 +
        pedidos["Tiempo_espera"] * 0.3 -
        pedidos["Distancia"] * 0.2
    )

    pedidos_validos = pedidos[
        (pedidos["Paquete_danado"] == False) &
        (pedidos["Zona_saturada"] == False)
    ]

    orden_optimo = pedidos_validos.sort_values(
        by="Puntaje",
        ascending=False
    )

    mejor_pedido = None
    if not orden_optimo.empty:
        mejor_pedido = orden_optimo.iloc[0].to_dict()

    return {
        "simulacion": {
            "datos": datos.to_dict(orient="records"),
            "ruta_grafica_temperatura": "/" + ruta_temp,
            "ruta_grafica_vibracion": "/" + ruta_vib,
        },
        "analisis_senales": {
            "anomalias_temperatura": anomalias_temperatura.to_dict(orient="records"),
            "anomalias_vibracion": anomalias_vibracion.to_dict(orient="records"),
        },
        "multiagente": {
            "datos_actuales": datos_actuales,
            "imagen_analizada": "/static/" + imagen_analizada,
            "hechos_detectados": hechos_detectados,
            "riesgos": riesgos,
            "recomendaciones": recomendaciones,
            "logs": logs,
            "tiempo_concurrente_segundos": round(tiempo_total_concurrente, 2)
        },
        "optimizacion": {
            "todos_los_pedidos": pedidos.to_dict(orient="records"),
            "pedidos_validos": pedidos_validos.to_dict(orient="records"),
            "orden_optimo": orden_optimo.to_dict(orient="records"),
            "mejor_pedido_a_despachar": mejor_pedido
        }
    }
