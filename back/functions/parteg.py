import matplotlib.pyplot as plt
import networkx as nx

def sistemagraphic():
    # Crear grafo dirigido
    G = nx.DiGraph()

    # Proposiciones
    proposiciones = {
        "P": "Vibración\nanómala",
        "Q": "Riesgo\nmecánico",
        "R": "Temperatura\nalta",
        "S": "Humedad\nexcesiva",
        "T": "Alerta\nambiental",
        "U": "Paquete\ndañado",
        "V": "Revisión\nmanual",
        "W": "Zona\nsaturada",
        "X": "Ruta\nobstruida",
        "Y": "Reubicar\ncarga",
        "M": "Mantenimiento\npendiente",
        "Z": "Detener\nmaquinaria"
    }

    # Agregar nodos
    for simbolo, descripcion in proposiciones.items():
        G.add_node(simbolo, label=f"{simbolo}\n{descripcion}")

    # Reglas lógicas
    reglas = [
        ("P", "Q", "P → Q"),
        ("R", "T", "R ∧ S → T"),
        ("S", "T", "R ∧ S → T"),
        ("U", "V", "U → V"),
        ("W", "Y", "W ∧ X → Y"),
        ("X", "Y", "W ∧ X → Y"),
        ("Q", "Z", "Q ∧ M → Z"),
        ("M", "Z", "Q ∧ M → Z")
    ]

    # Agregar relaciones
    for origen, destino, regla in reglas:
        G.add_edge(origen, destino, label=regla)

    # Posiciones manuales para que se vea ordenado
    pos = {
        "P": (0, 4),
        "Q": (2, 4),
        "M": (2, 3),
        "Z": (4, 3.5),

        "R": (0, 2),
        "S": (0, 1),
        "T": (2, 1.5),

        "U": (0, -1),
        "V": (2, -1),

        "W": (0, -3),
        "X": (0, -4),
        "Y": (2, -3.5)
    }

    # Etiquetas de nodos
    labels = nx.get_node_attributes(G, "label")
    edge_labels = nx.get_edge_attributes(G, "label")

    fig, ax = plt.subplots(figsize=(14, 9))

    nx.draw(
        G,
        pos,
        labels=labels,
        with_labels=True,
        node_size=3500,
        node_color="lightblue",
        font_size=9,
        font_weight="bold",
        arrows=True,
        arrowsize=20
    )

    nx.draw_networkx_edge_labels(
        G,
        pos,
        edge_labels=edge_labels,
        font_size=8
    )
    
    ruta_grafo = "static/grafo_sistema_experto.png"
    plt.savefig(ruta_grafo)

    return {
        "titulo": "Grafo del sistema experto",
        "ruta_grafo": ruta_grafo,
        "proposiciones": [
            {"simbolo": "P", "descripcion": "Vibración anómala"},
            {"simbolo": "Q", "descripcion": "Riesgo mecánico"},
            {"simbolo": "R", "descripcion": "Temperatura alta"},
            {"simbolo": "S", "descripcion": "Humedad excesiva"},
            {"simbolo": "T", "descripcion": "Alerta ambiental"},
            {"simbolo": "U", "descripcion": "Paquete dañado"},
            {"simbolo": "V", "descripcion": "Revisión manual"},
            {"simbolo": "W", "descripcion": "Zona saturada"},
            {"simbolo": "X", "descripcion": "Ruta obstruida"},
            {"simbolo": "Y", "descripcion": "Reubicar carga"},
            {"simbolo": "M", "descripcion": "Mantenimiento pendiente"},
            {"simbolo": "Z", "descripcion": "Detener maquinaria"},
        ],
        "reglas": [
            {"origen": "P", "destino": "Q", "regla": "P → Q"},
            {"origen": "R", "destino": "T", "regla": "R ∧ S → T"},
            {"origen": "S", "destino": "T", "regla": "R ∧ S → T"},
            {"origen": "U", "destino": "V", "regla": "U → V"},
            {"origen": "W", "destino": "Y", "regla": "W ∧ X → Y"},
            {"origen": "X", "destino": "Y", "regla": "W ∧ X → Y"},
            {"origen": "Q", "destino": "Z", "regla": "Q ∧ M → Z"},
            {"origen": "M", "destino": "Z", "regla": "Q ∧ M → Z"},
        ],
    }