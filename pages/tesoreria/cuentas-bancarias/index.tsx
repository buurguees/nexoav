"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { CuentasBancariasDesktop } from "./desktop";
import { CuentasBancariasTabletHorizontal } from "./tablet-horizontal";
import { CuentasBancariasTablet } from "./tablet";
import { CuentasBancariasMobile } from "./mobile";

export interface CuentasBancariasProps {
  className?: string;
}

/**
 * Página de listado de Cuentas Bancarias
 * Muestra todas las Cuentas Bancarias con información relevante para gestión de tesorería
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function CuentasBancarias({ className }: CuentasBancariasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <CuentasBancariasDesktop />}
      {breakpoint === "tablet" && <CuentasBancariasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <CuentasBancariasTablet />}
      {breakpoint === "mobile" && <CuentasBancariasMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

