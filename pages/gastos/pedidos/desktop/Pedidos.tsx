"use client";

import { useState, useEffect } from "react";
import { useDesktopSize } from "../../../../hooks/useDesktopSize";
import { PedidosList } from "../components/PedidosList";
import { fetchPurchaseOrders } from "../../../../lib/mocks/purchaseOrdersMocks";
import { PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";

/**
 * Página de Pedidos de Compra - Versión Desktop (> 1024px)
 * Layout: Listado (60%) + Charts/Resumen (40%) lado a lado
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
  fontSize = "12px"
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
            fontSize: "10px",
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

export function PedidosDesktop() {
  const desktopSize = useDesktopSize();
  const [pedidos, setPedidos] = useState<PurchaseOrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar pedidos al montar el componente
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

  // Handler para cuando se hace clic en un pedido
  const handlePedidoClick = (pedido: PurchaseOrderData) => {
    console.log("Pedido seleccionado:", pedido);
  };

  // Configuración responsive según tamaño de desktop
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "35px",
      tableHeaderHeight: "35px",
      cardsMinHeight: "140px",
      cardsGrid: "1fr 1fr 1fr",
      cardsRows: "1fr 1fr",
      fontSize: "11px",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "40px",
      tableHeaderHeight: "40px",
      cardsMinHeight: "160px",
      cardsGrid: "1fr 1fr 1fr",
      cardsRows: "1fr 1fr",
      fontSize: "12px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "45px",
      tableHeaderHeight: "45px",
      cardsMinHeight: "180px",
      cardsGrid: "1fr 1fr 1fr",
      cardsRows: "1fr 1fr",
      fontSize: "12px",
    },
    xlarge: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "50px",
      tableHeaderHeight: "50px",
      cardsMinHeight: "200px",
      cardsGrid: "1fr 1fr 1fr",
      cardsRows: "1fr 1fr",
      fontSize: "13px",
    },
  };

  const currentConfig = config[desktopSize];

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
      {/* Contenedor principal: Listado + Resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: desktopSize === 'small' ? "2fr 1fr" : "3fr 2fr",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Listado de pedidos - Ocupa 60% del espacio */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: currentConfig.gap,
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
              onPedidoCreated={loadPedidos}
              onPedidoUpdated={loadPedidos}
              onPedidoDeleted={loadPedidos}
            />
          )}
        </div>

        {/* Sección de Charts - Ocupa 40% del espacio */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: currentConfig.gap,
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Título de la sección de Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: currentConfig.gap,
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            <SpaceBlock
              label="Resumen"
              height="100%"
              color="var(--background-secondary)"
              description="Resumen y estadísticas de pedidos"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Filtro"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtro para el resumen: período, proveedor, etc."
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Fila superior: Tarjetas de Resumen */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: currentConfig.cardsGrid,
              gridTemplateRows: currentConfig.cardsRows,
              gap: currentConfig.gap,
              width: "100%",
              flex: "0 0 auto",
              minHeight: currentConfig.cardsMinHeight,
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
            <SpaceBlock
              label="Tarjeta 4: Pendientes"
              height="100%"
              color="rgba(220, 53, 69, 0.2)"
              description="Pedidos pendientes de cumplimiento."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 5: Promedio Diario"
              height="100%"
              color="rgba(156, 81, 224, 0.2)"
              description="Promedio de pedidos diarios del período seleccionado."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 6: Reservada"
              height="100%"
              color="rgba(128, 128, 128, 0.2)"
              description="Espacio reservado para futura funcionalidad."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Fila inferior: Gráficos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: desktopSize === 'small' ? "1fr" : "1fr 1fr",
              gap: currentConfig.gap,
              flex: 1,
              minHeight: 0,
            }}
          >
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
        </div>
      </div>
    </div>
  );
}
