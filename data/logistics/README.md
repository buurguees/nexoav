# Módulo: Logística (Albaranes)

Este módulo contiene los datos de albaranes (delivery notes) y sus líneas, que gestionan el movimiento físico de material sin impacto contable inmediato.

## Tablas

### `delivery_notes.json`
Cabecera de albaranes (entregas y devoluciones de material).

**Campos clave:**
- `id`: Identificador único (UUID)
- `document_number`: Número de albarán (ej: `"ALB-25001"`)
- `project_id`: **Proyecto asociado (OBLIGATORIO)** - Todo movimiento pertenece a un proyecto
- `client_id`: Cliente asociado (opcional, para referencia)
- `type`: Tipo de movimiento (`outbound` = salida/entrega, `inbound` = retorno/devolución)
- `status`: Estado del albarán (`draft`, `confirmed`, `cancelled`)
- `date_issued`: Fecha efectiva del movimiento
- `notes`: Observaciones logísticas
- `created_at`: Fecha de creación del registro (TIMESTAMPTZ)
- `updated_at`: Fecha de última actualización (TIMESTAMPTZ)

**Nota importante:** Al confirmar un albarán (`status = 'confirmed'`):
- Para `outbound`: Disminuye `stock_warehouse`, aumenta `stock_rented` (calculado)
- Para `inbound`: Aumenta `stock_warehouse`, disminuye `stock_rented` (se elimina del cálculo)

### `delivery_note_lines.json`
Líneas individuales de cada albarán (ítems físicos movidos).

**Campos clave:**
- `id`: Identificador único (UUID)
- `delivery_note_id`: Albarán padre (UUID)
- `item_id`: Producto físico del inventario (UUID → `inventory_items.id`, debe tener `is_stockable = true`)
- `quantity`: Cantidad movida (NUMERIC)
- `description`: Descripción (copiado del item o personalizado)
- `serial_number`: Número de serie (opcional, para trazabilidad futura)
- `created_at`: Fecha de creación (TIMESTAMPTZ)

**Nota importante:** `item_id` debe apuntar a un `inventory_item` con `is_stockable = true`.

## Numeración

- **Formato**: `ALB-{YY}{NNNNN}`
- **Ejemplo**: `ALB-25001`, `ALB-25002`
- **Lógica**: Secuencial por año, único

## Relaciones

- `delivery_notes.project_id` → `projects.id` (OBLIGATORIO)
- `delivery_notes.client_id` → `clients.id` (opcional)
- `delivery_note_lines.delivery_note_id` → `delivery_notes.id`
- `delivery_note_lines.item_id` → `inventory_items.id` (solo productos con `is_stockable = true`)

