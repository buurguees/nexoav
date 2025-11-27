/**
 * Funciones Mock para Clientes
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `clients` (docs/base-de-datos.md, línea 179)
 */

import { ClientData } from "../../pages/clientes/components/ClientesList";

// Importar datos JSON (en producción esto vendría del backend)
import clientsData from "../../data/crm/clients.json";
import projectsData from "../../data/operations/projects.json";

/**
 * Simula una llamada al backend para obtener todos los clientes
 * Lee desde archivos JSON locales (provisional)
 * 
 * @returns Promise con array de clientes con projects_count calculado
 */
export async function fetchClients(): Promise<ClientData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Contar proyectos por cliente
  const projectsByClient = (projectsData as any[]).reduce((acc, project) => {
    const clientId = project.client_id;
    if (clientId) {
      acc[clientId] = (acc[clientId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Agregar total_projects a cada cliente (según schema de BD)
  const clients = (clientsData as ClientData[]).map((client) => ({
    ...client,
    total_projects: projectsByClient[client.id] || 0,
    projects_count: projectsByClient[client.id] || 0, // Alias para compatibilidad
  }));

  return clients;
}

/**
 * Simula una llamada al backend para obtener un cliente por ID
 * 
 * @param clientId - ID del cliente
 * @returns Promise con el cliente o null si no existe
 */
export async function fetchClientById(clientId: string): Promise<ClientData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const clients = await fetchClients();
  return clients.find((client) => client.id === clientId) || null;
}

/**
 * Simula una llamada al backend para obtener clientes activos
 * 
 * @returns Promise con array de clientes activos
 */
export async function fetchActiveClients(): Promise<ClientData[]> {
  const clients = await fetchClients();
  return clients.filter((client) => client.is_active);
}

/**
 * Simula una llamada al backend para crear un nuevo cliente
 * 
 * @param clientData - Datos del cliente a crear (sin campos automáticos)
 * @returns Promise con el cliente creado (incluyendo campos automáticos)
 */
export async function createClient(clientData: Omit<ClientData, "id" | "internal_code" | "total_billing" | "total_projects" | "created_at" | "updated_at">): Promise<ClientData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener clientes existentes para generar el siguiente código
  const existingClients = await fetchClients();
  const lastCode = existingClients
    .map((c) => parseInt(c.internal_code.replace("CLI-", "")))
    .sort((a, b) => b - a)[0] || 0;
  
  const nextCode = `CLI-${String(lastCode + 1).padStart(4, "0")}`;

  // Crear nuevo cliente con campos automáticos
  const newClient: ClientData = {
    id: crypto.randomUUID(),
    internal_code: nextCode,
    fiscal_name: clientData.fiscal_name,
    commercial_name: clientData.commercial_name || undefined,
    vat_number: clientData.vat_number,
    billing_address: clientData.billing_address,
    shipping_address: clientData.shipping_address,
    payment_terms: clientData.payment_terms || undefined,
    payment_method: clientData.payment_method || undefined,
    total_billing: 0.00,
    total_projects: 0,
    projects_count: 0, // Alias para compatibilidad
    notes: clientData.notes || undefined,
    is_active: clientData.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // En producción, aquí se haría un POST a la API
  // Por ahora, solo retornamos el cliente creado
  // TODO: Implementar guardado real en Supabase cuando esté listo

  return newClient;
}
