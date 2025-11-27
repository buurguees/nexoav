"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import { fetchProjects, ProjectData } from "../../../lib/mocks/projectMocks";
import { createProjectTask, ProjectTaskData } from "../../../lib/mocks/projectTaskMocks";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: ProjectTaskData) => Promise<void>;
  defaultProjectId?: string; // Para pre-rellenar desde el proyecto
}

const TASK_STATUSES = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En Proceso" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

const TASK_PRIORITIES = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

const DEPARTMENT_TAGS = [
  { value: "facturacion", label: "Facturación" },
  { value: "produccion", label: "Producción" },
  { value: "tecnico", label: "Técnico" },
  { value: "comercial", label: "Comercial" },
  { value: "rrhh", label: "RRHH" },
  { value: "administracion", label: "Administración" },
];

export function NewTaskModal({ isOpen, onClose, onSave, defaultProjectId }: NewTaskModalProps) {
  const [formData, setFormData] = useState({
    project_id: defaultProjectId || "",
    assigned_to: "",
    title: "",
    description: "",
    due_date: new Date().toISOString().split("T")[0],
    department_tag: "",
    status: "pendiente" as ProjectTaskData["status"],
    priority: "media" as ProjectTaskData["priority"] | null,
  });
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar proyectos al abrir
  useEffect(() => {
    if (isOpen) {
      const loadProjects = async () => {
        setIsLoadingProjects(true);
        try {
          const allProjects = await fetchProjects();
          setProjects(allProjects);
        } catch (error) {
          console.error("Error al cargar proyectos:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      };
      loadProjects();
    }
  }, [isOpen]);

  // Resetear formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        project_id: defaultProjectId || "",
        assigned_to: "",
        title: "",
        description: "",
        due_date: new Date().toISOString().split("T")[0],
        department_tag: "",
        status: "pendiente",
        priority: "media",
      });
      setErrors({});
    }
  }, [isOpen, defaultProjectId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.title.trim()) {
      next.title = "El título es obligatorio";
    }
    if (!formData.due_date) {
      next.due_date = "La fecha de vencimiento es obligatoria";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const created = await createProjectTask({
        project_id: formData.project_id || null,
        assigned_to: formData.assigned_to || null,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        due_date: formData.due_date,
        department_tag: formData.department_tag || null,
        status: formData.status,
        priority: formData.priority,
      });
      await onSave(created);
      onClose();
    } catch (error) {
      console.error("Error al crear tarea:", error);
      setErrors({
        submit: "Ha ocurrido un error al crear la tarea. Revisa los datos e inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1000,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          maxWidth: 700,
          maxHeight: "90vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 24px 48px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.06)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderBottom: "1px solid var(--border-medium)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--spacing-md)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Nueva Tarea
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
              }}
            >
              Crear una nueva tarea de proyecto
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              padding: "var(--spacing-xs)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground-secondary)",
            }}
          >
            <IconWrapper icon={X} size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)",
            padding: "var(--spacing-lg)",
            overflowY: "auto",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Título{" "}
              <span style={{ color: "var(--accent-red-primary)" }}>*</span>
            </label>
            <input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Revisar presupuesto E250061"
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.title
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors.title && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.title}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Descripción detallada de la tarea..."
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                resize: "vertical",
                fontSize: "var(--font-size-sm)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Proyecto (opcional)
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => handleChange("project_id", e.target.value)}
                disabled={isLoadingProjects}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Sin proyecto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.internal_ref} - {project.name} ({project.client_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Fecha de Vencimiento{" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange("due_date", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.due_date
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              {errors.due_date && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.due_date}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Estado{" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Prioridad
              </label>
              <select
                value={formData.priority || ""}
                onChange={(e) => handleChange("priority", e.target.value || null)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Sin prioridad</option>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Departamento
              </label>
              <select
                value={formData.department_tag}
                onChange={(e) => handleChange("department_tag", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Sin departamento</option>
                {DEPARTMENT_TAGS.map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors.submit && (
            <div
              style={{
                padding: "var(--spacing-md)",
                backgroundColor: "var(--error-background)",
                color: "var(--error)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              {errors.submit}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--spacing-md)",
              paddingTop: "var(--spacing-md)",
              borderTop: "1px solid var(--border-medium)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: isSubmitting
                  ? "var(--foreground-tertiary)"
                  : "var(--primary)",
                color: "white",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {isSubmitting ? "Guardando..." : "Crear Tarea"}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

