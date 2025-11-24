# Módulo: Compras y Gastos

Este módulo gestiona proveedores, gastos y compras de la empresa.

## Tablas

### `suppliers.json`
Proveedores y suministradores de la empresa.

**Campos clave:**
- `name`: Nombre del proveedor
- `cif`: CIF/NIF del proveedor
- `category`: Categoría del proveedor (`tecnico_freelance`, `material`, `transporte`, `software`, `externo`)
- `address`: Dirección estructurada (JSONB)
- `contact_email`: Email de contacto
- `contact_phone`: Teléfono de contacto
- `payment_terms_days`: Días de pago
- `freelance_profile_id`: Si es técnico, perfil asociado (UUID)

**Categorías:**
- `tecnico_freelance`: Técnicos y freelances
- `material`: Proveedores de materiales
- `transporte`: Servicios de transporte
- `software`: Proveedores de software/SaaS
- `externo`: Otros proveedores externos

### `expenses.json`
Gastos y compras de la empresa.

**Campos clave:**
- `supplier_id`: Proveedor asociado (UUID)
- `project_id`: Proyecto asociado (para imputar coste, UUID)
- `category_id`: Categoría de gasto (opcional, UUID)
- `description`: Descripción del gasto
- `amount_base`: Importe base (sin IVA)
- `amount_tax`: Importe de IVA
- `amount_total`: Importe total
- `date_expense`: Fecha del gasto
- `status`: Estado del gasto (`pendiente_aprobacion`, `aprobado`, `pagado`)

### `expense_categories.json`
Categorías para organizar gastos.

**Campos clave:**
- `name`: Nombre de la categoría
- `description`: Descripción
- `color`: Color para visualización

### `supplier_rates.json`
Tarifas y costes de servicios contratados por proveedor. **Vinculado con servicios de venta** para cálculo automático de márgenes.

**Campos clave:**
- `supplier_id`: Proveedor asociado (UUID)
- `inventory_item_id`: **Servicio de venta vinculado** (UUID → `inventory_items.id`) - CRÍTICO para cálculo de márgenes
- `service_type`: Tipo de servicio (`jornada`, `hora_extra`, `media_jornada`, etc.)
- `cost_price`: Coste que se paga al proveedor (lo que nos cobra)
- `unit`: Unidad de medida (`día`, `hora`, `unidad`)
- `year`: Año de la tarifa (para evolución de precios)
- `is_active`: Si la tarifa está activa
- `notes`: Notas sobre la tarifa

**Uso y Beneficios:**
- **Cálculo automático de márgenes:** Precio de venta (de `inventory_items` o `price_lists`) - Coste del proveedor = Margen
- **Análisis de rentabilidad:** Permite calcular el beneficio medio por servicio
- **Control de costes:** Al asignar un técnico externo a un proyecto, se calcula automáticamente el `cost_agreed` estimado
- **Comparación real vs estimado:** Cuando llega la factura del proveedor en `expenses`, se compara con el estimado
- **Resumen mensual:** Permite generar informes de beneficios por servicio y por proveedor

**Ejemplo:**
- Servicio vendido: "Jornada Técnico General" a 280€ (Tarifa 2026)
- Coste proveedor: Carlos Matos a 200€
- **Margen:** 280€ - 200€ = 80€ por jornada

