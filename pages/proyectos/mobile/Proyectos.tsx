"use client";

/**
 * Página de Proyectos - Versión Mobile (< 768px)
 * Layout: Solo tabla y listado (sin tarjetas ni gráficos)
 */

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
  borderWidth = "2px"
}: SpaceBlockProps) {
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
  );
}

export function ProyectosMobile() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xs)",
        padding: "var(--spacing-xs)",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Listado de proyectos */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xs)",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Encabezado del Listado - Fijo - 3 Bloques apilados en mobile */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
            flexShrink: 0,
          }}
        >
          {/* Fila 1: Título */}
          <SpaceBlock
            label="Título: Proyectos"
            height="30px"
            color="var(--background-secondary)"
            description="Título de la sección"
          />
          {/* Fila 2: Filtros y Herramientas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-xs)",
              height: "30px",
            }}
          >
            <SpaceBlock
              label="Filtros"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtros"
            />
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas"
            />
          </div>
        </div>

        {/* Cabecera de la Tabla - Fija */}
        <div style={{ flexShrink: 0, minHeight: "30px" }}>
          <SpaceBlock
            label="Cabecera de la Tabla"
            height="30px"
            color="rgba(0, 200, 117, 0.15)"
            description="Cabecera con columnas"
          />
        </div>

        {/* Contenido del Listado - Con scroll */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <SpaceBlock
            label="Listado de Proyectos"
            height="100%"
            color="rgba(0, 200, 117, 0.1)"
            description="Tabla/Lista con información de cada proyecto. Scroll vertical cuando hay muchos proyectos."
          />
        </div>
      </div>
    </div>
  );
}

