"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { EmpresaResumenDesktop } from "./desktop";
import { EmpresaResumenTabletHorizontal } from "./tablet-horizontal";
import { EmpresaResumenTablet } from "./tablet";
import { EmpresaResumenMobile } from "./mobile";

export interface EmpresaProps {
  className?: string;
}

/**
 * Página de Resumen de Empresa
 * Dashboard resumen de la sección Empresa
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Empresa({ className }: EmpresaProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <EmpresaResumenDesktop />}
      {breakpoint === "tablet" && <EmpresaResumenTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <EmpresaResumenTablet />}
      {breakpoint === "mobile" && <EmpresaResumenMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

