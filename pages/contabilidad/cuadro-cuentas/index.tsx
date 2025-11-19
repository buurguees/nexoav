"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { CuadroCuentasDesktop } from "./desktop";
import { CuadroCuentasTabletHorizontal } from "./tablet-horizontal";
import { CuadroCuentasTablet } from "./tablet";
import { CuadroCuentasMobile } from "./mobile";

export interface CuadroCuentasProps {
  className?: string;
}

/**
 * Página de Cuadro de Cuentas
 * Muestra el cuadro de cuentas contables con información relevante para gestión contable
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function CuadroCuentas({ className }: CuadroCuentasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <CuadroCuentasDesktop />}
      {breakpoint === "tablet" && <CuadroCuentasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <CuadroCuentasTablet />}
      {breakpoint === "mobile" && <CuadroCuentasMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

