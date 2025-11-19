"use client";

import { useState, useEffect } from "react";

/**
 * Componente de plantilla de espacios para la página de Inicio
 * Muestra bloques que representan la distribución óptima del espacio
 * según el dispositivo. NO contiene funcionalidad, solo visualización de layout.
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
  title?: string; // Título de la sección
}

/**
 * Bloque que representa un espacio en el layout con título de sección separado
 */
function SpaceBlock({ 
  label, 
  width = "100%", 
  height = "200px",
  color = "var(--background-secondary)",
  description,
  title
}: SpaceBlockProps) {
  return (
    <div
      style={{
        width,
        height: typeof height === "number" ? `${height}px` : height,
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-sm)",
        boxSizing: "border-box",
      }}
    >
      {/* Área de títulos - Separada del bloque */}
      {title && (
        <div
          style={{
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "7fr 3fr", // Regla 70/30: Título 70%, Herramientas 30%
            gap: "var(--spacing-xs)",
            alignItems: "stretch", // Misma altura para ambos bloques
          }}
        >
          {/* Bloque 1: Título (70%) */}
          <div
            style={{
              padding: "var(--spacing-xs)",
              backgroundColor: "rgba(100, 100, 100, 0.1)", // Fill para ver el espacio
              border: "1px dashed var(--border-medium)", // Stroke para ver el espacio
              borderRadius: "var(--radius-sm)",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center", // Centrar verticalmente el contenido
            }}
          >
            <h2
              style={{
                fontSize: "12px",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Bloque 2: Herramientas (30%) */}
          <div
            style={{
              padding: "var(--spacing-xs)",
              backgroundColor: "rgba(100, 100, 100, 0.1)", // Fill para ver el espacio
              border: "1px dashed var(--border-medium)", // Stroke para ver el espacio
              borderRadius: "var(--radius-sm)",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center", // Centrar verticalmente el contenido
              justifyContent: "center", // Centrar horizontalmente el contenido
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "var(--foreground-tertiary)",
                textAlign: "center",
              }}
            >
              Herramientas
            </div>
          </div>
        </div>
      )}

      {/* Bloque de contenido - Ocupa el resto del espacio */}
      <div
        style={{
          flex: 1,
          backgroundColor: color,
          border: "2px dashed var(--border-medium)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          padding: "var(--spacing-xs)",
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Contenido del bloque - Ocupa el resto del espacio */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 0,
            overflow: "auto",
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
      </div>
    </div>
  );
}

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

/**
 * Plantilla de layout para la página de Inicio (Desktop)
 * Muestra la distribución de 6 bloques principales:
 * 
 * Fila Superior:
 * - Calendario
 * - Facturas
 * - Resumen Financiero
 * 
 * Fila Inferior:
 * - Proyectos
 * - Presupuestos
 * - Impuestos
 */
export function InicioLayoutTemplate() {
  const desktopSize = useDesktopSize();

  // Configuración responsive según tamaño de desktop
  const config = {
    small: {
      padding: 'var(--spacing-sm)',
      gap: 'var(--spacing-sm)',
      gridColumns: '1fr 1fr', // 2 columnas en desktop pequeño
      gridRows: 'repeat(3, 1fr)', // 3 filas
      fontSize: '11px',
    },
    medium: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-md)',
      gridColumns: '1fr 1fr 1fr', // 3 columnas
      gridRows: 'repeat(2, 1fr)', // 2 filas
      fontSize: '12px',
    },
    large: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-md)',
      gridColumns: '1fr 1fr 1fr', // 3 columnas
      gridRows: 'repeat(2, 1fr)', // 2 filas
      fontSize: '12px',
    },
    xlarge: {
      padding: 'var(--spacing-lg)',
      gap: 'var(--spacing-lg)',
      gridColumns: '1fr 1fr 1fr', // 3 columnas
      gridRows: 'repeat(2, 1fr)', // 2 filas
      fontSize: '13px',
    },
  };

  const currentConfig = config[desktopSize];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: currentConfig.gridColumns,
        gridTemplateRows: currentConfig.gridRows,
        gap: currentConfig.gap,
        padding: currentConfig.padding,
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Fila Superior */}
      {/* Bloque 1: Calendario */}
      <SpaceBlock
        title="Calendario"
        label="Contenido de Calendario"
        height="100%"
        color="rgba(67, 83, 255, 0.1)"
        description="Vista de calendario con eventos y tareas próximas"
      />

      {/* Bloque 2: Facturas */}
      <SpaceBlock
        title="Facturas"
        label="Contenido de Facturas"
        height="100%"
        color="rgba(255, 165, 0, 0.1)"
        description="Facturas recientes y pendientes de cobro"
      />

      {/* Bloque 3: Resumen Financiero */}
      <SpaceBlock
        title="Resumen Financiero"
        label="Contenido de Resumen Financiero"
        height="100%"
        color="rgba(34, 197, 94, 0.1)"
        description="Resumen financiero general de la empresa"
      />

      {/* Fila Inferior */}
      {/* Bloque 4: Proyectos */}
      <SpaceBlock
        title="Proyectos"
        label="Contenido de Proyectos"
        height="100%"
        color="rgba(0, 200, 117, 0.1)"
        description="Listado de proyectos activos y resumen"
      />

      {/* Bloque 5: Presupuestos */}
      <SpaceBlock
        title="Presupuestos"
        label="Contenido de Presupuestos"
        height="100%"
        color="rgba(156, 81, 224, 0.1)"
        description="Presupuestos pendientes y aprobados"
      />

      {/* Bloque 6: Impuestos */}
      <SpaceBlock
        title="Impuestos"
        label="Contenido de Impuestos"
        height="100%"
        color="rgba(128, 128, 128, 0.1)"
        description="Gestión de impuestos y declaraciones"
      />
    </div>
  );
}

