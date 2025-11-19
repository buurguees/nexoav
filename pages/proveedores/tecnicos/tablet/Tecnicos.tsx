"use client";

/**
 * Página de Tecnicos - Versión Tablet Portrait (768px - 1024px, vertical)
 * Layout: Listado completo con título, filtros, herramientas (prioridad máxima)
 * Charts opcionales y compactos arriba
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
          fontSize: "11px",
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

export function TecnicosTablet() {
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
      {/* Charts y Tarjetas compactos - 3 columnas: C1, C2, y columna derecha con T1 y T2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "var(--spacing-xs)",
          height: "120px",
          flexShrink: 0,
          minHeight: "120px",
        }}
      >
        {/* Columna 1: Gráfico de Barras (C1) */}
        <SpaceBlock
          label="Gráfico Barras: Proyectos por Estado"
          height="100%"
          color="rgba(67, 83, 255, 0.15)"
          description="Barras: Aprobados, En progreso, En pausa, Completados"
        />
        
        {/* Columna 2: Gráfico de Líneas (C2) */}
        <SpaceBlock
          label="Gráfico Líneas: Evolución Proyectos"
          height="100%"
          color="rgba(0, 200, 117, 0.15)"
          description="Eje X: meses. Eje Y: nº de proyectos creados / cerrados"
        />
        
        {/* Columna 3: Tarjetas T1 y T2 apiladas verticalmente */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
            height: "100%",
            minHeight: 0,
            boxSizing: "border-box",
          }}
        >
          {/* Tarjeta 1: Total de Proyectos Activos (T1) */}
          <div style={{ flex: "1 1 50%", minHeight: 0 }}>
            <SpaceBlock
              label="Tarjeta 1: Total Proyectos Activos"
              height="100%"
              color="rgba(0, 200, 117, 0.2)"
              description="Número grande. Subtítulo: 'En progreso / aprobados'"
              borderWidth="2px"
            />
          </div>
          {/* Tarjeta 2: Volumen Económico (T2) */}
          <div style={{ flex: "1 1 50%", minHeight: 0 }}>
            <SpaceBlock
              label="Tarjeta 2: Volumen Económico"
              height="100%"
              color="rgba(67, 83, 255, 0.2)"
              description="Importe total de proyectos. Indicador verde/rojo"
              borderWidth="2px"
            />
          </div>
        </div>
      </div>

      {/* Listado de Tecnicos - PRIORIDAD MÁXIMA */}
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
        {/* Encabezado del Listado - Fijo - 3 Bloques */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--spacing-xs)",
            height: "35px",
            flexShrink: 0,
            minHeight: "35px",
          }}
        >
          {/* Bloque 1: Filtros */}
          <SpaceBlock
            label="Filtros"
            height="100%"
            color="rgba(255, 165, 0, 0.15)"
            description="Filtros de búsqueda y filtrado"
          />
          {/* Bloque 2: Título */}
          <SpaceBlock
            label="Título: Tecnicos"
            height="100%"
            color="var(--background-secondary)"
            description="Título de la sección"
          />
          {/* Bloque 3: Herramientas */}
          <SpaceBlock
            label="Herramientas"
            height="100%"
            color="rgba(67, 83, 255, 0.15)"
            description="Herramientas de gestión"
          />
        </div>

        {/* Cabecera de la Tabla - Fija */}
        <div style={{ flexShrink: 0, minHeight: "35px" }}>
          <SpaceBlock
            label="Cabecera de la Tabla"
            height="35px"
            color="rgba(0, 200, 117, 0.15)"
            description="Cabecera con columnas: código, nombre, estado, proyectos, facturación"
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
            label="Listado de Tecnicos"
            height="100%"
            color="rgba(0, 200, 117, 0.1)"
            description="Tabla/Lista con información de cada T�cnico. Scroll vertical cuando hay muchos Tecnicos."
          />
        </div>
      </div>
    </div>
  );
}

