# Changelog - Rama Desarrollo Beta

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

