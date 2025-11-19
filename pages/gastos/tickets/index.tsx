"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { TicketsDesktop } from "./desktop";
import { TicketsTabletHorizontal } from "./tablet-horizontal";
import { TicketsTablet } from "./tablet";
import { TicketsMobile } from "./mobile";

export interface TicketsProps {
  className?: string;
}

/**
 * Página de listado de Tickets
 * Muestra todos los Tickets con información relevante para gestión de gastos
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado (60%) + Chart (40%) lado a lado
 * - Tablet Horizontal: Chart pequeño arriba + Listado abajo
 * - Tablet Portrait: Chart pequeño arriba + Listado grande abajo
 * - Mobile: Chart pequeño arriba + Listado abajo
 */
export function Tickets({ className }: TicketsProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <TicketsDesktop />}
      {breakpoint === "tablet" && <TicketsTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <TicketsTablet />}
      {breakpoint === "mobile" && <TicketsMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

