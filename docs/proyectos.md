# Documentación: Módulo de Proyectos

## Descripción General

El módulo de **Proyectos** gestiona todos los proyectos activos de la empresa, desde su inicio hasta su finalización. Cada proyecto está compuesto por **fases** y cada fase contiene **tareas** que permiten rastrear el progreso del proyecto.

### Vista Principal: Diagrama de Gantt por Proyecto

En **Inicio > Tareas** se mostrará un diagrama de Gantt simplificado que visualiza el estado de todos los proyectos activos:

- **Eje Y (vertical)**: Nombres de los proyectos activos
- **Eje X (horizontal superior)**: Fases del proyecto
- **Contenido**: Tareas dentro de cada fase
- **Sin fechas**: Solo muestra el estado/progreso de cada proyecto a simple vista

---

## Estructura de Datos

### 1. Interfaz Principal: Project

```typescript
/**
 * Interfaz principal de un Proyecto
 * Representa un proyecto completo desde su inicio hasta su finalización
 */
export interface Project {
  // Identificación
  id: string;                    // ID único del proyecto (UUID)
  code: string;                  // Código único del proyecto (ej: "PROJ-2025-001")
                                // ⚠️ GENERADO AUTOMÁTICAMENTE por el backend
                                // Formato: PROJ-YYYY-####
                                // No editable por el usuario
  name: string;                  // Nombre del proyecto (obligatorio)
  description?: string;          // Descripción general del proyecto
  
  // Estado del proyecto
  status: ProjectStatus;         // Estado actual del proyecto (obligatorio)
  progress: number;              // Progreso general del proyecto (0-100)
                                // ⚠️ CALCULADO AUTOMÁTICAMENTE por el backend
                                // Basado en el progreso de las fases (media ponderada o simple)
  
  // Cliente y relación comercial
  client_id: string;             // ID del cliente (obligatorio) - FK a Client
  client_name?: string;          // ⚠️ CACHE AUTOMÁTICO del backend
                                // Se actualiza automáticamente desde Client.name
                                // No debe editarse manualmente
  client_code?: string;          // ⚠️ CACHE AUTOMÁTICO del backend
                                // Se actualiza automáticamente desde Client.code
                                // No debe editarse manualmente
  
  // Fechas del proyecto
  start_date?: Date;             // Fecha de inicio del proyecto
  estimated_end_date?: Date;     // Fecha estimada de finalización
  actual_end_date?: Date;        // Fecha real de finalización
  
  // Horas estimadas y reales (para informes y planificación)
  estimated_hours?: number;      // Horas estimadas totales del proyecto
  actual_hours?: number;         // Horas reales trabajadas (calculado desde tareas)
  
  // Presupuesto y facturación
  quote_id?: string | null;      // ID del presupuesto/cotización/proforma - FK a Quote
                                // ⚠️ UNIFICADO: quote.type indica si es "quote" o "proforma"
                                // No usar budget_id separado
  
  // Fases del proyecto
  phases: ProjectPhase[];        // Array de fases del proyecto (obligatorio)
  
  // Ubicación
  address?: string;             // Dirección completa del proyecto
  city?: string;                // Ciudad/población
  postal_code?: string;         // Código postal
  country?: string;             // País
  location_coordinates?: {      // Coordenadas GPS (opcional, para futuro)
    lat: number;                 // Latitud
    lng: number;                 // Longitud
  };
  
  // Asignaciones y recursos
  assigned_technicians?: string[]; // IDs de técnicos asignados - FK a User[]
  project_manager_id?: string;    // ID del jefe de proyecto - FK a User
  
  // ⚠️ NOTA IMPORTANTE: Relaciones con compras, facturas y gastos
  // NO se guardan arrays de IDs aquí (purchase_order_ids, supplier_invoice_ids, expense_ids)
  // La relación se resuelve mediante FK inversa:
  // - PurchaseOrder.project_id → Project.id
  // - SupplierInvoice.project_id → Project.id
  // - Expense.project_id → Project.id
  // - Invoice.project_id → Project.id
  // Esto mejora RLS (Row Level Security) y mantiene consistencia de datos
  
  // Metadatos
  created_at: Date;             // Fecha de creación
  updated_at: Date;             // Fecha de última actualización
  created_by?: string;          // ID del usuario que creó el proyecto
  updated_by?: string;          // ID del usuario que actualizó el proyecto
  
  // Notas y observaciones
  notes?: string;               // Notas generales del proyecto
  internal_notes?: string;      // Notas internas (no visibles para el cliente)
}
```

### 2. Estados del Proyecto

```typescript
/**
 * Estados posibles de un proyecto
 */
export type ProjectStatus = 
  | "draft"              // Borrador (en creación)
  | "quoted"             // Presupuestado (presupuesto enviado)
  | "approved"           // Aprobado (cliente aceptó presupuesto)
  | "in_progress"        // En progreso (trabajo iniciado)
  | "on_hold"            // En pausa (temporalmente detenido)
  | "completed"          // Completado (proyecto finalizado)
  | "cancelled";         // Cancelado (proyecto cancelado)

/**
 * Configuración de estados con colores e iconos
 */
export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  draft: { 
    label: "Borrador", 
    color: "#6b7280",      // Gris
    icon: "📝" 
  },
  quoted: { 
    label: "Presupuestado", 
    color: "#3b82f6",      // Azul
    icon: "📄" 
  },
  approved: { 
    label: "Aprobado", 
    color: "#10b981",      // Verde
    icon: "✅" 
  },
  in_progress: { 
    label: "En Progreso", 
    color: "#f59e0b",      // Amarillo/Naranja
    icon: "🚧" 
  },
  on_hold: { 
    label: "En Pausa", 
    color: "#ef4444",      // Rojo
    icon: "⏸️" 
  },
  completed: { 
    label: "Completado", 
    color: "#22c55e",      // Verde intenso
    icon: "✓" 
  },
  cancelled: { 
    label: "Cancelado", 
    color: "#6b7280",      // Gris
    icon: "❌" 
  },
};
```

### 3. Interfaz: ProjectPhase

```typescript
/**
 * Fase de un proyecto
 * Representa una etapa del proyecto con sus tareas asociadas
 */
export interface ProjectPhase {
  id: string;                    // ID único de la fase (UUID)
  project_id: string;            // ID del proyecto al que pertenece - FK a Project
  name: string;                  // Nombre de la fase (obligatorio)
  description?: string;          // Descripción de la fase
  order: number;                 // Orden de la fase en el proyecto (1, 2, 3...)
  
  // Estado de la fase
  status: PhaseStatus;           // Estado actual de la fase
  progress: number;              // Progreso de la fase (0-100)
                                // ⚠️ CALCULADO AUTOMÁTICAMENTE por el backend
                                // Basado en el progreso de las tareas de la fase
  
  // Control de flujo
  required_for_next_phase?: boolean; // ⚠️ CRÍTICO: Si es true, la fase debe completarse
                                     // antes de poder iniciar la siguiente fase
                                     // Ejemplo: No puedes pasar a "Instalación" si
                                     // "Recepción de Material" no está completada
  
  // Tareas de la fase
  tasks: ProjectTask[];          // Array de tareas de la fase
  
  // Fechas (opcionales, para futuras expansiones)
  estimated_start_date?: Date;   // Fecha estimada de inicio
  estimated_end_date?: Date;     // Fecha estimada de fin
  actual_start_date?: Date;      // Fecha real de inicio
  actual_end_date?: Date;        // Fecha real de fin
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
}
```

### 4. Estados de Fase

```typescript
/**
 * Estados posibles de una fase
 */
export type PhaseStatus = 
  | "pending"           // Pendiente (aún no iniciada)
  | "in_progress"       // En progreso (trabajando en ella)
  | "completed"         // Completada (fase finalizada)
  | "blocked";          // Bloqueada (esperando dependencias)

/**
 * Configuración de estados de fase
 */
export const PHASE_STATUS_CONFIG: Record<PhaseStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  pending: { 
    label: "Pendiente", 
    color: "#6b7280",      // Gris
    icon: "" 
  },
  in_progress: { 
    label: "En Progreso", 
    color: "#f59e0b",      // Amarillo/Naranja
    icon: "⏱️" 
  },
  completed: { 
    label: "Completada", 
    color: "#22c55e",      // Verde
    icon: "✓" 
  },
  blocked: { 
    label: "Bloqueada", 
    color: "#ef4444",      // Rojo
    icon: "🚫" 
  },
};
```

### 5. Interfaz: ProjectTask

```typescript
/**
 * Tarea dentro de una fase de proyecto
 * Extiende la interfaz Task base con información específica del proyecto
 */
export interface ProjectTask extends Task {
  // Relación con proyecto y fase
  project_id: string;            // ID del proyecto - FK a Project (obligatorio)
  phase_id: string;              // ID de la fase - FK a ProjectPhase (obligatorio)
  
  // Orden dentro de la fase
  order: number;                 // Orden de la tarea en la fase (1, 2, 3...)
  
  // Asignaciones
  assigned_to?: string[];        // ⚠️ CRÍTICO: IDs de técnicos asignados a la tarea
                                 // FK a User[] - Permite múltiples técnicos por tarea
                                 // Necesario para Calendar, App móvil, permisos RLS
  
  // Prioridad (para integración con Calendar18)
  priority?: "low" | "medium" | "high"; // Prioridad de la tarea
  
  // Horas estimadas y reales (para informes de productividad)
  estimated_hours?: number;      // Horas estimadas para completar la tarea
  actual_hours?: number;         // Horas reales trabajadas en la tarea
  
  // Dependencias (opcional, para futuras expansiones)
  depends_on?: string[];         // IDs de tareas de las que depende
  
  // Notas específicas del proyecto
  project_notes?: string;       // Notas específicas del proyecto (además de notes de Task)
  
  // ⚠️ IMPORTANTE: Campos de Task base que son CRÍTICOS para calendarización
  // Estos campos deben estar presentes si la tarea es calendarizable:
  startDate: Date | null;       // Fecha de inicio (obligatorio si es calendarizable)
  endDate: Date | null;         // Fecha de fin (obligatorio si es calendarizable)
  startTime?: string | null;    // Hora de inicio (HH:MM) - opcional pero recomendado
  endTime?: string | null;      // Hora de fin (HH:MM) - opcional pero recomendado
}
```

**Nota**: `ProjectTask` extiende la interfaz `Task` definida en `lib/types/task.ts`, por lo que hereda todos sus campos (title, description, status, type, etc.).

---

## Relaciones con Otros Módulos

### 1. Clientes (Client)

```typescript
/**
 * Relación: Project -> Client
 * Un proyecto pertenece a un cliente
 */
interface Project {
  client_id: string;             // FK a Client.id
  client_name?: string;          // Cache del nombre del cliente
  client_code?: string;          // Cache del código del cliente
}

/**
 * Interfaz Client (referencia)
 */
interface Client {
  id: string;
  name: string;
  code?: string;
  // ... otros campos del cliente
}
```

### 2. Presupuestos y Cotizaciones (Quote)

```typescript
/**
 * Relación: Project -> Quote
 * ⚠️ UNIFICADO: Solo se usa quote_id (no budget_id separado)
 * El tipo se determina por quote.type ("quote" | "proforma")
 */
interface Project {
  quote_id?: string | null;      // FK a Quote.id (presupuesto/cotización/proforma)
}

/**
 * Interfaz Quote (referencia)
 */
interface Quote {
  id: string;
  client_id: string;             // FK a Client.id
  project_id?: string;           // FK a Project.id (opcional, puede crearse antes del proyecto)
  type: "quote" | "proforma";    // Tipo: presupuesto o proforma
  status: "draft" | "sent" | "accepted" | "rejected";
  total_amount: number;
  // ... otros campos
}
```

### 3. Facturas (Invoice)

```typescript
/**
 * Relación: Project -> Invoice[]
 * ⚠️ NO se guarda invoice_ids en Project
 * La relación se resuelve mediante FK inversa: Invoice.project_id → Project.id
 */
interface Project {
  // NO hay invoice_ids aquí
}

/**
 * Interfaz Invoice (referencia)
 */
interface Invoice {
  id: string;
  client_id: string;             // FK a Client.id
  project_id?: string;           // ⚠️ FK a Project.id - Relación inversa
  invoice_number: string;
  total_amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  // ... otros campos
}

// Para obtener facturas de un proyecto:
// SELECT * FROM invoices WHERE project_id = 'proj-001'
```

### 4. Compras y Proveedores (PurchaseOrder, SupplierInvoice)

```typescript
/**
 * Relación: Project -> PurchaseOrder[]
 * ⚠️ NO se guardan purchase_order_ids ni supplier_invoice_ids en Project
 * La relación se resuelve mediante FK inversa
 */
interface Project {
  // NO hay purchase_order_ids ni supplier_invoice_ids aquí
}

/**
 * Interfaz PurchaseOrder (referencia)
 */
interface PurchaseOrder {
  id: string;
  project_id?: string;           // ⚠️ FK a Project.id - Relación inversa
  supplier_id: string;          // FK a Supplier.id
  order_number: string;
  total_amount: number;
  status: "draft" | "sent" | "received" | "paid";
  // ... otros campos
}

/**
 * Interfaz SupplierInvoice (referencia)
 */
interface SupplierInvoice {
  id: string;
  project_id?: string;           // ⚠️ FK a Project.id - Relación inversa
  supplier_id: string;           // FK a Supplier.id
  invoice_number: string;
  total_amount: number;
  status: "pending" | "paid";
  // ... otros campos
}

// Para obtener órdenes de compra de un proyecto:
// SELECT * FROM purchase_orders WHERE project_id = 'proj-001'
// Para obtener facturas de proveedores de un proyecto:
// SELECT * FROM supplier_invoices WHERE project_id = 'proj-001'
```

### 5. Gastos (Expense)

```typescript
/**
 * Relación: Project -> Expense[]
 * ⚠️ NO se guarda expense_ids en Project
 * La relación se resuelve mediante FK inversa: Expense.project_id → Project.id
 */
interface Project {
  // NO hay expense_ids aquí
}

/**
 * Interfaz Expense (referencia)
 */
interface Expense {
  id: string;
  project_id?: string;           // ⚠️ FK a Project.id - Relación inversa
  category: string;              // Categoría del gasto
  amount: number;
  date: Date;
  description?: string;
  // ... otros campos
}

// Para obtener gastos de un proyecto:
// SELECT * FROM expenses WHERE project_id = 'proj-001'
```

**⚠️ VENTAJAS DE ESTA ESTRUCTURA:**
- ✅ Mejora RLS (Row Level Security) en Supabase
- ✅ Mantiene consistencia de datos
- ✅ Facilita queries y joins
- ✅ Evita desincronización de arrays
- ✅ Escalable y mantenible

### 6. Usuarios y Asignaciones (User)

```typescript
/**
 * Relación: Project -> User[]
 * Un proyecto puede tener múltiples técnicos asignados y un jefe de proyecto
 */
interface Project {
  assigned_technicians?: string[]; // Array de IDs de técnicos - FK a User[]
  project_manager_id?: string;     // ID del jefe de proyecto - FK a User.id
}

/**
 * Interfaz User (referencia)
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "technician" | "commercial" | "accounting";
  // ... otros campos
}
```

---

## Diagrama de Gantt Simplificado (Inicio > Tareas)

### Estructura de Visualización

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 1    │    FASE 2    │    FASE 3    │ ...  │ ← Eje X (Fases)
├─────────────────────────────────────────────────────────────────────┤
│ Proyecto A                                                          │
│   └─ [Tarea 1.1] [Tarea 1.2] │ [Tarea 2.1] │ [Tarea 3.1]         │
├─────────────────────────────────────────────────────────────────────┤
│ Proyecto B                                                          │
│   └─ [Tarea 1.1] │ [Tarea 2.1] [Tarea 2.2] │                      │
├─────────────────────────────────────────────────────────────────────┤
│ Proyecto C                                                          │
│   └─ [Tarea 1.1] │ │ [Tarea 3.1]                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Características

1. **Solo proyectos activos**: Se muestran proyectos con estado `"in_progress"` o `"approved"`
2. **Sin fechas**: No se muestran fechas, solo el estado/progreso
3. **Fases ordenadas**: Las fases se muestran en orden según `phase.order`
4. **Tareas dentro de fases**: Cada tarea se muestra dentro de su fase correspondiente
5. **Indicadores visuales**:
   - Color según estado de la tarea (pending, in_progress, completed)
   - Color según estado de la fase
   - Progreso visual del proyecto

### Datos Necesarios para el Diagrama

```typescript
/**
 * Estructura de datos para el diagrama de Gantt
 */
interface GanttViewData {
  projects: GanttProject[];
}

interface GanttProject {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  phases: GanttPhase[];
}

interface GanttPhase {
  id: string;
  name: string;
  order: number;
  status: PhaseStatus;
  progress: number;
  tasks: GanttTask[];
}

interface GanttTask {
  id: string;
  title: string;
  status: TaskStatus;        // "pending" | "in_progress" | "completed" | "cancelled"
  type: TaskType;           // Categoría de la tarea
  order: number;            // Orden dentro de la fase
}
```

---

## Fases Estándar de un Proyecto

### Fases Comunes

Aunque cada proyecto puede tener fases personalizadas, estas son las fases estándar que se pueden usar como plantilla:

1. **Planificación** (`order: 1`)
   - Tareas: Definición de requisitos, diseño, planificación de recursos

2. **Pedido de Material** (`order: 2`)
   - Tareas: Solicitud de materiales, aprobación de compras

3. **Recepción de Material** (`order: 3`)
   - Tareas: Control de recepción, verificación de materiales

4. **Producción Interna** (`order: 4`)
   - Tareas: Preparación de cables, test de pantallas, montaje

5. **Configuración y Testing** (`order: 5`)
   - Tareas: Configuración de sistemas, pruebas, ajustes

6. **Instalación** (`order: 6`)
   - Tareas: Instalación en obra, montaje, conexiones

7. **Entrega** (`order: 7`)
   - Tareas: Entrega final, documentación, formación

8. **Post-Instalación** (`order: 8`)
   - Tareas: Revisión post-instalación, soporte, garantía

**Nota**: Estas fases son sugerencias. Cada proyecto puede tener fases personalizadas según sus necesidades.

---

## Estados de Tareas

```typescript
/**
 * Estados posibles de una tarea
 * ⚠️ ACTUALIZADO: Incluye "cancelled" para tareas canceladas
 */
export type TaskStatus = 
  | "pending"           // Pendiente (aún no iniciada)
  | "in_progress"       // En progreso (trabajando en ella)
  | "completed"         // Completada (tarea finalizada)
  | "cancelled";        // Cancelada (tarea cancelada)

/**
 * Configuración de estados de tarea
 */
export const TASK_STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  pending: { 
    label: "Pendiente", 
    color: "#6b7280",      // Gris
    icon: "" 
  },
  in_progress: { 
    label: "En Progreso", 
    color: "#f59e0b",      // Amarillo/Naranja
    icon: "⏱️" 
  },
  completed: { 
    label: "Completada", 
    color: "#22c55e",      // Verde
    icon: "✓" 
  },
  cancelled: { 
    label: "Cancelada", 
    color: "#6b7280",      // Gris
    icon: "❌" 
  },
};
```

## Tipos de Tareas (Categorías Unificadas)

```typescript
/**
 * ⚠️ SISTEMA UNIFICADO: Un solo sistema global de TaskType
 * Evita duplicaciones y conflictos entre categorías
 */

// Categorías globales (Módulo Inicio)
type GlobalTaskType =
  | "installation"      // Instalación
  | "site_visit"        // Visita de Obra
  | "meeting"           // Reunión
  | "incident";         // Incidencia

// Categorías de proyecto (Módulo Proyectos)
type ProjectTaskType =
  | "material_ordered"      // Pedido de Material
  | "material_received"      // Recepción de Material
  | "tech_assigned"         // Programación de Técnicos
  | "internal_production"   // Producción Interna
  | "config_testing"        // Configuración / Testing
  | "project_delivery"      // Entrega del Proyecto
  | "post_install_check";   // Revisión Post-Instalación

// Tipo unificado
export type TaskType = GlobalTaskType | ProjectTaskType;
```

**Uso en Proyectos:**

Las tareas dentro de un proyecto pueden usar:
- ✅ **Categorías de proyecto**: `material_ordered`, `material_received`, `tech_assigned`, etc.
- ✅ **Categorías globales**: `installation`, `site_visit`, `meeting`, `incident`

Todas las categorías están definidas en `docs/categorias-tareas.md` y comparten el mismo sistema de colores y configuración.

---

## Ejemplo de Estructura Completa

```typescript
const exampleProject: Project = {
  id: "proj-001",
  code: "PROJ-2025-001",
  name: "Instalación LED - Tienda Zara Diagonal",
  description: "Instalación completa de sistema LED en tienda Zara",
  status: "in_progress",
  progress: 45,
  
  client_id: "client-123",
  client_name: "Zara España",  // Cache automático del backend
  client_code: "ZARA-ES",        // Cache automático del backend
  
  start_date: new Date("2025-11-01"),
  estimated_end_date: new Date("2025-12-15"),
  estimated_hours: 240,
  actual_hours: 108,
  
  quote_id: "quote-456",  // Unificado: quote.type indica si es "quote" o "proforma"
  // ⚠️ NO hay invoice_ids, purchase_order_ids, supplier_invoice_ids, expense_ids
  // Se obtienen mediante FK inversa: SELECT * FROM invoices WHERE project_id = 'proj-001'
  
  phases: [
    {
      id: "phase-001",
      project_id: "proj-001",
      name: "Planificación",
      order: 1,
      status: "completed",
      progress: 100,  // Calculado automáticamente por el backend
      required_for_next_phase: true,  // Debe completarse antes de pasar a la siguiente fase
      tasks: [
        {
          id: "task-001",
          project_id: "proj-001",
          phase_id: "phase-001",
          title: "Definición de requisitos",
          status: "completed",
          type: "meeting",
          order: 1,
          assigned_to: ["user-001", "user-002"],  // Técnicos asignados
          priority: "high",
          estimated_hours: 4,
          actual_hours: 3.5,
          startDate: new Date("2025-11-01"),
          endDate: new Date("2025-11-01"),
          startTime: "09:00",
          endTime: "13:00",
          // ... otros campos de Task
        }
      ]
    },
    {
      id: "phase-002",
      project_id: "proj-001",
      name: "Pedido de Material",
      order: 2,
      status: "completed",
      progress: 100,
      tasks: [
        {
          id: "task-002",
          project_id: "proj-001",
          phase_id: "phase-002",
          title: "Solicitud de pantallas LED",
          status: "completed",
          type: "material_ordered",
          order: 1,
        }
      ]
    },
    {
      id: "phase-003",
      project_id: "proj-001",
      name: "Instalación",
      order: 3,
      status: "in_progress",
      progress: 50,
      tasks: [
        {
          id: "task-003",
          project_id: "proj-001",
          phase_id: "phase-003",
          title: "Montaje de estructura",
          status: "in_progress",
          type: "installation",
          order: 1,
        },
        {
          id: "task-004",
          project_id: "proj-001",
          phase_id: "phase-003",
          title: "Conexión eléctrica",
          status: "pending",
          type: "installation",
          order: 2,
        }
      ]
    }
  ],
  
  address: "Avinguda Diagonal, 123",
  city: "Barcelona",
  postal_code: "08008",
  country: "España",
  location_coordinates: {
    lat: 41.3851,
    lng: 2.1734
  },
  
  assigned_technicians: ["user-001", "user-002"],
  project_manager_id: "user-003",
  
  // ⚠️ NO hay purchase_order_ids, supplier_invoice_ids, expense_ids
  // Se obtienen mediante FK inversa:
  // - SELECT * FROM purchase_orders WHERE project_id = 'proj-001'
  // - SELECT * FROM supplier_invoices WHERE project_id = 'proj-001'
  // - SELECT * FROM expenses WHERE project_id = 'proj-001'
  
  created_at: new Date("2025-10-15"),
  updated_at: new Date("2025-11-18"),
  created_by: "user-003",
  
  notes: "Proyecto prioritario para apertura de tienda"
};
```

---

## Resumen de Mejoras Aplicadas

### ✅ Cambios Implementados

1. **Eliminados arrays de IDs**: 
   - ❌ `invoice_ids`, `purchase_order_ids`, `supplier_invoice_ids`, `expense_ids`
   - ✅ Relaciones mediante FK inversa (mejora RLS y consistencia)

2. **Unificado presupuesto/facturación**:
   - ❌ `budget_id` separado
   - ✅ Solo `quote_id` (quote.type indica el tipo)

3. **Campos añadidos**:
   - ✅ `assigned_to[]` en ProjectTask (técnicos asignados)
   - ✅ `priority` en ProjectTask (low, medium, high)
   - ✅ `estimated_hours` / `actual_hours` en Project y ProjectTask
   - ✅ `location_coordinates` en Project (GPS)
   - ✅ `required_for_next_phase` en ProjectPhase (control de flujo)

4. **Estados actualizados**:
   - ✅ `"cancelled"` añadido a TaskStatus

5. **Campos automáticos documentados**:
   - ✅ `code`: Generado automáticamente (PROJ-YYYY-####)
   - ✅ `progress`: Calculado automáticamente por el backend
   - ✅ `client_name` / `client_code`: Cache automático del backend

6. **Calendarización**:
   - ✅ `startDate`, `endDate`, `startTime`, `endTime` documentados como críticos para tareas calendarizables

### ⚠️ Consideraciones para Backend

- **RLS (Row Level Security)**: La estructura con FK inversa mejora la seguridad en Supabase
- **Cálculos automáticos**: `progress` debe calcularse en triggers o funciones del backend
- **Cache de clientes**: `client_name` y `client_code` deben actualizarse automáticamente
- **Generación de códigos**: `code` debe generarse en el backend con formato PROJ-YYYY-####

---

## Próximos Pasos

1. **Implementar interfaces TypeScript**: Crear archivos en `lib/types/` para `Project`, `ProjectPhase`, `ProjectTask`
2. **Actualizar Task base**: Añadir `"cancelled"` a TaskStatus y campos faltantes
3. **Crear componentes de visualización**: Implementar el diagrama de Gantt en `Inicio > Tareas`
4. **Integración con backend**: Preparar los endpoints y modelos de datos en el backend (Supabase)
5. **Formularios**: Crear formularios para crear/editar proyectos, fases y tareas
6. **Relaciones**: Implementar las relaciones con otros módulos usando FK inversa

---

*Última actualización: Modelo de proyectos auditado y optimizado para producción*

