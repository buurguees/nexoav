"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { MapaDesktop } from "./desktop";
import { MapaTabletHorizontal } from "./tablet-horizontal";
import { MapaTablet } from "./tablet";
import { MapaMobile } from "./mobile";

export interface MapaProps {
  className?: string;
}

/**
 * Página de Mapa
 * Muestra el mapa interactivo con ubicaciones y puntos de interés
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Mapa({ className }: MapaProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <MapaDesktop />}
      {breakpoint === "tablet" && <MapaTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <MapaTablet />}
      {breakpoint === "mobile" && <MapaMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

