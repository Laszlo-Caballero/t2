# pyright: reportUndefinedVariable=false
from pyDatalog import pyDatalog

pyDatalog.create_terms('X')

pyDatalog.create_terms('''
temperatura_alta,
humedad_excesiva,
vibracion_anomala,
zona_saturada,
paquete_danado,
ruta_obstruida,
prioridad_alta_pedido,
mantenimiento_pendiente,
zona_libre,

riesgo_mecanico,
alerta_ambiental,
revision_manual,
reubicar_carga,
despacho_inmediato,
detener_maquinaria
''')


def _consultar_regla(regla: str):
    resultado = pyDatalog.ask(f"{regla}(X)")
    if not resultado:
        return []

    return [valor[0] for valor in resultado.answers]

def sistema_experto():
    pyDatalog.clear()

    # ------------------------------------------------
    # Hechos
    # ------------------------------------------------

    + temperatura_alta("Almacen1")

    + humedad_excesiva("Almacen1")

    + vibracion_anomala("Faja1")

    + zona_saturada("ZonaCarga")

    + paquete_danado("Paquete45")

    + ruta_obstruida("RutaA")

    + prioridad_alta_pedido("Pedido900")

    + mantenimiento_pendiente("Maquina8")

    + zona_libre("ZonaExpress")

    hechos = [
        {"predicado": "temperatura_alta", "valor": "Almacen1"},
        {"predicado": "humedad_excesiva", "valor": "Almacen1"},
        {"predicado": "vibracion_anomala", "valor": "Faja1"},
        {"predicado": "zona_saturada", "valor": "ZonaCarga"},
        {"predicado": "paquete_danado", "valor": "Paquete45"},
        {"predicado": "ruta_obstruida", "valor": "RutaA"},
        {"predicado": "prioridad_alta_pedido", "valor": "Pedido900"},
        {"predicado": "mantenimiento_pendiente", "valor": "Maquina8"},
        {"predicado": "zona_libre", "valor": "ZonaExpress"},
    ]

    # ------------------------------------------------
    # Reglas
    # ------------------------------------------------

    # Regla 1
    riesgo_mecanico(X) <= vibracion_anomala(X)

    # Regla 2
    alerta_ambiental(X) <= (
        temperatura_alta(X) &
        humedad_excesiva(X)
    )

    # Regla 3
    revision_manual(X) <= paquete_danado(X)

    # Regla 4
    reubicar_carga(X) <= (
        zona_saturada(X) &
        ruta_obstruida("RutaA")
    )

    # Regla 5
    despacho_inmediato(X) <= (
        prioridad_alta_pedido(X) &
        zona_libre("ZonaExpress")
    )

    # Regla 6
    detener_maquinaria(X) <= (
        mantenimiento_pendiente(X) &
        vibracion_anomala("Faja1")
    )

    reglas = [
        {
            "nombre": "riesgo_mecanico",
            "si": ["vibracion_anomala(X)"],
            "entonces": "riesgo_mecanico(X)",
        },
        {
            "nombre": "alerta_ambiental",
            "si": ["temperatura_alta(X)", "humedad_excesiva(X)"],
            "entonces": "alerta_ambiental(X)",
        },
        {
            "nombre": "revision_manual",
            "si": ["paquete_danado(X)"],
            "entonces": "revision_manual(X)",
        },
        {
            "nombre": "reubicar_carga",
            "si": ["zona_saturada(X)", "ruta_obstruida(RutaA)"],
            "entonces": "reubicar_carga(X)",
        },
        {
            "nombre": "despacho_inmediato",
            "si": ["prioridad_alta_pedido(X)", "zona_libre(ZonaExpress)"],
            "entonces": "despacho_inmediato(X)",
        },
        {
            "nombre": "detener_maquinaria",
            "si": ["mantenimiento_pendiente(X)", "vibracion_anomala(Faja1)"],
            "entonces": "detener_maquinaria(X)",
        },
    ]

    # ------------------------------------------------
    # Consultas
    # ------------------------------------------------

    return {
        "hechos": hechos,
        "reglas": reglas,
        "riesgo_mecanico": _consultar_regla("riesgo_mecanico"),
        "alerta_ambiental": _consultar_regla("alerta_ambiental"),
        "revision_manual": _consultar_regla("revision_manual"),
        "reubicar_carga": _consultar_regla("reubicar_carga"),
        "despacho_inmediato": _consultar_regla("despacho_inmediato"),
        "detener_maquinaria": _consultar_regla("detener_maquinaria"),
    }