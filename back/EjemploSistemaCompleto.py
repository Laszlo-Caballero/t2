import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import threading
import time
import random

# ============================================================
# 1. SIMULACIÓN DE DATOS DEL ALMACÉN
# ============================================================
np.random.seed(10)

registros = 120
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

print("TABLA DE DATOS SIMULADOS CON ANOMALÍAS")
print(datos)


# ============================================================
# 2. ANÁLISIS DE SEÑALES
# ============================================================

plt.figure(figsize=(10, 5))
plt.plot(datos["Tiempo"], datos["Temperatura"], label="Temperatura")
plt.axhline(y=32, color="red", linestyle="--", label="Límite crítico")
plt.title("Señal temporal de temperatura")
plt.xlabel("Tiempo")
plt.ylabel("Temperatura °C")
plt.legend()
plt.grid()
plt.show()

plt.figure(figsize=(10, 5))
plt.plot(datos["Tiempo"], datos["Vibracion"], label="Vibración", color="orange")
plt.axhline(y=5, color="red", linestyle="--", label="Límite crítico")
plt.title("Señal temporal de vibración")
plt.xlabel("Tiempo")
plt.ylabel("Vibración")
plt.legend()
plt.grid()
plt.show()

anomalias_temperatura = datos[datos["Temperatura"] > 32]
anomalias_vibracion = datos[datos["Vibracion"] > 5]

print("\nANOMALÍAS DE TEMPERATURA")
print(anomalias_temperatura)

print("\nANOMALÍAS DE VIBRACIÓN")
print(anomalias_vibracion)


# ============================================================
# 3. AGENTES DEL SISTEMA
# ============================================================

hechos_detectados = []
bloqueo = threading.Lock()


class AgenteSensor:
    def obtener_datos_actuales(self):
        fila = datos.sample(1).iloc[0]

        return {
            "temperatura": fila["Temperatura"],
            "humedad": fila["Humedad"],
            "vibracion": fila["Vibracion"],
            "ocupacion": fila["Ocupacion"]
        }


class AgenteAnalizadorSenales:
    def analizar(self, datos_sensor):
        hechos = []

        if datos_sensor["temperatura"] > 32:
            hechos.append("temperatura_alta")

        if datos_sensor["humedad"] > 70:
            hechos.append("humedad_excesiva")

        if datos_sensor["vibracion"] > 5:
            hechos.append("vibracion_anomala")

        if datos_sensor["ocupacion"] > 85:
            hechos.append("zona_saturada")
        else:
            hechos.append("zona_libre")

        return hechos


class AgenteAnalizadorImagenes:
    def analizar_imagen(self):
        imagenes = [
            "paquete_bueno.jpg",
            "paquete_danado.jpg",
            "zona_obstruida.jpg"
        ]

        imagen = random.choice(imagenes)
        hechos = []

        if imagen == "paquete_danado.jpg":
            hechos.append("paquete_danado")

        elif imagen == "zona_obstruida.jpg":
            hechos.append("ruta_obstruida")

        elif imagen == "paquete_bueno.jpg":
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
analizador_imagenes = AgenteAnalizadorImagenes()
agente_probabilistico = AgenteProbabilistico()
decisor = AgenteDecisor()

datos_actuales = {}
imagen_analizada = ""


def tarea_sensor_y_senales():
    global datos_actuales

    print("\nAgente Sensor iniciado...")
    time.sleep(2)

    datos_actuales = sensor.obtener_datos_actuales()
    hechos = analizador_senales.analizar(datos_actuales)

    with bloqueo:
        hechos_detectados.extend(hechos)

    print("Agente Sensor y Señales terminó.")


def tarea_imagenes():
    global imagen_analizada

    print("Agente Analizador de Imágenes iniciado...")
    time.sleep(3)

    imagen_analizada, hechos = analizador_imagenes.analizar_imagen()

    with bloqueo:
        hechos_detectados.extend(hechos)

    print("Agente de Imágenes terminó.")


inicio = time.time()

hilo1 = threading.Thread(target=tarea_sensor_y_senales)
hilo2 = threading.Thread(target=tarea_imagenes)

hilo1.start()
hilo2.start()

hilo1.join()
hilo2.join()

fin = time.time()


# ============================================================
# 5. SISTEMA EXPERTO + RAZONAMIENTO PROBABILÍSTICO
# ============================================================

riesgos = agente_probabilistico.evaluar_probabilidad(hechos_detectados)
recomendaciones = decisor.decidir(hechos_detectados, riesgos)

print("\nDATOS ACTUALES DEL ALMACÉN")
print(datos_actuales)

print("\nIMAGEN ANALIZADA")
print(imagen_analizada)

print("\nHECHOS DETECTADOS")
for hecho in hechos_detectados:
    print("-", hecho)

print("\nRIESGOS PROBABILÍSTICOS")
for riesgo, probabilidad in riesgos.items():
    print("-", riesgo, ":", int(probabilidad * 100), "%")

print("\nRECOMENDACIONES DEL SISTEMA")
for recomendacion in recomendaciones:
    print("-", recomendacion)

print("\nTiempo total concurrente:", round(fin - inicio, 2), "segundos")


# ============================================================
# 6. OPTIMIZACIÓN DE DESPACHO
# ============================================================

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

print("\nPEDIDOS EVALUADOS")
print(pedidos)

print("\nORDEN ÓPTIMO DE DESPACHO")
print(orden_optimo)

print("\nMEJOR PEDIDO PARA DESPACHAR")
print(orden_optimo.iloc[0])