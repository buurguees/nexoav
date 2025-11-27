"use client";

import { useState, useEffect } from "react";
import { PedidosList } from "../components/PedidosList";
import { fetchPurchaseOrders } from "../../../../lib/mocks/purchaseOrdersMocks";
import { PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";

/**
 * Página de Pedidos de Compra - Versión Mobile (< 768px)
 * Layout: Listado completo con título, filtros, herramientas (prioridad máxima)
 * Charts opcionales y muy compactos arriba
 */

/**
 * Hook para detectar el tamaño de pantalla mobile
 */
function useMobileSize() {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>(() => {
    if (typeof window === 'undefined') return 'medium';
    const width = window.innerWidth;
    if (width < 375) return 'small';      // < 375px: Mobile pequeño (iPhone SE)
    if (width < 480) return 'medium';     // 375px - 479px: Mobile medio
    return 'large';                        // 480px - 767px: Mobile grande
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 375) setSize('small');
      else if (width < 480) setSize('medium');
      else setSize('large');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

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
          fontSize: "10px",
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
            fontSize: "8px",
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

export function PedidosMobile() {
  const mobileSize = useMobileSize();
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

  // Configuración responsive según tamaño de mobile
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
    },
  };

  const currentConfig = config[mobileSize];

  return (
    <div
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
      {/* Tarjetas compactas - 4 tarjetas en grid 2x2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: currentConfig.gap,
          height: "100px",
          flexShrink: 0,
          minHeight: "100px",
        }}
      >
        <SpaceBlock
          label="Total Pedidos"
          height="100%"
          color="rgba(0, 200, 117, 0.2)"
          borderWidth="2px"
        />
        <SpaceBlock
          label="Pedidos del Mes"
          height="100%"
          color="rgba(67, 83, 255, 0.2)"
          borderWidth="2px"
        />
        <SpaceBlock
          label="Por Proveedor"
          height="100%"
          color="rgba(255, 165, 0, 0.2)"
          borderWidth="2px"
        />
        <SpaceBlock
          label="Pendientes"
          height="100%"
          color="rgba(220, 53, 69, 0.2)"
          borderWidth="2px"
        />
      </div>

      {/* Listado de Pedidos - PRIORIDAD MÁXIMA */}
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
    </div>
  );
}
