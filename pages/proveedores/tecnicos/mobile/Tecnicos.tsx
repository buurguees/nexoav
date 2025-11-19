"use client";

/**
 * Página de Tecnicos - Versión Mobile (< 768px)
 * Layout: Listado completo con título, filtros, herramientas (prioridad máxima)
 * Charts opcionales y muy compactos arriba
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

export function TecnicosMobile() {
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
      {/* Tarjetas compactas - 4 tarjetas en grid 2x2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "var(--spacing-xs)",
          height: "100px",
          flexShrink: 0,
          minHeight: "100px",
        }}
      >
        {/* Tarjeta 1: Total de Proyectos Activos */}
        <SpaceBlock
          label="Tarjeta 1: Total Proyectos Activos"
          height="100%"
          color="rgba(0, 200, 117, 0.2)"
          description="Número grande. Subtítulo: 'En progreso / aprobados'"
          borderWidth="2px"
        />
        {/* Tarjeta 2: Volumen Económico */}
        <SpaceBlock
          label="Tarjeta 2: Volumen Económico"
          height="100%"
          color="rgba(67, 83, 255, 0.2)"
          description="Importe total de proyectos. Indicador verde/rojo"
          borderWidth="2px"
        />
        {/* Tarjeta 3: Facturación Emitida */}
        <SpaceBlock
          label="Tarjeta 3: Facturación Emitida"
          height="100%"
          color="rgba(255, 165, 0, 0.2)"
          description="Total facturado. Badge: 'Pagado / Pendiente / Vencido'"
          borderWidth="2px"
        />
        {/* Tarjeta 4: Último Proyecto / Próximo Hito */}
        <SpaceBlock
          label="Tarjeta 4: Último Proyecto / Próximo Hito"
          height="100%"
          color="rgba(220, 53, 69, 0.2)"
          description="Nombre del proyecto más reciente. Fecha próximo hito"
          borderWidth="2px"
        />
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
            label="Título: Tecnicos"
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

