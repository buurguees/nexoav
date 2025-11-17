import { TaskType } from "../taskCategories";

/**
 * Interfaz compartida para tareas
 * Usada por todos los componentes de calendario y tareas
 */
export interface Task {
  id: string;
  title: string;
  description?: string; // Descripción de la tarea
  startDate: Date;
  endDate: Date;
  type: TaskType; // Categoría de la tarea (obligatorio)
  status: "pending" | "in_progress" | "completed"; // Estado de la tarea (obligatorio)
  completed?: boolean; // Legacy: usar status === "completed" en su lugar
  color?: string; // Opcional, se asigna según type si no se especifica
  // Horario (opcional)
  startTime?: string; // Formato: "HH:mm" (ej: "09:00", "14:30")
  endTime?: string; // Formato: "HH:mm" (ej: "17:00", "18:30")
  // Campos adicionales para preparar el backend
  jobId?: string; // ID del trabajo/proyecto asociado (legacy, usar project_id)
  companyId?: string; // ID de la empresa/cliente (legacy, usar client_id)
  assignmentId?: string; // ID de la asignación
  // Nuevos campos para proyectos y clientes
  project_id?: string; // ID del proyecto
  project_name?: string; // Nombre del proyecto
  client_id?: string; // ID del cliente
  client_name?: string; // Nombre del cliente
  // Campos de ubicación
  address?: string; // Dirección completa
  city?: string; // Población/ciudad
  postal_code?: string; // Código postal
  country?: string; // País
}

