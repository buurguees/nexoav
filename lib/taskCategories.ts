/**
 * Sistema Completo de Categorías de Tareas
 * 
 * IMPORTANTE: El sistema NO utiliza prioridades (low, medium, high).
 * Todas las tareas son igual de importantes.
 * Lo que distingue a las tareas es su categoría/función.
 * 
 * Total: 28 categorías organizadas por módulo/departamento
 */

// ============================================
// TIPOS DE CATEGORÍAS (28 categorías totales)
// ============================================

export type TaskType =
  // CORE Operaciones (Módulo Inicio) - 4 categorías
  | "installation"
  | "site_visit"
  | "meeting"
  | "incident"
  // Facturación (Módulo Facturación) - 5 categorías
  | "invoice_issued"
  | "invoice_review"
  | "proforma_pending"
  | "payment_reminder"
  | "payment_confirmed"
  // Comercial (Módulo Comercial) - 6 categorías
  | "new_lead"
  | "commercial_visit"
  | "quote_sent"
  | "follow_up"
  | "deal_closed"
  | "deal_lost"
  // RRHH (Módulo RRHH) - 6 categorías
  | "interview"
  | "training"
  | "vacation"
  | "sick_leave"
  | "onboarding"
  | "performance_review"
  // Proyectos (Módulo Proyectos) - 7 categorías
  | "material_ordered"
  | "material_received"
  | "tech_assigned"
  | "internal_production"
  | "config_testing"
  | "project_delivery"
  | "post_install_check";

// ============================================
// INTERFAZ DE CATEGORÍA
// ============================================

export interface TaskCategory {
  type: TaskType;
  label: string;
  color: string;
  description: string;
  module: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos";
}

// ============================================
// MAPA COMPLETO DE CATEGORÍAS (28 categorías)
// ============================================

export const TASK_CATEGORIES: Record<TaskType, TaskCategory> = {
  // ===== CORE Operaciones (Módulo Inicio) =====
  installation: {
    type: "installation",
    label: "Instalación",
    color: "#fb923c", // 🟠 Naranja medio (entre pastel y vibrante)
    description: "Montajes, puestas en marcha, días de obra",
    module: "inicio",
  },
  site_visit: {
    type: "site_visit",
    label: "Visita de Obra",
    color: "#fde047", // 🟡 Amarillo medio (entre pastel y vibrante)
    description: "Medidas, revisiones, supervisión previa",
    module: "inicio",
  },
  meeting: {
    type: "meeting",
    label: "Reunión",
    color: "#c084fc", // 🟣 Morado medio (entre pastel y vibrante)
    description: "Reuniones internas o con cliente",
    module: "inicio",
  },
  incident: {
    type: "incident",
    label: "Incidencia",
    color: "#f87171", // 🔴 Rojo medio (entre pastel y vibrante)
    description: "Problemas, urgencias, revisiones de error",
    module: "inicio",
  },

  // ===== Facturación (Módulo Facturación) =====
  invoice_issued: {
    type: "invoice_issued",
    label: "Emisión de Factura",
    color: "#7dd3fc", // 🟦 Azul claro medio (entre pastel y vibrante)
    description: "Momento en que se genera la factura",
    module: "facturacion",
  },
  invoice_review: {
    type: "invoice_review",
    label: "Revisión de Factura",
    color: "#60a5fa", // 🔵 Azul medio (entre pastel y vibrante)
    description: "Correcciones, verificación, validación",
    module: "facturacion",
  },
  proforma_pending: {
    type: "proforma_pending",
    label: "Proforma Pendiente",
    color: "#fdba74", // 🟫 Marrón claro medio (entre pastel y vibrante)
    description: "Proformas que deben transformarse en factura",
    module: "facturacion",
  },
  payment_reminder: {
    type: "payment_reminder",
    label: "Recordatorio de Pago",
    color: "#86efac", // 🟩 Verde suave medio (entre pastel y vibrante)
    description: "Seguimiento a clientes",
    module: "facturacion",
  },
  payment_confirmed: {
    type: "payment_confirmed",
    label: "Cobro Confirmado",
    color: "#4ade80", // 🟩 Verde medio (entre pastel y vibrante)
    description: "Pagos recibidos, cierre de ciclo",
    module: "facturacion",
  },

  // ===== Comercial (Módulo Comercial) =====
  new_lead: {
    type: "new_lead",
    label: "Lead Nuevo",
    color: "#7dd3fc", // 🟦 Celeste medio (entre pastel y vibrante)
    description: "Entrada de un cliente potencial",
    module: "comercial",
  },
  commercial_visit: {
    type: "commercial_visit",
    label: "Visita Comercial",
    color: "#facc15", // 🟫 Arena medio (entre pastel y vibrante)
    description: "Visita presencial / videollamada comercial",
    module: "comercial",
  },
  quote_sent: {
    type: "quote_sent",
    label: "Envío de Presupuesto",
    color: "#c4b5fd", // 🟪 Lavanda medio (entre pastel y vibrante)
    description: "Presupuesto enviado, pendiente de respuesta",
    module: "comercial",
  },
  follow_up: {
    type: "follow_up",
    label: "Seguimiento",
    color: "#bef264", // 🟩 Verde lima medio (entre pastel y vibrante)
    description: "Follow-up a un cliente",
    module: "comercial",
  },
  deal_closed: {
    type: "deal_closed",
    label: "Cierre de Venta",
    color: "#fb923c", // 🟧 Naranja suave medio (entre pastel y vibrante)
    description: "Proyecto confirmado, pasa a Producción",
    module: "comercial",
  },
  deal_lost: {
    type: "deal_lost",
    label: "Pérdida de Oportunidad",
    color: "#9ca3af", // ⚫ Gris medio (entre pastel y vibrante)
    description: "No aceptado, cancelado",
    module: "comercial",
  },

  // ===== RRHH (Módulo RRHH) =====
  interview: {
    type: "interview",
    label: "Entrevista de Candidato",
    color: "#22d3ee", // 🟦 Azul petróleo medio (entre pastel y vibrante)
    description: "Reclutamiento",
    module: "rrhh",
  },
  training: {
    type: "training",
    label: "Formación Interna",
    color: "#84cc16", // 🟩 Verde oliva medio (entre pastel y vibrante)
    description: "Cursos, capacitaciones",
    module: "rrhh",
  },
  vacation: {
    type: "vacation",
    label: "Vacaciones",
    color: "#fde68a", // 🟫 Beige medio (entre pastel y vibrante)
    description: "Días de descanso programados",
    module: "rrhh",
  },
  sick_leave: {
    type: "sick_leave",
    label: "Baja Temporal",
    color: "#f87171", // 🟥 Rojo suave medio (entre pastel y vibrante)
    description: "Enfermedad, accidente, médico",
    module: "rrhh",
  },
  onboarding: {
    type: "onboarding",
    label: "Onboarding",
    color: "#c084fc", // 🟪 Morado medio (entre pastel y vibrante)
    description: "Primer día de un nuevo trabajador",
    module: "rrhh",
  },
  performance_review: {
    type: "performance_review",
    label: "Evaluación de Desempeño",
    color: "#fb923c", // 🟧 Mandarina medio (entre pastel y vibrante)
    description: "Revisión trimestral o anual",
    module: "rrhh",
  },

  // ===== Proyectos (Módulo Proyectos) =====
  material_ordered: {
    type: "material_ordered",
    label: "Pedido de Material",
    color: "#60a5fa", // 🟦 Azul medio (entre pastel y vibrante)
    description: "Se ha hecho un pedido",
    module: "proyectos",
  },
  material_received: {
    type: "material_received",
    label: "Recepción de Material",
    color: "#4ade80", // 🟩 Verde medio (entre pastel y vibrante)
    description: "Material llega al almacén",
    module: "proyectos",
  },
  tech_assigned: {
    type: "tech_assigned",
    label: "Programación de Técnicos",
    color: "#fb923c", // 🟧 Naranja suave medio (entre pastel y vibrante)
    description: "Asignación de equipo",
    module: "proyectos",
  },
  internal_production: {
    type: "internal_production",
    label: "Producción Interna",
    color: "#facc15", // 🟫 Marrón medio (entre pastel y vibrante)
    description: "Preparación de cables, test de pantallas",
    module: "proyectos",
  },
  config_testing: {
    type: "config_testing",
    label: "Configuración / Testing",
    color: "#a855f7", // 🟪 Morado oscuro medio (entre pastel y vibrante)
    description: "Procesado, players, blending, configs",
    module: "proyectos",
  },
  project_delivery: {
    type: "project_delivery",
    label: "Entrega del Proyecto",
    color: "#22c55e", // 🟩 Verde intenso medio (entre pastel y vibrante)
    description: "Fin de obra / entrega final",
    module: "proyectos",
  },
  post_install_check: {
    type: "post_install_check",
    label: "Revisión Post-Instalación",
    color: "#9ca3af", // ⚫ Gris oscuro medio (entre pastel y vibrante)
    description: "Check final o soporte postinstalación",
    module: "proyectos",
  },
};

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

/**
 * Obtiene el color de una categoría de tarea
 */
export function getTaskColor(type: TaskType): string {
  return TASK_CATEGORIES[type]?.color || "#6b7280"; // Gris por defecto
}

/**
 * Obtiene la información completa de una categoría
 */
export function getTaskCategory(type: TaskType): TaskCategory {
  return TASK_CATEGORIES[type] || {
    type,
    label: type,
    color: "#6b7280",
    description: "",
    module: "inicio",
  };
}

/**
 * Obtiene todas las categorías disponibles
 */
export function getAllTaskCategories(): TaskCategory[] {
  return Object.values(TASK_CATEGORIES);
}

/**
 * Obtiene todas las categorías disponibles para un módulo específico
 * 
 * IMPORTANTE: Cada módulo solo muestra sus categorías correspondientes.
 * - Módulo Inicio: Solo las 4 categorías CORE (installation, site_visit, meeting, incident)
 * - Módulo Facturación: 5 categorías de facturación
 * - Módulo Comercial: 6 categorías comerciales
 * - Módulo RRHH: 6 categorías de RRHH
 * - Módulo Proyectos: 4 CORE + 7 específicas de proyectos
 * 
 * @param module - Módulo de la aplicación
 * @returns Array de tipos de categorías permitidas en ese módulo
 */
export function getCategoriesForModule(
  module: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos"
): TaskType[] {
  const categories: Record<string, TaskType[]> = {
    // Módulo Inicio: Solo las 4 categorías CORE según inicio.md y categorias-tareas.md
    inicio: ["installation", "site_visit", "meeting", "incident"],
    facturacion: [
      "invoice_issued",
      "invoice_review",
      "proforma_pending",
      "payment_reminder",
      "payment_confirmed",
    ],
    comercial: [
      "new_lead",
      "commercial_visit",
      "quote_sent",
      "follow_up",
      "deal_closed",
      "deal_lost",
    ],
    rrhh: [
      "interview",
      "training",
      "vacation",
      "sick_leave",
      "onboarding",
      "performance_review",
    ],
    proyectos: [
      // CORE (también en Inicio)
      "installation",
      "site_visit",
      "meeting",
      "incident",
      // Específicas de Proyectos
      "material_ordered",
      "material_received",
      "tech_assigned",
      "internal_production",
      "config_testing",
      "project_delivery",
      "post_install_check",
    ],
  };

  return categories[module] || [];
}

/**
 * Filtra un array de tareas según las categorías permitidas en un módulo
 * 
 * IMPORTANTE: Esta función debe usarse en cada módulo para filtrar las tareas
 * y mostrar solo las categorías correspondientes a ese módulo.
 * 
 * Ejemplo de uso en módulo Inicio:
 * ```typescript
 * const filteredTasks = filterTasksByModule(allTasks, "inicio");
 * // Solo mostrará: installation, site_visit, meeting, incident
 * ```
 * 
 * @param tasks - Array de tareas a filtrar
 * @param module - Módulo de la aplicación ("inicio", "facturacion", "comercial", "rrhh", "proyectos")
 * @returns Array de tareas filtradas que solo incluyen las categorías permitidas en ese módulo
 */
export function filterTasksByModule<T extends { type: TaskType }>(
  tasks: T[],
  module: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos"
): T[] {
  const allowedCategories = getCategoriesForModule(module);
  return tasks.filter((task) => allowedCategories.includes(task.type));
}
