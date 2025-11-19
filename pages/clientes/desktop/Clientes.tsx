"use client";

import { useState, useEffect } from "react";

/**
 * Página de Clientes - Versión Desktop (> 1024px)
 * Layout: Listado (60%) + Chart (40%) lado a lado
 * Optimizado para diferentes tamaños de pantalla desktop
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
  borderWidth = "2px",
  fontSize = "12px"
}: SpaceBlockProps & { fontSize?: string }) {
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

export function ClientesDesktop() {
  const desktopSize = useDesktopSize();
  
  // Configuración responsive según tamaño de desktop
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "35px",
      tableHeaderHeight: "35px",
      cardsMinHeight: "140px",
      cardsGrid: "1fr 1fr 1fr", // 3 columnas
      cardsRows: "1fr 1fr", // 2 filas
      fontSize: "11px",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "40px",
      tableHeaderHeight: "40px",
      cardsMinHeight: "160px",
      cardsGrid: "1fr 1fr 1fr", // 3 columnas
      cardsRows: "1fr 1fr", // 2 filas
      fontSize: "12px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "45px",
      tableHeaderHeight: "45px",
      cardsMinHeight: "180px",
      cardsGrid: "1fr 1fr 1fr", // 3 columnas
      cardsRows: "1fr 1fr", // 2 filas
      fontSize: "12px",
    },
    xlarge: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "50px",
      tableHeaderHeight: "50px",
      cardsMinHeight: "200px",
      cardsGrid: "1fr 1fr 1fr", // 3 columnas
      cardsRows: "1fr 1fr", // 2 filas
      fontSize: "13px",
    },
  };

  const currentConfig = config[desktopSize];

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
      {/* Contenedor principal: Listado + Resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: desktopSize === 'small' ? "2fr 1fr" : "3fr 2fr", // En desktop pequeño, más espacio para listado
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        {/* Listado de clientes - Ocupa 60% del espacio */}
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
          {/* Encabezado del Listado - Fijo - 3 Bloques */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: currentConfig.gap,
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            {/* Bloque 1: Filtros */}
            <SpaceBlock
              label="Filtros"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtros de búsqueda y filtrado: búsqueda, estado, tipo, etc."
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 2: Título */}
            <SpaceBlock
              label="Título: Clientes"
              height="100%"
              color="var(--background-secondary)"
              description="Título de la sección de clientes"
              fontSize={currentConfig.fontSize}
            />
            {/* Bloque 3: Herramientas */}
            <SpaceBlock
              label="Herramientas"
              height="100%"
              color="rgba(67, 83, 255, 0.15)"
              description="Herramientas de gestión: añadir, exportar, acciones masivas, etc."
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Cabecera de la Tabla - Fija */}
          <div style={{ flexShrink: 0, minHeight: currentConfig.tableHeaderHeight }}>
            <SpaceBlock
              label="Cabecera de la Tabla"
              height={currentConfig.tableHeaderHeight}
              color="rgba(0, 200, 117, 0.15)"
              description="Cabecera de la tabla con las columnas: código, nombre, estado, proyectos, facturación, etc."
              fontSize={currentConfig.fontSize}
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
              label="Listado de Clientes"
              height="100%"
              color="rgba(0, 200, 117, 0.1)"
              description="Tabla/Lista con información de cada cliente (código, nombre, estado, proyectos, facturación, etc.)"
              fontSize={currentConfig.fontSize}
            />
          </div>
        </div>

        {/* Sección de Charts - Ocupa 40% del espacio */}
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
          {/* Título de la sección de Charts - Dividido 2/1 (mismo espacio que 2 tarjetas / 1 tarjeta) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: currentConfig.gap,
              height: currentConfig.headerHeight,
              flexShrink: 0,
              minHeight: currentConfig.headerHeight,
            }}
          >
            {/* Título: Resumen (ocupa el espacio de 2 tarjetas) */}
            <SpaceBlock
              label="Resumen"
              height="100%"
              color="var(--background-secondary)"
              description="Resumen y estadísticas de clientes"
              fontSize={currentConfig.fontSize}
            />
            {/* Filtro (ocupa el espacio de 1 tarjeta) */}
            <SpaceBlock
              label="Filtro"
              height="100%"
              color="rgba(255, 165, 0, 0.15)"
              description="Filtro para el resumen: período, tipo de datos, etc."
              fontSize={currentConfig.fontSize}
            />
          </div>
          {/* Fila superior: Tarjetas de Resumen (6 tarjetas) - Optimizadas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: currentConfig.cardsGrid,
              gridTemplateRows: currentConfig.cardsRows,
              gap: currentConfig.gap,
              width: "100%",
              flex: "0 0 auto",
              minHeight: currentConfig.cardsMinHeight,
            }}
          >
            {/* Tarjeta 1: Total de Proyectos Activos */}
            <SpaceBlock
              label="Tarjeta 1: Total Proyectos Activos"
              height="100%"
              color="rgba(0, 200, 117, 0.2)"
              description="Número grande. Subtítulo: 'En progreso / aprobados'. Mide carga de trabajo actual."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />

            {/* Tarjeta 2: Volumen Económico Asociado */}
            <SpaceBlock
              label="Tarjeta 2: Volumen Económico"
              height="100%"
              color="rgba(67, 83, 255, 0.2)"
              description="Importe total de proyectos (presupuestos aceptados). Indicador verde/rojo respecto al mes anterior."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />

            {/* Tarjeta 3: Facturación Emitida */}
            <SpaceBlock
              label="Tarjeta 3: Facturación Emitida"
              height="100%"
              color="rgba(255, 165, 0, 0.2)"
              description="Total facturado al cliente. Badge: 'Pagado / Pendiente / Vencido'. Salud financiera del cliente."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />

            {/* Tarjeta 4: Último Proyecto / Próximo Hito */}
            <SpaceBlock
              label="Tarjeta 4: Último Proyecto / Próximo Hito"
              height="100%"
              color="rgba(220, 53, 69, 0.2)"
              description="Nombre del proyecto más reciente. Fecha del próximo hito estimado. Seguimiento operativo rápido."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />

            {/* Tarjeta 5: Nivel de Actividad del Cliente */}
            <SpaceBlock
              label="Tarjeta 5: Nivel de Actividad"
              height="100%"
              color="rgba(156, 81, 224, 0.2)"
              description="'Alto / Medio / Bajo'. Calculado por nº de proyectos en los últimos X meses. Indica negocio aportado."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />

            {/* Tarjeta 6: Reservada */}
            <SpaceBlock
              label="Tarjeta 6: Reservada"
              height="100%"
              color="rgba(128, 128, 128, 0.2)"
              description="Espacio reservado para futura funcionalidad o métrica adicional."
              borderWidth="2px"
              fontSize={currentConfig.fontSize}
            />
          </div>

          {/* Fila inferior: Gráficos - Optimizados para mejor uso del espacio */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: desktopSize === 'small' ? "1fr" : "1fr 1fr", // En desktop pequeño, gráficos apilados
              gap: currentConfig.gap,
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Columna izquierda: Gráfico de Barras + Gráfico de Líneas */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: currentConfig.gap,
                height: "100%",
                minHeight: 0,
              }}
            >
              {/* Gráfico de Barras: Proyectos por Estado */}
              <div
                style={{
                  width: "100%",
                  flex: "1 1 50%",
                  minHeight: 0,
                }}
              >
                <SpaceBlock
                  label="Gráfico Barras: Proyectos por Estado"
                  height="100%"
                  color="rgba(67, 83, 255, 0.15)"
                  description="Barras: Aprobados, En progreso, En pausa, Completados. Visual para saber 'cómo tenemos a este cliente'."
                  fontSize={currentConfig.fontSize}
                />
              </div>

              {/* Gráfico de Líneas: Evolución de Proyectos en el Tiempo */}
              <div
                style={{
                  width: "100%",
                  flex: "1 1 50%",
                  minHeight: 0,
                }}
              >
                <SpaceBlock
                  label="Gráfico Líneas: Evolución Proyectos"
                  height="100%"
                  color="rgba(0, 200, 117, 0.15)"
                  description="Eje X: meses. Eje Y: nº de proyectos creados / cerrados. Muestra si el cliente está creciendo contigo."
                  fontSize={currentConfig.fontSize}
                />
              </div>
            </div>

            {/* Columna derecha: Pie Chart - Optimizado */}
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SpaceBlock
                label="Pie Chart: Distribución Tipos de Proyecto"
                height="100%"
                color="rgba(156, 81, 224, 0.15)"
                description="Instalación, Mantenimiento, Pantallas LED, Audio, Otros. Ayuda a entender qué te contratan más."
                fontSize={currentConfig.fontSize}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

