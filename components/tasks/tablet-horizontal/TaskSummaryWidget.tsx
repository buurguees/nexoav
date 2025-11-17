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
  /** Número máximo de tareas a mostrar (por defecto: 6 en tablet horizontal - 2 columnas x 3 tareas) */
  maxTasks?: number;
  /** Acción al hacer clic en una tarea */
  onTaskClick?: (task: Task) => void;
  /** Estilos adicionales */
  className?: string;
}

/**
 * Widget compacto que muestra un resumen de las tareas más relevantes del periodo visible - Versión Tablet Horizontal
 * 
 * Versión igual a tablet portrait con tamaños y espaciados reducidos.
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
  maxTasks = 6, // TABLET HORIZONTAL: mostrar 6 tareas (2 columnas x 3 tareas)
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
        className={cn("task-summary-widget-empty-tablet-horizontal", className)}
        style={{
          backgroundColor: "var(--background-secondary)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-md)",
          padding: "var(--spacing-md)", // TABLET HORIZONTAL: padding reducido
          width: "100%",
          maxWidth: "500px", // TABLET HORIZONTAL: mismo max-width que Calendar3Months (reducido)
          fontFamily: "inherit",
        }}
      >
        <div style={{
          padding: "var(--spacing-sm)", // TABLET HORIZONTAL: padding reducido
          textAlign: "center",
          color: "var(--foreground-secondary)",
          fontSize: "13px", // TABLET HORIZONTAL: fuente ligeramente más pequeña
        }}>
          <p>No hay tareas programadas próximamente</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("task-summary-widget-tablet-horizontal", className)}
      style={{
        backgroundColor: "var(--background-secondary)",
        border: "1px solid var(--border-medium)",
        borderRadius: "var(--radius-md)",
        padding: "var(--spacing-md)", // TABLET HORIZONTAL: padding reducido (de lg a md)
        width: "100%",
        maxWidth: "500px", // TABLET HORIZONTAL: mismo max-width que Calendar3Months (reducido)
        fontFamily: "inherit", // Heredar la fuente SUSE del body
      }}
    >
      <div style={{
        marginBottom: "var(--spacing-sm)", // TABLET HORIZONTAL: margin reducido
        paddingBottom: "var(--spacing-xs)", // TABLET HORIZONTAL: padding reducido
        borderBottom: "1px solid var(--border-medium)"
      }}>
        <h3 style={{
          marginBottom: "var(--spacing-xs)",
          fontSize: "16px", // TABLET HORIZONTAL: fuente ligeramente más pequeña
        }}>
          Próximas tareas
        </h3>
        <p style={{
          fontSize: "11px", // TABLET HORIZONTAL: fuente más pequeña
          margin: 0,
        }}>
          {relevantTasks.length} {relevantTasks.length === 1 ? "tarea" : "tareas"} próximas
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)", // TABLET HORIZONTAL: 2 columnas con máximo 3 tareas por columna (6 total)
        gap: "var(--spacing-xs)", // TABLET HORIZONTAL: gap reducido
        width: "100%",
        boxSizing: "border-box",
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
                flexDirection: "row", // TABLET HORIZONTAL: fila para título/población y fechas lado a lado
                alignItems: "flex-end", // TABLET HORIZONTAL: alinear al final (fechas con población)
                justifyContent: "space-between",
                gap: "var(--spacing-xs)", // TABLET HORIZONTAL: gap entre contenido y fechas
                padding: "var(--spacing-xs)", // TABLET HORIZONTAL: padding muy reducido
                borderRadius: "var(--radius-sm)",
                backgroundColor: isTaskToday ? "var(--background-tertiary)" : "var(--background)",
                border: `2px solid ${category.color}`, // TABLET HORIZONTAL: borde de color para categoría
                cursor: onTaskClick ? "pointer" : "default",
                transition: "all var(--transition-default)",
                opacity: task.status === "completed" || task.completed ? 0.6 : 1,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
                minWidth: 0, // Permitir que el contenido se ajuste
                overflow: "hidden", // Evitar desbordamiento
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
              {/* Contenedor izquierdo: Título y población */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 auto", // TABLET HORIZONTAL: ocupar el espacio disponible, puede crecer
                minWidth: 0, // TABLET HORIZONTAL: permitir que se trunque
                maxWidth: "calc(100% - 70px)", // TABLET HORIZONTAL: dejar espacio mínimo para las fechas (70px)
                gap: "2px", // TABLET HORIZONTAL: pequeño espacio entre título y población
                overflow: "hidden", // Evitar desbordamiento
              }}>
                {/* Título de la tarea */}
                <h4 style={{
                  textDecoration: task.status === "completed" || task.completed ? "line-through" : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis", // TABLET HORIZONTAL: tres puntitos suspensivos si se corta (responsive)
                  whiteSpace: "nowrap", // TABLET HORIZONTAL: una sola línea
                  margin: 0,
                  fontSize: "12px", // TABLET HORIZONTAL: fuente ajustada
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--foreground)",
                  width: "100%", // TABLET HORIZONTAL: ocupar todo el ancho disponible del contenedor
                  maxWidth: "100%", // TABLET HORIZONTAL: no exceder el ancho del contenedor
                  boxSizing: "border-box",
                }}>
                  {task.title}
                </h4>
                
                {/* Población (ubicación) */}
                <span style={{
                  fontSize: "10px", // TABLET HORIZONTAL: fuente más pequeña para población
                  color: "var(--foreground-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {task.city || "Sin ubicación"}
                </span>
              </div>
              
              {/* Fechas - ocupan la parte derecha */}
              <span style={{
                fontSize: "10px", // TABLET HORIZONTAL: fuente más pequeña
                color: "var(--foreground-secondary)",
                flex: "0 0 auto", // TABLET HORIZONTAL: no crecer, tamaño fijo
                whiteSpace: "nowrap", // TABLET HORIZONTAL: no hacer wrap
                marginLeft: "var(--spacing-xs)", // TABLET HORIZONTAL: espacio entre contenido izquierdo y fechas
                minWidth: "60px", // TABLET HORIZONTAL: ancho mínimo para fechas
                maxWidth: "70px", // TABLET HORIZONTAL: máximo ancho para fechas (ajustado para dar más espacio al título)
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "right", // TABLET HORIZONTAL: alinear fechas a la derecha
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

