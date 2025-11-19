"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ActivosDesktop } from "./desktop";
import { ActivosTabletHorizontal } from "./tablet-horizontal";
import { ActivosTablet } from "./tablet";
import { ActivosMobile } from "./mobile";

export interface ActivosProps {
  className?: string;
}

/**
 * Página de Activos
 * Muestra todos los activos contables con información relevante
 */
export function Activos({ className }: ActivosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ActivosDesktop />}
      {breakpoint === "tablet" && <ActivosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ActivosTablet />}
      {breakpoint === "mobile" && <ActivosMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

