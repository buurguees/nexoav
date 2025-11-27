/**
 * Funciones Mock para Gastos (Expenses)
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `expenses` (docs/base-de-datos.md, línea 1236)
 */

// Importar datos JSON (en producción esto vendría del backend)
import expensesData from "../../data/expenses/expenses.json";
import suppliersData from "../../data/expenses/suppliers.json";
import projectsData from "../../data/operations/projects.json";
import purchaseOrdersData from "../../data/purchases/purchase_orders.json";

// Tipo para los datos de gastos según el schema de la BD
export interface ExpenseData {
  id: string; // PK (UUID)
  supplier_id?: string | null; // FK (UUID) → suppliers.id
  project_id?: string | null; // FK (UUID) → projects.id
  purchase_order_id?: string | null; // FK (UUID) → purchase_orders.id
  category_id?: string | null; // FK (UUID) → expense_categories.id
  description: string; // Descripción del gasto
  amount_base: number; // Importe base (sin IVA)
  amount_tax: number; // Importe de IVA
  amount_total: number; // Importe total
  file_url?: string | null; // URL del archivo (ticket/factura)
  date_expense: string; // Fecha del gasto (ISO 8601)
  status: "pendiente_aprobacion" | "aprobado" | "pagado"; // Estado del gasto
  payment_date?: string | null; // Fecha de pago (si está pagado)
  notes?: string | null; // Notas adicionales
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/enriquecidos
  supplier_name?: string; // Nombre del proveedor
  project_name?: string; // Nombre del proyecto
  purchase_order_number?: string; // Número del pedido de compra
  deviation?: number | null; // Desvío si está vinculado a un pedido
}

// Mapas en memoria para búsqueda rápida
const suppliersMap = new Map(
  (suppliersData as any[]).map((supplier) => [
    supplier.id,
    {
      fiscal_name: supplier.fiscal_name,
      commercial_name: supplier.commercial_name,
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

const purchaseOrdersMap = new Map(
  (purchaseOrdersData as any[]).map((order) => [
    order.id,
    {
      document_number: order.document_number,
      estimated_amount: order.estimated_amount,
    },
  ])
);

/**
 * Obtener todos los gastos (opcionalmente filtrado por proyecto o proveedor)
 * 
 * @param projectId - ID del proyecto para filtrar (opcional)
 * @param supplierId - ID del proveedor para filtrar (opcional)
 * @returns Promise con array de gastos enriquecidos
 */
export async function fetchExpenses(
  projectId?: string,
  supplierId?: string
): Promise<ExpenseData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let expenses = [...(expensesData as any[])];

  // Filtrar por proyecto si se proporciona
  if (projectId) {
    expenses = expenses.filter((exp) => exp.project_id === projectId);
  }

  // Filtrar por proveedor si se proporciona
  if (supplierId) {
    expenses = expenses.filter((exp) => exp.supplier_id === supplierId);
  }

  // Enriquecer con información de proveedor, proyecto y pedido
  return expenses.map((expense) => {
    const supplier = expense.supplier_id ? suppliersMap.get(expense.supplier_id) : null;
    const project = expense.project_id ? projectsMap.get(expense.project_id) : null;
    const purchaseOrder = expense.purchase_order_id
      ? purchaseOrdersMap.get(expense.purchase_order_id)
      : null;

    // Calcular desvío si está vinculado a un pedido
    let deviation: number | null = null;
    if (purchaseOrder) {
      deviation = expense.amount_total - purchaseOrder.estimated_amount;
    }

    return {
      ...expense,
      supplier_name: supplier
        ? supplier.commercial_name || supplier.fiscal_name
        : null,
      project_name: project?.name || null,
      purchase_order_number: purchaseOrder?.document_number || null,
      deviation,
    };
  });
}

/**
 * Obtener un gasto por ID
 * 
 * @param id - ID del gasto
 * @returns Promise con el gasto enriquecido o null si no existe
 */
export async function fetchExpenseById(id: string): Promise<ExpenseData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const expense = (expensesData as any[]).find((e) => e.id === id);
  if (!expense) return null;

  const supplier = expense.supplier_id ? suppliersMap.get(expense.supplier_id) : null;
  const project = expense.project_id ? projectsMap.get(expense.project_id) : null;
  const purchaseOrder = expense.purchase_order_id
    ? purchaseOrdersMap.get(expense.purchase_order_id)
    : null;

  let deviation: number | null = null;
  if (purchaseOrder) {
    deviation = expense.amount_total - purchaseOrder.estimated_amount;
  }

  return {
    ...expense,
    supplier_name: supplier ? supplier.commercial_name || supplier.fiscal_name : null,
    project_name: project?.name || null,
    purchase_order_number: purchaseOrder?.document_number || null,
    deviation,
  };
}

/**
 * Crear un nuevo gasto
 */
export async function createExpense(
  data: Omit<
    ExpenseData,
    | "id"
    | "created_at"
    | "updated_at"
    | "supplier_name"
    | "project_name"
    | "purchase_order_number"
    | "deviation"
  >
): Promise<ExpenseData> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newExpense: ExpenseData = {
    id,
    ...data,
    created_at: now,
    updated_at: now,
  };

  // En producción, esto se guardaría en la BD
  (expensesData as any[]).push(newExpense);

  // Enriquecer con información relacionada
  const supplier = data.supplier_id ? suppliersMap.get(data.supplier_id) : null;
  const project = data.project_id ? projectsMap.get(data.project_id) : null;
  const purchaseOrder = data.purchase_order_id
    ? purchaseOrdersMap.get(data.purchase_order_id)
    : null;

  let deviation: number | null = null;
  if (purchaseOrder) {
    deviation = data.amount_total - purchaseOrder.estimated_amount;
  }

  return {
    ...newExpense,
    supplier_name: supplier ? supplier.commercial_name || supplier.fiscal_name : null,
    project_name: project?.name || null,
    purchase_order_number: purchaseOrder?.document_number || null,
    deviation,
  };
}

/**
 * Actualizar un gasto
 */
export async function updateExpense(
  id: string,
  updates: Partial<
    Omit<
      ExpenseData,
      | "id"
      | "created_at"
      | "supplier_name"
      | "project_name"
      | "purchase_order_number"
      | "deviation"
    >
  >
): Promise<ExpenseData | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const expenseIndex = (expensesData as any[]).findIndex((e) => e.id === id);
  if (expenseIndex === -1) return null;

  const existingExpense = expensesData[expenseIndex] as any;
  const updatedExpense = {
    ...existingExpense,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // En producción, esto se actualizaría en la BD
  (expensesData as any[])[expenseIndex] = updatedExpense;

  // Enriquecer con información relacionada
  const supplier = updatedExpense.supplier_id
    ? suppliersMap.get(updatedExpense.supplier_id)
    : null;
  const project = updatedExpense.project_id
    ? projectsMap.get(updatedExpense.project_id)
    : null;
  const purchaseOrder = updatedExpense.purchase_order_id
    ? purchaseOrdersMap.get(updatedExpense.purchase_order_id)
    : null;

  let deviation: number | null = null;
  if (purchaseOrder) {
    deviation = updatedExpense.amount_total - purchaseOrder.estimated_amount;
  }

  return {
    ...updatedExpense,
    supplier_name: supplier ? supplier.commercial_name || supplier.fiscal_name : null,
    project_name: project?.name || null,
    purchase_order_number: purchaseOrder?.document_number || null,
    deviation,
  };
}

/**
 * Eliminar un gasto
 */
export async function deleteExpense(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const expenseIndex = (expensesData as any[]).findIndex((e) => e.id === id);
  if (expenseIndex === -1) return false;

  // En producción, esto se eliminaría de la BD
  (expensesData as any[]).splice(expenseIndex, 1);

  return true;
}

