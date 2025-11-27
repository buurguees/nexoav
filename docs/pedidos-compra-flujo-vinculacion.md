# Flujo de Vinculación: Pedido de Compra → Factura de Proveedor

## Objetivo

Este documento describe el flujo crítico de vinculación entre **Pedidos de Compra** (previsión) y **Gastos/Facturas de Proveedor** (real), que permite:

1. ✅ **Corroborar el proyecto** correcto
2. ✅ **Verificar precios comentados en el presupuesto** del proveedor
3. ✅ **Detectar desvíos automáticamente** (previsión vs. real)
4. ✅ **Trazabilidad completa**: Presupuesto → Pedido → Factura

## Flujo Completo

### Paso 1: Crear Pedido de Compra

**Cuándo**: Cuando recibes una cotización de un proveedor para un proyecto.

**Datos a ingresar**:
- **Proyecto** (OBLIGATORIO): Seleccionar el proyecto al que pertenece
- **Proveedor** (Recomendado): Seleccionar el proveedor que envió la cotización
- **Descripción**: Ej: "Servicio Técnico Sonido Evento X"
- **Importe Previsto**: El precio que el proveedor cotizó (ej: 500€)

**Resultado**:
- Se crea el pedido con número automático: `PO-25001`
- Estado: `pending`
- Se muestra en el Dashboard del Proyecto como "Previsto: 500€"

### Paso 2: Subir Factura del Proveedor

**Cuándo**: Cuando recibes la factura real del proveedor.

**Datos a ingresar en el formulario de Gasto**:
- **Proveedor** (OBLIGATORIO): El mismo proveedor que envió la cotización
- **Proyecto** (OBLIGATORIO): El mismo proyecto del pedido
- **Pedido de Compra** (RECOMENDADO): Seleccionar `PO-25001` del dropdown
  - El dropdown muestra solo pedidos del mismo proyecto
  - Solo muestra pedidos en estado `pending`
  - Formato: "PO-25001 - Servicio Técnico Sonido (500€)"
- **Descripción**: Descripción de la factura
- **Importe Total**: El importe real de la factura (ej: 550€)
- **Archivo**: Subir la factura (PDF, imagen, etc.)

**Validaciones automáticas**:
- ✅ El gasto pertenece al mismo proyecto que el pedido
- ✅ El pedido está en estado `pending`
- ✅ El gasto no tiene ya otro `purchase_order_id`
- ⚠️ El proveedor coincide (validación opcional pero recomendada)

**Al guardar**:
1. Se vincula: `expenses.purchase_order_id` = ID del pedido `PO-25001`
2. El pedido cambia automáticamente a estado `fulfilled`
3. Se calcula el desvío: `550€ - 500€ = +50€`
4. Se muestra mensaje: "Gasto vinculado al pedido PO-25001. Desvío: +50€"

### Paso 3: Verificación en Dashboard del Proyecto

**En la pestaña "Económico" del proyecto**:
- **Previsto**: Suma de pedidos `pending` (500€)
- **Real**: Suma de gastos del proyecto (550€)
- **Desvío**: +50€ (+10%)

**En el listado de Pedidos**:
- El pedido `PO-25001` muestra:
  - Estado: `fulfilled` (verde)
  - Previsto: 500€
  - Real: 550€
  - Desvío: +50€ (en rojo, indicando sobrecoste)

## Beneficios de la Vinculación

### 1. Corroborar Proyecto Correcto

Al vincular un gasto a un pedido, el sistema valida automáticamente que:
- El gasto pertenece al mismo proyecto que el pedido
- Esto evita errores de imputación de costes

### 2. Verificar Precios del Presupuesto

Al vincular, puedes comparar:
- **Previsión** (pedido): 500€ (precio comentado en el presupuesto)
- **Real** (gasto): 550€ (precio de la factura real)
- **Desvío**: +50€

Esto permite detectar si el proveedor ha cambiado los precios respecto a lo cotizado.

### 3. Detección Automática de Desvíos

El sistema calcula automáticamente:
- Desvío absoluto: `real - previsión`
- Desvío porcentual: `(desvío / previsión) * 100`

Se muestra en:
- Dashboard del proyecto
- Listado de pedidos
- Detalle del pedido
- Pestaña "Económico" del proyecto

### 4. Trazabilidad Completa

La vinculación permite seguir el flujo completo:
```
Presupuesto del Proveedor (500€)
    ↓
Pedido de Compra (PO-25001, 500€, pending)
    ↓
Factura del Proveedor (550€)
    ↓
Gasto vinculado (expenses.purchase_order_id = PO-25001)
    ↓
Pedido cumplido (PO-25001, fulfilled, desvío: +50€)
```

## Casos Especiales

### Caso 1: Factura sin Pedido de Compra Previo

**Situación**: Recibes una factura de un proveedor pero no creaste un pedido de compra antes.

**Solución**: 
- Puedes crear el gasto sin vincular a un pedido (`purchase_order_id = null`)
- El gasto se contabiliza normalmente
- No hay comparación de previsión vs. real

### Caso 2: Pedido Cancelado

**Situación**: Creaste un pedido pero el proveedor canceló el servicio.

**Solución**:
- Cancelar el pedido: `status = 'cancelled'`
- El pedido NO se cuenta en "Previsto" del proyecto
- No se puede vincular un gasto a un pedido cancelado

### Caso 3: Factura con Importe Menor

**Situación**: La factura real es menor que la previsión (ej: 450€ vs. 500€).

**Solución**:
- Se vincula normalmente
- El desvío es negativo: -50€ (en verde, indicando ahorro)
- Se muestra: "Desvío: -50€ (-10%)"

## Implementación Técnica

### Base de Datos

```sql
-- Tabla purchase_orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id),
    supplier_id UUID REFERENCES suppliers(id),
    document_number TEXT NOT NULL UNIQUE, -- PO-25001
    description TEXT NOT NULL,
    estimated_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    ...
);

-- Tabla expenses (modificada)
ALTER TABLE expenses ADD COLUMN purchase_order_id UUID REFERENCES purchase_orders(id);
```

### Validaciones en el Backend

```typescript
// Al vincular un gasto a un pedido
function linkExpenseToPurchaseOrder(expenseId: string, purchaseOrderId: string) {
  // 1. Validar que el gasto existe
  const expense = await getExpense(expenseId);
  
  // 2. Validar que el pedido existe
  const order = await getPurchaseOrder(purchaseOrderId);
  
  // 3. Validar mismo proyecto
  if (expense.project_id !== order.project_id) {
    throw new Error("El gasto y el pedido deben pertenecer al mismo proyecto");
  }
  
  // 4. Validar estado del pedido
  if (order.status !== 'pending') {
    throw new Error("Solo se pueden vincular gastos a pedidos pendientes");
  }
  
  // 5. Validar que el gasto no tiene ya un pedido
  if (expense.purchase_order_id) {
    throw new Error("Este gasto ya está vinculado a otro pedido");
  }
  
  // 6. Vincular
  await updateExpense(expenseId, { purchase_order_id: purchaseOrderId });
  await updatePurchaseOrder(purchaseOrderId, { status: 'fulfilled' });
  
  // 7. Calcular desvío
  const deviation = expense.amount_total - order.estimated_amount;
  
  return { expense, order, deviation };
}
```

## UI/UX Recomendaciones

### Formulario de Gasto

1. **Campo "Pedido de Compra"**:
   - Dropdown con búsqueda
   - Muestra: "PO-25001 - Descripción (500€)"
   - Solo pedidos del mismo proyecto
   - Solo pedidos en estado `pending`
   - Opción: "Sin pedido de compra"

2. **Comparación visual**:
   - Al seleccionar un pedido, mostrar:
     ```
     ┌─────────────────────────────┐
     │ Previsión: 500,00 €        │
     │ Real: [campo importe]      │
     │ Desvío: [calculado]        │
     └─────────────────────────────┘
     ```

3. **Mensaje de confirmación**:
   - Al guardar: "Gasto vinculado al pedido PO-25001. Desvío: +50€"

### Listado de Pedidos

- Columna "Desvío" con color:
  - Verde: Desvío negativo (ahorro)
  - Rojo: Desvío positivo (sobrecoste)
  - Gris: Sin gasto vinculado

### Dashboard del Proyecto

- Resumen económico con:
  - Previsto (suma de pedidos `pending`)
  - Real (suma de gastos)
  - Desvío total (calculado)

