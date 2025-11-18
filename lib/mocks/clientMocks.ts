import { Client } from "../types/client";
import clientsData from "../../data/clients/clients.json";

/**
 * Convertir datos JSON a objetos Client con fechas parseadas
 */
function parseClientDates(client: any): Client {
  return {
    ...client,
    created_at: new Date(client.created_at),
    updated_at: new Date(client.updated_at),
    last_activity: client.last_activity ? new Date(client.last_activity) : undefined,
    contacts: client.contacts?.map((contact: any) => ({
      ...contact,
      created_at: new Date(contact.created_at),
      updated_at: new Date(contact.updated_at),
    })),
    locations: client.locations?.map((location: any) => ({
      ...location,
      created_at: new Date(location.created_at),
      updated_at: new Date(location.updated_at),
    })),
    bank_accounts: client.bank_accounts?.map((account: any) => ({
      ...account,
      created_at: new Date(account.created_at),
      updated_at: new Date(account.updated_at),
    })),
  };
}

/**
 * Datos mock de clientes cargados desde clients.json
 * Elimina duplicados por ID para asegurar que cada cliente aparece solo una vez
 */
export const mockClients: Client[] = (() => {
  const parsed = (clientsData as any[]).map(parseClientDates);
  // Eliminar duplicados por ID (por si acaso)
  const uniqueClients = new Map<string, Client>();
  parsed.forEach(client => {
    if (!uniqueClients.has(client.id)) {
      uniqueClients.set(client.id, client);
    }
  });
  return Array.from(uniqueClients.values());
})();

/**
 * Obtener todos los clientes
 */
export function fetchClients(): Promise<Client[]> {
  return Promise.resolve(mockClients);
}

/**
 * Obtener un cliente por ID
 */
export function fetchClientById(id: string): Promise<Client | null> {
  const client = mockClients.find(c => c.id === id);
  return Promise.resolve(client || null);
}

/**
 * Filtrar clientes por estado
 */
export function filterClientsByStatus(clients: Client[], status: Client["status"]): Client[] {
  return clients.filter(client => client.status === status);
}

/**
 * Buscar clientes por texto
 */
export function searchClients(clients: Client[], query: string): Client[] {
  const lowerQuery = query.toLowerCase();
  return clients.filter(client => 
    client.name.toLowerCase().includes(lowerQuery) ||
    client.code.toLowerCase().includes(lowerQuery) ||
    client.city?.toLowerCase().includes(lowerQuery) ||
    client.primary_contact?.name.toLowerCase().includes(lowerQuery) ||
    client.primary_contact?.email.toLowerCase().includes(lowerQuery)
  );
}
