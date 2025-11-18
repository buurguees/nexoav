/**
 * Funciones Mock para Tareas
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend
 */

import { Task } from "../types/task";
import { TaskType } from "../taskCategories";
import { startOfMonth, endOfMonth } from "date-fns";

// Importar datos JSON (en producción esto vendría del backend)
import tasksNovember2025 from "../../data/tasks/tasks-november-2025.json";
import tasksDecember2025 from "../../data/tasks/tasks-december-2025.json";
import projectTasks from "../../data/tasks/tasks.json"; // Tareas de proyectos (normalizadas)

/**
 * Simula una llamada al backend para obtener tareas de un mes
 * Lee desde archivos JSON locales (provisional)
 * 
 * @param viewDate - Fecha del mes a consultar
 * @returns Promise con array de tareas
 */
export async function fetchTasksForMonth(viewDate: Date): Promise<Task[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);

  // Determinar qué archivo JSON cargar según el mes
  // Combinamos tareas de archivos mensuales + tareas de proyectos
  let tasksData: any[] = [];
  
  // Cargar tareas de archivos mensuales (tareas independientes)
  if (year === 2025 && month === 10) { // Noviembre (0-indexed, noviembre = 10)
    tasksData = [...tasksData, ...(tasksNovember2025 as any[])];
  } else if (year === 2025 && month === 11) { // Diciembre (0-indexed, diciembre = 11)
    tasksData = [...tasksData, ...(tasksDecember2025 as any[])];
    // Incluir tareas de noviembre que terminen después del inicio de diciembre
    const novemberTasks = tasksNovember2025 as any[];
    const overlappingTasks = novemberTasks.filter((task: any) => {
      const taskEnd = new Date(task.endDate);
      return taskEnd >= monthStart;
    });
    tasksData = [...tasksData, ...overlappingTasks];
  }
  
  // Cargar tareas de proyectos (normalizadas, con project_id)
  // Filtrar solo las que se solapan con el mes consultado
  const projectTasksInMonth = (projectTasks as any[]).filter((task: any) => {
    if (!task.startDate) return false;
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate || task.startDate);
    return taskStart <= monthEnd && taskEnd >= monthStart;
  });
  tasksData = [...tasksData, ...projectTasksInMonth];

  // Convertir los datos JSON a objetos Task con fechas Date
  const tasks: Task[] = tasksData.map((taskData) => ({
    id: taskData.id,
    title: taskData.title,
    description: taskData.description,
    startDate: new Date(taskData.startDate),
    endDate: new Date(taskData.endDate),
    type: taskData.type as TaskType,
    status: (taskData.status || (taskData.completed ? "completed" : "pending")) as "pending" | "in_progress" | "completed",
    completed: taskData.completed || false, // Legacy
    startTime: taskData.startTime,
    endTime: taskData.endTime,
    jobId: taskData.jobId,
    companyId: taskData.companyId,
    assignmentId: taskData.assignmentId,
    project_id: taskData.project_id,
    phase_id: taskData.phase_id, // Para tareas de proyectos
    project_name: taskData.project_name,
    client_id: taskData.client_id,
    client_name: taskData.client_name,
    // Campos adicionales de tareas de proyectos
    assigned_to: taskData.assigned_to,
    priority: taskData.priority,
    estimated_hours: taskData.estimated_hours,
    actual_hours: taskData.actual_hours,
    order: taskData.order,
    notes: taskData.notes,
    // Campos de ubicación
    address: taskData.address,
    city: taskData.city,
    postal_code: taskData.postal_code,
    country: taskData.country,
  }));

  // Filtrar solo las tareas que se solapan con el mes consultado
  // (incluye tareas que empiezan antes pero terminan durante el mes,
  //  tareas que empiezan durante el mes, y tareas que empiezan durante el mes pero terminan después)
  return tasks.filter((task) => {
    return task.startDate <= monthEnd && task.endDate >= monthStart;
  });
}

/**
 * Simula una llamada al backend para obtener tareas de un día específico
 * 
 * @param date - Fecha del día a consultar
 * @returns Promise con array de tareas
 */
export async function fetchTasksForDay(date: Date): Promise<Task[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const monthTasks = await fetchTasksForMonth(date);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return monthTasks.filter((task) => {
    return task.startDate <= dayEnd && task.endDate >= dayStart;
  });
}

/**
 * Simula crear una nueva tarea en el backend
 * 
 * @param task - Datos de la tarea a crear
 * @returns Promise con la tarea creada (incluyendo ID generado)
 */
export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simular generación de ID por el backend
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  return newTask;
}

/**
 * Simula actualizar una tarea existente en el backend
 * 
 * @param taskId - ID de la tarea a actualizar
 * @param updates - Campos a actualizar
 * @returns Promise con la tarea actualizada
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, "id">>
): Promise<Task> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 400));

  // En el futuro, esto haría un PATCH al backend
  // Por ahora, retornamos la tarea actualizada (mock)
  throw new Error("Not implemented: updateTask mock");
}

/**
 * Simula eliminar una tarea del backend
 * 
 * @param taskId - ID de la tarea a eliminar
 * @returns Promise que se resuelve cuando la tarea es eliminada
 */
export async function deleteTask(taskId: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // En el futuro, esto haría un DELETE al backend
  // Por ahora, solo simula el delay
}


