"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../hooks/useTabletSize";

/**
 * Página de Mapa - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait:
 * - Navbar superior (100%)
 * - Mapa principal (70% del espacio vertical)
 * - Listado de Ubicaciones compacto (30% del espacio vertical)
 * Se adapta al ancho disponible considerando el sidebar
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

export function MapaTablet() {
  const tabletSize = useTabletSize();

  // Configuración responsive según tamaño de tablet
  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      navbarHeight: "35px",
      headerHeight: "30px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      navbarHeight: "40px",
      headerHeight: "35px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      navbarHeight: "45px",
      headerHeight: "40px",
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
          label="Navbar de Mapa"
          height="100%"
          color="var(--background-secondary)"
          description="Navegación: búsqueda, filtros, tipo de mapa, acciones"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* Contenedor principal: Mapa (70%) + Listado de Ubicaciones (30%) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Sección Mapa (70% del espacio vertical) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: currentConfig.gap,
            flex: "0 0 70%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Encabezado del Mapa - 3 Bloques: Filtros (20%), Título (60%), Herramientas (20%) */}
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
            {/* Bloque 1: Filtros (20%) */}
            <SpaceBlock
              label="Filtros"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtros de búsqueda"
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 2: Título (60%) */}
            <SpaceBlock
              label="Mapa"
              height="100%"
              color="var(--background-secondary)"
              description="Título de la sección"
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 3: Herramientas (20%) */}
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Contenido del Mapa */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <SpaceBlock
              label="Mapa"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Vista de mapa interactivo con ubicaciones, marcadores, rutas y zonas de cobertura"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>

        {/* Sección Listado de Ubicaciones (30% del espacio vertical) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: currentConfig.gap,
            flex: "0 0 30%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Título del Listado de Ubicaciones - Dividido: Título (70%) + Herramientas (30%) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "7fr 3fr",
              gap: currentConfig.gap,
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            {/* Título: Listado de Ubicaciones (70%) */}
            <SpaceBlock
              label="Listado de Ubicaciones"
              height="100%"
              color="var(--background-secondary)"
              description="Título de la sección"
              fontSize={currentConfig.fontSize}
            />
            {/* Herramientas (30%) */}
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Contenido del Listado de Ubicaciones */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <SpaceBlock
              label="Listado de Ubicaciones"
              height="100%"
              color="rgba(0, 200, 117, 0.15)"
              description="Lista de ubicaciones, direcciones, puntos de interés, clientes y proyectos geolocalizados"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
