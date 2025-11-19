"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { SoftwaresDesktop } from "./desktop";
import { SoftwaresTabletHorizontal } from "./tablet-horizontal";
import { SoftwaresTablet } from "./tablet";
import { SoftwaresMobile } from "./mobile";

export interface SoftwaresProps {
  className?: string;
}

/**
 * Página de listado de Softwares
 * Muestra todos los Softwares con información relevante para gestión de proyectos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Softwares({ className }: SoftwaresProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <SoftwaresDesktop />}
      {breakpoint === "tablet" && <SoftwaresTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <SoftwaresTablet />}
      {breakpoint === "mobile" && <SoftwaresMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

