"use client";

import { motion } from "motion/react";
import { useTabletHorizontalSize } from "../../../../hooks/useTabletHorizontalSize";

/**
 * Página de Nóminas - Versión Tablet Horizontal (768px - 1024px, horizontal)
 * Layout: 70/30 horizontal
 * - 70%: Listado completo con título, filtros, herramientas
 * - 30%: Charts y tarjetas apilados verticalmente
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

export function NominasTabletHorizontal() {
  const tabletHorizontalSize = useTabletHorizontalSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      fontSize: "11px",
    },
  };

  const currentConfig = config[tabletHorizontalSize];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "row",
        gap: currentConfig.gap,
        padding: currentConfig.padding,
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
          gap: currentConfig.gap,
          width: "70%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Encabezado del Listado */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: currentConfig.gap,
            height: currentConfig.headerHeight,
            flexShrink: 0,
          }}
        >
          <SpaceBlock
            label="Filtros"
            height="100%"
            color="rgba(255, 165, 0, 0.15)"
            description="Filtros de búsqueda"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Nóminas"
            height="100%"
            color="var(--background-secondary)"
            description="Título"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Herramientas"
            height="100%"
            color="rgba(67, 83, 255, 0.15)"
            description="Herramientas"
            fontSize={currentConfig.fontSize}
          />
        </div>
        {/* Cabecera de la Tabla */}
        <div style={{ flexShrink: 0, minHeight: currentConfig.headerHeight }}>
          <SpaceBlock
            label="Cabecera de la Tabla"
            height={currentConfig.headerHeight}
            color="rgba(0, 200, 117, 0.15)"
            description="Cabecera"
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
            color="rgba(0, 200, 117, 0.1)"
            description="Listado de nóminas"
            fontSize={currentConfig.fontSize}
          />
        </div>
      </div>

      {/* Charts - 30% */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
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
            gap: currentConfig.gap,
            height: currentConfig.headerHeight,
            flexShrink: 0,
          }}
        >
          <SpaceBlock
            label="Resumen"
            height="100%"
            color="var(--background-secondary)"
            description="Resumen"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Filtro"
            height="100%"
            color="rgba(255, 165, 0, 0.15)"
            description="Filtro"
            fontSize={currentConfig.fontSize}
          />
        </div>
        {/* Tarjetas compactas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: currentConfig.gap,
            flexShrink: 0,
          }}
        >
          <SpaceBlock
            label="Total Nóminas"
            height="60px"
            color="rgba(0, 200, 117, 0.2)"
            borderWidth="2px"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Total Pagado"
            height="60px"
            color="rgba(67, 83, 255, 0.2)"
            borderWidth="2px"
            fontSize={currentConfig.fontSize}
          />
        </div>
        {/* Gráficos */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: currentConfig.gap,
          }}
        >
          <SpaceBlock
            label="Gráfico: Nóminas por Mes"
            height="100%"
            color="rgba(67, 83, 255, 0.15)"
            description="Gráfico"
            fontSize={currentConfig.fontSize}
          />
        </div>
      </div>
    </motion.div>
  );
}

