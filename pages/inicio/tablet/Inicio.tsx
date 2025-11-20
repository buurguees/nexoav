"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../hooks/useTabletSize";

/**
 * Página de Inicio - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait con los mismos 6 bloques que desktop
 * Grid: 2 columnas x 3 filas
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
  title?: string;
}

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
        gap: "var(--spacing-xs)",
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
            alignItems: "stretch",
          }}
        >
          {/* Bloque 1: Título (70%) */}
          <div
            style={{
              padding: "var(--spacing-xs)",
              backgroundColor: "rgba(100, 100, 100, 0.1)",
              border: "1px dashed var(--border-medium)",
              borderRadius: "var(--radius-sm)",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "11px",
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
              backgroundColor: "rgba(100, 100, 100, 0.1)",
              border: "1px dashed var(--border-medium)",
              borderRadius: "var(--radius-sm)",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                color: "var(--foreground-tertiary)",
                textAlign: "center",
              }}
            >
              Herramientas
            </div>
          </div>
        </div>
      )}

      {/* Bloque de contenido */}
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
      </div>
    </div>
  );
}

export function InicioTablet() {
  const tabletSize = useTabletSize();

  // Configuración responsive según tamaño de tablet
  const config = {
    small: {
      padding: 'var(--spacing-sm)',
      gap: 'var(--spacing-sm)',
      gridColumns: '1fr', // 1 columna en tablet muy pequeño
      gridRows: 'repeat(6, 1fr)', // 6 filas
      fontSize: '10px',
    },
    medium: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-md)',
      gridColumns: '1fr 1fr', // 2 columnas
      gridRows: 'repeat(3, 1fr)', // 3 filas
      fontSize: '11px',
    },
    large: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-md)',
      gridColumns: '1fr 1fr', // 2 columnas
      gridRows: 'repeat(3, 1fr)', // 3 filas
      fontSize: '11px',
    },
  };

  const currentConfig = config[tabletSize];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-content-scroll"
      style={{
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
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

        {/* Fila Media */}
        {/* Bloque 3: Resumen Financiero */}
        <SpaceBlock
          title="Resumen Financiero"
          label="Contenido de Resumen Financiero"
          height="100%"
          color="rgba(34, 197, 94, 0.1)"
          description="Resumen financiero general de la empresa"
        />

        {/* Bloque 4: Proyectos */}
        <SpaceBlock
          title="Proyectos"
          label="Contenido de Proyectos"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          description="Listado de proyectos activos y resumen"
        />

        {/* Fila Inferior */}
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
    </motion.div>
  );
}
