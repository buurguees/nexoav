"use client";

import { motion } from "motion/react";
import { useTabletHorizontalSize } from "../../../../hooks/useTabletHorizontalSize";

/**
 * Página de Preferencias - Versión Tablet Horizontal (768px - 1024px, horizontal)
 * Layout optimizado para tablet horizontal, más parecido a desktop:
 * - Header: Filtros, Título, Herramientas
 * - Formulario (70%) + Información/Ayuda (30%) lado a lado
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

export function PreferenciasTabletHorizontal() {
  const tabletHorizontalSize = useTabletHorizontalSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      sectionHeight: "100px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      sectionHeight: "120px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      sectionHeight: "140px",
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

      {/* Contenido principal: Formulario (70%) + Información (30%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "7fr 3fr",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Formulario (70%) */}
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
        </div>

        {/* Panel de Información (30%) */}
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
          <div
            style={{
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            <SpaceBlock
              label="Información y Ayuda"
              height="100%"
              color="var(--background-secondary)"
              fontSize={currentConfig.fontSize}
            />
          </div>
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
              label="Guía de Configuración"
              height="100px"
              color="rgba(0, 200, 117, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Recomendaciones"
              height="100px"
              color="rgba(0, 200, 117, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Estado Actual"
              height="100px"
              color="rgba(0, 200, 117, 0.1)"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

