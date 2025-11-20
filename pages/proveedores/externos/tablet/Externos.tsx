"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../../hooks/useTabletSize";

/**
 * Página de Externos - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait:
 * - Header: Filtros, Título, Herramientas
 * - 3 Tarjetas de Información (en fila)
 * - Listado de Externos (con scroll)
 * - Gráficos en la parte inferior
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

export function ExternosTablet() {
  const tabletSize = useTabletSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      cardsHeight: "100px",
      tableHeaderHeight: "30px",
      chartsHeight: "120px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      cardsHeight: "120px",
      tableHeaderHeight: "35px",
      chartsHeight: "140px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      cardsHeight: "140px",
      tableHeaderHeight: "40px",
      chartsHeight: "160px",
      fontSize: "11px",
    },
  };

  const currentConfig = config[tabletSize];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
      {/* Header */}
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
        <SpaceBlock label="Filtros" height="100%" color="rgba(255, 165, 0, 0.15)" description="Filtros" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Externos" height="100%" color="var(--background-secondary)" description="Título" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Herramientas" height="100%" color="rgba(67, 83, 255, 0.15)" description="Herramientas" fontSize={currentConfig.fontSize} />
      </div>

      {/* 3 Tarjetas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: currentConfig.gap,
          height: currentConfig.cardsHeight,
          flexShrink: 0,
          minHeight: currentConfig.cardsHeight,
        }}
      >
        <SpaceBlock label="Total Externos" height="100%" color="rgba(0, 200, 117, 0.2)" description="Total de externos" borderWidth="2px" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="En Proyecto" height="100%" color="rgba(67, 83, 255, 0.2)" description="Externos activos" borderWidth="2px" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Coste Total" height="100%" color="rgba(255, 165, 0, 0.2)" description="Coste total mensual" borderWidth="2px" fontSize={currentConfig.fontSize} />
      </div>

      {/* Listado */}
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tabletSize === 'small' ? "0.8fr 2fr 1fr 1fr" : tabletSize === 'medium' ? "0.8fr 2.5fr 1fr 1fr 1fr" : "0.8fr 2.5fr 1fr 1fr 1fr 0.8fr",
            gap: "2px",
            height: currentConfig.tableHeaderHeight,
            flexShrink: 0,
            minHeight: currentConfig.tableHeaderHeight,
          }}
        >
          <SpaceBlock label="Código" height="100%" color="rgba(0, 200, 117, 0.15)" fontSize={currentConfig.fontSize} />
          <SpaceBlock label="Nombre" height="100%" color="rgba(0, 200, 117, 0.15)" fontSize={currentConfig.fontSize} />
          <SpaceBlock label="Estado" height="100%" color="rgba(0, 200, 117, 0.15)" fontSize={currentConfig.fontSize} />
          <SpaceBlock label="Servicio" height="100%" color="rgba(0, 200, 117, 0.15)" fontSize={currentConfig.fontSize} />
          {tabletSize !== 'small' && <SpaceBlock label="Coste" height="100%" color="rgba(0, 200, 117, 0.15)" fontSize={currentConfig.fontSize} />}
          {tabletSize === 'large' && <SpaceBlock label="Acciones" height="100%" color="rgba(0, 200, 117, 0.15)" fontSize={currentConfig.fontSize} />}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
          <SpaceBlock label="Listado de Externos" height="100%" color="rgba(0, 200, 117, 0.1)" description="Tabla con información de externos" fontSize={currentConfig.fontSize} />
        </div>
      </div>

      {/* Gráficos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: currentConfig.gap,
          height: currentConfig.chartsHeight,
          flexShrink: 0,
          minHeight: currentConfig.chartsHeight,
        }}
      >
        <SpaceBlock label="Gráfico de Barras" height="100%" color="rgba(67, 83, 255, 0.15)" description="Distribución por servicio" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Gráfico de Líneas" height="100%" color="rgba(0, 200, 117, 0.15)" description="Evolución de contrataciones" fontSize={currentConfig.fontSize} />
      </div>
    </motion.div>
  );
}
