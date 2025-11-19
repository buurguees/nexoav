"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { CashflowDesktop } from "./desktop";
import { CashflowTabletHorizontal } from "./tablet-horizontal";
import { CashflowTablet } from "./tablet";
import { CashflowMobile } from "./mobile";

export interface CashflowProps {
  className?: string;
}

/**
 * Página de Cashflow
 * Muestra el flujo de caja con información relevante para gestión de tesorería
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Cashflow({ className }: CashflowProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <CashflowDesktop />}
      {breakpoint === "tablet" && <CashflowTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <CashflowTablet />}
      {breakpoint === "mobile" && <CashflowMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

