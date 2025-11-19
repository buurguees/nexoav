"use client";

import { useState, useEffect } from "react";

/**
 * Página de Nóminas - Versión Desktop (> 1024px)
 * Layout: Listado (60%) + Chart (40%) lado a lado
 * Optimizado para diferentes tamaños de pantalla desktop
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

export function NominasDesktop() {
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
      {/* Encabezado - 3 Bloques: Filtros (20%), Título (60%), Herramientas (20%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 6fr 2fr",
          gap: currentConfig.gap,
          height: currentConfig.headerHeight,
          flexShrink: 0,
          minHeight: currentConfig.headerHeight,
        }}
      >
        <SpaceBlock
          label="Filtros"
          height="100%"
          color="rgba(255, 165, 0, 0.15)"
          description="Filtros de búsqueda y filtrado de nóminas"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Nóminas"
          height="100%"
          color="var(--background-secondary)"
          description="Título de la sección de nóminas"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Herramientas"
          height="100%"
          color="rgba(67, 83, 255, 0.15)"
          description="Herramientas de gestión de nóminas"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Contenedor principal: Listado (60%) + Resumen (40%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "6fr 4fr",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Columna izquierda (60%): Listado */}
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
          {/* Header del Listado */}
          <div
            style={{
              height: currentConfig.tableHeaderHeight,
              flexShrink: 0,
              minHeight: currentConfig.tableHeaderHeight,
            }}
          >
            <SpaceBlock
              label="Listado de Nóminas"
              height="100%"
              color="var(--background-secondary)"
              description="Encabezado de la tabla de nóminas"
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Contenido del Listado */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <SpaceBlock
              label="Listado de Nóminas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Tabla con lista de nóminas, empleados, períodos, importes y estados"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>

        {/* Columna derecha (40%): Resumen */}
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
          {/* Título del Resumen - Dividido: Título (2fr) + Filtro (1fr) */}
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
              description="Título de la sección de resumen"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Filtro"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtros adicionales del resumen"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Tarjetas de Resumen */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: currentConfig.cardsGrid,
              gridTemplateRows: currentConfig.cardsRows,
              gap: currentConfig.gap,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <SpaceBlock
              label="Total Nóminas"
              height={currentConfig.cardsMinHeight}
              color="rgba(67, 83, 255, 0.1)"
              description="Número total de nóminas procesadas"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Total Pagado"
              height={currentConfig.cardsMinHeight}
              color="rgba(0, 200, 117, 0.1)"
              description="Importe total pagado en nóminas"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Pendientes"
              height={currentConfig.cardsMinHeight}
              color="rgba(255, 165, 0, 0.1)"
              description="Nóminas pendientes de procesar"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Promedio Mensual"
              height={currentConfig.cardsMinHeight}
              color="rgba(156, 81, 224, 0.1)"
              description="Promedio de nóminas por mes"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Gráfico Barras: Nóminas por Mes"
              height={currentConfig.cardsMinHeight}
              color="rgba(67, 83, 255, 0.1)"
              description="Distribución de nóminas por mes"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Gráfico Líneas: Evolución Pagos"
              height={currentConfig.cardsMinHeight}
              color="rgba(0, 200, 117, 0.1)"
              description="Evolución de pagos en el tiempo"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

