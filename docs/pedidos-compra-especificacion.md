# Especificación: Módulo de Pedidos de Compra (Previsión de Costes)

## 1. Objetivo

El módulo de Pedidos de Compra permite registrar cotizaciones de proveedores antes de recibir la factura, desvinculando el flujo de previsión del flujo financiero. Esto permite controlar costes (previsión vs. real) y gestionar proyectos de larga duración con mejor visibilidad económica.

## 2. Conceptos Clave

### 2.1. Desvinculación Previsión vs. Real

- **Previsión (Pedido de Compra)**: Cotización del proveedor registrada antes de recibir la factura
  - No tiene impacto contable
  - Permite planificar costes del proyecto
  - Se muestra en el Dashboard del Proyecto como "Previsto"

- **Real (Gasto)**: Factura recibida del proveedor
  - Tiene impacto contable
  - Se vincula al pedido de compra mediante `expenses.purchase_order_id`
  - Se muestra en el Dashboard del Proyecto como "Real"

### 2.2. Control de Desvíos

Cuando un gasto se vincula a un pedido de compra:
- Se compara `purchase_orders.estimated_amount` (previsión) vs. `expenses.amount_total` (real)
- Se calcula el desvío: `real - previsión`
- Se muestra en el Dashboard del Proyecto: "Real: 550€ (Desvío +50€)"

## 3. Estructura de Datos

### 3.1. Tabla `purchase_orders` (Pedidos de Compra)

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | UUID | Identificador único | UUID |
| `project_id` | UUID | **Proyecto asociado (OBLIGATORIO)** | UUID → `projects.id` |
| `supplier_id` | UUID | Proveedor asociado (opcional) | UUID → `suppliers.id` |
| `document_number` | TEXT | Referencia interna de pedido | `"PO-25001"` |
| `description` | TEXT | Descripción del pedido | `"Servicio Técnico Sonido Evento X"` |
| `estimated_amount` | NUMERIC(10,2) | **Importe Cotizado (Previsión)** | `500.00` |
| `status` | ENUM | Estado del pedido | `pending`, `fulfilled`, `cancelled` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

### 3.2. Modificación en `expenses`

Añadir campo `purchase_order_id`:

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `purchase_order_id` | UUID | **Pedido de compra asociado** (si este gasto es la realización de una previsión) | UUID → `purchase_orders.id` |

### 3.3. Numeración Automática

- **Formato**: `PO-{YY}{NNNNN}`
- **Ejemplo**: `PO-25001`, `PO-25002`
- **Lógica**: Secuencial por año, único

## 4. Flujos de Trabajo

### 4.1. Flujo Principal: Pedido de Compra → Factura de Proveedor

**Este es el flujo crítico del módulo. Permite controlar previsión vs. real y verificar que los precios comentados en el presupuesto se cumplan.**

```
1. Se crea un Proyecto
2. Se solicita cotización a un Proveedor
3. El Proveedor envía cotización: 500€
4. Se crea Pedido de Compra:
   - project_id: Proyecto actual (OBLIGATORIO)
   - supplier_id: Proveedor (opcional, pero recomendado)
   - description: "Servicio Técnico Sonido Evento X"
   - estimated_amount: 500.00 (precio comentado en el presupuesto)
   - status: pending
   - document_number: PO-25001 (asignado automáticamente)
5. En el Dashboard del Proyecto se muestra:
   - "Previsto: 500€"
6. Llega la factura real del Proveedor: 550€
7. Se sube la factura a Gastos (expenses):
   - project_id: Mismo proyecto (OBLIGATORIO)
   - supplier_id: Mismo proveedor
   - amount_total: 550.00
   - purchase_order_id: ID del pedido creado (PO-25001) ← CRÍTICO
8. Validaciones automáticas:
   - ✅ El gasto pertenece al mismo proyecto que el pedido
   - ✅ El pedido está en estado 'pending'
   - ✅ El gasto no tiene ya otro purchase_order_id
9. Actualizaciones automáticas:
   - expenses.purchase_order_id = ID del pedido
   - purchase_orders.status = 'fulfilled'
   - Se calcula el desvío: 550€ - 500€ = +50€
10. En el Dashboard del Proyecto se actualiza:
   - "Real: 550€ (Desvío +50€)"
11. Beneficios de la vinculación:
   - ✅ Corroborar que el proyecto es correcto
   - ✅ Verificar que los precios comentados en el presupuesto se cumplen
   - ✅ Detectar desvíos automáticamente
   - ✅ Trazabilidad completa: Presupuesto → Pedido → Factura
```

### 4.2. Flujo: Creación de Gasto con Selección de Pedido

**Cuando se sube una factura de proveedor, el formulario debe permitir seleccionar el pedido de compra correspondiente:**

```
1. Usuario va a "Compras > Gastos > Nuevo Gasto"
2. Completa los datos básicos:
   - Proveedor (obligatorio)
   - Proyecto (obligatorio)
   - Descripción
   - Importe total
   - Archivo de factura
3. Campo "Pedido de Compra" (dropdown):
   - Muestra solo pedidos del mismo proyecto
   - Muestra solo pedidos en estado 'pending'
   - Muestra: "PO-25001 - Servicio Técnico Sonido (500€)"
4. Al seleccionar un pedido:
   - Se valida que el proyecto coincide
   - Se valida que el proveedor coincide (opcional, pero recomendado)
   - Se muestra comparación: "Previsto: 500€ vs. Real: 550€"
5. Al guardar:
   - Se vincula automáticamente: expenses.purchase_order_id = pedido seleccionado
   - El pedido cambia a estado 'fulfilled'
   - Se calcula y muestra el desvío
```

### 4.3. Flujo: Pedido Cancelado

```
1. Se crea Pedido de Compra con estimated_amount: 500€
2. El Proveedor informa que no puede realizar el servicio
3. Se cancela el Pedido:
   - status: cancelled
4. En el Dashboard del Proyecto:
   - El pedido cancelado NO se cuenta en "Previsto"
   - Se muestra como "Cancelado" en la lista de pedidos
```

## 5. Estados del Pedido

### 5.1. `pending` (Pendiente)

- Pedido creado, esperando factura del proveedor
- Se cuenta en "Previsto" del proyecto
- Puede ser cancelado o cumplido

### 5.2. `fulfilled` (Cumplido)

- Se recibió la factura real y se vinculó al pedido
- El gasto (`expense`) tiene `purchase_order_id` apuntando a este pedido
- Se cuenta en "Real" del proyecto
- No se puede cancelar (ya está facturado)

### 5.3. `cancelled` (Cancelado)

- Pedido cancelado (no se realizará)
- NO se cuenta en "Previsto" del proyecto
- No se puede cambiar a `fulfilled`

## 6. Interfaz de Usuario

### 6.1. Listado de Pedidos de Compra

**Ruta**: `/compras/pedidos`

**Columnas**:
- Número de Pedido (`document_number`)
- Proyecto (nombre del proyecto)
- Proveedor (nombre del proveedor)
- Descripción
- Importe Previsto (`estimated_amount`)
- Estado (Pendiente/Cumplido/Cancelado)
- Fecha de Creación
- Gasto Real (si está cumplido, mostrar `expenses.amount_total`)
- Desvío (si está cumplido, mostrar diferencia)
- Acciones (Ver, Editar, Cancelar, Vincular Gasto)

**Filtros**:
- Por proyecto
- Por proveedor
- Por estado
- Por rango de fechas

### 6.2. Formulario de Nuevo Pedido de Compra

**Campos**:
- **Proyecto** (OBLIGATORIO): Dropdown con proyectos activos
- **Proveedor**: Dropdown con proveedores activos (opcional, pero recomendado)
- **Descripción** (OBLIGATORIO): Textarea (ej: "Servicio Técnico Sonido Evento X")
- **Importe Previsto** (OBLIGATORIO): Numeric input (formato moneda €)
  - Este es el precio comentado en el presupuesto del proveedor
- **Fecha de Creación**: Auto (hoy)
- **Número de Pedido**: Auto-generado (formato: `PO-{YY}{NNNNN}`)

**Validaciones**:
- Proyecto es obligatorio
- Descripción es obligatoria
- Importe previsto debe ser > 0

**Nota importante**: El número de pedido (`document_number`) se asigna automáticamente al crear el pedido. Este número será necesario para vincular la factura del proveedor cuando llegue.

### 6.2.1. Formulario de Nuevo Gasto (Factura de Proveedor)

**Campos**:
- **Proveedor** (OBLIGATORIO): Dropdown con proveedores activos
- **Proyecto** (OBLIGATORIO): Dropdown con proyectos activos
- **Pedido de Compra** (OPCIONAL pero RECOMENDADO): Dropdown con pedidos del proyecto
  - Solo muestra pedidos del mismo proyecto
  - Solo muestra pedidos en estado 'pending'
  - Formato: "PO-25001 - Descripción (500€)"
  - Al seleccionar, muestra comparación: "Previsto: 500€ vs. Real: [campo importe]"
- **Descripción** (OBLIGATORIO): Textarea
- **Importe Base**: Numeric input (sin IVA)
- **IVA**: Numeric input o dropdown con tipos de IVA
- **Importe Total** (OBLIGATORIO): Numeric input (formato moneda €)
- **Fecha de Gasto**: Date picker (por defecto: hoy)
- **Archivo de Factura**: Upload de archivo (PDF, imagen, etc.)
- **Estado**: Dropdown (borrador, aprobado, pagado)

**Validaciones**:
- Proveedor es obligatorio
- Proyecto es obligatorio
- Si se selecciona un pedido de compra:
  - ✅ El pedido debe pertenecer al mismo proyecto
  - ✅ El pedido debe estar en estado 'pending'
  - ✅ El proveedor debe coincidir (validación opcional pero recomendada)
- Importe total debe ser > 0

**Comportamiento al guardar**:
- Si se seleccionó un pedido de compra:
  - Se actualiza `expenses.purchase_order_id` = ID del pedido
  - Se actualiza `purchase_orders.status` = 'fulfilled'
  - Se calcula el desvío: `importe_total - pedido.estimated_amount`
  - Se muestra mensaje: "Gasto vinculado al pedido PO-25001. Desvío: +50€"

### 6.3. Vista de Detalle de Pedido

**Información mostrada**:
- Cabecera del pedido (número, proyecto, proveedor, descripción, importe previsto, estado)
- **Gasto Vinculado** (si `status = 'fulfilled'`):
  - Información del gasto (`expenses`)
  - Importe real
  - Desvío calculado
  - Botón "Ver Gasto"
- Botones de acción según estado:
  - `pending`: Editar, Cancelar, Vincular Gasto
  - `fulfilled`: Ver Gasto, Ver Detalle
  - `cancelled`: Solo lectura

### 6.4. Vincular Gasto a Pedido

**Desde el detalle del Pedido**:
- Botón "Vincular Gasto"
- Modal con lista de gastos (`expenses`) del mismo proyecto que NO tienen `purchase_order_id`
- Al seleccionar un gasto:
  - Se actualiza `expenses.purchase_order_id` = ID del pedido
  - Se actualiza `purchase_orders.status` = `fulfilled`
  - Se muestra el desvío calculado

**Desde el formulario de creación/edición de Gasto**:
- Campo "Pedido de Compra" (dropdown) en el formulario
- Al seleccionar un pedido:
  - Se valida que el proyecto coincide
  - Se valida que el proveedor coincide (opcional)
  - Se muestra comparación: "Previsto: 500€ vs. Real: 550€"
  - Al guardar:
    - Se actualiza `expenses.purchase_order_id` = ID del pedido
    - Se actualiza `purchase_orders.status` = `fulfilled`
    - Se calcula y muestra el desvío

**Desde el detalle del Gasto (edición)**:
- Campo "Pedido de Compra" (dropdown) editable
- Muestra el pedido vinculado actual (si existe)
- Permite cambiar la vinculación (solo si el gasto no está pagado)
- Al cambiar:
  - Se desvincula el pedido anterior (si existe)
  - Se vincula el nuevo pedido
  - Se actualizan los estados correspondientes

## 7. Integración con Proyectos

### 7.1. Pestaña "Económico" en Detalle de Proyecto

En el detalle de un proyecto (`/proyectos/{id}`), añadir pestaña "Económico" que muestre:

- **Resumen Económico**:
  - **Previsión**: Suma de `purchase_orders.estimated_amount` donde `status = 'pending'`
  - **Real**: Suma de `expenses.amount_total` del proyecto
  - **Desvío Total**: Diferencia entre real y previsión
  - Gráfico comparativo (barras o líneas)

- **Lista de Pedidos**:
  - Todos los pedidos de compra del proyecto
  - Estado de cada pedido
  - Importe previsto vs. real (si está cumplido)
  - Botón "Nuevo Pedido" (pre-rellenado con el proyecto)

- **Lista de Gastos**:
  - Todos los gastos del proyecto
  - Vinculación con pedidos (si aplica)
  - Botón "Nuevo Gasto" (pre-rellenado con el proyecto)

### 7.2. Dashboard del Proyecto

En la vista principal del proyecto, mostrar resumen económico:

```
┌─────────────────────────────────────┐
│ Resumen Económico                   │
├─────────────────────────────────────┤
│ Previsto: 1,500.00 €               │
│ Real: 1,550.00 €                   │
│ Desvío: +50.00 € (+3.33%)          │
└─────────────────────────────────────┘
```

## 8. Reglas de Negocio

### 8.1. Vinculación de Gasto a Pedido

Al vincular un gasto a un pedido:

1. **Validaciones**:
   - El gasto debe pertenecer al mismo proyecto que el pedido
   - El pedido debe estar en estado `pending`
   - El gasto NO debe tener ya un `purchase_order_id`

2. **Actualizaciones automáticas**:
   - `expenses.purchase_order_id` = ID del pedido
   - `purchase_orders.status` = `fulfilled`
   - Se recalcula el resumen económico del proyecto

3. **Cálculo de desvío**:
   - `desvio = expenses.amount_total - purchase_orders.estimated_amount`
   - Se muestra en el detalle del pedido y en el dashboard del proyecto

### 8.2. Cancelación de Pedido

Al cancelar un pedido:

- Solo se puede cancelar si `status = 'pending'`
- Se actualiza `status = 'cancelled'`
- El pedido NO se cuenta en "Previsto" del proyecto
- No se puede cambiar a `fulfilled` después de cancelar

### 8.3. Restricciones

- **No se puede eliminar** un pedido cumplido (solo ver)
- **No se puede modificar** el `estimated_amount` de un pedido cumplido
- **Un gasto solo puede estar vinculado a un pedido** (relación 1:1)
- **Un pedido solo puede estar vinculado a un gasto** (relación 1:1)

## 9. Reportes y Análisis

### 9.1. Reporte de Desvíos

- Pedidos con mayor desvío (positivo y negativo)
- Promedio de desvíos por proveedor
- Desvíos por proyecto
- Tendencias de desvíos en el tiempo

### 9.2. Reporte de Previsiones

- Previsiones pendientes por proyecto
- Previsiones cumplidas vs. canceladas
- Tiempo promedio entre previsión y factura real

## 10. Consideraciones Técnicas

### 10.1. Triggers de Base de Datos

- **Actualización de estado**: Trigger que actualiza `purchase_orders.status` a `fulfilled` cuando se vincula un gasto
- **Cálculo de previsiones**: Función que suma `estimated_amount` de pedidos `pending` por proyecto
- **Cálculo de desvíos**: Función que calcula diferencia entre real y previsión

### 10.2. Validaciones en Backend

- Verificar que `project_id` existe y está activo
- Verificar que `supplier_id` existe (si se proporciona)
- Verificar que `estimated_amount > 0`
- Verificar unicidad de `document_number`

---

**Última actualización**: 2025-01-21  
**Versión**: 1.0

