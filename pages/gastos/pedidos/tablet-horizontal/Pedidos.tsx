"use client";

import { useState, useEffect } from "react";
import { PedidosList } from "../components/PedidosList";
import { fetchPurchaseOrders } from "../../../../lib/mocks/purchaseOrdersMocks";
import { PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";

/**
 * Página de Pedidos de Compra - Versión Tablet Horizontal (1024px - 1280px)
 * Layout: 70/30 horizontal - Listado (70%) + Charts (30%)
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
  borderStyle?: "dashed" | "solid";
  borderWidth?: string;
}

function SpaceBlock({
  label,
  width = "100%",
  height = "200px",
  color = "var(--background-secondary)",
  description,
  borderStyle = "dashed",
  borderWidth = "2px"
}: SpaceBlockProps) {
  return (
    <div
      style={{
        width,
        height,
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
          fontSize: "11px",
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

export function PedidosTabletHorizontal() {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "var(--spacing-xs)",
        padding: "var(--spacing-xs)",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Listado - 70% */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xs)",
          width: "70%",
          height: "100%",
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

      {/* Charts - 30% */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xs)",
          width: "30%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Título */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "var(--spacing-xs)",
            height: "35px",
            flexShrink: 0,
          }}
        >
          <SpaceBlock
            label="Resumen"
            height="100%"
            color="var(--background-secondary)"
            description="Resumen"
          />
          <SpaceBlock
            label="Filtro"
            height="100%"
            color="rgba(255, 165, 0, 0.15)"
            description="Filtro"
          />
        </div>
        {/* Tarjetas compactas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--spacing-xs)",
            flexShrink: 0,
          }}
        >
          <SpaceBlock
            label="Total Pedidos"
            height="60px"
            color="rgba(0, 200, 117, 0.2)"
            borderWidth="2px"
          />
          <SpaceBlock
            label="Pedidos del Mes"
            height="60px"
            color="rgba(67, 83, 255, 0.2)"
            borderWidth="2px"
          />
        </div>
        {/* Gráficos */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
          }}
        >
          <SpaceBlock
            label="Gráfico: Pedidos por Proveedor"
            height="100%"
            color="rgba(67, 83, 255, 0.15)"
            description="Gráfico"
          />
        </div>
      </div>
    </div>
  );
}
