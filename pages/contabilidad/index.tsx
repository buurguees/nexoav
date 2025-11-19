"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ContabilidadResumenDesktop } from "./desktop";
import { ContabilidadResumenTabletHorizontal } from "./tablet-horizontal";
import { ContabilidadResumenTablet } from "./tablet";
import { ContabilidadResumenMobile } from "./mobile";

export interface ContabilidadProps {
  className?: string;
}

/**
 * Página de Resumen de Contabilidad
 * Dashboard resumen de la sección Contabilidad
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Contabilidad({ className }: ContabilidadProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ContabilidadResumenDesktop />}
      {breakpoint === "tablet" && <ContabilidadResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ContabilidadResumenTablet />}
      {breakpoint === "mobile" && <ContabilidadResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

