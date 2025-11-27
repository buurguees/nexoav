"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2, FileText, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchPresupuestoById, SalesDocumentData, updateSalesDocument, deleteSalesDocument } from "../../../../lib/mocks/salesDocumentsMocks";
import { fetchSalesDocumentLines, SalesDocumentLineData } from "../../../../lib/mocks/salesDocumentLinesMocks";
import { EditPresupuestoModal } from "./EditPresupuestoModal";
import { generatePresupuestoPDF } from "../../../../lib/pdf/generators/generatePresupuestoPDF";

interface PresupuestoDetailProps {
  presupuestoId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
  onConvertToProforma?: (presupuestoId: string) => void;
  onConvertToFactura?: (presupuestoId: string) => void;
}

export function PresupuestoDetail({
  presupuestoId,
  onClose,
  onUpdated,
  onDeleted,
  onConvertToProforma,
  onConvertToFactura,
}: PresupuestoDetailProps) {
  const [presupuesto, setPresupuesto] = useState<SalesDocumentData | null>(null);
  const [lines, setLines] = useState<SalesDocumentLineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doc = await fetchPresupuestoById(presupuestoId);
        if (doc) {
          setPresupuesto(doc);
          const documentLines = await fetchSalesDocumentLines(presupuestoId);
          setLines(documentLines);
        }
      } catch (error) {
        console.error("Error al cargar presupuesto:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [presupuestoId]);

  const handleStatusChange = async (newStatus: SalesDocumentData["status"]) => {
    if (!presupuesto) return;

    try {
      const updated = await updateSalesDocument(presupuesto.id, { status: newStatus });
      if (updated) {
        setPresupuesto(updated);
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = async () => {
    if (!presupuesto || !confirm("¿Está seguro de que desea eliminar este presupuesto?")) return;

    setIsDeleting(true);
    try {
      await deleteSalesDocument(presupuesto.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar presupuesto:", error);
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
          Cargando presupuesto...
        </div>
      </div>
    );
  }

  if (!presupuesto) {
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
          Presupuesto no encontrado
        </div>
      </div>
    );
  }

  const productosLines = lines.filter((line) => line.grouping_tag === "Productos");
  const serviciosLines = lines.filter((line) => line.grouping_tag === "Servicios");

  const getStatusColor = (status: SalesDocumentData["status"]) => {
    const colors: Record<SalesDocumentData["status"], { bg: string; text: string }> = {
      borrador: { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" },
      enviado: { bg: "rgba(67, 83, 255, 0.1)", text: "rgb(67, 83, 255)" },
      aceptado: { bg: "rgba(0, 200, 117, 0.1)", text: "rgb(0, 200, 117)" },
      cobrada: { bg: "rgba(0, 200, 117, 0.1)", text: "rgb(0, 200, 117)" },
      rechazado: { bg: "rgba(220, 53, 69, 0.1)", text: "rgb(220, 53, 69)" },
      vencida: { bg: "rgba(255, 165, 0, 0.1)", text: "rgb(255, 165, 0)" },
    };
    return colors[status] || { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" };
  };

  const formatStatus = (status: SalesDocumentData["status"]) => {
    const labels: Record<SalesDocumentData["status"], string> = {
      borrador: "Borrador",
      enviado: "Enviado",
      aceptado: "Aceptado",
      cobrada: "Cobrada",
      rechazado: "Rechazado",
      vencida: "Vencida",
    };
    return labels[status] || status;
  };

  const statusColor = getStatusColor(presupuesto.status);

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
              Presupuesto {presupuesto.document_number}
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
                {formatStatus(presupuesto.status)}
              </span>
              {presupuesto.client_name && (
                <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
                  {presupuesto.client_name}
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
          {/* Información del documento */}
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
                Fecha de Emisión
              </div>
              <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                {new Date(presupuesto.date_issued).toLocaleDateString("es-ES")}
              </div>
            </div>
            {presupuesto.date_due && (
              <div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginBottom: "var(--spacing-xs)" }}>
                  Fecha de Vencimiento
                </div>
                <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                  {new Date(presupuesto.date_due).toLocaleDateString("es-ES")}
                </div>
              </div>
            )}
            {presupuesto.project_name && (
              <div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginBottom: "var(--spacing-xs)" }}>
                  Proyecto
                </div>
                <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                  {presupuesto.project_name}
                </div>
              </div>
            )}
          </div>

          {/* Cliente */}
          {presupuesto.client_snapshot && (
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Cliente
              </h3>
              <div
                style={{
                  padding: "var(--spacing-md)",
                  backgroundColor: "var(--background-secondary)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ fontWeight: "var(--font-weight-medium)", marginBottom: "var(--spacing-xs)" }}>
                  {presupuesto.client_snapshot.commercial_name || presupuesto.client_snapshot.fiscal_name}
                </div>
                {presupuesto.client_snapshot.vat_number && (
                  <div style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                    CIF/NIF: {presupuesto.client_snapshot.vat_number}
                  </div>
                )}
                {presupuesto.client_snapshot.address && (
                  <div style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)", marginTop: "var(--spacing-xs)" }}>
                    {presupuesto.client_snapshot.address.street && `${presupuesto.client_snapshot.address.street}, `}
                    {presupuesto.client_snapshot.address.city && `${presupuesto.client_snapshot.address.city} `}
                    {presupuesto.client_snapshot.address.zip && presupuesto.client_snapshot.address.zip}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Líneas - Productos */}
          {productosLines.length > 0 && (
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
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
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Concepto</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Cantidad</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Precio</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>DTO %</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>IVA %</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosLines.map((line) => (
                      <tr key={line.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                        <td style={{ padding: "var(--spacing-sm)" }}>
                          <div style={{ fontWeight: "var(--font-weight-medium)" }}>{line.concept}</div>
                          {line.description && (
                            <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginTop: "var(--spacing-xs)" }}>
                              {line.description}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.quantity}</td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(line.unit_price)}
                        </td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.discount_percent}%</td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.tax_percent}%</td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right", fontWeight: "var(--font-weight-medium)" }}>
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(line.total_line)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Líneas - Servicios */}
          {serviciosLines.length > 0 && (
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Servicios
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-medium)" }}>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Concepto</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Cantidad</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Precio</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>DTO %</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>IVA %</th>
                      <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviciosLines.map((line) => (
                      <tr key={line.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                        <td style={{ padding: "var(--spacing-sm)" }}>
                          <div style={{ fontWeight: "var(--font-weight-medium)" }}>{line.concept}</div>
                          {line.description && (
                            <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginTop: "var(--spacing-xs)" }}>
                              {line.description}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.quantity}</td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(line.unit_price)}
                        </td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.discount_percent}%</td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>{line.tax_percent}%</td>
                        <td style={{ padding: "var(--spacing-sm)", textAlign: "right", fontWeight: "var(--font-weight-medium)" }}>
                          {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(line.total_line)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totales */}
          {presupuesto.totals_data && (
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <h3
                style={{
                  fontSize: "var(--font-size-md)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Resumen de Totales
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
                    }).format(presupuesto.totals_data.base_imponible || 0)}
                  </span>
                </div>
                {presupuesto.totals_data.vat_breakdown &&
                  Object.entries(presupuesto.totals_data.vat_breakdown)
                    .filter(([_, data]) => data.total > 0)
                    .map(([taxPercent, data]) => (
                      <div
                        key={taxPercent}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "var(--spacing-xs)",
                          paddingLeft: "var(--spacing-md)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        <span style={{ color: "var(--foreground-secondary)" }}>IVA {taxPercent}%:</span>
                        <span>
                          {new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                          }).format(data.vat)}
                        </span>
                      </div>
                    ))}
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
                    }).format(presupuesto.totals_data.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notas */}
          {(presupuesto.notes_public || presupuesto.notes_internal) && (
            <div>
              {presupuesto.notes_public && (
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <h4
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-xs)",
                    }}
                  >
                    Notas Públicas
                  </h4>
                  <div
                    style={{
                      padding: "var(--spacing-sm)",
                      backgroundColor: "var(--background-secondary)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    {presupuesto.notes_public}
                  </div>
                </div>
              )}
              {presupuesto.notes_internal && (
                <div>
                  <h4
                    style={{
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-xs)",
                    }}
                  >
                    Notas Internas
                  </h4>
                  <div
                    style={{
                      padding: "var(--spacing-sm)",
                      backgroundColor: "var(--background-secondary)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--foreground-secondary)",
                    }}
                  >
                    {presupuesto.notes_internal}
                  </div>
                </div>
              )}
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
            {presupuesto.status === "borrador" && (
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
                <button
                  onClick={() => handleStatusChange("enviado")}
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
                  Enviar
                </button>
              </>
            )}
            {presupuesto.status === "enviado" && (
              <>
                <button
                  onClick={() => handleStatusChange("aceptado")}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    backgroundColor: "var(--accent-green-primary)",
                    color: "var(--background)",
                    cursor: "pointer",
                    fontSize: "var(--font-size-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  <IconWrapper icon={CheckCircle} size={16} />
                  Marcar como Aceptado
                </button>
                <button
                  onClick={() => handleStatusChange("rechazado")}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--accent-red-primary)",
                    backgroundColor: "transparent",
                    color: "var(--accent-red-primary)",
                    cursor: "pointer",
                    fontSize: "var(--font-size-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <IconWrapper icon={XCircle} size={16} />
                  Rechazar
                </button>
              </>
            )}
            {presupuesto.status === "aceptado" && (
              <>
                {onConvertToProforma && (
                  <button
                    onClick={() => {
                      onConvertToProforma(presupuesto.id);
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
                    <IconWrapper icon={ArrowRight} size={16} />
                    Convertir a Proforma
                  </button>
                )}
                {onConvertToFactura && (
                  <button
                    onClick={() => {
                      onConvertToFactura(presupuesto.id);
                      onClose();
                    }}
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      backgroundColor: "var(--accent-green-primary)",
                      color: "var(--background)",
                      cursor: "pointer",
                      fontSize: "var(--font-size-sm)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-xs)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    <IconWrapper icon={ArrowRight} size={16} />
                    Convertir a Factura
                  </button>
                )}
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              onClick={async () => {
                try {
                  const lines = await fetchSalesDocumentLines(presupuesto.id);
                  await generatePresupuestoPDF(presupuesto, lines);
                } catch (error) {
                  console.error("Error al exportar PDF de presupuesto:", error);
                }
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
              Exportar PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal de edición */}
      {isEditModalOpen && presupuesto && (
        <EditPresupuestoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          presupuestoId={presupuesto.id}
          onSave={async (updated) => {
            setPresupuesto(updated);
            setIsEditModalOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}

