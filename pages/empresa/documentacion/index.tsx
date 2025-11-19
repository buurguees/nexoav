"use client";

import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { DocumentacionDesktop } from "./desktop";
// import { DocumentacionTabletHorizontal } from "./tablet-horizontal";
// import { DocumentacionTablet } from "./tablet";
// import { DocumentacionMobile } from "./mobile";

export interface DocumentacionProps {
  className?: string;
}

/**
 * Página de Documentación
 * Documentos y archivos de la empresa
 */
export function Documentacion({ className }: DocumentacionProps) {
  const breakpoint = useBreakpoint();

  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      {breakpoint === "desktop" && <DocumentacionDesktop />}
      {breakpoint !== "desktop" && (
        <div style={{ padding: "var(--spacing-xl)", color: "var(--foreground-secondary)" }}>
          Versión {breakpoint} de Documentación por implementar
        </div>
      )}
    </div>
  );
}

