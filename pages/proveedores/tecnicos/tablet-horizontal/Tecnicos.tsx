"use client";

/**
 * Página de Tecnicos - Versión Tablet Horizontal (768px - 1024px, horizontal)
 * Layout: 70/30 horizontal
 * - 70%: Listado completo con título, filtros, herramientas (prioridad máxima)
 * - 30%: Charts y tarjetas apilados verticalmente en una columna
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

export function TecnicosTabletHorizontal() {
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
      {/* Contenedor principal: Listado (70%) + Charts/Tarjetas (30%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "7fr 3fr",
          gap: "var(--spacing-xs)",
          flex: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Columna izquierda (70%): Listado de Tecnicos - PRIORIDAD MÁXIMA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
            height: "100%",
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

        {/* Columna derecha (30%): Charts y Tarjetas apilados verticalmente */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-xs)",
            height: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Título de la sección de Charts */}
          <div style={{ flexShrink: 0, minHeight: "35px" }}>
            <SpaceBlock
              label="Resumen"
              height="35px"
              color="var(--background-secondary)"
              description="Resumen y estadísticas"
            />
          </div>

          {/* Charts y Tarjetas - Apilados verticalmente */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xs)",
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* Gráfico de Barras: Proyectos por Estado - Mayor altura */}
            <SpaceBlock
              label="Gráfico Barras: Proyectos por Estado"
              height="180px"
              color="rgba(67, 83, 255, 0.15)"
              description="Barras: Aprobados, En progreso, En pausa, Completados"
            />

            {/* Gráfico de Líneas: Evolución de Proyectos - Mayor altura */}
            <SpaceBlock
              label="Gráfico Líneas: Evolución Proyectos"
              height="180px"
              color="rgba(0, 200, 117, 0.15)"
              description="Eje X: meses. Eje Y: nº de proyectos creados / cerrados"
            />

            {/* Tarjetas - Grid 2x2 (4 de las 6 tarjetas principales) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "var(--spacing-xs)",
                minHeight: "140px",
                flex: "0 0 auto",
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

            {/* Pie Chart: Distribución Tipos de Proyecto - Extendido hasta abajo */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
              }}
            >
              <SpaceBlock
                label="Pie Chart: Distribución Tipos de Proyecto"
                height="100%"
                color="rgba(156, 81, 224, 0.15)"
                description="Instalación, Mantenimiento, Pantallas LED, Audio, Otros"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

