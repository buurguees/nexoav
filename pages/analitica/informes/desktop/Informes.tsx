"use client";

import { useState, useEffect } from "react";

/**
 * Página de Informes - Versión Desktop (> 1024px)
 * Layout: Navbar superior (100%) + Informes (60%) + Listado de Datos (40%)
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

export function InformesDesktop() {
  const desktopSize = useDesktopSize();
  
  // Configuración responsive según tamaño de desktop
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      navbarHeight: "40px",
      titleHeight: "35px",
      fontSize: "11px",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      navbarHeight: "45px",
      titleHeight: "40px",
      fontSize: "12px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      navbarHeight: "50px",
      titleHeight: "45px",
      fontSize: "12px",
    },
    xlarge: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      navbarHeight: "55px",
      titleHeight: "50px",
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
      {/* Navbar superior - Ocupa todo el ancho */}
      <div
        style={{
          width: "100%",
          height: currentConfig.navbarHeight,
          flexShrink: 0,
          minHeight: currentConfig.navbarHeight,
        }}
      >
        <SpaceBlock
          label="Navbar de Informes"
          height="100%"
          color="var(--background-secondary)"
          description="Navegación de informes: vista, filtros, acciones"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Contenedor principal: Informes (60%) + Listado de Datos (40%) */}
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
        {/* Columna izquierda (60%): Informes */}
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
          {/* Encabezado de Informes - 3 Bloques: Filtros (20%), Título (60%), Herramientas (20%) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 6fr 2fr",
              gap: currentConfig.gap,
              height: currentConfig.titleHeight,
              flexShrink: 0,
              minHeight: currentConfig.titleHeight,
            }}
          >
            {/* Bloque 1: Filtros (20%) */}
            <SpaceBlock
              label="Filtros"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtros de búsqueda y filtrado de informes"
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 2: Título (60%) */}
            <SpaceBlock
              label="Informes"
              height="100%"
              color="var(--background-secondary)"
              description="Título de la sección de informes"
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 3: Herramientas (20%) */}
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas de gestión de informes"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Contenido de Informes */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <SpaceBlock
              label="Informes"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Vista de informes analíticos, gráficos, tablas y visualizaciones de datos"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>

        {/* Columna derecha (40%): Listado de Datos */}
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
          {/* Título del Listado de Datos - Dividido: Título (70%) + Herramientas (30%) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "7fr 3fr",
              gap: currentConfig.gap,
              height: currentConfig.titleHeight,
              flexShrink: 0,
              minHeight: currentConfig.titleHeight,
            }}
          >
            {/* Título: Listado de Datos (70%) */}
            <SpaceBlock
              label="Listado de Datos"
              height="100%"
              color="var(--background-secondary)"
              description="Título de la sección de datos"
              fontSize={currentConfig.fontSize}
            />
            {/* Herramientas (30%) */}
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas de gestión de datos"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Contenido del Listado de Datos */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <SpaceBlock
              label="Listado de Datos"
              height="100%"
              color="rgba(0, 200, 117, 0.15)"
              description="Lista de datos, métricas, resultados y análisis relacionados con los informes"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
