"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { RRHHResumenDesktop } from "./desktop";
import { RRHHResumenTabletHorizontal } from "./tablet-horizontal";
import { RRHHResumenTablet } from "./tablet";
import { RRHHResumenMobile } from "./mobile";

export interface RRHHProps {
  className?: string;
}

/**
 * Página de Resumen de RRHH
 * Dashboard resumen de la sección RRHH
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function RRHH({ className }: RRHHProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <RRHHResumenDesktop />}
      {breakpoint === "tablet" && <RRHHResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <RRHHResumenTablet />}
      {breakpoint === "mobile" && <RRHHResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

