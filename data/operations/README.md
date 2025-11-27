# Módulo: Operaciones

Este módulo gestiona proyectos, asignación de personal y tareas.

## Tablas

### `projects.json`
Proyectos principales de la empresa (instalaciones, eventos, etc.).

**Campos clave:**
- `internal_ref`: Referencia interna/secuencial (ej: "0001", "0033")
- `client_id`: Cliente asociado (UUID)
- `client_po_number`: Número de pedido del cliente (opcional)
- `name`: Nombre del proyecto (sin incluir el nombre del cliente)
- `status`: Estado del proyecto (`borrador`, `presupuestado`, `aceptado`, `ejecutando`, `finalizado`, `cancelado`)
- `location_name`: Nombre de la ubicación
- `location_address`: Dirección estructurada de la ubicación (JSONB)
- `location_coords`: Coordenadas (lat, lng) para el mapa (JSONB)
- `start_date`: Fecha de inicio (TIMESTAMPTZ)
- `end_date`: Fecha de finalización (TIMESTAMPTZ)
- `budget_estimated`: Presupuesto estimado

**Campos calculados (no están en el JSON pero se calculan automáticamente):**
- `total_billing`: **Total facturado del proyecto** - Suma de todas las facturas del proyecto (calculado automáticamente)
  - Se calcula desde `sales_documents` donde:
    - `project_id = projects.id`
    - `type = 'factura'` (solo facturas definitivas, no presupuestos ni proformas)
    - `status IN ('cobrada', 'aceptada')` (solo facturas cobradas o aceptadas)
  - Permite mostrar el total facturado en el listado de proyectos
  - Se actualiza automáticamente cuando se crean/modifican/eliminan facturas
  - **IMPORTANTE**: El cálculo se realiza automáticamente al cargar los proyectos, mostrando la suma total de facturación de cada proyecto

**Notas:**
- El nombre del proyecto NO incluye el nombre del cliente (se asigna mediante `client_id`)
- `location_coords` permite mostrar el proyecto en el mapa (`/mapa`)
- **Contratos de Alquiler** (Futuro):
  - Los proyectos pueden incluir contratos de alquiler de 12 o 18 meses
  - Estos contratos requerirán tareas de mantenimiento automáticas cada 3 meses
  - Las tareas se generarán automáticamente y aparecerán en el calendario

---

## 📝 Formulario de Nuevo Proyecto

**Documentación completa**: Ver `docs/base-de-datos.md` sección "Formulario de Nuevo Proyecto"

### Resumen Rápido:

**Campos Automáticos (NO implementar en formulario):**
- ✅ `id` - UUID generado automáticamente
- ✅ `internal_ref` - Generado por trigger (0034, 0035...)
- ✅ `total_billing` - Inicializado en 0.00, calculado automáticamente
- ✅ `created_at` - Timestamp automático
- ✅ `updated_at` - Timestamp automático

**Campos a Implementar:**

1. **Cliente** (Obligatorio):
   - `client_id` ✅ (dropdown con clientes activos)
   - **NOTA IMPORTANTE**: El proyecto SIEMPRE debe estar asignado a un cliente

2. **Número de Pedido del Cliente** (Opcional):
   - `client_po_number` (input texto, ej: "PO-2025-001")

3. **Información del Proyecto**:
   - `name` ✅ (obligatorio)
   - `status` (dropdown, default: "borrador")
   - `description` (textarea opcional)
   - `budget_estimated` (número, formato moneda)

4. **Ubicación** (Opcional):
   - `location_name` (input texto)
   - `location_address` (estructura JSONB: street, city, zip, province, country)
   - Formato título para direcciones

5. **Fechas** (Opcional):
   - `start_date` (date picker)
   - `end_date` (date picker, validar que sea >= start_date)

**Validaciones:**
- Cliente obligatorio
- Nombre obligatorio
- Presupuesto numérico si se rellena
- Código postal 5 dígitos si se rellena
- Fecha fin >= fecha inicio

**Transformaciones:**
- Direcciones → Formato título antes de guardar

### `project_staffing.json`
Gestiona quién trabaja en cada proyecto (asignación de personal).

**Campos clave:**
- `project_id`: Proyecto asociado (UUID)
- `user_id`: Usuario interno (opcional, UUID)
- `supplier_id`: Proveedor externo (opcional, UUID)
- `role_in_project`: Rol en el proyecto
- `dates`: Array de fechas de trabajo (DATE[])
- `status`: Estado de la asignación (`propuesto`, `confirmado`)
- `cost_agreed`: Coste pactado para este bolo

### `tasks.json`
Tareas del calendario y gestión de trabajo.

**Campos clave:**
- `project_id`: Proyecto asociado (opcional, UUID)
- `assigned_to`: Usuario asignado (UUID)
- `title`: Título de la tarea
- `description`: Descripción detallada
- `due_date`: Fecha de vencimiento
- `department_tag`: Etiqueta de departamento
- `status`: Estado de la tarea (`pendiente`, `en_proceso`, `completada`, `cancelada`)
- `priority`: Prioridad (`baja`, `media`, `alta`, `urgente`)

**Notas:**
- `project_id` es opcional (puede ser tarea general)
- `department_tag` permite filtrar tareas por departamento
- Se visualiza en `/calendario`
- **Tareas de Mantenimiento Automáticas** (Futuro):
  - Para proyectos con contratos de alquiler de 12 o 18 meses, se generarán automáticamente tareas de mantenimiento
  - Frecuencia: cada 3 meses desde la fecha de instalación del proyecto (`start_date`)
  - Tipo: tareas obligatorias vinculadas al proyecto mediante `project_id`
  - Ejemplo: Si un proyecto de alquiler inicia el 2025-01-15, las tareas de mantenimiento se crearán en:
    - 2025-04-15 (3 meses)
    - 2025-07-15 (6 meses)
    - 2025-10-15 (9 meses)
    - 2026-01-15 (12 meses) - fin del contrato de 12 meses
    - Para contratos de 18 meses, continuará hasta 2026-07-15 (18 meses)
  - Estas tareas se crearán automáticamente mediante triggers o funciones de base de datos cuando se detecte un proyecto con contrato de alquiler

