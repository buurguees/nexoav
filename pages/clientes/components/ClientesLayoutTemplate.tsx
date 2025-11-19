"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";

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
        border: "2px dashed var(--border-medium)",
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
 * Plantilla de layout para la página de Clientes
 * Muestra la distribución de espacios según el dispositivo actual
 */
export function ClientesLayoutTemplate() {
  const breakpoint = useBreakpoint();

  // Desktop: Listado (60%) + Chart (40%) lado a lado
  if (breakpoint === "desktop") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: "var(--spacing-lg)",
          padding: "var(--spacing-lg)",
          height: "100%",
        }}
      >
        <SpaceBlock
          label="Listado de Clientes (60%)"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          description="Tabla con información de clientes: código, nombre, estado, proyectos, facturación, etc."
        />
        <SpaceBlock
          label="Charts y Resumen (40%)"
          height="100%"
          color="rgba(67, 83, 255, 0.1)"
          description="Gráficos, tarjetas de resumen y estadísticas de clientes"
        />
      </div>
    );
  }

  // Tablet Horizontal: Chart pequeño arriba + Listado abajo
  if (breakpoint === "tablet") {
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
        <SpaceBlock
          label="Charts Compactos (30%)"
          height="200px"
          color="rgba(67, 83, 255, 0.1)"
          description="Gráficos y tarjetas compactos en la parte superior"
        />
        <SpaceBlock
          label="Listado de Clientes (70%)"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          description="Tabla con información de clientes"
        />
      </div>
    );
  }

  // Tablet Portrait: Chart pequeño arriba + Listado grande abajo
  if (breakpoint === "tablet-portrait") {
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
        <SpaceBlock
          label="Charts Compactos (25%)"
          height="150px"
          color="rgba(67, 83, 255, 0.1)"
          description="Gráficos y tarjetas compactos en la parte superior"
        />
        <SpaceBlock
          label="Listado de Clientes (75%)"
          height="100%"
          color="rgba(0, 200, 117, 0.1)"
          description="Tabla con información de clientes"
        />
      </div>
    );
  }

  // Mobile: Chart pequeño arriba + Listado abajo
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
      <SpaceBlock
        label="Charts Compactos (20%)"
        height="120px"
        color="rgba(67, 83, 255, 0.1)"
        description="Gráficos y tarjetas muy compactos en la parte superior"
      />
      <SpaceBlock
        label="Listado de Clientes (80%)"
        height="100%"
        color="rgba(0, 200, 117, 0.1)"
        description="Tabla con información de clientes - Prioridad máxima"
      />
    </div>
  );
}

