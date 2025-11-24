# Módulo: Facturación

Este módulo contiene los documentos de venta (presupuestos, proformas, facturas, rectificativas) y sus líneas.

## Tablas

### `sales_documents.json`
Documentos de venta principales.

**Campos clave:**
- `type`: Tipo de documento (`presupuesto`, `proforma`, `factura`, `rectificativa`)
- `document_number`: Número de documento (ej: `"E250061"`, `"FV-2025-001"`)
- `client_id`: Cliente asociado (UUID)
- `client_snapshot`: **Datos fiscales congelados al emitir** (JSONB) - CRÍTICO para inmutabilidad fiscal
- `project_id`: Proyecto asociado (opcional, UUID)
- `totals_data`: Totales del documento estructurado (JSONB)
- `status`: Estado del documento
- `date_issued`: Fecha de emisión
- `date_due`: Fecha de vencimiento

**Nota importante:** `client_snapshot` se rellena automáticamente al emitir el documento para garantizar inmutabilidad fiscal.

### `sales_document_lines.json`
Líneas individuales de cada documento de venta (las filas del PDF). **Organizadas en dos apartados: Productos y Servicios.**

**Campos clave:**
- `document_id`: Documento padre (UUID)
- `item_id`: Item del inventario (opcional, UUID)
- `concept`: **Concepto** - Nombre principal del item (ej: "Jornada Técnico (General)")
- `description`: **Descripción detallada** - Texto adicional para el PDF (ej: "Jornada de 8h técnico general de instalación")
- `quantity`: Cantidad (unidades)
- `unit_price`: **Precio unitario real aplicado** (no depende del item)
- `discount_percent`: Descuento (%) - Opcional, se aplica antes del subtotal
- `subtotal`: **Subtotal** - `(quantity × unit_price) × (1 - discount_percent/100)`
- `tax_percent`: IVA (%) - Porcentaje de IVA aplicado
- `total_line`: **Total de la línea** - `subtotal × (1 + tax_percent/100)`
- `grouping_tag`: **Etiqueta para agrupar** - `"Productos"` o `"Servicios"` (se determina automáticamente según el `type` del item)
- `line_order`: Orden de la línea en el documento (permite agrupar: Productos primero, Servicios después)

**Estructura del Presupuesto:**

Cada presupuesto se organiza en dos apartados:
1. **Productos** (`grouping_tag = "Productos"`): Items físicos del inventario
2. **Servicios** (`grouping_tag = "Servicios"`): Servicios del inventario

**Ejemplo de línea:**
```json
{
  "concept": "Jornada Técnico (General)",
  "description": "Jornada de 8h técnico general de instalación",
  "quantity": 12,
  "unit_price": 250.00,
  "discount_percent": 0.00,
  "subtotal": 3000.00,
  "tax_percent": 21.00,
  "total_line": 3630.00,
  "grouping_tag": "Servicios"
}
```

**Notas importantes:**
- `unit_price` siempre guarda el precio real aplicado, independientemente del `base_price` del item
- Esto permite tarifas especiales por cliente sin afectar documentos históricos
- `grouping_tag` se determina automáticamente según el `type` del `inventory_item`:
  - `type = "producto"` → `grouping_tag = "Productos"`
  - `type = "servicio"` → `grouping_tag = "Servicios"`
- `description` puede estar vacío si no se necesita texto adicional
- `discount_percent` es opcional (puede ser 0.00)

