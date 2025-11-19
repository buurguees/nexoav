"use client";

/**
 * Páginas del módulo Contabilidad
 * 
 * Este módulo contiene las vistas de gestión contable
 * (Por implementar)
 */

export interface ContabilidadProps {
  className?: string;
}

export function Contabilidad({ className }: ContabilidadProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Contabilidad
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

