"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { InformesDesktop } from "./desktop";
import { InformesTabletHorizontal } from "./tablet-horizontal";
import { InformesTablet } from "./tablet";
import { InformesMobile } from "./mobile";

export interface InformesProps {
  className?: string;
}

/**
 * Página de Informes
 * Muestra todos los informes analíticos con información relevante
 */
export function Informes({ className }: InformesProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <InformesDesktop />}
      {breakpoint === "tablet" && <InformesTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <InformesTablet />}
      {breakpoint === "mobile" && <InformesMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

