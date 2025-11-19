"use client";

/**
 * Páginas del módulo Impuestos
 * 
 * Este módulo contiene las vistas de gestión de impuestos
 * (Por implementar)
 */

export interface ImpuestosProps {
  className?: string;
}

export function Impuestos({ className }: ImpuestosProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Impuestos
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

