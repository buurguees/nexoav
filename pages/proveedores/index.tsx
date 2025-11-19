"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ProveedoresResumenDesktop } from "./desktop";
import { ProveedoresResumenTabletHorizontal } from "./tablet-horizontal";
import { ProveedoresResumenTablet } from "./tablet";
import { ProveedoresResumenMobile } from "./mobile";

export interface ProveedoresProps {
  className?: string;
}

/**
 * Página de Resumen de Proveedores
 * Dashboard resumen de la sección Proveedores
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Proveedores({ className }: ProveedoresProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ProveedoresResumenDesktop />}
      {breakpoint === "tablet" && <ProveedoresResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ProveedoresResumenTablet />}
      {breakpoint === "mobile" && <ProveedoresResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

