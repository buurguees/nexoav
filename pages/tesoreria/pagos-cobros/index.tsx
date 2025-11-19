"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { PagosCobrosDesktop } from "./desktop";
import { PagosCobrosTabletHorizontal } from "./tablet-horizontal";
import { PagosCobrosTablet } from "./tablet";
import { PagosCobrosMobile } from "./mobile";

export interface PagosCobrosProps {
  className?: string;
}

/**
 * Página de listado de Pagos y Cobros
 * Muestra todos los Pagos y Cobros con información relevante para gestión de tesorería
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function PagosCobros({ className }: PagosCobrosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <PagosCobrosDesktop />}
      {breakpoint === "tablet" && <PagosCobrosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <PagosCobrosTablet />}
      {breakpoint === "mobile" && <PagosCobrosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

