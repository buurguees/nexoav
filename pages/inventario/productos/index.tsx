"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ProductosDesktop } from "./desktop";
import { ProductosTabletHorizontal } from "./tablet-horizontal";
import { ProductosTablet } from "./tablet";
import { ProductosMobile } from "./mobile";

export interface ProductosProps {
  className?: string;
}

/**
 * Página de listado de Productos
 * Muestra todos los Productos con información relevante para gestión de proyectos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Productos({ className }: ProductosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ProductosDesktop />}
      {breakpoint === "tablet" && <ProductosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ProductosTablet />}
      {breakpoint === "mobile" && <ProductosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

