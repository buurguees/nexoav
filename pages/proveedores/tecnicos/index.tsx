"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { TecnicosDesktop } from "./desktop";
import { TecnicosTabletHorizontal } from "./tablet-horizontal";
import { TecnicosTablet } from "./tablet";
import { TecnicosMobile } from "./mobile";

export interface TecnicosProps {
  className?: string;
}

/**
 * Página de listado de Tecnicos
 * Muestra todos los Tecnicos con información relevante para gestión de proyectos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Tecnicos({ className }: TecnicosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <TecnicosDesktop />}
      {breakpoint === "tablet" && <TecnicosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <TecnicosTablet />}
      {breakpoint === "mobile" && <TecnicosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

