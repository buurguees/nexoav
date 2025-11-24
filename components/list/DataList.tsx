"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ReactNode } from "react";

/**
 * Componente reutilizable de listado con título, filtros, herramientas y tabla responsiva
 * 
 * Características:
 * - Título configurable
 * - Filtros opcionales (activables con showFilters)
 * - Herramientas opcionales (activables con showTools)
 * - Tabla responsiva:
 *   - Desktop/Tablet-horizontal: 5 columnas
 *   - Tablet: 4 columnas
 *   - Mobile: 3 columnas
 * - Flexible para personalizar la lectura y trabajo de datos
 */

export interface DataListColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right"; // Alineación del contenido
  // Para controlar qué columnas se muestran en cada breakpoint
  visibleOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

export interface DataListProps<T = any> {
  // Configuración básica
  title: string;
  data: T[];
  
  // Columnas de la tabla
  columns: DataListColumn<T>[];
  
  // Configuración de secciones
  showFilters?: boolean;
  showTools?: boolean;
  
  // Renderizado personalizado
  renderFilters?: () => ReactNode;
  renderTools?: () => ReactNode;
  renderRow?: (item: T, index: number) => ReactNode;
  
  // Estilos personalizados
  className?: string;
  containerClassName?: string;
  
  // Callbacks
  onRowClick?: (item: T, index: number) => void;
  onRowDoubleClick?: (item: T, index: number) => void;
  
  // Estado de carga
  isLoading?: boolean;
  emptyMessage?: string;
  
  // Personalización del grid (opcional)
  customGridColumns?: string; // Template para grid-template-columns personalizado
}

export function DataList<T = any>({
  title,
  data,
  columns,
  showFilters = false,
  showTools = false,
  renderFilters,
  renderTools,
  renderRow,
  className = "",
  containerClassName = "",
  onRowClick,
  onRowDoubleClick,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  customGridColumns,
}: DataListProps<T>) {
  const breakpoint = useBreakpoint();
  
  // Determinar número de columnas según breakpoint
  const getVisibleColumns = () => {
    const isDesktop = breakpoint === "desktop";
    const isTablet = breakpoint === "tablet"; // Tablet horizontal
    const isTabletPortrait = breakpoint === "tablet-portrait";
    
    // Desktop y Tablet-horizontal: hasta 8 columnas (para proyectos con Facturación)
    if (isDesktop || isTablet) {
      return columns
        .filter(col => col.visibleOn?.desktop !== false)
        .slice(0, 8);
    } 
    // Tablet portrait: 4 columnas
    else if (isTabletPortrait) {
      return columns
        .filter(col => col.visibleOn?.tablet !== false)
        .slice(0, 4);
    } 
    // Mobile: 3 columnas
    else {
      return columns
        .filter(col => col.visibleOn?.mobile !== false)
        .slice(0, 3);
    }
  };
  
  const visibleColumns = getVisibleColumns();
  
  // Calcular grid columns según número de columnas visibles
  // Distribución proporcional con espaciado correcto para cada tipo de contenido
  // El nombre necesita más espacio ya que puede contener nombres largos
  const getGridColumns = () => {
    const count = visibleColumns.length;
    
    if (count >= 8) {
      // Desktop/Tablet-horizontal: 8 columnas visibles (para proyectos)
      // Orden: Código | Nombre | Cliente | Estado | Fecha Inicio | Fecha Fin | Presupuesto | Facturación
      // Este grid se sobrescribe con customGridColumns en ProyectosList
      return "0.7fr 2fr 1.3fr 1fr 1fr 1fr 1.2fr 1.3fr";
    } else if (count === 7) {
      // Desktop/Tablet-horizontal: 7 columnas visibles (para clientes)
      // Orden: Código | Nombre (más ancho) | CIF/NIF | Ciudad | Estado | Proyectos | Total Facturación
      // Espaciado: código compacto, nombre muy amplio, resto proporcional
      return "0.8fr 3fr 1.1fr 1.2fr 1fr 0.9fr 1.5fr";
    } else if (count === 6) {
      // Si hay 6 columnas (fallback)
      return "0.8fr 3fr 1.1fr 1.2fr 1fr 1.5fr";
    } else if (count === 5) {
      // Si hay 5 columnas (fallback)
      return "0.8fr 3fr 1.1fr 1fr 1.5fr";
    } else if (count === 4) {
      // Tablet portrait: 4 columnas visibles
      // Orden: Código | Nombre (más ancho) | CIF/NIF | Proyectos | Total Facturación
      return "0.8fr 3.2fr 1.2fr 1fr 1.3fr";
    } else {
      // Mobile: 3 columnas visibles
      // Orden: Código | Nombre (más ancho) | Estado
      return "0.9fr 3.5fr 1.1fr";
    }
  };
  
  const gridColumns = customGridColumns || getGridColumns();
  
  // Renderizado de fila por defecto
  const defaultRenderRow = (item: T, index: number) => {
    return (
      <div
        key={index}
        onClick={() => onRowClick?.(item, index)}
        onDoubleClick={() => onRowDoubleClick?.(item, index)}
        style={{
          display: "grid",
          gridTemplateColumns: gridColumns,
          gap: "var(--spacing-sm)",
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderBottom: "1px solid var(--border-soft)",
          cursor: onRowClick || onRowDoubleClick ? "pointer" : "default",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (onRowClick || onRowDoubleClick) {
            e.currentTarget.style.backgroundColor = "var(--background-secondary)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {visibleColumns.map((column) => (
          <div
            key={column.key}
            className={column.className}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: column.align === "right" ? "flex-end" : column.align === "center" ? "center" : "flex-start",
              fontSize: "var(--font-size-sm)",
              color: "var(--foreground-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {column.render ? column.render(item, index) : String((item as any)[column.key] ?? "")}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div
      className={containerClassName}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden", // La página no debe hacer scroll
        boxSizing: "border-box",
      }}
    >
      {/* Sección superior: Título, Filtros y Herramientas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: (() => {
            // Calcular columnas según qué secciones están activas
            const sections = [];
            if (showFilters) sections.push("1fr");
            sections.push("1fr"); // Título siempre presente
            if (showTools) sections.push("1fr");
            
            return sections.join(" ");
          })(),
          gap: "var(--spacing-sm)",
          padding: "var(--spacing-md)",
          flexShrink: 0,
          borderBottom: "1px solid var(--border-soft)",
          backgroundColor: "var(--background)",
        }}
      >
        {/* Filtros */}
        {showFilters && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "40px",
            }}
          >
            {renderFilters ? (
              renderFilters()
            ) : (
              <div
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Filtros (personalizar con renderFilters)
              </div>
            )}
          </div>
        )}
        
        {/* Título */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            {title}
          </h2>
        </div>
        
        {/* Herramientas */}
        {showTools && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--spacing-sm)",
              minHeight: "40px",
            }}
          >
            {renderTools ? (
              renderTools()
            ) : (
              <div
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Herramientas (personalizar con renderTools)
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Cabecera de la tabla */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridColumns,
          gap: "var(--spacing-sm)",
          padding: "var(--spacing-sm) var(--spacing-md)",
          backgroundColor: "var(--background-secondary)",
          borderBottom: "2px solid var(--border-medium)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {visibleColumns.map((column) => (
          <div
            key={column.key}
            className={column.headerClassName}
            style={{
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--foreground-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: column.align || "left",
            }}
          >
            {column.label}
          </div>
        ))}
      </div>
      
      {/* Contenido de la tabla con scroll */}
      <div
        className={`${className} page-content-scroll`}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "var(--background)",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--spacing-2xl)",
              color: "var(--foreground-tertiary)",
            }}
          >
            Cargando...
          </div>
        ) : data.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--spacing-2xl)",
              color: "var(--foreground-tertiary)",
            }}
          >
            {emptyMessage}
          </div>
        ) : (
          <>
            {renderRow
              ? data.map((item, index) => renderRow(item, index))
              : data.map((item, index) => defaultRenderRow(item, index))}
          </>
        )}
      </div>
    </div>
  );
}

