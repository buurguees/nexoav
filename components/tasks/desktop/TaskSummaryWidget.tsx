"use client";

import * as React from "react";
import { format, isSameDay, isToday, addDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../ui/utils";
import { Task } from "../../../lib/types/task";
import { getTaskCategory } from "../../../lib/taskCategories";
import { getTaskStatusConfig } from "../../../lib/taskStatus";

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
 * Widget compacto que muestra un resumen de las tareas más relevantes del periodo visible.
 * 
 * Funciona como complemento directo de Calendar3Months.
 * Muestra sólo un subconjunto de tareas:
 * - Prioriza tareas de hoy y de los próximos días
 * - Permite ver de un vistazo qué viene a corto plazo
 * - Presentación muy condensada con información mínima
 * 
 * Componente reutilizable para cualquier módulo (Inicio, Facturación, Comercial, etc.)
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
        className={cn("task-summary-widget-empty", className)}
        style={{
          backgroundColor: "var(--background-secondary)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "var(--spacing-lg)",
          width: "100%",
          maxWidth: "500px", // DESKTOP: mismo max-width que Calendar3Months (reducido)
          boxSizing: "border-box", // DESKTOP: asegurar que el padding no cause overflow
        }}
      >
        <div style={{
          padding: "var(--spacing-md)",
          textAlign: "center",
          color: "var(--foreground-secondary)",
          fontSize: "14px",
        }}>
          <p>No hay tareas programadas próximamente</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("task-summary-widget", className)}
      style={{
        backgroundColor: "var(--background-secondary)",
        border: "1px solid var(--border-medium)",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-lg)",
        width: "100%",
        maxWidth: "1000px", // DESKTOP: mismo max-width que Calendar3Months
        boxSizing: "border-box", // DESKTOP: asegurar que el padding no cause overflow
        fontFamily: "inherit", // Heredar la fuente SUSE del body
      }}
    >
      <div style={{
        marginBottom: "var(--spacing-md)",
        paddingBottom: "var(--spacing-sm)",
        borderBottom: "1px solid var(--border-medium)"
      }}>
        <h3 style={{
          marginBottom: "var(--spacing-xs)"
        }}>
          Próximas tareas
        </h3>
        <p style={{
          fontSize: "12px",
          margin: 0,
        }}>
          {relevantTasks.length} {relevantTasks.length === 1 ? "tarea" : "tareas"} próximas
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // DESKTOP: 2 columnas con máximo 3 tareas por columna (6 total)
        gap: "var(--spacing-sm)",
        width: "100%",
        boxSizing: "border-box",
      }}>
        {relevantTasks.map((task) => {
          const category = getTaskCategory(task.type);
          const statusConfig = getTaskStatusConfig(task.status);
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
                alignItems: "center",
                gap: "var(--spacing-sm)",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: isTaskToday ? "var(--background-tertiary)" : "var(--background)",
                border: `1px solid ${isTaskToday ? category.color + "40" : "var(--border-medium)"}`,
                cursor: onTaskClick ? "pointer" : "default",
                transition: "all var(--transition-default)",
                opacity: task.status === "completed" || task.completed ? 0.6 : 1,
                height: "100%",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                minWidth: 0, // Permitir que el contenido se ajuste
                overflow: "hidden", // Evitar desbordamiento
              }}
              onMouseEnter={(e) => {
                if (onTaskClick) {
                  e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                  e.currentTarget.style.borderColor = category.color + "60";
                }
              }}
              onMouseLeave={(e) => {
                if (onTaskClick) {
                  e.currentTarget.style.backgroundColor = isTaskToday ? "var(--background-tertiary)" : "var(--background-secondary)";
                  e.currentTarget.style.borderColor = isTaskToday ? category.color + "40" : "var(--border-medium)";
                }
              }}
            >
              {/* Indicador de color de categoría */}
              <div
                style={{
                  width: "4px",
                  height: "100%",
                  minHeight: "32px",
                  backgroundColor: category.color,
                  borderRadius: "2px",
                  flexShrink: 0,
                }}
              />

              {/* Contenido de la tarea */}
              <div style={{
                flex: 1,
                minWidth: 0, // Permite que el texto se trunque
                display: "flex",
                flexDirection: "column",
                gap: "2px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                  flexWrap: "wrap"
                }}>
                  <h4 style={{
                    textDecoration: task.status === "completed" || task.completed ? "line-through" : "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0,
                    margin: 0,
                  }}>
                    {task.title}
                  </h4>
                  {task.completed && (
                    <span style={{
                      fontSize: "10px",
                      color: "var(--foreground-secondary)",
                      fontStyle: "italic"
                    }}>
                      ✓
                    </span>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "var(--spacing-xs)",
                  flexWrap: "wrap"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                    flexWrap: "wrap"
                  }}>
                    {/* Población (ubicación) */}
                    <span style={{
                      fontSize: "11px",
                      color: "var(--foreground-secondary)",
                    }}>
                      {task.city || "Sin ubicación"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: category.color,
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      {category.label}
                    </span>
                  </div>
                  {/* Estado y fechas en la parte inferior derecha */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                    marginLeft: "auto",
                  }}>
                    {/* Indicador de estado */}
                    <span style={{
                      fontSize: "10px",
                      color: statusConfig.color,
                    }}>
                      {statusConfig.icon}
                    </span>
                    {/* Fechas */}
                    <span style={{
                      fontSize: "11px",
                      fontWeight: "var(--font-weight-medium)",
                    }}>
                      {dateLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

