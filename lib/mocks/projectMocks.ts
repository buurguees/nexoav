/**
 * Funciones Mock para Proyectos
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend
 */

import projectsData from "../../data/projects/projects-2025.json";
import projectTasksData from "../../data/tasks/tasks.json";

/**
 * Interfaz de Proyecto (simplificada para mock)
 */
export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  progress: number;
  client_id: string;
  client_name?: string;
  client_code?: string;
  start_date?: string;
  estimated_end_date?: string;
  actual_end_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  quote_id?: string | null;
  phases: ProjectPhase[];
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  location_coordinates?: { lat: number; lng: number };
  assigned_technicians?: string[];
  project_manager_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  notes?: string;
  internal_notes?: string;
}

/**
 * Interfaz de Fase de Proyecto
 */
export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  order: number;
  status: string;
  progress: number;
  required_for_next_phase?: boolean;
  estimated_start_date?: string;
  estimated_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interfaz de Tarea de Proyecto
 */
export interface ProjectTask {
  id: string;
  project_id: string;
  phase_id?: string | null;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  order?: number;
  assigned_to?: string[];
  priority?: string;
  estimated_hours?: number;
  actual_hours?: number;
  startTime?: string;
  endTime?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  notes?: string;
}

/**
 * Simula una llamada al backend para obtener todos los proyectos
 * 
 * @returns Promise con array de proyectos
 */
export async function fetchProjects(): Promise<Project[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  return projectsData as Project[];
}

/**
 * Simula una llamada al backend para obtener un proyecto por ID
 * 
 * @param projectId - ID del proyecto
 * @returns Promise con el proyecto o null si no existe
 */
export async function fetchProject(projectId: string): Promise<Project | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const projects = projectsData as Project[];
  return projects.find((p) => p.id === projectId) || null;
}

/**
 * Simula una llamada al backend para obtener las fases de un proyecto
 * 
 * @param projectId - ID del proyecto
 * @returns Promise con array de fases
 */
export async function fetchProjectPhases(projectId: string): Promise<ProjectPhase[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const project = await fetchProject(projectId);
  if (!project) return [];

  return project.phases || [];
}

/**
 * Simula una llamada al backend para obtener las tareas de un proyecto
 * 
 * @param projectId - ID del proyecto
 * @param phaseId - ID de la fase (opcional, para filtrar por fase)
 * @returns Promise con array de tareas
 */
export async function fetchProjectTasks(
  projectId: string,
  phaseId?: string
): Promise<ProjectTask[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const tasks = projectTasksData as ProjectTask[];
  
  // Filtrar por project_id
  let filteredTasks = tasks.filter((task) => task.project_id === projectId);
  
  // Si se especifica phase_id, filtrar también por fase
  if (phaseId) {
    filteredTasks = filteredTasks.filter((task) => task.phase_id === phaseId);
  }

  return filteredTasks;
}

/**
 * Simula una llamada al backend para obtener todas las tareas de proyectos
 * (útil para calendarios que muestran tareas de múltiples proyectos)
 * 
 * @returns Promise con array de todas las tareas de proyectos
 */
export async function fetchAllProjectTasks(): Promise<ProjectTask[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  return projectTasksData as ProjectTask[];
}

/**
 * Simula crear una nueva tarea para un proyecto
 * 
 * @param task - Datos de la tarea a crear (debe incluir project_id)
 * @returns Promise con la tarea creada (incluyendo ID generado)
 */
export async function createProjectTask(
  task: Omit<ProjectTask, "id">
): Promise<ProjectTask> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simular generación de ID por el backend
  const newTask: ProjectTask = {
    ...task,
    id: `task-proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  // En producción, aquí se insertaría en la tabla tasks con project_id
  // INSERT INTO tasks (project_id, phase_id, title, ...) VALUES (...)

  return newTask;
}

