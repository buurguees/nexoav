"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { GastosResumenDesktop } from "./desktop";
import { GastosResumenTabletHorizontal } from "./tablet-horizontal";
import { GastosResumenTablet } from "./tablet";
import { GastosResumenMobile } from "./mobile";

export interface GastosProps {
  className?: string;
}

/**
 * Página de Resumen de Gastos
 * Dashboard resumen de la sección Gastos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Gastos({ className }: GastosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <GastosResumenDesktop />}
      {breakpoint === "tablet" && <GastosResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <GastosResumenTablet />}
      {breakpoint === "mobile" && <GastosResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

