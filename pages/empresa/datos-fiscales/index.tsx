"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { DatosFiscalesDesktop } from "./desktop";
// import { DatosFiscalesTabletHorizontal } from "./tablet-horizontal";
// import { DatosFiscalesTablet } from "./tablet";
// import { DatosFiscalesMobile } from "./mobile";

export interface DatosFiscalesProps {
  className?: string;
}

/**
 * Página de Datos Fiscales
 * Gestión de información fiscal y datos de la empresa
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px) - Por implementar
 * - Tablet Portrait: (768px - 1024px) - Por implementar
 * - Mobile: (< 768px) - Por implementar
 */
export function DatosFiscales({ className }: DatosFiscalesProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <DatosFiscalesDesktop />}
      {/* {breakpoint === "tablet" && <DatosFiscalesTabletHorizontal />} */}
      {/* {breakpoint === "tablet-portrait" && <DatosFiscalesTablet />} */}
      {/* {breakpoint === "mobile" && <DatosFiscalesMobile />} */}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Datos Fiscales por implementar
        </div>
      )}
    </div>
  );
}

