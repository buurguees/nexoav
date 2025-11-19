"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { EmpleadosDesktop } from "./desktop/Empleados";
// import { EmpleadosTabletHorizontal } from "./tablet-horizontal";
// import { EmpleadosTablet } from "./tablet";
// import { EmpleadosMobile } from "./mobile";

export interface EmpleadosProps {
  className?: string;
}

/**
 * Página de Empleados
 * Gestión de empleados y personal
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px) - Por implementar
 * - Tablet Portrait: (768px - 1024px) - Por implementar
 * - Mobile: (< 768px) - Por implementar
 */
export function Empleados({ className }: EmpleadosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <EmpleadosDesktop />}
      {/* {breakpoint === "tablet" && <EmpleadosTabletHorizontal />} */}
      {/* {breakpoint === "tablet-portrait" && <EmpleadosTablet />} */}
      {/* {breakpoint === "mobile" && <EmpleadosMobile />} */}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Empleados por implementar
        </div>
      )}
    </div>
  );
}

