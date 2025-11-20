"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../../hooks/useTabletSize";

/**
 * Página de Documentación - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait:
 * - Header: Filtros, Título, Herramientas
 * - Listado de Documentos (arriba, scrollable)
 * - Vista Previa/Detalles (abajo, compacto)
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

export function DocumentacionTablet() {
  const tabletSize = useTabletSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      previewHeight: "150px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      previewHeight: "180px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      previewHeight: "200px",
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
        <SpaceBlock label="Filtros" height="100%" color="rgba(255, 165, 0, 0.15)" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Documentación" height="100%" color="var(--background-secondary)" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Herramientas" height="100%" color="rgba(67, 83, 255, 0.15)" fontSize={currentConfig.fontSize} />
      </div>

      {/* Listado de Documentos (arriba, scrollable) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <SpaceBlock
          label="Listado de Documentos"
          height="100%"
          color="rgba(220, 53, 69, 0.1)"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Vista Previa/Detalles (abajo, compacto) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
          height: currentConfig.previewHeight,
          flexShrink: 0,
          minHeight: currentConfig.previewHeight,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: currentConfig.headerHeight,
            flexShrink: 0,
            minHeight: currentConfig.headerHeight,
          }}
        >
          <SpaceBlock
            label="Vista Previa / Detalles"
            height="100%"
            color="var(--background-secondary)"
            fontSize={currentConfig.fontSize}
          />
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <SpaceBlock
            label="Vista Previa de Documento"
            height="100%"
            color="rgba(220, 53, 69, 0.15)"
            fontSize={currentConfig.fontSize}
          />
        </div>
      </div>
    </motion.div>
  );
}

