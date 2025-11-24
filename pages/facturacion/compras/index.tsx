"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ComprasDesktop } from "./desktop";
import { ComprasTabletHorizontal } from "./tablet-horizontal";
import { ComprasTablet } from "./tablet";
import { ComprasMobile } from "./mobile";

export interface ComprasProps {
  className?: string;
}

/**
 * Página de listado de Compras
 * Muestra todas las compras realizadas a proveedores con información relevante para gestión
 */
export function Compras({ className }: ComprasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ComprasDesktop />}
      {breakpoint === "tablet" && <ComprasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ComprasTablet />}
      {breakpoint === "mobile" && <ComprasMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

