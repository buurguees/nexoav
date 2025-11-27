"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Edit2, Trash2 } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import {
  ProjectTaskData,
  fetchProjectTaskById,
  deleteProjectTask,
} from "../../../lib/mocks/projectTaskMocks";
import { EditTaskModal } from "./EditTaskModal";

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export function TaskDetail({ taskId, onClose, onUpdated, onDeleted }: TaskDetailProps) {
  const [task, setTask] = useState<ProjectTaskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const item = await fetchProjectTaskById(taskId);
        setTask(item);
      } catch (e) {
        console.error("Error al cargar tarea:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [taskId]);

  const handleDelete = async () => {
    if (!task || !confirm("¿Está seguro de que desea eliminar esta tarea?")) return;

    setIsDeleting(true);
    try {
      await deleteProjectTask(task.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      alert("Error al eliminar la tarea");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: ProjectTaskData["status"]) => {
    const colors: Record<ProjectTaskData["status"], { bg: string; text: string }> = {
      pendiente: { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" },
      en_proceso: { bg: "rgba(67, 83, 255, 0.1)", text: "rgb(67, 83, 255)" },
      completada: { bg: "rgba(0, 200, 117, 0.1)", text: "rgb(0, 200, 117)" },
      cancelada: { bg: "rgba(220, 53, 69, 0.1)", text: "rgb(220, 53, 69)" },
    };
    return colors[status] || { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" };
  };

  const getPriorityColor = (priority: ProjectTaskData["priority"]) => {
    if (!priority) return { bg: "transparent", text: "var(--foreground-secondary)" };
    const colors: Record<NonNullable<ProjectTaskData["priority"]>, { bg: string; text: string }> = {
      baja: { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" },
      media: { bg: "rgba(255, 193, 7, 0.1)", text: "rgb(255, 193, 7)" },
      alta: { bg: "rgba(255, 152, 0, 0.1)", text: "rgb(255, 152, 0)" },
      urgente: { bg: "rgba(220, 53, 69, 0.1)", text: "rgb(220, 53, 69)" },
    };
    return colors[priority] || { bg: "transparent", text: "var(--foreground-secondary)" };
  };

  const formatStatus = (status: ProjectTaskData["status"]) => {
    const labels: Record<ProjectTaskData["status"], string> = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completada: "Completada",
      cancelada: "Cancelada",
    };
    return labels[status] || status;
  };

  const formatPriority = (priority: ProjectTaskData["priority"]) => {
    if (!priority) return "Sin prioridad";
    const labels: Record<NonNullable<ProjectTaskData["priority"]>, string> = {
      baja: "Baja",
      media: "Media",
      alta: "Alta",
      urgente: "Urgente",
    };
    return labels[priority] || priority;
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--background)",
          }}
        >
          Cargando tarea...
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1000,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(70vw, 100% - 2 * var(--spacing-lg))",
          maxHeight: "90vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 24px 48px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)",
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
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Tarea
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: statusColor.bg,
                  color: statusColor.text,
                }}
              >
                {formatStatus(task.status)}
              </span>
              {task.priority && (
                <span
                  style={{
                    fontSize: "var(--font-size-xs)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: priorityColor.bg,
                    color: priorityColor.text,
                  }}
                >
                  {formatPriority(task.priority)}
                </span>
              )}
            </div>
            <h2
              style={{
                margin: "8px 0 0 0",
                fontSize: "var(--font-size-2xl)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              {task.title}
            </h2>
            {task.project_name && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--foreground-secondary)",
                }}
              >
                Proyecto: {task.project_name}
                {task.client_name && ` • Cliente: ${task.client_name}`}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              onClick={() => setIsEditOpen(true)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <IconWrapper icon={Edit2} size={16} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--error)",
                cursor: isDeleting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <IconWrapper icon={Trash2} size={16} />
              Eliminar
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--foreground-tertiary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconWrapper icon={X} size={20} />
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "var(--spacing-lg)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-xl)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Información General
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                  {task.description && (
                    <div>
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--foreground-tertiary)",
                        }}
                      >
                        Descripción
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)", whiteSpace: "pre-wrap" }}>
                        {task.description}
                      </p>
                    </div>
                  )}
                  <div>
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--foreground-tertiary)",
                      }}
                    >
                      Fecha de Vencimiento
                    </span>
                    <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)" }}>
                      {new Date(task.due_date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {task.department_tag && (
                    <div>
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--foreground-tertiary)",
                        }}
                      >
                        Departamento
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)", textTransform: "capitalize" }}>
                        {task.department_tag}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Estado y Prioridad
                </h3>
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-medium)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-sm)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                      Estado:
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-size-base)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: statusColor.text,
                      }}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </div>
                  {task.priority && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                        Prioridad:
                      </span>
                      <span
                        style={{
                          fontSize: "var(--font-size-base)",
                          fontWeight: "var(--font-weight-semibold)",
                          color: priorityColor.text,
                        }}
                      >
                        {formatPriority(task.priority)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {task.project_name && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-base)",
                      fontWeight: "var(--font-weight-semibold)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Proyecto Asociado
                  </h3>
                  <div
                    style={{
                      padding: "var(--spacing-md)",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border-medium)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--spacing-xs)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-medium)" }}>
                      {task.project_name}
                    </p>
                    {task.client_name && (
                      <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                        Cliente: {task.client_name}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {isEditOpen && task && (
        <EditTaskModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          task={task}
          onSave={async (updated) => {
            setTask(updated);
            setIsEditOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}

