import cv2
import numpy as np
from typing import List
from fastapi import UploadFile

async def analizar_imagenes(
    imagenes: List[UploadFile]
):
    imagenes_procesadas = []
    i = 0 
    for archivo in imagenes:

        # Leer archivo
        bytes_data = await archivo.read()

        # Convertir bytes a numpy array
        file_bytes = np.frombuffer(
            bytes_data,
            np.uint8
        )

        # Decodificar imagen
        imagen = cv2.imdecode(
            file_bytes,
            cv2.IMREAD_COLOR
        )

        if imagen is None:
            print(f"No se pudo cargar: {archivo.filename}")
            continue

        # Escala de grises
        gris = cv2.cvtColor(
            imagen,
            cv2.COLOR_BGR2GRAY
        )

        # Umbralización
        _, umbral = cv2.threshold(
            gris,
            127,
            255,
            cv2.THRESH_BINARY
        )

        # Bordes Canny
        canny = cv2.Canny(
            gris,
            100,
            200
        )

        ruta = f"static/parte-c/"
        cv2.imwrite(f"{ruta}imagen-{i}-gris.png", gris)
        cv2.imwrite(f"{ruta}imagen-{i}-umbral.png", umbral)
        cv2.imwrite(f"{ruta}imagen-{i}-canny.png", canny)

        imagenes_procesadas.append({
            "nombre": archivo.filename,
            "ruta_gris": f"{ruta}imagen-{i}-gris.png",
            "ruta_umbral": f"{ruta}imagen-{i}-umbral.png",
            "ruta_canny": f"{ruta}imagen-{i}-canny.png"
        })
        i += 1

    return imagenes_procesadas