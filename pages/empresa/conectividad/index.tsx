"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ConectividadDesktop } from "./desktop";
import { ConectividadTabletHorizontal } from "./tablet-horizontal";
import { ConectividadTablet } from "./tablet";
// import { ConectividadMobile } from "./mobile";

export interface ConectividadProps {
  className?: string;
}

/**
 * Página de Conectividad
 * Integraciones y conexiones externas
 */
export function Conectividad({ className }: ConectividadProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ConectividadDesktop />}
      {breakpoint === "tablet" && <ConectividadTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ConectividadTablet />}
      {/* {breakpoint === "mobile" && <ConectividadMobile />} */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Conectividad por implementar
        </div>
      )}
    </div>
  );
}

