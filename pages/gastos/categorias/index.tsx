"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { CategoriasDesktop } from "./desktop";
import { CategoriasTabletHorizontal } from "./tablet-horizontal";
import { CategoriasTablet } from "./tablet";
import { CategoriasMobile } from "./mobile";

export interface CategoriasProps {
  className?: string;
}

/**
 * Página de listado de Categorías
 * Muestra todas las Categorías de gastos con información relevante
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Categorias({ className }: CategoriasProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <CategoriasDesktop />}
      {breakpoint === "tablet" && <CategoriasTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <CategoriasTablet />}
      {breakpoint === "mobile" && <CategoriasMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

