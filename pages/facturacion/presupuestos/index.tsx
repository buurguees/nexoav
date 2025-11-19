"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { PresupuestosDesktop } from "./desktop";
import { PresupuestosTabletHorizontal } from "./tablet-horizontal";
import { PresupuestosTablet } from "./tablet";
import { PresupuestosMobile } from "./mobile";

export interface PresupuestosProps {
  className?: string;
}

/**
 * Página de listado de Presupuestos
 * Muestra todos los Presupuestos con información relevante para gestión de facturación
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Presupuestos({ className }: PresupuestosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <PresupuestosDesktop />}
      {breakpoint === "tablet" && <PresupuestosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <PresupuestosTablet />}
      {breakpoint === "mobile" && <PresupuestosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

