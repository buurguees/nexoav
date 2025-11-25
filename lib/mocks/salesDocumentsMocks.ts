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

