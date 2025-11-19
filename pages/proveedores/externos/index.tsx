"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ExternosDesktop } from "./desktop";
import { ExternosTabletHorizontal } from "./tablet-horizontal";
import { ExternosTablet } from "./tablet";
import { ExternosMobile } from "./mobile";

export interface ExternosProps {
  className?: string;
}

/**
 * Página de listado de Externos
 * Muestra todos los Externos con información relevante para gestión de proyectos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Externos({ className }: ExternosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ExternosDesktop />}
      {breakpoint === "tablet" && <ExternosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ExternosTablet />}
      {breakpoint === "mobile" && <ExternosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

