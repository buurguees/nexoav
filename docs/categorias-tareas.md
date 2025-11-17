# Sistema Completo de Categorías de Tareas

## Descripción General

Este documento describe el **sistema completo de categorías de tareas** utilizado en toda la aplicación. Las categorías están organizadas por **departamentos** y **áreas funcionales**.

**Importante**: El sistema **NO utiliza prioridades** (low, medium, high). Todas las tareas son igual de importantes. Lo que distingue a las tareas es su **categoría/función**.

---

## 🎨 Paleta de Colores Coherente

Para mantener una identidad visual clara, se utiliza esta estructura de colores:

- **🟠 Naranja** → Operaciones técnicas (instalaciones, entregas)
- **🟡 Amarillo** → Visitas / logística
- **🔴 Rojo** → Incidencias / urgencias
- **🟣 Morado** → Reuniones / procesos internos
- **🔵 Azules** → Administrativos + facturación
- **🟢 Verdes** → Comercial (seguimiento, cierres)
- **🟫 Beiges / Marrones** → RRHH / personal
- **⚫ Grises** → Estados finales o neutrales

Esto facilita que el usuario lea el calendario "por color" sin pensar.

---

## 1. Categorías CORE de Operaciones

Estas son categorías **transversales** para todo el equipo técnico/operativo. Son las categorías base que deben aparecer sí o sí en:

- ✅ **Inicio > Calendario**
- ✅ **Inicio > Resumen**
- ✅ **Calendario del Proyecto**

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Instalación** | `"installation"` | 🟠 Naranja | Montajes, puestas en marcha, días de obra |
| **Visita de Obra** | `"site_visit"` | 🟡 Amarillo | Medidas, revisiones, supervisión previa |
| **Reunión** | `"meeting"` | 🟣 Morado | Reuniones internas o con cliente |
| **Incidencia** | `"incident"` | 🔴 Rojo | Problemas, urgencias, revisiones de error |

**Nota importante**: Estas son las **únicas categorías** que se muestran en el módulo de **Inicio**. El resto de categorías se gestionan en sus respectivos módulos.

---

## 2. Categorías por Departamento

Las categorías adicionales están organizadas por departamento. La clave: **no duplicar categorías**, sino crear etiquetas que aporten valor real en el calendario.

### 🧾 EQUIPO DE FACTURACIÓN

Su trabajo es más administrativo, cíclico y relacionado al flujo económico.

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Emisión de Factura** | `"invoice_issued"` | 🟦 Azul claro | Momento en que se genera la factura |
| **Revisión de Factura** | `"invoice_review"` | 🔵 Azul oscuro | Correcciones, verificación, validación |
| **Recordatorio de Pago** | `"payment_reminder"` | 🟩 Verde suave | Seguimiento a clientes |
| **Cobro Confirmado** | `"payment_confirmed"` | 🟩 Verde intenso | Pagos recibidos, cierre de ciclo |
| **Proforma Pendiente** | `"proforma_pending"` | 🟫 Marrón claro | Proformas que deben transformarse en factura |

➡️ Estas categorías permiten ver el **"pulso financiero"** del mes.

**Módulo**: Estas categorías se gestionan en el módulo de **Facturación**.

---

### 💼 EQUIPO COMERCIAL

Aquí hablamos de clientes potenciales, oportunidades y cierres.

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Lead Nuevo** | `"new_lead"` | 🟦 Celeste | Entrada de un cliente potencial |
| **Visita Comercial** | `"commercial_visit"` | 🟫 Arena | Visita presencial / videollamada comercial |
| **Envío de Presupuesto** | `"quote_sent"` | 🟪 Lavanda | Presupuesto enviado, pendiente de respuesta |
| **Seguimiento** | `"follow_up"` | 🟩 Verde lima | "Follow-up" a un cliente |
| **Cierre de Venta** | `"deal_closed"` | 🟧 Naranja suave | Proyecto confirmado, pasa a Producción |
| **Pérdida de Oportunidad** | `"deal_lost"` | ⚫ Gris | No aceptado, cancelado |

➡️ Esto ayuda a visualizar el **funnel comercial** en el calendario.

**Módulo**: Estas categorías se gestionan en el módulo de **Comercial**.

---

### 👥 EQUIPO DE RRHH

RRHH necesita categorías sobre personas, turnos, permisos y formaciones.

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Entrevista de Candidato** | `"interview"` | 🟦 Azul petróleo | Reclutamiento |
| **Formación Interna** | `"training"` | 🟩 Verde oliva | Cursos, capacitaciones |
| **Vacaciones** | `"vacation"` | 🟫 Beige | Días de descanso programados |
| **Baja Temporal** | `"sick_leave"` | 🟥 Rojo suave | Enfermedad, accidente, médico |
| **Onboarding** | `"onboarding"` | 🟪 Morado pastel | Primer día de un nuevo trabajador |
| **Evaluación de Desempeño** | `"performance_review"` | 🟧 Mandarina | Revisión trimestral o anual |

➡️ Así RRHH tiene **control total de personal y disponibilidad**.

**Módulo**: Estas categorías se gestionan en el módulo de **RRHH**.

---

### 🛠 EQUIPO DE PROYECTOS

Aquí es donde necesitas **TODAS las categorías técnicas**, porque cada proyecto tiene su propio mini-calendario.

Además de las categorías CORE ya definidas (Instalación, Visita de Obra, Reunión, Incidencia), deben sumarse:

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Pedido de Material** | `"material_ordered"` | 🟦 Azul medio | Se ha hecho un pedido |
| **Recepción de Material** | `"material_received"` | 🟩 Verde | Material llega al almacén |
| **Programación de Técnicos** | `"tech_assigned"` | 🟧 Naranja suave | Asignación de equipo |
| **Producción Interna** | `"internal_production"` | 🟫 Marrón | Preparación de cables, test de pantallas |
| **Configuración / Testing** | `"config_testing"` | 🟪 Morado oscuro | Procesado, players, blending, configs |
| **Entrega del Proyecto** | `"project_delivery"` | 🟩 Verde intenso | Fin de obra / entrega final |
| **Revisión Post-Instalación** | `"post_install_check"` | ⚫ Gris oscuro | Check final o soporte postinstalación |

➡️ En los calendarios internos de cada proyecto, el equipo técnico verá todas estas categorías.

**Módulo**: Estas categorías se gestionan en el módulo de **Proyectos**.

---

## 3. Tabla de Categorías Unificada (Frontend + Backend)

### Sistema final (para toda la empresa):

**Categorías globales (operaciones) - Módulo Inicio**
- `installation` - Instalación
- `site_visit` - Visita de Obra
- `meeting` - Reunión
- `incident` - Incidencia

**Facturación - Módulo Facturación**
- `invoice_issued` - Emisión de Factura
- `invoice_review` - Revisión de Factura
- `proforma_pending` - Proforma Pendiente
- `payment_reminder` - Recordatorio de Pago
- `payment_confirmed` - Cobro Confirmado

**Comerciales - Módulo Comercial**
- `new_lead` - Lead Nuevo
- `commercial_visit` - Visita Comercial
- `quote_sent` - Envío de Presupuesto
- `follow_up` - Seguimiento
- `deal_closed` - Cierre de Venta
- `deal_lost` - Pérdida de Oportunidad

**RRHH - Módulo RRHH**
- `interview` - Entrevista de Candidato
- `training` - Formación Interna
- `vacation` - Vacaciones
- `sick_leave` - Baja Temporal
- `onboarding` - Onboarding
- `performance_review` - Evaluación de Desempeño

**Proyectos - Módulo Proyectos**
- `material_ordered` - Pedido de Material
- `material_received` - Recepción de Material
- `tech_assigned` - Programación de Técnicos
- `internal_production` - Producción Interna
- `config_testing` - Configuración / Testing
- `project_delivery` - Entrega del Proyecto
- `post_install_check` - Revisión Post-Instalación

---

## 4. Implementación en Código

### Enum completo de tipos de categorías

```typescript
// lib/taskCategories.ts

export type TaskType = 
  // CORE Operaciones (Módulo Inicio)
  | "installation"
  | "site_visit"
  | "meeting"
  | "incident"
  // Facturación (Módulo Facturación)
  | "invoice_issued"
  | "invoice_review"
  | "proforma_pending"
  | "payment_reminder"
  | "payment_confirmed"
  // Comercial (Módulo Comercial)
  | "new_lead"
  | "commercial_visit"
  | "quote_sent"
  | "follow_up"
  | "deal_closed"
  | "deal_lost"
  // RRHH (Módulo RRHH)
  | "interview"
  | "training"
  | "vacation"
  | "sick_leave"
  | "onboarding"
  | "performance_review"
  // Proyectos (Módulo Proyectos)
  | "material_ordered"
  | "material_received"
  | "tech_assigned"
  | "internal_production"
  | "config_testing"
  | "project_delivery"
  | "post_install_check";

export interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: TaskType;  // Categoría (obligatorio)
  completed?: boolean;
  color?: string;  // Opcional, se asigna según type si no se especifica
  jobId?: string;
  companyId?: string;
  assignmentId?: string;
}
```

### Mapa de Colores por Categoría

```typescript
// lib/taskCategories.ts
export const CATEGORY_COLORS: Record<TaskType, string> = {
  // CORE Operaciones (Módulo Inicio)
  installation: "#f97316",      // 🟠 Naranja
  site_visit: "#facc15",         // 🟡 Amarillo
  meeting: "#a855f7",           // 🟣 Morado
  incident: "#ef4444",           // 🔴 Rojo
  
  // Facturación (Módulo Facturación)
  invoice_issued: "#60a5fa",     // 🟦 Azul claro
  invoice_review: "#3b82f6",     // 🔵 Azul oscuro
  proforma_pending: "#d97706",   // 🟫 Marrón claro
  payment_reminder: "#86efac",   // 🟩 Verde suave
  payment_confirmed: "#22c55e",  // 🟩 Verde intenso
  
  // Comercial (Módulo Comercial)
  new_lead: "#7dd3fc",           // 🟦 Celeste
  commercial_visit: "#d4a574",   // 🟫 Arena
  quote_sent: "#c4b5fd",         // 🟪 Lavanda
  follow_up: "#bef264",          // 🟩 Verde lima
  deal_closed: "#fb923c",        // 🟧 Naranja suave
  deal_lost: "#6b7280",          // ⚫ Gris
  
  // RRHH (Módulo RRHH)
  interview: "#0e7490",          // 🟦 Azul petróleo
  training: "#84cc16",           // 🟩 Verde oliva
  vacation: "#f5deb3",           // 🟫 Beige
  sick_leave: "#f87171",         // 🟥 Rojo suave
  onboarding: "#d8b4fe",         // 🟪 Morado pastel
  performance_review: "#fb7a1c",  // 🟧 Mandarina
  
  // Proyectos (Módulo Proyectos)
  material_ordered: "#3b82f6",   // 🟦 Azul medio
  material_received: "#22c55e",  // 🟩 Verde
  tech_assigned: "#fb923c",      // 🟧 Naranja suave
  internal_production: "#92400e", // 🟫 Marrón
  config_testing: "#7c3aed",     // 🟪 Morado oscuro
  project_delivery: "#16a34a",   // 🟩 Verde intenso
  post_install_check: "#374151", // ⚫ Gris oscuro
};

export function getTaskColor(type: TaskType): string {
  return CATEGORY_COLORS[type] || "#6b7280"; // Gris por defecto
}

/**
 * Obtiene todas las categorías disponibles para un módulo específico
 */
export function getCategoriesForModule(module: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos"): TaskType[] {
  const categories: Record<string, TaskType[]> = {
    inicio: ["installation", "site_visit", "meeting", "incident"],
    facturacion: ["invoice_issued", "invoice_review", "proforma_pending", "payment_reminder", "payment_confirmed"],
    comercial: ["new_lead", "commercial_visit", "quote_sent", "follow_up", "deal_closed", "deal_lost"],
    rrhh: ["interview", "training", "vacation", "sick_leave", "onboarding", "performance_review"],
    proyectos: [
      "installation", "site_visit", "meeting", "incident", // CORE
      "material_ordered", "material_received", "tech_assigned", 
      "internal_production", "config_testing", "project_delivery", "post_install_check"
    ],
  };
  
  return categories[module] || [];
}
```

### Backend (Futuro)

Cuando se construya el backend, la categoría será un enum:

```typescript
enum CalendarEventType {
  // CORE Operaciones (Módulo Inicio)
  INSTALLATION = "installation",
  SITE_VISIT = "site_visit",
  MEETING = "meeting",
  INCIDENT = "incident",
  
  // Facturación (Módulo Facturación)
  INVOICE_ISSUED = "invoice_issued",
  INVOICE_REVIEW = "invoice_review",
  PROFORMA_PENDING = "proforma_pending",
  PAYMENT_REMINDER = "payment_reminder",
  PAYMENT_CONFIRMED = "payment_confirmed",
  
  // Comercial (Módulo Comercial)
  NEW_LEAD = "new_lead",
  COMMERCIAL_VISIT = "commercial_visit",
  QUOTE_SENT = "quote_sent",
  FOLLOW_UP = "follow_up",
  DEAL_CLOSED = "deal_closed",
  DEAL_LOST = "deal_lost",
  
  // RRHH (Módulo RRHH)
  INTERVIEW = "interview",
  TRAINING = "training",
  VACATION = "vacation",
  SICK_LEAVE = "sick_leave",
  ONBOARDING = "onboarding",
  PERFORMANCE_REVIEW = "performance_review",
  
  // Proyectos (Módulo Proyectos)
  MATERIAL_ORDERED = "material_ordered",
  MATERIAL_RECEIVED = "material_received",
  TECH_ASSIGNED = "tech_assigned",
  INTERNAL_PRODUCTION = "internal_production",
  CONFIG_TESTING = "config_testing",
  PROJECT_DELIVERY = "project_delivery",
  POST_INSTALL_CHECK = "post_install_check",
}
```

---

## 5. Filtrado por Módulo

Cada módulo de la aplicación debe **filtrar** las tareas según las categorías que le corresponden:

### Módulo Inicio
**Solo muestra**: `installation`, `site_visit`, `meeting`, `incident`

```typescript
// En InicioCalendario.tsx o similar
const inicioCategories: TaskType[] = ["installation", "site_visit", "meeting", "incident"];
const filteredTasks = allTasks.filter(task => inicioCategories.includes(task.type));
```

### Módulo Facturación
**Solo muestra**: Categorías de facturación

### Módulo Comercial
**Solo muestra**: Categorías comerciales

### Módulo RRHH
**Solo muestra**: Categorías de RRHH

### Módulo Proyectos
**Muestra**: Categorías CORE + categorías específicas de proyectos

---

## Resumen

- **Total de categorías**: 28 categorías
- **Categorías CORE (Inicio)**: 4 categorías
- **Categorías por departamento**: 24 categorías adicionales
- **Organización**: Por módulo/departamento
- **Sistema de colores**: Coherente y semántico
- **Sin prioridades**: Todas las tareas son igual de importantes

---

*Última actualización: Sistema completo de categorías documentado*

