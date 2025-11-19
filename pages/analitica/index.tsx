"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { AnaliticaResumenDesktop } from "./desktop";
import { AnaliticaResumenTabletHorizontal } from "./tablet-horizontal";
import { AnaliticaResumenTablet } from "./tablet";
import { AnaliticaResumenMobile } from "./mobile";

export interface AnaliticaProps {
  className?: string;
}

/**
 * Página de Resumen de Analítica
 * Dashboard resumen de la sección Analítica
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Analitica({ className }: AnaliticaProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <AnaliticaResumenDesktop />}
      {breakpoint === "tablet" && <AnaliticaResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <AnaliticaResumenTablet />}
      {breakpoint === "mobile" && <AnaliticaResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

