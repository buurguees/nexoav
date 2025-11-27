/**
 * Funciones Mock para Líneas de Documentos de Venta
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `sales_document_lines` (docs/base-de-datos.md)
 */

// Importar datos JSON (en producción esto vendría del backend)
import salesDocumentLinesData from "../../data/billing/sales_document_lines.json";

// Tipo para los datos de líneas según el schema de la BD
export interface SalesDocumentLineData {
  id: string; // PK (UUID)
  document_id: string; // FK (UUID) → sales_documents.id
  item_id?: string | null; // FK (UUID) → inventory_items.id (opcional, puede ser servicio sin item)
  concept: string; // Concepto/nombre de la línea
  description?: string; // Descripción detallada
  quantity: number; // Cantidad
  unit_price: number; // Precio unitario
  discount_percent: number; // Descuento porcentual
  subtotal: number; // Subtotal (quantity * unit_price * (1 - discount_percent/100))
  tax_percent: number; // IVA porcentual
  total_line: number; // Total de la línea (subtotal * (1 + tax_percent/100))
  grouping_tag: "Productos" | "Servicios"; // Etiqueta para agrupar en PDF
  line_order: number; // Orden dentro del documento
  created_at: string; // Fecha de creación (ISO 8601)
}

/**
 * Simula una llamada al backend para obtener todas las líneas de un documento
 * 
 * @param documentId - ID del documento
 * @returns Promise con array de líneas ordenadas por grouping_tag y line_order
 */
export async function fetchSalesDocumentLines(
  documentId: string
): Promise<SalesDocumentLineData[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lines = (salesDocumentLinesData as any[]).filter(
    (line) => line.document_id === documentId
  );

  // Ordenar por grouping_tag (Productos primero) y luego por line_order
  return lines.sort((a, b) => {
    if (a.grouping_tag !== b.grouping_tag) {
      return a.grouping_tag === "Productos" ? -1 : 1;
    }
    return (a.line_order || 0) - (b.line_order || 0);
  }) as SalesDocumentLineData[];
}

/**
 * Simula una llamada al backend para obtener una línea por ID
 * 
 * @param lineId - ID de la línea
 * @returns Promise con la línea o null si no existe
 */
export async function fetchSalesDocumentLineById(
  lineId: string
): Promise<SalesDocumentLineData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const line = (salesDocumentLinesData as any[]).find((l) => l.id === lineId);
  return (line as SalesDocumentLineData) || null;
}

/**
 * Calcula el subtotal y total_line de una línea
 */
function calculateLineTotals(
  quantity: number,
  unitPrice: number,
  discountPercent: number,
  taxPercent: number
): { subtotal: number; totalLine: number } {
  const subtotal = quantity * unitPrice * (1 - discountPercent / 100);
  const totalLine = subtotal * (1 + taxPercent / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalLine: Math.round(totalLine * 100) / 100,
  };
}

/**
 * Simula una llamada al backend para crear una nueva línea de documento
 */
export async function createSalesDocumentLine(
  lineData: Omit<SalesDocumentLineData, "id" | "created_at" | "subtotal" | "total_line"> & {
    subtotal?: number;
    total_line?: number;
  }
): Promise<SalesDocumentLineData> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Calcular subtotal y total_line si no se proporcionan
  const { subtotal, totalLine } = calculateLineTotals(
    lineData.quantity,
    lineData.unit_price,
    lineData.discount_percent,
    lineData.tax_percent
  );

  const newLine: SalesDocumentLineData = {
    id: crypto.randomUUID(),
    ...lineData,
    subtotal,
    total_line: totalLine,
    created_at: new Date().toISOString(),
  };

  // En producción, esto se guardaría en la BD
  (salesDocumentLinesData as any[]).push(newLine);

  return newLine;
}

/**
 * Simula una llamada al backend para actualizar una línea de documento
 */
export async function updateSalesDocumentLine(
  lineId: string,
  updates: Partial<
    Omit<SalesDocumentLineData, "id" | "document_id" | "created_at" | "subtotal" | "total_line">
  >
): Promise<SalesDocumentLineData | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const lineIndex = (salesDocumentLinesData as any[]).findIndex((l) => l.id === lineId);
  if (lineIndex === -1) return null;

  const existingLine = salesDocumentLinesData[lineIndex] as any;
  const updatedLineData = { ...existingLine, ...updates };

  // Recalcular subtotal y total_line si cambió quantity, unit_price, discount_percent o tax_percent
  const { subtotal, totalLine } = calculateLineTotals(
    updatedLineData.quantity,
    updatedLineData.unit_price,
    updatedLineData.discount_percent,
    updatedLineData.tax_percent
  );

  const updatedLine: SalesDocumentLineData = {
    ...updatedLineData,
    subtotal,
    total_line: totalLine,
  };

  // En producción, esto se actualizaría en la BD
  (salesDocumentLinesData as any[])[lineIndex] = updatedLine;

  return updatedLine;
}

/**
 * Simula una llamada al backend para eliminar una línea de documento
 */
export async function deleteSalesDocumentLine(lineId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lineIndex = (salesDocumentLinesData as any[]).findIndex((l) => l.id === lineId);
  if (lineIndex === -1) return false;

  // En producción, esto se eliminaría de la BD
  (salesDocumentLinesData as any[]).splice(lineIndex, 1);

  return true;
}

/**
 * Simula una llamada al backend para eliminar todas las líneas de un documento
 */
export async function deleteSalesDocumentLines(documentId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const initialLength = (salesDocumentLinesData as any[]).length;
  const filtered = (salesDocumentLinesData as any[]).filter(
    (line) => line.document_id !== documentId
  );

  // En producción, esto se eliminaría de la BD
  (salesDocumentLinesData as any).length = 0;
  (salesDocumentLinesData as any).push(...filtered);

  return filtered.length < initialLength;
}

/**
 * Calcula los totales de un documento desde sus líneas
 */
export function calculateDocumentTotals(
  lines: SalesDocumentLineData[]
): {
  base_imponible: number;
  total_vat: number;
  total: number;
  vat_breakdown: Record<string, { base: number; vat: number; total: number }>;
  total_discount: number;
} {
  const vatBreakdown: Record<string, { base: number; vat: number; total: number }> = {};
  let totalDiscount = 0;

  lines.forEach((line) => {
    const taxKey = line.tax_percent.toString();
    if (!vatBreakdown[taxKey]) {
      vatBreakdown[taxKey] = { base: 0, vat: 0, total: 0 };
    }

    const lineDiscount = line.quantity * line.unit_price * (line.discount_percent / 100);
    totalDiscount += lineDiscount;

    const base = line.subtotal;
    const vat = line.total_line - line.subtotal;
    const total = line.total_line;

    vatBreakdown[taxKey].base += base;
    vatBreakdown[taxKey].vat += vat;
    vatBreakdown[taxKey].total += total;
  });

  // Redondear valores
  Object.keys(vatBreakdown).forEach((key) => {
    vatBreakdown[key].base = Math.round(vatBreakdown[key].base * 100) / 100;
    vatBreakdown[key].vat = Math.round(vatBreakdown[key].vat * 100) / 100;
    vatBreakdown[key].total = Math.round(vatBreakdown[key].total * 100) / 100;
  });

  const baseImponible = Math.round(
    Object.values(vatBreakdown).reduce((sum, v) => sum + v.base, 0) * 100
  ) / 100;
  const totalVat = Math.round(
    Object.values(vatBreakdown).reduce((sum, v) => sum + v.vat, 0) * 100
  ) / 100;
  const total = Math.round(
    Object.values(vatBreakdown).reduce((sum, v) => sum + v.total, 0) * 100
  ) / 100;
  totalDiscount = Math.round(totalDiscount * 100) / 100;

  return {
    base_imponible: baseImponible,
    total_vat: totalVat,
    total,
    vat_breakdown: vatBreakdown,
    total_discount: totalDiscount,
  };
}

