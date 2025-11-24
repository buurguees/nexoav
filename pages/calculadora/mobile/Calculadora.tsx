"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

/**
 * Página de Calculadora de Alquiler de Pantallas LED - Versión Mobile (< 768px)
 * Layout optimizado para mobile:
 * - Header: Título
 * - Formulario (arriba, scrollable)
 * - Preview del Presupuesto (abajo, compacto)
 */

/**
 * Hook para detectar el tamaño de pantalla mobile
 */
function useMobileSize() {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>(() => {
    if (typeof window === 'undefined') return 'medium';
    const width = window.innerWidth;
    if (width < 375) return 'small';
    if (width < 480) return 'medium';
    return 'large';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 375) setSize('small');
      else if (width < 480) setSize('medium');
      else setSize('large');
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
  fontSize = "10px"
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
  );
}

export function CalculadoraMobile() {
  const mobileSize = useMobileSize();

  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "30px",
      previewHeight: "120px",
      fontSize: "9px",
    },
    medium: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      previewHeight: "140px",
      fontSize: "10px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "40px",
      previewHeight: "160px",
      fontSize: "10px",
    },
  };

  const currentConfig = config[mobileSize];

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
          height: currentConfig.headerHeight,
          flexShrink: 0,
          minHeight: currentConfig.headerHeight,
        }}
      >
        <SpaceBlock
          label="Calculadora de Pantallas LED"
          height="100%"
          color="var(--background-secondary)"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Formulario (arriba, scrollable) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <SpaceBlock
          label="Formulario de Cálculo"
          height="100%"
          color="rgba(67, 83, 255, 0.1)"
          description="Campos: dimensiones, días de alquiler, ubicación, configuración técnica, servicios adicionales"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Preview del Presupuesto (abajo, compacto) */}
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
            label="Preview del Presupuesto"
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
            label="Preview del Presupuesto"
            height="100%"
            color="rgba(0, 200, 117, 0.1)"
            description="Vista previa del presupuesto"
            fontSize={currentConfig.fontSize}
          />
        </div>
      </div>
    </motion.div>
  );
}

