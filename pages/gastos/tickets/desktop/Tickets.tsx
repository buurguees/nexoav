"use client";

import { useState, useEffect } from "react";

/**
 * Página de Tickets - Versión Desktop (> 1024px)
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
    if (width < 1280) return 'small';      // 1025px - 1279px: Desktop pequeño
    if (width < 1600) return 'medium';     // 1280px - 1599px: Desktop medio
    if (width < 1920) return 'large';      // 1600px - 1919px: Desktop grande
    return 'xlarge';                        // 1920px+: Desktop extra grande
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

export function TicketsDesktop() {
  const desktopSize = useDesktopSize();
  
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
        {/* Listado de tickets - Ocupa 60% del espacio */}
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
          {/* Encabezado del Listado - Fijo - 3 Bloques */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: currentConfig.gap,
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            {/* Bloque 1: Filtros */}
            <SpaceBlock
              label="Filtros"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtros de búsqueda: fecha, categoría, estado, importe, etc."
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 2: Título */}
            <SpaceBlock
              label="Título: Tickets"
              height="100%"
              color="var(--background-secondary)"
              description="Título de la sección de tickets"
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 3: Herramientas */}
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas: añadir ticket, exportar, acciones masivas, etc."
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Cabecera de la Tabla - Fija */}
          <div style={{ flexShrink: 0, minHeight: currentConfig.tableHeaderHeight }}>
            <SpaceBlock
              label="Cabecera de la Tabla"
              height={currentConfig.tableHeaderHeight}
              color="rgba(0, 200, 117, 0.15)"
              description="Cabecera: fecha, concepto, categoría, importe, estado, etc."
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Contenido del Listado - Con scroll */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <SpaceBlock
              label="Listado de Tickets"
              height="100%"
              color="rgba(0, 200, 117, 0.1)"
              description="Tabla/Lista con información de cada ticket (fecha, concepto, categoría, importe, estado, etc.)"
              fontSize={currentConfig.fontSize}
            />
          </div>
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
              description="Resumen y estadísticas de tickets"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Filtro"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtro para el resumen: período, categoría, etc."
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
              label="Tarjeta 1: Total Gastos"
              height="100%"
              color="rgba(0, 200, 117, 0.2)"
              description="Total de gastos registrados. Indicador de tendencia."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 2: Gastos del Mes"
              height="100%"
              color="rgba(67, 83, 255, 0.2)"
              description="Gastos del mes actual. Comparación con mes anterior."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 3: Por Categoría"
              height="100%"
              color="rgba(255, 165, 0, 0.2)"
              description="Distribución de gastos por categoría principal."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 4: Pendientes"
              height="100%"
              color="rgba(220, 53, 69, 0.2)"
              description="Tickets pendientes de revisión o aprobación."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Tarjeta 5: Promedio Diario"
              height="100%"
              color="rgba(156, 81, 224, 0.2)"
              description="Promedio de gastos diarios del período seleccionado."
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
                  label="Gráfico Barras: Gastos por Categoría"
                  height="100%"
                  color="rgba(67, 83, 255, 0.15)"
                  description="Distribución de gastos por categoría en el período seleccionado."
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
                  description="Evolución de gastos a lo largo del tiempo."
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
                label="Pie Chart: Distribución de Gastos"
                height="100%"
                color="rgba(156, 81, 224, 0.15)"
                description="Distribución porcentual de gastos por categoría."
                fontSize={currentConfig.fontSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

