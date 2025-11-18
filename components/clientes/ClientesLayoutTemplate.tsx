"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";

/**
 * Componente de plantilla de espacios para la página de Clientes
 * Muestra bloques cuadrados que representan la distribución óptima del espacio
 * según el dispositivo. NO contiene funcionalidad, solo visualización de layout.
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
}

/**
 * Bloque cuadrado que representa un espacio en el layout
 */
function SpaceBlock({ 
  label, 
  width = "100%", 
  height = "200px",
  color = "var(--background-secondary)",
  description 
}: SpaceBlockProps) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: color,
        border: `2px dashed var(--border-medium)`,
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-md)",
        position: "relative",
        minHeight: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <div
        style={{
          fontSize: "12px",
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

/**
 * Plantilla de layout para Mobile (< 768px)
 * Muestra chart pequeño arriba y listado abajo
 */
function MobileLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-md)",
        padding: "var(--spacing-md)",
        height: "100%",
      }}
    >
      {/* Header/Título */}
      <SpaceBlock
        label="Título: Clientes"
        height="50px"
        color="var(--background-secondary)"
        description="Título de la página"
      />

      {/* Resumen/Chart - Pequeño arriba */}
      <SpaceBlock
        label="Resumen / Chart"
        height="200px"
        color="rgba(67, 83, 255, 0.1)"
        description="Gráfico de resumen compacto (facturación, proyectos, etc.)"
      />

      {/* Listado de clientes - Ocupa el resto del espacio */}
      <SpaceBlock
        label="Listado de Clientes"
        height="calc(100vh - 300px)"
        color="rgba(0, 200, 117, 0.1)"
        description="Tabla/Lista con información de cada cliente (código, nombre, estado, proyectos, facturación, etc.)"
      />
    </div>
  );
}

/**
 * Plantilla de layout para Tablet Portrait (768px - 1024px, vertical)
 * Muestra solo el resumen (chart) - sin listado
 */
function TabletPortraitLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
        padding: "var(--spacing-lg)",
        height: "100%",
      }}
    >
      {/* Header/Título */}
      <SpaceBlock
        label="Título: Clientes"
        height="60px"
        color="var(--background-secondary)"
        description="Título de la página"
      />

      {/* Resumen/Chart - Ocupa todo el espacio disponible */}
      <SpaceBlock
        label="Resumen / Chart"
        height="calc(100vh - 220px)"
        color="rgba(67, 83, 255, 0.1)"
        description="Gráfico de resumen de clientes (facturación, proyectos, etc.)"
      />
    </div>
  );
}

/**
 * Plantilla de layout para Tablet Horizontal (768px - 1024px, horizontal)
 * Muestra chart pequeño arriba y listado abajo
 */
function TabletHorizontalLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
        padding: "var(--spacing-lg)",
        height: "100%",
      }}
    >
      {/* Header/Título */}
      <SpaceBlock
        label="Título: Clientes"
        height="60px"
        color="var(--background-secondary)"
        description="Título de la página"
      />

      {/* Resumen/Chart - Pequeño arriba */}
      <SpaceBlock
        label="Resumen / Chart"
        height="250px"
        color="rgba(67, 83, 255, 0.1)"
        description="Gráfico de resumen compacto (facturación, proyectos, etc.)"
      />

      {/* Listado de clientes - Ocupa el resto del espacio */}
      <SpaceBlock
        label="Listado de Clientes"
        height="calc(100vh - 370px)"
        color="rgba(0, 200, 117, 0.1)"
        description="Tabla/Lista con información de cada cliente (código, nombre, estado, proyectos, facturación, etc.)"
      />
    </div>
  );
}

/**
 * Plantilla de layout para Desktop (> 1024px)
 * Muestra listado + resumen lado a lado con más espacio
 */
function DesktopLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xl)",
        padding: "var(--spacing-xl)",
        height: "100%",
        maxWidth: "var(--max-content-width)",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header/Título */}
      <SpaceBlock
        label="Título: Clientes"
        height="60px"
        color="var(--background-secondary)"
        description="Título de la página"
      />

      {/* Contenedor principal: Listado + Resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "var(--spacing-xl)",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Listado de clientes - Ocupa más espacio (2/3) */}
        <SpaceBlock
          label="Listado de Clientes"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          description="Tabla/Lista con información de cada cliente (código, nombre, estado, proyectos, facturación, etc.)"
        />

        {/* Resumen/Chart - Ocupa menos espacio (1/3) */}
        <SpaceBlock
          label="Resumen / Chart"
          height="100%"
          color="rgba(67, 83, 255, 0.1)"
          description="Gráfico de resumen de clientes (facturación, proyectos, etc.)"
        />
      </div>
    </div>
  );
}

/**
 * Componente principal que selecciona el layout según el breakpoint
 */
export function ClientesLayoutTemplate() {
  const breakpoint = useBreakpoint();

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* Indicador de breakpoint actual (solo para desarrollo) */}
      <div
        style={{
          position: "absolute",
          top: "var(--spacing-sm)",
          right: "var(--spacing-sm)",
          zIndex: 1000,
          padding: "var(--spacing-xs) var(--spacing-sm)",
          backgroundColor: "var(--accent-blue-primary)",
          color: "var(--foreground)",
          borderRadius: "var(--radius-md)",
          fontSize: "11px",
          fontWeight: "var(--font-weight-semibold)",
          textTransform: "uppercase",
        }}
      >
        {breakpoint}
      </div>

      {/* Renderizar layout según breakpoint */}
      {breakpoint === "mobile" && <MobileLayout />}
      {breakpoint === "tablet-portrait" && <TabletPortraitLayout />}
      {breakpoint === "tablet" && <TabletHorizontalLayout />}
      {breakpoint === "desktop" && <DesktopLayout />}
    </div>
  );
}

