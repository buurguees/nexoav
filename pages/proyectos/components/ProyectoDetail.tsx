"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2, Copy } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import { fetchProjectById, ProjectData } from "../../../lib/mocks/projectMocks";
import { fetchProjectTasks, ProjectTaskData } from "../../../lib/mocks/projectTaskMocks";
import { fetchExpenses, ExpenseData } from "../../../lib/mocks/expenseMocks";
import { fetchPresupuestos, fetchProformas, fetchFacturas, SalesDocumentData } from "../../../lib/mocks/salesDocumentsMocks";
import { ProyectoLogisticaTab } from "./ProyectoLogisticaTab";
import { TaskDetail } from "./TaskDetail";

interface ProyectoDetailProps {
  projectId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

type TabType = "general" | "equipo" | "tareas" | "logistica" | "economico" | "ventas";

export function ProyectoDetail({
  projectId,
  onClose,
  onUpdated,
  onDeleted,
}: ProyectoDetailProps) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [tasks, setTasks] = useState<ProjectTaskData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [salesDocuments, setSalesDocuments] = useState<SalesDocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const proj = await fetchProjectById(projectId);
        if (proj) {
          setProject(proj);
          // Cargar datos relacionados
          const [tasksData, expensesData, presupuestos, proformas, facturas] = await Promise.all([
            fetchProjectTasks(projectId),
            fetchExpenses(projectId),
            fetchPresupuestos(),
            fetchProformas(),
            fetchFacturas(),
          ]);
          setTasks(tasksData);
          setExpenses(expensesData);
          // Filtrar documentos de venta por proyecto
          const allSalesDocs = [...presupuestos, ...proformas, ...facturas];
          setSalesDocuments(allSalesDocs.filter((doc) => doc.project_id === projectId));
        }
      } catch (error) {
        console.error("Error al cargar proyecto:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [projectId]);

  const handleDelete = async () => {
    if (!project || !confirm("¿Está seguro de que desea eliminar este proyecto?")) return;

    setIsDeleting(true);
    try {
      // TODO: Implementar deleteProject cuando esté disponible
      // await deleteProject(project.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      alert("Error al eliminar el proyecto");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (value: number | undefined | null) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusLabel = (status: ProjectData["status"]) => {
    const labels: Record<ProjectData["status"], string> = {
      borrador: "Borrador",
      presupuestado: "Presupuestado",
      aceptado: "Aceptado",
      ejecutando: "En Ejecución",
      finalizado: "Finalizado",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: ProjectData["status"]) => {
    const colors: Record<ProjectData["status"], string> = {
      borrador: "rgba(128, 128, 128, 0.1)",
      presupuestado: "rgba(67, 83, 255, 0.1)",
      aceptado: "rgba(0, 200, 117, 0.1)",
      ejecutando: "rgba(255, 193, 7, 0.1)",
      finalizado: "rgba(0, 200, 117, 0.1)",
      cancelado: "rgba(255, 59, 48, 0.1)",
    };
    return colors[status] || "rgba(128, 128, 128, 0.1)";
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            backgroundColor: "var(--background)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          Cargando proyecto...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            backgroundColor: "var(--background)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          Proyecto no encontrado
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; show: boolean }[] = [
    { id: "general", label: "General", show: true },
    { id: "equipo", label: "Equipo", show: true },
    { id: "tareas", label: "Tareas", show: true },
    { id: "logistica", label: "Logística", show: true },
    { id: "economico", label: "Económico", show: true },
    { id: "ventas", label: "Ventas", show: true },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          width: "min(70vw, 100% - 2 * var(--spacing-lg))",
          maxHeight: "90vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderBottom: "1px solid var(--border-soft)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                margin: 0,
                marginBottom: "var(--spacing-xs)",
              }}
            >
              {project.name}
            </h2>
            <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: getStatusColor(project.status),
                  color: "var(--foreground)",
                }}
              >
                {getStatusLabel(project.status)}
              </span>
              {project.internal_ref && (
                <span
                  style={{
                    fontSize: "var(--font-size-xs)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--background-secondary)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  Ref: {project.internal_ref}
                </span>
              )}
              {project.client_name && (
                <span
                  style={{
                    fontSize: "var(--font-size-xs)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--background-secondary)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {project.client_name}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            <button
              onClick={() => {
                // TODO: Implementar duplicar proyecto
                alert("Funcionalidad de duplicar proyecto en desarrollo");
              }}
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              <IconWrapper icon={Copy} size={14} />
              Duplicar
            </button>
            <button
              onClick={() => {
                // TODO: Implementar editar proyecto
                alert("Funcionalidad de editar proyecto en desarrollo");
              }}
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              <IconWrapper icon={Edit} size={14} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--error)",
                cursor: isDeleting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              <IconWrapper icon={Trash2} size={14} />
              Eliminar
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--foreground-secondary)",
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-soft)",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "var(--spacing-md) var(--spacing-lg)",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                backgroundColor: "transparent",
                color: activeTab === tab.id ? "var(--primary)" : "var(--foreground-secondary)",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: activeTab === tab.id ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--spacing-lg)",
          }}
        >
          {activeTab === "general" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Información del Proyecto
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "var(--spacing-md)",
                  }}
                >
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                      Nombre
                    </label>
                    <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>{project.name}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                      Estado
                    </label>
                    <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>
                      {getStatusLabel(project.status)}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                      Cliente
                    </label>
                    <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>
                      {project.client_name || "-"}
                    </div>
                  </div>
                  {project.client_po_number && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                        Nº Pedido Cliente
                      </label>
                      <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>
                        {project.client_po_number}
                      </div>
                    </div>
                  )}
                  {project.start_date && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                        Fecha Inicio
                      </label>
                      <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>
                        {formatDate(project.start_date)}
                      </div>
                    </div>
                  )}
                  {project.end_date && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                        Fecha Fin
                      </label>
                      <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>
                        {formatDate(project.end_date)}
                      </div>
                    </div>
                  )}
                  {project.budget_estimated && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                        Presupuesto Estimado
                      </label>
                      <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4 }}>
                        {formatCurrency(project.budget_estimated)}
                      </div>
                    </div>
                  )}
                  {project.total_billing && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                        Total Facturado
                      </label>
                      <div style={{ fontSize: "var(--font-size-sm)", marginTop: 4, fontWeight: "var(--font-weight-semibold)" }}>
                        {formatCurrency(project.total_billing)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {project.description && (
                <div>
                  <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                    Descripción
                  </label>
                  <div
                    style={{
                      fontSize: "var(--font-size-sm)",
                      marginTop: 4,
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--background-secondary)",
                      borderRadius: "var(--radius-md)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {project.description}
                  </div>
                </div>
              )}

              {project.location_name && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Ubicación
                  </h3>
                  <div style={{ fontSize: "var(--font-size-sm)" }}>{project.location_name}</div>
                  {project.location_address && (
                    <div
                      style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--foreground-secondary)",
                        marginTop: 4,
                      }}
                    >
                      {[
                        project.location_address.street,
                        project.location_address.city,
                        project.location_address.zip,
                        project.location_address.province,
                        project.location_address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "equipo" && (
            <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--foreground-secondary)" }}>
              <p>La gestión de asignación de técnicos se implementará próximamente.</p>
            </div>
          )}

          {activeTab === "tareas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-lg)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Tareas del Proyecto ({tasks.length})
              </h3>
              {tasks.length === 0 ? (
                <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--foreground-secondary)" }}>
                  No hay tareas asociadas a este proyecto.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      style={{
                        padding: "var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: "var(--font-size-base)",
                              fontWeight: "var(--font-weight-semibold)",
                              margin: 0,
                            }}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p
                              style={{
                                margin: "4px 0 0",
                                fontSize: "var(--font-size-sm)",
                                color: "var(--foreground-secondary)",
                              }}
                            >
                              {task.description}
                            </p>
                          )}
                          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
                            <span
                              style={{
                                fontSize: "var(--font-size-xs)",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: "var(--background-secondary)",
                                color: "var(--foreground-secondary)",
                              }}
                            >
                              {task.status}
                            </span>
                            {task.priority && (
                              <span
                                style={{
                                  fontSize: "var(--font-size-xs)",
                                  padding: "2px 8px",
                                  borderRadius: "var(--radius-sm)",
                                  backgroundColor: "var(--background-secondary)",
                                  color: "var(--foreground-secondary)",
                                }}
                              >
                                {task.priority}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: "var(--font-size-xs)",
                                color: "var(--foreground-tertiary)",
                              }}
                            >
                              Vence: {formatDate(task.due_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "logistica" && <ProyectoLogisticaTab projectId={projectId} />}

          {activeTab === "economico" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Gastos del Proyecto
                </h3>
                {expenses.length === 0 ? (
                  <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--foreground-secondary)" }}>
                    No hay gastos asociados a este proyecto.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                    {expenses.map((expense) => (
                      <div
                        key={expense.id}
                        style={{
                          padding: "var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                fontSize: "var(--font-size-base)",
                                fontWeight: "var(--font-weight-semibold)",
                                margin: 0,
                              }}
                            >
                              {expense.description}
                            </h4>
                            <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
                              <span
                                style={{
                                  fontSize: "var(--font-size-xs)",
                                  color: "var(--foreground-tertiary)",
                                }}
                              >
                                {formatDate(expense.date_expense)}
                              </span>
                              <span
                                style={{
                                  fontSize: "var(--font-size-xs)",
                                  padding: "2px 8px",
                                  borderRadius: "var(--radius-sm)",
                                  backgroundColor: "var(--background-secondary)",
                                  color: "var(--foreground-secondary)",
                                }}
                              >
                                {expense.status}
                              </span>
                            </div>
                          </div>
                          <div style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                            {formatCurrency(expense.amount_total)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Pedidos de Compra
                </h3>
                <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--foreground-secondary)" }}>
                  <p>La gestión de pedidos de compra se implementará próximamente.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ventas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-lg)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Documentos de Venta ({salesDocuments.length})
              </h3>
              {salesDocuments.length === 0 ? (
                <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--foreground-secondary)" }}>
                  No hay documentos de venta asociados a este proyecto.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                  {salesDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        padding: "var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: "var(--font-size-base)",
                              fontWeight: "var(--font-weight-semibold)",
                              margin: 0,
                            }}
                          >
                            {doc.document_number} - {doc.type}
                          </h4>
                          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
                            <span
                              style={{
                                fontSize: "var(--font-size-xs)",
                                color: "var(--foreground-tertiary)",
                              }}
                            >
                              {formatDate(doc.date_issued)}
                            </span>
                            <span
                              style={{
                                fontSize: "var(--font-size-xs)",
                                padding: "2px 8px",
                                borderRadius: "var(--radius-sm)",
                                backgroundColor: "var(--background-secondary)",
                                color: "var(--foreground-secondary)",
                              }}
                            >
                              {doc.status}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                          {formatCurrency(doc.totals_data?.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdated={() => {
            // Recargar tareas
            fetchProjectTasks(projectId).then(setTasks);
            setSelectedTaskId(null);
          }}
        />
      )}
    </>
  );
}

