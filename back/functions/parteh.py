situaciones = {
    "vibracion_anomala": 0.75,
    "paquete_deformado": 0.80,
    "temperatura_alta_sostenida": 0.70,
    "zona_saturada": 0.65,
    "ruta_obstruida": 0.85
}

def evaluar_riesgo(probabilidad):
    if probabilidad < 0.50:
        return "Monitorear situación"
    elif probabilidad < 0.70:
        return "Emitir advertencia"
    elif probabilidad < 0.85:
        return "Generar alerta"
    else:
        return "Acción inmediata"

def evaluar_probabilidades(hechos):

    probabilidades = {}

    if "vibracion_anomala" in hechos:
        probabilidades["falla_mecanica"] = {
            "probabilidad": 75,
            "justificacion": "La vibración elevada puede indicar desgaste o falla mecánica."
        }

    if "paquete_danado" in hechos:
        probabilidades["danio_paquete"] = {
            "probabilidad": 80,
            "justificacion": "El paquete presenta señales visuales de daño."
        }

    if "temperatura_alta" in hechos:
        probabilidades["riesgo_operativo"] = {
            "probabilidad": 70,
            "justificacion": "La temperatura elevada puede afectar equipos y productos."
        }

    if "humedad_excesiva" in hechos:
        probabilidades["deterioro_productos"] = {
            "probabilidad": 72,
            "justificacion": "La humedad alta puede deteriorar cajas, empaques o productos."
        }

    if "ruta_obstruida" in hechos:
        probabilidades["retraso_logistico"] = {
            "probabilidad": 68,
            "justificacion": "La obstrucción dificulta el transporte interno de mercancía."
        }

    if "zona_saturada" in hechos:
        probabilidades["congestion_almacen"] = {
            "probabilidad": 77,
            "justificacion": "El exceso de ocupación incrementa el riesgo de congestión y accidentes."
        }

    if "mantenimiento_pendiente" in hechos:
        probabilidades["parada_maquinaria"] = {
            "probabilidad": 83,
            "justificacion": "La falta de mantenimiento aumenta la probabilidad de fallas críticas."
        }

    if "temperatura_alta" in hechos and "humedad_excesiva" in hechos:
        probabilidades["riesgo_ambiental_critico"] = {
            "probabilidad": 90,
            "justificacion": "La combinación de temperatura y humedad elevadas genera un entorno crítico."
        }

    if "paquete_danado" in hechos and "ruta_obstruida" in hechos:
        probabilidades["demora_entrega"] = {
            "probabilidad": 74,
            "justificacion": "Los daños y obstrucciones pueden retrasar el despacho del pedido."
        }

    return probabilidades



# print("RAZONAMIENTO PROBABILÍSTICO DEL ALMACÉN\n")

# for situacion, probabilidad in situaciones.items():
#     decision = evaluar_riesgo(probabilidad)

#     print("Situación:", situacion)
#     print("Probabilidad:", int(probabilidad * 100), "%")
#     print("Decisión:", decision)
#     print("-----------------------------")