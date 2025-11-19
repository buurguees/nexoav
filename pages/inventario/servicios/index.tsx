"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ServiciosDesktop } from "./desktop";
import { ServiciosTabletHorizontal } from "./tablet-horizontal";
import { ServiciosTablet } from "./tablet";
import { ServiciosMobile } from "./mobile";

export interface ServiciosProps {
  className?: string;
}

/**
 * Página de listado de Servicios
 * Muestra todos los Servicios con información relevante para gestión de inventario
 */
export function Servicios({ className }: ServiciosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ServiciosDesktop />}
      {breakpoint === "tablet" && <ServiciosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ServiciosTablet />}
      {breakpoint === "mobile" && <ServiciosMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}
