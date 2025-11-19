"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ObjetivosDesktop } from "./desktop";
import { ObjetivosTabletHorizontal } from "./tablet-horizontal";
import { ObjetivosTablet } from "./tablet";
import { ObjetivosMobile } from "./mobile";

export interface ObjetivosProps {
  className?: string;
}

/**
 * Página de Objetivos
 * Muestra todos los objetivos analíticos con información relevante
 */
export function Objetivos({ className }: ObjetivosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ObjetivosDesktop />}
      {breakpoint === "tablet" && <ObjetivosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ObjetivosTablet />}
      {breakpoint === "mobile" && <ObjetivosMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

