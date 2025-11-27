"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { AlbaranesDesktop } from "./desktop";
import { AlbaranesTabletHorizontal } from "./tablet-horizontal";
import { AlbaranesTablet } from "./tablet";
import { AlbaranesMobile } from "./mobile";

export interface AlbaranesProps {
  className?: string;
}

/**
 * Página de listado de Albaranes
 * Muestra todos los Albaranes con información relevante para gestión logística
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado completo
 * - Tablet Horizontal: Listado adaptado
 * - Tablet Portrait: Listado adaptado
 * - Mobile: Listado adaptado
 */
export function Albaranes({ className }: AlbaranesProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <AlbaranesDesktop />}
      {breakpoint === "tablet" && <AlbaranesTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <AlbaranesTablet />}
      {breakpoint === "mobile" && <AlbaranesMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

