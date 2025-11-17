"use client";

import * as React from "react";
import { format, isSameDay, startOfMonth, endOfMonth, isWithinInterval, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../ui/utils";
import { Task } from "../../../lib/types/task";
import { getTaskCategory, getCategoriesForModule, TaskType } from "../../../lib/taskCategories";
import { getTaskStatusConfig } from "../../../lib/taskStatus";

export interface TaskCalendarListProps {
  /** Tareas ya filtradas por el módulo que lo usa */
  tasks: Task[];
  /** Mes a mostrar (por defecto: mes actual) */
  month?: Date;
  /** Módulo que está usando el componente (para determinar las categorías) */
  module?: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos";
  /** Acción al hacer clic en una tarea */
  onTaskClick?: (task: Task) => void;
  /** Callback al hacer clic en un día */
  onDayClick?: (date: Date) => void;
  /** Callback para crear una nueva tarea */
  onCreateTask?: () => void;
  /** Estilos adicionales */
  className?: string;
}

/**
 * Listado mensual de tareas - Versión Tablet Horizontal
 * 
 * Muestra 2 columnas (2 categorías por fila) para optimizar el espacio horizontal
 */
export function TaskCalendarList({
  tasks,
  month,
  module = "inicio",
  onTaskClick,
  onDayClick,
  onCreateTask,
  className,
}: TaskCalendarListProps) {
  const currentMonth = month || new Date();
  
  // Filtrar tareas que pertenecen al mes especificado
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      return (
        isWithinInterval(task.startDate, { start: monthStart, end: monthEnd }) ||
        isWithinInterval(task.endDate, { start: monthStart, end: monthEnd }) ||
        (task.startDate <= monthStart && task.endDate >= monthEnd)
      );
    });
  }, [tasks, monthStart, monthEnd, currentMonth]);

  // Obtener categorías del módulo
  const moduleCategories = React.useMemo(() => {
    return getCategoriesForModule(module);
  }, [module]);

  // Agrupar tareas por categoría y luego por día
  const tasksByCategory = React.useMemo(() => {
    const grouped: Map<TaskType, Map<string, Task[]>> = new Map();

    // Inicializar mapas para cada categoría
    moduleCategories.forEach((categoryType) => {
      grouped.set(categoryType, new Map());
    });

    const today = startOfDay(new Date());
    
    monthTasks.forEach((task) => {
      const categoryType = task.type;
      if (!grouped.has(categoryType)) return; // Solo incluir categorías del módulo

      const categoryDays = grouped.get(categoryType)!;
      
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
      
      if (!categoryDays.has(dayKey)) {
        categoryDays.set(dayKey, []);
      }
      
      // Solo añadir la tarea una vez (evitar duplicados)
      const dayTasks = categoryDays.get(dayKey)!;
      if (!dayTasks.find((t) => t.id === task.id)) {
        dayTasks.push(task);
      }
    });

    // Ordenar las tareas dentro de cada día de cada categoría
    grouped.forEach((categoryDays) => {
      categoryDays.forEach((dayTasks) => {
        dayTasks.sort((a, b) => {
          // Ordenar por fecha de inicio
          const dateA = a.startDate.getTime();
          const dateB = b.startDate.getTime();
          if (dateA !== dateB) return dateA - dateB;
          
          // Si empiezan el mismo día, ordenar por título
          return a.title.localeCompare(b.title);
        });
      });
    });

    return grouped;
  }, [monthTasks, moduleCategories]);

  // Convertir cada categoría a un array ordenado por fecha
  const sortedCategories = React.useMemo(() => {
    const result: Array<{ category: TaskType; days: Array<[string, Task[]]> }> = [];
    
    moduleCategories.forEach((categoryType) => {
      const categoryDays = tasksByCategory.get(categoryType);
      if (!categoryDays || categoryDays.size === 0) return;

      const sortedDays = Array.from(categoryDays.entries()).sort(([dateA], [dateB]) => {
        return dateA.localeCompare(dateB);
      });

      result.push({
        category: categoryType,
        days: sortedDays,
      });
    });

    return result;
  }, [tasksByCategory, moduleCategories]);

  const handleTaskClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  if (monthTasks.length === 0) {
    return (
      <div className={cn("task-calendar-list-empty-tablet-horizontal", className)}>
        <p style={{ 
          textAlign: "center", 
          color: "var(--foreground-secondary)",
          padding: "var(--spacing-lg)",
          fontSize: "13px"
        }}>
          No hay tareas programadas para {format(currentMonth, "MMMM yyyy", { locale: es })}
        </p>
      </div>
    );
  }

  return (
    <div 
      className={cn("task-calendar-list-tablet-horizontal", className)}
      style={{
        fontFamily: "inherit", // Heredar la fuente SUSE del body
      }}
    >
      <div style={{ 
        marginBottom: "var(--spacing-md)",
        paddingBottom: "var(--spacing-sm)",
        borderBottom: "1px solid var(--border-medium)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>
          {format(currentMonth, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() + format(currentMonth, "MMMM yyyy", { locale: es }).slice(1)}
        </h2>
        {/* Botón Nueva Tarea */}
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            style={{
              padding: "var(--spacing-xs) var(--spacing-sm)",
              backgroundColor: "var(--accent-blue-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            + Nueva tarea
          </button>
        )}
      </div>

      {/* 2 columnas, 2 categorías por fila */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--spacing-sm)",
      }}>
        {sortedCategories.map(({ category: categoryType, days }) => {
          const category = getTaskCategory(categoryType);
          const categoryTaskCount = days.reduce((sum, [, tasks]) => sum + tasks.length, 0);

          return (
            <div 
              key={categoryType}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "var(--background-secondary)",
                border: `1px solid var(--border-medium)`,
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-sm)",
              }}
            >
              {/* Encabezado de la categoría */}
              <div style={{
                marginBottom: "var(--spacing-sm)",
                paddingBottom: "var(--spacing-xs)",
                borderBottom: `2px solid ${category.color}`,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                  marginBottom: "var(--spacing-xs)",
                }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: category.color,
                      flexShrink: 0,
                    }}
                  />
                  <h3 style={{ fontSize: "14px", margin: 0 }}>
                    {category.label}
                  </h3>
                </div>
                <p style={{
                  fontSize: "11px",
                  margin: 0,
                }}>
                  {categoryTaskCount} {categoryTaskCount === 1 ? "tarea" : "tareas"}
                </p>
              </div>

              {/* Lista de tareas agrupadas por día */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "var(--spacing-sm)",
                overflowY: "auto",
                maxHeight: "500px",
              }}>
                {days.length === 0 ? (
                  <p style={{
                    fontSize: "11px",
                    textAlign: "center",
                    padding: "var(--spacing-sm)",
                    margin: 0,
                  }}>
                    No hay tareas de esta categoría
                  </p>
                ) : (
                  days.map(([dayKey, dayTasks]) => {
                    const dayDate = new Date(dayKey);
                    const isToday = isSameDay(dayDate, new Date());

                    return (
                      <div key={dayKey}>
                        {/* Encabezado del día */}
                        <div 
                          style={{
                            marginBottom: "var(--spacing-xs)",
                            paddingBottom: "var(--spacing-xs)",
                            borderBottom: "1px solid var(--border-light)",
                            cursor: onDayClick ? "pointer" : "default",
                          }}
                          onClick={() => onDayClick?.(dayDate)}
                        >
                          <h4 style={{
                            color: isToday ? "var(--accent-blue-primary)" : undefined,
                            margin: 0,
                            fontSize: "12px",
                          }}>
                            {format(dayDate, "d MMM", { locale: es })}
                            {isToday && (
                              <span style={{
                                marginLeft: "var(--spacing-xs)",
                                fontSize: "9px",
                                color: "var(--accent-blue-primary)"
                              }}>
                                (Hoy)
                              </span>
                            )}
                          </h4>
                        </div>

                        {/* Lista de tareas del día */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                          {dayTasks.map((task) => {
                            const statusConfig = getTaskStatusConfig(task.status);
                            const isSingleDay = isSameDay(task.startDate, task.endDate);
                            const dateRange = isSingleDay
                              ? format(task.startDate, "d MMM", { locale: es })
                              : `${format(task.startDate, "d MMM", { locale: es })} - ${format(task.endDate, "d MMM", { locale: es })}`;

                            // Formatear ubicación completa: "Dirección, población, código postal, País"
                            const locationParts: string[] = [];
                            if (task.address) locationParts.push(task.address);
                            if (task.city) locationParts.push(task.city);
                            if (task.postal_code) locationParts.push(task.postal_code);
                            if (task.country) locationParts.push(task.country);
                            const fullLocation = locationParts.length > 0 ? locationParts.join(", ") : null;

                            return (
                              <div
                                key={task.id}
                                onClick={() => handleTaskClick(task)}
                                style={{
                                  padding: "var(--spacing-xs)",
                                  borderRadius: "var(--radius-sm)",
                                  border: `1px solid var(--border-medium)`,
                                  backgroundColor: "var(--background)",
                                  cursor: onTaskClick ? "pointer" : "default",
                                  transition: "all var(--transition-default)",
                                  opacity: task.status === "completed" || task.completed ? 0.7 : 1,
                                }}
                                onMouseEnter={(e) => {
                                  if (onTaskClick) {
                                    e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                                    e.currentTarget.style.borderColor = category.color + "60";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (onTaskClick) {
                                    e.currentTarget.style.backgroundColor = "var(--background)";
                                    e.currentTarget.style.borderColor = "var(--border-medium)";
                                  }
                                }}
                              >
                                {/* Primera línea: Título y fechas */}
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "var(--spacing-xs)",
                                  marginBottom: "2px",
                                }}>
                                  <h5 style={{
                                    textDecoration: task.status === "completed" || task.completed ? "line-through" : "none",
                                    margin: 0,
                                    fontSize: "12px",
                                    flex: "1 1 0",
                                    minWidth: 0,
                                    maxWidth: "70%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}>
                                    {task.title}
                                  </h5>
                                  {/* Fechas a la derecha del título */}
                                  <span style={{
                                    fontSize: "9px",
                                    color: "var(--foreground-secondary)",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                  }}>
                                    {dateRange}
                                  </span>
                                </div>

                                {/* Segunda línea: Ubicación completa y horario */}
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "var(--spacing-xs)",
                                  flexWrap: "wrap",
                                }}>
                                  {/* Ubicación completa a la izquierda */}
                                  {fullLocation ? (
                                    <span style={{
                                      fontSize: "10px",
                                      color: "var(--foreground-secondary)",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      flex: "1 1 auto",
                                      minWidth: 0, // Permite que se corte si se solapa con horarios
                                    }}>
                                      {fullLocation}
                                    </span>
                                  ) : (
                                    <span style={{
                                      fontSize: "10px",
                                      color: "var(--foreground-disabled)",
                                      fontStyle: "italic",
                                    }}>
                                      Sin ubicación
                                    </span>
                                  )}
                                  {/* Estado y horario en la parte derecha */}
                                  <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--spacing-xs)",
                                    marginLeft: "auto",
                                    flexShrink: 0,
                                  }}>
                                    {/* Indicador de estado */}
                                    <span style={{
                                      fontSize: "9px",
                                      color: statusConfig.color,
                                    }}>
                                      {statusConfig.icon}
                                    </span>
                                    {/* Horario */}
                                    {(task.startTime || task.endTime) && (
                                      <span style={{
                                        fontSize: "10px",
                                        fontWeight: "var(--font-weight-medium)",
                                        whiteSpace: "nowrap",
                                      }}>
                                        {task.startTime && task.endTime 
                                          ? `${task.startTime} - ${task.endTime}`
                                          : task.startTime || task.endTime}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

