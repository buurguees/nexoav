"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { TesoreriaResumenDesktop } from "./desktop";
import { TesoreriaResumenTabletHorizontal } from "./tablet-horizontal";
import { TesoreriaResumenTablet } from "./tablet";
import { TesoreriaResumenMobile } from "./mobile";

export interface TesoreriaProps {
  className?: string;
}

/**
 * Página de Resumen de Tesorería
 * Dashboard resumen de la sección Tesorería
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Tesoreria({ className }: TesoreriaProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <TesoreriaResumenDesktop />}
      {breakpoint === "tablet" && <TesoreriaResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <TesoreriaResumenTablet />}
      {breakpoint === "mobile" && <TesoreriaResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

