# Módulo: Pedidos de Compra (Previsión de Costes)

Este módulo contiene los pedidos de compra (purchase orders), que permiten registrar cotizaciones de proveedores antes de recibir la factura para control de costes (previsión vs. real).

## Tablas

### `purchase_orders.json`
Pedidos de compra / Previsión de gasto.

**Campos clave:**
- `id`: Identificador único (UUID)
- `project_id`: **Proyecto asociado (OBLIGATORIO)** - Para imputación de costes
- `supplier_id`: Proveedor asociado (opcional, UUID → `suppliers.id`)
- `document_number`: Referencia interna de pedido (ej: `"PO-25001"`)
- `description`: Descripción del pedido
- `estimated_amount`: **Importe Cotizado (Previsión)** - Importe que el proveedor cotizó
- `status`: Estado del pedido (`pending`, `fulfilled`, `cancelled`)
- `created_at`: Fecha de creación (TIMESTAMPTZ)
- `updated_at`: Fecha de última actualización (TIMESTAMPTZ)

**Estados:**
- `pending`: Pedido pendiente (previsión activa)
- `fulfilled`: Pedido cumplido (se recibió la factura real vinculada)
- `cancelled`: Pedido cancelado (no se realizará)

**Nota importante:** 
- Cuando un gasto (`expense`) se vincula a un pedido mediante `expenses.purchase_order_id`, el estado del pedido cambia automáticamente a `fulfilled`
- Permite comparar previsión (`estimated_amount`) vs. real (`expenses.amount_total`)
- El desvío se calcula: `real - previsión`

## Numeración

- **Formato**: `PO-{YY}{NNNNN}`
- **Ejemplo**: `PO-25001`, `PO-25002`
- **Lógica**: Secuencial por año, único

## Relaciones

- `purchase_orders.project_id` → `projects.id` (OBLIGATORIO)
- `purchase_orders.supplier_id` → `suppliers.id` (opcional)
- `expenses.purchase_order_id` → `purchase_orders.id` (relación 1:1)

## Control de Costes

**Flujo:**
1. Se crea un `purchase_order` con el presupuesto que nos da el proveedor (ej: 500€)
2. En el Dashboard del Proyecto, se muestra: "Previsto: 500€"
3. Cuando llega la factura real, se sube a `expenses` y se vincula al `purchase_order` mediante `expenses.purchase_order_id`
4. Si la factura es de 550€, el Dashboard actualiza: "Real: 550€ (Desvío +50€)"

