"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { InicioResumen as InicioResumenDesktop } from "./desktop";
import { InicioTabletHorizontal } from "./tablet-horizontal";
import { InicioTablet } from "./tablet";
import { InicioMobile } from "./mobile";

export interface InicioResumenProps {
  className?: string;
}

/**
 * Páginas del módulo Inicio
 * 
 * Este módulo contiene las vistas principales del módulo "Inicio":
 * - InicioResumen: Vista de resumen con 6 bloques principales (Calendario, Proyectos, Facturas, Presupuestos, Proveedores, Impuestos)
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function InicioResumen({ className }: InicioResumenProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <InicioResumenDesktop />}
      {breakpoint === "tablet" && <InicioTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <InicioTablet />}
      {breakpoint === "mobile" && <InicioMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

