"use client";

import { cn } from "../../ui/utils";
import { TaskType, getTaskColor } from "../../../lib/taskCategories";

export interface TaskCategoryDotProps {
  type: TaskType;
  className?: string;
  size?: number;
}

/**
 * Componente reutilizable para mostrar un punto de color que representa
 * una categoría de tarea en el calendario - Versión Tablet Horizontal
 * 
 * Versión optimizada para tablets horizontales con tamaños y espaciados reducidos.
 * Similar a desktop pero con tamaños adaptados para tablet horizontal.
 */
export function TaskCategoryDot({
  type,
  className,
  size = 5, // TABLET HORIZONTAL: tamaño por defecto más pequeño (desktop usa 6px)
}: TaskCategoryDotProps) {
  const color = getTaskColor(type);

  return (
    <div
      className={cn("task-category-dot-tablet-horizontal", className)}
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

