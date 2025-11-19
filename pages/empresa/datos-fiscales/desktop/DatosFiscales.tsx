"use client";

import { useState, useEffect } from "react";

/**
 * Página de Datos Fiscales - Versión Desktop (> 1024px)
 * Layout optimizado para introducir y trabajar con datos fiscales de la empresa
 * Formulario principal (70%) + Información/Validación (30%)
 * Optimizado para diferentes tamaños de pantalla desktop
 */

function useDesktopSize() {
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>(() => {
    if (typeof window === 'undefined') return 'medium';
    const width = window.innerWidth;
    if (width < 1280) return 'small';
    if (width < 1600) return 'medium';
    if (width < 1920) return 'large';
    return 'xlarge';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1280) setSize('small');
      else if (width < 1600) setSize('medium');
      else if (width < 1920) setSize('large');
      else setSize('xlarge');
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
}

function SpaceBlock({
  label,
  width = "100%",
  height = "200px",
  color = "var(--background-secondary)",
  description,
  borderStyle = "dashed",
  borderWidth = "2px",
  fontSize = "12px"
}: SpaceBlockProps & { fontSize?: string }) {
  return (
    <div
      style={{
        width,
        height,
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
            fontSize: "10px",
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

export function DatosFiscalesDesktop() {
  const desktopSize = useDesktopSize();
  
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "35px",
      sectionHeight: "120px",
      fontSize: "11px",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "40px",
      sectionHeight: "140px",
      fontSize: "12px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "45px",
      sectionHeight: "160px",
      fontSize: "12px",
    },
    xlarge: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "50px",
      sectionHeight: "180px",
      fontSize: "13px",
    },
  };

  const currentConfig = config[desktopSize];

  return (
    <div
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
      {/* Header: Filtros, Título, Herramientas */}
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
        <SpaceBlock
          label="Filtros"
          height="100%"
          color="rgba(255, 165, 0, 0.15)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Datos Fiscales"
          height="100%"
          color="var(--background-secondary)"
          fontSize={currentConfig.fontSize}
        />
        <SpaceBlock
          label="Herramientas"
          height="100%"
          color="rgba(67, 83, 255, 0.15)"
          fontSize={currentConfig.fontSize}
        />
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
        {/* Formulario de Datos Fiscales (70%) */}
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
          {/* Área de formulario con scroll */}
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
            {/* Sección: Datos Básicos */}
            <SpaceBlock
              label="Sección: Datos Básicos"
              height={currentConfig.sectionHeight}
              color="rgba(67, 83, 255, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            
            {/* Sección: Dirección Fiscal */}
            <SpaceBlock
              label="Sección: Dirección Fiscal"
              height={currentConfig.sectionHeight}
              color="rgba(67, 83, 255, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            
            {/* Sección: Datos de Contacto */}
            <SpaceBlock
              label="Sección: Datos de Contacto"
              height={currentConfig.sectionHeight}
              color="rgba(67, 83, 255, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            
            {/* Sección: Información Adicional */}
            <SpaceBlock
              label="Sección: Información Adicional"
              height={currentConfig.sectionHeight}
              color="rgba(67, 83, 255, 0.1)"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>

        {/* Panel de Información/Validación (30%) */}
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
          {/* Título del Panel */}
          <div
            style={{
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            <SpaceBlock
              label="Información y Validación"
              height="100%"
              color="var(--background-secondary)"
              fontSize={currentConfig.fontSize}
            />
          </div>
          
          {/* Contenido del Panel */}
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
              label="Estado de Validación"
              height="120px"
              color="rgba(0, 200, 117, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Ayuda y Guías"
              height="120px"
              color="rgba(0, 200, 117, 0.1)"
              fontSize={currentConfig.fontSize}
            />
            <SpaceBlock
              label="Información Legal"
              height="120px"
              color="rgba(0, 200, 117, 0.1)"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
