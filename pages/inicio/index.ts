"use client";

import { InicioResumen } from "./desktop";

export interface InicioResumenProps {
  className?: string;
}

/**
 * Páginas del módulo Inicio
 * 
 * Este módulo contiene las vistas principales del módulo "Inicio":
 * - InicioResumen: Vista de resumen con 6 bloques principales (Calendario, Proyectos, Facturas, Presupuestos, Proveedores, Impuestos)
 */

// Re-exportar componentes desktop (por ahora, luego se añadirán mobile/tablet)
export { InicioResumen };
