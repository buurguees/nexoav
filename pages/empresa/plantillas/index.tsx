"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { PlantillasDesktop } from "./desktop";
// import { PlantillasTabletHorizontal } from "./tablet-horizontal";
// import { PlantillasTablet } from "./tablet";
// import { PlantillasMobile } from "./mobile";

export interface PlantillasProps {
  className?: string;
}

/**
 * Página de Plantillas
 * Gestión de plantillas y documentos
 */
export function Plantillas({ className }: PlantillasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <PlantillasDesktop />}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Plantillas por implementar
        </div>
      )}
    </div>
  );
}

