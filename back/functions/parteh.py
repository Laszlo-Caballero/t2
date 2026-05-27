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

# print("RAZONAMIENTO PROBABILÍSTICO DEL ALMACÉN\n")

# for situacion, probabilidad in situaciones.items():
#     decision = evaluar_riesgo(probabilidad)

#     print("Situación:", situacion)
#     print("Probabilidad:", int(probabilidad * 100), "%")
#     print("Decisión:", decision)
#     print("-----------------------------")