"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { CalculadoraDesktop } from "./desktop";
import { CalculadoraTabletHorizontal } from "./tablet-horizontal";
import { CalculadoraTablet } from "./tablet";
import { CalculadoraMobile } from "./mobile";

export interface CalculadoraProps {
  className?: string;
}

/**
 * Página de Calculadora de Alquiler de Pantallas LED
 * Permite calcular estimativamente el precio de alquiler según las necesidades del cliente
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: (> 1024px)
 * - Tablet Horizontal: (1024px - 1280px)
 * - Tablet Portrait: (768px - 1024px)
 * - Mobile: (< 768px)
 */
export function Calculadora({ className }: CalculadoraProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <CalculadoraDesktop />}
      {breakpoint === "tablet" && <CalculadoraTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <CalculadoraTablet />}
      {breakpoint === "mobile" && <CalculadoraMobile />}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de la Calculadora por implementar
        </div>
      )}
    </div>
  );
}

