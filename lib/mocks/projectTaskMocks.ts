/**
 * Funciones Mock para Tareas de Proyectos
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `tasks` (docs/base-de-datos.md, línea 803)
 */

// Importar datos JSON (en producción esto vendría del backend)
import tasksData from "../../data/operations/tasks.json";
import projectsData from "../../data/operations/projects.json";
import clientsData from "../../data/crm/clients.json";

// Tipo para los datos de tareas según el schema de la BD
export interface ProjectTaskData {
  id: string; // PK (UUID)
  project_id?: string | null; // FK (UUID) → projects.id (opcional)
  assigned_to?: string | null; // FK (UUID) → profiles.id (opcional)
  title: string; // Título de la tarea
  description?: string | null; // Descripción detallada
  due_date: string; // Fecha de vencimiento (ISO 8601)
  department_tag?: string | null; // Etiqueta de departamento
  status: "pendiente" | "en_proceso" | "completada" | "cancelada"; // Estado de la tarea
  priority?: "baja" | "media" | "alta" | "urgente" | null; // Prioridad
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/enriquecidos
  project_name?: string; // Nombre del proyecto
  client_name?: string; // Nombre del cliente (desde proyecto)
}

// Mapas en memoria para búsqueda rápida
const projectsMap = new Map(
  (projectsData as any[]).map((project) => [
    project.id,
    {
      name: project.name,
      client_id: project.client_id,
    },
  ])
);

const clientsMap = new Map(
  (clientsData as any[]).map((client) => [
    client.id,
    {
      fiscal_name: client.fiscal_name,
      commercial_name: client.commercial_name,
    },
  ])
);

/**
 * Simula una llamada al backend para obtener todas las tareas
 * Opcionalmente filtradas por proyecto
 * 
 * @param projectId - ID del proyecto opcional para filtrar
 * @returns Promise con array de tareas
 */
export async function fetchProjectTasks(projectId?: string): Promise<ProjectTaskData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  let tasks = tasksData as any[];

  // Filtrar por proyecto si se especifica
  if (projectId) {
    tasks = tasks.filter((t) => t.project_id === projectId);
  }

  // Enriquecer con información del proyecto y cliente
  const enrichedTasks = tasks.map((task: any) => {
    const project = task.project_id ? projectsMap.get(task.project_id) : null;
    const client = project?.client_id ? clientsMap.get(project.client_id) : null;

    return {
      ...task,
      project_name: project?.name || undefined,
      client_name: client?.fiscal_name || client?.commercial_name || undefined,
    } as ProjectTaskData;
  });

  return enrichedTasks;
}

/**
 * Simula una llamada al backend para obtener una tarea por ID
 * 
 * @param taskId - ID de la tarea
 * @returns Promise con la tarea o null si no existe
 */
export async function fetchProjectTaskById(taskId: string): Promise<ProjectTaskData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const tasks = await fetchProjectTasks();
  return tasks.find((t) => t.id === taskId) || null;
}

/**
 * Simula una llamada al backend para crear una nueva tarea
 * 
 * @param taskData - Datos de la tarea a crear (sin campos automáticos)
 * @returns Promise con la tarea creada (incluyendo campos automáticos)
 */
export async function createProjectTask(
  taskData: Omit<ProjectTaskData, "id" | "created_at" | "updated_at" | "project_name" | "client_name">
): Promise<ProjectTaskData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const newTask: ProjectTaskData = {
    id,
    ...taskData,
    created_at: now,
    updated_at: now,
  };

  // Enriquecer con información del proyecto y cliente
  const project = taskData.project_id ? projectsMap.get(taskData.project_id) : null;
  const client = project?.client_id ? clientsMap.get(project.client_id) : null;

  newTask.project_name = project?.name || undefined;
  newTask.client_name = client?.fiscal_name || client?.commercial_name || undefined;

  // En producción, aquí se haría un POST a la API
  // TODO: Implementar guardado real en Supabase cuando esté listo

  return newTask;
}

/**
 * Simula una llamada al backend para actualizar una tarea existente
 * 
 * @param taskId - ID de la tarea a actualizar
 * @param taskData - Campos a actualizar (parciales)
 * @returns Promise con la tarea actualizada
 */
export async function updateProjectTask(
  taskId: string,
  taskData: Partial<Omit<ProjectTaskData, "id" | "created_at" | "updated_at" | "project_name" | "client_name">>
): Promise<ProjectTaskData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener tarea existente
  const existing = await fetchProjectTaskById(taskId);
  if (!existing) {
    throw new Error("Tarea no encontrada");
  }

  // Actualizar campos
  const updated: ProjectTaskData = {
    ...existing,
    ...taskData,
    updated_at: new Date().toISOString(),
  };

  // Re-enriquecer con información del proyecto y cliente
  const project = updated.project_id ? projectsMap.get(updated.project_id) : null;
  const client = project?.client_id ? clientsMap.get(project.client_id) : null;

  updated.project_name = project?.name || undefined;
  updated.client_name = client?.fiscal_name || client?.commercial_name || undefined;

  // En producción, aquí se haría un PATCH/PUT a la API
  // TODO: Implementar actualización real en Supabase cuando esté listo

  return updated;
}

/**
 * Simula una llamada al backend para eliminar una tarea
 * 
 * @param taskId - ID de la tarea a eliminar
 * @returns Promise que se resuelve cuando la tarea es eliminada
 */
export async function deleteProjectTask(taskId: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // En producción, aquí se haría un DELETE a la API
  // TODO: Implementar eliminación real en Supabase cuando esté listo
}

