"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../hooks/useTabletSize";
import { useRouter } from "../../../hooks/useRouter";

/**
 * Página de Resumen de Proveedores - Versión Tablet Portrait (768px - 1024px)
 * Dashboard resumen con grid 2x3 (6 bloques) como Inicio
 * Optimizado para tablet portrait
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
  title?: string;
  onClick?: () => void;
}

function SpaceBlock({ 
  label, 
  width = "100%", 
  height = "200px",
  color = "var(--background-secondary)",
  description,
  title,
  onClick
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
      {/* Área de títulos - Separada del bloque */}
      {title && (
        <div
          style={{
            flexShrink: 0,
            display: "grid",
            gridTemplateColumns: "7fr 3fr", // Regla 70/30: Título 70%, Herramientas 30%
            gap: "var(--spacing-xs)",
            alignItems: "stretch",
          }}
        >
          {/* Bloque 1: Título (70%) */}
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
                fontSize: "11px",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {title}
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
                fontSize: "9px",
                color: "var(--foreground-tertiary)",
                textAlign: "center",
              }}
            >
              Herramientas
            </div>
          </div>
        </div>
      )}

      {/* Bloque de contenido */}
      <div
        onClick={onClick}
        style={{
          flex: 1,
          backgroundColor: color,
          border: "2px dashed var(--border-medium)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          padding: "var(--spacing-xs)",
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
          boxSizing: "border-box",
          cursor: onClick ? "pointer" : "default",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (onClick) {
            e.currentTarget.style.borderColor = "var(--accent-blue-primary)";
            e.currentTarget.style.backgroundColor = "var(--accent-blue-primary-alpha-10)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (onClick) {
            e.currentTarget.style.borderColor = "var(--border-medium)";
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.transform = "translateY(0)";
          }
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
              fontSize: "10px",
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
      </div>
    </div>
  );
}

export function ProveedoresResumenTablet() {
  const tabletSize = useTabletSize();
  const { navigate } = useRouter();

  // Configuración responsive según tamaño de tablet
  const config = {
    small: {
      padding: 'var(--spacing-sm)',
      gap: 'var(--spacing-sm)',
      gridColumns: '1fr', // 1 columna en tablet muy pequeño
      gridRows: 'repeat(6, 1fr)', // 6 filas
      fontSize: '10px',
    },
    medium: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-md)',
      gridColumns: '1fr 1fr', // 2 columnas
      gridRows: 'repeat(3, 1fr)', // 3 filas
      fontSize: '11px',
    },
    large: {
      padding: 'var(--spacing-md)',
      gap: 'var(--spacing-md)',
      gridColumns: '1fr 1fr', // 2 columnas
      gridRows: 'repeat(3, 1fr)', // 3 filas
      fontSize: '11px',
    },
  };

  const currentConfig = config[tabletSize];

  // Bloques del dashboard - Resumen y Análisis primero (los importantes)
  const blocks = [
    {
      title: "Resumen",
      label: "Contenido de Resumen",
      description: "Resumen general y estadísticas de proveedores",
      color: "rgba(34, 197, 94, 0.1)",
      path: null,
    },
    {
      title: "Análisis",
      label: "Contenido de Análisis",
      description: "Análisis y métricas de rendimiento de proveedores",
      color: "rgba(128, 128, 128, 0.1)",
      path: null,
    },
    {
      title: "Técnicos",
      label: "Contenido de Técnicos",
      description: "Gestión de proveedores técnicos y especialistas",
      color: "rgba(67, 83, 255, 0.1)",
      path: "/proveedores/tecnicos",
    },
    {
      title: "Materiales",
      label: "Contenido de Materiales",
      description: "Gestión de proveedores de materiales y suministros",
      color: "rgba(0, 200, 117, 0.1)",
      path: "/proveedores/materiales",
    },
    {
      title: "Softwares",
      label: "Contenido de Softwares",
      description: "Gestión de proveedores de software y servicios digitales",
      color: "rgba(156, 81, 224, 0.1)",
      path: "/proveedores/softwares",
    },
    {
      title: "Externos",
      label: "Contenido de Externos",
      description: "Gestión de proveedores externos y colaboradores",
      color: "rgba(255, 165, 0, 0.1)",
      path: "/proveedores/externos",
    },
  ];

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
          display: 'grid',
          gridTemplateColumns: currentConfig.gridColumns,
          gridTemplateRows: currentConfig.gridRows,
          gap: currentConfig.gap,
          padding: currentConfig.padding,
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {blocks.map((block, index) => (
          <SpaceBlock
            key={index}
            title={block.title}
            label={block.label}
            height="100%"
            color={block.color}
            description={block.description}
            onClick={block.path ? () => navigate(block.path) : undefined}
          />
        ))}
      </div>
    </motion.div>
  );
}
