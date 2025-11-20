"use client";

import { motion } from "motion/react";
import { useTabletHorizontalSize } from "../../../hooks/useTabletHorizontalSize";

/**
 * Página de Impuestos - Versión Tablet Horizontal (768px - 1024px, horizontal)
 * Layout: Sidebar (20%) + Contenido Reservado (80%)
 * Optimizado para tablet horizontal, más parecido a desktop
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

export function ImpuestosTabletHorizontal() {
  const tabletHorizontalSize = useTabletHorizontalSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
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
      {/* Sidebar (20%) */}
      <div
        style={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <SpaceBlock
          label="Sidebar de Impuestos"
          height="100%"
          color="var(--background-secondary)"
          description="Navegación y opciones de impuestos"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Contenido Reservado (80%) */}
      <div
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <SpaceBlock
          label="Contenido Reservado"
          height="100%"
          color="rgba(128, 128, 128, 0.1)"
          description="Área reservada para contenido futuro"
          fontSize={currentConfig.fontSize}
        />
      </div>
    </motion.div>
  );
}
