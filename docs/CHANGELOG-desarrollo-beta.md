# Changelog - Rama Desarrollo Beta

## [2025-01-21] - Transformación a Modelo Logístico (Compras y Ventas)

### 🎯 Cambio Estructural Principal

**Transformación de módulos "Gastos" y "Facturación" en "Compras" y "Ventas"**:
- Renombrado módulo "Facturación" → "Ventas" (`/facturacion` → `/ventas`)
- Renombrado módulo "Gastos" → "Compras" (`/gastos` → `/compras`)
- Desvinculación del flujo financiero del flujo físico (logístico)
- Permite gestión de alquileres, proyectos de larga duración y control de costes (previsión vs. real)

### ✨ Nuevas Funcionalidades

#### Módulo de Logística (Albaranes)
- **Nueva tabla `delivery_notes`**: Cabecera de albaranes para gestionar movimiento físico de material
  - Tipos: `outbound` (salida/entrega) e `inbound` (retorno/devolución)
  - Estados: `draft`, `confirmed`, `cancelled`
  - Numeración automática: `ALB-{YY}{NNNNN}` (ej: `ALB-25001`)
  - **OBLIGATORIO**: Todo movimiento pertenece a un proyecto (`project_id`)

- **Nueva tabla `delivery_note_lines`**: Líneas de albarán (ítems físicos movidos)
  - Vinculación con `inventory_items` (solo productos stockables)
  - Campo opcional `serial_number` para futura trazabilidad

- **Gestión de Stock para Alquileres**:
  - `stock_warehouse`: Cantidad física en almacén (se actualiza con albaranes)
  - `stock_rented`: Cantidad actualmente en proyectos (calculado desde albaranes confirmados sin retorno)
  - `stock_committed`: Cantidad reservada en presupuestos aceptados pero no entregados

- **Flujos de Trabajo**:
  - Alquiler de material (proyectos de larga duración): Salida → Uso → Retorno
  - Eventos de corta duración: Salida → Uso → Retorno (mismo día o días siguientes)

#### Módulo de Pedidos de Compra (Previsión de Costes)
- **Nueva tabla `purchase_orders`**: Pedidos de compra / Previsión de gasto
  - Permite registrar cotizaciones de proveedores antes de recibir la factura
  - Numeración automática: `PO-{YY}{NNNNN}` (ej: `PO-25001`)
  - Estados: `pending`, `fulfilled`, `cancelled`
  - **OBLIGATORIO**: Todo pedido pertenece a un proyecto (`project_id`)

- **Control de Costes (Previsión vs. Real)**:
  - Previsión: `purchase_orders.estimated_amount` (cotización del proveedor)
  - Real: `expenses.amount_total` (factura recibida)
  - Desvío: Diferencia entre real y previsión
  - Visualización en Dashboard del Proyecto: "Previsto: 500€" → "Real: 550€ (Desvío +50€)"

- **Vinculación de Gastos a Pedidos**:
  - Campo `purchase_order_id` añadido a tabla `expenses`
  - Cuando un gasto se vincula a un pedido, el estado del pedido cambia a `fulfilled`
  - Relación 1:1 entre pedido y gasto

### 🔧 Mejoras en Tablas Existentes

#### `sales_documents` (Ventas)
- **Añadido campo `related_document_id`**: Permite vincular una Factura a su Proforma o Presupuesto de origen
  - Facilita trazabilidad del flujo: Presupuesto → Proforma → Factura
  - Ejemplo: Una Factura puede tener `related_document_id` apuntando a su Proforma de origen

#### `expenses` (Compras)
- **Añadido campo `purchase_order_id`**: Vincula el gasto real con su previsión (pedido de compra)
  - Si esta columna tiene valor, el gasto es la "realización" de esa previsión
  - Permite comparar previsión vs. real
  - Cuando se vincula un gasto a un pedido, el estado del pedido cambia a `fulfilled`

#### `inventory_items` (Inventario)
- **Añadidos campos de stock para alquileres**:
  - `stock_warehouse`: Cantidad física en almacén (reemplaza `stock_current`)
  - `stock_rented`: Cantidad actualmente en proyectos (calculado desde albaranes)
  - `stock_committed`: Cantidad reservada en presupuestos aceptados pero no entregados
- **Eliminado campo `stock_current`**: Reemplazado por `stock_warehouse` para mayor claridad

### 📊 Estructura de Navegación Actualizada

#### Sidebar (`lib/config/sidebarNavigation.ts`)
- **"Facturación" → "Ventas"**:
  - Subsecciones: Presupuestos, Proformas, Facturas, Rectificativas, **Albaranes** (nuevo)
  - Rutas: `/ventas/*` (antes `/facturacion/*`)

- **"Gastos" → "Compras"**:
  - Subsecciones: **Proveedores** (movido desde `/proveedores`), **Pedidos** (nuevo), **Gastos** (antes "Tickets"), Categorías
  - Rutas: `/compras/*` (antes `/gastos/*`)

### 📝 Documentación Creada

- **`docs/albaranes-especificacion.md`**: Especificación completa del módulo de Albaranes
  - Flujos de trabajo (alquileres, eventos)
  - Impacto en stock
  - Interfaz de usuario
  - Integración con proyectos
  - Reglas de negocio

- **`docs/pedidos-compra-especificacion.md`**: Especificación completa del módulo de Pedidos de Compra
  - Control de costes (previsión vs. real)
  - Flujos de trabajo
  - Integración con proyectos
  - Reglas de negocio

- **`docs/base-de-datos.md`**: Actualizado con:
  - Nueva sección "Módulo: Logística (Albaranes)"
  - Nueva sección "Módulo: Pedidos de Compra" dentro de "Compras y Gastos"
  - Modificaciones en tablas existentes
  - Actualización de relaciones entre módulos

### 🎨 Mejoras de UI/UX Planificadas

#### Proyectos - Pestaña "Logística"
- Lista de albaranes del proyecto (salidas y entradas)
- Stock en uso (ítems actualmente en el proyecto)
- Botón "Nuevo Albarán" (pre-rellenado con el proyecto)
- Botón "Crear Albarán de Retorno" para devolver material

#### Proyectos - Pestaña "Económico"
- Resumen económico: Previsión vs. Real vs. Desvío
- Gráfico comparativo (barras o líneas)
- Lista de pedidos de compra del proyecto
- Lista de gastos del proyecto con vinculación a pedidos

### 🔄 Consideraciones de Implementación

#### Triggers de Base de Datos (Futuro)
- **Actualización de `stock_warehouse`**: Al confirmar/cancelar albaranes
- **Cálculo de `stock_rented`**: Desde albaranes confirmados sin retorno
- **Cálculo de `stock_committed`**: Desde presupuestos aceptados sin albarán
- **Actualización de estado de pedidos**: Al vincular gastos
- **Cálculo de previsiones**: Suma de pedidos `pending` por proyecto

#### Validaciones
- Albaranes de salida: Verificar que `stock_warehouse >= quantity`
- Albaranes de entrada: Verificar correspondencia con albaranes de salida del mismo proyecto
- Pedidos de compra: Verificar que `project_id` existe y está activo
- Vinculación de gastos: Verificar que pertenecen al mismo proyecto que el pedido

### 📋 Próximos Pasos

1. Implementar componentes UI para Albaranes (`/ventas/albaranes`)
2. Implementar componentes UI para Pedidos de Compra (`/compras/pedidos`)
3. Añadir pestañas "Logística" y "Económico" en detalle de proyectos
4. Implementar triggers de base de datos para cálculos automáticos
5. Crear datos mock para albaranes y pedidos de compra
6. Implementar funciones mock para nuevos módulos

---

## [2025-01-21] - Mejoras en Proveedores e Inventario

### ✨ Nuevas Funcionalidades

#### Proveedores
- **Código interno de proveedores**: Añadido campo `internal_code` con formato `PROV-0001`, `PROV-0002`, etc.
  - Generación automática secuencial al crear nuevos proveedores
  - Visible como primera columna en todos los listados

- **Nombre comercial y razón social**: Añadidos campos `fiscal_name` y `commercial_name` (opcional)
  - Visualización igual que en clientes: nombre comercial como principal, razón social como secundario
  - Compatibilidad con campo `name` existente (deprecated)

- **Columnas específicas por tipo de proveedor**:
  - **Técnicos**: Añadida columna "Ciudad" (`address.city`)
  - **Softwares**: Añadida columna "Nº Facturas" (facturas emitidas/pagadas)
  - **Externos**: Añadida columna "Nº Facturas" (facturas pagadas)
  - **Materiales**: Sin cambios adicionales

#### Inventario - Servicios
- **Nuevas columnas de análisis**:
  - **Unidades Vendidas**: Suma de cantidades vendidas desde `sales_document_lines`
  - **Facturado**: Total facturado del servicio desde `sales_document_lines`
  - **Coste Medio**: Promedio de costes desde `supplier_rates` vinculados
- **Eliminada columna**: "Alquiler 18m" (reemplazada por las nuevas columnas)

### 🔧 Mejoras Técnicas

#### Base de Datos (Documentación)
- Actualizada tabla `suppliers` en `docs/base-de-datos.md`:
  - Añadido `internal_code` (TEXT, único, indexado)
  - Añadido `fiscal_name` (TEXT, razón social fiscal)
  - Añadido `commercial_name` (TEXT, opcional)
  - Campo `name` mantenido para compatibilidad

#### Funciones Mock
- **`lib/mocks/supplierMocks.ts`**:
  - Cálculo automático de `invoices_count` (facturas emitidas/pagadas)
  - Cálculo automático de `invoices_paid_count` (facturas pagadas)
  - Cálculo automático de `total_orders` (total de pedidos/gastos)
  - Generación automática de `internal_code` en `createSupplier()`
  - Compatibilidad con datos existentes (`name` → `fiscal_name`)

- **`lib/mocks/inventoryMocks.ts`**:
  - Cálculo de `units_sold` desde `sales_document_lines`
  - Cálculo de `total_billing` desde `sales_document_lines`
  - Cálculo de `average_cost` desde `supplier_rates` (promedio de costes activos)
  - Solo cuenta documentos facturados (`status = 'cobrada'` o `'aceptada'`)

#### Componentes
- **`pages/proveedores/components/ProveedoresList.tsx`**:
  - Nueva columna "Código" (primera columna)
  - Columna "Nombre" actualizada para mostrar nombre comercial + razón social
  - Columnas específicas según tipo de proveedor
  - Grid columns optimizado para diferentes breakpoints
  - Columnas de dinero siempre al final (a la derecha)

- **`pages/inventario/components/ServiciosList.tsx`**:
  - Añadidas columnas "Unidades Vendidas", "Facturado" y "Coste"
  - Eliminada columna "Alquiler 18m"
  - Grid columns personalizado para 10 columnas
  - Alineación optimizada (izquierda para texto, centro/derecha para números)

### 📊 Datos Mock Actualizados

- **`data/expenses/suppliers.json`**:
  - Todos los proveedores tienen `internal_code` (PROV-0001 a PROV-0010)
  - Todos los proveedores tienen `fiscal_name` (desde `name` si no existía)
  - Añadidos nombres comerciales de ejemplo:
    - ADRICO → "ADRICO MULTIMEDIA SL"
    - OBRAMAT → "OBRAMAT (BRICOLAJE BRICOMAN, S.L.U)"
    - NAV SOLUTIONS → "NETWORK AUDIOVISUAL SOLUTIONS SL"
    - FLOWIT → "FLOWIT VISUAL SL"
    - Carlos Matos → "CARLOS DAVID MATOS VALDEZ"
    - SRYLED → "Shenzhen SRYLED Photoelectric Co., Ltd."

### 🎨 Mejoras de UI/UX

- **Consistencia visual**: Proveedores ahora tienen el mismo formato que Clientes
- **Información más útil**: Columnas de análisis en servicios para toma de decisiones
- **Responsive**: Grid columns optimizado para diferentes tamaños de pantalla
- **Alineación mejorada**: Texto a la izquierda, números centrados/derecha según contexto

### 📝 Notas de Implementación

- Los cálculos de unidades vendidas y facturación solo consideran documentos facturados
- El coste medio se calcula como promedio de todas las tarifas activas de proveedores vinculadas al servicio
- Si no hay tarifas de proveedor, se usa el `cost_price` del servicio directamente
- La generación de códigos internos es secuencial y automática

### 🔄 Compatibilidad

- Mantenida compatibilidad con datos existentes usando campo `name` como fallback
- Los proveedores sin `internal_code` lo reciben automáticamente al cargar
- Los servicios sin datos de ventas muestran 0 en las nuevas columnas

---

**Rama**: `desarrollo-beta`  
**Fecha**: 2025-01-21  
**Estado**: ✅ Funcional y probado

