"use client";

import { useState, useEffect } from "react";
import { FacturasList } from "../components/FacturasList";
import { fetchFacturas, SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";

/**
 * Página de Facturas - Versión Desktop (> 1024px)
 * Layout: Listado (60%) + Chart (40%) lado a lado
 * Optimizado para diferentes tamaños de pantalla desktop
 */

/**
 * Hook para detectar el tamaño de pantalla desktop
 */
function useDesktopSize() {
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>(() => {
    if (typeof window === 'undefined') return 'medium';
    const width = window.innerWidth;
    if (width < 1280) return 'small';
    if (width < 1600) return 'medium';
    if (width < 1920) return 'large';
    return 'xlarge';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1280) setSize('small');
      else if (width < 1600) setSize('medium');
      else if (width < 1920) setSize('large');
      else setSize('xlarge');
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
  borderWidth = "2px",
  fontSize = "12px"
}: SpaceBlockProps & { fontSize?: string }) {
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

export function FacturasDesktop() {
  const desktopSize = useDesktopSize();
  const [facturas, setFacturas] = useState<SalesDocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadFacturas() {
      try {
        setIsLoading(true);
        const data = await fetchFacturas();
        setFacturas(data);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacturas();
  }, []);

  const handleFacturaClick = (factura: SalesDocumentData) => {
    console.log("Factura seleccionada:", factura);
  };

  const reloadFacturas = async () => {
    try {
      const data = await fetchFacturas();
      setFacturas(data);
    } catch (error) {
      console.error("Error al recargar facturas:", error);
    }
  };
  
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
        {/* Listado de facturas */}
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
              Cargando facturas...
            </div>
          ) : (
            <FacturasList
              facturas={facturas}
              showFilters={true}
              showTools={true}
              onFacturaClick={handleFacturaClick}
              onFacturaCreated={reloadFacturas}
              onFacturaUpdated={reloadFacturas}
              onFacturaDeleted={reloadFacturas}
            />
          )}
        </div>

        {/* Sección de Charts */}
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
              description="Resumen y estadísticas"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Filtro"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtro para el resumen"
              fontSize={currentConfig.fontSize}
            />
          </div>
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
              label="Tarjeta 1: Total Facturas"
              height="100%"
              color="rgba(0, 200, 117, 0.2)"
              description="Total de facturas. Indicador de tendencia."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 2: Facturas Pagadas"
              height="100%"
              color="rgba(67, 83, 255, 0.2)"
              description="Número de facturas pagadas. Tasa de cobro."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 3: Importe Total"
              height="100%"
              color="rgba(255, 165, 0, 0.2)"
              description="Importe total de facturas. Comparación con período anterior."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 4: Pendientes"
              height="100%"
              color="rgba(220, 53, 69, 0.2)"
              description="Facturas pendientes de cobro."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 5: Promedio Importe"
              height="100%"
              color="rgba(156, 81, 224, 0.2)"
              description="Promedio de importe por factura."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 6: Reservada"
              height="100%"
              color="rgba(128, 128, 128, 0.2)"
              description="Espacio reservado"
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
          </div>
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
              <div style={{ width: "100%", flex: "1 1 50%", minHeight: 0 }}>
                <SpaceBlock
                  label="Gráfico Barras: Facturas por Estado"
                  height="100%"
                  color="rgba(67, 83, 255, 0.15)"
                  description="Distribución de facturas por estado"
                  fontSize={currentConfig.fontSize}
                />
              </div>
              <div style={{ width: "100%", flex: "1 1 50%", minHeight: 0 }}>
                <SpaceBlock
                  label="Gráfico Líneas: Evolución Temporal"
                  height="100%"
                  color="rgba(0, 200, 117, 0.15)"
                  description="Evolución de facturas en el tiempo"
                  fontSize={currentConfig.fontSize}
                />
              </div>
            </div>
            <div style={{ width: "100%", height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}>
              <SpaceBlock
                label="Pie Chart: Distribución por Cliente"
                height="100%"
                color="rgba(156, 81, 224, 0.15)"
                description="Distribución porcentual por cliente"
                fontSize={currentConfig.fontSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

