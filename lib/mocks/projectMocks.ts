/**
 * Funciones Mock para Proyectos
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `projects` (docs/base-de-datos.md, línea 493)
 */

import { ProjectData } from "../../pages/proyectos/components/ProyectosList";

// Importar datos JSON (en producción esto vendría del backend)
import projectsData from "../../data/operations/projects.json";
import clientsData from "../../data/crm/clients.json";
import salesDocumentsData from "../../data/billing/sales_documents.json";

/**
 * Simula una llamada al backend para obtener todos los proyectos
 * Lee desde archivos JSON locales y enriquece con información del cliente
 * 
 * @returns Promise con array de proyectos con client_name calculado
 */
export async function fetchProjects(): Promise<ProjectData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Crear un mapa de clientes por ID para búsqueda rápida
  const clientsMap = new Map(
    (clientsData as any[]).map((client) => [
      client.id,
      {
        fiscal_name: client.fiscal_name,
        commercial_name: client.commercial_name,
      },
    ])
  );

  // Calcular total de facturación por proyecto
  const billingByProject = (salesDocumentsData as any[]).reduce((acc, document) => {
    // Solo contar facturas definitivas (no presupuestos ni proformas)
    if (document.type !== "factura") return acc;
    
    // Solo contar facturas cobradas o aceptadas
    if (!["cobrada", "aceptada"].includes(document.status)) return acc;
    
    // Solo si tiene project_id
    if (!document.project_id) return acc;
    
    const projectId = document.project_id;
    const total = document.totals_data?.total || 0;
    
    acc[projectId] = (acc[projectId] || 0) + total;
    return acc;
  }, {} as Record<string, number>);

  // Enriquecer proyectos con información del cliente y total_billing
  const projects = (projectsData as any[]).map((project) => {
    const client = clientsMap.get(project.client_id);
    // Priorizar nombre comercial, si no existe usar fiscal_name
    const clientName = client?.commercial_name || client?.fiscal_name || "-";

    return {
      ...project,
      client_name: clientName,
      total_billing: billingByProject[project.id] || 0,
    } as ProjectData;
  });

  return projects;
}

/**
 * Simula una llamada al backend para obtener un proyecto por ID
 * 
 * @param projectId - ID del proyecto
 * @returns Promise con el proyecto o null si no existe
 */
export async function fetchProjectById(projectId: string): Promise<ProjectData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const projects = await fetchProjects();
  return projects.find((p) => p.id === projectId) || null;
}

/**
 * Simula una llamada al backend para obtener proyectos por cliente
 * 
 * @param clientId - ID del cliente
 * @returns Promise con array de proyectos del cliente
 */
export async function fetchProjectsByClient(clientId: string): Promise<ProjectData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const projects = await fetchProjects();
  return projects.filter((p) => p.client_id === clientId);
}

/**
 * Simula una llamada al backend para obtener proyectos por estado
 * 
 * @param status - Estado del proyecto
 * @returns Promise con array de proyectos con ese estado
 */
export async function fetchProjectsByStatus(
  status: ProjectData["status"]
): Promise<ProjectData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const projects = await fetchProjects();
  return projects.filter((p) => p.status === status);
}

/**
 * Simula una llamada al backend para crear un nuevo proyecto
 * 
 * @param projectData - Datos del proyecto a crear (sin campos automáticos)
 * @returns Promise con el proyecto creado (incluyendo campos automáticos)
 */
export async function createProject(
  projectData: Omit<
    ProjectData,
    "id" | "internal_ref" | "created_at" | "updated_at" | "client_name"
  >
): Promise<ProjectData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener proyectos existentes para generar el siguiente código
  const existingProjects = await fetchProjects();
  const lastRef = existingProjects
    .map((p) => parseInt(p.internal_ref))
    .sort((a, b) => b - a)[0] || 0;

  const nextRef = String(lastRef + 1).padStart(4, "0");

  // Obtener nombre del cliente
  const clients = await import("../../data/crm/clients.json").then((m) => m.default);
  const client = (clients as any[]).find((c) => c.id === projectData.client_id);
  const clientName = client?.commercial_name || client?.fiscal_name || "-";

  // Crear nuevo proyecto con campos automáticos
  const newProject: ProjectData = {
    id: crypto.randomUUID(),
    internal_ref: nextRef,
    client_id: projectData.client_id,
    client_po_number: projectData.client_po_number || undefined,
    name: projectData.name,
    status: projectData.status || "borrador",
    location_name: projectData.location_name || undefined,
    location_address: projectData.location_address || undefined,
    location_coords: projectData.location_coords || undefined,
    start_date: projectData.start_date || undefined,
    end_date: projectData.end_date || undefined,
    description: projectData.description || undefined,
    budget_estimated: projectData.budget_estimated || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client_name: clientName,
    total_billing: 0, // Nuevo proyecto, sin facturas aún
  };

  // En producción, aquí se haría un POST a la API
  // Por ahora, solo retornamos el proyecto creado
  // TODO: Implementar guardado real en Supabase cuando esté listo

  return newProject;
}
