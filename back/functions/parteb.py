import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def _generar_senales_base(registros: int = 120, seed: int | None = None):
    if seed is not None:
        np.random.seed(seed)

    tiempo = np.arange(1, registros + 1)
    temperatura = np.random.normal(24, 3, registros)
    vibracion = np.random.normal(2.5, 0.7, registros)

    temperatura[30] = 36
    temperatura[85] = 38
    vibracion[45] = 6.5
    vibracion[90] = 7.2

    return temperatura, vibracion, tiempo


def analizar_senales(
    temperatura: np.ndarray | list | None = None,
    vibracion: np.ndarray | list | None = None,
    tiempo: np.ndarray | list | None = None,
    a_temp: float = 32.0,
    a_vib: float = 5.0,
):

    if temperatura is None or vibracion is None or tiempo is None:
        temperatura, vibracion, tiempo = _generar_senales_base()

    temperatura = np.asarray(temperatura)
    vibracion = np.asarray(vibracion)
    tiempo = np.asarray(tiempo)

    # Crear DataFrame
    datos = pd.DataFrame({
        "Tiempo": tiempo,
        "Temperatura": np.round(temperatura, 2),
        "Vibracion": np.round(vibracion, 2)
    })

    # ----------------------------
    # Señal de temperatura
    # ----------------------------
    temp, ax = plt.subplots(figsize=(10,5))

    ax.plot(
        datos["Tiempo"],
        datos["Temperatura"],
        label="Temperatura",
        color="blue"
    )

    # Línea límite
    ax.axhline(
        y=a_temp,
        color="red",
        linestyle="--",
        label="Límite crítico"
    )

    ax.set_title("Señal temporal de temperatura")
    ax.set_xlabel("Tiempo")
    ax.set_ylabel("Temperatura (°C)")
    ax.legend()
    ax.grid()

    ruta_temp = "static/temperatura-b.png"
    temp.savefig(ruta_temp)

    # ----------------------------
    # Señal de vibración
    # ----------------------------

    vib, ax2 = plt.subplots(figsize=(10,5))

    ax2.plot(
        datos["Tiempo"],
        datos["Vibracion"],
        label="Vibración",
        color="orange"
    )

    # Línea límite
    ax2.axhline(
        y=a_vib,
        color="red",
        linestyle="--",
        label="Límite crítico"
    )

    ax2.set_title("Señal temporal de vibración")
    ax2.set_xlabel("Tiempo")
    ax2.set_ylabel("Nivel de vibración")
    ax2.legend()
    ax2.grid()
    ruta_vib = "static/vibracion-b.png"
    vib.savefig(ruta_vib)


    # ----------------------------
    # Detección de anomalías
    # ----------------------------

    anomalias_temperatura = datos[
        datos["Temperatura"] > a_temp
    ]

    anomalias_vibracion = datos[
        datos["Vibracion"] > a_vib
    ]

    return {
        "anomalias_temperatura": anomalias_temperatura.to_dict(orient="records"),
        "anomalias_vibracion": anomalias_vibracion.to_dict(orient="records"),
        "temperatura": temperatura.tolist(),
        "vibracion": vibracion.tolist(),
        "tiempo": tiempo.tolist(),
        "ruta_temperatura": ruta_temp,
        "ruta_vibracion": ruta_vib
    }