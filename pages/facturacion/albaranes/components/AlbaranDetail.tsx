"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchDeliveryNoteById, DeliveryNoteData, confirmDeliveryNote, cancelDeliveryNote } from "../../../../lib/mocks/deliveryNotesMocks";
import { fetchDeliveryNoteLines, DeliveryNoteLineData } from "../../../../lib/mocks/deliveryNotesMocks";
import { EditAlbaranModal } from "./EditAlbaranModal";

interface AlbaranDetailProps {
  albaranId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onCreateReturn?: (albaranId: string) => void;
}

export function AlbaranDetail({
  albaranId,
  onClose,
  onUpdated,
  onCreateReturn,
}: AlbaranDetailProps) {
  const [albaran, setAlbaran] = useState<DeliveryNoteData | null>(null);
  const [lines, setLines] = useState<DeliveryNoteLineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doc = await fetchDeliveryNoteById(albaranId);
        if (doc) {
          setAlbaran(doc);
          const documentLines = await fetchDeliveryNoteLines(albaranId);
          setLines(documentLines);
        }
      } catch (error) {
        console.error("Error al cargar albarán:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [albaranId]);

  const handleConfirm = async () => {
    if (!albaran || !confirm("¿Está seguro de que desea confirmar este albarán? Esto actualizará el stock.")) return;

    setIsConfirming(true);
    try {
      const confirmed = await confirmDeliveryNote(albaran.id);
      if (confirmed) {
        setAlbaran(confirmed);
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error("Error al confirmar albarán:", error);
      alert("Error al confirmar el albarán");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!albaran || !confirm("¿Está seguro de que desea cancelar este albarán?")) return;

    setIsCancelling(true);
    try {
      const cancelled = await cancelDeliveryNote(albaran.id);
      if (cancelled) {
        setAlbaran(cancelled);
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error("Error al cancelar albarán:", error);
      alert("Error al cancelar el albarán");
    } finally {
      setIsCancelling(false);
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
          Cargando albarán...
        </div>
      </div>
    );
  }

  if (!albaran) {
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
          Albarán no encontrado
        </div>
      </div>
    );
  }

  const getStatusColor = (status: DeliveryNoteData["status"]) => {
    const colors: Record<DeliveryNoteData["status"], { bg: string; text: string }> = {
      draft: { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" },
      confirmed: { bg: "rgba(0, 200, 117, 0.1)", text: "rgb(0, 200, 117)" },
      cancelled: { bg: "rgba(220, 53, 69, 0.1)", text: "rgb(220, 53, 69)" },
    };
    return colors[status] || { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" };
  };

  const formatStatus = (status: DeliveryNoteData["status"]) => {
    const labels: Record<DeliveryNoteData["status"], string> = {
      draft: "Borrador",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const statusColor = getStatusColor(albaran.status);

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
              Albarán {albaran.document_number}
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
                {formatStatus(albaran.status)}
              </span>
              <span
                style={{
                  padding: "var(--spacing-xs) var(--spacing-sm)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: albaran.type === "outbound" ? "rgba(67, 83, 255, 0.1)" : "rgba(0, 200, 117, 0.1)",
                  color: albaran.type === "outbound" ? "rgb(67, 83, 255)" : "rgb(0, 200, 117)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {albaran.type === "outbound" ? "Salida" : "Entrada"}
              </span>
              {albaran.project_name && (
                <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
                  {albaran.project_name}
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
              padding: "var(--spacing-sm)",
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
          {/* Información del albarán */}
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
                {new Date(albaran.date_issued).toLocaleDateString("es-ES")}
              </div>
            </div>
            {albaran.client_name && (
              <div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginBottom: "var(--spacing-xs)" }}>
                  Cliente
                </div>
                <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                  {albaran.client_name}
                </div>
              </div>
            )}
          </div>

          {/* Líneas */}
          {lines.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: "var(--font-size-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Productos
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-medium)" }}>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Producto</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Cantidad</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Descripción</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Nº Serie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr key={line.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                        <td style={{ padding: "var(--spacing-sm)" }}>
                          <div style={{ fontWeight: "var(--font-weight-medium)" }}>
                            {line.item_code} - {line.item_name}
                          </div>
                        </td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.quantity}</td>
                        <td style={{ padding: "var(--spacing-sm)" }}>{line.description}</td>
                        <td style={{ padding: "var(--spacing-sm)" }}>{line.serial_number || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Observaciones */}
          {albaran.notes && (
            <div style={{ marginTop: "var(--spacing-lg)" }}>
              <h4
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                Observaciones
              </h4>
              <div
                style={{
                  padding: "var(--spacing-sm)",
                  backgroundColor: "var(--background-secondary)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {albaran.notes}
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
            {albaran.status === "draft" && (
              <>
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
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    backgroundColor: isConfirming ? "var(--foreground-tertiary)" : "var(--accent-green-primary)",
                    color: "var(--background)",
                    cursor: isConfirming ? "not-allowed" : "pointer",
                    fontSize: "var(--font-size-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  <IconWrapper icon={CheckCircle} size={16} />
                  {isConfirming ? "Confirmando..." : "Confirmar"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--accent-red-primary)",
                    backgroundColor: "transparent",
                    color: "var(--accent-red-primary)",
                    cursor: isCancelling ? "not-allowed" : "pointer",
                    fontSize: "var(--font-size-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <IconWrapper icon={XCircle} size={16} />
                  {isCancelling ? "Cancelando..." : "Cancelar"}
                </button>
              </>
            )}
            {albaran.status === "confirmed" && albaran.type === "outbound" && onCreateReturn && (
              <button
                onClick={() => {
                  onCreateReturn(albaran.id);
                  onClose();
                }}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: "var(--accent-blue-primary)",
                  color: "var(--background)",
                  cursor: "pointer",
                  fontSize: "var(--font-size-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                <IconWrapper icon={ArrowLeft} size={16} />
                Crear Albarán de Retorno
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal de edición */}
      {isEditModalOpen && albaran && (
        <EditAlbaranModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          albaranId={albaran.id}
          onSave={async (updated) => {
            setAlbaran(updated);
            setIsEditModalOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}

