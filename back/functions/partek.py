import pandas as pd
from model.partek_model import PedidosIniciales

def obtener_datos_iniciales(datos: PedidosIniciales | None = None):
    if datos is not None:
        datos_dict = datos.model_dump() if hasattr(datos, "model_dump") else datos.dict()
        return pd.DataFrame(datos_dict)
    
    return pd.DataFrame({
        "Pedido": ["P001", "P002", "P003", "P004", "P005"],
        "Prioridad": [9, 6, 8, 10, 7],
        "Tiempo_espera": [15, 40, 25, 10, 35],
        "Distancia": [12, 8, 20, 6, 10],
        "Paquete_danado": [False, False, True, False, False],
        "Zona_saturada": [False, False, False, True, False]
    })

def optimizar_pedidos(df_pedidos):
    # Calcular puntaje de optimización
    df_pedidos["Puntaje"] = (
        df_pedidos["Prioridad"] * 0.5 +
        df_pedidos["Tiempo_espera"] * 0.3 -
        df_pedidos["Distancia"] * 0.2
    )

    # Aplicar restricciones
    pedidos_validos = df_pedidos[
        (df_pedidos["Paquete_danado"] == False) &
        (df_pedidos["Zona_saturada"] == False)
    ]

    # Ordenar por mayor puntaje
    pedidos_ordenados = pedidos_validos.sort_values(
        by="Puntaje",
        ascending=False
    )
    
    mejor_alternativa = None
    if not pedidos_ordenados.empty:
        mejor_alternativa = pedidos_ordenados.iloc[0]

    return {
        "df_pedidos": df_pedidos.to_dict(orient="records"),
        "pedidos_validos": pedidos_validos.to_dict(orient="records"),
        "pedidos_ordenados": pedidos_ordenados.to_dict(orient="records"),
        "mejor_alternativa": mejor_alternativa.to_dict() if mejor_alternativa is not None else None
    }
