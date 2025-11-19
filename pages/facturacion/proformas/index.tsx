"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { ProformasDesktop } from "./desktop";
import { ProformasTabletHorizontal } from "./tablet-horizontal";
import { ProformasTablet } from "./tablet";
import { ProformasMobile } from "./mobile";

export interface ProformasProps {
  className?: string;
}

/**
 * Página de listado de Proformas
 * Muestra todas las Proformas con información relevante para gestión de facturación
 */
export function Proformas({ className }: ProformasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ProformasDesktop />}
      {breakpoint === "tablet" && <ProformasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ProformasTablet />}
      {breakpoint === "mobile" && <ProformasMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

