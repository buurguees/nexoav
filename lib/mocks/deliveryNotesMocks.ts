/**
 * Funciones Mock para Albaranes (Delivery Notes)
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de las tablas `delivery_notes` y `delivery_note_lines` (docs/base-de-datos.md)
 */

// Importar datos JSON (en producción esto vendría del backend)
import deliveryNotesData from "../../data/logistics/delivery_notes.json";
import deliveryNoteLinesData from "../../data/logistics/delivery_note_lines.json";
import projectsData from "../../data/operations/projects.json";
import clientsData from "../../data/crm/clients.json";
import inventoryItemsData from "../../data/inventory/inventory_items.json";

// Tipo para los datos de albaranes según el schema de la BD
export interface DeliveryNoteData {
  id: string; // PK (UUID)
  document_number: string; // Número de albarán (ej: "ALB-25001")
  project_id: string; // FK (UUID) → projects.id (OBLIGATORIO)
  client_id?: string | null; // FK (UUID) → clients.id (opcional)
  type: "outbound" | "inbound"; // Tipo de movimiento
  status: "draft" | "confirmed" | "cancelled"; // Estado del albarán
  date_issued: string; // Fecha efectiva del movimiento (ISO 8601)
  notes?: string | null; // Observaciones logísticas
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/enriquecidos
  project_name?: string; // Nombre del proyecto
  client_name?: string; // Nombre del cliente
  lines_count?: number; // Cantidad de líneas del albarán
}

// Tipo para las líneas de albarán
export interface DeliveryNoteLineData {
  id: string; // PK (UUID)
  delivery_note_id: string; // FK (UUID) → delivery_notes.id
  item_id: string; // FK (UUID) → inventory_items.id
  quantity: number; // Cantidad movida
  description: string; // Descripción
  serial_number?: string | null; // Número de serie (opcional)
  created_at: string; // Fecha de creación (ISO 8601)
  // Campos calculados/enriquecidos
  item_name?: string; // Nombre del ítem
  item_code?: string; // Código interno del ítem
}

// Mapas en memoria para búsqueda rápida
const projectsMap = new Map(
  (projectsData as any[]).map((project) => [
    project.id,
    {
      name: project.name,
      internal_ref: project.internal_ref,
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

const inventoryItemsMap = new Map(
  (inventoryItemsData as any[]).map((item) => [
    item.id,
    {
      name: item.name,
      internal_code: item.internal_code,
    },
  ])
);

/**
 * Obtener todos los albaranes (opcionalmente filtrado por proyecto)
 * 
 * @param projectId - ID del proyecto para filtrar (opcional)
 * @returns Promise con array de albaranes enriquecidos
 */
export async function fetchDeliveryNotes(projectId?: string): Promise<DeliveryNoteData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  let notes = [...(deliveryNotesData as any[])];

  // Filtrar por proyecto si se proporciona
  if (projectId) {
    notes = notes.filter((note) => note.project_id === projectId);
  }

  // Enriquecer con información de proyecto y cliente
  return notes.map((note) => {
    const project = projectsMap.get(note.project_id);
    const client = note.client_id ? clientsMap.get(note.client_id) : null;
    const lines = (deliveryNoteLinesData as any[]).filter(
      (line) => line.delivery_note_id === note.id
    );

    return {
      ...note,
      project_name: project?.name || "Proyecto no encontrado",
      client_name: client
        ? client.commercial_name || client.fiscal_name
        : null,
      lines_count: lines.length,
    };
  });
}

/**
 * Obtener un albarán por ID
 * 
 * @param id - ID del albarán
 * @returns Promise con el albarán enriquecido o null si no existe
 */
export async function fetchDeliveryNoteById(
  id: string
): Promise<DeliveryNoteData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  const note = (deliveryNotesData as any[]).find((n) => n.id === id);
  if (!note) return null;

  const project = projectsMap.get(note.project_id);
  const client = note.client_id ? clientsMap.get(note.client_id) : null;
  const lines = (deliveryNoteLinesData as any[]).filter(
    (line) => line.delivery_note_id === note.id
  );

  return {
    ...note,
    project_name: project?.name || "Proyecto no encontrado",
    client_name: client ? client.commercial_name || client.fiscal_name : null,
    lines_count: lines.length,
  };
}

/**
 * Obtener las líneas de un albarán
 * 
 * @param deliveryNoteId - ID del albarán
 * @returns Promise con array de líneas enriquecidas
 */
export async function fetchDeliveryNoteLines(
  deliveryNoteId: string
): Promise<DeliveryNoteLineData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  const lines = (deliveryNoteLinesData as any[]).filter(
    (line) => line.delivery_note_id === deliveryNoteId
  );

  // Enriquecer con información del ítem
  return lines.map((line) => {
    const item = inventoryItemsMap.get(line.item_id);

    return {
      ...line,
      item_name: item?.name || "Ítem no encontrado",
      item_code: item?.internal_code || null,
    };
  });
}

/**
 * Crear un nuevo albarán
 * 
 * @param data - Datos del albarán (sin id, document_number, created_at, updated_at)
 * @returns Promise con el albarán creado
 */
export async function createDeliveryNote(
  data: Omit<
    DeliveryNoteData,
    "id" | "document_number" | "created_at" | "updated_at" | "project_name" | "client_name" | "lines_count"
  >
): Promise<DeliveryNoteData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Generar ID y número de documento
  const id = `f${Date.now()}e8400-e29b-41d4-a716-446655440${Math.floor(Math.random() * 1000)}`;
  const year = new Date().getFullYear().toString().slice(-2);
  const nextNumber = (deliveryNotesData as any[]).length + 1;
  const document_number = `ALB-${year}${String(nextNumber).padStart(5, "0")}`;

  const now = new Date().toISOString();
  const newNote = {
    id,
    document_number,
    ...data,
    created_at: now,
    updated_at: now,
  };

  // Añadir a los datos (en producción esto sería una inserción en BD)
  (deliveryNotesData as any[]).push(newNote);

  // Enriquecer con información de proyecto y cliente
  const project = projectsMap.get(data.project_id);
  const client = data.client_id ? clientsMap.get(data.client_id) : null;

  return {
    ...newNote,
    project_name: project?.name || "Proyecto no encontrado",
    client_name: client ? client.commercial_name || client.fiscal_name : null,
    lines_count: 0,
  };
}

/**
 * Actualizar un albarán
 * 
 * @param id - ID del albarán
 * @param data - Datos a actualizar
 * @returns Promise con el albarán actualizado
 */
export async function updateDeliveryNote(
  id: string,
  data: Partial<Omit<DeliveryNoteData, "id" | "document_number" | "created_at" | "project_name" | "client_name" | "lines_count">>
): Promise<DeliveryNoteData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const noteIndex = (deliveryNotesData as any[]).findIndex((n) => n.id === id);
  if (noteIndex === -1) {
    throw new Error(`Albarán con ID ${id} no encontrado`);
  }

  const updatedNote = {
    ...(deliveryNotesData as any[])[noteIndex],
    ...data,
    updated_at: new Date().toISOString(),
  };

  (deliveryNotesData as any[])[noteIndex] = updatedNote;

  // Enriquecer con información de proyecto y cliente
  const project = projectsMap.get(updatedNote.project_id);
  const client = updatedNote.client_id ? clientsMap.get(updatedNote.client_id) : null;
  const lines = (deliveryNoteLinesData as any[]).filter(
    (line) => line.delivery_note_id === id
  );

  return {
    ...updatedNote,
    project_name: project?.name || "Proyecto no encontrado",
    client_name: client ? client.commercial_name || client.fiscal_name : null,
    lines_count: lines.length,
  };
}

/**
 * Confirmar un albarán (actualizar stock)
 * 
 * @param id - ID del albarán
 * @returns Promise con el albarán confirmado
 */
export async function confirmDeliveryNote(
  id: string
): Promise<DeliveryNoteData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const note = await fetchDeliveryNoteById(id);
  if (!note) {
    throw new Error(`Albarán con ID ${id} no encontrado`);
  }

  if (note.status === "confirmed") {
    return note; // Ya está confirmado
  }

  // Actualizar estado a confirmed
  // En producción, aquí se actualizaría el stock en inventory_items
  return updateDeliveryNote(id, { status: "confirmed" });
}

/**
 * Cancelar un albarán (revertir stock si estaba confirmado)
 * 
 * @param id - ID del albarán
 * @returns Promise con el albarán cancelado
 */
export async function cancelDeliveryNote(
  id: string
): Promise<DeliveryNoteData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const note = await fetchDeliveryNoteById(id);
  if (!note) {
    throw new Error(`Albarán con ID ${id} no encontrado`);
  }

  if (note.status === "cancelled") {
    return note; // Ya está cancelado
  }

  // Actualizar estado a cancelled
  // En producción, aquí se revertiría el stock en inventory_items si estaba confirmed
  return updateDeliveryNote(id, { status: "cancelled" });
}

/**
 * Crear una línea de albarán
 * 
 * @param data - Datos de la línea (sin id, created_at)
 * @returns Promise con la línea creada
 */
export async function createDeliveryNoteLine(
  data: Omit<DeliveryNoteLineData, "id" | "created_at" | "item_name" | "item_code">
): Promise<DeliveryNoteLineData> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newLine: DeliveryNoteLineData = {
    id,
    ...data,
    created_at: now,
  };

  // Enriquecer con información del ítem
  const item = inventoryItemsMap.get(data.item_id);
  newLine.item_name = item?.name || "Ítem no encontrado";
  newLine.item_code = item?.internal_code || null;

  // En producción, esto se guardaría en la BD
  (deliveryNoteLinesData as any[]).push(newLine);

  return newLine;
}

/**
 * Actualizar una línea de albarán
 */
export async function updateDeliveryNoteLine(
  lineId: string,
  updates: Partial<Omit<DeliveryNoteLineData, "id" | "delivery_note_id" | "created_at" | "item_name" | "item_code">>
): Promise<DeliveryNoteLineData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lineIndex = (deliveryNoteLinesData as any[]).findIndex((l) => l.id === lineId);
  if (lineIndex === -1) return null;

  const existingLine = deliveryNoteLinesData[lineIndex] as any;
  const updatedLine = { ...existingLine, ...updates };

  // Enriquecer con información del ítem
  const item = inventoryItemsMap.get(updatedLine.item_id);
  updatedLine.item_name = item?.name || "Ítem no encontrado";
  updatedLine.item_code = item?.internal_code || null;

  (deliveryNoteLinesData as any[])[lineIndex] = updatedLine;

  return updatedLine as DeliveryNoteLineData;
}

/**
 * Eliminar una línea de albarán
 */
export async function deleteDeliveryNoteLine(lineId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lineIndex = (deliveryNoteLinesData as any[]).findIndex((l) => l.id === lineId);
  if (lineIndex === -1) return false;

  (deliveryNoteLinesData as any[]).splice(lineIndex, 1);
  return true;
}

/**
 * Eliminar todas las líneas de un albarán
 */
export async function deleteDeliveryNoteLines(deliveryNoteId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const initialLength = (deliveryNoteLinesData as any[]).length;
  const filtered = (deliveryNoteLinesData as any[]).filter(
    (line) => line.delivery_note_id !== deliveryNoteId
  );

  (deliveryNoteLinesData as any).length = 0;
  (deliveryNoteLinesData as any).push(...filtered);

  return filtered.length < initialLength;
}

