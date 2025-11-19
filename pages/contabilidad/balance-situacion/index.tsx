"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { BalanceSituacionDesktop } from "./desktop";
import { BalanceSituacionTabletHorizontal } from "./tablet-horizontal";
import { BalanceSituacionTablet } from "./tablet";
import { BalanceSituacionMobile } from "./mobile";

export interface BalanceSituacionProps {
  className?: string;
}

/**
 * Página de Balance de Situación
 * Muestra el balance de situación contable con información relevante
 */
export function BalanceSituacion({ className }: BalanceSituacionProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <BalanceSituacionDesktop />}
      {breakpoint === "tablet" && <BalanceSituacionTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <BalanceSituacionTablet />}
      {breakpoint === "mobile" && <BalanceSituacionMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

