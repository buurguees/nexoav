"use client";

/**
 * Páginas del módulo Gastos
 * 
 * Este módulo contiene las vistas de gestión de gastos
 * (Por implementar)
 */

export interface GastosProps {
  className?: string;
}

export function Gastos({ className }: GastosProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Gastos
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

