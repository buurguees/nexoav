# 🚀 Plan de Acción: Desarrollo Completo de NEXOAV

## Objetivo

Completar todas las funcionalidades críticas de la plataforma NEXOAV para poder iniciar pruebas reales en producción. Este plan excluye funcionalidades no prioritarias como charts, mapas y calendarios (excepto tareas).

---

## 📊 Estado Actual vs. Objetivo

### ✅ Implementado

- **Estructura base**: Routing, navegación, componentes responsive
- **Listados**: Todos los módulos tienen listados funcionales
- **Formularios de creación**:
  - ✅ Clientes (`NewClientModal`)
  - ✅ Proyectos (`NewProjectModal`)
- **Datos mock**: Todos los módulos tienen datos y funciones mock
- **Componentes base**: DataList, Header, Sidebar, etc.

### ❌ Pendiente (Crítico)

- **Formularios de creación/edición** para el resto de módulos
- **Vistas de detalle** para todas las entidades
- **Exportación PDF** de documentos
- **Configuración de empresa** (formularios)
- **Conversiones** entre documentos (presupuesto→proforma→factura)
- **Gestión de líneas** en documentos (presupuestos, facturas, albaranes)
- **Validaciones y reglas de negocio** completas

---

## 🎯 Fases de Desarrollo

### FASE 1: Formularios de Creación y Edición (CRUD Completo)

**Prioridad**: 🔴 CRÍTICA  
**Objetivo**: Permitir crear y editar todas las entidades principales

#### 1.1. Módulo: Proveedores

**Tareas**:
- [ ] **NewSupplierModal.tsx** - Modal de creación de proveedor
  - Campos: fiscal_name, commercial_name, cif, category, address, contact_email, contact_phone, payment_terms_days, notes
  - Validaciones: CIF único, categoría obligatoria
  - Generación automática de `internal_code` (PROV-0001)
- [ ] **EditSupplierModal.tsx** - Modal de edición
  - Pre-cargar datos del proveedor
  - Validaciones similares a creación
- [ ] **SupplierDetail.tsx** - Vista de detalle
  - Información completa del proveedor
  - Pestañas: General, Tarifas (técnicos), Productos (materiales), Gastos
  - Acciones: Editar, Eliminar, Ver gastos

**Archivos a crear**:
- `pages/proveedores/components/NewSupplierModal.tsx`
- `pages/proveedores/components/EditSupplierModal.tsx`
- `pages/proveedores/components/SupplierDetail.tsx`

**Funciones mock a actualizar**:
- `lib/mocks/supplierMocks.ts`: Ya tiene `createSupplier`, añadir `updateSupplier`, `deleteSupplier`

---

#### 1.2. Módulo: Presupuestos

**Tareas**:
- [ ] **NewPresupuestoModal.tsx** - Modal de creación de presupuesto
  - Paso 1: Seleccionar Cliente (obligatorio)
  - Paso 2: Seleccionar Proyecto (opcional, filtrado por cliente)
  - Paso 3: Añadir líneas (productos/servicios)
    - Búsqueda de items del inventario
    - Separación visual: "Productos" y "Servicios"
    - Campos por línea: item, quantity, unit_price, discount_percent, tax_percent
    - Cálculo automático: subtotal, total_line
  - Paso 4: Totales y configuración
    - Cálculo automático de base imponible, IVA por tipo, total
    - Separación de IVA en resumen (21%, 10%, 4%, etc.)
    - Notas internas y públicas
  - Generación automática de número: `E{YY}{NNNNN}`
  - Creación de `client_snapshot` al guardar
- [ ] **EditPresupuestoModal.tsx** - Modal de edición
  - Solo si `status = 'borrador'`
  - Pre-cargar datos y líneas
  - Misma estructura que creación
- [ ] **PresupuestoDetail.tsx** - Vista de detalle
  - Información completa del presupuesto
  - Lista de líneas (productos y servicios separados)
  - Resumen de totales con desglose de IVA
  - Acciones según estado:
    - `borrador`: Editar, Eliminar, Enviar
    - `enviado`: Convertir a Proforma, Rechazar
    - `aceptado`: Convertir a Proforma/Factura
    - `rechazado`: Solo lectura
  - Botón "Exportar PDF"
  - Historial de conversiones (si tiene `related_document_id`)

**Archivos a crear**:
- `pages/facturacion/presupuestos/components/NewPresupuestoModal.tsx`
- `pages/facturacion/presupuestos/components/EditPresupuestoModal.tsx`
- `pages/facturacion/presupuestos/components/PresupuestoDetail.tsx`
- `pages/facturacion/presupuestos/components/PresupuestoLinesEditor.tsx` (componente reutilizable para líneas)

**Funciones mock a crear/actualizar**:
- `lib/mocks/salesDocumentsMocks.ts`: Añadir `createSalesDocument`, `updateSalesDocument`, `deleteSalesDocument`
- `lib/mocks/salesDocumentLinesMocks.ts` (nuevo): CRUD de líneas

**Dependencias**:
- Necesita `fetchInventoryItems()` para búsqueda de productos/servicios
- Necesita `fetchClients()` para selección de cliente
- Necesita `fetchProjects(clientId?)` para selección de proyecto

---

#### 1.3. Módulo: Proformas

**Tareas**:
- [ ] **NewProformaModal.tsx** - Modal de creación (similar a presupuesto)
  - Misma estructura que presupuesto
  - Numeración: `FP{YY}{NNNNN}`
- [ ] **ConvertPresupuestoToProforma.tsx** - Función de conversión
  - Botón en detalle de presupuesto (si `status = 'aceptado'`)
  - Copiar datos del presupuesto
  - Cambiar `type` a 'proforma'
  - Cambiar `document_number` a formato proforma
  - Mantener `related_document_id` apuntando al presupuesto
  - Copiar todas las líneas
- [ ] **EditProformaModal.tsx** - Modal de edición
  - Solo si `status = 'borrador'` o `pending_payment`
- [ ] **ProformaDetail.tsx** - Vista de detalle
  - Similar a PresupuestoDetail
  - Acciones: Convertir a Factura, Editar (si borrador)

**Archivos a crear**:
- `pages/facturacion/proformas/components/NewProformaModal.tsx`
- `pages/facturacion/proformas/components/EditProformaModal.tsx`
- `pages/facturacion/proformas/components/ProformaDetail.tsx`
- `pages/facturacion/components/ConvertDocumentModal.tsx` (reutilizable)

---

#### 1.4. Módulo: Facturas

**Tareas**:
- [ ] **NewFacturaModal.tsx** - Modal de creación
  - Misma estructura que presupuesto
  - Numeración: `F-{YY}{NNNNN}`
  - Campo adicional: `date_due` (fecha de vencimiento)
- [ ] **ConvertToFactura.tsx** - Función de conversión
  - Desde presupuesto o proforma
  - Copiar datos y líneas
  - Cambiar `type` a 'factura'
  - Cambiar `document_number` a formato factura
  - Mantener `related_document_id`
- [ ] **EditFacturaModal.tsx** - Modal de edición
  - Solo si `status = 'borrador'`
  - Restricción: No editar si está `cobrada`
- [ ] **FacturaDetail.tsx** - Vista de detalle
  - Información completa
  - Acciones: Marcar como Cobrada, Editar (si borrador), Exportar PDF
  - Botón "Crear Rectificativa" (si está cobrada/aceptada)

**Archivos a crear**:
- `pages/facturacion/facturas/components/NewFacturaModal.tsx`
- `pages/facturacion/facturas/components/EditFacturaModal.tsx`
- `pages/facturacion/facturas/components/FacturaDetail.tsx`

---

#### 1.5. Módulo: Rectificativas

**Tareas**:
- [ ] **NewRectificativaModal.tsx** - Modal de creación
  - **CRÍTICO**: Solo se puede crear desde una factura
  - Campo obligatorio: `rectifies_document_id` (factura)
  - Pre-cargar datos de la factura
  - Permitir modificar líneas (añadir negativas)
  - Numeración: `RT-{YY}{NNNNN}`
- [ ] **RectificativaDetail.tsx** - Vista de detalle
  - Mostrar factura original
  - Mostrar diferencias

**Archivos a crear**:
- `pages/facturacion/rectificativas/components/NewRectificativaModal.tsx`
- `pages/facturacion/rectificativas/components/RectificativaDetail.tsx`

**Validación crítica**:
- `rectifies_document_id` debe apuntar a un documento con `type = 'factura'`

---

#### 1.6. Módulo: Albaranes

**Tareas**:
- [ ] **NewAlbaranModal.tsx** - Modal de creación
  - Campo obligatorio: `project_id` (dropdown)
  - Campo opcional: `client_id` (autocompletado desde proyecto)
  - Tipo: Radio buttons (`outbound` / `inbound`)
  - Fecha: Date picker (default: hoy)
  - Observaciones: Textarea
  - Líneas: Tabla con items del inventario (`is_stockable = true`)
    - Búsqueda de productos
    - Campos: item, quantity, description, serial_number (opcional)
    - Validación: Para `outbound`, verificar `stock_warehouse >= quantity`
  - Numeración automática: `ALB-{YY}{NNNNN}`
- [ ] **EditAlbaranModal.tsx** - Modal de edición
  - Solo si `status = 'draft'`
- [ ] **AlbaranDetail.tsx** - Vista de detalle
  - Información completa
  - Lista de líneas
  - Acciones según estado:
    - `draft`: Editar, Confirmar, Eliminar
    - `confirmed`: Cancelar (revertir stock), Crear Retorno (si outbound)
    - `cancelled`: Solo lectura
  - Botón "Crear Albarán de Retorno" (si `type = 'outbound'` y `status = 'confirmed'`)

**Archivos a crear**:
- `pages/facturacion/albaranes/components/NewAlbaranModal.tsx`
- `pages/facturacion/albaranes/components/EditAlbaranModal.tsx`
- `pages/facturacion/albaranes/components/AlbaranDetail.tsx`
- `pages/facturacion/albaranes/components/AlbaranLinesEditor.tsx`

**Funciones mock a actualizar**:
- `lib/mocks/deliveryNotesMocks.ts`: Ya tiene funciones básicas, añadir validaciones de stock

---

#### 1.7. Módulo: Pedidos de Compra

**Tareas**:
- [ ] **NewPedidoModal.tsx** - Modal de creación
  - Campo obligatorio: `project_id` (dropdown)
  - Campo opcional: `supplier_id` (dropdown)
  - Descripción: Textarea (obligatorio)
  - Importe Previsto: Numeric input (obligatorio, formato moneda €)
  - Numeración automática: `PO-{YY}{NNNNN}`
- [ ] **EditPedidoModal.tsx** - Modal de edición
  - Solo si `status = 'pending'`
  - No permitir editar `estimated_amount` si está `fulfilled`
- [ ] **PedidoDetail.tsx** - Vista de detalle
  - Información completa
  - Si está `fulfilled`: Mostrar gasto vinculado, importe real, desvío
  - Acciones:
    - `pending`: Editar, Cancelar, Vincular Gasto
    - `fulfilled`: Ver Gasto, Ver Detalle
    - `cancelled`: Solo lectura
  - Botón "Vincular Gasto" (modal con lista de gastos del mismo proyecto sin `purchase_order_id`)

**Archivos a crear**:
- `pages/gastos/pedidos/components/NewPedidoModal.tsx`
- `pages/gastos/pedidos/components/EditPedidoModal.tsx`
- `pages/gastos/pedidos/components/PedidoDetail.tsx`
- `pages/gastos/pedidos/components/LinkExpenseModal.tsx`

---

#### 1.8. Módulo: Gastos

**Tareas**:
- [ ] **NewGastoModal.tsx** - Modal de creación
  - Proveedor: Dropdown (obligatorio)
  - Proyecto: Dropdown (obligatorio)
  - **Pedido de Compra**: Dropdown (opcional pero recomendado)
    - Solo muestra pedidos del mismo proyecto en estado `pending`
    - Formato: "PO-25001 - Descripción (500€)"
    - Al seleccionar, mostrar comparación: "Previsto: 500€ vs. Real: [campo]"
  - Categoría: Dropdown (opcional)
  - Descripción: Textarea (obligatorio)
  - Importe Base: Numeric input
  - IVA: Numeric input o dropdown con tipos
  - Importe Total: Numeric input (obligatorio)
  - Fecha de Gasto: Date picker (default: hoy)
  - Archivo de Factura: Upload (PDF, imagen)
  - Estado: Dropdown (borrador, aprobado, pagado)
  - Notas: Textarea
- [ ] **EditGastoModal.tsx** - Modal de edición
  - Pre-cargar datos
  - Permitir cambiar `purchase_order_id` (si no está pagado)
- [ ] **GastoDetail.tsx** - Vista de detalle
  - Información completa
  - Si tiene `purchase_order_id`: Mostrar pedido, previsión, desvío
  - Acciones: Editar, Eliminar, Cambiar Estado, Ver Archivo

**Archivos a crear**:
- `pages/gastos/tickets/components/NewGastoModal.tsx` (o `pages/gastos/gastos/components/`)
- `pages/gastos/tickets/components/EditGastoModal.tsx`
- `pages/gastos/tickets/components/GastoDetail.tsx`

**Funciones mock a crear**:
- `lib/mocks/expenseMocks.ts` (nuevo): CRUD de gastos

---

#### 1.9. Módulo: Inventario

**Tareas**:
- [ ] **NewProductoModal.tsx** - Modal de creación de producto
  - Campos: internal_code, name, description, type='producto', subtype, category_id, primary_supplier_id, base_price, cost_price, is_stockable=true, stock_warehouse, stock_min, unit
  - Validaciones: Código único, categoría obligatoria
- [ ] **NewServicioModal.tsx** - Modal de creación de servicio
  - Similar a producto pero `is_stockable=false`, sin campos de stock
- [ ] **EditProductoModal.tsx** / **EditServicioModal.tsx** - Modales de edición
- [ ] **ProductoDetail.tsx** / **ServicioDetail.tsx** - Vistas de detalle
  - Información completa
  - Métricas: units_sold, total_billing, average_cost
  - Historial de ventas
  - Acciones: Editar, Eliminar

**Archivos a crear**:
- `pages/inventario/productos/components/NewProductoModal.tsx`
- `pages/inventario/productos/components/EditProductoModal.tsx`
- `pages/inventario/productos/components/ProductoDetail.tsx`
- `pages/inventario/servicios/components/NewServicioModal.tsx`
- `pages/inventario/servicios/components/EditServicioModal.tsx`
- `pages/inventario/servicios/components/ServicioDetail.tsx`

---

#### 1.10. Módulo: Tareas

**Tareas**:
- [ ] **NewTaskModal.tsx** - Modal de creación de tarea
  - Campos: title, description, project_id, due_date, status, category_id, assigned_to
- [ ] **EditTaskModal.tsx** - Modal de edición
- [ ] **TaskDetail.tsx** - Vista de detalle
  - Información completa
  - Historial de cambios
  - Acciones: Editar, Eliminar, Cambiar Estado

**Archivos a crear**:
- `pages/proyectos/components/NewTaskModal.tsx`
- `pages/proyectos/components/EditTaskModal.tsx`
- `pages/proyectos/components/TaskDetail.tsx`

---

### FASE 2: Exportación PDF

**Prioridad**: 🔴 CRÍTICA  
**Objetivo**: Generar PDFs de documentos de venta

#### 2.1. Generación de PDFs

**Tareas**:
- [ ] **Instalar librería de PDF**: `react-pdf` o `jsPDF` o `pdfkit`
- [ ] **PDFTemplate.tsx** - Componente base de plantilla
  - Header con logo y datos de empresa
  - Datos del cliente (desde `client_snapshot`)
  - Líneas del documento (separadas por `grouping_tag`: "Productos" y "Servicios")
  - Resumen de totales con desglose de IVA
  - Footer con datos de empresa
- [ ] **generatePresupuestoPDF.ts** - Función de generación
- [ ] **generateProformaPDF.ts** - Función de generación
- [ ] **generateFacturaPDF.ts** - Función de generación
- [ ] **generateRectificativaPDF.ts** - Función de generación
- [ ] **Botones "Exportar PDF"** en todas las vistas de detalle

**Archivos a crear**:
- `lib/pdf/templates/PDFTemplate.tsx`
- `lib/pdf/generators/generatePresupuestoPDF.ts`
- `lib/pdf/generators/generateProformaPDF.ts`
- `lib/pdf/generators/generateFacturaPDF.ts`
- `lib/pdf/generators/generateRectificativaPDF.ts`
- `lib/pdf/utils/pdfUtils.ts`

**Dependencias**:
- Necesita `company_settings` para datos de empresa
- Necesita `client_snapshot` del documento
- Necesita `sales_document_lines` con `grouping_tag`

---

### FASE 3: Configuración de Empresa

**Prioridad**: 🟡 ALTA  
**Objetivo**: Permitir configurar datos de empresa

#### 3.1. Datos Fiscales

**Tareas**:
- [ ] **DatosFiscalesForm.tsx** - Formulario de datos fiscales
  - Campos: fiscal_name, trade_name, cif, address_fiscal, address_warehouse, phone, email_contact, default_vat, default_currency, logo_url
  - Validaciones: CIF válido, email válido
  - Upload de logo
  - Guardar en `company_settings.json`

**Archivos a crear**:
- `pages/empresa/datos-fiscales/components/DatosFiscalesForm.tsx`

**Funciones mock a crear**:
- `lib/mocks/companyMocks.ts` (nuevo): CRUD de configuración de empresa

---

#### 3.2. Cuentas Bancarias

**Tareas**:
- [ ] **NewBankAccountModal.tsx** - Modal de creación
  - Campos: bank_name, account_number, iban, swift, is_default
- [ ] **EditBankAccountModal.tsx** - Modal de edición
- [ ] **BankAccountList.tsx** - Listado de cuentas
  - Marcar cuenta por defecto
  - Acciones: Editar, Eliminar

**Archivos a crear**:
- `pages/tesoreria/cuentas-bancarias/components/NewBankAccountModal.tsx`
- `pages/tesoreria/cuentas-bancarias/components/EditBankAccountModal.tsx`
- `pages/tesoreria/cuentas-bancarias/components/BankAccountList.tsx`

---

#### 3.3. Plantillas de Documentos

**Tareas**:
- [ ] **TemplateList.tsx** - Listado de plantillas
- [ ] **NewTemplateModal.tsx** - Modal de creación
- [ ] **EditTemplateModal.tsx** - Modal de edición
- [ ] **TemplatePreview.tsx** - Vista previa de plantilla

**Archivos a crear**:
- `pages/empresa/plantillas/components/TemplateList.tsx`
- `pages/empresa/plantillas/components/NewTemplateModal.tsx`
- `pages/empresa/plantillas/components/EditTemplateModal.tsx`
- `pages/empresa/plantillas/components/TemplatePreview.tsx`

---

### FASE 4: Funcionalidades Avanzadas

**Prioridad**: 🟡 ALTA  
**Objetivo**: Completar funcionalidades de negocio

#### 4.1. Gestión de Contactos de Clientes

**Tareas**:
- [ ] **ClientContactsList.tsx** - Listado de contactos en detalle de cliente
- [ ] **NewClientContactModal.tsx** - Modal de creación
  - Campos: name, role, email, phone, is_billing_contact, is_shipping_contact
- [ ] **EditClientContactModal.tsx** - Modal de edición
- [ ] Integrar en `ClientDetail.tsx`

**Archivos a crear**:
- `pages/clientes/components/ClientContactsList.tsx`
- `pages/clientes/components/NewClientContactModal.tsx`
- `pages/clientes/components/EditClientContactModal.tsx`

**Funciones mock a crear**:
- `lib/mocks/clientContactMocks.ts` (nuevo): CRUD de contactos

---

#### 4.2. Gestión de Tarifas de Proveedores (Técnicos)

**Tareas**:
- [ ] **SupplierRatesList.tsx** - Listado de tarifas en detalle de proveedor técnico
- [ ] **NewSupplierRateModal.tsx** - Modal de creación
  - Campos: inventory_item_id (servicio), cost_price, valid_from, valid_to, is_active
- [ ] **EditSupplierRateModal.tsx** - Modal de edición
- [ ] Integrar en `SupplierDetail.tsx` (pestaña "Tarifas")

**Archivos a crear**:
- `pages/proveedores/components/SupplierRatesList.tsx`
- `pages/proveedores/components/NewSupplierRateModal.tsx`
- `pages/proveedores/components/EditSupplierRateModal.tsx`

---

#### 4.3. Gestión de Productos de Proveedores (Materiales)

**Tareas**:
- [ ] **SupplierProductsList.tsx** - Listado de productos en detalle de proveedor de materiales
- [ ] **LinkProductToSupplier.tsx** - Vincular producto existente
- [ ] Integrar en `SupplierDetail.tsx` (pestaña "Productos")

**Archivos a crear**:
- `pages/proveedores/components/SupplierProductsList.tsx`
- `pages/proveedores/components/LinkProductToSupplier.tsx`

---

#### 4.4. Asignación de Técnicos a Proyectos

**Tareas**:
- [ ] **ProjectStaffingList.tsx** - Listado de técnicos asignados en detalle de proyecto
- [ ] **NewStaffingModal.tsx** - Modal de asignación
  - Campos: supplier_id (técnico), role, start_date, end_date, estimated_hours, estimated_cost
- [ ] **EditStaffingModal.tsx** - Modal de edición
- [ ] Integrar en `ProyectoDetail.tsx` (pestaña "Equipo")

**Archivos a crear**:
- `pages/proyectos/components/ProjectStaffingList.tsx`
- `pages/proyectos/components/NewStaffingModal.tsx`
- `pages/proyectos/components/EditStaffingModal.tsx`

**Funciones mock a crear**:
- `lib/mocks/projectStaffingMocks.ts` (nuevo): CRUD de asignaciones

---

#### 4.5. Vista de Detalle de Proyecto Completa

**Tareas**:
- [ ] **ProyectoDetail.tsx** - Vista de detalle completa
  - Pestañas:
    - **General**: Información del proyecto, cliente, ubicación, fechas
    - **Equipo**: Asignación de técnicos (ProjectStaffingList)
    - **Tareas**: Lista de tareas del proyecto
    - **Logística**: Albaranes del proyecto (ProyectoLogisticaTab)
    - **Económico**: Pedidos, gastos, desvíos (ProyectoEconomicoTab)
    - **Ventas**: Presupuestos, proformas, facturas del proyecto
  - Acciones: Editar, Eliminar, Duplicar

**Archivos a crear**:
- `pages/proyectos/components/ProyectoDetail.tsx`
- `pages/proyectos/components/ProyectoTabs.tsx` (sistema de pestañas)

---

### FASE 5: Validaciones y Reglas de Negocio

**Prioridad**: 🔴 CRÍTICA  
**Objetivo**: Implementar todas las validaciones y reglas de negocio

#### 5.1. Validaciones de Formularios

**Tareas**:
- [ ] Validación de CIF/NIF en clientes y proveedores
- [ ] Validación de códigos postales (formato y provincia)
- [ ] Validación de emails
- [ ] Validación de números de documento únicos
- [ ] Validación de stock disponible en albaranes
- [ ] Validación de fechas (end_date >= start_date)
- [ ] Validación de importes (>= 0)

**Archivos a crear**:
- `lib/validations/cifValidator.ts`
- `lib/validations/zipCodeValidator.ts`
- `lib/validations/emailValidator.ts`
- `lib/validations/documentNumberValidator.ts`

---

#### 5.2. Reglas de Negocio

**Tareas**:
- [ ] **Restricción de edición**: No editar documentos si están en ciertos estados
  - Presupuestos: Solo editar si `status = 'borrador'`
  - Facturas: Solo editar si `status = 'borrador'`, no si `status = 'cobrada'`
  - Albaranes: Solo editar si `status = 'draft'`
- [ ] **Restricción de eliminación**: No eliminar si tiene relaciones
  - Cliente: No eliminar si tiene proyectos o facturas
  - Proyecto: No eliminar si tiene facturas o gastos
  - Producto: No eliminar si está en facturas o albaranes
- [ ] **Restricción de conversión**: 
  - Rectificativa: Solo desde factura
  - Proforma: Solo desde presupuesto aceptado
  - Factura: Solo desde presupuesto/proforma
- [ ] **Cálculos automáticos**:
  - Totales en documentos de venta
  - Desvíos en pedidos de compra
  - Stock en inventario
  - Total_billing en clientes, proyectos, proveedores

**Archivos a crear**:
- `lib/business-rules/documentRules.ts`
- `lib/business-rules/deleteRules.ts`
- `lib/business-rules/conversionRules.ts`

---

### FASE 6: Mejoras de UX y Funcionalidades Adicionales

**Prioridad**: 🟢 MEDIA  
**Objetivo**: Mejorar la experiencia de usuario

#### 6.1. Búsqueda y Filtros Avanzados

**Tareas**:
- [ ] Búsqueda global mejorada
- [ ] Filtros por rango de fechas en todos los listados
- [ ] Filtros por estado en documentos
- [ ] Filtros por proyecto en gastos y pedidos
- [ ] Guardar filtros favoritos

---

#### 6.2. Acciones Masivas

**Tareas**:
- [ ] Selección múltiple en listados
- [ ] Acciones masivas: Eliminar, Cambiar estado, Exportar
- [ ] Checkbox "Seleccionar todos"

---

#### 6.3. Notificaciones y Alertas

**Tareas**:
- [ ] Sistema de notificaciones
  - Presupuestos pendientes de respuesta
  - Facturas próximas a vencer
  - Stock bajo
  - Desvíos importantes en pedidos
- [ ] Alertas en tiempo real

**Archivos a crear**:
- `components/notifications/NotificationCenter.tsx`
- `lib/notifications/notificationService.ts`

---

#### 6.4. Historial y Auditoría

**Tareas**:
- [ ] Historial de cambios en entidades
- [ ] Log de acciones del usuario
- [ ] Vista de historial en detalles

---

### FASE 7: Optimizaciones y Preparación para Producción

**Prioridad**: 🟡 ALTA  
**Objetivo**: Optimizar y preparar para pruebas reales

#### 7.1. Optimizaciones de Rendimiento

**Tareas**:
- [ ] Lazy loading de componentes pesados
- [ ] Memoización de cálculos costosos
- [ ] Virtualización de listas largas
- [ ] Optimización de re-renders

---

#### 7.2. Manejo de Errores

**Tareas**:
- [ ] Manejo de errores en formularios
- [ ] Mensajes de error claros
- [ ] Validación en tiempo real
- [ ] Toast notifications para errores

---

#### 7.3. Testing Básico

**Tareas**:
- [ ] Testing manual de flujos críticos
- [ ] Validación de datos mock
- [ ] Verificación de cálculos
- [ ] Testing responsive

---

#### 7.4. Documentación de Usuario

**Tareas**:
- [ ] Guía de usuario básica
- [ ] Tooltips en campos importantes
- [ ] Help text en formularios
- [ ] FAQ de funcionalidades

---

## 📋 Resumen de Archivos a Crear

### Formularios de Creación/Edición (30+ archivos)

**Proveedores**:
- `pages/proveedores/components/NewSupplierModal.tsx`
- `pages/proveedores/components/EditSupplierModal.tsx`
- `pages/proveedores/components/SupplierDetail.tsx`

**Ventas**:
- `pages/facturacion/presupuestos/components/NewPresupuestoModal.tsx`
- `pages/facturacion/presupuestos/components/EditPresupuestoModal.tsx`
- `pages/facturacion/presupuestos/components/PresupuestoDetail.tsx`
- `pages/facturacion/presupuestos/components/PresupuestoLinesEditor.tsx`
- `pages/facturacion/proformas/components/NewProformaModal.tsx`
- `pages/facturacion/proformas/components/EditProformaModal.tsx`
- `pages/facturacion/proformas/components/ProformaDetail.tsx`
- `pages/facturacion/facturas/components/NewFacturaModal.tsx`
- `pages/facturacion/facturas/components/EditFacturaModal.tsx`
- `pages/facturacion/facturas/components/FacturaDetail.tsx`
- `pages/facturacion/rectificativas/components/NewRectificativaModal.tsx`
- `pages/facturacion/rectificativas/components/RectificativaDetail.tsx`
- `pages/facturacion/albaranes/components/NewAlbaranModal.tsx`
- `pages/facturacion/albaranes/components/EditAlbaranModal.tsx`
- `pages/facturacion/albaranes/components/AlbaranDetail.tsx`
- `pages/facturacion/albaranes/components/AlbaranLinesEditor.tsx`
- `pages/facturacion/components/ConvertDocumentModal.tsx`

**Compras**:
- `pages/gastos/pedidos/components/NewPedidoModal.tsx`
- `pages/gastos/pedidos/components/EditPedidoModal.tsx`
- `pages/gastos/pedidos/components/PedidoDetail.tsx`
- `pages/gastos/pedidos/components/LinkExpenseModal.tsx`
- `pages/gastos/tickets/components/NewGastoModal.tsx`
- `pages/gastos/tickets/components/EditGastoModal.tsx`
- `pages/gastos/tickets/components/GastoDetail.tsx`

**Inventario**:
- `pages/inventario/productos/components/NewProductoModal.tsx`
- `pages/inventario/productos/components/EditProductoModal.tsx`
- `pages/inventario/productos/components/ProductoDetail.tsx`
- `pages/inventario/servicios/components/NewServicioModal.tsx`
- `pages/inventario/servicios/components/EditServicioModal.tsx`
- `pages/inventario/servicios/components/ServicioDetail.tsx`

**Proyectos**:
- `pages/proyectos/components/NewTaskModal.tsx`
- `pages/proyectos/components/EditTaskModal.tsx`
- `pages/proyectos/components/TaskDetail.tsx`
- `pages/proyectos/components/ProyectoDetail.tsx`
- `pages/proyectos/components/ProyectoTabs.tsx`
- `pages/proyectos/components/ProjectStaffingList.tsx`
- `pages/proyectos/components/NewStaffingModal.tsx`
- `pages/proyectos/components/EditStaffingModal.tsx`

**Clientes**:
- `pages/clientes/components/ClientDetail.tsx`
- `pages/clientes/components/ClientContactsList.tsx`
- `pages/clientes/components/NewClientContactModal.tsx`
- `pages/clientes/components/EditClientContactModal.tsx`

**Empresa**:
- `pages/empresa/datos-fiscales/components/DatosFiscalesForm.tsx`
- `pages/empresa/plantillas/components/TemplateList.tsx`
- `pages/empresa/plantillas/components/NewTemplateModal.tsx`
- `pages/empresa/plantillas/components/EditTemplateModal.tsx`

**Tesorería**:
- `pages/tesoreria/cuentas-bancarias/components/NewBankAccountModal.tsx`
- `pages/tesoreria/cuentas-bancarias/components/EditBankAccountModal.tsx`
- `pages/tesoreria/cuentas-bancarias/components/BankAccountList.tsx`

### Funciones Mock (10+ archivos)

- `lib/mocks/expenseMocks.ts` (nuevo)
- `lib/mocks/salesDocumentLinesMocks.ts` (nuevo)
- `lib/mocks/companyMocks.ts` (nuevo)
- `lib/mocks/clientContactMocks.ts` (nuevo)
- `lib/mocks/projectStaffingMocks.ts` (nuevo)
- Actualizar: `lib/mocks/supplierMocks.ts` (añadir update, delete)
- Actualizar: `lib/mocks/salesDocumentsMocks.ts` (añadir create, update, delete)
- Actualizar: `lib/mocks/inventoryMocks.ts` (añadir create, update, delete)

### Exportación PDF (5+ archivos)

- `lib/pdf/templates/PDFTemplate.tsx`
- `lib/pdf/generators/generatePresupuestoPDF.ts`
- `lib/pdf/generators/generateProformaPDF.ts`
- `lib/pdf/generators/generateFacturaPDF.ts`
- `lib/pdf/generators/generateRectificativaPDF.ts`
- `lib/pdf/utils/pdfUtils.ts`

### Validaciones y Utilidades (5+ archivos)

- `lib/validations/cifValidator.ts`
- `lib/validations/zipCodeValidator.ts`
- `lib/validations/emailValidator.ts`
- `lib/validations/documentNumberValidator.ts`
- `lib/business-rules/documentRules.ts`
- `lib/business-rules/deleteRules.ts`
- `lib/business-rules/conversionRules.ts`

---

## 🎯 Priorización por Módulo

### Prioridad 🔴 CRÍTICA (Fase 1-2)

1. **Ventas (Presupuestos, Facturas)**
   - Formularios de creación/edición
   - Vistas de detalle
   - Exportación PDF
   - Conversiones

2. **Compras (Gastos, Pedidos)**
   - Formularios de creación/edición
   - Vinculación pedido-gasto
   - Vistas de detalle

3. **Albaranes**
   - Formularios de creación/edición
   - Gestión de stock
   - Vistas de detalle

### Prioridad 🟡 ALTA (Fase 3-4)

4. **Proveedores**
   - Formularios de creación/edición
   - Gestión de tarifas y productos
   - Vistas de detalle

5. **Inventario**
   - Formularios de creación/edición
   - Vistas de detalle

6. **Configuración de Empresa**
   - Formularios de datos fiscales
   - Gestión de cuentas bancarias

7. **Proyectos (Detalle completo)**
   - Vista de detalle con pestañas
   - Gestión de tareas
   - Asignación de técnicos

### Prioridad 🟢 MEDIA (Fase 5-6)

8. **Clientes (Mejoras)**
   - Vista de detalle
   - Gestión de contactos

9. **Validaciones y Reglas**
   - Validaciones completas
   - Reglas de negocio

10. **Optimizaciones**
    - Rendimiento
    - UX

---

## 📅 Estimación de Tiempo

### Fase 1: Formularios CRUD (2-3 semanas)
- 30+ componentes de formularios
- 15+ vistas de detalle
- Funciones mock adicionales

### Fase 2: Exportación PDF (1 semana)
- Librería de PDF
- Plantillas
- Generadores

### Fase 3: Configuración (1 semana)
- Formularios de empresa
- Gestión de cuentas bancarias

### Fase 4: Funcionalidades Avanzadas (1-2 semanas)
- Contactos, tarifas, asignaciones
- Vista de detalle de proyecto

### Fase 5: Validaciones (1 semana)
- Validaciones de formularios
- Reglas de negocio

### Fase 6: Mejoras UX (1 semana)
- Búsqueda avanzada
- Notificaciones

### Fase 7: Optimizaciones (1 semana)
- Rendimiento
- Testing
- Documentación

**Total estimado**: 8-10 semanas

---

## ✅ Criterios de Finalización

Para considerar la plataforma lista para pruebas reales:

1. ✅ Todos los formularios de creación implementados
2. ✅ Todas las vistas de detalle implementadas
3. ✅ Exportación PDF de documentos de venta funcionando
4. ✅ Conversiones entre documentos funcionando
5. ✅ Validaciones básicas implementadas
6. ✅ Reglas de negocio críticas implementadas
7. ✅ Configuración de empresa funcional
8. ✅ Flujos principales probados manualmente
9. ✅ Datos mock completos y coherentes
10. ✅ Documentación básica de usuario

---

## 🚀 Próximos Pasos Inmediatos

1. **Empezar con Fase 1.2: Presupuestos**
   - Es el módulo más complejo y crítico
   - Una vez completado, servirá de base para proformas y facturas
   - Incluye gestión de líneas, cálculos, etc.

2. **Seguir con Fase 1.6: Albaranes**
   - Módulo logístico crítico
   - Gestión de stock

3. **Continuar con Fase 1.8: Gastos**
   - Vinculación con pedidos de compra
   - Flujo crítico de negocio

---

**Última actualización**: Enero 2025  
**Estado**: Plan creado, listo para ejecución

