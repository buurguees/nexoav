"use client";

import { useState, useEffect } from "react";
import { useRouter } from "../../../hooks/useRouter";

/**
 * Página de Resumen de Proveedores - Versión Desktop (> 1024px)
 * Dashboard con bloques clickeables para cada subapartado
 * 4 bloques: Técnicos, Materiales, Softwares, Externos
 */

/**
 * Hook para detectar el tamaño de pantalla desktop
 */
function useDesktopSize() {
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>(() => {
    if (typeof window === 'undefined') return 'medium';
    const width = window.innerWidth;
    if (width < 1280) return 'small';      // 1025px - 1279px: Desktop pequeño
    if (width < 1600) return 'medium';     // 1280px - 1599px: Desktop medio
    if (width < 1920) return 'large';      // 1600px - 1919px: Desktop grande
    return 'xlarge';                        // 1920px+: Desktop extra grande
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

interface DashboardBlockProps {
  label: string;
  description?: string;
  path: string;
  color?: string;
  fontSize?: string;
  onClick?: () => void;
}

function DashboardBlock({
  label,
  description,
  path,
  color = "var(--background-secondary)",
  fontSize = "12px",
  onClick
}: DashboardBlockProps) {
  const { navigate } = useRouter();

  const handleClick = () => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-sm)",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Área de título RESUMEN y herramientas - Separada del bloque */}
      <div
        style={{
          flexShrink: 0,
          display: "grid",
          gridTemplateColumns: "7fr 3fr", // Regla 70/30: Título 70%, Herramientas 30%
          gap: "var(--spacing-xs)",
          alignItems: "stretch",
        }}
      >
        {/* Bloque 1: Título RESUMEN (70%) */}
        <div
          style={{
            padding: "var(--spacing-xs)",
            backgroundColor: "rgba(100, 100, 100, 0.1)",
            border: "1px dashed var(--border-medium)",
            borderRadius: "var(--radius-sm)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
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
            RESUMEN
          </h2>
        </div>

        {/* Bloque 2: Herramientas (30%) */}
        <div
          style={{
            padding: "var(--spacing-xs)",
            backgroundColor: "rgba(100, 100, 100, 0.1)",
            border: "1px dashed var(--border-medium)",
            borderRadius: "var(--radius-sm)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "var(--foreground-tertiary)",
              textAlign: "center",
            }}
          >
            Herramientas
          </div>
        </div>
      </div>

      {/* Bloque de contenido clickeable - Ocupa el resto del espacio */}
      <div
        onClick={handleClick}
        style={{
          flex: 1,
          backgroundColor: color,
          border: `2px dashed var(--border-medium)`,
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--spacing-md)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
          minHeight: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-blue-primary)";
          e.currentTarget.style.backgroundColor = "var(--accent-blue-primary-alpha-10)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-medium)";
          e.currentTarget.style.backgroundColor = color;
          e.currentTarget.style.transform = "translateY(0)";
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
            marginBottom: description ? "var(--spacing-xs)" : "0",
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
              maxWidth: "80%",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProveedoresResumenDesktop() {
  const desktopSize = useDesktopSize();

  // Configuración responsive según tamaño de desktop
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      titleHeight: "40px",
      fontSize: "11px",
      blockMinHeight: "180px",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      titleHeight: "45px",
      fontSize: "12px",
      blockMinHeight: "200px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      titleHeight: "50px",
      fontSize: "12px",
      blockMinHeight: "220px",
    },
    xlarge: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      titleHeight: "55px",
      fontSize: "13px",
      blockMinHeight: "240px",
    },
  };

  const currentConfig = config[desktopSize];

  // Subapartados de Proveedores
  const subItems = [
    {
      label: "Técnicos",
      path: "/proveedores/tecnicos",
      description: "Gestión de proveedores técnicos y especialistas",
      color: "rgba(67, 83, 255, 0.1)",
    },
    {
      label: "Materiales",
      path: "/proveedores/materiales",
      description: "Gestión de proveedores de materiales y suministros",
      color: "rgba(0, 200, 117, 0.1)",
    },
    {
      label: "Softwares",
      path: "/proveedores/softwares",
      description: "Gestión de proveedores de software y servicios digitales",
      color: "rgba(156, 81, 224, 0.1)",
    },
    {
      label: "Externos",
      path: "/proveedores/externos",
      description: "Gestión de proveedores externos y colaboradores",
      color: "rgba(255, 165, 0, 0.1)",
    },
  ];

  // Calcular grid según número de bloques (4 bloques = 2x2)
  const gridColumns = "1fr 1fr";
  const gridRows = "1fr 1fr";

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
      {/* Título de la sección - Separado y marcando su espacio */}
      <div
        style={{
          height: currentConfig.titleHeight,
          flexShrink: 0,
          minHeight: currentConfig.titleHeight,
          padding: "var(--spacing-xs)",
          backgroundColor: "rgba(100, 100, 100, 0.1)",
          border: "1px dashed var(--border-medium)",
          borderRadius: "var(--radius-sm)",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: currentConfig.fontSize === "11px" ? "14px" : currentConfig.fontSize === "12px" ? "16px" : "18px",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--foreground)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Proveedores
        </div>
      </div>

      {/* Grid de bloques clickeables */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridColumns,
          gridTemplateRows: gridRows,
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
        }}
      >
        {subItems.map((item, index) => (
          <DashboardBlock
            key={item.path}
            label={item.label}
            description={item.description}
            path={item.path}
            color={item.color}
            fontSize={currentConfig.fontSize}
          />
        ))}
      </div>
    </div>
  );
}
