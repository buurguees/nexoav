"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ClientesDesktop } from "./desktop";
import { ClientesTabletHorizontal } from "./tablet-horizontal";
import { ClientesTablet } from "./tablet";
import { ClientesMobile } from "./mobile";

export interface ClientesProps {
  className?: string;
}

/**
 * Página de listado de clientes
 * Muestra todos los clientes con información relevante para gestión de proyectos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Clientes({ className }: ClientesProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <ClientesDesktop />}
      {breakpoint === "tablet" && <ClientesTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ClientesTablet />}
      {breakpoint === "mobile" && <ClientesMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

