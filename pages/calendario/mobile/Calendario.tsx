"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

/**
 * Página de Calendario - Versión Mobile (< 768px)
 * Layout optimizado para mobile:
 * - Navbar superior (100%)
 * - Calendario (100% del espacio restante)
 * Sin listado de tareas para maximizar el espacio del calendario
 */

/**
 * Hook para detectar el tamaño de pantalla mobile
 */
function useMobileSize() {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>(() => {
    if (typeof window === 'undefined') return 'medium';
    const width = window.innerWidth;
    if (width < 375) return 'small';      // < 375px: Mobile pequeño (iPhone SE)
    if (width < 480) return 'medium';     // 375px - 479px: Mobile medio
    return 'large';                        // 480px - 767px: Mobile grande
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

export function CalendarioMobile() {
  const mobileSize = useMobileSize();

  // Configuración responsive según tamaño de mobile
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      navbarHeight: "45px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      navbarHeight: "50px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      navbarHeight: "55px",
      fontSize: "11px",
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
          label="Navbar de Calendario"
          height="100%"
          color="var(--background-secondary)"
          description="Navegación: vista (mes/semana/día), filtros, acciones"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Calendario - Ocupa todo el espacio restante */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <SpaceBlock
          label="Calendario"
          height="100%"
          color="rgba(67, 83, 255, 0.15)"
          description="Vista de calendario mensual/semanal/diaria con eventos, citas y tareas programadas"
          fontSize={currentConfig.fontSize}
        />
      </div>
    </motion.div>
  );
}

