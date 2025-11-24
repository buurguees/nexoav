# Módulo: Inventario

Este módulo gestiona productos y servicios que la empresa ofrece. Corresponde a `/inventario`. Aplica lógica contable y de tipos para los presupuestos.

## Tablas

### `inventory_categories.json`
Categorías de inventario con información contable.

**Campos clave:**
- `name`: Nombre de la categoría (ej: "Mano de Obra", "Iluminación", "Cableado")
- `accounting_account_sales`: Cuenta contable de ventas (ej: "705" - Servicios)
- `accounting_account_purchase`: Cuenta contable de compras (ej: "600" - Compras)
- `description`: Descripción de la categoría

**Notas:**
- Las cuentas contables siguen el Plan General Contable español
- Se usa para agrupar items en informes contables

### `inventory_items.json`
Items del inventario (productos y servicios).

**Campos clave:**
- `internal_code`: SKU/Código interno
- `name`: Nombre del item
- `description`: Descripción larga para el PDF
- `type`: Tipo de item (`producto`, `servicio`)
- `subtype`: Subtipo para agrupar en PDF (`alquiler`, `venta`, `mano_de_obra`, `logistica`)
- `category_id`: Categoría asociada (UUID)
- `primary_supplier_id`: **Proveedor principal** (UUID → `suppliers.id`) - Permite ver rápidamente los precios de compra con cada proveedor
- `base_price`: Precio de venta sugerido (solo referencia)
- `cost_price`: Precio de coste (para calcular margen)
- `margin_percentage`: **Porcentaje de margen calculado automáticamente** - Permite mantener concordancia entre todos los productos
- `rental_price_12m`: **Precio de alquiler mensual a 12 meses** (solo para productos de alquiler) - Sin descuento
- `rental_price_18m`: **Precio de alquiler mensual a 18 meses** (solo para productos de alquiler) - Con 10% descuento aplicado
- `rental_price_daily`: **Precio de alquiler diario para eventos** (solo para productos de alquiler) - Calculado como `base_price / 28`
- `is_stockable`: Si es stockable (producto físico vs servicio)
- `stock_current`: Stock actual (solo si `is_stockable = true`) - Inicializado en 0 para productos nuevos
- `stock_min`: Stock mínimo (alertas)
- `unit`: Unidad de medida (`"unidad"`, `"hora"`, `"día"`)

**Tipos:**
- `producto`: Item físico que se puede almacenar
- `servicio`: Servicio intangible

**Subtipos (agrupación en PDFs):**
- `alquiler`: Items de alquiler
- `venta`: Items de venta
- `mano_de_obra`: Servicios de mano de obra
- `logistica`: Servicios logísticos

**Notas importantes:**
- `base_price` es solo una sugerencia; el precio real se guarda en `sales_document_lines.unit_price`
- `primary_supplier_id` vincula el producto con su proveedor principal, permitiendo ver rápidamente los precios de compra
  - Facilita la gestión de compras y comparación de precios entre proveedores
  - Permite filtrar productos por proveedor
- `is_stockable` diferencia rápidamente un cable (`true`) de una hora de técnico (`false`)
- `margin_percentage` se calcula automáticamente: `((base_price - cost_price) / cost_price) * 100`
  - Permite mantener concordancia de márgenes entre todos los productos
  - Facilita análisis de rentabilidad y comparación entre items
  - Para servicios sin `cost_price`, el margen será `null`
- `stock_current` se inicializa en 0 para todos los productos nuevos
- `rental_price_12m`, `rental_price_18m` y `rental_price_daily` se usan para diferentes tipos de alquiler:
  - **12 meses**: Precio sin descuento dividido entre 12 meses
  - **18 meses**: Precio con 10% descuento dividido entre 18 meses
  - **Eventos (diario)**: Precio base dividido entre 28 días
  - Ejemplo: Pantalla LED sin módulos (299.66€)
    - 12 meses: 299.66 / 12 = 24.97€/mes
    - 18 meses: (299.66 * 0.9) / 18 = 14.98€/mes
    - Evento diario: 299.66 / 28 = 10.70€/día
  - **Mantenimiento de Contratos** (Futuro):
    - Los proyectos con contratos de alquiler de 12 o 18 meses requerirán tareas de mantenimiento automáticas
    - Frecuencia: cada 3 meses desde la fecha de instalación
    - Las tareas se generarán automáticamente y aparecerán en el calendario como tareas obligatorias
    - Se vincularán al proyecto mediante `project_id` en la tabla `tasks`
- Los precios por tarifa se gestionan en `price_lists` y `price_list_items`

### `price_lists.json`
Tarifas de precios por año o por cliente.

**Campos clave:**
- `name`: Nombre de la tarifa (ej: "Tarifa 2025", "Tarifa 2026")
- `year`: Año de la tarifa (opcional, para tarifas anuales)
- `is_default`: Si es la tarifa por defecto
- `is_active`: Si la tarifa está activa
- `valid_from`: Fecha de inicio de validez
- `valid_until`: Fecha de fin de validez

### `price_list_items.json`
Precios de items por tarifa.

**Campos clave:**
- `price_list_id`: Tarifa asociada (UUID)
- `item_id`: Item del inventario (UUID)
- `price`: Precio en esta tarifa

**Notas:**
- Permite tener diferentes precios según el año o cliente
- Al crear un presupuesto, se puede seleccionar la tarifa a aplicar
- El precio de la tarifa se usa como sugerencia, pero el precio real se guarda en `sales_document_lines.unit_price`

