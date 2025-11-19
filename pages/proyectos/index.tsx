"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ProyectosDesktop } from "./desktop";
import { ProyectosTabletHorizontal } from "./tablet-horizontal";
import { ProyectosTablet } from "./tablet";
import { ProyectosMobile } from "./mobile";

export interface ProyectosProps {
  className?: string;
}

/**
 * Página de listado de proyectos
 * Muestra todos los proyectos con información relevante para gestión
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Proyectos({ className }: ProyectosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ProyectosDesktop />}
      {breakpoint === "tablet" && <ProyectosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ProyectosTablet />}
      {breakpoint === "mobile" && <ProyectosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

