"use client";

import * as React from "react";
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../ui/utils";
import { Task } from "../../../lib/types/task";
import { getTaskCategory } from "../../../lib/taskCategories";

export interface MonthlyTaskListProps {
  /** Mes que se está visualizando (ej: 2025-11-01) */
  month: Date;
  /** Tareas ya filtradas por el módulo que lo usa */
  tasks: Task[];
  /** Acción al hacer clic en una tarea */
  onTaskClick?: (task: Task) => void;
  /** Mostrar "origen" (Proyectos, Facturación, etc.) */
  showModuleTag?: boolean;
  /** Mostrar filtros locales por categoría (opcional) */
  showCategoryFilter?: boolean;
  /** Estilos adicionales */
  className?: string;
}

/**
 * Componente reutilizable que muestra en formato lista todas las tareas de un mes determinado.
 * 
 * No decide qué categorías se muestran (eso lo hace cada módulo), simplemente:
 * - Recibe un conjunto de Task ya filtradas
 * - Las ordena y agrupa por día
 * - Muestra un listado limpio y consistente, con etiquetas de categoría, estado y módulo
 * 
 * Está pensado como complemento a los calendarios (Calendar3Months, Calendar18):
 * 📆 Calendario para ver "cuándo"
 * 📋 MonthlyTaskList para ver "qué" y "en qué orden"
 */
export function MonthlyTaskList({
  month,
  tasks,
  onTaskClick,
  showModuleTag = false,
  showCategoryFilter = false,
  className,
}: MonthlyTaskListProps) {
  // Filtrar tareas que pertenecen al mes especificado
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const monthTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      return (
        isWithinInterval(task.startDate, { start: monthStart, end: monthEnd }) ||
        isWithinInterval(task.endDate, { start: monthStart, end: monthEnd }) ||
        (task.startDate <= monthStart && task.endDate >= monthEnd)
      );
    });
  }, [tasks, monthStart, monthEnd]);

  // Agrupar tareas por día
  const tasksByDay = React.useMemo(() => {
    const grouped: Map<string, Task[]> = new Map();

    const today = startOfDay(new Date());
    
    monthTasks.forEach((task) => {
      // Mostrar tareas solo en el día de inicio (o en el día de hoy si el inicio es anterior)
      const taskStart = startOfDay(task.startDate);
      let displayDate: Date;
      
      if (taskStart < today) {
        // Si el inicio es anterior a hoy, mostrar en el día de hoy
        displayDate = today;
      } else {
        // Mostrar en el día de inicio
        displayDate = taskStart;
      }
      
      const dayKey = format(displayDate, "yyyy-MM-dd");
      
      if (!grouped.has(dayKey)) {
        grouped.set(dayKey, []);
      }
      
      // Solo añadir la tarea una vez (evitar duplicados)
      const dayTasks = grouped.get(dayKey)!;
      if (!dayTasks.find((t) => t.id === task.id)) {
        dayTasks.push(task);
      }
    });

    // Ordenar las tareas dentro de cada día
    grouped.forEach((dayTasks) => {
      dayTasks.sort((a, b) => {
        // Ordenar por fecha de inicio
        const dateA = a.startDate.getTime();
        const dateB = b.startDate.getTime();
        if (dateA !== dateB) return dateA - dateB;
        
        // Si empiezan el mismo día, ordenar por título
        return a.title.localeCompare(b.title);
      });
    });

    return grouped;
  }, [monthTasks]);

  // Convertir el Map a un array ordenado por fecha
  const sortedDays = React.useMemo(() => {
    return Array.from(tasksByDay.entries()).sort(([dateA], [dateB]) => {
      return dateA.localeCompare(dateB);
    });
  }, [tasksByDay]);

  const handleTaskClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  if (monthTasks.length === 0) {
    return (
      <div className={cn("monthly-task-list-empty", className)}>
        <p style={{ 
          textAlign: "center", 
          color: "var(--foreground-secondary)",
          padding: "var(--spacing-xl)",
          fontSize: "14px"
        }}>
          No hay tareas programadas para {format(month, "MMMM yyyy", { locale: es })}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("monthly-task-list", className)}>
      <div style={{ 
        marginBottom: "var(--spacing-lg)",
        paddingBottom: "var(--spacing-md)",
        borderBottom: "1px solid var(--border-medium)"
      }}>
        <h2 style={{ 
          fontSize: "18px", 
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--foreground)"
        }}>
          {format(month, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() + format(month, "MMMM yyyy", { locale: es }).slice(1)}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
        {sortedDays.map(([dayKey, dayTasks]) => {
          const dayDate = new Date(dayKey);
          const isToday = isSameDay(dayDate, new Date());

          return (
            <div key={dayKey} className="monthly-task-list-day">
              {/* Encabezado del día */}
              <div style={{
                marginBottom: "var(--spacing-md)",
                paddingBottom: "var(--spacing-sm)",
                borderBottom: "1px solid var(--border-light)"
              }}>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "var(--font-weight-semibold)",
                  color: isToday ? "var(--accent-blue-primary)" : "var(--foreground)"
                }}>
                  {format(dayDate, "EEEE, d 'de' MMMM", { locale: es }).charAt(0).toUpperCase() + format(dayDate, "EEEE, d 'de' MMMM", { locale: es }).slice(1)}
                  {isToday && (
                    <span style={{
                      marginLeft: "var(--spacing-sm)",
                      fontSize: "12px",
                      color: "var(--accent-blue-primary)"
                    }}>
                      (Hoy)
                    </span>
                  )}
                </h3>
              </div>

              {/* Lista de tareas del día */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                {dayTasks.map((task) => {
                  const category = getTaskCategory(task.type);
                  const isSingleDay = isSameDay(task.startDate, task.endDate);
                  const dateRange = isSingleDay
                    ? format(task.startDate, "d MMM", { locale: es })
                    : `${format(task.startDate, "d MMM", { locale: es })} - ${format(task.endDate, "d MMM", { locale: es })}`;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      style={{
                        padding: "var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid var(--border-medium)`,
                        backgroundColor: "var(--background-secondary)",
                        cursor: onTaskClick ? "pointer" : "default",
                        transition: "all var(--transition-default)",
                        opacity: task.completed ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (onTaskClick) {
                          e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                          e.currentTarget.style.borderColor = "var(--border-strong)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (onTaskClick) {
                          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                          e.currentTarget.style.borderColor = "var(--border-medium)";
                        }
                      }}
                    >
                      {/* Título de la tarea */}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "flex-start", 
                        justifyContent: "space-between",
                        gap: "var(--spacing-md)",
                        marginBottom: "var(--spacing-sm)"
                      }}>
                        <h4 style={{
                          fontSize: "15px",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          flex: 1,
                          textDecoration: task.completed ? "line-through" : "none",
                        }}>
                          {task.title}
                        </h4>
                        {task.completed && (
                          <span style={{
                            fontSize: "12px",
                            color: "var(--foreground-secondary)",
                            fontStyle: "italic"
                          }}>
                            Completada
                          </span>
                        )}
                      </div>

                      {/* Badges y metadatos */}
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--spacing-xs)",
                        alignItems: "center",
                        marginTop: "var(--spacing-xs)"
                      }}>
                        {/* Badge de categoría */}
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: category.color + "20", // 20% de opacidad
                            color: category.color,
                            fontSize: "12px",
                            fontWeight: "var(--font-weight-medium)",
                            border: `1px solid ${category.color}40`, // 40% de opacidad
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: category.color,
                              flexShrink: 0,
                            }}
                          />
                          {category.label}
                        </span>

                        {/* Rango de fechas */}
                        <span style={{
                          fontSize: "12px",
                          color: "var(--foreground-secondary)",
                          padding: "4px 8px",
                        }}>
                          {dateRange}
                        </span>

                        {/* Tag de módulo (opcional) */}
                        {showModuleTag && category.module && (
                          <span style={{
                            fontSize: "12px",
                            color: "var(--foreground-secondary)",
                            padding: "4px 8px",
                            backgroundColor: "var(--background-tertiary)",
                            borderRadius: "var(--radius-sm)",
                            textTransform: "capitalize",
                          }}>
                            {category.module === "inicio" ? "Inicio" :
                             category.module === "facturacion" ? "Facturación" :
                             category.module === "comercial" ? "Comercial" :
                             category.module === "rrhh" ? "RRHH" :
                             category.module === "proyectos" ? "Proyectos" : category.module}
                          </span>
                        )}
                      </div>

                      {/* Información adicional (si existe) */}
                      {(task.jobId || task.companyId || task.assignmentId) && (
                        <div style={{
                          marginTop: "var(--spacing-xs)",
                          fontSize: "11px",
                          color: "var(--foreground-tertiary)",
                          display: "flex",
                          gap: "var(--spacing-sm)",
                          flexWrap: "wrap"
                        }}>
                          {task.jobId && (
                            <span>Proyecto: {task.jobId}</span>
                          )}
                          {task.companyId && (
                            <span>Cliente: {task.companyId}</span>
                          )}
                          {task.assignmentId && (
                            <span>Asignación: {task.assignmentId}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

