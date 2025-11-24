# Base de Datos - NEXOAV

Documentación completa del esquema de base de datos para la plataforma NEXOAV, diseñada para Supabase (PostgreSQL).

---

## Índice

1. [Arquitectura General](#arquitectura-general)
2. [Módulo: Configuración y Empresa](#módulo-configuración-y-empresa)
3. [Módulo: Usuarios y Seguridad](#módulo-usuarios-y-seguridad)
4. [Módulo: CRM](#módulo-crm)
5. [Módulo: Operaciones](#módulo-operaciones)
6. [Módulo: Inventario](#módulo-inventario)
7. [Módulo: Facturación](#módulo-facturación)
8. [Módulo: Compras y Gastos](#módulo-compras-y-gastos)
9. [Relaciones entre Módulos](#relaciones-entre-módulos)
10. [Consideraciones de Implementación](#consideraciones-de-implementación)

---

## Arquitectura General

La base de datos está organizada en módulos lógicos que corresponden a las secciones de la plataforma. Aunque técnicamente todas las tablas pueden vivir en el esquema `public` de PostgreSQL, se agrupan lógicamente para facilitar el mantenimiento y la comprensión.

**Tecnología:** Supabase (PostgreSQL)  
**Esquema:** `public` (con agrupación lógica por módulos)

---

## Mejoras de Robustez Empresarial (Enterprise Grade)

Este diseño ha sido refinado para alcanzar un nivel de robustez empresarial que permita escalar sin romper funcionalidades existentes. Las siguientes mejoras críticas se han implementado desde el inicio:

### 1. Inmutabilidad Fiscal (CRÍTICO)

**Problema resuelto:** Las facturas emitidas deben mantener los datos del cliente tal como estaban en el momento de la emisión. Si un cliente cambia su dirección, las facturas históricas no pueden verse afectadas.

**Solución:** La tabla `sales_documents` incluye `client_snapshot` (JSONB) que congela los datos fiscales del cliente al momento de emitir el documento. `client_id` se mantiene para estadísticas y relaciones actuales, mientras que `client_snapshot` se usa para renderizar el PDF legal histórico.

### 2. Granularidad de Direcciones (Logística y Mapa)

**Problema resuelto:** Direcciones almacenadas como texto plano impiden consultas geográficas, filtros por provincia/código postal, y automatización de rutas logísticas.

**Solución:** Las direcciones se almacenan como JSONB estructurado con campos separados (`street`, `city`, `zip`, `province`, `country`), permitiendo:
- Filtros geográficos avanzados
- Cálculos automáticos de impuestos (IGIC Canarias vs IVA peninsular)
- Optimización de rutas logísticas
- Análisis por zonas geográficas

### 3. Contactos Múltiples (Realidad del Sector Eventos)

**Problema resuelto:** Un cliente puede tener múltiples contactos (Productor, Administrativo, Técnico de Sala), pero el diseño original solo permitía uno.

**Solución:** Nueva tabla `client_contacts` (relación 1:N) que permite gestionar múltiples contactos por cliente, cada uno con su rol, email, teléfono y etiquetas para identificar a quién enviar facturas automáticamente.

### 4. Escalabilidad de Precios y Tarifas

**Problema resuelto:** Precios fijos en `inventory_items` no permiten tarifas especiales por cliente ni evolución de precios sin afectar documentos históricos.

**Solución:** 
- `sales_document_lines.unit_price` siempre guarda el precio real aplicado (no depende del item)
- `inventory_items.base_price` es solo una sugerencia
- Preparado para futura tabla `price_lists` para tarifas por cliente
- Campo `is_stockable` en `inventory_items` para diferenciar rápidamente productos físicos de servicios

---

## Módulo: Configuración y Empresa

Este módulo alimenta los pies de página de los PDFs y la configuración global de la empresa. Corresponde a la sección `/empresa` del sidebar.

### Tabla: `company_settings`

Almacena los datos fiscales y de configuración principal de la empresa (NEXOAV/AV TECH).

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `fiscal_name` | TEXT | Razón social fiscal | `"AV TECH ESDEVENIMENTS S.L."` |
| `trade_name` | TEXT | Nombre comercial | `"NEXOAV"` |
| `cif` | TEXT | CIF/NIF de la empresa | `"B75835728"` |
| `address_fiscal` | JSONB | Dirección fiscal estructurada | `{"street": "...", "city": "...", "zip": "...", "province": "...", "country": "..."}` |
| `address_warehouse` | JSONB | Dirección de almacén estructurada | `{"street": "...", "city": "...", "zip": "...", "province": "...", "country": "..."}` |
| `phone` | TEXT | Teléfono de contacto | `"+34 123 456 789"` |
| `email_contact` | TEXT | Email de contacto | `"info@nexoav.com"` |
| `default_vat` | NUMERIC(5,2) | IVA por defecto (%) | `21.00` |
| `default_currency` | TEXT(3) | Moneda por defecto | `"EUR"` |
| `logo_url` | TEXT | URL del logo de la empresa | `"/logos/company-logo.png"` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas:**
- Solo debería existir un registro (singleton)
- Se actualiza desde `/empresa/datos-fiscales`
- Direcciones en formato JSONB estructurado para análisis geográfico

---

### Tabla: `company_banks`

Gestiona las cuentas bancarias de la empresa que aparecen en las facturas.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `bank_name` | TEXT | Nombre del banco | `"CaixaBank"` |
| `iban` | TEXT | Número IBAN completo | `"ES91 2100 0418 4502 0005 1332"` |
| `swift_bic` | TEXT | Código SWIFT/BIC | `"CAIXESBBXXX"` |
| `is_visible_on_invoices` | BOOLEAN | Si se muestra en facturas | `true` |
| `is_default` | BOOLEAN | Cuenta por defecto | `false` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas:**
- `is_visible_on_invoices = false` para ocultar cuentas de nóminas en facturas de clientes
- Solo una cuenta puede tener `is_default = true`

---

### Tabla: `document_templates`

Plantillas personalizadas para documentos (facturas, presupuestos, emails).

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `type` | TEXT | Tipo de plantilla | `"presupuesto"`, `"factura"`, `"email"` |
| `name` | TEXT | Nombre descriptivo | `"Plantilla Moderna"` |
| `template_html` | TEXT/JSON | Diseño del PDF (HTML o JSON) | Contenido del template |
| `terms_text` | TEXT | Bloque legal que aparece al final del PDF | Texto de términos y condiciones |
| `is_active` | BOOLEAN | Si está activa | `true` |
| `is_default` | BOOLEAN | Plantilla por defecto | `false` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas:**
- Se gestiona desde `/empresa/plantillas`
- `template_html` puede ser HTML puro o JSON estructurado según el sistema de renderizado

---

## Módulo: Usuarios y Seguridad

Gestiona quién entra en la plataforma y qué puede ver. Utiliza el sistema de autenticación de Supabase (`auth.users`).

### Tabla: `profiles`

Extensión de `auth.users` de Supabase con información adicional del perfil.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | UUID vinculado a `auth.users.id` | UUID |
| `email` | TEXT | Email del usuario | `"usuario@nexoav.com"` |
| `full_name` | TEXT | Nombre completo | `"Juan Pérez"` |
| `role` | ENUM | Rol del usuario | `admin`, `staff`, `freelance`, `client` |
| `department` | TEXT | Departamento | `"produccion"`, `"facturacion"`, `"tecnico"` |
| `supplier_id` | FK (UUID) | Si es freelance, vinculación a `suppliers.id` | UUID |
| `is_active` | BOOLEAN | Si el usuario está activo | `true` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Roles:**
- `admin`: Acceso completo a todas las secciones
- `staff`: Empleado interno con permisos según departamento
- `freelance`: Técnico externo, acceso limitado a sus proyectos
- `client`: Cliente, acceso solo a sus proyectos y facturas

**Notas:**
- `supplier_id` solo se usa cuando `role = 'freelance'`
- Se crea automáticamente cuando se registra un usuario en `auth.users`

---

## Módulo: CRM

Gestiona la base de datos de clientes. Corresponde a la sección `/clientes`.

### Tabla: `clients`

Información completa de los clientes de la empresa. **Versión mejorada con direcciones estructuradas.**

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `internal_code` | TEXT | Código interno (único, indexado) | `"CLI-0045"` |
| `fiscal_name` | TEXT | Razón social fiscal | `"CBCN SOLUCIONES..."` |
| `commercial_name` | TEXT | Nombre comercial | `"CBCN"` |
| `vat_number` | TEXT | CIF/NIF del cliente (validar formato) | `"B65595621"` |
| `billing_address` | JSONB | Dirección de facturación estructurada | `{"street": "Calle Espronceda 1", "city": "Barcelona", "zip": "08027", "province": "Barcelona", "country": "España"}` |
| `shipping_address` | JSONB | Dirección de envío estructurada | `{"street": "Calle Mayor 10", "city": "Madrid", "zip": "28001", "province": "Madrid", "country": "España"}` |
| `payment_terms` | TEXT | Condiciones de pago (Enum o FK) | `"30 días"`, `"60 días"` |
| `payment_method` | TEXT | Método de pago preferido | `"transferencia"`, `"confirming"` |
| `notes` | TEXT | Notas internas | Notas sobre el cliente |
| `is_active` | BOOLEAN | Si el cliente está activo | `true` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Estructura de direcciones JSONB:**
```json
{
  "street": "Calle y número",
  "city": "Ciudad/Municipio",
  "zip": "Código Postal",
  "province": "Provincia",
  "country": "País"
}
```

**Notas:**
- `internal_code` debe ser único y seguir un patrón (ej: CLI-0001, CLI-0002)
- Se puede generar automáticamente con un trigger o secuencia
- Las direcciones estructuradas permiten filtros geográficos y análisis por zonas
- **Los contactos se gestionan en la tabla `client_contacts` (ver abajo)**

---

### Tabla: `client_contacts`

**NUEVA TABLA** - Gestiona múltiples contactos por cliente (1:N). Permite tener Productor, Administrativo, Técnico de Sala, etc.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `client_id` | FK (UUID) | Cliente asociado | UUID → `clients.id` |
| `full_name` | TEXT | Nombre completo | `"Rosina García"` |
| `position` | TEXT | Cargo/Posición | `"Productora"`, `"Administración"`, `"Técnico de Sala"` |
| `email` | TEXT | Email de contacto | `"rosina@cliente.com"` |
| `phone` | TEXT | Teléfono de contacto | `"+34 123 456 789"` |
| `tags` | TEXT[] | Array de etiquetas | `['facturacion', 'tecnico']` |
| `is_billing_contact` | BOOLEAN | Si es contacto de facturación (para envío automático) | `true` |
| `is_primary` | BOOLEAN | Contacto principal | `false` |
| `notes` | TEXT | Notas sobre el contacto | Notas |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Etiquetas comunes:**
- `facturacion`: Para envío de facturas
- `tecnico`: Para temas técnicos
- `produccion`: Para coordinación de producción
- `administracion`: Para temas administrativos

**Notas:**
- Un cliente puede tener múltiples contactos
- `is_billing_contact = true` identifica a quién enviar facturas automáticamente
- `tags` permite filtrar contactos por función

---

## Módulo: Operaciones

El corazón de la gestión de proyectos (bolos) e instalaciones. Corresponde a `/proyectos` y `/calendario`.

### Tabla: `projects`

Proyectos principales de la empresa (instalaciones, eventos, etc.). **Versión mejorada con dirección estructurada.**

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `internal_ref` | TEXT | Referencia interna/secuencial | `"0061"` |
| `client_id` | FK (UUID) | Cliente asociado | UUID → `clients.id` |
| `client_po_number` | TEXT | Número de pedido del cliente | `"PO-2025-001"` |
| `name` | TEXT | Nombre del proyecto | `"Instalación Monitores Cuenca"` |
| `status` | ENUM | Estado del proyecto | `borrador`, `presupuestado`, `aceptado`, `ejecutando`, `finalizado`, `cancelado` |
| `location_name` | TEXT | Nombre de la ubicación | `"Centro de Convenciones Cuenca"` |
| `location_address` | JSONB | Dirección estructurada de la ubicación | `{"street": "Calle Mayor 1", "city": "Cuenca", "zip": "16001", "province": "Cuenca", "country": "España"}` |
| `location_coords` | JSONB | Coordenadas (lat, lng) para el mapa | `{"lat": 40.07, "lng": -2.13}` |
| `start_date` | TIMESTAMPTZ | Fecha de inicio | `2025-01-15 09:00:00` |
| `end_date` | TIMESTAMPTZ | Fecha de finalización | `2025-01-15 18:00:00` |
| `description` | TEXT | Descripción del proyecto | Descripción detallada |
| `budget_estimated` | NUMERIC(10,2) | Presupuesto estimado | `5000.00` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Estados del proyecto:**
- `borrador`: Proyecto en creación
- `presupuestado`: Presupuesto enviado al cliente
- `aceptado`: Cliente aceptó el presupuesto
- `ejecutando`: Proyecto en curso
- `finalizado`: Proyecto completado
- `cancelado`: Proyecto cancelado

**Notas:**
- `internal_ref` debe ser único y secuencial (ej: 0001, 0002, 0061)
- `location_coords` permite mostrar el proyecto en el mapa (`/mapa`)
- **Contratos de Alquiler**: Los proyectos pueden incluir contratos de alquiler (12 o 18 meses) que requieren mantenimiento periódico
  - Para contratos de 12 o 18 meses, se generarán automáticamente tareas de mantenimiento cada 3 meses
  - Estas tareas aparecerán en el calendario (`/calendario`) como tareas obligatorias
  - La primera tarea se creará 3 meses después de la fecha de instalación (`start_date`)
  - Las tareas de mantenimiento se vincularán al proyecto mediante `project_id` en la tabla `tasks`

---

### Tabla: `project_staffing`

Gestiona quién trabaja en cada proyecto (asignación de personal).

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `project_id` | FK (UUID) | Proyecto asociado | UUID → `projects.id` |
| `user_id` | FK (UUID) | Usuario interno (opcional) | UUID → `profiles.id` |
| `supplier_id` | FK (UUID) | Proveedor externo (opcional) | UUID → `suppliers.id` |
| `role_in_project` | TEXT | Rol en el proyecto | `"Técnico de Sonido"`, `"Iluminador"` |
| `dates` | DATE[] | Array de fechas de trabajo | `['2025-01-15', '2025-01-16']` |
| `status` | ENUM | Estado de la asignación | `propuesto`, `confirmado` |
| `cost_agreed` | NUMERIC(10,2) | Coste pactado para este bolo | `250.00` |
| `notes` | TEXT | Notas sobre la asignación | Notas |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas:**
- O bien `user_id` o `supplier_id` debe estar presente (no ambos)
- `dates` es un array de PostgreSQL para múltiples días
- Los freelances solo ven proyectos donde `supplier_id` coincide con su perfil

---

### Tabla: `tasks`

Tareas del calendario y gestión de trabajo.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `project_id` | FK (UUID) | Proyecto asociado (opcional) | UUID → `projects.id` |
| `assigned_to` | FK (UUID) | Usuario asignado | UUID → `profiles.id` |
| `title` | TEXT | Título de la tarea | `"Revisar presupuesto E250061"` |
| `description` | TEXT | Descripción detallada | Descripción |
| `due_date` | DATE | Fecha de vencimiento | `2025-01-20` |
| `department_tag` | TEXT | Etiqueta de departamento | `"facturacion"`, `"produccion"`, `"tecnico"` |
| `status` | ENUM | Estado de la tarea | `pendiente`, `en_proceso`, `completada`, `cancelada` |
| `priority` | ENUM | Prioridad | `baja`, `media`, `alta`, `urgente` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas:**
- `project_id` es opcional (puede ser tarea general)
- `department_tag` permite filtrar tareas por departamento
- Se visualiza en `/calendario`
- **Tareas de Mantenimiento Automáticas** (Futuro):
  - Para proyectos con contratos de alquiler de 12 o 18 meses, se generarán automáticamente tareas de mantenimiento
  - Frecuencia: cada 3 meses desde la fecha de instalación del proyecto
  - Tipo: tareas obligatorias vinculadas al proyecto
  - Ejemplo: Si un proyecto de alquiler inicia el 2025-01-15, las tareas de mantenimiento se crearán en:
    - 2025-04-15 (3 meses)
    - 2025-07-15 (6 meses)
    - 2025-10-15 (9 meses)
    - 2026-01-15 (12 meses) - fin del contrato de 12 meses
    - Para contratos de 18 meses, continuará hasta 2026-07-15 (18 meses)
  - Estas tareas se crearán automáticamente mediante triggers o funciones de base de datos cuando se detecte un proyecto con contrato de alquiler

---

## Módulo: Inventario

Gestiona productos y servicios que la empresa ofrece. Corresponde a `/inventario`. Aplica lógica contable y de tipos para los presupuestos.

### Tabla: `inventory_categories`

Categorías de inventario con información contable.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `name` | TEXT | Nombre de la categoría | `"Mano de Obra"`, `"Iluminación"`, `"Cableado"` |
| `accounting_account_sales` | TEXT | Cuenta contable de ventas | `"705"` (Servicios) |
| `accounting_account_purchase` | TEXT | Cuenta contable de compras | `"600"` (Compras) |
| `description` | TEXT | Descripción de la categoría | Descripción |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas:**
- Las cuentas contables siguen el Plan General Contable español
- Se usa para agrupar items en informes contables

---

### Tabla: `inventory_items`

Items del inventario (productos y servicios). **Versión mejorada con `is_stockable` para diferenciación rápida.**

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `internal_code` | TEXT | SKU/Código interno | `"SKU-001"` |
| `name` | TEXT | Nombre del item | `"Media Jornada Técnico"`, `"Tornillería"` |
| `description` | TEXT | Descripción larga para el PDF | Descripción detallada |
| `type` | ENUM | Tipo de item | `producto`, `servicio` |
| `subtype` | TEXT | Subtipo (clave para agrupar en PDF) | `alquiler`, `venta`, `mano_de_obra`, `logistica` |
| `category_id` | FK (UUID) | Categoría asociada | UUID → `inventory_categories.id` |
| `primary_supplier_id` | FK (UUID) | **Proveedor principal** (opcional) | UUID → `suppliers.id` |
| `base_price` | NUMERIC(10,2) | Precio de venta sugerido (solo referencia) | `150.00` |
| `cost_price` | NUMERIC(10,2) | Precio de coste (para calcular margen) | `100.00` |
| `margin_percentage` | NUMERIC(5,2) | Porcentaje de margen calculado automáticamente | `50.00` (50% margen) |
| `rental_price_12m` | NUMERIC(10,2) | **Precio de alquiler mensual a 12 meses** (opcional, solo alquiler) | `24.97` |
| `rental_price_18m` | NUMERIC(10,2) | **Precio de alquiler mensual a 18 meses** (opcional, solo alquiler) | `14.98` |
| `rental_price_daily` | NUMERIC(10,2) | **Precio de alquiler diario para eventos** (opcional, solo alquiler) | `10.70` |
| `is_stockable` | BOOLEAN | Si es stockable (producto físico vs servicio) | `true` para productos, `false` para servicios |
| `stock_current` | INTEGER | Stock actual (solo si `is_stockable = true`) | `0` (inicial) |
| `stock_min` | INTEGER | Stock mínimo (alertas, solo si `is_stockable = true`) | `10` |
| `unit` | TEXT | Unidad de medida | `"unidad"`, `"hora"`, `"día"` |
| `is_active` | BOOLEAN | Si el item está activo | `true` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Tipos:**
- `producto`: Item físico que se puede almacenar
- `servicio`: Servicio intangible

**Subtipos (agrupación en PDFs):**
- `alquiler`: Items de alquiler
- `venta`: Items de venta
- `mano_de_obra`: Servicios de mano de obra
- `logistica`: Servicios logísticos

**Notas:**
- `subtype` es TEXT (no ENUM rígido) para flexibilidad futura
- `primary_supplier_id` vincula el producto con su proveedor principal, permitiendo ver rápidamente los precios de compra
  - Facilita la gestión de compras y comparación de precios entre proveedores
  - Permite filtrar productos por proveedor
  - Opcional: algunos productos pueden no tener proveedor asignado
- `is_stockable` diferencia rápidamente un cable (`true`) de una hora de técnico (`false`)
- `base_price` es solo una sugerencia; el precio real se guarda en `sales_document_lines.unit_price`
- `stock_current` solo tiene sentido cuando `is_stockable = true` (inicializado en 0 para productos nuevos)
- `cost_price` permite calcular márgenes en proyectos
- `margin_percentage` se calcula automáticamente: `((base_price - cost_price) / cost_price) * 100`
  - Permite mantener concordancia de márgenes entre todos los productos
  - Facilita análisis de rentabilidad y comparación entre items
  - Para servicios sin `cost_price`, el margen será `null`
- `rental_price_12m`, `rental_price_18m` y `rental_price_daily` se usan para diferentes tipos de alquiler (especialmente Pantalla LED):
  - **12 meses**: `base_price / 12` (sin descuento)
  - **18 meses**: `(base_price * 0.9) / 18` (con 10% descuento)
  - **Eventos (diario)**: `base_price / 28` (para alquileres por días en eventos)
  - Ejemplo: Pantalla LED sin módulos (299.66€)
    - 12 meses: 299.66 / 12 = 24.97€/mes
    - 18 meses: (299.66 * 0.9) / 18 = 14.98€/mes
    - Evento diario: 299.66 / 28 = 10.70€/día
  - Permite gestionar proyectos de alquiler con diferentes duraciones (contratos mensuales y eventos por días)
  - **Mantenimiento de Contratos**: Los proyectos con contratos de 12 o 18 meses requieren tareas de mantenimiento automáticas cada 3 meses
    - Estas tareas se generarán automáticamente y aparecerán en el calendario
    - Se vincularán al proyecto mediante `project_id` en la tabla `tasks`
    - La primera tarea se creará 3 meses después de la fecha de instalación
- **Preparado para futura tabla `price_lists` para tarifas especiales por cliente**

---

## Módulo: Facturación

Soporta Presupuestos, Proformas, Facturas y Rectificativas. Corresponde a `/facturacion`.

### Tabla: `sales_documents`

Documentos de venta (presupuestos, proformas, facturas, rectificativas). **Versión mejorada con inmutabilidad fiscal (snapshot del cliente).**

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `type` | ENUM | Tipo de documento | `presupuesto`, `proforma`, `factura`, `rectificativa` |
| `document_number` | TEXT | Número de documento | `"E250061"`, `"FV-2025-001"` |
| `project_id` | FK (UUID) | Proyecto asociado (opcional) | UUID → `projects.id` |
| `client_id` | FK (UUID) | Cliente asociado (relación viva para estadísticas) | UUID → `clients.id` |
| `client_snapshot` | JSONB | **Datos fiscales congelados al emitir** (para PDF legal histórico) | `{"fiscal_name": "CBCN SOLUCIONES...", "address": "Calle Espronceda...", "cif": "B655..."}` |
| `date_issued` | DATE | Fecha de emisión | `2025-01-15` |
| `date_due` | DATE | Fecha de vencimiento | `2025-02-15` |
| `status` | ENUM | Estado del documento | `borrador`, `enviado`, `aceptado`/`cobrada`, `rechazado`/`vencida` |
| `notes_internal` | TEXT | Notas internas (no visibles en PDF) | Notas |
| `notes_public` | TEXT | Observaciones visibles en PDF | `"Pago a 30 días"` |
| `totals_data` | JSONB | Totales del documento (estructurado) | `{"base": 592.00, "vat": 124.32, "total": 716.32}` |
| `template_id` | FK (UUID) | Plantilla usada | UUID → `document_templates.id` |
| `rectifies_document_id` | FK (UUID) | Si es rectificativa, documento original | UUID → `sales_documents.id` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Estructura de `client_snapshot` (JSONB):**
```json
{
  "fiscal_name": "CBCN SOLUCIONES...",
  "commercial_name": "CBCN",
  "vat_number": "B65595621",
  "address": {
    "street": "Calle Espronceda 1",
    "city": "Barcelona",
    "zip": "08027",
    "province": "Barcelona",
    "country": "España"
  }
}
```

**Estructura de `totals_data` (JSONB):**
```json
{
  "base": 592.00,
  "vat": 124.32,
  "total": 716.32
}
```

**Tipos:**
- `presupuesto`: Oferta comercial
- `proforma`: Factura proforma
- `factura`: Factura definitiva
- `rectificativa`: Factura rectificativa

**Estados:**
- `borrador`: Documento en creación
- `enviado`: Enviado al cliente
- `aceptado`/`cobrada`: Aceptado o cobrado (según tipo)
- `rechazado`/`vencida`: Rechazado o vencido

**Notas CRÍTICAS:**
- `client_snapshot` se rellena automáticamente al emitir el documento (trigger o aplicación)
- `client_id` se mantiene para estadísticas y relaciones actuales
- **Para renderizar el PDF legal, usar `client_snapshot` (inmutable)**
- `document_number` debe ser único por tipo
- `rectifies_document_id` solo se usa cuando `type = 'rectificativa'`
- Los totales en `totals_data` se calculan automáticamente desde las líneas

---

### Tabla: `sales_document_lines`

Líneas individuales de cada documento de venta (las filas del PDF). **Versión mejorada: `unit_price` siempre guarda el precio real aplicado.**

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `document_id` | FK (UUID) | Documento padre | UUID → `sales_documents.id` |
| `item_id` | FK (UUID) | Item del inventario (opcional, solo referencia) | UUID → `inventory_items.id` |
| `concept` | TEXT | **Concepto** (nombre principal del item) | `"Jornada Técnico (General)"` |
| `description` | TEXT | **Descripción detallada** (texto adicional para el PDF) | `"Jornada de 8h técnico general de instalación"` |
| `quantity` | NUMERIC(10,2) | Cantidad | `12.00` |
| `unit_price` | NUMERIC(10,2) | **Precio unitario real aplicado** (no depende del item) | `250.00` |
| `discount_percent` | NUMERIC(5,2) | Descuento (%) (opcional) | `10.00` o `0.00` |
| `subtotal` | NUMERIC(10,2) | **Subtotal** (cantidad × precio unitario, después de descuento, antes de IVA) | `3000.00` |
| `tax_percent` | NUMERIC(5,2) | IVA (%) | `21.00` |
| `total_line` | NUMERIC(10,2) | **Total de la línea** (subtotal + IVA) | `3630.00` |
| `grouping_tag` | TEXT | **Etiqueta para agrupar** (`"Productos"` o `"Servicios"`) | `"Servicios"`, `"Productos"` |
| `line_order` | INTEGER | Orden de la línea en el documento | `1`, `2`, `3` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |

**Estructura de Líneas de Presupuesto:**

Cada presupuesto se organiza en dos apartados principales:
1. **Productos** (`grouping_tag = "Productos"`): Items físicos del inventario (`type = "producto"`)
2. **Servicios** (`grouping_tag = "Servicios"`): Servicios del inventario (`type = "servicio"`)

**Campos de cada línea:**
- **Concepto**: Nombre principal del item (ej: "Jornada Técnico (General)")
- **Descripción**: Texto detallado adicional (ej: "Jornada de 8h técnico general de instalación")
- **Precio**: Precio unitario (`unit_price`)
- **Unidades**: Cantidad (`quantity`)
- **Subtotal**: `(quantity × unit_price) × (1 - discount_percent/100)`
- **IVA**: Porcentaje de IVA aplicado (`tax_percent`)
- **Total**: `subtotal × (1 + tax_percent/100)`
- **Descuento**: Opcional, se aplica antes del cálculo del subtotal

**Notas CRÍTICAS:**
- `unit_price` **SIEMPRE** guarda el precio real aplicado, independientemente del `base_price` del item
- Esto permite tarifas especiales por cliente sin afectar documentos históricos
- `item_id` es opcional y solo para referencia (puede ser concepto manual)
- `grouping_tag` se determina automáticamente según el `type` del `inventory_item`:
  - Si `inventory_item.type = "producto"` → `grouping_tag = "Productos"`
  - Si `inventory_item.type = "servicio"` → `grouping_tag = "Servicios"`
  - Si no hay `item_id`, se puede definir manualmente
- `subtotal = (quantity × unit_price) × (1 - discount_percent/100)`
- `total_line = subtotal × (1 + tax_percent/100)`
- `line_order` permite ordenar las líneas en el PDF y agrupar por secciones (Productos primero, Servicios después)
- `description` puede estar vacío si no se necesita texto adicional al concepto

---

## Módulo: Compras y Gastos

Control de compras, gastos y proveedores. Corresponde a `/gastos` y `/proveedores`. Permite controlar el margen real de los proyectos.

### Tabla: `suppliers`

Proveedores y suministradores de la empresa.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `name` | TEXT | Nombre del proveedor | `"Proveedor XYZ"` |
| `cif` | TEXT | CIF/NIF del proveedor | `"B12345678"` |
| `category` | ENUM | Categoría del proveedor | `tecnico_freelance`, `material`, `transporte`, `software`, `externo` |
| `freelance_profile_id` | FK (UUID) | Si es técnico, perfil asociado | UUID → `profiles.id` |
| `address` | JSONB | Dirección estructurada | `{"street": "...", "city": "...", "zip": "...", "province": "...", "country": "..."}` |
| `contact_email` | TEXT | Email de contacto | `"contacto@proveedor.com"` |
| `contact_phone` | TEXT | Teléfono de contacto | `"+34 123 456 789"` |
| `payment_terms_days` | INTEGER | Días de pago | `30` |
| `notes` | TEXT | Notas | Notas sobre el proveedor |
| `is_active` | BOOLEAN | Si el proveedor está activo | `true` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Categorías:**
- `tecnico_freelance`: Técnicos y freelances
- `material`: Proveedores de materiales
- `transporte`: Servicios de transporte
- `software`: Proveedores de software/SaaS
- `externo`: Otros proveedores externos

**Notas:**
- `freelance_profile_id` solo se usa cuando `category = 'tecnico_freelance'`
- Corresponde a las subsecciones de `/proveedores`

---

### Tabla: `expenses`

Gastos y compras de la empresa.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `supplier_id` | FK (UUID) | Proveedor asociado | UUID → `suppliers.id` |
| `project_id` | FK (UUID) | Proyecto asociado (para imputar coste) | UUID → `projects.id` |
| `category_id` | FK (UUID) | Categoría de gasto (opcional) | UUID → `expense_categories.id` |
| `description` | TEXT | Descripción del gasto | `"Compra de cableado"` |
| `amount_base` | NUMERIC(10,2) | Importe base (sin IVA) | `500.00` |
| `amount_tax` | NUMERIC(10,2) | Importe de IVA | `105.00` |
| `amount_total` | NUMERIC(10,2) | Importe total | `605.00` |
| `file_url` | TEXT | URL del archivo (ticket/factura) | `"/uploads/expenses/ticket-001.pdf"` |
| `date_expense` | DATE | Fecha del gasto | `2025-01-15` |
| `status` | ENUM | Estado del gasto | `pendiente_aprobacion`, `aprobado`, `pagado` |
| `payment_date` | DATE | Fecha de pago (si está pagado) | `2025-01-20` |
| `notes` | TEXT | Notas adicionales | Notas |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Estados:**
- `pendiente_aprobacion`: Gastos pendientes de aprobación
- `aprobado`: Gastos aprobados pero no pagados
- `pagado`: Gastos pagados

**Notas:**
- `project_id` permite imputar gastos a proyectos para calcular márgenes
- `file_url` almacena la foto/escaneo del ticket o factura
- Corresponde a `/gastos/tickets`

---

### Tabla: `expense_categories` (Opcional)

Categorías para organizar gastos. Corresponde a `/gastos/categorias`.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `name` | TEXT | Nombre de la categoría | `"Materiales"`, `"Transporte"` |
| `description` | TEXT | Descripción | Descripción |
| `color` | TEXT | Color para visualización | `"#FF5733"` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |

---

## Relaciones entre Módulos

### Diagrama de Relaciones Principales

```
company_settings (1) ──┐
                       │
company_banks (N) ─────┤─── Usado en ───> sales_documents (PDFs)
                       │
document_templates (N) ┘

profiles (N) ──┬──> project_staffing (N) ──> projects (1)
               │
               └──> tasks (N) ──> projects (1)

clients (1) ──┬──> client_contacts (N)
              │
              ├──> projects (N)
              │
              └──> sales_documents (N)

projects (1) ──┬──> project_staffing (N)
               │
               ├──> sales_documents (N)
               │
               └──> expenses (N)

inventory_items (1) ──> sales_document_lines (N) ──> sales_documents (1)

suppliers (1) ──┬──> expenses (N)
                │
                └──> project_staffing (N) [si es freelance]

inventory_categories (1) ──> inventory_items (N)
```

### Relaciones Clave

1. **Cliente → Contactos → Proyectos → Facturación**
   - Un cliente puede tener múltiples contactos (`client_contacts`)
   - Un cliente puede tener múltiples proyectos
   - Un proyecto puede generar múltiples documentos de venta
   - Los documentos de venta guardan un snapshot inmutable del cliente (`client_snapshot`)

2. **Proyectos → Personal**
   - Un proyecto tiene múltiples asignaciones de personal (`project_staffing`)
   - El personal puede ser interno (`profiles`) o externo (`suppliers`)

3. **Inventario → Facturación**
   - Los items del inventario se usan como referencia en las líneas de documentos de venta
   - El precio real se guarda en `sales_document_lines.unit_price` (independiente del item)
   - El `subtype` del item determina cómo se agrupa en el PDF

4. **Proyectos → Gastos**
   - Los gastos se pueden imputar a proyectos para calcular márgenes
   - Permite análisis de rentabilidad por proyecto

5. **Usuarios → Proyectos**
   - Los freelances solo ven proyectos donde están asignados (`project_staffing`)
   - Los empleados ven proyectos según su departamento y permisos

---

## Consideraciones de Implementación

### Numeración y Referencias

1. **Proyectos (`projects.internal_ref`)**
   - Formato: `"0001"`, `"0002"`, `"0061"`
   - Secuencial, único
   - Se puede generar con trigger o secuencia PostgreSQL

2. **Documentos de Venta (`sales_documents.document_number`)**
   - Formato: `"E250061"` (presupuestos), `"FV-2025-001"` (facturas)
   - Único por tipo de documento
   - Se puede generar automáticamente según el tipo

3. **Clientes (`clients.internal_code`)**
   - Formato: `"CLI-0001"`, `"CLI-0045"`
   - Único, para búsqueda rápida

### Agrupación en PDFs

La clave para diferenciar bloques en los PDFs de facturación es:

1. `inventory_items.subtype` define el tipo de item
2. Al crear una línea en `sales_document_lines`, se copia el `subtype` a `grouping_tag`
3. Al renderizar el PDF, se agrupan las líneas por `grouping_tag`
4. Ejemplo de bloques: "Servicios", "Materiales", "Alquileres"

### Permisos y Roles

- **Admin**: Acceso completo
- **Staff**: Acceso según `department` (producción, facturación, técnico)
- **Freelance**: Solo proyectos donde `project_staffing.supplier_id = profiles.supplier_id`
- **Client**: Solo sus propios proyectos y facturas

### Índices Recomendados

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_clients_internal_code ON clients(internal_code);
CREATE INDEX idx_projects_internal_ref ON projects(internal_ref);
CREATE INDEX idx_sales_documents_number ON sales_documents(document_number);
CREATE INDEX idx_sales_documents_type_status ON sales_documents(type, status);

-- Relaciones (UUIDs)
CREATE INDEX idx_project_staffing_project ON project_staffing(project_id);
CREATE INDEX idx_project_staffing_supplier ON project_staffing(supplier_id);
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_sales_document_lines_document ON sales_document_lines(document_id);
CREATE INDEX idx_client_contacts_client ON client_contacts(client_id);

-- Filtros por fecha
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_sales_documents_date ON sales_documents(date_issued);

-- Índices GIN para JSONB (búsquedas en direcciones y snapshots)
CREATE INDEX idx_clients_billing_address_gin ON clients USING GIN (billing_address);
CREATE INDEX idx_clients_shipping_address_gin ON clients USING GIN (shipping_address);
CREATE INDEX idx_projects_location_address_gin ON projects USING GIN (location_address);
CREATE INDEX idx_sales_documents_client_snapshot_gin ON sales_documents USING GIN (client_snapshot);

-- Búsquedas geográficas (código postal, provincia)
CREATE INDEX idx_clients_billing_zip ON clients((billing_address->>'zip'));
CREATE INDEX idx_clients_billing_province ON clients((billing_address->>'province'));
CREATE INDEX idx_projects_location_province ON projects((location_address->>'province'));
```

### Triggers y Funciones

1. **Actualización de `updated_at`**
   - Trigger automático para actualizar `updated_at` en todas las tablas

2. **Cálculo de totales en `sales_documents`**
   - Función que recalcula `totals_data` (JSONB) cuando se modifican las líneas
   - Actualiza `totals_data.base`, `totals_data.vat`, `totals_data.total`

3. **Generación de códigos**
   - Funciones para generar `internal_ref`, `document_number`, `internal_code` automáticamente

4. **Snapshot del cliente al emitir documento (CRÍTICO)**
   - Trigger o función que copia los datos del cliente a `client_snapshot` cuando `status` cambia a `enviado` o `aceptado`
   - Garantiza inmutabilidad fiscal de los documentos emitidos

5. **Validación de direcciones**
   - Funciones para validar estructura JSONB de direcciones
   - Asegurar que contienen todos los campos requeridos

### Políticas RLS (Row Level Security)

Supabase permite implementar RLS para seguridad a nivel de fila:

- Los freelances solo ven sus proyectos
- Los clientes solo ven sus propios datos
- Los empleados ven según su departamento

---

## Próximos Pasos

1. **Crear el esquema SQL** con todas las tablas, relaciones y constraints
2. **Implementar triggers** para automatizaciones
3. **Configurar RLS** para seguridad
4. **Crear datos mock** para pruebas
5. **Generar tipos TypeScript** desde el esquema de Supabase

---

---

## Mejoras Implementadas (V2)

### Resumen de Cambios

1. ✅ **Inmutabilidad Fiscal**: `sales_documents.client_snapshot` congela datos del cliente
2. ✅ **Direcciones Estructuradas**: JSONB en `clients`, `projects` para análisis geográfico
3. ✅ **Contactos Múltiples**: Nueva tabla `client_contacts` (1:N)
4. ✅ **Escalabilidad de Precios**: `unit_price` siempre guarda precio real, preparado para `price_lists`
5. ✅ **Diferenciación Stockable**: Campo `is_stockable` en `inventory_items`
6. ✅ **UUIDs**: Migración de SERIAL a UUID para mejor escalabilidad
7. ✅ **Totales Estructurados**: `totals_data` como JSONB en `sales_documents`

### Beneficios

- **Cumplimiento Legal**: Facturas históricas inmutables
- **Análisis Geográfico**: Filtros por provincia, código postal, etc.
- **Flexibilidad de Contactos**: Múltiples contactos por cliente con roles
- **Escalabilidad**: Preparado para tarifas especiales y evolución de precios
- **Rendimiento**: Índices optimizados para consultas frecuentes

---

**Última actualización:** 2025-01-21  
**Versión del documento:** 2.0 (Enterprise Grade)

