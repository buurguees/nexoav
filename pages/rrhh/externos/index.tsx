"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ExternosDesktop } from "./desktop";
// import { ExternosTabletHorizontal } from "./tablet-horizontal";
// import { ExternosTablet } from "./tablet";
// import { ExternosMobile } from "./mobile";

export interface ExternosProps {
  className?: string;
}

/**
 * Página de Externos
 * Gestión de trabajadores externos y colaboradores
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px) - Por implementar
 * - Tablet Portrait: (768px - 1024px) - Por implementar
 * - Mobile: (< 768px) - Por implementar
 */
export function Externos({ className }: ExternosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ExternosDesktop />}
      {/* {breakpoint === "tablet" && <ExternosTabletHorizontal />} */}
      {/* {breakpoint === "tablet-portrait" && <ExternosTablet />} */}
      {/* {breakpoint === "mobile" && <ExternosMobile />} */}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Externos por implementar
        </div>
      )}
    </div>
  );
}

