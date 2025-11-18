"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { ClientList as ClientListDesktop } from "./desktop";
import { ClientList as ClientListTablet } from "./tablet";
import { ClientList as ClientListTabletHorizontal } from "./tablet-horizontal";
import { ClientList as ClientListMobile } from "./mobile";
import type { ClientListProps } from "./desktop";

/**
 * Componente ClientList que renderiza automáticamente
 * la versión correcta según el dispositivo detectado
 */
export function ClientList(props: ClientListProps) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  if (breakpoint === 'mobile') {
    return <ClientListMobile {...props} />;
  }
  
  // Tablet horizontal
  if (breakpoint === 'tablet') {
    return <ClientListTabletHorizontal {...props} />;
  }

  // Tablet portrait
  if (breakpoint === 'tablet-portrait') {
    return <ClientListTablet {...props} />;
  }

  // Desktop (por defecto)
  return <ClientListDesktop {...props} />;
}

export type { ClientListProps } from "./desktop";

