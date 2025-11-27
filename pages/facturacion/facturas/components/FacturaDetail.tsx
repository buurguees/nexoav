"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2, FileText, CheckCircle } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  fetchFacturaById,
  SalesDocumentData,
  updateSalesDocument,
  deleteSalesDocument,
} from "../../../../lib/mocks/salesDocumentsMocks";
import {
  fetchSalesDocumentLines,
  SalesDocumentLineData,
  createSalesDocumentLine,
} from "../../../../lib/mocks/salesDocumentLinesMocks";
import { EditFacturaModal } from "./EditFacturaModal";
import { convertFacturaToRectificativa } from "../../../../lib/mocks/salesDocumentsMocks";
import { generateFacturaPDF } from "../../../../lib/pdf/generators/generateFacturaPDF";

interface FacturaDetailProps {
  facturaId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
  onCreateRectificativa?: (facturaId: string) => void;
}

export function FacturaDetail({
  facturaId,
  onClose,
  onUpdated,
  onDeleted,
  onCreateRectificativa,
}: FacturaDetailProps) {
  const [factura, setFactura] = useState<SalesDocumentData | null>(null);
  const [lines, setLines] = useState<SalesDocumentLineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doc = await fetchFacturaById(facturaId);
        if (doc) {
          setFactura(doc);
          const documentLines = await fetchSalesDocumentLines(facturaId);
          setLines(documentLines);
        }
      } catch (error) {
        console.error("Error al cargar factura:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [facturaId]);

  const handleStatusChange = async (newStatus: SalesDocumentData["status"]) => {
    if (!factura) return;
    try {
      const updated = await updateSalesDocument(factura.id, { status: newStatus });
      if (updated) {
        setFactura(updated);
        if (onUpdated) onUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleDelete = async () => {
    if (!factura || !confirm("¿Está seguro de que desea eliminar esta factura?")) return;
    setIsDeleting(true);
    try {
      await deleteSalesDocument(factura.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar factura:", error);
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
          Cargando factura...
        </div>
      </div>
    );
  }

  if (!factura) {
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
          Factura no encontrada
        </div>
      </div>
    );
  }

  const isCobrada = factura.status === "cobrada";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);

  const productos = lines.filter((l) => l.grouping_tag === "Productos");
  const servicios = lines.filter((l) => l.grouping_tag === "Servicios");

  const totals = factura.totals_data || {};

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
                Factura
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: "var(--background-secondary)",
                  fontSize: "var(--font-size-xs)",
                  color: "var(--foreground-secondary)",
                }}
              >
                {factura.document_number}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: isCobrada ? "rgba(0,200,117,0.15)" : "rgba(255,165,0,0.15)",
                  color: isCobrada ? "var(--accent-green-primary)" : "var(--accent-orange-primary)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                {isCobrada ? "Cobrada" : "Pendiente de cobro"}
              </span>
              {factura.client_name && (
                <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                  {factura.client_name}
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

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--spacing-lg)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: "var(--spacing-lg)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
            {[{ title: "Productos", data: productos }, { title: "Servicios", data: servicios }].map(
              (group) =>
                group.data.length > 0 && (
                  <div key={group.title}>
                    <h3
                      style={{
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--foreground-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      {group.title}
                    </h3>
                    <div
                      style={{
                        border: "1px solid var(--border-medium)",
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                      }}
                    >
                      {group.data.map((line) => (
                        <div
                          key={line.id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderBottom: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--background)",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span
                              style={{
                                fontSize: "var(--font-size-sm)",
                                fontWeight: "var(--font-weight-medium)",
                                color: "var(--foreground)",
                              }}
                            >
                              {line.concept}
                            </span>
                            {line.description && (
                              <span
                                style={{
                                  fontSize: "var(--font-size-xs)",
                                  color: "var(--foreground-secondary)",
                                }}
                              >
                                {line.description}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              alignItems: "flex-end",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "var(--font-size-xs)",
                                color: "var(--foreground-tertiary)",
                              }}
                            >
                              {line.quantity} x {formatCurrency(line.unit_price)}
                              {line.discount_percent
                                ? ` (-${line.discount_percent.toFixed(0)}% desc.)`
                                : ""}
                            </span>
                            <span
                              style={{
                                fontSize: "var(--font-size-sm)",
                                fontWeight: "var(--font-weight-semibold)",
                                color: "var(--foreground)",
                              }}
                            >
                              {formatCurrency(line.total_line)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-lg)",
            }}
          >
            <div
              style={{
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-md)",
                backgroundColor: "var(--background-secondary)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                Resumen económico
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
                  Base imponible
                </span>
                <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                  {formatCurrency((totals as any).base_imponible ?? (totals as any).base ?? 0)}
                </span>
              </div>
              {totals.vat_breakdown &&
                Object.entries(totals.vat_breakdown)
                  .filter(([, data]) => data.total > 0)
                  .map(([taxPercent, data]) => (
                    <div
                      key={taxPercent}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "var(--spacing-xs)",
                        paddingLeft: "var(--spacing-md)",
                        fontSize: "var(--font-size-xs)",
                      }}
                    >
                      <span style={{ color: "var(--foreground-secondary)" }}>IVA {taxPercent}%</span>
                      <span>{formatCurrency(data.vat)}</span>
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
                <span>Total</span>
                <span>{formatCurrency((totals as any).total ?? 0)}</span>
              </div>
            </div>

            {factura.notes_public && (
              <div>
                <h4
                  style={{
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Notas públicas
                </h4>
                <div
                  style={{
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--background-secondary)",
                    fontSize: "var(--font-size-sm)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {factura.notes_public}
                </div>
              </div>
            )}

            {factura.notes_internal && (
              <div>
                <h4
                  style={{
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  Notas internas
                </h4>
                <div
                  style={{
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--background-secondary)",
                    fontSize: "var(--font-size-sm)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {factura.notes_internal}
                </div>
              </div>
            )}
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
            {!isCobrada && (
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
            )}
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
            {!isCobrada && (
              <button
                onClick={() => handleStatusChange("cobrada")}
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
                }}
              >
                <IconWrapper icon={CheckCircle} size={16} />
                Marcar como Cobrada
              </button>
            )}
            {isCobrada && (
              <button
                onClick={async () => {
                  try {
                    const facturaLines = await fetchSalesDocumentLines(factura.id);
                    const rect = await convertFacturaToRectificativa(factura.id);

                    for (let i = 0; i < facturaLines.length; i++) {
                      const line = facturaLines[i];
                      await createSalesDocumentLine({
                        document_id: rect.id,
                        item_id: line.item_id || null,
                        concept: line.concept,
                        description: line.description,
                        quantity: -line.quantity,
                        unit_price: line.unit_price,
                        discount_percent: line.discount_percent,
                        tax_percent: line.tax_percent,
                        grouping_tag: line.grouping_tag,
                        line_order: i + 1,
                      });
                    }

                    if (onCreateRectificativa) onCreateRectificativa(rect.id);
                  } catch (error) {
                    console.error("Error al crear rectificativa:", error);
                  }
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
                Crear Rectificativa
              </button>
            )}
          </div>
          <button
            onClick={async () => {
              try {
                const lines = await fetchSalesDocumentLines(factura.id);
                await generateFacturaPDF(factura, lines);
              } catch (error) {
                console.error("Error al exportar PDF de factura:", error);
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
      </motion.div>

      {isEditModalOpen && factura && (
        <EditFacturaModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          facturaId={factura.id}
          onSave={async (updated) => {
            setFactura(updated);
            setIsEditModalOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}


