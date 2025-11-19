"use client";

/**
 * Páginas del módulo Facturación
 * 
 * Este módulo contiene las vistas de gestión de facturación
 * (Por implementar)
 */

export interface FacturacionProps {
  className?: string;
}

export function Facturacion({ className }: FacturacionProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Facturación
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

