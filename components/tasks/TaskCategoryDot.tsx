"use client";

import * as React from "react";
import { cn } from "../ui/utils";
import { TaskType, getTaskColor } from "../../lib/taskCategories";

export interface TaskCategoryDotProps {
  type: TaskType;
  className?: string;
  size?: number;
}

/**
 * Componente reutilizable para mostrar un punto de color que representa
 * una categoría de tarea en el calendario.
 * 
 * Se usa en Calendar3Months para mostrar indicadores visuales de las
 * categorías de tareas asignadas a cada día.
 */
export function TaskCategoryDot({
  type,
  className,
  size = 6,
}: TaskCategoryDotProps) {
  const color = getTaskColor(type);

  return (
    <div
      className={cn("task-category-dot", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: color,
        flexShrink: 0,
      }}
      title={type}
      aria-label={`Categoría: ${type}`}
    />
  );
}

