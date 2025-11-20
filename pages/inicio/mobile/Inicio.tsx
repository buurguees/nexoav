"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

/**
 * Página de Inicio - Versión Mobile (< 768px)
 * Layout optimizado para mobile:
 * - 1 columna vertical con scroll
 * - Bloques apilados verticalmente
 * - Títulos simplificados y compactos
 * - Espacios optimizados para pantallas pequeñas
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
  title?: string;
  fontSize?: string;
  blockHeight?: string;
}

function SpaceBlock({ 
  label, 
  width = "100%", 
  height = "200px",
  color = "var(--background-secondary)",
  description,
  title,
  fontSize = "10px",
  blockHeight = "180px"
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
      {/* Título simplificado - Solo título, sin herramientas separadas */}
      {title && (
        <div
          style={{
            flexShrink: 0,
            padding: "var(--spacing-xs)",
            backgroundColor: "rgba(100, 100, 100, 0.1)",
            border: "1px dashed var(--border-medium)",
            borderRadius: "var(--radius-sm)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "28px",
          }}
        >
          <h2
            style={{
              fontSize: fontSize,
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--foreground)",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </h2>
          {/* Herramientas compactas inline */}
          <div
            style={{
              fontSize: "8px",
              color: "var(--foreground-tertiary)",
              textAlign: "center",
            }}
          >
            ⋯
          </div>
        </div>
      )}

      {/* Bloque de contenido */}
      <div
        style={{
          height: blockHeight,
          backgroundColor: color,
          border: "2px dashed var(--border-medium)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          padding: "var(--spacing-xs)",
          position: "relative",
          minHeight: blockHeight,
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
                maxWidth: "90%",
                lineHeight: "1.3",
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

export function InicioMobile() {
  const mobileSize = useMobileSize();

  // Configuración responsive según tamaño de mobile
  const config = {
    small: {
      padding: 'var(--spacing-xs)',
      gap: 'var(--spacing-sm)',
      blockHeight: '160px',
      fontSize: '9px',
      titleFontSize: '10px',
    },
    medium: {
      padding: 'var(--spacing-sm)',
      gap: 'var(--spacing-sm)',
      blockHeight: '180px',
      fontSize: '10px',
      titleFontSize: '11px',
    },
    large: {
      padding: 'var(--spacing-sm)',
      gap: 'var(--spacing-md)',
      blockHeight: '200px',
      fontSize: '10px',
      titleFontSize: '11px',
    },
  };

  const currentConfig = config[mobileSize];

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
          display: 'flex',
          flexDirection: 'column',
          gap: currentConfig.gap,
          padding: currentConfig.padding,
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Bloque 1: Calendario */}
        <SpaceBlock
          title="Calendario"
          label="Contenido de Calendario"
          height="100%"
          color="rgba(67, 83, 255, 0.1)"
          description="Vista de calendario con eventos y tareas próximas"
          fontSize={currentConfig.fontSize}
          blockHeight={currentConfig.blockHeight}
        />

        {/* Bloque 2: Facturas */}
        <SpaceBlock
          title="Facturas"
          label="Contenido de Facturas"
          height="100%"
          color="rgba(255, 165, 0, 0.1)"
          description="Facturas recientes y pendientes de cobro"
          fontSize={currentConfig.fontSize}
          blockHeight={currentConfig.blockHeight}
        />

        {/* Bloque 3: Resumen Financiero */}
        <SpaceBlock
          title="Resumen Financiero"
          label="Contenido de Resumen Financiero"
          height="100%"
          color="rgba(34, 197, 94, 0.1)"
          description="Resumen financiero general de la empresa"
          fontSize={currentConfig.fontSize}
          blockHeight={currentConfig.blockHeight}
        />

        {/* Bloque 4: Proyectos */}
        <SpaceBlock
          title="Proyectos"
          label="Contenido de Proyectos"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          description="Listado de proyectos activos y resumen"
          fontSize={currentConfig.fontSize}
          blockHeight={currentConfig.blockHeight}
        />

        {/* Bloque 5: Presupuestos */}
        <SpaceBlock
          title="Presupuestos"
          label="Contenido de Presupuestos"
          height="100%"
          color="rgba(156, 81, 224, 0.1)"
          description="Presupuestos pendientes y aprobados"
          fontSize={currentConfig.fontSize}
          blockHeight={currentConfig.blockHeight}
        />

        {/* Bloque 6: Impuestos */}
        <SpaceBlock
          title="Impuestos"
          label="Contenido de Impuestos"
          height="100%"
          color="rgba(128, 128, 128, 0.1)"
          description="Gestión de impuestos y declaraciones"
          fontSize={currentConfig.fontSize}
          blockHeight={currentConfig.blockHeight}
        />
      </div>
    </motion.div>
  );
}
