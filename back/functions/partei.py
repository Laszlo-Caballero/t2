import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyArrowPatch

def generar_diagrama_interaccion():
    fig, ax = plt.subplots(figsize=(16, 9))

    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)

    # Fondo blanco
    ax.set_facecolor("white")
    fig.patch.set_facecolor("white")

    ax.axis("off")

    # ------------------------------------------------
    # PARTICIPANTES
    # ------------------------------------------------

    participantes = [
        "Agente\nSensor",
        "Analizador\nde Señales",
        "Analizador\nde Imágenes",
        "Agente\nCoordinador",
        "Agente\nDecisor",
        "Sistema de\nAlertas"
    ]

    x_pos = [1, 4, 7, 10, 13, 15]

    # ------------------------------------------------
    # ENCABEZADOS Y LÍNEAS DE VIDA
    # ------------------------------------------------

    for x, nombre in zip(x_pos, participantes):

        # Caja superior
        ax.add_patch(
            Rectangle(
                (x - 0.8, 9.1),
                1.6,
                0.6,
                facecolor="#EAEAEA",
                edgecolor="black",
                linewidth=1.5
            )
        )

        ax.text(
            x,
            9.4,
            nombre,
            ha="center",
            va="center",
            fontsize=9,
            fontweight="bold",
            color="black"
        )

        # Línea de vida
        ax.plot(
            [x, x],
            [1, 9.1],
            linestyle="--",
            color="gray",
            linewidth=1.2
        )

    # ------------------------------------------------
    # FUNCIÓN FLECHAS
    # ------------------------------------------------

    def mensaje(x1, y, x2, texto):

        flecha = FancyArrowPatch(
            (x1, y),
            (x2, y),
            arrowstyle="->",
            mutation_scale=15,
            linewidth=1.5,
            color="black"
        )

        ax.add_patch(flecha)

        ax.text(
            (x1 + x2) / 2,
            y + 0.18,
            texto,
            ha="center",
            fontsize=8,
            bbox=dict(
                facecolor="white",
                edgecolor="none"
            )
        )

    # ------------------------------------------------
    # FUNCIÓN ACTIVACIONES
    # ------------------------------------------------

    def activacion(x, y1, y2):

        ax.add_patch(
            Rectangle(
                (x - 0.08, y2),
                0.16,
                y1 - y2,
                facecolor="#D9D9D9",
                edgecolor="black",
                linewidth=0.8
            )
        )

    # ------------------------------------------------
    # ACTIVACIONES
    # ------------------------------------------------

    activacion(1, 8.7, 1.3)
    activacion(4, 7.8, 6.2)
    activacion(7, 7.0, 5.7)
    activacion(10, 7.4, 4.0)
    activacion(13, 5.8, 3.7)
    activacion(15, 3.3, 2.6)

    # ------------------------------------------------
    # MENSAJES
    # ------------------------------------------------

    mensaje(
        1,
        8.3,
        4,
        "datos numéricos"
    )

    mensaje(
        4,
        7.3,
        10,
        "hechos detectados"
    )

    mensaje(
        7,
        6.4,
        10,
        "hechos visuales"
    )

    mensaje(
        10,
        5.2,
        13,
        "hechos integrados"
    )

    mensaje(
        13,
        4.2,
        10,
        "recomendaciones"
    )

    mensaje(
        10,
        3.0,
        15,
        "acción final priorizada"
    )

    # ------------------------------------------------
    # TÍTULO
    # ------------------------------------------------

    plt.title(
        "Diagrama de secuencia del sistema multiagente",
        fontsize=15,
        fontweight="bold"
    )

    
    ruta_diagrama = "static/diagrama_interaccion.png"
    plt.savefig(ruta_diagrama)
    
    return {
        "titulo": "Diagrama de interacción del sistema multiagente",
        "ruta_diagrama": ruta_diagrama
    }
    