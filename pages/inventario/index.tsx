"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { InventarioResumenDesktop } from "./desktop";
import { InventarioResumenTabletHorizontal } from "./tablet-horizontal";
import { InventarioResumenTablet } from "./tablet";
import { InventarioResumenMobile } from "./mobile";

export interface InventarioProps {
  className?: string;
}

/**
 * Página de Resumen de Inventario
 * Dashboard resumen de la sección Inventario
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Inventario({ className }: InventarioProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <InventarioResumenDesktop />}
      {breakpoint === "tablet" && <InventarioResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <InventarioResumenTablet />}
      {breakpoint === "mobile" && <InventarioResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

