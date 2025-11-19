"use client";

/**
 * Páginas del módulo Inventario
 * 
 * Este módulo contiene las vistas de gestión de inventario
 * (Por implementar)
 */

export interface InventarioProps {
  className?: string;
}

export function Inventario({ className }: InventarioProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Inventario
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

