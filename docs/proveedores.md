# 📦 Módulo: Proveedores

Este documento describe la estructura, funcionalidad y desarrollo del módulo de Proveedores de la plataforma NEXOAV.

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Navegación](#estructura-de-navegación)
3. [Tipos de Proveedores](#tipos-de-proveedores)
4. [Estructura de Datos](#estructura-de-datos)
5. [Páginas y Componentes](#páginas-y-componentes)
6. [Funcionalidades por Tipo](#funcionalidades-por-tipo)
7. [Componentes Reutilizables](#componentes-reutilizables)
8. [Flujos de Trabajo](#flujos-de-trabajo)
9. [Guía de Implementación](#guía-de-implementación)

---

## Visión General

El módulo de Proveedores gestiona todos los proveedores y suministradores de la empresa, organizados por categorías según su tipo de servicio o producto. Permite:

- **Gestión centralizada** de proveedores
- **Control de costes** mediante tarifas vinculadas a servicios de venta
- **Cálculo automático de márgenes** (precio venta - coste proveedor)
- **Análisis de rentabilidad** por proveedor y servicio
- **Asignación de técnicos** a proyectos
- **Gestión de compras** y gastos por proveedor

---

## Estructura de Navegación

El módulo de Proveedores tiene una estructura jerárquica:

```
/proveedores                    # Página principal (resumen)
├── /proveedores/tecnicos       # Técnicos freelance (category = "tecnico_freelance")
├── /proveedores/materiales     # Proveedores de material (category = "material")
├── /proveedores/softwares      # Proveedores de software/SaaS (category = "software")
└── /proveedores/externos       # Otros proveedores externos (category = "externo")
```

### Página Principal (`/proveedores`)

**Propósito**: Resumen general de todos los proveedores

**Contenido**:
- Tarjetas de resumen por tipo de proveedor (total, activos, inactivos)
- Gráficos de distribución por categoría
- Listado resumido de proveedores recientes
- Accesos rápidos a cada subpágina

**Similar a**: Página de Inicio pero enfocada en proveedores

---

## Tipos de Proveedores

### 1. Técnicos (`tecnico_freelance`)

**Ruta**: `/proveedores/tecnicos`

**Descripción**: Técnicos externos y freelances que proporcionan mano de obra para proyectos.

**Características**:
- Proveedores de servicios de instalación, mantenimiento y soporte técnico
- Pueden ser autónomos o empresas
- Tienen tarifas vinculadas a servicios de venta (`supplier_rates`)
- Se asignan a proyectos mediante `project_staffing`
- Permiten calcular márgenes: precio venta (servicio) - coste técnico = margen

**Ejemplos**:
- Carlos Matos (autónomo)
- David Palacios (autónomo)
- FLOWIT VISUAL SL (empresa)
- NAV SOLUTIONS (empresa)

**Campos específicos**:
- `freelance_profile_id`: Si el técnico tiene perfil en RRHH, vinculación opcional
- `supplier_rates`: Tarifas por tipo de servicio (jornada, hora extra, etc.)

**Funcionalidades**:
- Listado de técnicos con tarifas
- Asignación a proyectos
- Cálculo automático de costes estimados
- Comparación real vs estimado (cuando llega la factura)

---

### 2. Materiales (`material`)

**Ruta**: `/proveedores/materiales`

**Descripción**: Proveedores de productos físicos y materiales.

**Características**:
- Proveedores de productos físicos (pantallas LED, cables, tornillería, etc.)
- Pueden ser proveedores nacionales o internacionales
- Productos vinculados mediante `inventory_items.primary_supplier_id`
- Permiten ver precios de compra vs precios de venta

**Ejemplos**:
- ADRICO MULTIMEDIA SL (pantallas LED)
- OBRAMAT (materiales de bricolaje)
- Shenzhen SRYLED (proveedor internacional de pantallas LED)

**Funcionalidades**:
- Listado de proveedores de material
- Productos asociados a cada proveedor
- Comparación de precios entre proveedores
- Gestión de pedidos y compras

---

### 3. Softwares (`software`)

**Ruta**: `/proveedores/softwares`

**Descripción**: Proveedores de software, SaaS y servicios digitales.

**Características**:
- Proveedores de servicios de software (SaaS, licencias, herramientas)
- Suscripciones recurrentes
- Facturación mensual/anual
- Gestión de renovaciones

**Ejemplos**:
- Proveedores de herramientas de diseño
- Servicios de hosting
- Software de gestión
- Plataformas SaaS

**Funcionalidades**:
- Listado de proveedores de software
- Gestión de suscripciones
- Control de renovaciones
- Costes recurrentes

---

### 4. Externos (`externo`)

**Ruta**: `/proveedores/externos`

**Descripción**: Otros proveedores externos (gestoría, contabilidad, asesoría, etc.).

**Características**:
- Servicios profesionales externos
- No son técnicos ni materiales
- Servicios administrativos, legales, contables, etc.

**Ejemplos**:
- Gestoría
- Contabilidad
- Asesoría legal
- Seguros
- Servicios de limpieza

**Funcionalidades**:
- Listado de proveedores externos
- Gestión de servicios contratados
- Control de costes administrativos

---

## Estructura de Datos

### Tabla: `suppliers`

**Ubicación en BD**: `docs/base-de-datos.md` (línea 1071)

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `name` | TEXT | Nombre del proveedor | `"Carlos Matos"`, `"ADRICO MULTIMEDIA SL"` |
| `cif` | TEXT | CIF/NIF del proveedor | `"47330622A"`, `"B44647931"` |
| `category` | ENUM | Categoría del proveedor | `tecnico_freelance`, `material`, `software`, `externo` |
| `address` | JSONB | Dirección estructurada | `{"street": "...", "city": "...", "zip": "...", "province": "...", "country": "..."}` |
| `contact_email` | TEXT | Email de contacto | `"mont-mat@outlook.com"` |
| `contact_phone` | TEXT | Teléfono de contacto | `"+34 604 379 175"` |
| `payment_terms_days` | INTEGER | Días de pago | `30` |
| `freelance_profile_id` | FK (UUID) | Si es técnico, perfil asociado (opcional) | UUID → `profiles.id` |
| `notes` | TEXT | Notas internas | Notas sobre el proveedor |
| `is_active` | BOOLEAN | Si el proveedor está activo | `true` |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Categorías**:
- `tecnico_freelance`: Técnicos y freelances
- `material`: Proveedores de materiales
- `software`: Proveedores de software/SaaS
- `externo`: Otros proveedores externos

**Notas importantes**:
- `category` determina en qué subpágina aparece el proveedor
- `address` es JSONB para permitir búsquedas geográficas
- `freelance_profile_id` solo se usa para técnicos que también tienen perfil en RRHH
- `is_active` permite desactivar proveedores sin eliminarlos

---

### Tabla: `supplier_rates`

**Ubicación en BD**: `docs/base-de-datos.md`

**Descripción**: Tarifas y costes de servicios contratados por proveedor. **Vinculado con servicios de venta** para cálculo automático de márgenes.

| Campo | Tipo | Descripción | Ejemplo |
|------|------|-------------|---------|
| `id` | PK (UUID) | Identificador único | UUID |
| `supplier_id` | FK (UUID) | Proveedor asociado | UUID → `suppliers.id` |
| `inventory_item_id` | FK (UUID) | **Servicio de venta vinculado** | UUID → `inventory_items.id` |
| `service_type` | TEXT | Tipo de servicio | `"jornada"`, `"hora_extra"`, `"media_jornada"` |
| `cost_price` | NUMERIC(10,2) | Coste que se paga al proveedor | `200.00` |
| `unit` | TEXT | Unidad de medida | `"día"`, `"hora"`, `"unidad"` |
| `year` | INTEGER | Año de la tarifa | `2026` |
| `is_active` | BOOLEAN | Si la tarifa está activa | `true` |
| `notes` | TEXT | Notas sobre la tarifa | Notas |
| `created_at` | TIMESTAMPTZ | Fecha de creación | Auto |
| `updated_at` | TIMESTAMPTZ | Fecha de última actualización | Auto |

**Uso y Beneficios**:
- **Cálculo automático de márgenes**: Precio de venta (de `inventory_items` o `price_lists`) - Coste del proveedor = Margen
- **Análisis de rentabilidad**: Permite calcular el beneficio medio por servicio
- **Control de costes**: Al asignar un técnico externo a un proyecto, se calcula automáticamente el `cost_agreed` estimado
- **Comparación real vs estimado**: Cuando llega la factura del proveedor en `expenses`, se compara con el estimado
- **Resumen mensual**: Permite generar informes de beneficios por servicio y por proveedor

**Ejemplo**:
- Servicio vendido: "Jornada Técnico General" a 280€ (Tarifa 2026)
- Coste proveedor: Carlos Matos a 200€
- **Margen**: 280€ - 200€ = 80€ por jornada

---

## Páginas y Componentes

### Estructura de Archivos

```
pages/proveedores/
├── desktop/
│   ├── Proveedores.tsx          # Página principal (resumen)
│   ├── Tecnicos.tsx             # Listado de técnicos
│   ├── Materiales.tsx           # Listado de materiales
│   ├── Softwares.tsx             # Listado de softwares
│   ├── Externos.tsx              # Listado de externos
│   └── index.ts
├── mobile/
│   ├── Proveedores.tsx
│   ├── Tecnicos.tsx
│   ├── Materiales.tsx
│   ├── Softwares.tsx
│   ├── Externos.tsx
│   └── index.ts
├── tablet/
│   ├── Proveedores.tsx
│   ├── Tecnicos.tsx
│   ├── Materiales.tsx
│   ├── Softwares.tsx
│   ├── Externos.tsx
│   └── index.ts
├── tablet-horizontal/
│   ├── Proveedores.tsx
│   ├── Tecnicos.tsx
│   ├── Materiales.tsx
│   ├── Softwares.tsx
│   ├── Externos.tsx
│   └── index.ts
├── components/
│   ├── ProveedoresList.tsx       # Componente reutilizable de listado
│   ├── NewSupplierModal.tsx      # Modal para crear nuevo proveedor
│   ├── SupplierRatesList.tsx    # Listado de tarifas (solo técnicos)
│   ├── SupplierProductsList.tsx  # Listado de productos (solo materiales)
│   └── SupplierCard.tsx          # Tarjeta de proveedor (para resumen)
└── index.ts
```

---

## Funcionalidades por Tipo

### 1. Técnicos (`/proveedores/tecnicos`)

#### Listado de Técnicos

**Componente**: `ProveedoresList` con filtro `category = "tecnico_freelance"`

**Columnas**:
- Nombre
- CIF/NIF
- Email
- Teléfono
- Tarifa jornada (desde `supplier_rates`)
- Estado (activo/inactivo)
- Acciones (editar, ver tarifas, asignar a proyecto)

**Filtros**:
- Búsqueda por nombre o CIF
- Estado (activo/inactivo)
- Provincia (desde `address.province`)

**Herramientas**:
- "Nuevo Técnico"
- "Exportar"
- "Ver tarifas" (modal con todas las tarifas)

#### Tarifas de Técnicos

**Componente**: `SupplierRatesList`

**Funcionalidad**:
- Mostrar todas las tarifas del técnico
- Vincular con servicios de venta (`inventory_item_id`)
- Mostrar margen calculado (precio venta - coste)
- Permitir crear/editar/eliminar tarifas
- Filtrar por año

**Columnas**:
- Servicio vinculado (nombre del `inventory_item`)
- Tipo de servicio
- Coste proveedor
- Precio venta (desde `inventory_items` o `price_lists`)
- Margen (calculado)
- Unidad
- Año
- Estado

---

### 2. Materiales (`/proveedores/materiales`)

#### Listado de Proveedores de Material

**Componente**: `ProveedoresList` con filtro `category = "material"`

**Columnas**:
- Nombre
- CIF/NIF
- Email
- Teléfono
- País (desde `address.country`)
- Total productos (contar `inventory_items` donde `primary_supplier_id = supplier.id`)
- Estado (activo/inactivo)
- Acciones (editar, ver productos, nueva compra)

**Filtros**:
- Búsqueda por nombre o CIF
- Estado (activo/inactivo)
- País
- Provincia

**Herramientas**:
- "Nuevo Proveedor"
- "Exportar"
- "Ver productos" (modal con productos asociados)

#### Productos Asociados

**Componente**: `SupplierProductsList`

**Funcionalidad**:
- Mostrar todos los productos donde `primary_supplier_id = supplier.id`
- Mostrar precios de compra vs precios de venta
- Mostrar margen calculado
- Permitir vincular/desvincular productos

**Columnas**:
- Código interno (`internal_code`)
- Nombre del producto
- Precio compra (`cost_price`)
- Precio venta (`base_price`)
- Margen (calculado)
- Stock actual
- Estado

---

### 3. Softwares (`/proveedores/softwares`)

#### Listado de Proveedores de Software

**Componente**: `ProveedoresList` con filtro `category = "software"`

**Columnas**:
- Nombre
- Email
- Teléfono
- Tipo de suscripción (si aplica)
- Coste mensual/anual
- Próxima renovación
- Estado (activo/inactivo)
- Acciones (editar, gestionar suscripción)

**Filtros**:
- Búsqueda por nombre
- Estado (activo/inactivo)
- Tipo de suscripción

**Herramientas**:
- "Nuevo Proveedor"
- "Exportar"
- "Gestionar suscripciones"

---

### 4. Externos (`/proveedores/externos`)

#### Listado de Proveedores Externos

**Componente**: `ProveedoresList` con filtro `category = "externo"`

**Columnas**:
- Nombre
- CIF/NIF
- Email
- Teléfono
- Tipo de servicio (gestoría, contabilidad, etc.)
- Estado (activo/inactivo)
- Acciones (editar, ver gastos)

**Filtros**:
- Búsqueda por nombre o CIF
- Estado (activo/inactivo)
- Tipo de servicio

**Herramientas**:
- "Nuevo Proveedor"
- "Exportar"
- "Ver gastos" (filtrar `expenses` por `supplier_id`)

---

## Componentes Reutilizables

### `ProveedoresList`

**Ubicación**: `pages/proveedores/components/ProveedoresList.tsx`

**Propósito**: Componente reutilizable para listar proveedores con filtros por categoría.

**Props**:
```typescript
interface ProveedoresListProps {
  category?: "tecnico_freelance" | "material" | "software" | "externo";
  showFilters?: boolean;
  showTools?: boolean;
  onSupplierClick?: (supplier: SupplierData) => void;
  onSupplierCreated?: (supplier: SupplierData) => void;
}
```

**Funcionalidades**:
- Listado con columnas responsivas
- Filtros por categoría, estado, búsqueda
- Herramientas (nuevo, exportar)
- Integración con `DataList` component

---

### `NewSupplierModal`

**Ubicación**: `pages/proveedores/components/NewSupplierModal.tsx`

**Propósito**: Modal para crear/editar proveedores.

**Campos**:
- Nombre (obligatorio)
- CIF/NIF (opcional, validar formato)
- Categoría (dropdown: técnico_freelance, material, software, externo)
- Dirección (estructurada: street, city, zip, province, country)
- Email
- Teléfono
- Días de pago (default: 30)
- Notas
- Estado (activo/inactivo, default: activo)

**Validaciones**:
- Nombre obligatorio
- CIF/NIF formato válido si se rellena
- Email formato válido si se rellena
- Código postal 5 dígitos si se rellena

**Transformaciones**:
- Direcciones a formato título
- Nombres a mayúsculas (si aplica)

---

### `SupplierRatesList`

**Ubicación**: `pages/proveedores/components/SupplierRatesList.tsx`

**Propósito**: Listado de tarifas de un técnico (solo para `category = "tecnico_freelance"`).

**Funcionalidades**:
- Mostrar tarifas del técnico
- Vincular con servicios de venta
- Calcular márgenes automáticamente
- Crear/editar/eliminar tarifas

---

### `SupplierProductsList`

**Ubicación**: `pages/proveedores/components/SupplierProductsList.tsx`

**Propósito**: Listado de productos asociados a un proveedor de material (solo para `category = "material"`).

**Funcionalidades**:
- Mostrar productos donde `primary_supplier_id = supplier.id`
- Mostrar precios y márgenes
- Vincular/desvincular productos

---

## Flujos de Trabajo

### Crear Nuevo Proveedor

```
1. Usuario hace clic en "Nuevo Proveedor" (en cualquier subpágina)
2. Se abre modal `NewSupplierModal`
3. Usuario selecciona categoría (técnico_freelance, material, software, externo)
4. Usuario rellena campos obligatorios:
   - Nombre
   - Categoría (ya seleccionada)
5. Usuario rellena campos opcionales:
   - CIF/NIF
   - Dirección
   - Email
   - Teléfono
   - Días de pago
   - Notas
6. Usuario hace clic en "Guardar"
7. Frontend valida campos
8. Frontend aplica transformaciones
9. Se envía POST a API
10. Backend crea proveedor con campos automáticos:
    - id (UUID)
    - created_at
    - updated_at
11. Si es técnico, se puede crear tarifa inmediatamente
12. Si es material, se pueden vincular productos
13. Se actualiza el listado
```

### Asignar Técnico a Proyecto

```
1. Usuario está en proyecto
2. Usuario hace clic en "Asignar Técnico"
3. Se muestra lista de técnicos activos
4. Usuario selecciona técnico
5. Sistema calcula coste estimado desde `supplier_rates`:
   - Busca tarifa del técnico para el servicio requerido
   - Calcula: coste = tarifa × cantidad
6. Usuario confirma asignación
7. Se crea registro en `project_staffing`
8. Se muestra coste estimado en el proyecto
9. Cuando llega la factura del técnico, se compara con el estimado
```

### Vincular Producto a Proveedor de Material

```
1. Usuario está en proveedor de material
2. Usuario hace clic en "Ver productos" o "Vincular producto"
3. Se muestra lista de productos disponibles
4. Usuario selecciona producto
5. Se actualiza `inventory_items.primary_supplier_id`
6. Se muestra producto en la lista del proveedor
7. Se puede ver precio compra vs precio venta
8. Se calcula margen automáticamente
```

---

## Guía de Implementación

### Paso 1: Crear Estructura de Archivos

```bash
# Crear directorios
mkdir -p pages/proveedores/{desktop,mobile,tablet,tablet-horizontal,components}
```

### Paso 2: Crear Componente Base `ProveedoresList`

**Archivo**: `pages/proveedores/components/ProveedoresList.tsx`

**Basado en**: `pages/proyectos/components/ProyectosList.tsx`

**Adaptaciones**:
- Filtrar por `category` según la subpágina
- Columnas específicas según tipo de proveedor
- Integración con `supplier_rates` para técnicos
- Integración con `inventory_items` para materiales

### Paso 3: Crear Mock Functions

**Archivo**: `lib/mocks/supplierMocks.ts`

**Funciones**:
- `fetchSuppliers(category?)`: Obtener proveedores (opcionalmente filtrados por categoría)
- `fetchSupplierById(id)`: Obtener proveedor por ID
- `fetchSupplierRates(supplierId)`: Obtener tarifas de un técnico
- `fetchSupplierProducts(supplierId)`: Obtener productos de un proveedor de material
- `createSupplier(data)`: Crear nuevo proveedor
- `updateSupplier(id, data)`: Actualizar proveedor
- `deleteSupplier(id)`: Eliminar proveedor (soft delete: `is_active = false`)

### Paso 4: Crear Páginas por Tipo

**Archivos**:
- `pages/proveedores/desktop/Tecnicos.tsx`
- `pages/proveedores/desktop/Materiales.tsx`
- `pages/proveedores/desktop/Softwares.tsx`
- `pages/proveedores/desktop/Externos.tsx`

**Estructura**:
```typescript
export function Tecnicos() {
  return (
    <ProveedoresList 
      category="tecnico_freelance"
      showFilters={true}
      showTools={true}
    />
  );
}
```

### Paso 5: Crear Página Principal (Resumen)

**Archivo**: `pages/proveedores/desktop/Proveedores.tsx`

**Contenido**:
- Tarjetas de resumen por tipo
- Gráficos de distribución
- Listado resumido
- Accesos rápidos

### Paso 6: Crear Modal de Nuevo Proveedor

**Archivo**: `pages/proveedores/components/NewSupplierModal.tsx`

**Basado en**: `pages/proyectos/components/NewProjectModal.tsx`

**Adaptaciones**:
- Campo `category` (dropdown)
- Dirección estructurada
- Validaciones específicas

### Paso 7: Implementar Funcionalidades Específicas

#### Para Técnicos:
- `SupplierRatesList`: Listado de tarifas
- Modal para crear/editar tarifas
- Cálculo automático de márgenes

#### Para Materiales:
- `SupplierProductsList`: Listado de productos
- Modal para vincular productos
- Comparación de precios

#### Para Softwares:
- Gestión de suscripciones
- Control de renovaciones

#### Para Externos:
- Filtro de gastos por proveedor
- Gestión de servicios contratados

---

## Notas de Implementación

### Campos Automáticos (NO implementar en formularios)

- `id`: UUID generado automáticamente
- `created_at`: Timestamp automático
- `updated_at`: Timestamp automático (actualizado por trigger)

### Validaciones Importantes

1. **CIF/NIF**: Validar formato español si se rellena
2. **Email**: Validar formato si se rellena
3. **Código postal**: 5 dígitos si se rellena
4. **Categoría**: Obligatoria, debe ser una de las 4 opciones

### Transformaciones

1. **Direcciones**: Formato título (primera letra mayúscula)
2. **Nombres**: Mayúsculas para empresas, título para personas

### Integraciones

1. **Con Inventario**: `inventory_items.primary_supplier_id` para materiales
2. **Con Tarifas**: `supplier_rates` para técnicos
3. **Con Proyectos**: `project_staffing.supplier_id` para técnicos
4. **Con Gastos**: `expenses.supplier_id` para todos los tipos

---

## Próximos Pasos

1. ✅ Crear estructura de archivos
2. ✅ Crear componente `ProveedoresList`
3. ✅ Crear mock functions
4. ✅ Crear páginas por tipo
5. ✅ Crear modal de nuevo proveedor
6. ⏳ Implementar funcionalidades específicas por tipo
7. ⏳ Integrar con proyectos (asignación de técnicos)
8. ⏳ Integrar con inventario (vinculación de productos)
9. ⏳ Implementar cálculos de márgenes
10. ⏳ Crear informes y análisis

---

**Última actualización**: 2025-01-21

