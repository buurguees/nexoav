"use client";

import { useState, useEffect } from "react";

/**
 * Página de Empleados - Versión Desktop (> 1024px)
 * Layout: División vertical 30/70 - Listado (30%) + Calendario (70%)
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

export function EmpleadosDesktop() {
  const desktopSize = useDesktopSize();
  
  // Configuración responsive según tamaño de desktop
  const config = {
    small: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "35px",
      fontSize: "11px",
    },
    medium: {
      padding: "var(--spacing-xs)",
      gap: "var(--spacing-xs)",
      headerHeight: "40px",
      fontSize: "12px",
    },
    large: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "45px",
      fontSize: "12px",
    },
    xlarge: {
      padding: "var(--spacing-sm)",
      gap: "var(--spacing-sm)",
      headerHeight: "50px",
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
      {/* Encabezado - 3 Bloques: Filtros (20%), Título (60%), Herramientas (20%) */}
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
          description="Filtros de búsqueda y filtrado de empleados"
          fontSize={currentConfig.fontSize}
        />
        {/* Bloque 2: Título (60%) */}
        <SpaceBlock
          label="Empleados"
          height="100%"
          color="var(--background-secondary)"
          description="Título de la sección de empleados"
          fontSize={currentConfig.fontSize}
        />
        {/* Bloque 3: Herramientas (20%) */}
        <SpaceBlock
          label="Herramientas"
          height="100%"
          color="rgba(67, 83, 255, 0.15)"
          description="Herramientas de gestión de empleados"
          fontSize={currentConfig.fontSize}
        />
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
              description="Lista de empleados/recursos"
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
            {/* Ejemplo de filas de recursos - cada fila representa un empleado */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                style={{
                  minHeight: "40px",
                  height: "40px",
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
                  Empleado {item}
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
            {/* Ejemplo de filas del calendario - cada fila corresponde a un recurso */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((recurso) => (
              <div
                key={recurso}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "2px",
                  minHeight: "40px",
                  height: "40px",
                  flexShrink: 0,
                }}
              >
                {/* 7 celdas por fila (una por cada día de la semana) */}
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
                      fontSize: "10px",
                      color: "var(--foreground-tertiary)",
                    }}
                  >
                    {/* Aquí irían los eventos/tareas del recurso para ese día */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

