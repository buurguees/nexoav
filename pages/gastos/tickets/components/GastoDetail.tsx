"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2, FileText } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchExpenseById, ExpenseData, updateExpense, deleteExpense } from "../../../../lib/mocks/expenseMocks";
import { EditGastoModal } from "./EditGastoModal";

interface GastoDetailProps {
  expenseId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export function GastoDetail({
  expenseId,
  onClose,
  onUpdated,
  onDeleted,
}: GastoDetailProps) {
  const [expense, setExpense] = useState<ExpenseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doc = await fetchExpenseById(expenseId);
        if (doc) {
          setExpense(doc);
        }
      } catch (error) {
        console.error("Error al cargar gasto:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [expenseId]);

  const handleStatusChange = async (newStatus: ExpenseData["status"]) => {
    if (!expense) return;

    try {
      const updated = await updateExpense(expense.id, {
        status: newStatus,
        payment_date: newStatus === "pagado" ? new Date().toISOString().split("T")[0] : null,
      });
      if (updated) {
        setExpense(updated);
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = async () => {
    if (!expense || !confirm("¿Está seguro de que desea eliminar este gasto?")) return;

    setIsDeleting(true);
    try {
      await deleteExpense(expense.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
    } finally {
      setIsDeleting(false);
    }
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
          Cargando gasto...
        </div>
      </div>
    );
  }

  if (!expense) {
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
          Gasto no encontrado
        </div>
      </div>
    );
  }

  const getStatusColor = (status: ExpenseData["status"]) => {
    const colors: Record<ExpenseData["status"], { bg: string; text: string }> = {
      pendiente_aprobacion: { bg: "rgba(255, 165, 0, 0.1)", text: "rgb(255, 165, 0)" },
      aprobado: { bg: "rgba(67, 83, 255, 0.1)", text: "rgb(67, 83, 255)" },
      pagado: { bg: "rgba(0, 200, 117, 0.1)", text: "rgb(0, 200, 117)" },
    };
    return colors[status] || { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" };
  };

  const formatStatus = (status: ExpenseData["status"]) => {
    const labels: Record<ExpenseData["status"], string> = {
      pendiente_aprobacion: "Pendiente de Aprobación",
      aprobado: "Aprobado",
      pagado: "Pagado",
    };
    return labels[status] || status;
  };

  const statusColor = getStatusColor(expense.status);

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
            borderBottom: "1px solid var(--border-medium)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              Gasto
            </h2>
            <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "center" }}>
              <span
                style={{
                  padding: "var(--spacing-xs) var(--spacing-sm)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: statusColor.bg,
                  color: statusColor.text,
                  fontSize: "var(--font-size-xs)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {formatStatus(expense.status)}
              </span>
              {expense.supplier_name && (
                <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
                  {expense.supplier_name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "var(--spacing-xs)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground-secondary)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <IconWrapper icon={X} size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--spacing-lg)" }}>
          {/* Información del gasto */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--spacing-md)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginBottom: "var(--spacing-xs)" }}>
                Fecha
              </div>
              <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                {new Date(expense.date_expense).toLocaleDateString("es-ES")}
              </div>
            </div>
            {expense.project_name && (
              <div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginBottom: "var(--spacing-xs)" }}>
                  Proyecto
                </div>
                <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                  {expense.project_name}
                </div>
              </div>
            )}
            {expense.payment_date && (
              <div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginBottom: "var(--spacing-xs)" }}>
                  Fecha de Pago
                </div>
                <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                  {new Date(expense.payment_date).toLocaleDateString("es-ES")}
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <h3
              style={{
                fontSize: "var(--font-size-md)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              Descripción
            </h3>
            <div
              style={{
                padding: "var(--spacing-md)",
                backgroundColor: "var(--background-secondary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              {expense.description}
            </div>
          </div>

          {/* Totales */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <h3
              style={{
                fontSize: "var(--font-size-md)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              Importes
            </h3>
            <div
              style={{
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-md)",
                backgroundColor: "var(--background-secondary)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                <span style={{ color: "var(--foreground-secondary)" }}>Base Imponible:</span>
                <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(expense.amount_base)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                <span style={{ color: "var(--foreground-secondary)" }}>IVA:</span>
                <span>
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(expense.amount_tax)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "var(--spacing-sm)",
                  paddingTop: "var(--spacing-sm)",
                  borderTop: "1px solid var(--border-medium)",
                  fontWeight: "var(--font-weight-semibold)",
                  fontSize: "var(--font-size-lg)",
                }}
              >
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  }).format(expense.amount_total)}
                </span>
              </div>
            </div>
          </div>

          {/* Comparación con pedido si existe */}
          {expense.purchase_order_number && expense.deviation !== null && (
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Comparación con Pedido
              </h3>
              <div
                style={{
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-md)",
                  backgroundColor: "var(--background-secondary)",
                }}
              >
                <div style={{ marginBottom: "var(--spacing-xs)", fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                  Pedido: {expense.purchase_order_number}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  <span style={{ color: "var(--foreground-secondary)" }}>Previsto:</span>
                  <span>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format((expense.amount_total || 0) - (expense.deviation || 0))}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  <span style={{ color: "var(--foreground-secondary)" }}>Real:</span>
                  <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(expense.amount_total)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "var(--spacing-sm)",
                    paddingTop: "var(--spacing-sm)",
                    borderTop: "1px solid var(--border-medium)",
                    color:
                      (expense.deviation || 0) > 0
                        ? "var(--accent-red-primary)"
                        : (expense.deviation || 0) < 0
                        ? "var(--accent-green-primary)"
                        : "var(--foreground)",
                    fontWeight: "var(--font-weight-semibold)",
                  }}
                >
                  <span>Desvío:</span>
                  <span>
                    {(expense.deviation || 0) > 0 ? "+" : ""}
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    }).format(expense.deviation || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notas */}
          {expense.notes && (
            <div>
              <h4
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Notas
              </h4>
              <div
                style={{
                  padding: "var(--spacing-sm)",
                  backgroundColor: "var(--background-secondary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {expense.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderTop: "1px solid var(--border-medium)",
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--spacing-sm)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              onClick={() => setIsEditModalOpen(true)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
              }}
            >
              <IconWrapper icon={Edit} size={16} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--accent-red-primary)",
                backgroundColor: "transparent",
                color: "var(--accent-red-primary)",
                cursor: isDeleting ? "not-allowed" : "pointer",
                fontSize: "var(--font-size-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
              }}
            >
              <IconWrapper icon={Trash2} size={16} />
              Eliminar
            </button>
            {expense.status === "pendiente_aprobacion" && (
              <button
                onClick={() => handleStatusChange("aprobado")}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: "var(--accent-blue-primary)",
                  color: "var(--background)",
                  cursor: "pointer",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Aprobar
              </button>
            )}
            {expense.status === "aprobado" && (
              <button
                onClick={() => handleStatusChange("pagado")}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: "var(--accent-green-primary)",
                  color: "var(--background)",
                  cursor: "pointer",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Marcar como Pagado
              </button>
            )}
          </div>
          {expense.file_url && (
            <button
              onClick={() => {
                // TODO: Implementar descarga/visualización del archivo
                window.open(expense.file_url || "", "_blank");
              }}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
              }}
            >
              <IconWrapper icon={FileText} size={16} />
              Ver Factura
            </button>
          )}
        </div>
      </motion.div>

      {/* Modal de edición */}
      {isEditModalOpen && expense && (
        <EditGastoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          expenseId={expense.id}
          onSave={async (updated) => {
            setExpense(updated);
            setIsEditModalOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}

