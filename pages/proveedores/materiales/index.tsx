"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { MaterialesDesktop } from "./desktop";
import { MaterialesTabletHorizontal } from "./tablet-horizontal";
import { MaterialesTablet } from "./tablet";
import { MaterialesMobile } from "./mobile";

export interface MaterialesProps {
  className?: string;
}

/**
 * Página de listado de Materiales
 * Muestra todos los Materiales con información relevante para gestión de proyectos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Materiales({ className }: MaterialesProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <MaterialesDesktop />}
      {breakpoint === "tablet" && <MaterialesTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <MaterialesTablet />}
      {breakpoint === "mobile" && <MaterialesMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

