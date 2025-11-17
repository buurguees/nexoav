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
 * una categoría de tarea en el calendario - Versión Mobile
 * 
 * Versión optimizada para móviles con tamaños y espaciados reducidos.
 * Funciona igual que la versión desktop pero con tamaños adaptados para pantallas pequeñas.
 */
export function TaskCategoryDot({
  type,
  className,
  size = 4, // MOBILE: tamaño por defecto más pequeño (desktop usa 6px, tablet usa 5px)
}: TaskCategoryDotProps) {
  const color = getTaskColor(type);

  return (
    <div
      className={cn("task-category-dot-mobile", className)}
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

