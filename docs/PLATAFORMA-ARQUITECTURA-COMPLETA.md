# 📘 Arquitectura Completa de la Plataforma NEXOAV

## Documento Maestro de Referencia

Este documento proporciona una visión exhaustiva de la arquitectura, estructura, módulos, conexiones y funcionalidades de la plataforma NEXOAV. Está diseñado para servir como referencia técnica completa para desarrolladores, arquitectos y stakeholders.

---

## 📋 Índice

1. [Introducción y Visión General](#1-introducción-y-visión-general)
2. [Arquitectura Técnica](#2-arquitectura-técnica)
3. [Estructura de Carpetas](#3-estructura-de-carpetas)
4. [Módulos Principales](#4-módulos-principales)
5. [Base de Datos](#5-base-de-datos)
6. [Componentes Reutilizables](#6-componentes-reutilizables)
7. [Hooks Personalizados](#7-hooks-personalizados)
8. [Sistema de Navegación](#8-sistema-de-navegación)
9. [Sistema Responsive](#9-sistema-responsive)
10. [Flujos de Datos](#10-flujos-de-datos)
11. [Mock Data y Funciones](#11-mock-data-y-funciones)
12. [Contextos y Estado Global](#12-contextos-y-estado-global)
13. [Estilos y Temas](#13-estilos-y-temas)
14. [Conexiones entre Módulos](#14-conexiones-entre-módulos)
15. [Flujos de Negocio Críticos](#15-flujos-de-negocio-críticos)

---

## 1. Introducción y Visión General

### 1.1. ¿Qué es NEXOAV?

NEXOAV es una plataforma ERP (Enterprise Resource Planning) diseñada específicamente para empresas del sector audiovisual y de eventos. Gestiona de forma integrada:

- **CRM**: Gestión de clientes y contactos
- **Operaciones**: Proyectos, tareas, calendario
- **Ventas**: Presupuestos, proformas, facturas, rectificativas, albaranes
- **Compras**: Pedidos de compra, gastos, proveedores
- **Inventario**: Productos y servicios
- **Logística**: Albaranes de entrada/salida
- **Financiero**: Tesorería, contabilidad, impuestos
- **RRHH**: Empleados, nóminas, externos
- **Analítica**: Informes y objetivos

### 1.2. Stack Tecnológico

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 5.3.4
- **Lenguaje**: TypeScript 5.5.3
- **Estilos**: Tailwind CSS 4.0.0 + CSS Variables
- **UI Components**: Radix UI (accesibilidad)
- **Animaciones**: Motion (Framer Motion)
- **Formularios**: React Hook Form
- **Gráficos**: Recharts
- **Backend (Futuro)**: Supabase (PostgreSQL)
- **Estado**: React Context API + Hooks

### 1.3. Principios de Diseño

1. **Responsive First**: Diseño adaptativo para Desktop, Tablet (horizontal/portrait) y Mobile
2. **Component-Driven**: Componentes reutilizables y modulares
3. **Type-Safe**: TypeScript estricto en todo el código
4. **Accessible**: Componentes Radix UI para accesibilidad
5. **Performance**: Lazy loading, code splitting, optimizaciones
6. **Maintainable**: Estructura clara, documentación completa

---

## 2. Arquitectura Técnica

### 2.1. Estructura General

```
NEXOAV/
├── src/                    # Código fuente principal
│   ├── main.tsx          # Punto de entrada
│   ├── contexts/         # Contextos React (Theme, Sidebar)
│   ├── config/           # Configuraciones (temas)
│   └── styles/           # Estilos globales y por dispositivo
├── pages/                 # Páginas/Módulos de la aplicación
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y funciones
│   ├── mocks/            # Funciones mock para datos
│   ├── config/           # Configuraciones (navegación)
│   └── types/            # Tipos TypeScript compartidos
├── hooks/                 # Hooks personalizados
├── data/                  # Datos mock (JSON)
└── docs/                  # Documentación
```

### 2.2. Patrón de Arquitectura

**Arquitectura Modular por Módulos de Negocio**

Cada módulo de negocio (Clientes, Proyectos, Ventas, etc.) tiene:
- Su propia carpeta en `pages/`
- Estructura responsive (desktop, mobile, tablet, tablet-horizontal)
- Componentes específicos en `components/`
- Funciones mock en `lib/mocks/`
- Datos mock en `data/`

**Separación de Responsabilidades**:
- **Presentación**: `pages/` y `components/`
- **Lógica de Negocio**: `lib/mocks/` (futuro: API calls)
- **Datos**: `data/` (futuro: Supabase)
- **Estado Global**: `src/contexts/`
- **Utilidades**: `hooks/` y `lib/`

---

## 3. Estructura de Carpetas

### 3.1. Directorio Raíz

```
V2_NEXOAV/
├── App.tsx                    # Componente principal, routing
├── index.html                 # HTML base
├── package.json               # Dependencias y scripts
├── vite.config.ts            # Configuración Vite
├── tsconfig.json             # Configuración TypeScript
├── tailwind.config.js        # Configuración Tailwind
└── postcss.config.mjs        # Configuración PostCSS
```

### 3.2. `/src` - Código Fuente Principal

```
src/
├── main.tsx                  # Punto de entrada, renderizado React
├── contexts/
│   ├── ThemeContext.tsx      # Contexto de temas (silk, ocean, coffee, dark)
│   └── SidebarContext.tsx    # Contexto del sidebar (colapsado/expandido)
├── config/
│   └── themes.ts            # Configuración de temas
└── styles/
    ├── globals.css          # Estilos globales y variables CSS
    ├── components/
    │   ├── ui/              # Estilos de componentes UI
    │   ├── mobile.css       # Estilos específicos mobile
    │   ├── tablet-portrait.css
    │   └── tablet-horizontal.css
```

### 3.3. `/pages` - Módulos de la Aplicación

Cada módulo sigue esta estructura:

```
pages/[modulo]/
├── index.tsx                 # Componente principal (selector responsive)
├── desktop/
│   ├── [Modulo].tsx         # Versión desktop
│   └── index.ts
├── mobile/
│   ├── [Modulo].tsx         # Versión mobile
│   └── index.ts
├── tablet/
│   ├── [Modulo].tsx         # Versión tablet portrait
│   └── index.ts
├── tablet-horizontal/
│   ├── [Modulo].tsx         # Versión tablet horizontal
│   └── index.ts
└── components/               # Componentes específicos del módulo
    ├── [Modulo]List.tsx     # Listado reutilizable
    ├── New[Modulo]Modal.tsx # Modal de creación
    └── index.ts
```

**Módulos Implementados**:
- `inicio/` - Dashboard principal
- `clientes/` - CRM de clientes
- `proyectos/` - Gestión de proyectos
- `proveedores/` - Gestión de proveedores (Técnicos, Materiales, Softwares, Externos)
- `gastos/` - Compras (Pedidos, Gastos, Categorías)
- `facturacion/` - Ventas (Presupuestos, Proformas, Facturas, Rectificativas, Albaranes)
- `inventario/` - Productos y Servicios
- `tesoreria/` - Cuentas bancarias, cashflow, pagos/cobros
- `contabilidad/` - Cuadro de cuentas, balance, activos
- `rrhh/` - Empleados, nóminas, externos
- `analitica/` - Informes y objetivos
- `empresa/` - Configuración de empresa
- `calendario/` - Vista de calendario
- `mapa/` - Vista de mapa
- `calculadora/` - Calculadora
- `impuestos/` - Gestión de impuestos

### 3.4. `/components` - Componentes Reutilizables

```
components/
├── header/                   # Header de la aplicación
│   ├── header.tsx           # Componente principal
│   ├── desktop/             # Versiones responsive
│   ├── mobile/
│   ├── tablet/
│   └── tablet-horizontal/
├── sidebar/                  # Sidebar de navegación
│   ├── sidebar.tsx
│   └── [responsive]/      # Versiones responsive
├── list/
│   ├── DataList.tsx        # Componente de listado reutilizable
│   └── README.md
├── navigation/
│   └── mobile/
│       └── BottomNavbar.tsx # Barra de navegación inferior (mobile)
├── users/                   # Componentes de usuario
│   ├── UserProfile.tsx
│   ├── Notifications.tsx
│   └── Settings.tsx
└── Logo.tsx                 # Logo de la empresa
```

### 3.5. `/lib` - Utilidades y Funciones

```
lib/
├── mocks/                   # Funciones mock (simulan API)
│   ├── clientMocks.ts      # CRUD de clientes
│   ├── projectMocks.ts     # CRUD de proyectos
│   ├── supplierMocks.ts    # CRUD de proveedores
│   ├── salesDocumentsMocks.ts # CRUD de documentos de venta
│   ├── inventoryMocks.ts   # CRUD de inventario
│   ├── deliveryNotesMocks.ts # CRUD de albaranes
│   ├── purchaseOrdersMocks.ts # CRUD de pedidos de compra
│   └── taskMocks.ts        # CRUD de tareas
├── config/
│   └── sidebarNavigation.ts # Configuración del sidebar
├── types/                   # Tipos TypeScript compartidos
│   ├── client.ts
│   ├── task.ts
│   └── userPreferences.ts
├── taskCategories.ts       # Categorías de tareas
└── taskStatus.ts           # Estados de tareas
```

### 3.6. `/data` - Datos Mock (JSON)

```
data/
├── crm/
│   ├── clients.json        # Datos de clientes
│   ├── client_contacts.json # Contactos de clientes
│   └── README.md
├── operations/
│   ├── projects.json       # Datos de proyectos
│   ├── project_staffing.json # Asignación de técnicos
│   ├── tasks.json          # Tareas
│   └── README.md
├── expenses/
│   ├── suppliers.json     # Proveedores
│   ├── supplier_rates.json # Tarifas de proveedores
│   ├── expenses.json       # Gastos
│   ├── expense_categories.json # Categorías de gastos
│   └── README.md
├── billing/
│   ├── sales_documents.json # Documentos de venta
│   ├── sales_document_lines.json # Líneas de documentos
│   └── README.md
├── inventory/
│   ├── inventory_items.json # Productos y servicios
│   ├── inventory_categories.json # Categorías
│   ├── price_lists.json    # Listas de precios
│   └── README.md
├── logistics/
│   ├── delivery_notes.json # Albaranes
│   ├── delivery_note_lines.json # Líneas de albaranes
│   └── README.md
├── purchases/
│   ├── purchase_orders.json # Pedidos de compra
│   └── README.md
├── company/
│   ├── company_settings.json # Configuración de empresa
│   ├── company_banks.json  # Cuentas bancarias
│   ├── document_templates.json # Plantillas
│   └── README.md
└── users/
    ├── profiles.json       # Perfiles de usuario
    └── README.md
```

### 3.7. `/hooks` - Hooks Personalizados

```
hooks/
├── useBreakpoint.ts        # Detecta breakpoint (mobile, tablet, desktop)
├── useRouter.ts            # Router personalizado (SPA)
├── useTheme.ts            # Hook para temas
├── useDesktopSize.ts      # Tamaño de desktop (small, medium, large, xlarge)
├── useTabletSize.ts       # Tamaño de tablet
├── useTabletHorizontalSize.ts # Tamaño de tablet horizontal
├── useAvailableWidth.ts   # Ancho disponible
└── useCalendarTasks.ts    # Tareas del calendario
```

---

## 4. Módulos Principales

### 4.1. Módulo: Inicio (`/`)

**Ruta**: `/`  
**Componente Principal**: `pages/inicio/index.tsx`

**Funcionalidad**:
- Dashboard principal con resumen de la plataforma
- Tarjetas de métricas clave
- Accesos rápidos a módulos principales
- Gráficos de resumen

**Estructura**:
```
inicio/
├── index.tsx
├── desktop/InicioResumen.tsx
├── mobile/InicioResumen.tsx
├── tablet/InicioResumen.tsx
├── tablet-horizontal/InicioResumen.tsx
└── components/
```

### 4.2. Módulo: Clientes (`/clientes`)

**Ruta**: `/clientes`  
**Componente Principal**: `pages/clientes/index.tsx`

**Funcionalidad**:
- CRUD completo de clientes
- Gestión de contactos múltiples por cliente
- Direcciones estructuradas (facturación, envío)
- Validación de CIF/NIF
- Código interno automático (CLI-0001, CLI-0002...)

**Componentes**:
- `ClientesList.tsx` - Listado con filtros y búsqueda
- `NewClientModal.tsx` - Modal de creación/edición
- `ClientesLayoutTemplate.tsx` - Template de layout

**Datos**:
- `data/crm/clients.json` - Clientes
- `data/crm/client_contacts.json` - Contactos

**Funciones Mock**:
- `lib/mocks/clientMocks.ts`:
  - `fetchClients()` - Obtener todos los clientes
  - `fetchClientById(id)` - Obtener cliente por ID
  - `createClient(data)` - Crear cliente
  - `updateClient(id, data)` - Actualizar cliente
  - `deleteClient(id)` - Eliminar cliente (soft delete)

**Conexiones**:
- → `projects` (client_id)
- → `sales_documents` (client_id)
- → `client_contacts` (client_id)

### 4.3. Módulo: Proyectos (`/proyectos`)

**Ruta**: `/proyectos`  
**Componente Principal**: `pages/proyectos/index.tsx`

**Funcionalidad**:
- CRUD completo de proyectos
- Asignación de técnicos (project_staffing)
- Gestión de tareas
- Pestañas: Logística y Económico
- Cálculo de total_billing automático

**Componentes**:
- `ProyectosList.tsx` - Listado de proyectos
- `NewProjectModal.tsx` - Modal de creación/edición
- `ProyectoLogisticaTab.tsx` - Pestaña de logística (albaranes, stock)
- `ProyectoEconomicoTab.tsx` - Pestaña económica (pedidos, gastos, desvíos)

**Datos**:
- `data/operations/projects.json` - Proyectos
- `data/operations/project_staffing.json` - Asignación de técnicos
- `data/operations/tasks.json` - Tareas

**Funciones Mock**:
- `lib/mocks/projectMocks.ts`:
  - `fetchProjects()` - Obtener todos los proyectos
  - `fetchProjectById(id)` - Obtener proyecto por ID
  - `createProject(data)` - Crear proyecto
  - `updateProject(id, data)` - Actualizar proyecto

**Conexiones**:
- ← `clients` (client_id)
- → `sales_documents` (project_id)
- → `expenses` (project_id)
- → `purchase_orders` (project_id)
- → `delivery_notes` (project_id)
- → `project_staffing` (project_id)
- → `tasks` (project_id)

### 4.4. Módulo: Proveedores (`/proveedores`)

**Ruta**: `/proveedores`  
**Subrutas**:
- `/proveedores/tecnicos` - Técnicos freelance
- `/proveedores/materiales` - Proveedores de material
- `/proveedores/softwares` - Proveedores de software/SaaS
- `/proveedores/externos` - Otros proveedores externos

**Componente Principal**: `pages/proveedores/index.tsx`

**Funcionalidad**:
- CRUD completo de proveedores
- Categorización por tipo
- Gestión de tarifas (técnicos)
- Gestión de productos (materiales)
- Cálculo de total_billing automático
- Código interno automático (PROV-0001, PROV-0002...)

**Componentes**:
- `ProveedoresList.tsx` - Listado adaptativo por categoría
  - Técnicos: Columna "Ciudad"
  - Materiales: Sin columnas adicionales
  - Softwares: Columna "Nº Facturas"
  - Externos: Columna "Nº Facturas Pagadas"

**Datos**:
- `data/expenses/suppliers.json` - Proveedores
- `data/expenses/supplier_rates.json` - Tarifas de técnicos

**Funciones Mock**:
- `lib/mocks/supplierMocks.ts`:
  - `fetchSuppliers(category?)` - Obtener proveedores (filtrado por categoría)
  - `fetchSupplierById(id)` - Obtener proveedor por ID
  - `createSupplier(data)` - Crear proveedor
  - `updateSupplier(id, data)` - Actualizar proveedor

**Conexiones**:
- → `expenses` (supplier_id)
- → `purchase_orders` (supplier_id)
- → `supplier_rates` (supplier_id)
- → `inventory_items` (primary_supplier_id)
- → `project_staffing` (supplier_id)

### 4.5. Módulo: Compras (`/compras`)

**Ruta Base**: `/compras`  
**Subrutas**:
- `/compras/pedidos` - Pedidos de compra (previsión de costes)
- `/compras/gastos` - Gastos/Facturas recibidas
- `/compras/categorias` - Categorías de gastos

#### 4.5.1. Pedidos de Compra (`/compras/pedidos`)

**Funcionalidad**:
- CRUD de pedidos de compra
- Numeración automática: `PO-{YY}{NNNNN}` (ej: PO-25001)
- Vinculación con gastos (expenses)
- Cálculo de desvíos (previsión vs. real)
- Estados: `pending`, `fulfilled`, `cancelled`

**Componentes**:
- `PedidosList.tsx` - Listado con columnas: Número, Proyecto, Proveedor, Descripción, Previsto, Estado, Real, Desvío

**Datos**:
- `data/purchases/purchase_orders.json`

**Funciones Mock**:
- `lib/mocks/purchaseOrdersMocks.ts`:
  - `fetchPurchaseOrders(projectId?)` - Obtener pedidos
  - `fetchPurchaseOrderById(id)` - Obtener pedido por ID
  - `createPurchaseOrder(data)` - Crear pedido
  - `updatePurchaseOrder(id, data)` - Actualizar pedido
  - `cancelPurchaseOrder(id)` - Cancelar pedido
  - `linkExpenseToPurchaseOrder(purchaseOrderId, expenseId)` - Vincular gasto

**Conexiones**:
- ← `projects` (project_id) - OBLIGATORIO
- ← `suppliers` (supplier_id) - Opcional
- → `expenses` (purchase_order_id) - Relación 1:1

**Flujo Crítico**:
1. Se crea pedido con `estimated_amount` (previsión)
2. Se sube factura del proveedor como `expense`
3. Se vincula: `expense.purchase_order_id` = pedido.id
4. El pedido cambia a estado `fulfilled`
5. Se calcula desvío: `expense.amount_total - purchase_order.estimated_amount`

#### 4.5.2. Gastos (`/compras/gastos`)

**Funcionalidad**:
- CRUD de gastos (facturas recibidas)
- Vinculación con pedidos de compra
- Estados: `borrador`, `aprobado`, `pagado`
- Categorización

**Datos**:
- `data/expenses/expenses.json`

**Conexiones**:
- ← `projects` (project_id)
- ← `suppliers` (supplier_id)
- ← `purchase_orders` (purchase_order_id)
- ← `expense_categories` (category_id)

#### 4.5.3. Categorías (`/compras/categorias`)

**Funcionalidad**:
- Gestión de categorías de gastos

**Datos**:
- `data/expenses/expense_categories.json`

### 4.6. Módulo: Ventas (`/ventas`)

**Ruta Base**: `/ventas` (antes `/facturacion`)  
**Subrutas**:
- `/ventas/presupuestos` - Presupuestos (quotes)
- `/ventas/proformas` - Proformas
- `/ventas/facturas` - Facturas
- `/ventas/rectificativas` - Notas de crédito
- `/ventas/albaranes` - Albaranes de entrega

**Componente Principal**: `pages/facturacion/index.tsx`

#### 4.6.1. Presupuestos (`/ventas/presupuestos`)

**Funcionalidad**:
- CRUD de presupuestos
- Numeración automática: `E{YY}{NNNNN}` (ej: E250001)
- Separación de productos y servicios en PDF
- Cálculo automático de IVA por tipo
- Conversión a proforma

**Componentes**:
- `PresupuestosList.tsx` - Listado de presupuestos
- `SalesDocumentsList.tsx` - Componente reutilizable para documentos de venta

**Datos**:
- `data/billing/sales_documents.json` (type = 'presupuesto')
- `data/billing/sales_document_lines.json`

**Funciones Mock**:
- `lib/mocks/salesDocumentsMocks.ts`:
  - `fetchPresupuestos()` - Obtener presupuestos
  - `fetchProformas()` - Obtener proformas
  - `fetchFacturas()` - Obtener facturas
  - `fetchRectificativas()` - Obtener rectificativas
  - `createSalesDocument(data)` - Crear documento
  - `updateSalesDocument(id, data)` - Actualizar documento

**Conexiones**:
- ← `clients` (client_id)
- ← `projects` (project_id) - Opcional
- → `sales_document_lines` (document_id)
- → `sales_documents` (related_document_id) - Para trazabilidad

#### 4.6.2. Proformas (`/ventas/proformas`)

**Funcionalidad**:
- Numeración automática: `FP{YY}{NNNNN}` (ej: FP250001)
- Conversión desde presupuesto
- Conversión a factura

**Flujo**:
- Presupuesto (E250001) → Proforma (FP250001) → Factura (F-250001)

#### 4.6.3. Facturas (`/ventas/facturas`)

**Funcionalidad**:
- Numeración automática: `F-{YY}{NNNNN}` (ej: F-250001)
- Conversión desde presupuesto o proforma
- Estados: `borrador`, `enviado`, `aceptado`, `cobrada`, `rechazado`, `vencida`
- Cálculo automático de `total_billing` en proyectos

#### 4.6.4. Rectificativas (`/ventas/rectificativas`)

**Funcionalidad**:
- Numeración automática: `RT-{YY}{NNNNN}` (ej: RT-250001)
- **CRÍTICO**: Solo se pueden crear desde una factura
- Campo `rectifies_document_id` apunta a la factura original

**Restricción**:
- `rectifies_document_id` debe apuntar a un documento con `type = 'factura'`

#### 4.6.5. Albaranes (`/ventas/albaranes`)

**Funcionalidad**:
- Gestión de movimiento físico de material
- Tipos: `outbound` (salida) e `inbound` (entrada/retorno)
- Estados: `draft`, `confirmed`, `cancelled`
- Numeración automática: `ALB-{YY}{NNNNN}` (ej: ALB-25001)
- Actualización de stock al confirmar

**Componentes**:
- `AlbaranesList.tsx` - Listado de albaranes

**Datos**:
- `data/logistics/delivery_notes.json`
- `data/logistics/delivery_note_lines.json`

**Funciones Mock**:
- `lib/mocks/deliveryNotesMocks.ts`:
  - `fetchDeliveryNotes(projectId?)` - Obtener albaranes
  - `fetchDeliveryNoteById(id)` - Obtener albarán por ID
  - `fetchDeliveryNoteLines(deliveryNoteId)` - Obtener líneas
  - `createDeliveryNote(data)` - Crear albarán
  - `updateDeliveryNote(id, data)` - Actualizar albarán
  - `confirmDeliveryNote(id)` - Confirmar (actualizar stock)
  - `cancelDeliveryNote(id)` - Cancelar (revertir stock)

**Conexiones**:
- ← `projects` (project_id) - OBLIGATORIO
- ← `clients` (client_id) - Opcional
- → `delivery_note_lines` (delivery_note_id)
- → `inventory_items` (item_id en líneas)

**Flujo de Stock**:
- Albarán `outbound` confirmado: `stock_warehouse` ↓, `stock_rented` ↑
- Albarán `inbound` confirmado: `stock_warehouse` ↑, `stock_rented` ↓

### 4.7. Módulo: Inventario (`/inventario`)

**Ruta Base**: `/inventario`  
**Subrutas**:
- `/inventario/productos` - Productos físicos
- `/inventario/servicios` - Servicios

**Funcionalidad**:
- CRUD de productos y servicios
- Gestión de stock (productos): `stock_warehouse`, `stock_rented`, `stock_committed`
- Cálculo de métricas: `units_sold`, `total_billing`, `average_cost`
- Categorización

**Componentes**:
- `ProductosList.tsx` - Listado de productos
- `ServiciosList.tsx` - Listado de servicios (con columnas: Unidades vendidas, Facturado, Coste medio)

**Datos**:
- `data/inventory/inventory_items.json`
- `data/inventory/inventory_categories.json`

**Funciones Mock**:
- `lib/mocks/inventoryMocks.ts`:
  - `fetchInventoryItems(type?)` - Obtener items (filtrado por tipo)
  - `fetchInventoryItemById(id)` - Obtener item por ID
  - `fetchProducts()` - Obtener solo productos
  - `fetchServices()` - Obtener solo servicios

**Conexiones**:
- ← `inventory_categories` (category_id)
- ← `suppliers` (primary_supplier_id)
- → `sales_document_lines` (item_id)
- → `delivery_note_lines` (item_id) - Solo productos con `is_stockable = true`
- → `supplier_rates` (inventory_item_id)

**Campos de Stock**:
- `stock_warehouse`: Cantidad física en almacén
- `stock_rented`: Cantidad actualmente en proyectos (calculado desde albaranes)
- `stock_committed`: Cantidad reservada en presupuestos aceptados sin albarán

### 4.8. Módulo: Tesorería (`/tesoreria`)

**Subrutas**:
- `/tesoreria/cuentas-bancarias` - Gestión de cuentas bancarias
- `/tesoreria/cashflow` - Flujo de caja
- `/tesoreria/pagos-cobros` - Pagos y cobros

**Datos**:
- `data/company/company_banks.json`

### 4.9. Módulo: Contabilidad (`/contabilidad`)

**Subrutas**:
- `/contabilidad/cuadro-cuentas` - Cuadro de cuentas
- `/contabilidad/balance-situacion` - Balance de situación
- `/contabilidad/activos` - Activos

### 4.10. Módulo: RRHH (`/rrhh`)

**Subrutas**:
- `/rrhh/empleados` - Empleados
- `/rrhh/nominas` - Nóminas
- `/rrhh/externos` - Externos

### 4.11. Módulo: Analítica (`/analitica`)

**Subrutas**:
- `/analitica/informes` - Informes
- `/analitica/objetivos` - Objetivos

### 4.12. Módulo: Empresa (`/empresa`)

**Subrutas**:
- `/empresa/datos-fiscales` - Datos fiscales de la empresa
- `/empresa/preferencias` - Preferencias globales
- `/empresa/plantillas` - Plantillas de documentos
- `/empresa/conectividad` - Integraciones y conectividad
- `/empresa/documentacion` - Documentación

**Datos**:
- `data/company/company_settings.json`
- `data/company/document_templates.json`

---

## 5. Base de Datos

### 5.1. Arquitectura de Base de Datos

**Tecnología**: Supabase (PostgreSQL)  
**Esquema**: `public` (con agrupación lógica por módulos)

**Documentación Completa**: Ver `docs/base-de-datos.md`

### 5.2. Módulos de Base de Datos

#### 5.2.1. Módulo: Configuración y Empresa

- `company_settings` - Datos fiscales de la empresa
- `company_banks` - Cuentas bancarias
- `document_templates` - Plantillas de documentos

#### 5.2.2. Módulo: CRM

- `clients` - Clientes
- `client_contacts` - Contactos de clientes (1:N)

#### 5.2.3. Módulo: Operaciones

- `projects` - Proyectos
- `project_staffing` - Asignación de técnicos a proyectos
- `tasks` - Tareas

#### 5.2.4. Módulo: Compras y Gastos

- `suppliers` - Proveedores
- `supplier_rates` - Tarifas de proveedores técnicos
- `expenses` - Gastos/Facturas recibidas
- `expense_categories` - Categorías de gastos
- `purchase_orders` - Pedidos de compra (previsión)

#### 5.2.5. Módulo: Ventas

- `sales_documents` - Documentos de venta (presupuestos, proformas, facturas, rectificativas)
- `sales_document_lines` - Líneas de documentos de venta

#### 5.2.6. Módulo: Inventario

- `inventory_items` - Productos y servicios
- `inventory_categories` - Categorías de inventario
- `price_lists` - Listas de precios (futuro)
- `price_list_items` - Items de listas de precios (futuro)

#### 5.2.7. Módulo: Logística

- `delivery_notes` - Albaranes
- `delivery_note_lines` - Líneas de albaranes

### 5.3. Características Clave de la BD

#### 5.3.1. Inmutabilidad Fiscal

- `sales_documents.client_snapshot` (JSONB): Congela datos del cliente al emitir documento
- Permite mantener facturas históricas sin afectar cambios en datos del cliente

#### 5.3.2. Direcciones Estructuradas

- Direcciones en formato JSONB: `{street, city, zip, province, country}`
- Permite filtros geográficos, cálculos de impuestos, optimización de rutas

#### 5.3.3. Numeración Automática

- Presupuestos: `E{YY}{NNNNN}` (ej: E250001)
- Proformas: `FP{YY}{NNNNN}` (ej: FP250001)
- Facturas: `F-{YY}{NNNNN}` (ej: F-250001)
- Rectificativas: `RT-{YY}{NNNNN}` (ej: RT-250001)
- Albaranes: `ALB-{YY}{NNNNN}` (ej: ALB-25001)
- Pedidos de Compra: `PO-{YY}{NNNNN}` (ej: PO-25001)

#### 5.3.4. Cálculos Automáticos

- `clients.total_billing`: Suma de facturas cobradas/aceptadas
- `clients.total_projects`: Contador de proyectos
- `projects.total_billing`: Suma de facturas del proyecto
- `suppliers.total_billing`: Suma de gastos pagados
- `inventory_items.stock_rented`: Calculado desde albaranes
- `inventory_items.stock_committed`: Calculado desde presupuestos aceptados

---

## 6. Componentes Reutilizables

### 6.1. DataList

**Ubicación**: `components/list/DataList.tsx`

**Propósito**: Componente de listado genérico y reutilizable

**Características**:
- Búsqueda integrada
- Filtros personalizables
- Ordenamiento por columnas
- Paginación
- Responsive (grid adaptativo)
- Acciones por fila

**Uso**:
```typescript
<DataList
  title="Título"
  data={items}
  columns={columns}
  searchPlaceholder="Buscar..."
  showFilters={true}
  showTools={true}
  onItemClick={handleClick}
/>
```

**Componentes que lo usan**:
- `ClientesList`
- `ProyectosList`
- `ProveedoresList`
- `PresupuestosList`
- `AlbaranesList`
- `PedidosList`
- `ProductosList`
- `ServiciosList`

### 6.2. Header

**Ubicación**: `components/header/header.tsx`

**Funcionalidad**:
- Búsqueda global
- Notificaciones
- Perfil de usuario
- Menú (mobile/tablet)

**Versiones Responsive**:
- `desktop/` - Header completo
- `mobile/` - Header simplificado
- `tablet/` - Header adaptado
- `tablet-horizontal/` - Header adaptado

### 6.3. Sidebar

**Ubicación**: `components/sidebar/sidebar.tsx`

**Funcionalidad**:
- Navegación principal
- Submenús expandibles
- Colapsable (desktop)
- Responsive (oculto en mobile, overlay en tablet)

**Configuración**: `lib/config/sidebarNavigation.ts`

### 6.4. BottomNavbar

**Ubicación**: `components/navigation/mobile/BottomNavbar.tsx`

**Funcionalidad**:
- Navegación inferior (solo mobile)
- Accesos rápidos a módulos principales

---

## 7. Hooks Personalizados

### 7.1. useBreakpoint

**Ubicación**: `hooks/useBreakpoint.ts`

**Funcionalidad**: Detecta el breakpoint actual

**Valores**:
- `'mobile'` - < 768px
- `'tablet-portrait'` - 768px - 1024px
- `'tablet'` - 1024px - 1280px
- `'desktop'` - > 1280px

**Uso**:
```typescript
const breakpoint = useBreakpoint();
if (breakpoint === 'mobile') {
  // Lógica mobile
}
```

### 7.2. useRouter

**Ubicación**: `hooks/useRouter.ts`

**Funcionalidad**: Router SPA personalizado

**API**:
- `path`: Ruta actual
- `navigate(path)`: Navegar a una ruta
- `params`: Parámetros de ruta (futuro)

### 7.3. useTheme

**Ubicación**: `hooks/useTheme.ts`

**Funcionalidad**: Acceso al contexto de temas

**API**:
- `theme`: Tema actual
- `setTheme(theme)`: Cambiar tema
- `themeConfig`: Configuración del tema

**Temas disponibles**:
- `silk` - Tema claro por defecto
- `ocean` - Tema azul
- `coffee` - Tema marrón
- `dark` - Tema oscuro

### 7.4. useDesktopSize

**Ubicación**: `hooks/useDesktopSize.ts`

**Funcionalidad**: Detecta el tamaño de desktop

**Valores**:
- `'small'` - < 1280px
- `'medium'` - 1280px - 1600px
- `'large'` - 1600px - 1920px
- `'xlarge'` - > 1920px

---

## 8. Sistema de Navegación

### 8.1. Configuración del Sidebar

**Ubicación**: `lib/config/sidebarNavigation.ts`

**Estructura**:
```typescript
export interface SidebarNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  subItems?: SidebarNavSubItem[];
}
```

**Módulos Principales**:
1. Inicio (`/`)
2. Calendario (`/calendario`)
3. Mapa (`/mapa`)
4. Clientes (`/clientes`)
5. Proyectos (`/proyectos`)
6. Proveedores (`/proveedores`)
   - Técnicos, Materiales, Softwares, Externos
7. Compras (`/compras`)
   - Pedidos, Gastos, Categorías
8. Ventas (`/ventas`)
   - Presupuestos, Proformas, Facturas, Rectificativas, Albaranes
9. Inventario (`/inventario`)
   - Productos, Servicios
10. Tesorería (`/tesoreria`)
11. Contabilidad (`/contabilidad`)
12. Impuestos (`/impuestos`)
13. Calculadora (`/calculadora`)
14. Analítica (`/analitica`)
15. RRHH (`/rrhh`)
16. Empresa (`/empresa`)

### 8.2. Routing en App.tsx

**Ubicación**: `App.tsx`

**Funcionalidad**:
- Routing declarativo con `if` statements
- Cada ruta renderiza el componente correspondiente
- Manejo de rutas no encontradas

**Ejemplo**:
```typescript
if (currentPath === '/clientes') {
  return <Clientes />;
}
if (currentPath === '/proyectos') {
  return <Proyectos />;
}
```

---

## 9. Sistema Responsive

### 9.1. Breakpoints

| Breakpoint | Ancho | Dispositivo |
|------------|-------|-------------|
| `mobile` | < 768px | Móviles |
| `tablet-portrait` | 768px - 1024px | Tablets verticales |
| `tablet` | 1024px - 1280px | Tablets horizontales |
| `desktop` | > 1280px | Escritorio |

### 9.2. Estructura Responsive

Cada módulo tiene versiones para cada breakpoint:

```
pages/[modulo]/
├── index.tsx              # Selector de versión según breakpoint
├── desktop/[Modulo].tsx   # Versión desktop
├── mobile/[Modulo].tsx    # Versión mobile
├── tablet/[Modulo].tsx    # Versión tablet portrait
└── tablet-horizontal/[Modulo].tsx # Versión tablet horizontal
```

**Selector en index.tsx**:
```typescript
export function Modulo() {
  const breakpoint = useBreakpoint();
  
  return (
    <>
      {breakpoint === "desktop" && <ModuloDesktop />}
      {breakpoint === "tablet" && <ModuloTabletHorizontal />}
      {breakpoint === "tablet-portrait" && <ModuloTablet />}
      {breakpoint === "mobile" && <ModuloMobile />}
    </>
  );
}
```

### 9.3. Componentes Responsive

Los componentes también tienen versiones responsive:
- `components/header/` - Versiones por breakpoint
- `components/sidebar/` - Versiones por breakpoint

### 9.4. Estilos Responsive

**Ubicación**: `src/styles/`

- `globals.css` - Variables CSS globales
- `components/mobile.css` - Estilos mobile
- `components/tablet-portrait.css` - Estilos tablet portrait
- `components/tablet-horizontal.css` - Estilos tablet horizontal

---

## 10. Flujos de Datos

### 10.1. Flujo de Datos Actual (Mock)

```
UI Component
    ↓
Hook/Function Call
    ↓
lib/mocks/[module]Mocks.ts
    ↓
data/[module]/[data].json
    ↓
Return Data
    ↓
UI Update
```

### 10.2. Flujo Futuro (Supabase)

```
UI Component
    ↓
Hook/Function Call
    ↓
lib/api/[module]Api.ts (futuro)
    ↓
Supabase Client
    ↓
PostgreSQL Database
    ↓
Return Data
    ↓
UI Update
```

### 10.3. Flujos de Negocio Críticos

#### 10.3.1. Flujo: Cliente → Proyecto → Presupuesto → Factura

```
1. Cliente creado (clients.json)
2. Proyecto creado (projects.json, client_id)
3. Presupuesto creado (sales_documents.json, client_id, project_id)
4. Presupuesto aceptado → Proforma (related_document_id)
5. Proforma → Factura (related_document_id)
6. Factura cobrada → total_billing actualizado en proyecto y cliente
```

#### 10.3.2. Flujo: Pedido de Compra → Gasto

```
1. Pedido de compra creado (purchase_orders.json, project_id, estimated_amount)
2. Factura del proveedor subida (expenses.json)
3. Gasto vinculado al pedido (expenses.purchase_order_id)
4. Pedido cambia a fulfilled
5. Desvío calculado: expense.amount_total - purchase_order.estimated_amount
```

#### 10.3.3. Flujo: Albarán → Stock

```
1. Albarán outbound creado (delivery_notes.json, type='outbound')
2. Líneas añadidas (delivery_note_lines.json, item_id, quantity)
3. Albarán confirmado → stock_warehouse ↓, stock_rented ↑
4. Albarán inbound creado (type='inbound')
5. Albarán inbound confirmado → stock_warehouse ↑, stock_rented ↓
```

---

## 11. Mock Data y Funciones

### 11.1. Estructura de Mock Data

**Ubicación**: `data/`

Cada módulo tiene su carpeta con:
- Archivos JSON con datos mock
- `README.md` con documentación del módulo

### 11.2. Funciones Mock

**Ubicación**: `lib/mocks/`

**Patrón común**:
```typescript
export async function fetchItems(): Promise<ItemData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simular delay
  return itemsData as ItemData[];
}

export async function fetchItemById(id: string): Promise<ItemData | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return itemsData.find(item => item.id === id) || null;
}

export async function createItem(data: Omit<ItemData, 'id' | 'created_at'>): Promise<ItemData> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const newItem = { id: generateId(), ...data, created_at: new Date().toISOString() };
  itemsData.push(newItem);
  return newItem;
}
```

### 11.3. Funciones Mock por Módulo

- `clientMocks.ts` - Clientes
- `projectMocks.ts` - Proyectos
- `supplierMocks.ts` - Proveedores
- `salesDocumentsMocks.ts` - Documentos de venta
- `inventoryMocks.ts` - Inventario
- `deliveryNotesMocks.ts` - Albaranes
- `purchaseOrdersMocks.ts` - Pedidos de compra
- `taskMocks.ts` - Tareas

---

## 12. Contextos y Estado Global

### 12.1. ThemeContext

**Ubicación**: `src/contexts/ThemeContext.tsx`

**Funcionalidad**:
- Gestión de temas (silk, ocean, coffee, dark)
- Persistencia en localStorage
- Aplicación de clases CSS y variables

**API**:
```typescript
const { theme, setTheme, themeConfig } = useTheme();
```

### 12.2. SidebarContext

**Ubicación**: `src/contexts/SidebarContext.tsx`

**Funcionalidad**:
- Estado del sidebar (colapsado/expandido)
- Ancho dinámico del sidebar
- Responsive (diferentes anchos según breakpoint)

**API**:
```typescript
const { sidebarWidth, isCollapsed } = useSidebar();
```

### 12.3. Providers en App.tsx

```typescript
<ThemeProvider>
  <SidebarProvider>
    <AppContent />
  </SidebarProvider>
</ThemeProvider>
```

---

## 13. Estilos y Temas

### 13.1. Sistema de Temas

**Ubicación**: `src/config/themes.ts`

**Temas disponibles**:
- `silk` - Tema claro por defecto
- `ocean` - Tema azul
- `coffee` - Tema marrón
- `dark` - Tema oscuro

### 13.2. Variables CSS

**Ubicación**: `src/styles/globals.css`

**Variables principales**:
- `--background` - Color de fondo
- `--foreground` - Color de texto
- `--primary` - Color primario
- `--secondary` - Color secundario
- `--border-*` - Colores de bordes
- `--spacing-*` - Espaciados
- `--radius-*` - Radios de borde
- `--font-size-*` - Tamaños de fuente

### 13.3. Tailwind CSS

**Configuración**: `tailwind.config.js`

**Uso**: Clases de utilidad de Tailwind + variables CSS personalizadas

---

## 14. Conexiones entre Módulos

### 14.1. Diagrama de Relaciones Principales

```
clients
  ├──→ projects (client_id)
  ├──→ sales_documents (client_id)
  └──→ client_contacts (client_id)

projects
  ├──→ sales_documents (project_id)
  ├──→ expenses (project_id)
  ├──→ purchase_orders (project_id)
  ├──→ delivery_notes (project_id)
  ├──→ project_staffing (project_id)
  └──→ tasks (project_id)

suppliers
  ├──→ expenses (supplier_id)
  ├──→ purchase_orders (supplier_id)
  ├──→ supplier_rates (supplier_id)
  ├──→ inventory_items (primary_supplier_id)
  └──→ project_staffing (supplier_id)

inventory_items
  ├──→ sales_document_lines (item_id)
  ├──→ delivery_note_lines (item_id)
  └──→ supplier_rates (inventory_item_id)

sales_documents
  ├──→ sales_document_lines (document_id)
  ├──→ sales_documents (related_document_id) - Trazabilidad
  └──→ sales_documents (rectifies_document_id) - Rectificativas

purchase_orders
  └──→ expenses (purchase_order_id) - 1:1

delivery_notes
  └──→ delivery_note_lines (delivery_note_id)
```

### 14.2. Flujos de Datos entre Módulos

#### 14.2.1. CRM → Operaciones → Ventas

```
Cliente → Proyecto → Presupuesto → Proforma → Factura
```

#### 14.2.2. Compras → Inventario → Ventas

```
Proveedor → Pedido de Compra → Gasto
Proveedor → Producto → Albarán → Stock
Producto → Línea de Presupuesto → Factura
```

#### 14.2.3. Operaciones → Logística → Inventario

```
Proyecto → Albarán Outbound → Stock Rented ↑
Proyecto → Albarán Inbound → Stock Rented ↓
```

---

## 15. Flujos de Negocio Críticos

### 15.1. Flujo: Presupuesto → Proforma → Factura

**Documentación**: `docs/presupuestos-especificacion.md`

**Pasos**:
1. Crear presupuesto (E250001)
2. Cliente acepta → Convertir a proforma (FP250001)
3. Recibir pago → Convertir a factura (F-250001)
4. Trazabilidad: `related_document_id` mantiene la cadena

### 15.2. Flujo: Pedido de Compra → Gasto

**Documentación**: `docs/pedidos-compra-flujo-vinculacion.md`

**Pasos**:
1. Crear pedido de compra (PO-25001, estimated_amount: 500€)
2. Subir factura del proveedor (expense, amount_total: 550€)
3. Vincular: `expense.purchase_order_id` = pedido.id
4. Pedido cambia a `fulfilled`
5. Desvío calculado: +50€

### 15.3. Flujo: Albarán → Stock

**Documentación**: `docs/albaranes-especificacion.md`

**Pasos**:
1. Crear albarán outbound (ALB-25001, type='outbound')
2. Añadir líneas (items, quantities)
3. Confirmar albarán → `stock_warehouse` ↓, `stock_rented` ↑
4. Crear albarán inbound (type='inbound')
5. Confirmar albarán → `stock_warehouse` ↑, `stock_rented` ↓

### 15.4. Flujo: Rectificativa desde Factura

**Restricción crítica**: Solo se pueden crear rectificativas desde facturas

**Pasos**:
1. Factura existente (F-250001)
2. Crear rectificativa (RT-250001)
3. `rectifies_document_id` = F-250001.id
4. Validación: El documento referenciado debe ser `type = 'factura'`

---

## 16. Consideraciones de Implementación

### 16.1. Migración a Supabase

**Estado actual**: Mock data en JSON  
**Estado futuro**: Supabase (PostgreSQL)

**Plan de migración**:
1. Mantener estructura de funciones mock
2. Reemplazar lectura de JSON por llamadas a Supabase
3. Mantener interfaces TypeScript
4. Migración gradual módulo por módulo

### 16.2. Validaciones y Restricciones

**Implementadas en código**:
- Validación de CIF/NIF (clientes)
- Validación de códigos postales
- Validación de emails
- Restricciones de negocio (ej: rectificativas solo desde facturas)

**Futuro en BD**:
- Constraints en PostgreSQL
- Triggers para validaciones complejas
- RLS (Row Level Security) para permisos

### 16.3. Cálculos Automáticos

**Actual**: Calculados en funciones mock  
**Futuro**: Triggers en PostgreSQL

**Ejemplos**:
- `total_billing` en clients, projects, suppliers
- `stock_rented` en inventory_items
- `margin_percentage` en inventory_items
- Desvíos en purchase_orders

---

## 17. Documentación Adicional

### 17.1. Documentos de Especificación

- `docs/base-de-datos.md` - Esquema completo de BD
- `docs/presupuestos-especificacion.md` - Módulo de presupuestos
- `docs/pedidos-compra-especificacion.md` - Módulo de pedidos
- `docs/pedidos-compra-flujo-vinculacion.md` - Flujo de vinculación
- `docs/albaranes-especificacion.md` - Módulo de albaranes
- `docs/proveedores.md` - Módulo de proveedores
- `docs/facturacion-listados-columnas.md` - Columnas de listados

### 17.2. Changelog

- `docs/CHANGELOG-desarrollo-beta.md` - Historial de cambios en rama desarrollo-beta

---

## 18. Conclusión

Esta plataforma está diseñada con una arquitectura modular, escalable y mantenible. La separación clara entre módulos, el uso de componentes reutilizables, y la estructura responsive permiten un desarrollo eficiente y una experiencia de usuario consistente en todos los dispositivos.

**Próximos pasos**:
1. Migración completa a Supabase
2. Implementación de autenticación y permisos
3. Optimizaciones de rendimiento
4. Testing completo
5. Documentación de API

---

**Última actualización**: Enero 2025  
**Versión del documento**: 1.0  
**Rama**: desarrollo-beta

