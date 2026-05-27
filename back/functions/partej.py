import threading
import time
import random

def ejecutar_paralelo():
    hechos_detectados = []
    bloqueo = threading.Lock()
    logs = []
    
    inicio = time.time()
    
    def log(msg):
        with bloqueo:
            logs.append(f"[{time.time() - inicio:.2f}s] {msg}")

    def agente_sensor():
        log("Agente Sensor iniciado (Tomará ~2s)")
        temperatura = random.randint(20, 40)
        humedad = random.randint(40, 90)
        vibracion = round(random.uniform(1, 8), 2)
        ocupacion = random.randint(40, 100)
        
        time.sleep(2)
        
        datos = {
            "Temperatura": temperatura,
            "Humedad": humedad,
            "Vibración": vibracion,
            "Ocupación": ocupacion
        }
        
        with bloqueo:
            if temperatura > 32: hechos_detectados.append("temperatura_alta")
            if humedad > 70: hechos_detectados.append("humedad_excesiva")
            if vibracion > 5: hechos_detectados.append("vibracion_anomala")
            if ocupacion > 85: hechos_detectados.append("zona_saturada")
            else: hechos_detectados.append("zona_libre")
            
        log(f"Agente Sensor terminó. Datos: {datos}")

    def agente_imagenes():
        log("Agente Analizador de Imágenes iniciado (Tomará ~3s)")
        imagenes = ["paquete_bueno.jpg", "paquete_danado.jpg", "zona_obstruida.jpg"]
        imagen = random.choice(imagenes)
        
        time.sleep(1)
        
        with bloqueo:
            if imagen == "paquete_danado.jpg": hechos_detectados.append("paquete_danado")
            elif imagen == "zona_obstruida.jpg": hechos_detectados.append("ruta_obstruida")
            elif imagen == "paquete_bueno.jpg": hechos_detectados.append("paquete_correcto")
            
        log(f"Agente Analizador de Imágenes terminó. Imagen: {imagen}")

    def agente_decisor():
        log("Agente Decisor evaluando hechos integrados...")
        recomendaciones = []
        if "vibracion_anomala" in hechos_detectados:
            recomendaciones.append("Revisar fajas o estanterías por riesgo mecánico.")
        if "temperatura_alta" in hechos_detectados and "humedad_excesiva" in hechos_detectados:
            recomendaciones.append("Activar ventilación y control de humedad.")
        if "paquete_danado" in hechos_detectados:
            recomendaciones.append("Enviar paquete a revisión manual.")
        if "zona_saturada" in hechos_detectados and "ruta_obstruida" in hechos_detectados:
            recomendaciones.append("Reubicar carga y despejar ruta.")
        if "zona_libre" in hechos_detectados and "paquete_correcto" in hechos_detectados:
            recomendaciones.append("Continuar operación normal o despachar pedido.")
        if len(recomendaciones) == 0:
            recomendaciones.append("No se detectaron riesgos críticos.")
        
        return recomendaciones

    # Ejecución concurrente
    hilo_sensor = threading.Thread(target=agente_sensor)
    hilo_imagenes = threading.Thread(target=agente_imagenes)
    
    hilo_sensor.start()
    hilo_imagenes.start()
    
    hilo_sensor.join()
    hilo_imagenes.join()
    
    recomendaciones = agente_decisor()
    
    fin = time.time()
    tiempo_total = fin - inicio
    
    return {
        "hechos_detectados": hechos_detectados,
        "recomendaciones": recomendaciones,
        "logs": logs,
        "tiempo_total": tiempo_total
    }
