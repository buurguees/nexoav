# Especificación: Módulo de Albaranes (Logística)

## 1. Objetivo

El módulo de Albaranes gestiona el movimiento físico de material sin impacto contable inmediato. Permite desvincular el flujo logístico del flujo financiero para gestionar alquileres, proyectos de larga duración y control de stock físico.

## 2. Conceptos Clave

### 2.1. Desvinculación Flujo Físico vs. Financiero

- **Flujo Físico (Logística)**: Movimiento de material (albaranes)
  - No tiene impacto contable inmediato
  - Afecta el stock físico (`stock_warehouse`, `stock_rented`)
  - Permite gestionar alquileres sin facturar inmediatamente

- **Flujo Financiero (Ventas)**: Documentos de venta (presupuestos, proformas, facturas)
  - Tiene impacto contable
  - Se factura al cliente
  - Puede estar desvinculado del movimiento físico

### 2.2. Tipos de Movimiento

- **`outbound` (Salida/Entrega)**: Material sale del almacén hacia un proyecto
  - Disminuye `stock_warehouse`
  - Aumenta `stock_rented` (calculado)

- **`inbound` (Retorno/Devolución)**: Material vuelve del proyecto al almacén
  - Aumenta `stock_warehouse`
  - Disminuye `stock_rented` (se elimina del cálculo)

## 3. Estructura de Datos

### 3.1. Tabla `delivery_notes` (Cabecera)

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | UUID | Identificador único | UUID |
| `document_number` | TEXT | Número de albarán (único) | `"ALB-25001"` |
| `project_id` | UUID | **Proyecto asociado (OBLIGATORIO)** | UUID → `projects.id` |
| `client_id` | UUID | Cliente asociado (opcional) | UUID → `clients.id` |
| `type` | ENUM | Tipo de movimiento | `outbound`, `inbound` |
| `status` | ENUM | Estado del albarán | `draft`, `confirmed`, `cancelled` |
| `date_issued` | DATE | Fecha efectiva del movimiento | `2025-01-15` |
| `notes` | TEXT | Observaciones logísticas | Notas |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

### 3.2. Tabla `delivery_note_lines` (Líneas)

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | UUID | Identificador único | UUID |
| `delivery_note_id` | UUID | Albarán padre | UUID → `delivery_notes.id` |
| `item_id` | UUID | Producto físico del inventario | UUID → `inventory_items.id` |
| `quantity` | NUMERIC(10,2) | Cantidad movida | `5.00` |
| `description` | TEXT | Descripción | `"Pantalla LED 2x2"` |
| `serial_number` | TEXT | Número de serie (opcional) | `"LED-2025-001"` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |

### 3.3. Numeración Automática

- **Formato**: `ALB-{YY}{NNNNN}`
- **Ejemplo**: `ALB-25001`, `ALB-25002`
- **Lógica**: Secuencial por año, único por tipo

## 4. Flujos de Trabajo

### 4.1. Flujo: Alquiler de Material (Proyecto de Larga Duración)

```
1. Cliente acepta Presupuesto con alquiler a 18 meses
2. Se crea Proyecto asociado
3. Se crea Albarán de Salida (outbound):
   - Estado: draft
   - Seleccionar ítems del inventario
   - Asociar al proyecto
4. Al confirmar el albarán:
   - Estado: confirmed
   - inventory_items.stock_warehouse disminuye
   - inventory_items.stock_rented aumenta (calculado)
5. Al finalizar el proyecto (18 meses después):
   - Se crea Albarán de Entrada (inbound):
     - Estado: draft
     - Seleccionar ítems que vuelven
     - Asociar al mismo proyecto
   - Al confirmar:
     - inventory_items.stock_warehouse aumenta
     - inventory_items.stock_rented disminuye
```

### 4.2. Flujo: Evento de Corta Duración

```
1. Se crea Proyecto para evento de 3 días
2. Se crea Albarán de Salida (outbound) con material necesario
3. Al confirmar: stock_warehouse disminuye, stock_rented aumenta
4. Al finalizar el evento (3 días después):
   - Se crea Albarán de Entrada (inbound) con el mismo material
   - Al confirmar: stock_warehouse aumenta, stock_rented disminuye
```

## 5. Impacto en Stock

### 5.1. Cálculo de `stock_rented`

Se calcula automáticamente desde albaranes confirmados:

```sql
-- Pseudocódigo
stock_rented = SUM(
  SELECT quantity 
  FROM delivery_note_lines 
  WHERE delivery_note_id IN (
    SELECT id 
    FROM delivery_notes 
    WHERE type = 'outbound' 
      AND status = 'confirmed'
      AND NOT EXISTS (
        -- No tiene albarán de retorno correspondiente
        SELECT 1 
        FROM delivery_notes dn2 
        WHERE dn2.type = 'inbound' 
          AND dn2.project_id = delivery_notes.project_id
          AND dn2.status = 'confirmed'
      )
  )
)
```

### 5.2. Cálculo de `stock_committed`

Se calcula desde presupuestos aceptados sin albarán de salida:

```sql
-- Pseudocódigo
stock_committed = SUM(
  SELECT quantity 
  FROM sales_document_lines 
  WHERE document_id IN (
    SELECT id 
    FROM sales_documents 
    WHERE type = 'presupuesto' 
      AND status = 'aceptado'
      AND NOT EXISTS (
        -- No tiene albarán de salida
        SELECT 1 
        FROM delivery_notes 
        WHERE project_id = sales_documents.project_id
          AND type = 'outbound'
          AND status = 'confirmed'
      )
  )
  AND item_id IN (
    SELECT id 
    FROM inventory_items 
    WHERE is_stockable = true
  )
)
```

## 6. Interfaz de Usuario

### 6.1. Listado de Albaranes

**Ruta**: `/ventas/albaranes`

**Columnas**:
- Número de Albarán (`document_number`)
- Proyecto (nombre del proyecto)
- Cliente (nombre del cliente)
- Tipo (Salida/Entrada)
- Estado (Borrador/Confirmado/Cancelado)
- Fecha (`date_issued`)
- Cantidad de ítems (contador de líneas)
- Acciones (Ver, Editar, Confirmar, Cancelar)

**Filtros**:
- Por proyecto
- Por cliente
- Por tipo (outbound/inbound)
- Por estado
- Por rango de fechas

### 6.2. Formulario de Nuevo Albarán

**Campos**:
- **Proyecto** (OBLIGATORIO): Dropdown con proyectos activos
- **Cliente**: Se autocompleta desde el proyecto seleccionado (opcional, editable)
- **Tipo**: Radio buttons (Salida/Entrada)
- **Fecha**: Date picker (por defecto: hoy)
- **Observaciones**: Textarea
- **Líneas**:
  - Tabla con ítems del inventario (`is_stockable = true`)
  - Botón "Añadir ítem"
  - Campos por línea:
    - Ítem (dropdown con productos stockables)
    - Cantidad (numeric input)
    - Descripción (autocompletada desde el ítem, editable)
    - Número de serie (opcional)

**Validaciones**:
- Proyecto es obligatorio
- Al menos una línea es obligatoria
- Para albaranes de salida (`outbound`): Verificar que `stock_warehouse >= quantity` para cada ítem
- Para albaranes de entrada (`inbound`): Verificar que el ítem existe en albaranes de salida del mismo proyecto

### 6.3. Vista de Detalle de Albarán

**Información mostrada**:
- Cabecera del albarán (número, proyecto, cliente, tipo, estado, fecha)
- Lista de líneas (ítems, cantidades, descripciones)
- Botones de acción según estado:
  - `draft`: Confirmar, Cancelar, Editar
  - `confirmed`: Ver PDF, Crear albarán de retorno (si es outbound)
  - `cancelled`: Solo lectura

## 7. Integración con Proyectos

### 7.1. Pestaña "Logística" en Detalle de Proyecto

En el detalle de un proyecto (`/proyectos/{id}`), añadir pestaña "Logística" que muestre:

- **Albaranes del Proyecto**:
  - Lista de albaranes (salidas y entradas) asociados al proyecto
  - Filtros por tipo y estado
  - Botón "Nuevo Albarán" (pre-rellenado con el proyecto)

- **Stock en Uso**:
  - Lista de ítems actualmente en el proyecto (`stock_rented` calculado)
  - Cantidad de cada ítem
  - Botón "Crear Albarán de Retorno" para devolver material

### 7.2. Pestaña "Económico" en Detalle de Proyecto

En el detalle de un proyecto, añadir pestaña "Económico" que muestre:

- **Previsión vs. Real**:
  - Previsión: Suma de `purchase_orders.estimated_amount` del proyecto
  - Real: Suma de `expenses.amount_total` del proyecto
  - Desvío: Diferencia entre real y previsión
  - Gráfico comparativo

- **Gastos del Proyecto**:
  - Lista de gastos (`expenses`) asociados
  - Vinculación con pedidos de compra (si aplica)

## 8. Reglas de Negocio

### 8.1. Confirmación de Albarán

Al confirmar un albarán (`status = 'confirmed'`):

1. **Validaciones**:
   - Para `outbound`: Verificar que `stock_warehouse >= quantity` para cada línea
   - Para `inbound`: Verificar que existe albarán de salida correspondiente

2. **Actualizaciones automáticas**:
   - Para `outbound`:
     - `inventory_items.stock_warehouse -= quantity` (por cada línea)
     - `inventory_items.stock_rented` se recalcula automáticamente
   - Para `inbound`:
     - `inventory_items.stock_warehouse += quantity` (por cada línea)
     - `inventory_items.stock_rented` se recalcula automáticamente

3. **Notificaciones**:
   - Si `stock_warehouse < stock_min` después de la salida, mostrar alerta

### 8.2. Cancelación de Albarán

Al cancelar un albarán (`status = 'cancelled'`):

- Si estaba `confirmed`, revertir los cambios en stock:
  - Para `outbound`: Aumentar `stock_warehouse`, disminuir `stock_rented`
  - Para `inbound`: Disminuir `stock_warehouse`, aumentar `stock_rented`

### 8.3. Restricciones

- **No se puede eliminar** un albarán confirmado (solo cancelar)
- **No se puede modificar** las líneas de un albarán confirmado
- **Un albarán de entrada** debe corresponder a un albarán de salida del mismo proyecto

## 9. Reportes y Análisis

### 9.1. Reporte de Stock

- Stock disponible (`stock_warehouse`)
- Stock en uso (`stock_rented`)
- Stock comprometido (`stock_committed`)
- Stock total disponible para nuevos proyectos: `stock_warehouse - stock_committed`

### 9.2. Reporte de Movimientos

- Albaranes por proyecto
- Albaranes por cliente
- Albaranes por período
- Material más movido

## 10. Consideraciones Técnicas

### 10.1. Triggers de Base de Datos

- **Actualización de `stock_warehouse`**: Trigger que actualiza automáticamente al confirmar/cancelar albaranes
- **Cálculo de `stock_rented`**: Función que recalcula desde albaranes confirmados sin retorno
- **Cálculo de `stock_committed`**: Función que recalcula desde presupuestos aceptados sin albarán

### 10.2. Validaciones en Backend

- Verificar que `item_id` apunta a un `inventory_item` con `is_stockable = true`
- Verificar disponibilidad de stock antes de confirmar albarán de salida
- Verificar correspondencia de albaranes de entrada con salidas

---

**Última actualización**: 2025-01-21  
**Versión**: 1.0

