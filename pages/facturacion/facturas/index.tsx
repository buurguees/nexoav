"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { FacturasDesktop } from "./desktop";
import { FacturasTabletHorizontal } from "./tablet-horizontal";
import { FacturasTablet } from "./tablet";
import { FacturasMobile } from "./mobile";

export interface FacturasProps {
  className?: string;
}

/**
 * Página de listado de Facturas
 * Muestra todas las Facturas con información relevante para gestión de facturación
 */
export function Facturas({ className }: FacturasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <FacturasDesktop />}
      {breakpoint === "tablet" && <FacturasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <FacturasTablet />}
      {breakpoint === "mobile" && <FacturasMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

