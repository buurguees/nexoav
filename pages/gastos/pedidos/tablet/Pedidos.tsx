"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTabletSize } from "../../../../hooks/useTabletSize";
import { PedidosList } from "../components/PedidosList";
import { fetchPurchaseOrders } from "../../../../lib/mocks/purchaseOrdersMocks";
import { PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";

/**
 * Página de Pedidos de Compra - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait:
 * - Header: Filtros, Título, Herramientas
 * - 3 Tarjetas de Información (en fila)
 * - Listado de Pedidos (con scroll)
 * - Gráficos en la parte inferior
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
  borderStyle?: "dashed" | "solid";
  borderWidth?: string;
  fontSize?: string;
}

function SpaceBlock({
  label,
  width = "100%",
  height = "200px",
  color = "var(--background-secondary)",
  description,
  borderStyle = "dashed",
  borderWidth = "2px",
  fontSize = "11px"
}: SpaceBlockProps) {
  return (
    <div
      style={{
        width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundColor: color,
        border: `${borderWidth} ${borderStyle} var(--border-medium)`,
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-xs)",
        position: "relative",
        minHeight: typeof height === "number" ? `${height}px` : height,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: fontSize,
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--foreground-secondary)",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: "9px",
            color: "var(--foreground-tertiary)",
            textAlign: "center",
            marginTop: "var(--spacing-xs)",
            maxWidth: "80%",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}

export function PedidosTablet() {
  const tabletSize = useTabletSize();
  const [pedidos, setPedidos] = useState<PurchaseOrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPedidos() {
      try {
        setIsLoading(true);
        const data = await fetchPurchaseOrders();
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPedidos();
  }, []);

  const handlePedidoClick = (pedido: PurchaseOrderData) => {
    console.log("Pedido seleccionado:", pedido);
  };

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      cardsHeight: "100px",
      chartsHeight: "180px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      cardsHeight: "120px",
      chartsHeight: "200px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      cardsHeight: "140px",
      chartsHeight: "220px",
      fontSize: "11px",
    },
  };

  const currentConfig = config[tabletSize];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: currentConfig.gap,
        padding: currentConfig.padding,
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* 3 Tarjetas - Primeras 3 de desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: currentConfig.gap,
          height: currentConfig.cardsHeight,
          flexShrink: 0,
          minHeight: currentConfig.cardsHeight,
        }}
      >
        <SpaceBlock
          label="Tarjeta 1: Total Pedidos"
          height="100%"
          color="rgba(0, 200, 117, 0.2)"
          description="Total de pedidos registrados. Indicador de tendencia."
          borderWidth="2px"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Tarjeta 2: Pedidos del Mes"
          height="100%"
          color="rgba(67, 83, 255, 0.2)"
          description="Pedidos del mes actual. Comparación con mes anterior."
          borderWidth="2px"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Tarjeta 3: Por Proveedor"
          height="100%"
          color="rgba(255, 165, 0, 0.2)"
          description="Distribución de pedidos por proveedor principal."
          borderWidth="2px"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Listado */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--foreground-secondary)",
            }}
          >
            Cargando pedidos...
          </div>
        ) : (
          <PedidosList
            pedidos={pedidos}
            showFilters={true}
            showTools={true}
            onPedidoClick={handlePedidoClick}
          />
        )}
      </div>

      {/* Gráficos en la parte inferior */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: currentConfig.gap,
          height: currentConfig.chartsHeight,
          flexShrink: 0,
          minHeight: currentConfig.chartsHeight,
        }}
      >
        {/* Columna izquierda: Gráfico de Barras + Gráfico de Líneas */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: currentConfig.gap,
            height: "100%",
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              flex: "1 1 50%",
              minHeight: 0,
            }}
          >
            <SpaceBlock
              label="Gráfico Barras: Pedidos por Proveedor"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Distribución de pedidos por proveedor en el período seleccionado."
              fontSize={currentConfig.fontSize}
            />
          </div>
          <div
            style={{
              width: "100%",
              flex: "1 1 50%",
              minHeight: 0,
            }}
          >
            <SpaceBlock
              label="Gráfico Líneas: Evolución Temporal"
              height="100%"
              color="rgba(0, 200, 117, 0.15)"
              description="Evolución de pedidos a lo largo del tiempo."
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>
        {/* Columna derecha: Pie Chart */}
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SpaceBlock
            label="Pie Chart: Distribución de Pedidos"
            height="100%"
            color="rgba(156, 81, 224, 0.15)"
            description="Distribución porcentual de pedidos por proveedor."
            fontSize={currentConfig.fontSize}
          />
        </div>
      </div>
    </motion.div>
  );
}
