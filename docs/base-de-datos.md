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
| `total_billing` | NUMERIC(12,2) | **Total facturado acumulado** (calculado automáticamente) | `125000.50` |
| `total_projects` | INTEGER | **Total de proyectos realizados** (calculado automáticamente) | `15` |
| `notes` | TEXT | Notas internas | Notas sobre el cliente |
| `is_active` | BOOLEAN | **Estado del cliente** (`true` = activo, `false` = inactivo) | `true` |
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

**Formato de datos:**
- **Nombres** (`fiscal_name`, `commercial_name`): Siempre en MAYÚSCULAS completas
  - Ejemplo: `"CBCN SOLUCIONES Y EQUIPOS MULTIFUNCIONALES SL"`
- **Direcciones** (`billing_address`, `shipping_address`): Formato título (primera letra mayúscula, resto minúsculas)
  - `street`: `"Calle espronceda, 333 - 333"`
  - `city`: `"Barcelona"`
  - `province`: `"Barcelona"`
  - `country`: `"España"` (mantiene mayúsculas en nombres propios)

**Notas:**
- `internal_code` debe ser único y seguir un patrón (ej: CLI-0001, CLI-0002)
- Se puede generar automáticamente con un trigger o secuencia
- Las direcciones estructuradas permiten filtros geográficos y análisis por zonas
- **Formato estándar**: Los nombres se almacenan en mayúsculas, las direcciones en formato título para mejor legibilidad
- `total_billing` se calcula automáticamente sumando el campo `total` de todas las facturas (`sales_documents`) donde:
  - `client_id = clients.id`
  - `type = 'factura'` (solo facturas definitivas, no presupuestos)
  - `status IN ('cobrada', 'aceptada')` (solo facturas cobradas o aceptadas)
  - Se actualiza mediante trigger o función cuando se crean/modifican/eliminan facturas
  - Permite mostrar el total facturado en el listado de clientes sin necesidad de JOINs complejos
- `total_projects` se calcula **AUTOMÁTICAMENTE** mediante trigger cuando se crea un nuevo proyecto:
  - **Se ejecuta al guardar/crear un proyecto** (al darle al botón de guardar)
  - **Es completamente automático**, no requiere intervención manual
  - Cuenta todos los proyectos (`projects`) donde `client_id = clients.id`
  - Incluye todos los proyectos independientemente del estado (borrador, presupuestado, aceptado, ejecutando, finalizado, cancelado)
  - Se actualiza en tiempo real cuando se crean/modifican/eliminan proyectos
  - Permite mostrar el total de proyectos realizados en el listado de clientes sin necesidad de JOINs complejos
  - **IMPORTANTE**: El conteo se incrementa automáticamente al crear un proyecto nuevo, sin necesidad de acciones adicionales

---

## 📝 Formulario de Nuevo Cliente

### Campos Automáticos (NO se implementan en el formulario)

Estos campos se generan automáticamente por la base de datos o triggers, **NO deben aparecer en el formulario**:

| Campo | Generación | Descripción |
|------|------------|-------------|
| `id` | ✅ **Automático** | UUID generado automáticamente por PostgreSQL al insertar |
| `internal_code` | ✅ **Automático** | Código único generado por trigger (ej: `"CLI-0001"`, `"CLI-0002"`) |
| `total_billing` | ✅ **Automático** | Se inicializa en `0.00` y se calcula automáticamente mediante trigger cuando se crean facturas |
| `total_projects` | ✅ **Automático** | Se inicializa en `0` y se calcula automáticamente mediante trigger cuando se crean proyectos |
| `created_at` | ✅ **Automático** | Timestamp generado automáticamente al crear el registro |
| `updated_at` | ✅ **Automático** | Timestamp actualizado automáticamente mediante trigger en cada modificación |

**Nota importante**: Estos campos **NO deben ser editables** en el formulario. Se generan/calculan automáticamente.

---

### Campos a Implementar en el Formulario

#### 1. Información Fiscal (Obligatorio)

| Campo | Tipo | Obligatorio | Validación | Transformación |
|-------|------|-------------|------------|-----------------|
| `fiscal_name` | Text Input | ✅ **Sí** | - No vacío<br>- Máximo 255 caracteres | Convertir a **MAYÚSCULAS** antes de guardar |
| `commercial_name` | Text Input | ❌ No | - Máximo 255 caracteres | Convertir a **MAYÚSCULAS** antes de guardar (si se rellena) |
| `vat_number` | Text Input | ✅ **Sí** | - Formato CIF/NIF válido<br>- No duplicado en BD | Validar formato español (B12345678, A12345678, etc.) |

**Implementación:**
- Campo `fiscal_name`: Input de texto con validación de requerido
- Campo `commercial_name`: Input de texto opcional
- Campo `vat_number`: Input de texto con validación de formato CIF/NIF y verificación de unicidad

---

#### 2. Dirección de Facturación (Obligatorio)

| Campo | Tipo | Obligatorio | Validación | Transformación |
|-------|------|-------------|------------|-----------------|
| `billing_address.street` | Text Input | ✅ **Sí** | - No vacío | Formato título (primera letra mayúscula, resto minúsculas) |
| `billing_address.city` | Text Input | ✅ **Sí** | - No vacío | Formato título |
| `billing_address.zip` | Text Input | ✅ **Sí** | - Formato código postal español (5 dígitos) | Validar formato numérico |
| `billing_address.province` | Select/Dropdown | ✅ **Sí** | - Selección de provincia española | Formato título |
| `billing_address.country` | Select/Dropdown | ✅ **Sí** | - Por defecto "España" | Mantener mayúsculas en nombres propios |

**Implementación:**
- Sección "Dirección de Facturación" con campos estructurados
- Campo `zip`: Validar formato de código postal (5 dígitos)
- Campo `province`: Dropdown con lista de provincias españolas
- Campo `country`: Dropdown con países (por defecto "España")
- **Transformación automática**: Aplicar formato título a `street`, `city`, `province` antes de guardar

---

#### 3. Dirección de Envío (Opcional)

| Campo | Tipo | Obligatorio | Validación | Transformación |
|-------|------|-------------|------------|-----------------|
| `shipping_address.*` | Mismos campos que billing | ❌ No | - Misma estructura que billing | Mismo formato título |

**Implementación:**
- Checkbox "Usar misma dirección que facturación" → Si está marcado, copiar automáticamente `billing_address` a `shipping_address`
- Si no está marcado, mostrar campos de dirección de envío (misma estructura que facturación)
- **Transformación automática**: Aplicar formato título a todos los campos antes de guardar

---

#### 4. Condiciones de Pago (Opcional)

| Campo | Tipo | Obligatorio | Validación | Opciones |
|-------|------|-------------|------------|----------|
| `payment_terms` | Select/Dropdown | ❌ No | - Selección de lista predefinida | `"30 días"`, `"60 días"`, `"90 días"`, `"Contado"` |
| `payment_method` | Select/Dropdown | ❌ No | - Selección de lista predefinida | `"transferencia"`, `"confirming"`, `"cheque"`, `"efectivo"` |

**Implementación:**
- Campo `payment_terms`: Dropdown con opciones predefinidas
- Campo `payment_method`: Dropdown con métodos de pago predefinidos
- Valores por defecto: `"30 días"` y `"transferencia"`

---

#### 5. Estado y Notas (Opcional)

| Campo | Tipo | Obligatorio | Valor por Defecto |
|-------|------|-------------|-------------------|
| `is_active` | Checkbox/Toggle | ❌ No | `true` (activo) |
| `notes` | Textarea | ❌ No | - |

**Implementación:**
- Campo `is_active`: Checkbox o toggle (por defecto activado)
- Campo `notes`: Textarea multilínea para notas internas

---

### Validaciones del Formulario

#### Validaciones en Frontend (antes de enviar):

1. **Campos obligatorios:**
   - `fiscal_name`: No puede estar vacío
   - `vat_number`: No puede estar vacío y debe tener formato válido
   - `billing_address.street`: No puede estar vacío
   - `billing_address.city`: No puede estar vacío
   - `billing_address.zip`: No puede estar vacío y debe tener 5 dígitos
   - `billing_address.province`: Debe estar seleccionado
   - `billing_address.country`: Debe estar seleccionado

2. **Validación de formato:**
   - `vat_number`: Validar formato CIF/NIF español (B12345678, A12345678, etc.)
   - `billing_address.zip`: Validar que sean 5 dígitos numéricos

3. **Validación de unicidad:**
   - `vat_number`: Verificar que no exista otro cliente con el mismo CIF/NIF (consulta a BD)

#### Transformaciones Automáticas (antes de guardar):

1. **Nombres a MAYÚSCULAS:**
   ```javascript
   fiscal_name = fiscal_name.toUpperCase().trim()
   commercial_name = commercial_name?.toUpperCase().trim() || null
   ```

2. **Direcciones a formato título:**
   ```javascript
   billing_address.street = capitalizeFirst(billing_address.street)
   billing_address.city = capitalizeFirst(billing_address.city)
   billing_address.province = capitalizeFirst(billing_address.province)
   // country mantiene mayúsculas en nombres propios
   ```

---

### Flujo de Creación de Cliente

```
1. Usuario hace clic en "Nuevo Cliente"
2. Se muestra formulario vacío
3. Usuario rellena campos obligatorios:
   - fiscal_name
   - vat_number
   - billing_address (todos los campos)
4. Usuario rellena campos opcionales (si lo desea):
   - commercial_name
   - shipping_address (o marca checkbox para copiar billing)
   - payment_terms
   - payment_method
   - notes
5. Usuario hace clic en "Guardar"
6. Frontend valida campos obligatorios y formatos
7. Frontend aplica transformaciones (mayúsculas, formato título)
8. Frontend verifica unicidad de vat_number (consulta a BD)
9. Si todo es válido, se envía POST a API:
   {
     fiscal_name: "CBCN SOLUCIONES...",
     vat_number: "B65595621",
     billing_address: { ... },
     shipping_address: { ... },
     payment_terms: "30 días",
     payment_method: "transferencia",
     is_active: true,
     notes: "..."
   }
10. Backend recibe datos y:
    - Genera UUID para `id`
    - Genera `internal_code` mediante trigger (CLI-0001, CLI-0002, etc.)
    - Inicializa `total_billing = 0.00`
    - Inicializa `total_projects = 0`
    - Genera `created_at` y `updated_at`
    - Inserta registro en BD
11. Trigger de `internal_code` se ejecuta automáticamente
12. Se retorna el cliente creado con todos los campos (incluidos los automáticos)
13. Frontend muestra mensaje de éxito y redirige o actualiza listado
```

---

### Funcionalidades Adicionales a Implementar

1. **Botón "Copiar dirección de facturación"** en sección de envío
   - Si está marcado, copiar automáticamente todos los campos de `billing_address` a `shipping_address`

2. **Validación en tiempo real de CIF/NIF**
   - Al escribir el `vat_number`, verificar formato y unicidad (debounce de 500ms)

3. **Autocompletado de provincia por código postal**
   - Al introducir el código postal, sugerir automáticamente la provincia

4. **Guardado como borrador**
   - Permitir guardar cliente incompleto (solo con campos obligatorios mínimos)

5. **Vista previa antes de guardar**
   - Mostrar resumen de datos antes de confirmar creación

---

### Notas de Implementación

- **NO incluir campos automáticos** en el formulario (`id`, `internal_code`, `total_billing`, `total_projects`, `created_at`, `updated_at`)
- **Aplicar transformaciones** (mayúsculas, formato título) antes de enviar a la API
- **Validar formatos** en frontend antes de enviar
- **Verificar unicidad** de `vat_number` antes de guardar
- **Manejar errores** de validación y mostrar mensajes claros al usuario
- **Confirmar éxito** después de crear el cliente y actualizar el listado
- `is_active` indica el estado del cliente:
  - `true` (activo): Cliente activo, puede recibir presupuestos y facturas
  - `false` (inactivo): Cliente inactivo, no aparece en listados principales (solo en búsquedas históricas)
  - Por defecto, todos los clientes nuevos se crean como `is_active = true`
  - Se puede marcar como inactivo cuando el cliente ya no trabaja con la empresa o está temporalmente suspendido
  - Los clientes inactivos no aparecen en los listados principales pero se mantienen en el historial para consultas
- **Los contactos se gestionan en la tabla `client_contacts` (ver abajo)**

---

## 📝 Formulario de Nuevo Proyecto

### Campos Automáticos (NO se implementan en el formulario)

Estos campos se generan automáticamente por la base de datos o triggers, **NO deben aparecer en el formulario**:

| Campo | Generación | Descripción |
|------|------------|-------------|
| `id` | ✅ **Automático** | UUID generado automáticamente por PostgreSQL al insertar |
| `internal_ref` | ✅ **Automático** | Referencia secuencial generada por trigger (ej: `"0034"`, `"0035"`) |
| `total_billing` | ✅ **Automático** | Se inicializa en `0.00` y se calcula automáticamente mediante trigger cuando se crean facturas |
| `created_at` | ✅ **Automático** | Timestamp generado automáticamente al crear el registro |
| `updated_at` | ✅ **Automático** | Timestamp actualizado automáticamente mediante trigger en cada modificación |

**Nota importante**: Estos campos **NO deben ser editables** en el formulario. Se generan/calculan automáticamente.

---

### Campos a Implementar en el Formulario

#### 1. Cliente (Obligatorio)

| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `client_id` | Select/Dropdown | ✅ **Sí** | - Debe seleccionarse un cliente de la lista | Cliente al que pertenece el proyecto |

**Implementación:**
- Dropdown con lista de clientes activos (`is_active = true`)
- Cargar clientes mediante `fetchActiveClients()`
- Mostrar `commercial_name` o `fiscal_name` (priorizar comercial)
- Campo obligatorio con validación
- **NOTA IMPORTANTE**: El proyecto **SIEMPRE debe estar asignado a un cliente**

---

#### 2. Número de Pedido del Cliente (Opcional)

| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `client_po_number` | Text Input | ❌ No | - Máximo 255 caracteres | Número de pedido o referencia que el cliente proporciona |

**Implementación:**
- Input de texto opcional
- Placeholder: `"PO-2025-001"` o similar
- Texto de ayuda: "Número de pedido o referencia que el cliente proporciona"
- Ejemplos: `"PO-2025-001"`, `"REF-12345"`, `"ORD-2025-ABC"`

---

#### 3. Información del Proyecto

| Campo | Tipo | Obligatorio | Validación | Transformación |
|-------|------|-------------|------------|-----------------|
| `name` | Text Input | ✅ **Sí** | - No vacío<br>- Máximo 255 caracteres | Trim de espacios |
| `status` | Select/Dropdown | ❌ No | - Selección de lista predefinida | Por defecto: `"borrador"` |
| `description` | Textarea | ❌ No | - Máximo 5000 caracteres | Trim de espacios |
| `budget_estimated` | Number Input | ❌ No | - Si se rellena, debe ser numérico<br>- Valor >= 0 | Convertir a número (2 decimales) |

**Implementación:**
- Campo `name`: Input de texto obligatorio con validación
- Campo `status`: Dropdown con opciones:
  - `"borrador"` (por defecto)
  - `"presupuestado"`
  - `"aceptado"`
  - `"ejecutando"`
  - `"finalizado"`
  - `"cancelado"`
- Campo `description`: Textarea multilínea opcional
- Campo `budget_estimated`: Input numérico con 2 decimales, formato moneda (€)

---

#### 4. Ubicación del Proyecto (Opcional)

| Campo | Tipo | Obligatorio | Validación | Transformación |
|-------|------|-------------|------------|-----------------|
| `location_name` | Text Input | ❌ No | - Máximo 255 caracteres | Trim de espacios |
| `location_address.street` | Text Input | ❌ No | - Si se rellena, aplicar formato título | Formato título |
| `location_address.city` | Text Input | ❌ No | - Si se rellena, aplicar formato título | Formato título |
| `location_address.zip` | Text Input | ❌ No | - Si se rellena, formato código postal (5 dígitos) | Validar formato numérico |
| `location_address.province` | Select/Dropdown | ❌ No | - Selección de provincia española | Formato título |
| `location_address.country` | Text Input | ❌ No | - Por defecto "España" | Mantener mayúsculas en nombres propios |

**Implementación:**
- Sección "Ubicación del Proyecto" con campos estructurados
- Campo `location_name`: Input de texto (ej: "Centro de Convenciones Cuenca")
- Dirección estructurada (misma estructura que direcciones de clientes):
  - `street`: Calle y número
  - `city`: Ciudad
  - `zip`: Código postal (5 dígitos, validar si se rellena)
  - `province`: Dropdown con provincias españolas
  - `country`: Input de texto (por defecto "España")
- **Transformación automática**: Aplicar formato título a `street`, `city`, `province` antes de guardar
- **Nota**: `location_coords` (coordenadas GPS) se puede añadir en el futuro mediante integración con mapas

---

#### 5. Fechas (Opcional)

| Campo | Tipo | Obligatorio | Validación | Descripción |
|-------|------|-------------|------------|-------------|
| `start_date` | Date Input | ❌ No | - Si se rellena `end_date`, debe ser anterior o igual | Fecha de inicio del proyecto |
| `end_date` | Date Input | ❌ No | - Si se rellena, debe ser posterior o igual a `start_date` | Fecha de finalización del proyecto |

**Implementación:**
- Campo `start_date`: Input de fecha (date picker)
- Campo `end_date`: Input de fecha (date picker)
- Validación: `end_date >= start_date` (si ambos están rellenados)
- **Nota**: Las fechas se almacenan como `TIMESTAMPTZ` en la BD, pero en el formulario se pueden mostrar solo la fecha (sin hora)

---

### Validaciones del Formulario

#### Validaciones en Frontend (antes de enviar):

1. **Campos obligatorios:**
   - `client_id`: Debe estar seleccionado (no puede ser vacío)
   - `name`: No puede estar vacío

2. **Validación de formato:**
   - `budget_estimated`: Si se rellena, debe ser un número válido (>= 0)
   - `location_address.zip`: Si se rellena, debe tener 5 dígitos numéricos

3. **Validación de fechas:**
   - Si se rellenan ambas fechas, `end_date` debe ser posterior o igual a `start_date`
   - Mostrar mensaje de error si `end_date < start_date`

#### Transformaciones Automáticas (antes de guardar):

1. **Direcciones a formato título:**
   ```javascript
   location_address.street = toTitleCase(location_address.street.trim())
   location_address.city = toTitleCase(location_address.city.trim())
   location_address.province = toTitleCase(location_address.province)
   // country mantiene mayúsculas en nombres propios
   ```

2. **Limpieza de campos:**
   ```javascript
   name = name.trim()
   description = description.trim() || null
   client_po_number = client_po_number.trim() || null
   location_name = location_name.trim() || null
   budget_estimated = budget_estimated ? parseFloat(budget_estimated) : null
   ```

---

### Flujo de Creación de Proyecto

```
1. Usuario hace clic en "Nuevo Proyecto"
2. Se muestra formulario vacío
3. Se cargan automáticamente los clientes activos en el dropdown
4. Usuario rellena campos obligatorios:
   - client_id (selecciona cliente del dropdown)
   - name (nombre del proyecto)
5. Usuario rellena campos opcionales (si lo desea):
   - client_po_number (número de pedido del cliente)
   - status (por defecto "borrador")
   - description
   - budget_estimated
   - location_name y location_address
   - start_date y end_date
6. Usuario hace clic en "Guardar"
7. Frontend valida campos obligatorios y formatos
8. Frontend aplica transformaciones (formato título en direcciones)
9. Si todo es válido, se envía POST a API:
   {
     client_id: "880e8400-...",
     client_po_number: "PO-2025-001",
     name: "Instalación Monitores Cuenca",
     status: "borrador",
     description: "Instalación de monitores LED...",
     budget_estimated: 5000.00,
     location_name: "Centro de Convenciones",
     location_address: { ... },
     start_date: "2025-01-15",
     end_date: "2025-02-15"
   }
10. Backend recibe datos y:
    - Genera UUID para `id`
    - Genera `internal_ref` mediante trigger (0034, 0035, etc.)
    - Inicializa `total_billing = 0.00`
    - Genera `created_at` y `updated_at`
    - Inserta registro en BD
11. Trigger de `internal_ref` se ejecuta automáticamente
12. Trigger de `total_projects` en `clients` se ejecuta automáticamente (incrementa contador del cliente)
13. Se retorna el proyecto creado con todos los campos (incluidos los automáticos)
14. Frontend muestra mensaje de éxito y actualiza el listado
```

---

### Funcionalidades Adicionales a Implementar

1. **Búsqueda de clientes en el dropdown**
   - Permitir buscar clientes por nombre o CIF/NIF en el dropdown
   - Autocompletado mientras se escribe

2. **Autocompletado de provincia por código postal**
   - Al introducir el código postal, sugerir automáticamente la provincia

3. **Integración con mapas para coordenadas**
   - Botón "Obtener coordenadas desde dirección" que use la API de geocodificación
   - O permitir seleccionar en un mapa interactivo

4. **Cálculo automático de fecha de fin**
   - Opción "Calcular fecha de fin automáticamente" basado en duración estimada
   - Si se selecciona, calcular `end_date = start_date + X días`

5. **Vista previa antes de guardar**
   - Mostrar resumen de datos antes de confirmar creación

6. **Plantillas de proyecto**
   - Permitir crear proyectos desde plantillas predefinidas
   - Cargar valores por defecto según tipo de proyecto

---

### Notas de Implementación

- **NO incluir campos automáticos** en el formulario (`id`, `internal_ref`, `total_billing`, `created_at`, `updated_at`)
- **Cliente es OBLIGATORIO**: El proyecto siempre debe estar asignado a un cliente
- **Número de pedido del cliente**: Campo importante para referencias del cliente, debe ser fácil de encontrar
- **Aplicar transformaciones** (formato título en direcciones) antes de enviar a la API
- **Validar formatos** en frontend antes de enviar
- **Manejar errores** de validación y mostrar mensajes claros al usuario
- **Confirmar éxito** después de crear el proyecto y actualizar el listado
- **Estado por defecto**: Todos los proyectos nuevos se crean como `status = "borrador"`
- **Ubicación opcional**: No todos los proyectos requieren ubicación (algunos son virtuales o administrativos)
- **Fechas opcionales**: Se pueden crear proyectos sin fechas y añadirlas después

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
| `total_billing` | NUMERIC(12,2) | **Total facturado del proyecto** (calculado automáticamente) | `12500.50` |
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
- **Total de Facturación**: Se calcula automáticamente sumando el campo `totals_data.total` de todas las facturas (`sales_documents`) donde:
  - `project_id = projects.id`
  - `type = 'factura'` (solo facturas definitivas, no presupuestos ni proformas)
  - `status IN ('cobrada', 'aceptada')` (solo facturas cobradas o aceptadas)
  - Se actualiza mediante trigger o función cuando se crean/modifican/eliminan facturas
  - Permite mostrar el total facturado en el listado de proyectos sin necesidad de JOINs complejos
  - **IMPORTANTE**: El cálculo se realiza automáticamente al cargar los proyectos, mostrando la suma total de facturación de cada proyecto
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

**Nota sobre Calculadora de Pantallas LED:**
La sección `/calculadora` utilizará los datos de este módulo (especialmente productos de Pantalla LED) para realizar cálculos estimativos de costes de alquiler. La herramienta consultará:
- `inventory_items` con `category_id = "Pantalla LED"` para obtener productos disponibles
- `rental_price_12m`, `rental_price_18m`, `rental_price_daily` para diferentes tipos de contratos
- Dimensiones y especificaciones técnicas de los productos para calcular componentes necesarios
- Servicios relacionados (como "Gestión de Contenidos") para incluir en el cálculo total

Esta herramienta será desarrollada en el futuro y permitirá a los comerciales realizar estimaciones rápidas durante visitas a clientes.

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
| `stock_warehouse` | INTEGER | **Cantidad física en almacén** (solo si `is_stockable = true`) | `50` |
| `stock_rented` | INTEGER | **Cantidad actualmente en proyectos** (calculado vía albaranes no devueltos) | `10` |
| `stock_committed` | INTEGER | **Cantidad reservada en presupuestos aceptados pero no entregados** | `5` |
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
- **Gestión de Stock para Alquileres:**
  - `stock_warehouse`: Cantidad física disponible en almacén (se actualiza con albaranes de entrada/salida)
  - `stock_rented`: Cantidad actualmente en proyectos (calculado automáticamente desde `delivery_notes` con `type = 'outbound'` y `status = 'confirmed'` que no tienen albarán de retorno correspondiente)
  - `stock_committed`: Cantidad reservada en presupuestos aceptados pero aún no entregados (calculado desde `sales_documents` con `type = 'presupuesto'` y `status = 'aceptado'` que no tienen albarán de salida)
  - Estos campos permiten gestionar alquileres y saber qué stock está disponible vs. comprometido vs. en uso
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
| `document_number` | TEXT | Número de documento | `"E250061"` (presupuesto), `"FP250061"` (proforma), `"F-250061"` (factura) |
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
| `related_document_id` | FK (UUID) | Documento relacionado (ej: Factura vinculada a su Proforma/Presupuesto de origen) | UUID → `sales_documents.id` |
| `rectifies_document_id` | FK (UUID) | Si es rectificativa, documento original | UUID → `sales_documents.id` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Notas sobre campos de fecha:**
- `date_issued`: Fecha de emisión del documento (visible en PDF y listados)
- `date_due`: Fecha de vencimiento del documento (visible en PDF y listados)
- `created_at`: Fecha de creación del registro (auditoría interna)
- `updated_at`: **Fecha de última actualización** - Se muestra en los listados de Presupuestos, Proformas, Facturas y Rectificativas para indicar cuándo fue la última modificación del documento

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
- `related_document_id` permite vincular una Factura a su Proforma o Presupuesto de origen (trazabilidad del flujo de ventas)
  - Ejemplo: Una Factura puede tener `related_document_id` apuntando a su Proforma de origen
  - Facilita el seguimiento del flujo: Presupuesto → Proforma → Factura
- `rectifies_document_id` solo se usa cuando `type = 'rectificativa'`
  - **CRÍTICO**: Las rectificativas SOLO pueden crearse desde facturas (`type = 'factura'`)
  - No se pueden crear rectificativas desde presupuestos ni proformas
  - Validar que el documento referenciado sea una factura antes de guardar
- Los totales en `totals_data` se calculan automáticamente desde las líneas
- Las rectificativas pueden tener totales negativos (para anular conceptos)

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

## Módulo: Logística (Albaranes)

Gestiona el movimiento físico de material sin impacto contable inmediato. Permite desvincular el flujo logístico del flujo financiero para gestionar alquileres y proyectos de larga duración.

### Tabla: `delivery_notes`

Cabecera de albaranes (entregas y devoluciones de material).

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `document_number` | TEXT | Número de albarán (único) | `"ALB-25001"` |
| `project_id` | FK (UUID) | **Proyecto asociado (OBLIGATORIO)** | UUID → `projects.id` |
| `client_id` | FK (UUID) | Cliente asociado (opcional, para referencia) | UUID → `clients.id` |
| `type` | ENUM | Tipo de movimiento | `outbound` (salida/entrega), `inbound` (retorno/devolución) |
| `status` | ENUM | Estado del albarán | `draft` (borrador), `confirmed` (confirmado), `cancelled` (cancelado) |
| `date_issued` | DATE | Fecha efectiva del movimiento | `2025-01-15` |
| `notes` | TEXT | Observaciones logísticas | Notas sobre el movimiento |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Tipos de movimiento:**
- `outbound`: Salida de material del almacén hacia un proyecto (entrega)
- `inbound`: Retorno de material desde un proyecto al almacén (devolución)

**Estados:**
- `draft`: Albarán en creación (no afecta stock)
- `confirmed`: Albarán confirmado (afecta stock: `outbound` disminuye `stock_warehouse`, `inbound` aumenta `stock_warehouse`)
- `cancelled`: Albarán cancelado (no afecta stock)

**Notas CRÍTICAS:**
- **Todo movimiento pertenece a un proyecto**: `project_id` es OBLIGATORIO
- Al confirmar un albarán `outbound`, se actualiza automáticamente:
  - `inventory_items.stock_warehouse` disminuye
  - `inventory_items.stock_rented` aumenta (calculado desde albaranes confirmados sin retorno)
- Al confirmar un albarán `inbound`, se actualiza automáticamente:
  - `inventory_items.stock_warehouse` aumenta
  - `inventory_items.stock_rented` disminuye (se elimina del cálculo)
- El formato de `document_number` es `ALB-{YY}{NNNNN}` (ej: `ALB-25001`)
- `client_id` es opcional pero útil para referencia rápida

---

### Tabla: `delivery_note_lines`

Líneas individuales de cada albarán (ítems físicos movidos).

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `delivery_note_id` | FK (UUID) | Albarán padre | UUID → `delivery_notes.id` |
| `item_id` | FK (UUID) | Producto físico del inventario | UUID → `inventory_items.id` |
| `quantity` | NUMERIC(10, 2) | Cantidad movida | `5.00` |
| `description` | TEXT | Descripción (copiado del item o personalizado) | `"Pantalla LED 2x2"` |
| `serial_number` | TEXT | Número de serie (opcional, para trazabilidad futura) | `"LED-2025-001"` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |

**Notas:**
- `item_id` debe apuntar a un `inventory_item` con `is_stockable = true`
- `quantity` puede ser decimal para casos especiales (ej: metros de cable)
- `serial_number` es opcional pero preparado para futura trazabilidad de equipos
- `description` se puede copiar automáticamente del `inventory_item.name` o personalizar

---

## Módulo: Compras y Gastos

Control de compras, gastos y proveedores. Corresponde a `/compras` y `/proveedores`. Permite controlar el margen real de los proyectos mediante previsión de costes vs. costes reales.

**📚 Documentación completa del módulo de Proveedores**: Ver `docs/proveedores.md` para la guía completa de desarrollo, estructura de páginas, componentes y funcionalidades por tipo de proveedor.

### Tabla: `purchase_orders`

Pedidos de compra / Previsión de gasto. Permite registrar cotizaciones de proveedores antes de recibir la factura para control de costes (previsión vs. real).

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `project_id` | FK (UUID) | **Proyecto asociado (OBLIGATORIO)** - Para imputación de costes | UUID → `projects.id` |
| `supplier_id` | FK (UUID) | Proveedor asociado (opcional) | UUID → `suppliers.id` |
| `document_number` | TEXT | Referencia interna de pedido | `"PO-25001"` |
| `description` | TEXT | Descripción del pedido | `"Servicio Técnico Sonido Evento X"` |
| `estimated_amount` | NUMERIC(10, 2) | **Importe Cotizado (Previsión)** | `500.00` |
| `status` | ENUM | Estado del pedido | `pending` (pendiente), `fulfilled` (cumplido), `cancelled` (cancelado) |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Estados:**
- `pending`: Pedido pendiente (previsión activa)
- `fulfilled`: Pedido cumplido (se recibió la factura real vinculada)
- `cancelled`: Pedido cancelado (no se realizará)

**Notas CRÍTICAS:**
- **Lógica de Control de Costes:**
  - Se crea un `purchase_order` con el presupuesto que nos da el proveedor (ej: 500€)
  - En el Dashboard del Proyecto, se muestra: "Previsto: 500€"
  - Cuando llega la factura real, se sube a `expenses` y se vincula al `purchase_order` mediante `expenses.purchase_order_id`
  - Si la factura es de 550€, el Dashboard actualiza: "Real: 550€ (Desvío +50€)"
- `project_id` es OBLIGATORIO para imputar costes a proyectos
- `estimated_amount` es el importe cotizado por el proveedor (previsión)
- El formato de `document_number` es `PO-{YY}{NNNNN}` (ej: `PO-25001`)
- Cuando un `expense` tiene `purchase_order_id`, significa que es la "realización" de esa previsión

---

**📚 Documentación completa del módulo de Proveedores**: Ver `docs/proveedores.md` para la guía completa de desarrollo, estructura de páginas, componentes y funcionalidades por tipo de proveedor.

### Tabla: `suppliers`

Proveedores y suministradores de la empresa.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `internal_code` | TEXT | Código interno único (generado automáticamente) | `"PROV-0001"`, `"PROV-0002"` |
| `fiscal_name` | TEXT | Razón social fiscal | `"PROVEEDOR XYZ SL"` |
| `commercial_name` | TEXT | Nombre comercial (opcional) | `"Proveedor XYZ"` |
| `cif` | TEXT | CIF/NIF del proveedor | `"B12345678"` |
| `category` | ENUM | Categoría del proveedor | `tecnico_freelance`, `material`, `transporte`, `software`, `externo` |
| `freelance_profile_id` | FK (UUID) | Si es técnico, perfil asociado | UUID → `profiles.id` |
| `address` | JSONB | Dirección estructurada | `{"street": "...", "city": "...", "zip": "...", "province": "...", "country": "..."}` |
| `contact_email` | TEXT | Email de contacto | `"contacto@proveedor.com"` |
| `contact_phone` | TEXT | Teléfono de contacto | `"+34 123 456 789"` |
| `payment_terms_days` | INTEGER | Días de pago | `30` |
| `total_billing` | NUMERIC(12,2) | **Total pagado al proveedor** (calculado automáticamente) | `12500.50` |
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
- **Total Pagado**: Se calcula automáticamente sumando el campo `amount_total` de todas las facturas/gastos (`expenses`) donde:
  - `supplier_id = suppliers.id`
  - `status IN ('aprobado', 'pagado')` (solo gastos aprobados o pagados)
  - Se actualiza mediante trigger o función cuando se crean/modifican/eliminan gastos
  - Permite mostrar el total pagado en el listado de proveedores sin necesidad de JOINs complejos
  - **IMPORTANTE**: El cálculo se realiza automáticamente al cargar los proveedores, mostrando la suma total pagada a cada proveedor

---

### Tabla: `expenses`

Gastos y compras de la empresa.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `supplier_id` | FK (UUID) | Proveedor asociado | UUID → `suppliers.id` |
| `project_id` | FK (UUID) | Proyecto asociado (para imputar coste) | UUID → `projects.id` |
| `purchase_order_id` | FK (UUID) | **Pedido de compra asociado** (si este gasto es la realización de una previsión) | UUID → `purchase_orders.id` |
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
- `purchase_order_id` vincula el gasto real con su previsión (pedido de compra)
  - Si esta columna tiene valor, el gasto es la "realización" de esa previsión
  - Permite comparar previsión (`purchase_orders.estimated_amount`) vs. real (`expenses.amount_total`)
  - Cuando se vincula un gasto a un pedido, el estado del pedido puede cambiar a `fulfilled`
- `file_url` almacena la foto/escaneo del ticket o factura
- Corresponde a `/compras/gastos` (renombrado desde `/gastos/tickets`)

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
                ├──> purchase_orders (N)
                │
                └──> project_staffing (N) [si es freelance]

inventory_categories (1) ──> inventory_items (N)

projects (1) ──┬──> delivery_notes (N)
               │
               └──> purchase_orders (N)

delivery_notes (1) ──> delivery_note_lines (N)

delivery_note_lines (N) ──> inventory_items (1)

purchase_orders (1) ──> expenses (N) [mediante purchase_order_id]
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

4. **Proyectos → Gastos y Previsiones**
   - Los gastos se pueden imputar a proyectos para calcular márgenes
   - Los pedidos de compra (`purchase_orders`) permiten registrar previsiones de costes
   - Cuando un gasto (`expense`) se vincula a un pedido (`purchase_order_id`), se puede comparar previsión vs. real
   - Permite análisis de rentabilidad por proyecto y control de desvíos

5. **Proyectos → Logística (Albaranes)**
   - Todo movimiento de material (`delivery_notes`) pertenece a un proyecto
   - Los albaranes de salida (`outbound`) disminuyen `stock_warehouse` y aumentan `stock_rented`
   - Los albaranes de entrada (`inbound`) aumentan `stock_warehouse` y disminuyen `stock_rented`
   - Permite gestionar alquileres y controlar el stock físico sin impacto contable inmediato

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
   - Formato: `"E250061"` (presupuestos), `"FP250061"` (proformas), `"F-250061"` (facturas), `"RT-250061"` (rectificativas)
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

4. **Actualización de `total_billing` en `clients`**
   - Trigger que actualiza automáticamente `clients.total_billing` cuando se crean/modifican/eliminan facturas
   - Se ejecuta cuando:
     - Se crea una nueva factura (`type = 'factura'` y `status IN ('cobrada', 'aceptada')`)
     - Se modifica el estado de una factura (cambio a 'cobrada' o 'aceptada')
     - Se elimina una factura
     - Se modifica el `totals_data.total` de una factura existente
   - Cálculo: `SUM(totals_data->>'total')` de todas las facturas del cliente donde:
     - `client_id = clients.id`
     - `type = 'factura'` (solo facturas definitivas, no presupuestos ni proformas)
     - `status IN ('cobrada', 'aceptada')` (solo facturas cobradas o aceptadas)
   - Permite mostrar el total facturado en el listado de clientes sin necesidad de JOINs complejos

5. **Actualización de `total_billing` en `projects` (AUTOMÁTICO)**
   - **Trigger automático** que actualiza `projects.total_billing` cuando se crean/modifican/eliminan facturas
   - **Se ejecuta automáticamente al guardar una factura nueva** (al darle al botón de guardar)
   - **No requiere intervención manual**, es completamente automático
   - Se ejecuta cuando:
     - ✅ **Se crea una nueva factura** (`type = 'factura'` y `status IN ('cobrada', 'aceptada')` y `project_id` no es null) → Incrementa el total del proyecto automáticamente
     - Se modifica el estado de una factura (cambio a 'cobrada' o 'aceptada') → Recalcula el total del proyecto
     - Se modifica el `totals_data.total` de una factura existente → Recalcula el total del proyecto
     - Se modifica el `project_id` de una factura (cambio de proyecto) → Recalcula ambos proyectos
     - Se elimina una factura → Decrementa el total del proyecto automáticamente
   - Cálculo: `SUM(totals_data->>'total')` de todas las facturas donde:
     - `project_id = projects.id`
     - `type = 'factura'` (solo facturas definitivas, no presupuestos ni proformas)
     - `status IN ('cobrada', 'aceptada')` (solo facturas cobradas o aceptadas)
   - **Flujo automático**: Usuario crea factura → Guarda → Trigger se ejecuta → `total_billing` se actualiza automáticamente
   - Permite mostrar el total facturado en el listado de proyectos sin necesidad de JOINs complejos
   
   **Ejemplo de implementación del trigger:**
   ```sql
   -- Función que recalcula total_billing para un proyecto
   CREATE OR REPLACE FUNCTION update_project_total_billing()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Si se crea o modifica una factura, recalcular el proyecto afectado
     IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
       -- Solo si es factura y está cobrada/aceptada y tiene project_id
       IF NEW.type = 'factura' AND NEW.status IN ('cobrada', 'aceptada') AND NEW.project_id IS NOT NULL THEN
         UPDATE projects 
         SET total_billing = (
           SELECT COALESCE(SUM((totals_data->>'total')::NUMERIC), 0)
           FROM sales_documents 
           WHERE project_id = NEW.project_id
             AND type = 'factura'
             AND status IN ('cobrada', 'aceptada')
         )
         WHERE id = NEW.project_id;
       END IF;
       
       -- Si se cambió el project_id, recalcular ambos proyectos
       IF TG_OP = 'UPDATE' AND OLD.project_id IS DISTINCT FROM NEW.project_id THEN
         -- Recalcular proyecto anterior
         IF OLD.project_id IS NOT NULL THEN
           UPDATE projects 
           SET total_billing = (
             SELECT COALESCE(SUM((totals_data->>'total')::NUMERIC), 0)
             FROM sales_documents 
             WHERE project_id = OLD.project_id
               AND type = 'factura'
               AND status IN ('cobrada', 'aceptada')
           )
           WHERE id = OLD.project_id;
         END IF;
       END IF;
     END IF;
     
     -- Si se elimina una factura, recalcular el proyecto afectado
     IF TG_OP = 'DELETE' THEN
       IF OLD.type = 'factura' AND OLD.project_id IS NOT NULL THEN
         UPDATE projects 
         SET total_billing = (
           SELECT COALESCE(SUM((totals_data->>'total')::NUMERIC), 0)
           FROM sales_documents 
           WHERE project_id = OLD.project_id
             AND type = 'factura'
             AND status IN ('cobrada', 'aceptada')
         )
         WHERE id = OLD.project_id;
       END IF;
     END IF;
     
     RETURN COALESCE(NEW, OLD);
   END;
   $$ LANGUAGE plpgsql;
   
   -- Trigger que se ejecuta automáticamente al crear/modificar/eliminar facturas
   CREATE TRIGGER trigger_update_project_total_billing
   AFTER INSERT OR UPDATE OF type, status, totals_data, project_id OR DELETE ON sales_documents
   FOR EACH ROW
   EXECUTE FUNCTION update_project_total_billing();
   ```

6. **Actualización de `total_projects` en `clients` (AUTOMÁTICO)**
   - **Trigger automático** que actualiza `clients.total_projects` cuando se crean/modifican/eliminan proyectos
   - **Se ejecuta automáticamente al guardar un proyecto nuevo** (al darle al botón de guardar)
   - **No requiere intervención manual**, es completamente automático
   - Se ejecuta cuando:
     - ✅ **Se crea un nuevo proyecto** → Incrementa el contador del cliente automáticamente
     - Se modifica el `client_id` de un proyecto (cambio de cliente) → Recalcula ambos clientes
     - Se elimina un proyecto → Decrementa el contador del cliente automáticamente
   - Cálculo: `COUNT(*)` de todos los proyectos donde:
     - `client_id = clients.id`
     - Incluye todos los proyectos independientemente del estado (borrador, presupuestado, aceptado, ejecutando, finalizado, cancelado)
   - **Flujo automático**: Usuario crea proyecto → Guarda → Trigger se ejecuta → `total_projects` se actualiza automáticamente
   - Permite mostrar el total de proyectos realizados en el listado de clientes sin necesidad de JOINs complejos
   
   **Ejemplo de implementación del trigger:**
   ```sql
   -- Función que recalcula total_projects para un cliente
   CREATE OR REPLACE FUNCTION update_client_total_projects()
   RETURNS TRIGGER AS $$
   BEGIN
     -- Si se crea o modifica un proyecto, recalcular el cliente afectado
     IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
       UPDATE clients 
       SET total_projects = (
         SELECT COUNT(*) 
         FROM projects 
         WHERE client_id = NEW.client_id
       )
       WHERE id = NEW.client_id;
     END IF;
     
     -- Si se elimina un proyecto, recalcular el cliente afectado
     IF TG_OP = 'DELETE' THEN
       UPDATE clients 
       SET total_projects = (
         SELECT COUNT(*) 
         FROM projects 
         WHERE client_id = OLD.client_id
       )
       WHERE id = OLD.client_id;
     END IF;
     
     RETURN COALESCE(NEW, OLD);
   END;
   $$ LANGUAGE plpgsql;
   
   -- Trigger que se ejecuta automáticamente al crear/modificar/eliminar proyectos
   CREATE TRIGGER trigger_update_client_total_projects
   AFTER INSERT OR UPDATE OF client_id OR DELETE ON projects
   FOR EACH ROW
   EXECUTE FUNCTION update_client_total_projects();
   ```

7. **Snapshot del cliente al emitir documento (CRÍTICO)**
   - Trigger o función que copia los datos del cliente a `client_snapshot` cuando `status` cambia a `enviado` o `aceptado`
   - Garantiza inmutabilidad fiscal de los documentos emitidos

8. **Validación de direcciones**
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

