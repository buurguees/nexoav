"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { RectificativasDesktop } from "./desktop";
import { RectificativasTabletHorizontal } from "./tablet-horizontal";
import { RectificativasTablet } from "./tablet";
import { RectificativasMobile } from "./mobile";

export interface RectificativasProps {
  className?: string;
}

/**
 * Página de listado de Rectificativas
 * Muestra todas las Facturas Rectificativas con información relevante para gestión de facturación
 */
export function Rectificativas({ className }: RectificativasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <RectificativasDesktop />}
      {breakpoint === "tablet" && <RectificativasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <RectificativasTablet />}
      {breakpoint === "mobile" && <RectificativasMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

