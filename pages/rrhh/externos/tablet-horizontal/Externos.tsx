"use client";

import { motion } from "motion/react";
import { useTabletHorizontalSize } from "../../../../hooks/useTabletHorizontalSize";

/**
 * Página de Externos - Versión Tablet Horizontal (768px - 1024px, horizontal)
 * Layout optimizado para tablet horizontal con formato reducido de desktop:
 * - Header: Filtros, Título, Herramientas
 * - División vertical 30/70: Listado (30%) + Calendario Rapla (70%)
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

export function ExternosTabletHorizontal() {
  const tabletHorizontalSize = useTabletHorizontalSize();

  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
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
        <SpaceBlock label="Filtros" height="100%" color="rgba(255, 165, 0, 0.15)" description="Filtros de búsqueda y filtrado de trabajadores externos" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Externos" height="100%" color="var(--background-secondary)" description="Título de la sección de trabajadores externos" fontSize={currentConfig.fontSize} />
        <SpaceBlock label="Herramientas" height="100%" color="rgba(67, 83, 255, 0.15)" description="Herramientas de gestión de trabajadores externos" fontSize={currentConfig.fontSize} />
      </div>

      {/* Contenedor principal: División vertical 30/70 - Listado (30%) + Calendario (70%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 7fr",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Columna izquierda (30%): Lista de Recursos */}
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
          {/* Título de Recursos */}
          <div
            style={{
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            <SpaceBlock
              label="Recursos"
              height="100%"
              color="var(--background-secondary)"
              description="Lista de trabajadores externos/recursos"
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Lista de Recursos (scrollable) */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                style={{
                  minHeight: "35px",
                  height: "35px",
                  flexShrink: 0,
                  border: "1px dashed var(--border-medium)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "rgba(67, 83, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 var(--spacing-xs)",
                }}
              >
                <div
                  style={{
                    fontSize: currentConfig.fontSize,
                    color: "var(--foreground-secondary)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Externo {item}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha (70%): Calendario Semana/Recurso */}
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
          {/* Header: Días de la Semana */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "2px",
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dia) => (
              <SpaceBlock
                key={dia}
                label={dia}
                height="100%"
                color="var(--background-secondary)"
                description={`Día: ${dia}`}
                fontSize={currentConfig.fontSize}
              />
            ))}
          </div>
          {/* Grid de Calendario: Filas (recursos) x Columnas (días) */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((recurso) => (
              <div
                key={recurso}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "2px",
                  minHeight: "35px",
                  height: "35px",
                  flexShrink: 0,
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
                  <div
                    key={dia}
                    style={{
                      border: "1px dashed var(--border-medium)",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "rgba(0, 200, 117, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "var(--spacing-xs)",
                      fontSize: "9px",
                      color: "var(--foreground-tertiary)",
                    }}
                  >
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

