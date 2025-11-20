"use client";

import { motion } from "motion/react";
import { useTabletSize } from "../../../hooks/useTabletSize";

/**
 * Página de Clientes - Versión Tablet Portrait (768px - 1024px)
 * Layout optimizado para tablet portrait:
 * - Header: Filtros, Título, Herramientas
 * - 3 Tarjetas de Información (en fila)
 * - Listado de Clientes (con scroll)
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

export function ClientesTablet() {
  const tabletSize = useTabletSize();

  // Configuración responsive según tamaño de tablet
  const config = {
    small: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "35px",
      cardsHeight: "100px",
      tableHeaderHeight: "30px",
      chartsHeight: "180px",
      fontSize: "10px",
    },
    medium: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "40px",
      cardsHeight: "120px",
      tableHeaderHeight: "35px",
      chartsHeight: "200px",
      fontSize: "11px",
    },
    large: {
      padding: "var(--spacing-md)",
      gap: "var(--spacing-md)",
      headerHeight: "45px",
      cardsHeight: "140px",
      tableHeaderHeight: "40px",
      chartsHeight: "220px",
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
      {/* Header: Filtros, Título, Herramientas */}
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
        {/* Bloque 1: Filtros */}
        <SpaceBlock
          label="Filtros"
          height="100%"
          color="rgba(255, 165, 0, 0.15)"
          description="Filtros de búsqueda y filtrado"
          fontSize={currentConfig.fontSize}
        />
        {/* Bloque 2: Título */}
        <SpaceBlock
          label="Clientes"
          height="100%"
          color="var(--background-secondary)"
          description="Título de la sección"
          fontSize={currentConfig.fontSize}
        />
        {/* Bloque 3: Herramientas */}
        <SpaceBlock
          label="Herramientas"
          height="100%"
          color="rgba(67, 83, 255, 0.15)"
          description="Herramientas de gestión"
          fontSize={currentConfig.fontSize}
        />
      </div>

      {/* 3 Tarjetas de Información - Mismas que desktop pero compactas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: currentConfig.gap,
          height: currentConfig.cardsHeight,
          flexShrink: 0,
          minHeight: currentConfig.cardsHeight,
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
      </div>

      {/* Listado de Clientes */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: currentConfig.gap,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Cabecera de la Tabla - Mismas columnas que desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: tabletSize === 'small'
              ? "1fr 2.5fr 1.2fr 1.2fr 1.1fr"  // 5 columnas para small (igual que desktop)
              : tabletSize === 'medium'
              ? "1fr 2.5fr 1.2fr 1.2fr 1.1fr 1fr"  // 6 columnas para medium (igual que desktop)
              : "1fr 2.5fr 1.2fr 1.2fr 1.1fr 1fr 0.8fr",  // 7 columnas para large (igual que desktop)
            gap: "2px",
            height: currentConfig.tableHeaderHeight,
            flexShrink: 0,
            minHeight: currentConfig.tableHeaderHeight,
          }}
        >
          <SpaceBlock
            label="Código"
            height="100%"
            color="rgba(0, 200, 117, 0.15)"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Nombre"
            height="100%"
            color="rgba(0, 200, 117, 0.15)"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Estado"
            height="100%"
            color="rgba(0, 200, 117, 0.15)"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Proyectos"
            height="100%"
            color="rgba(0, 200, 117, 0.15)"
            fontSize={currentConfig.fontSize}
          />
          <SpaceBlock
            label="Facturación"
            height="100%"
            color="rgba(0, 200, 117, 0.15)"
            fontSize={currentConfig.fontSize}
          />
          {tabletSize !== 'small' && (
            <SpaceBlock
              label="Contacto"
              height="100%"
              color="rgba(0, 200, 117, 0.15)"
              fontSize={currentConfig.fontSize}
            />
          )}
          {tabletSize === 'large' && (
            <SpaceBlock
              label="Fecha Alta"
              height="100%"
              color="rgba(0, 200, 117, 0.15)"
              fontSize={currentConfig.fontSize}
            />
          )}
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

      {/* Gráficos en la parte inferior - Mismos que desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: currentConfig.gap,
          height: currentConfig.chartsHeight,
          flexShrink: 0,
          minHeight: currentConfig.chartsHeight,
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

        {/* Columna derecha: Pie Chart */}
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
    </motion.div>
  );
}
