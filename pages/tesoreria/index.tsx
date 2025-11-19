"use client";

/**
 * Páginas del módulo Tesorería
 * 
 * Este módulo contiene las vistas de gestión de tesorería
 * (Por implementar)
 */

export interface TesoreriaProps {
  className?: string;
}

export function Tesoreria({ className }: TesoreriaProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Tesorería
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

