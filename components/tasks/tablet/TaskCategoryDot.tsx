"use client";

import * as React from "react";
import { cn } from "../../ui/utils";
import { TaskType, getTaskColor } from "../../../lib/taskCategories";

export interface TaskCategoryDotProps {
  type: TaskType;
  className?: string;
  size?: number;
}

/**
 * Componente reutilizable para mostrar un punto de color que representa
 * una categoría de tarea en el calendario - Versión Tablet
 * 
 * Versión optimizada para tablets con tamaños y espaciados reducidos.
 * Funciona igual que la versión desktop pero con tamaños adaptados.
 */
export function TaskCategoryDot({
  type,
  className,
  size = 5, // TABLET: tamaño por defecto más pequeño (desktop usa 6px)
}: TaskCategoryDotProps) {
  const color = getTaskColor(type);

  return (
    <div
      className={cn("task-category-dot-tablet", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: "50%",
        backgroundColor: color,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
      }}
      title={type}
      aria-label={`Categoría: ${type}`}
    />
  );
}

