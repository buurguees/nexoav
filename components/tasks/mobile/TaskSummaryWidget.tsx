"use client";

import * as React from "react";
import { format, isSameDay, isToday, addDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../ui/utils";
import { Task } from "../../../lib/types/task";
import { getTaskCategory } from "../../../lib/taskCategories";

export interface TaskSummaryWidgetProps {
  /** Tareas ya filtradas por el módulo que lo usa */
  tasks: Task[];
  /** Fecha de referencia para priorizar tareas (por defecto: hoy) */
  referenceDate?: Date;
  /** Número máximo de tareas a mostrar (por defecto: 6) */
  maxTasks?: number;
  /** Acción al hacer clic en una tarea */
  onTaskClick?: (task: Task) => void;
  /** Estilos adicionales */
  className?: string;
}

/**
 * Widget compacto que muestra un resumen de las tareas más relevantes del periodo visible - Versión Mobile
 * 
 * Versión optimizada para móviles:
 * - Listado de una sola columna
 * - Máximo 6 tareas
 * - Título con ellipsis si se pasa del bloque
 * - Sin fechas ni horarios
 * - Contorno de color según categoría
 * - Responsive, sin salirse de los bordes
 */
export function TaskSummaryWidget({
  tasks,
  referenceDate,
  maxTasks = 6,
  onTaskClick,
  className,
}: TaskSummaryWidgetProps) {
  const today = React.useMemo(() => startOfDay(referenceDate || new Date()), [referenceDate]);
  const nextTwoWeeks = React.useMemo(() => endOfDay(addDays(today, 14)), [today]);

  // Filtrar y priorizar tareas: hoy y próximos días (expandido para encontrar más tareas)
  const relevantTasks = React.useMemo(() => {
    return tasks
      .filter((task) => {
        const taskStart = startOfDay(task.startDate);
        const taskEnd = endOfDay(task.endDate);
        
        // Incluir si la tarea está activa en el periodo visible (expandido a 2 semanas)
        return (
          isWithinInterval(today, { start: taskStart, end: taskEnd }) ||
          (taskStart >= today && taskStart <= nextTwoWeeks) ||
          (taskEnd >= today && taskEnd <= nextTwoWeeks)
        );
      })
      .sort((a, b) => {
        // Priorizar: hoy > próximos días > resto
        const aIsToday = isSameDay(a.startDate, today);
        const bIsToday = isSameDay(b.startDate, today);
        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;
        
        // Luego por fecha de inicio
        return a.startDate.getTime() - b.startDate.getTime();
      })
      .slice(0, maxTasks);
  }, [tasks, today, nextTwoWeeks, maxTasks]);

  const handleTaskClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  if (relevantTasks.length === 0) {
    return (
      <div 
        className={cn("task-summary-widget-empty-mobile", className)}
        style={{
          backgroundColor: "var(--background-secondary)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "var(--spacing-md)",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box", // MOBILE: asegurar que el padding no cause overflow
          fontFamily: "inherit",
        }}
      >
        <div style={{
          padding: "var(--spacing-sm)",
          textAlign: "center",
          color: "var(--foreground-secondary)",
          fontSize: "13px",
        }}>
          <p>No hay tareas programadas próximamente</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("task-summary-widget-mobile", className)}
      style={{
        backgroundColor: "var(--background-secondary)",
        border: "1px solid var(--border-medium)",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box", // MOBILE: asegurar que el padding no cause overflow
        fontFamily: "inherit", // Heredar la fuente SUSE del body
      }}
    >
      <div style={{
        marginBottom: "var(--spacing-sm)",
        paddingBottom: "var(--spacing-xs)",
        borderBottom: "1px solid var(--border-medium)"
      }}>
        <h3 style={{
          marginBottom: "var(--spacing-xs)",
          fontSize: "16px",
        }}>
          Próximas tareas
        </h3>
        <p style={{
          fontSize: "11px",
          margin: 0,
        }}>
          {relevantTasks.length} {relevantTasks.length === 1 ? "tarea" : "tareas"} próximas
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-xs)", // MOBILE: gap reducido
      }}>
        {relevantTasks.map((task) => {
          const category = getTaskCategory(task.type);
          const isTaskToday = isToday(task.startDate);
          const isTaskEndToday = isToday(task.endDate);
          const isSingleDay = isSameDay(task.startDate, task.endDate);

          // Formato de fecha compacto
          let dateLabel: string;
          if (isTaskToday && isSingleDay) {
            dateLabel = "Hoy";
          } else if (isTaskToday) {
            dateLabel = `Hoy - ${format(task.endDate, "d MMM", { locale: es })}`;
          } else if (isTaskEndToday) {
            dateLabel = `${format(task.startDate, "d MMM", { locale: es })} - Hoy`;
          } else if (isSingleDay) {
            dateLabel = format(task.startDate, "d MMM", { locale: es });
          } else {
            dateLabel = `${format(task.startDate, "d MMM", { locale: es })} - ${format(task.endDate, "d MMM", { locale: es })}`;
          }

          return (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              style={{
                display: "flex",
                flexDirection: "row", // MOBILE: fila para título y fechas lado a lado
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--spacing-xs)", // MOBILE: gap entre título y fechas
                padding: "var(--spacing-xs)", // MOBILE: padding muy reducido
                borderRadius: "var(--radius-sm)",
                backgroundColor: isTaskToday ? "var(--background-tertiary)" : "var(--background)",
                border: `2px solid ${category.color}`, // MOBILE: borde de color para categoría (igual que tablet)
                cursor: onTaskClick ? "pointer" : "default",
                transition: "all var(--transition-default)",
                opacity: task.status === "completed" || task.completed ? 0.6 : 1,
                width: "100%",
                boxSizing: "border-box", // MOBILE: asegurar que el padding no cause overflow
                minWidth: 0, // MOBILE: permitir que el contenido se ajuste
              }}
              onMouseEnter={(e) => {
                if (onTaskClick) {
                  e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                  e.currentTarget.style.borderColor = category.color + "CC"; // Más opaco al hover
                }
              }}
              onMouseLeave={(e) => {
                if (onTaskClick) {
                  e.currentTarget.style.backgroundColor = isTaskToday ? "var(--background-tertiary)" : "var(--background)";
                  e.currentTarget.style.borderColor = category.color; // Volver al color original
                }
              }}
            >
              {/* Población (ubicación) - ocupa aproximadamente la mitad */}
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis", // MOBILE: tres puntitos suspensivos si se corta
                whiteSpace: "nowrap", // MOBILE: una sola línea
                fontSize: "13px", // MOBILE: fuente ajustada
                fontWeight: "var(--font-weight-medium)",
                flex: "1 1 50%", // MOBILE: ocupar aproximadamente la mitad del espacio
                minWidth: 0, // MOBILE: permitir que se trunque
                maxWidth: "50%", // MOBILE: máximo la mitad para que las fechas tengan espacio
                boxSizing: "border-box",
                color: "var(--foreground)",
              }}>
                {task.city || "Sin ubicación"}
              </span>
              
              {/* Fechas - ocupan la otra mitad */}
              <span style={{
                fontSize: "11px", // MOBILE: fuente pequeña para fechas
                color: "var(--foreground-secondary)",
                flex: "0 0 auto", // MOBILE: no crecer, tamaño fijo
                whiteSpace: "nowrap", // MOBILE: no hacer wrap
                marginLeft: "var(--spacing-xs)", // MOBILE: espacio entre población y fechas
              }}>
                {dateLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

