import pandas as pd

# Tabla de representación del conocimiento
def representar_conocimiento():
    conocimiento = {
        "Hecho": [
            "temperatura_alta",
            "humedad_excesiva",
            "vibracion_anomala",
            "paquete_danado",
            "zona_saturada",
            "ruta_obstruida",
            "prioridad_alta_pedido",
            "mantenimiento_pendiente"
        ],

        "Regla aplicada": [
            "Temperatura alta y humedad excesiva",
            "Temperatura alta y humedad excesiva",
            "Vibración anómala",
            "Paquete dañado",
            "Zona saturada y ruta obstruida",
            "Zona saturada y ruta obstruida",
            "Pedido prioritario y zona libre",
            "Mantenimiento pendiente y vibración anómala"
        ],

        "Conclusión": [
            "alerta_ambiental",
            "alerta_ambiental",
            "riesgo_mecanico",
            "revision_manual",
            "reubicar_carga",
            "reubicar_carga",
            "despacho_inmediato",
            "detener_maquinaria"
        ],

        "Acción recomendada": [
            "Activar ventilación",
            "Reducir humedad",
            "Revisar maquinaria",
            "Inspeccionar paquete",
            "Mover mercancía",
            "Despejar ruta",
            "Priorizar despacho",
            "Detener equipo"
        ]
    }

    # Crear DataFrame
    tabla_conocimiento = pd.DataFrame(conocimiento)

    # Mostrar tabla completa
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)

    return tabla_conocimiento.to_dict(orient="records")