"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { PreferenciasDesktop } from "./desktop";
import { PreferenciasTabletHorizontal } from "./tablet-horizontal";
import { PreferenciasTablet } from "./tablet";
// import { PreferenciasMobile } from "./mobile";

export interface PreferenciasProps {
  className?: string;
}

/**
 * Página de Preferencias
 * Configuración y preferencias del sistema
 */
export function Preferencias({ className }: PreferenciasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <PreferenciasDesktop />}
      {breakpoint === "tablet" && <PreferenciasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <PreferenciasTablet />}
      {/* {breakpoint === "mobile" && <PreferenciasMobile />} */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Preferencias por implementar
        </div>
      )}
    </div>
  );
}

