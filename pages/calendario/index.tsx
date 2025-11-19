"use client";

/**
 * Páginas del módulo Calendario
 * 
 * Este módulo contiene las vistas del calendario general
 * (Por implementar)
 */

export interface CalendarioProps {
  className?: string;
}

export function Calendario({ className }: CalendarioProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Calendario
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

