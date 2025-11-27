/**
 * Funciones Mock para Tarifas de Proveedores
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `supplier_rates` (docs/base-de-datos.md, línea 1209)
 */

// Importar datos JSON (en producción esto vendría del backend)
import supplierRatesData from "../../data/expenses/supplier_rates.json";
import inventoryItemsData from "../../data/inventory/inventory_items.json";

// Tipo para los datos de tarifas según el schema de la BD
export interface SupplierRateData {
  id: string; // PK (UUID)
  supplier_id: string; // FK (UUID) → suppliers.id
  inventory_item_id: string; // FK (UUID) → inventory_items.id (servicio de venta)
  service_type: string; // Tipo de servicio (ej: "jornada", "hora_extra")
  cost_price: number; // Coste que se paga al proveedor
  unit: string; // Unidad de medida (ej: "día", "hora")
  year: number; // Año de la tarifa
  is_active: boolean; // Si la tarifa está activa
  notes?: string; // Notas sobre la tarifa
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
}

// Tipo para el servicio vinculado (inventory_item)
export interface InventoryItemData {
  id: string;
  name: string;
  base_price: number;
  unit: string;
  type: string;
}

/**
 * Simula una llamada al backend para obtener todas las tarifas de un proveedor
 * 
 * @param supplierId - ID del proveedor
 * @returns Promise con array de tarifas
 */
export async function fetchSupplierRates(supplierId: string): Promise<SupplierRateData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const rates = (supplierRatesData as any[]).filter(
    (rate) => rate.supplier_id === supplierId
  );

  return rates as SupplierRateData[];
}

/**
 * Simula una llamada al backend para obtener un servicio (inventory_item) por ID
 * 
 * @param itemId - ID del servicio
 * @returns Promise con el servicio o null si no existe
 */
export async function fetchInventoryItemById(itemId: string): Promise<InventoryItemData | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const item = (inventoryItemsData as any[]).find((i) => i.id === itemId);
  return (item as InventoryItemData) || null;
}

/**
 * Simula una llamada al backend para obtener todos los servicios (solo tipo "servicio")
 * 
 * @returns Promise con array de servicios
 */
export async function fetchServices(): Promise<InventoryItemData[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const services = (inventoryItemsData as any[]).filter(
    (item) => item.type === "servicio"
  );
  return services as InventoryItemData[];
}

/**
 * Simula una llamada al backend para crear una nueva tarifa
 * 
 * @param rateData - Datos de la tarifa a crear
 * @returns Promise con la tarifa creada
 */
export async function createSupplierRate(
  rateData: Omit<SupplierRateData, "id" | "created_at" | "updated_at">
): Promise<SupplierRateData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const newRate: SupplierRateData = {
    id,
    ...rateData,
    created_at: now,
    updated_at: now,
  };

  // En producción, aquí se haría un POST a la API
  // TODO: Implementar creación real en Supabase cuando esté listo

  return newRate;
}

/**
 * Simula una llamada al backend para actualizar una tarifa
 * 
 * @param rateId - ID de la tarifa
 * @param updates - Campos a actualizar (parciales)
 * @returns Promise con la tarifa actualizada
 */
export async function updateSupplierRate(
  rateId: string,
  updates: Partial<Omit<SupplierRateData, "id" | "created_at" | "updated_at">>
): Promise<SupplierRateData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rates = supplierRatesData as any[];
  const rate = rates.find((r) => r.id === rateId);

  if (!rate) {
    throw new Error("Tarifa no encontrada");
  }

  const updated: SupplierRateData = {
    ...rate,
    ...updates,
    updated_at: new Date().toISOString(),
  } as SupplierRateData;

  // En producción, aquí se haría un PATCH/PUT a la API
  // TODO: Implementar actualización real en Supabase cuando esté listo

  return updated;
}

/**
 * Simula una llamada al backend para eliminar una tarifa
 * 
 * @param rateId - ID de la tarifa a eliminar
 * @returns Promise que se resuelve cuando la tarifa es eliminada
 */
export async function deleteSupplierRate(rateId: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const rates = supplierRatesData as any[];
  const index = rates.findIndex((r) => r.id === rateId);

  if (index === -1) {
    throw new Error("Tarifa no encontrada");
  }

  // En producción, aquí se haría un DELETE a la API
  // TODO: Implementar eliminación real en Supabase cuando esté listo
}

