"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2, Link2 } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  fetchPurchaseOrderById,
  PurchaseOrderData,
  updatePurchaseOrder,
  cancelPurchaseOrder,
} from "../../../../lib/mocks/purchaseOrdersMocks";
import { EditPedidoModal } from "./EditPedidoModal";

interface PedidoDetailProps {
  pedidoId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
  onLinkExpense?: (pedidoId: string) => void;
}

export function PedidoDetail({
  pedidoId,
  onClose,
  onUpdated,
  onDeleted,
  onLinkExpense,
}: PedidoDetailProps) {
  const [pedido, setPedido] = useState<PurchaseOrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const po = await fetchPurchaseOrderById(pedidoId);
        if (po) setPedido(po);
      } catch (e) {
        console.error("Error al cargar pedido:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [pedidoId]);

  const handleStatusChange = async (status: PurchaseOrderData["status"]) => {
    if (!pedido) return;
    try {
      const updated = await updatePurchaseOrder(pedido.id, { status });
      setPedido(updated);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error("Error al actualizar pedido:", e);
    }
  };

  const handleCancel = async () => {
    if (!pedido || !confirm("¿Cancelar este pedido de compra?")) return;
    setIsCancelling(true);
    try {
      const updated = await cancelPurchaseOrder(pedido.id);
      setPedido(updated);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error("Error al cancelar pedido:", e);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--background)",
          }}
        >
          Cargando pedido...
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--background)",
          }}
        >
          Pedido no encontrado
        </div>
      </div>
    );
  }

  const formatCurrency = (v: number | null | undefined) =>
    v == null
      ? "-"
      : new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v);

  const statusLabel =
    pedido.status === "pending"
      ? "Pendiente"
      : pedido.status === "fulfilled"
      ? "Cumplido"
      : "Cancelado";

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
          backgroundColor: "rgba(0,0,0,0.5)",
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
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
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
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Pedido de Compra
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: "var(--background-secondary)",
                  fontSize: "var(--font-size-xs)",
                }}
              >
                {pedido.document_number}
              </span>
            </div>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
              {pedido.project_name || "Proyecto no encontrado"}
            </span>
            {pedido.supplier_name && (
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Proveedor: {pedido.supplier_name}
              </span>
            )}
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
            }}
          >
            <IconWrapper icon={X} size={20} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            padding: "var(--spacing-lg)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "var(--spacing-lg)",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Descripción
              </h3>
              <div
                style={{
                  padding: "var(--spacing-sm)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--background-secondary)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {pedido.description}
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Importes
              </h3>
              <div
                style={{
                  padding: "var(--spacing-sm)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  backgroundColor: "var(--background-secondary)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  <span>Previsto</span>
                  <span>{formatCurrency(pedido.estimated_amount)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  <span>Real</span>
                  <span>{formatCurrency(pedido.expense_amount)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--font-size-sm)",
                    marginTop: 4,
                    paddingTop: 4,
                    borderTop: "1px solid var(--border-medium)",
                    color:
                      pedido.deviation != null && pedido.deviation > 0
                        ? "var(--color-error)"
                        : "var(--color-success)",
                  }}
                >
                  <span>Desvío</span>
                  <span>
                    {pedido.deviation != null && pedido.deviation >= 0 ? "+" : ""}
                    {pedido.deviation != null ? formatCurrency(pedido.deviation) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3
              style={{
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-semibold)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              Estado
            </h3>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "999px",
                backgroundColor: "var(--background-secondary)",
                fontSize: "var(--font-size-xs)",
              }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div
          style={{
            padding: "var(--spacing-md) var(--spacing-lg)",
            borderTop: "1px solid var(--border-medium)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap" }}>
            {pedido.status === "pending" && (
              <button
                onClick={() => setIsEditOpen(true)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  backgroundColor: "var(--background)",
                  fontSize: "var(--font-size-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                }}
              >
                <IconWrapper icon={Edit} size={16} />
                Editar
              </button>
            )}
            {pedido.status === "pending" && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--accent-red-primary)",
                  backgroundColor: "transparent",
                  color: "var(--accent-red-primary)",
                  fontSize: "var(--font-size-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                  cursor: isCancelling ? "not-allowed" : "pointer",
                }}
              >
                <IconWrapper icon={Trash2} size={16} />
                Cancelar
              </button>
            )}
            {pedido.status === "pending" && !pedido.expense_id && onLinkExpense && (
              <button
                onClick={() => onLinkExpense(pedido.id)}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: "var(--accent-blue-primary)",
                  color: "var(--background)",
                  fontSize: "var(--font-size-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                }}
              >
                <IconWrapper icon={Link2} size={16} />
                Vincular Gasto
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {isEditOpen && pedido && (
        <EditPedidoModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          pedido={pedido}
          onSave={async (updated) => {
            setPedido(updated);
            setIsEditOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}


