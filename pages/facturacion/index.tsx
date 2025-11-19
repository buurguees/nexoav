"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { FacturacionResumenDesktop } from "./desktop";
import { FacturacionResumenTabletHorizontal } from "./tablet-horizontal";
import { FacturacionResumenTablet } from "./tablet";
import { FacturacionResumenMobile } from "./mobile";

export interface FacturacionProps {
  className?: string;
}

/**
 * Página de Resumen de Facturación
 * Dashboard resumen de la sección Facturación
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Facturacion({ className }: FacturacionProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <FacturacionResumenDesktop />}
      {breakpoint === "tablet" && <FacturacionResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <FacturacionResumenTablet />}
      {breakpoint === "mobile" && <FacturacionResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

