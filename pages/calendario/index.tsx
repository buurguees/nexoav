"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { CalendarioDesktop } from "./desktop";
// import { CalendarioTabletHorizontal } from "./tablet-horizontal";
// import { CalendarioTablet } from "./tablet";
// import { CalendarioMobile } from "./mobile";

export interface CalendarioProps {
  className?: string;
}

/**
 * Página de Calendario
 * Muestra el calendario con eventos, citas y tareas
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px) - Por implementar
 * - Tablet Portrait: (768px - 1024px) - Por implementar
 * - Mobile: (< 768px) - Por implementar
 */
export function Calendario({ className }: CalendarioProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <CalendarioDesktop />}
      {/* {breakpoint === "tablet" && <CalendarioTabletHorizontal />} */}
      {/* {breakpoint === "tablet-portrait" && <CalendarioTablet />} */}
      {/* {breakpoint === "mobile" && <CalendarioMobile />} */}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} del Calendario por implementar
        </div>
      )}
    </div>
  );
}

