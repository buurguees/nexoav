"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { PedidosDesktop } from "./desktop";
import { PedidosTabletHorizontal } from "./tablet-horizontal";
import { PedidosTablet } from "./tablet";
import { PedidosMobile } from "./mobile";

export interface PedidosProps {
  className?: string;
}

/**
 * Página de listado de Pedidos de Compra
 * Muestra todos los Pedidos de Compra con información relevante para control de costes
 * 
 * Selecciona automáticamente la versión correcta según el dispositivo:
 * - Desktop: Listado completo
 * - Tablet Horizontal: Listado adaptado
 * - Tablet Portrait: Listado adaptado
 * - Mobile: Listado adaptado
 */
export function Pedidos({ className }: PedidosProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <PedidosDesktop />}
      {breakpoint === "tablet" && <PedidosTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <PedidosTablet />}
      {breakpoint === "mobile" && <PedidosMobile />}
      {/* Fallback si no coincide ningún breakpoint */}
      {breakpoint !== "desktop" && breakpoint !== "tablet" && breakpoint !== "tablet-portrait" && breakpoint !== "mobile" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Breakpoint no reconocido: {breakpoint}
        </div>
      )}
    </div>
  );
}

