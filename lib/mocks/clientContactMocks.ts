/**
 * Funciones Mock para Contactos de Clientes
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `client_contacts` (docs/base-de-datos.md, línea 700)
 */

// Importar datos JSON (en producción esto vendría del backend)
import clientContactsData from "../../data/crm/client_contacts.json";

// Tipo para los datos de contactos según el schema de la BD
export interface ClientContactData {
  id: string; // PK (UUID)
  client_id: string; // FK (UUID) → clients.id
  full_name: string; // Nombre completo
  position?: string; // Cargo/Posición
  email?: string; // Email de contacto
  phone?: string; // Teléfono de contacto
  tags?: string[]; // Array de etiquetas
  is_billing_contact: boolean; // Si es contacto de facturación
  is_primary: boolean; // Contacto principal
  notes?: string; // Notas sobre el contacto
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
}

/**
 * Simula una llamada al backend para obtener todos los contactos de un cliente
 * 
 * @param clientId - ID del cliente
 * @returns Promise con array de contactos
 */
export async function fetchClientContacts(clientId: string): Promise<ClientContactData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const contacts = (clientContactsData as any[]).filter(
    (contact) => contact.client_id === clientId
  );

  return contacts as ClientContactData[];
}

/**
 * Simula una llamada al backend para obtener un contacto por ID
 * 
 * @param contactId - ID del contacto
 * @returns Promise con el contacto o null si no existe
 */
export async function fetchClientContactById(contactId: string): Promise<ClientContactData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const contact = (clientContactsData as any[]).find((c) => c.id === contactId);
  return (contact as ClientContactData) || null;
}

/**
 * Simula una llamada al backend para crear un nuevo contacto
 * 
 * @param contactData - Datos del contacto a crear
 * @returns Promise con el contacto creado
 */
export async function createClientContact(
  contactData: Omit<ClientContactData, "id" | "created_at" | "updated_at">
): Promise<ClientContactData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const newContact: ClientContactData = {
    id,
    ...contactData,
    created_at: now,
    updated_at: now,
  };

  // Si se marca como principal, desmarcar los demás del mismo cliente
  if (contactData.is_primary) {
    const contacts = clientContactsData as any[];
    contacts.forEach((contact) => {
      if (contact.client_id === contactData.client_id && contact.id !== id) {
        contact.is_primary = false;
      }
    });
  }

  // En producción, aquí se haría un POST a la API
  // TODO: Implementar creación real en Supabase cuando esté listo

  return newContact;
}

/**
 * Simula una llamada al backend para actualizar un contacto
 * 
 * @param contactId - ID del contacto
 * @param updates - Campos a actualizar (parciales)
 * @returns Promise con el contacto actualizado
 */
export async function updateClientContact(
  contactId: string,
  updates: Partial<Omit<ClientContactData, "id" | "created_at" | "updated_at">>
): Promise<ClientContactData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const contacts = clientContactsData as any[];
  const contact = contacts.find((c) => c.id === contactId);

  if (!contact) {
    throw new Error("Contacto no encontrado");
  }

  // Si se marca como principal, desmarcar los demás del mismo cliente
  if (updates.is_primary === true) {
    contacts.forEach((c) => {
      if (c.client_id === contact.client_id && c.id !== contactId) {
        c.is_primary = false;
      }
    });
  }

  const updated: ClientContactData = {
    ...contact,
    ...updates,
    updated_at: new Date().toISOString(),
  } as ClientContactData;

  // En producción, aquí se haría un PATCH/PUT a la API
  // TODO: Implementar actualización real en Supabase cuando esté listo

  return updated;
}

/**
 * Simula una llamada al backend para eliminar un contacto
 * 
 * @param contactId - ID del contacto a eliminar
 * @returns Promise que se resuelve cuando el contacto es eliminado
 */
export async function deleteClientContact(contactId: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const contacts = clientContactsData as any[];
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) {
    throw new Error("Contacto no encontrado");
  }

  // En producción, aquí se haría un DELETE a la API
  // TODO: Implementar eliminación real en Supabase cuando esté listo
}

