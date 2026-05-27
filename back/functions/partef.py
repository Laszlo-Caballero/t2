import random

class AgenteSensor:
    def generar_datos(self, temperatura, humedad, vibracion, ocupacion):
        return {
            "temperatura": temperatura,
            "humedad": humedad,
            "vibracion": vibracion,
            "ocupacion": ocupacion
        }


class AgenteAnalizadorSenales:
    def analizar(self, datos):
        hechos = []

        if datos["temperatura"] > 32:
            hechos.append("temperatura_alta")

        if datos["humedad"] > 70:
            hechos.append("humedad_excesiva")

        if datos["vibracion"] > 5:
            hechos.append("vibracion_anomala")

        if datos["ocupacion"] > 85:
            hechos.append("zona_saturada")
        else:
            hechos.append("zona_libre")

        return hechos


class AgenteAnalizadorImagenes:

    def analizar_imagen(self, imagen):

        hechos = []

        nombre = imagen.lower()

        # ----------------------------
        # Detectar paquete dañado
        # ----------------------------
        if (
            "paquete_danado" in nombre or
            "danado" in nombre or
            "roto" in nombre
        ):

            hechos.append("paquete_danado")

        else:

            hechos.append("paquete_correcto")

        # ----------------------------
        # Detectar ruta obstruida
        # ----------------------------
        if (
            "zona_obstruida" in nombre or
            "ruta_obstruida" in nombre or
            "obstruida" in nombre or
            "bloqueada" in nombre
        ):

            hechos.append("ruta_obstruida")

        else:

            hechos.append("ruta_libre")

        return hechos

class AgenteDecisor:
    def decidir(self, hechos):
        recomendaciones = []

        if "vibracion_anomala" in hechos:
            recomendaciones.append("Riesgo mecánico: revisar fajas o estanterías.")

        if "temperatura_alta" in hechos and "humedad_excesiva" in hechos:
            recomendaciones.append("Alerta ambiental: activar ventilación y control de humedad.")

        if "paquete_danado" in hechos:
            recomendaciones.append("Revisión manual: inspeccionar paquete dañado.")

        if "zona_saturada" in hechos and "ruta_obstruida" in hechos:
            recomendaciones.append("Reubicar carga: despejar ruta y reorganizar zona.")

        if "prioridad_alta_pedido" in hechos and "zona_libre" in hechos:
            recomendaciones.append("Despacho inmediato: pedido prioritario puede salir.")

        if "mantenimiento_pendiente" in hechos and "vibracion_anomala" in hechos:
            recomendaciones.append("Detener maquinaria: posible falla crítica.")

        if len(recomendaciones) == 0:
            recomendaciones.append("Estado normal del almacén.")

        return recomendaciones


def sistema_multiagente(temperatura, humedad, vibracion, ocupacion, imagen, hechos_extra=None):
    if hechos_extra is None:
        hechos_extra = []

    sensor = AgenteSensor()
    analizador_senales = AgenteAnalizadorSenales()
    analizador_imagenes = AgenteAnalizadorImagenes()
    decisor = AgenteDecisor()

    datos = sensor.generar_datos(
        temperatura,
        humedad,
        vibracion,
        ocupacion
    )

    hechos_sensores = analizador_senales.analizar(datos)
    hechos_imagen = analizador_imagenes.analizar_imagen(imagen)

    hechos_totales = hechos_sensores + hechos_imagen + hechos_extra

    recomendaciones = decisor.decidir(hechos_totales)
    
    return {
        "datos": datos,
        "imagen": imagen,
        "hechos_sensores": hechos_sensores,
        "hechos_imagen": hechos_imagen,
        "hechos_extra": hechos_extra,
        "hechos_totales": hechos_totales,
        "recomendaciones": recomendaciones,
    }


def ejecutar_ejemplo(nombre, temperatura, humedad, vibracion, ocupacion, imagen, hechos_extra=[]):
    sensor = AgenteSensor()
    analizador_senales = AgenteAnalizadorSenales()
    analizador_imagenes = AgenteAnalizadorImagenes()
    decisor = AgenteDecisor()

    datos = sensor.generar_datos(
        temperatura,
        humedad,
        vibracion,
        ocupacion
    )

    hechos_sensores = analizador_senales.analizar(datos)
    hechos_imagen = analizador_imagenes.analizar_imagen(imagen)

    hechos_totales = hechos_sensores + hechos_imagen + hechos_extra

    recomendaciones = decisor.decidir(hechos_totales)

    print("\n==============================")
    print(nombre)
    print("==============================")

    print("\nDATOS DEL AGENTE SENSOR:")
    print(datos)

    print("\nIMAGEN ANALIZADA:")
    print(imagen)

    print("\nHECHOS DETECTADOS:")
    for hecho in hechos_totales:
        print("-", hecho)

    print("\nRECOMENDACIONES:")
    for recomendacion in recomendaciones:
        print("-", recomendacion)


if __name__ == "__main__":
    # Ejemplo 1: paquete dañado y vibración anómala
    ejecutar_ejemplo(
        "EJEMPLO 1: Paquete dañado y riesgo mecánico",
        temperatura=30,
        humedad=61,
        vibracion=6.3,
        ocupacion=70,
        imagen="paquete_danado.jpg",
        hechos_extra=["mantenimiento_pendiente"]
    )

    # Ejemplo 2: zona obstruida y zona saturada
    ejecutar_ejemplo(
        "EJEMPLO 2: Zona obstruida y saturada",
        temperatura=27,
        humedad=59,
        vibracion=3.4,
        ocupacion=93,
        imagen="zona_obstruida.jpg"
    )

    # Ejemplo 3: paquete bueno y pedido prioritario
    ejecutar_ejemplo(
        "EJEMPLO 3: Paquete bueno y despacho inmediato",
        temperatura=24,
        humedad=54,
        vibracion=2.2,
        ocupacion=55,
        imagen="paquete_bueno.jpg",
        hechos_extra=["prioridad_alta_pedido"]
    )

    # Ejemplo 4: alerta ambiental y paquete dañado
    ejecutar_ejemplo(
        "EJEMPLO 4: Alerta ambiental y paquete dañado",
        temperatura=38,
        humedad=84,
        vibracion=4.5,
        ocupacion=76,
        imagen="paquete_danado.jpg"
    )

    # Ejemplo 5: situación crítica completa
    ejecutar_ejemplo(
        "EJEMPLO 5: Situación crítica del almacén",
        temperatura=36,
        humedad=79,
        vibracion=7.1,
        ocupacion=96,
        imagen="zona_obstruida.jpg",
        hechos_extra=["mantenimiento_pendiente"]
    )