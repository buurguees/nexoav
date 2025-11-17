"use client";

import * as React from "react";
import { cn } from "../../ui/utils";
import { TaskType, getTaskColor } from "../../../lib/taskCategories";

export interface TaskBarProps {
  /** Título de la tarea */
  title: string;
  /** Color de la franja (opcional, se asigna según type si no se especifica) */
  color?: string;
  /** Posición vertical de la franja (en píxeles desde arriba) */
  top?: number;
  /** Altura de la franja en píxeles */
  height?: number;
  /** Clase CSS adicional */
  className?: string;
  /** Si la tarea está completada */
  completed?: boolean;
  /** Categoría de la tarea (obligatorio para asignar color automático) */
  type?: TaskType;
}

export function TaskBar({
  title,
  color,
  top = 28,
  height = 20,
  className,
  completed = false,
  type,
  ...props
}: TaskBarProps & React.HTMLAttributes<HTMLDivElement>) {
  // Obtener color según la categoría (type) de la tarea
  // Si no hay type ni color, usar un color por defecto
  const barColor = color || (type ? getTaskColor(type) : "var(--accent-blue-primary)");
  const opacity = completed ? 0.6 : 1;

  return (
    <div
      className={cn("task-bar", className)}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: barColor,
        opacity: opacity,
        display: "flex",
        alignItems: "center",
        paddingLeft: "8px",
        paddingRight: "8px",
        cursor: "pointer",
        zIndex: 1,
        transition: "opacity var(--transition-default)",
        ...props.style,
      }}
      title={title}
      {...props}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: "var(--font-weight-medium)",
          color: "#ffffff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {title}
      </span>
    </div>
  );
}

