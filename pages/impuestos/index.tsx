"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ImpuestosDesktop } from "./desktop";
import { ImpuestosTabletHorizontal } from "./tablet-horizontal";
import { ImpuestosTablet } from "./tablet";
import { ImpuestosMobile } from "./mobile";

export interface ImpuestosProps {
  className?: string;
}

/**
 * Página de Impuestos
 * Muestra la gestión de impuestos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Impuestos({ className }: ImpuestosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ImpuestosDesktop />}
      {breakpoint === "tablet" && <ImpuestosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ImpuestosTablet />}
      {breakpoint === "mobile" && <ImpuestosMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

