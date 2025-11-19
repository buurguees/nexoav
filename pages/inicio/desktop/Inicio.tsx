"use client";

import { motion } from "motion/react";
import { InicioLayoutTemplate } from "../components/InicioLayoutTemplate";

export interface InicioResumenProps {
  className?: string;
}

/**
 * Página de Inicio - Resumen (Desktop)
 * Vista de resumen con 6 bloques principales:
 * 
 * Fila Superior:
 * - Calendario
 * - Facturas
 * - Resumen Financiero
 * 
 * Fila Inferior:
 * - Proyectos
 * - Presupuestos
 * - Impuestos
 * 
 * Por ahora usa el template de layout para visualizar la estructura
 * TODO: Reemplazar con implementación real de cada bloque
 */
export function InicioResumen({ className }: InicioResumenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`page-content-scroll ${className || ''}`}
      style={{
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <InicioLayoutTemplate />
    </motion.div>
  );
}
