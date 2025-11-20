"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { NominasDesktop } from "./desktop";
import { NominasTabletHorizontal } from "./tablet-horizontal";
import { NominasTablet } from "./tablet";
// import { NominasMobile } from "./mobile";

export interface NominasProps {
  className?: string;
}

/**
 * Página de Nóminas
 * Gestión de nóminas y pagos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px) - Por implementar
 * - Tablet Portrait: (768px - 1024px) - Por implementar
 * - Mobile: (< 768px) - Por implementar
 */
export function Nominas({ className }: NominasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <NominasDesktop />}
      {breakpoint === "tablet" && <NominasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <NominasTablet />}
      {/* {breakpoint === "mobile" && <NominasMobile />} */}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Nóminas por implementar
        </div>
      )}
    </div>
  );
}

