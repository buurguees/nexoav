/**
 * Funciones Mock para Pedidos de Compra (Purchase Orders)
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `purchase_orders` (docs/base-de-datos.md)
 */

// Importar datos JSON (en producción esto vendría del backend)
import purchaseOrdersData from "../../data/purchases/purchase_orders.json";
import projectsData from "../../data/operations/projects.json";
import suppliersData from "../../data/expenses/suppliers.json";
import expensesData from "../../data/expenses/expenses.json";

// Tipo para los datos de pedidos de compra según el schema de la BD
export interface PurchaseOrderData {
  id: string; // PK (UUID)
  project_id: string; // FK (UUID) → projects.id (OBLIGATORIO)
  supplier_id?: string | null; // FK (UUID) → suppliers.id (opcional)
  document_number: string; // Referencia interna de pedido (ej: "PO-25001")
  description: string; // Descripción del pedido
  estimated_amount: number; // Importe Cotizado (Previsión)
  status: "pending" | "fulfilled" | "cancelled"; // Estado del pedido
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/enriquecidos
  project_name?: string; // Nombre del proyecto
  supplier_name?: string; // Nombre del proveedor
  expense_id?: string | null; // ID del gasto vinculado (si está fulfilled)
  expense_amount?: number | null; // Importe real del gasto vinculado
  deviation?: number | null; // Desvío (real - previsión)
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

const suppliersMap = new Map(
  (suppliersData as any[]).map((supplier) => [
    supplier.id,
    {
      fiscal_name: supplier.fiscal_name,
      commercial_name: supplier.commercial_name,
    },
  ])
);

/**
 * Obtener todos los pedidos de compra (opcionalmente filtrado por proyecto)
 * 
 * @param projectId - ID del proyecto para filtrar (opcional)
 * @returns Promise con array de pedidos enriquecidos
 */
export async function fetchPurchaseOrders(projectId?: string): Promise<PurchaseOrderData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  let orders = [...(purchaseOrdersData as any[])];

  // Filtrar por proyecto si se proporciona
  if (projectId) {
    orders = orders.filter((order) => order.project_id === projectId);
  }

  // Enriquecer con información de proyecto, proveedor y gasto vinculado
  return orders.map((order) => {
    const project = projectsMap.get(order.project_id);
    const supplier = order.supplier_id ? suppliersMap.get(order.supplier_id) : null;
    
    // Buscar gasto vinculado
    const expense = (expensesData as any[]).find(
      (exp) => exp.purchase_order_id === order.id
    );

    const expenseAmount = expense ? expense.amount_total : null;
    const deviation = expenseAmount !== null ? expenseAmount - order.estimated_amount : null;

    return {
      ...order,
      project_name: project?.name || "Proyecto no encontrado",
      supplier_name: supplier
        ? supplier.commercial_name || supplier.fiscal_name
        : null,
      expense_id: expense?.id || null,
      expense_amount: expenseAmount,
      deviation: deviation,
    };
  });
}

/**
 * Obtener un pedido de compra por ID
 * 
 * @param id - ID del pedido
 * @returns Promise con el pedido enriquecido o null si no existe
 */
export async function fetchPurchaseOrderById(
  id: string
): Promise<PurchaseOrderData | null> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  const order = (purchaseOrdersData as any[]).find((o) => o.id === id);
  if (!order) return null;

  const project = projectsMap.get(order.project_id);
  const supplier = order.supplier_id ? suppliersMap.get(order.supplier_id) : null;
  
  // Buscar gasto vinculado
  const expense = (expensesData as any[]).find(
    (exp) => exp.purchase_order_id === order.id
  );

  const expenseAmount = expense ? expense.amount_total : null;
  const deviation = expenseAmount !== null ? expenseAmount - order.estimated_amount : null;

  return {
    ...order,
    project_name: project?.name || "Proyecto no encontrado",
    supplier_name: supplier
      ? supplier.commercial_name || supplier.fiscal_name
      : null,
    expense_id: expense?.id || null,
    expense_amount: expenseAmount,
    deviation: deviation,
  };
}

/**
 * Crear un nuevo pedido de compra
 * 
 * @param data - Datos del pedido (sin id, document_number, created_at, updated_at)
 * @returns Promise con el pedido creado
 */
export async function createPurchaseOrder(
  data: Omit<
    PurchaseOrderData,
    "id" | "document_number" | "created_at" | "updated_at" | "project_name" | "supplier_name" | "expense_id" | "expense_amount" | "deviation"
  >
): Promise<PurchaseOrderData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Generar ID y número de documento
  const id = `g${Date.now()}e8400-e29b-41d4-a716-446655440${Math.floor(Math.random() * 1000)}`;
  const year = new Date().getFullYear().toString().slice(-2);
  const nextNumber = (purchaseOrdersData as any[]).length + 1;
  const document_number = `PO-${year}${String(nextNumber).padStart(5, "0")}`;

  const now = new Date().toISOString();
  const newOrder = {
    id,
    document_number,
    ...data,
    status: data.status || "pending",
    created_at: now,
    updated_at: now,
  };

  // Añadir a los datos (en producción esto sería una inserción en BD)
  (purchaseOrdersData as any[]).push(newOrder);

  // Enriquecer con información de proyecto y proveedor
  const project = projectsMap.get(data.project_id);
  const supplier = data.supplier_id ? suppliersMap.get(data.supplier_id) : null;

  return {
    ...newOrder,
    project_name: project?.name || "Proyecto no encontrado",
    supplier_name: supplier
      ? supplier.commercial_name || supplier.fiscal_name
      : null,
    expense_id: null,
    expense_amount: null,
    deviation: null,
  };
}

/**
 * Actualizar un pedido de compra
 * 
 * @param id - ID del pedido
 * @param data - Datos a actualizar
 * @returns Promise con el pedido actualizado
 */
export async function updatePurchaseOrder(
  id: string,
  data: Partial<Omit<PurchaseOrderData, "id" | "document_number" | "created_at" | "project_name" | "supplier_name" | "expense_id" | "expense_amount" | "deviation">>
): Promise<PurchaseOrderData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const orderIndex = (purchaseOrdersData as any[]).findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    throw new Error(`Pedido de compra con ID ${id} no encontrado`);
  }

  const updatedOrder = {
    ...(purchaseOrdersData as any[])[orderIndex],
    ...data,
    updated_at: new Date().toISOString(),
  };

  (purchaseOrdersData as any[])[orderIndex] = updatedOrder;

  // Enriquecer con información de proyecto, proveedor y gasto vinculado
  const project = projectsMap.get(updatedOrder.project_id);
  const supplier = updatedOrder.supplier_id ? suppliersMap.get(updatedOrder.supplier_id) : null;
  
  // Buscar gasto vinculado
  const expense = (expensesData as any[]).find(
    (exp) => exp.purchase_order_id === id
  );

  const expenseAmount = expense ? expense.amount_total : null;
  const deviation = expenseAmount !== null ? expenseAmount - updatedOrder.estimated_amount : null;

  return {
    ...updatedOrder,
    project_name: project?.name || "Proyecto no encontrado",
    supplier_name: supplier
      ? supplier.commercial_name || supplier.fiscal_name
      : null,
    expense_id: expense?.id || null,
    expense_amount: expenseAmount,
    deviation: deviation,
  };
}

/**
 * Cancelar un pedido de compra
 * 
 * @param id - ID del pedido
 * @returns Promise con el pedido cancelado
 */
export async function cancelPurchaseOrder(
  id: string
): Promise<PurchaseOrderData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const order = await fetchPurchaseOrderById(id);
  if (!order) {
    throw new Error(`Pedido de compra con ID ${id} no encontrado`);
  }

  if (order.status === "cancelled") {
    return order; // Ya está cancelado
  }

  if (order.status === "fulfilled") {
    throw new Error("No se puede cancelar un pedido que ya está cumplido (tiene gasto vinculado)");
  }

  // Actualizar estado a cancelled
  return updatePurchaseOrder(id, { status: "cancelled" });
}

/**
 * Vincular un gasto a un pedido de compra
 * 
 * @param purchaseOrderId - ID del pedido de compra
 * @param expenseId - ID del gasto
 * @returns Promise con el pedido actualizado
 */
export async function linkExpenseToPurchaseOrder(
  purchaseOrderId: string,
  expenseId: string
): Promise<PurchaseOrderData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const order = await fetchPurchaseOrderById(purchaseOrderId);
  if (!order) {
    throw new Error(`Pedido de compra con ID ${purchaseOrderId} no encontrado`);
  }

  if (order.status === "fulfilled") {
    throw new Error("Este pedido ya tiene un gasto vinculado");
  }

  if (order.status === "cancelled") {
    throw new Error("No se puede vincular un gasto a un pedido cancelado");
  }

  // Buscar el gasto
  const expense = (expensesData as any[]).find((exp) => exp.id === expenseId);
  if (!expense) {
    throw new Error(`Gasto con ID ${expenseId} no encontrado`);
  }

  // Verificar que el gasto pertenece al mismo proyecto
  if (expense.project_id !== order.project_id) {
    throw new Error("El gasto debe pertenecer al mismo proyecto que el pedido");
  }

  // Verificar que el gasto no tiene ya un pedido vinculado
  if (expense.purchase_order_id) {
    throw new Error("Este gasto ya está vinculado a otro pedido de compra");
  }

  // Vincular el gasto al pedido (en producción esto sería una actualización en BD)
  (expensesData as any[]).forEach((exp) => {
    if (exp.id === expenseId) {
      exp.purchase_order_id = purchaseOrderId;
    }
  });

  // Actualizar el estado del pedido a fulfilled
  return updatePurchaseOrder(purchaseOrderId, { status: "fulfilled" });
}

