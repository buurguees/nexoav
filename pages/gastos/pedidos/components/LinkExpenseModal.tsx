"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Link2 } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchExpenses, ExpenseData } from "../../../../lib/mocks/expenseMocks";
import { fetchPurchaseOrderById, linkExpenseToPurchaseOrder } from "../../../../lib/mocks/purchaseOrdersMocks";

interface LinkExpenseModalProps {
  purchaseOrderId: string;
  onClose: () => void;
  onLinked: () => void;
}

export function LinkExpenseModal({ purchaseOrderId, onClose, onLinked }: LinkExpenseModalProps) {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const order = await fetchPurchaseOrderById(purchaseOrderId);
        if (!order) {
          setError("Pedido no encontrado");
          setIsLoading(false);
          return;
        }
        const allExpenses = await fetchExpenses(order.project_id);
        const available = allExpenses.filter((exp) => !exp.purchase_order_id);
        setExpenses(available);
      } catch (e) {
        console.error("Error cargando gastos:", e);
        setError("Error al cargar los gastos");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [purchaseOrderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpenseId) {
      setError("Debe seleccionar un gasto para vincular");
      return;
    }
    setIsSubmitting(true);
    try {
      await linkExpenseToPurchaseOrder(purchaseOrderId, selectedExpenseId);
      onLinked();
    } catch (e) {
      console.error("Error vinculando gasto:", e);
      setError("No se ha podido vincular el gasto. Revise las reglas de negocio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!purchaseOrderId) return null;

  const formatCurrency = (v: number | null | undefined) =>
    v == null
      ? "-"
      : new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v);

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
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1100,
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
          width: "90%",
          maxWidth: "720px",
          maxHeight: "80vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          zIndex: 1101,
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
          }}
        >
          <h2
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-semibold)",
              margin: 0,
            }}
          >
            Vincular gasto al pedido
          </h2>
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

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "var(--spacing-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-md)",
            overflowY: "auto",
          }}
        >
          {isLoading ? (
            <div>Cargando gastos disponibles...</div>
          ) : expenses.length === 0 ? (
            <div style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
              No hay gastos disponibles en este proyecto sin pedido vinculado.
            </div>
          ) : (
            <div
              style={{
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                overflow: "hidden",
              }}
            >
              {expenses.map((exp) => (
                <label
                  key={exp.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderBottom: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    backgroundColor:
                      selectedExpenseId === exp.id ? "var(--background-secondary)" : "transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <input
                      type="radio"
                      name="expense"
                      value={exp.id}
                      checked={selectedExpenseId === exp.id}
                      onChange={() => {
                        setSelectedExpenseId(exp.id);
                        setError(null);
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                        }}
                      >
                        {exp.description}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--foreground-tertiary)",
                        }}
                      >
                        {new Date(exp.date_expense).toLocaleDateString("es-ES")} ·{" "}
                        {exp.supplier_name || "Sin proveedor"}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-semibold)",
                    }}
                  >
                    {formatCurrency(exp.amount_total)}
                  </span>
                </label>
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: "var(--spacing-xs)",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--accent-red-light)",
                color: "var(--accent-red-primary)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              marginTop: "var(--spacing-md)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--spacing-sm)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "var(--font-size-sm)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || expenses.length === 0}
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor:
                  isSubmitting || expenses.length === 0
                    ? "var(--foreground-tertiary)"
                    : "var(--accent-blue-primary)",
                color: "var(--background)",
                cursor:
                  isSubmitting || expenses.length === 0 ? "not-allowed" : "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
              }}
            >
              <IconWrapper icon={Link2} size={16} />
              {isSubmitting ? "Vinculando..." : "Vincular gasto"}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}


