"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../../hooks/useTabletSize";

/**
 * Página de Preferencias - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait:
 * - Header: Filtros, Título, Herramientas
 * - Formulario principal (apilado verticalmente, más compacto)
 * - Panel de Información/Ayuda (debajo del formulario)
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

export function PreferenciasTablet() {
  const tabletSize = useTabletSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      sectionHeight: "80px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      sectionHeight: "100px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      sectionHeight: "120px",
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
        <SpaceBlock label="Preferencias" height="100%" color="var(--background-secondary)" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Herramientas" height="100%" color="rgba(67, 83, 255, 0.15)" fontSize={currentConfig.fontSize} />
      </div>

      {/* Formulario principal (scrollable) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
        }}
      >
        <SpaceBlock
          label="Sección: General"
          height={currentConfig.sectionHeight}
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Sección: Localización"
          height={currentConfig.sectionHeight}
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Sección: Notificaciones"
          height={currentConfig.sectionHeight}
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Sección: Apariencia"
          height={currentConfig.sectionHeight}
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Sección: Seguridad"
          height={currentConfig.sectionHeight}
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Panel de Información/Ayuda (compacto abajo) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: currentConfig.gap,
          height: "100px",
          flexShrink: 0,
          minHeight: "100px",
        }}
      >
        <SpaceBlock
          label="Guía de Configuración"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Recomendaciones"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Estado Actual"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          fontSize={currentConfig.fontSize}
        />
      </div>
    </motion.div>
  );
}

