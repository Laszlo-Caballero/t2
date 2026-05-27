import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Para que los números aleatorios sean iguales cada vez que ejecutes
def simular_datos(seed: int = 10):
    np.random.seed(seed)

    # Cantidad de registros
    registros = 120

    # Tiempo de simulación
    tiempo = np.arange(1, registros + 1)

    # Generar datos simulados
    temperatura = np.random.normal(24, 3, registros)
    humedad = np.random.normal(55, 8, registros)
    vibracion = np.random.normal(2.5, 0.7, registros)
    ocupacion = np.random.randint(40, 100, registros)

    # Agregar anomalías manuales
    temperatura[30] = 36
    temperatura[85] = 38

    vibracion[45] = 6.5
    vibracion[90] = 7.2

    # Crear DataFrame
    datos = pd.DataFrame({
        "Tiempo": tiempo,
        "Temperatura": np.round(temperatura, 2),
        "Humedad": np.round(humedad, 2),
        "Vibracion": np.round(vibracion, 2),
        "Ocupacion": ocupacion
    })

    # Mostrar TODA la tabla
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)

    # Graficar temperatura
    temp, ax = plt.subplots(figsize=(10,5))
    ax.plot(datos["Tiempo"], datos["Temperatura"], marker='o')
    ax.set_title("Temperatura del almacén")
    ax.set_xlabel("Tiempo")
    ax.set_ylabel("Temperatura")
    ax.grid()
    
    ruta_figa = "static/temperatura.png"
    temp.savefig(ruta_figa)
    
    
    # Graficar vibración
    vib, ax2 = plt.subplots(figsize=(10,5))
    ax2.plot(datos["Tiempo"], datos["Vibracion"], color='red', marker='o')
    ax2.set_title("Vibración de estanterías")
    ax2.set_xlabel("Tiempo")
    ax2.set_ylabel("Vibración")
    ax2.grid()
    
    ruta_figb = "static/vibracion.png"
    vib.savefig(ruta_figb)
    

    
    return {
        "datos": datos.to_dict(orient="records"),
        "ruta_temperatura": ruta_figa,
        "ruta_vibracion": ruta_figb,
        "temperatura": temperatura.tolist(),
        "vibracion": vibracion.tolist(),
        "tiempo": tiempo.tolist()
    }