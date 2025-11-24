/**
 * Funciones Mock para Inventario (Productos y Servicios)
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `inventory_items` (docs/base-de-datos.md, línea 872)
 */

// Importar datos JSON (en producción esto vendría del backend)
import inventoryItemsData from "../../data/inventory/inventory_items.json";
import inventoryCategoriesData from "../../data/inventory/inventory_categories.json";
import salesDocumentLinesData from "../../data/billing/sales_document_lines.json";
import salesDocumentsData from "../../data/billing/sales_documents.json";
import supplierRatesData from "../../data/expenses/supplier_rates.json";

// Tipo para los datos de inventario según el schema de la BD
export interface InventoryItemData {
  id: string;
  internal_code: string;
  name: string;
  description?: string;
  type: "producto" | "servicio";
  subtype?: string;
  category_id: string;
  primary_supplier_id?: string;
  base_price: number;
  cost_price: number;
  margin_percentage?: number;
  rental_price_12m?: number;
  rental_price_18m?: number;
  rental_price_daily?: number;
  is_stockable: boolean;
  stock_current?: number | null;
  stock_min?: number | null;
  unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Campos calculados/enriquecidos
  category_name?: string;
  units_sold?: number; // Unidades vendidas (calculado desde sales_document_lines)
  total_billing?: number; // Total facturado (calculado desde sales_document_lines)
  average_cost?: number; // Coste medio (calculado desde supplier_rates)
}

/**
 * Simula una llamada al backend para obtener todos los items del inventario
 * Opcionalmente filtrados por tipo (producto o servicio)
 * 
 * @param type - Tipo opcional para filtrar (producto, servicio)
 * @returns Promise con array de items del inventario
 */
export async function fetchInventoryItems(type?: "producto" | "servicio"): Promise<InventoryItemData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Filtrar por tipo si se especifica
  let items = inventoryItemsData as any[];
  if (type) {
    items = items.filter((item) => item.type === type);
  }

  // Crear mapa de categorías para enriquecer los items
  const categoriesMap = (inventoryCategoriesData as any[]).reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>);

  // Calcular unidades vendidas y facturación por item desde sales_document_lines
  // Solo contar líneas de documentos facturados (status = 'cobrada' o 'aceptada')
  const validDocumentIds = (salesDocumentsData as any[])
    .filter((doc) => doc.type === "factura" && (doc.status === "cobrada" || doc.status === "aceptada"))
    .map((doc) => doc.id);

  const unitsSoldByItem = (salesDocumentLinesData as any[]).reduce((acc, line) => {
    if (line.item_id && validDocumentIds.includes(line.document_id)) {
      acc[line.item_id] = (acc[line.item_id] || 0) + (line.quantity || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  const totalBillingByItem = (salesDocumentLinesData as any[]).reduce((acc, line) => {
    if (line.item_id && validDocumentIds.includes(line.document_id)) {
      acc[line.item_id] = (acc[line.item_id] || 0) + (line.total_line || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  // Calcular coste medio por item desde supplier_rates
  const costByItem = (supplierRatesData as any[]).reduce((acc, rate) => {
    if (rate.inventory_item_id && rate.is_active) {
      if (!acc[rate.inventory_item_id]) {
        acc[rate.inventory_item_id] = [];
      }
      acc[rate.inventory_item_id].push(rate.cost_price || 0);
    }
    return acc;
  }, {} as Record<string, number[]>);

  const averageCostByItem: Record<string, number> = {};
  Object.keys(costByItem).forEach((itemId) => {
    const costs = costByItem[itemId];
    if (costs.length > 0) {
      const sum = costs.reduce((a, b) => a + b, 0);
      averageCostByItem[itemId] = sum / costs.length;
    }
  });

  // Enriquecer items con nombre de categoría y datos calculados
  const enrichedItems = items.map((item: any) => ({
    ...item,
    category_name: categoriesMap[item.category_id] || "Sin categoría",
    units_sold: unitsSoldByItem[item.id] || 0,
    total_billing: totalBillingByItem[item.id] || 0,
    average_cost: averageCostByItem[item.id] || item.cost_price || 0,
  })) as InventoryItemData[];

  return enrichedItems;
}

/**
 * Simula una llamada al backend para obtener un item por ID
 * 
 * @param itemId - ID del item
 * @returns Promise con el item o null si no existe
 */
export async function fetchInventoryItemById(itemId: string): Promise<InventoryItemData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const items = await fetchInventoryItems();
  return items.find((item) => item.id === itemId) || null;
}

/**
 * Simula una llamada al backend para obtener items por categoría
 * 
 * @param categoryId - ID de la categoría
 * @returns Promise con array de items de esa categoría
 */
export async function fetchInventoryItemsByCategory(
  categoryId: string
): Promise<InventoryItemData[]> {
  const items = await fetchInventoryItems();
  return items.filter((item) => item.category_id === categoryId);
}

/**
 * Simula una llamada al backend para obtener solo productos
 * 
 * @returns Promise con array de productos
 */
export async function fetchProducts(): Promise<InventoryItemData[]> {
  return fetchInventoryItems("producto");
}

/**
 * Simula una llamada al backend para obtener solo servicios
 * 
 * @returns Promise con array de servicios
 */
export async function fetchServices(): Promise<InventoryItemData[]> {
  return fetchInventoryItems("servicio");
}

