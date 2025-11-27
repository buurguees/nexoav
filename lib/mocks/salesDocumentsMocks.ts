/**
 * Funciones Mock para Documentos de Venta (Presupuestos, Facturas, etc.)
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `sales_documents` (docs/base-de-datos.md, línea 945)
 */

// Importar datos JSON (en producción esto vendría del backend)
import salesDocumentsData from "../../data/billing/sales_documents.json";
import clientsData from "../../data/crm/clients.json";
import projectsData from "../../data/operations/projects.json";

// Tipo para los datos de documentos de venta según el schema de la BD
export interface SalesDocumentData {
  id: string; // PK (UUID)
  type: "presupuesto" | "proforma" | "factura" | "rectificativa"; // Tipo de documento
  document_number: string; // Número de documento (ej: "E250061")
  project_id?: string | null; // FK (UUID) → projects.id (opcional)
  client_id: string; // FK (UUID) → clients.id
  client_snapshot?: {
    fiscal_name: string;
    commercial_name?: string;
    vat_number: string;
    address?: {
      street?: string;
      city?: string;
      zip?: string;
      province?: string;
      country?: string;
    };
    phone?: string;
    email?: string;
  }; // JSONB: Datos fiscales congelados al emitir
  date_issued: string; // Fecha de emisión (ISO 8601)
  date_due?: string | null; // Fecha de vencimiento (ISO 8601)
  status: "borrador" | "enviado" | "aceptado" | "cobrada" | "rechazado" | "vencida"; // Estado del documento
  notes_internal?: string; // Notas internas (no visibles en PDF)
  notes_public?: string; // Observaciones visibles en PDF
  totals_data?: {
    base?: number;
    vat?: number;
    total?: number;
    vat_breakdown?: Record<string, { base: number; vat: number; total: number }>;
    total_discount?: number;
    base_imponible?: number;
    total_vat?: number;
  }; // JSONB: Totales del documento estructurado
  template_id?: string | null; // FK (UUID) → document_templates.id
  related_document_id?: string | null; // FK (UUID) → sales_documents.id (documento relacionado, ej: Factura vinculada a su Proforma/Presupuesto de origen)
  rectifies_document_id?: string | null; // FK (UUID) → sales_documents.id (si es rectificativa)
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/enriquecidos
  client_name?: string; // Nombre del cliente (desde client_snapshot o clients)
  project_name?: string; // Nombre del proyecto (desde projects)
  project_ref?: string; // Referencia interna del proyecto (desde projects.internal_ref)
  is_invoiced?: boolean; // Si se ha creado factura del presupuesto
}

/**
 * Simula una llamada al backend para obtener todos los presupuestos
 * Lee desde archivos JSON locales y enriquece con información del cliente y proyecto
 * 
 * @returns Promise con array de presupuestos enriquecidos
 */
// Mapas en memoria para búsqueda rápida
const clientsMap = new Map(
  (clientsData as any[]).map((client) => [
    client.id,
    {
      fiscal_name: client.fiscal_name,
      commercial_name: client.commercial_name,
    },
  ])
);

const projectsMap = new Map(
  (projectsData as any[]).map((project) => [
    project.id,
    {
      name: project.name,
      internal_ref: project.internal_ref,
    },
  ])
);

const facturas = (salesDocumentsData as any[]).filter(
  (doc) => doc.type === "factura"
);

async function fetchSalesDocumentsByType(
  docType: SalesDocumentData["type"]
): Promise<SalesDocumentData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const documents = (salesDocumentsData as any[]).filter(
    (doc) => doc.type === docType
  );

  const enrichedDocuments: SalesDocumentData[] = documents.map((doc) => {
    let clientName = "";
    if (doc.client_snapshot) {
      clientName =
        doc.client_snapshot.commercial_name ||
        doc.client_snapshot.fiscal_name ||
        "";
    } else {
      const client = clientsMap.get(doc.client_id);
      if (client) {
        clientName = client.commercial_name || client.fiscal_name || "";
      }
    }

    let projectName = "";
    let projectRef = "";
    if (doc.project_id) {
      const project = projectsMap.get(doc.project_id);
      if (project) {
        projectName = project.name || "";
        projectRef = project.internal_ref || "";
      }
    }

    const hasInvoice = facturas.some((factura) => {
      if (doc.project_id && factura.project_id) {
        return factura.project_id === doc.project_id;
      }
      if (factura.client_id === doc.client_id) {
        const documentoDate = new Date(doc.date_issued);
        const facturaDate = new Date(factura.date_issued);
        return (
          documentoDate.getFullYear() === facturaDate.getFullYear() &&
          documentoDate.getMonth() === facturaDate.getMonth()
        );
      }
      return false;
    });

    return {
      ...doc,
      client_name: clientName,
      project_name: projectName,
      project_ref: projectRef,
      is_invoiced: hasInvoice,
    } as SalesDocumentData & { is_invoiced: boolean; project_ref?: string };
  });

  return enrichedDocuments.sort((a, b) => {
    const dateA = new Date(a.date_issued).getTime();
    const dateB = new Date(b.date_issued).getTime();
    return dateB - dateA;
  });
}

export async function fetchPresupuestos(): Promise<SalesDocumentData[]> {
  return fetchSalesDocumentsByType("presupuesto");
}

export async function fetchProformas(): Promise<SalesDocumentData[]> {
  return fetchSalesDocumentsByType("proforma");
}

export async function fetchFacturas(): Promise<SalesDocumentData[]> {
  return fetchSalesDocumentsByType("factura");
}

export async function fetchRectificativas(): Promise<SalesDocumentData[]> {
  return fetchSalesDocumentsByType("rectificativa");
}

/**
 * Simula una llamada al backend para obtener un presupuesto por ID
 * 
 * @param id - ID del presupuesto
 * @returns Promise con el presupuesto o null si no existe
 */
export async function fetchPresupuestoById(
  id: string
): Promise<SalesDocumentData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const presupuestos = await fetchPresupuestos();
  return presupuestos.find((doc) => doc.id === id) || null;
}

export async function fetchProformaById(
  id: string
): Promise<SalesDocumentData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const proformas = await fetchProformas();
  return proformas.find((doc) => doc.id === id) || null;
}

export async function fetchFacturaById(
  id: string
): Promise<SalesDocumentData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const facturas = await fetchFacturas();
  return facturas.find((doc) => doc.id === id) || null;
}

export async function fetchRectificativaById(
  id: string
): Promise<SalesDocumentData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const rectificativas = await fetchRectificativas();
  return rectificativas.find((doc) => doc.id === id) || null;
}

/**
 * Convierte un presupuesto aceptado en una proforma manteniendo el número base
 * Regla: E250001 -> FP250001 (mismo sufijo, distinto prefijo)
 */
export async function convertPresupuestoToProforma(
  presupuestoId: string
): Promise<SalesDocumentData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const original = (salesDocumentsData as any[]).find(
    (doc) => doc.id === presupuestoId && doc.type === "presupuesto"
  ) as SalesDocumentData | undefined;

  if (!original) {
    throw new Error("Presupuesto no encontrado");
  }

  const originalNumber = original.document_number; // E250001
  const suffix = originalNumber.slice(1); // 250001
  const newNumber = `FP${suffix}`;

  const now = new Date();
  const dateIssued = now.toISOString().split("T")[0];
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 30);
  const dateDue = dueDate.toISOString().split("T")[0];

  const newDocument: SalesDocumentData = {
    ...original,
    id: crypto.randomUUID(),
    type: "proforma",
    document_number: newNumber,
    date_issued: dateIssued,
    date_due,
    status: "enviado",
    related_document_id: original.id,
    rectifies_document_id: null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  (salesDocumentsData as any[]).push(newDocument as any);

  return newDocument;
}

/**
 * Convierte un presupuesto o proforma en una factura manteniendo el número base
 * Reglas:
 *  - Presupuesto: E250001 -> F-250001
 *  - Proforma:    FP250001 -> F-250001
 */
export async function convertToFactura(
  documentId: string
): Promise<SalesDocumentData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const original = (salesDocumentsData as any[]).find(
    (doc) =>
      doc.id === documentId &&
      (doc.type === "presupuesto" || doc.type === "proforma")
  ) as SalesDocumentData | undefined;

  if (!original) {
    throw new Error("Documento origen no encontrado para conversión a factura");
  }

  const originalNumber = original.document_number;
  let suffix = "";

  if (originalNumber.startsWith("E")) {
    suffix = originalNumber.slice(1);
  } else if (originalNumber.startsWith("FP")) {
    suffix = originalNumber.slice(2);
  } else {
    // Fallback: usar numeración automática estándar
    const year = new Date().getFullYear();
    const autoNumber = generateDocumentNumber("factura", year);
    suffix = autoNumber.replace("F-", "");
  }

  const newNumber = `F-${suffix}`;

  const now = new Date();
  const dateIssued = now.toISOString().split("T")[0];
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 30);
  const dateDue = dueDate.toISOString().split("T")[0];

  const newDocument: SalesDocumentData = {
    ...original,
    id: crypto.randomUUID(),
    type: "factura",
    document_number: newNumber,
    date_issued: dateIssued,
    date_due: dateDue,
    status: "enviado",
    related_document_id: original.id,
    rectifies_document_id: null,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  (salesDocumentsData as any[]).push(newDocument as any);

  return newDocument;
}

/**
 * Convierte una factura en una rectificativa manteniendo el número base
 * Regla: F-250001 -> RT-250001
 */
export async function convertFacturaToRectificativa(
  facturaId: string
): Promise<SalesDocumentData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const original = (salesDocumentsData as any[]).find(
    (doc) => doc.id === facturaId && doc.type === "factura"
  ) as SalesDocumentData | undefined;

  if (!original) {
    throw new Error("Factura no encontrada para conversión a rectificativa");
  }

  const originalNumber = original.document_number; // F-250001
  const suffix = originalNumber.startsWith("F-")
    ? originalNumber.slice(2)
    : originalNumber;
  const newNumber = `RT-${suffix}`;

  const now = new Date();
  const dateIssued = now.toISOString().split("T")[0];

  const newDocument: SalesDocumentData = {
    ...original,
    id: crypto.randomUUID(),
    type: "rectificativa",
    document_number: newNumber,
    date_issued: dateIssued,
    // Las rectificativas no necesitan vencimiento
    date_due: null,
    status: "borrador",
    related_document_id: original.related_document_id || original.id,
    rectifies_document_id: original.id,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  (salesDocumentsData as any[]).push(newDocument as any);

  return newDocument;
}

/**
 * Genera el número de documento automáticamente según el tipo
 * Formato: E{YY}{NNNNN} para presupuestos, FP{YY}{NNNNN} para proformas, F-{YY}{NNNNN} para facturas, RT-{YY}{NNNNN} para rectificativas
 */
function generateDocumentNumber(
  type: SalesDocumentData["type"],
  year: number = new Date().getFullYear()
): string {
  const yearShort = year.toString().slice(-2);
  const prefix = {
    presupuesto: "E",
    proforma: "FP",
    factura: "F-",
    rectificativa: "RT-",
  }[type];

  // Obtener el último número del año
  const documentsOfYear = (salesDocumentsData as any[]).filter((doc) => {
    if (doc.type !== type) return false;
    const docYear = parseInt(doc.document_number.slice(prefix.length, prefix.length + 2));
    return docYear === parseInt(yearShort);
  });

  let maxNumber = 0;
  documentsOfYear.forEach((doc) => {
    const numberPart = doc.document_number.slice(prefix.length + 2);
    const num = parseInt(numberPart) || 0;
    if (num > maxNumber) maxNumber = num;
  });

  const nextNumber = maxNumber + 1;
  const numberStr = String(nextNumber).padStart(5, "0");

  return `${prefix}${yearShort}${numberStr}`;
}

/**
 * Crea un snapshot del cliente para inmutabilidad fiscal
 */
function createClientSnapshot(clientId: string): SalesDocumentData["client_snapshot"] | undefined {
  const client = (clientsData as any[]).find((c) => c.id === clientId);
  if (!client) return undefined;

  return {
    fiscal_name: client.fiscal_name,
    commercial_name: client.commercial_name,
    vat_number: client.vat_number,
    address: client.billing_address ? {
      street: client.billing_address.street,
      city: client.billing_address.city,
      zip: client.billing_address.zip,
      province: client.billing_address.province,
      country: client.billing_address.country,
    } : undefined,
    phone: undefined, // TODO: Añadir si existe en client
    email: undefined, // TODO: Añadir si existe en client
  };
}

/**
 * Simula una llamada al backend para crear un nuevo documento de venta
 */
export async function createSalesDocument(
  documentData: Omit<
    SalesDocumentData,
    "id" | "document_number" | "created_at" | "updated_at" | "client_snapshot"
  > & {
    client_snapshot?: SalesDocumentData["client_snapshot"];
  }
): Promise<SalesDocumentData> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const documentNumber = generateDocumentNumber(documentData.type, year);

  // Crear client_snapshot si no se proporciona
  const clientSnapshot = documentData.client_snapshot || createClientSnapshot(documentData.client_id);

  const newDocument: SalesDocumentData = {
    id: crypto.randomUUID(),
    ...documentData,
    document_number: documentNumber,
    client_snapshot: clientSnapshot,
    created_at: now,
    updated_at: now,
  };

  // En producción, esto se guardaría en la BD
  // Por ahora, solo retornamos el documento creado
  (salesDocumentsData as any[]).push(newDocument);

  return newDocument;
}

/**
 * Simula una llamada al backend para actualizar un documento de venta
 */
export async function updateSalesDocument(
  id: string,
  updates: Partial<Omit<SalesDocumentData, "id" | "document_number" | "created_at" | "type">>
): Promise<SalesDocumentData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const documentIndex = (salesDocumentsData as any[]).findIndex((doc) => doc.id === id);
  if (documentIndex === -1) return null;

  const existingDoc = salesDocumentsData[documentIndex] as any;
  const updatedDoc: SalesDocumentData = {
    ...existingDoc,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // En producción, esto se actualizaría en la BD
  (salesDocumentsData as any[])[documentIndex] = updatedDoc;

  return updatedDoc;
}

/**
 * Simula una llamada al backend para eliminar un documento de venta
 */
export async function deleteSalesDocument(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const documentIndex = (salesDocumentsData as any[]).findIndex((doc) => doc.id === id);
  if (documentIndex === -1) return false;

  // En producción, esto se eliminaría de la BD
  (salesDocumentsData as any[]).splice(documentIndex, 1);

  return true;
}

