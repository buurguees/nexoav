"use client";

/**
 * Páginas del módulo Proveedores
 * 
 * Este módulo contiene las vistas de gestión de proveedores
 * (Por implementar)
 */

export interface ProveedoresProps {
  className?: string;
}

export function Proveedores({ className }: ProveedoresProps) {
  return (
    <div className={`page-content-scroll ${className || ''}`} style={{ height: '100%' }}>
      <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-lg)' }}>
        Proveedores
      </h1>
      <p style={{ color: 'var(--foreground-secondary)' }}>
        Esta vista se desarrollará más adelante con contenido específico.
      </p>
    </div>
  );
}

