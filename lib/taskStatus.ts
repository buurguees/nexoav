/**
 * Sistema de Estados de Tareas
 * 
 * Define los estados disponibles para las tareas y su configuración visual.
 * Basado en la documentación de componentes-tareas.md
 */

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface TaskStatusConfig {
  label: string;
  color: string;
  icon: string;
}

export const TASK_STATUS_CONFIG: Record<TaskStatus, TaskStatusConfig> = {
  pending: {
    label: "Pendiente",
    color: "#6b7280", // Gris
    icon: "", // Sin icono o indicador neutro
  },
  in_progress: {
    label: "En proceso",
    color: "#f97316", // Naranja
    icon: "⏱️", // Reloj
  },
  completed: {
    label: "Completado",
    color: "#22c55e", // Verde
    icon: "✓", // Tick
  },
};

/**
 * Obtiene la configuración de un estado
 */
export function getTaskStatusConfig(status: TaskStatus): TaskStatusConfig {
  return TASK_STATUS_CONFIG[status];
}

/**
 * Evalúa el estado de una tarea según la fecha/hora actual
 * 
 * Reglas:
 * - Si está completado manualmente, mantener el estado
 * - Si la fecha/hora actual >= fecha/hora de inicio y el estado es "pending", cambiar a "in_progress"
 */
export function evaluateTaskStatus(
  task: { status: TaskStatus; startDate: Date; startTime?: string },
  currentDate: Date = new Date()
): TaskStatus {
  // Protección: si está completado manualmente, mantener
  if (task.status === "completed") {
    return "completed";
  }

  // Si no tiene hora, usar inicio del día (00:00)
  const startTime = task.startTime || "00:00";
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const taskStartDateTime = new Date(task.startDate);
  taskStartDateTime.setHours(hours, minutes, 0, 0);

  // Si la fecha/hora actual >= fecha/hora de inicio
  if (currentDate >= taskStartDateTime) {
    // Y el estado es "Pendiente", cambiar a "En proceso"
    if (task.status === "pending") {
      return "in_progress";
    }
  }

  // Mantener estado actual
  return task.status;
}

/**
 * Combina una fecha y una hora en un objeto Date
 */
export function combineDateAndTime(date: Date, time?: string): Date {
  const result = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    result.setHours(hours, minutes, 0, 0);
  } else {
    result.setHours(0, 0, 0, 0);
  }
  return result;
}

