"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { FacturasGastosDesktop } from "./desktop";
import { FacturasGastosTabletHorizontal } from "./tablet-horizontal";
import { FacturasGastosTablet } from "./tablet";
import { FacturasGastosMobile } from "./mobile";

export interface FacturasGastosProps {
  className?: string;
}

/**
 * Página de listado de Facturas de Proveedores
 * Muestra todas las Facturas de proveedores con información relevante para gestión de gastos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function FacturasGastos({ className }: FacturasGastosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <FacturasGastosDesktop />}
      {breakpoint === "tablet" && <FacturasGastosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <FacturasGastosTablet />}
      {breakpoint === "mobile" && <FacturasGastosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

