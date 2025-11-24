/**
 * Funciones Mock para Proveedores
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `suppliers` (docs/base-de-datos.md, línea 1073)
 */

import { SupplierData } from "../../pages/proveedores/components/ProveedoresList";

// Importar datos JSON (en producción esto vendría del backend)
import suppliersData from "../../data/expenses/suppliers.json";
import projectsData from "../../data/operations/projects.json";
import expensesDataRaw from "../../data/expenses/expenses.json";

// Asegurar que expensesData sea un array
const expensesData = Array.isArray(expensesDataRaw) ? expensesDataRaw : [];

/**
 * Simula una llamada al backend para obtener todos los proveedores
 * Opcionalmente filtrados por categoría
 * 
 * @param category - Categoría opcional para filtrar (tecnico_freelance, material, software, externo)
 * @returns Promise con array de proveedores
 */
export async function fetchSuppliers(category?: SupplierData["category"]): Promise<SupplierData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Filtrar por categoría si se especifica
  let suppliers = suppliersData as any[];
  if (category) {
    suppliers = suppliers.filter((s) => s.category === category);
  }

  // Contar proyectos por proveedor (desde project_staffing)
  // Por ahora simulamos contando proyectos que podrían estar asignados
  const projectsBySupplier = (projectsData as any[]).reduce((acc, project) => {
    // En producción, esto vendría de project_staffing
    // Por ahora, simulamos con un cálculo básico
    return acc;
  }, {} as Record<string, number>);

  // Calcular total de gastos por proveedor (todos los gastos)
  const expensesBySupplier = (expensesData as any[]).reduce((acc, expense) => {
    if (expense.supplier_id) {
      acc[expense.supplier_id] = (acc[expense.supplier_id] || 0) + (expense.amount_total || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  // Calcular número de pedidos (expenses) por proveedor
  const ordersCountBySupplier = (expensesData as any[]).reduce((acc, expense) => {
    if (expense.supplier_id) {
      acc[expense.supplier_id] = (acc[expense.supplier_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calcular total facturado/pagado por proveedor (solo gastos con status = 'pagado')
  const billedBySupplier = (expensesData as any[]).reduce((acc, expense) => {
    if (expense.supplier_id && expense.status === 'pagado') {
      acc[expense.supplier_id] = (acc[expense.supplier_id] || 0) + (expense.amount_total || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  // Calcular número de facturas emitidas/pagadas por proveedor (status IN ('aprobado', 'pagado'))
  const invoicesCountBySupplier = (expensesData as any[]).reduce((acc, expense) => {
    if (expense.supplier_id && (expense.status === 'aprobado' || expense.status === 'pagado')) {
      acc[expense.supplier_id] = (acc[expense.supplier_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calcular número de facturas pagadas por proveedor (status = 'pagado')
  const invoicesPaidCountBySupplier = (expensesData as any[]).reduce((acc, expense) => {
    if (expense.supplier_id && expense.status === 'pagado') {
      acc[expense.supplier_id] = (acc[expense.supplier_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Enriquecer proveedores con información calculada
  const enrichedSuppliers = suppliers.map((supplier: any) => {
    // Compatibilidad: si tiene 'name' pero no 'fiscal_name', usar 'name' como 'fiscal_name'
    const fiscalName = supplier.fiscal_name || supplier.name || "";
    const commercialName = supplier.commercial_name || undefined;
    
    return {
      ...supplier,
      fiscal_name: fiscalName,
      commercial_name: commercialName,
      name: fiscalName, // Mantener 'name' para compatibilidad
      total_projects: projectsBySupplier[supplier.id] || 0,
      total_expenses: expensesBySupplier[supplier.id] || 0,
      total_billed: billedBySupplier[supplier.id] || 0,
      total_billing: supplier.total_billing || billedBySupplier[supplier.id] || 0, // Usar total_billing del JSON si existe, sino calcular
      invoices_count: invoicesCountBySupplier[supplier.id] || 0,
      invoices_paid_count: invoicesPaidCountBySupplier[supplier.id] || 0,
      total_orders: ordersCountBySupplier[supplier.id] || 0, // Nº total de pedidos/gastos
    } as SupplierData;
  });

  return enrichedSuppliers;
}

/**
 * Simula una llamada al backend para obtener un proveedor por ID
 * 
 * @param supplierId - ID del proveedor
 * @returns Promise con el proveedor o null si no existe
 */
export async function fetchSupplierById(supplierId: string): Promise<SupplierData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const suppliers = await fetchSuppliers();
  return suppliers.find((s) => s.id === supplierId) || null;
}

/**
 * Simula una llamada al backend para obtener proveedores por categoría
 * 
 * @param category - Categoría del proveedor
 * @returns Promise con array de proveedores de esa categoría
 */
export async function fetchSuppliersByCategory(
  category: SupplierData["category"]
): Promise<SupplierData[]> {
  return fetchSuppliers(category);
}

/**
 * Simula una llamada al backend para crear un nuevo proveedor
 * 
 * @param supplierData - Datos del proveedor a crear (sin campos automáticos)
 * @returns Promise con el proveedor creado (incluyendo campos automáticos)
 */
export async function createSupplier(
  supplierData: Omit<SupplierData, "id" | "internal_code" | "created_at" | "updated_at" | "total_projects" | "total_expenses" | "total_billed" | "total_billing" | "invoices_count" | "invoices_paid_count" | "total_orders">
): Promise<SupplierData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Obtener proveedores existentes para generar el siguiente código
  const existingSuppliers = await fetchSuppliers();
  const lastCode = existingSuppliers
    .map((s) => {
      const code = s.internal_code || "";
      const match = code.match(/PROV-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .sort((a, b) => b - a)[0] || 0;
  
  const nextCode = `PROV-${String(lastCode + 1).padStart(4, "0")}`;

  // Crear nuevo proveedor con campos automáticos
  const fiscalName = supplierData.fiscal_name || supplierData.name || "";
  const newSupplier: SupplierData = {
    id: crypto.randomUUID(),
    internal_code: nextCode,
    fiscal_name: fiscalName,
    commercial_name: supplierData.commercial_name || undefined,
    name: fiscalName, // Mantener 'name' para compatibilidad
    cif: supplierData.cif || undefined,
    category: supplierData.category,
    freelance_profile_id: supplierData.freelance_profile_id || undefined,
    address: supplierData.address || undefined,
    contact_email: supplierData.contact_email || undefined,
    contact_phone: supplierData.contact_phone || undefined,
    payment_terms_days: supplierData.payment_terms_days || 30,
    notes: supplierData.notes || undefined,
    is_active: supplierData.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_projects: 0,
    total_expenses: 0,
    total_billed: 0,
    total_billing: 0,
    invoices_count: 0,
    invoices_paid_count: 0,
    total_orders: 0,
  };

  // En producción, aquí se haría un POST a la API
  // Por ahora, solo retornamos el proveedor creado
  // TODO: Implementar guardado real en Supabase cuando esté listo

  return newSupplier;
}

