"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchFacturas, fetchFacturaById, SalesDocumentData, convertFacturaToRectificativa } from "../../../../lib/mocks/salesDocumentsMocks";
import { fetchSalesDocumentLines, createSalesDocumentLine, calculateDocumentTotals } from "../../../../lib/mocks/salesDocumentLinesMocks";
import { PresupuestoLinesEditor, PresupuestoLine } from "../../presupuestos/components/PresupuestoLinesEditor";

interface NewRectificativaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rectificativa: SalesDocumentData) => Promise<void>;
}

const STEPS = [
  { id: 1, label: "Factura" },
  { id: 2, label: "Líneas" },
  { id: 3, label: "Totales" },
];

export function NewRectificativaModal({ isOpen, onClose, onSave }: NewRectificativaModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [facturaId, setFacturaId] = useState("");
  const [factura, setFactura] = useState<SalesDocumentData | null>(null);
  const [rectificativa, setRectificativa] = useState<SalesDocumentData | null>(null);
  const [lines, setLines] = useState<PresupuestoLine[]>([]);
  const [facturas, setFacturas] = useState<SalesDocumentData[]>([]);
  const [isLoadingFacturas, setIsLoadingFacturas] = useState(false);
  const [isLoadingFactura, setIsLoadingFactura] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar facturas al abrir
  useEffect(() => {
    if (isOpen) {
      const loadFacturas = async () => {
        setIsLoadingFacturas(true);
        try {
          const allFacturas = await fetchFacturas();
          // Solo facturas que no sean rectificativas y que estén en estado válido
          setFacturas(allFacturas.filter(f => f.type === "factura" && f.status !== "rechazado"));
        } catch (error) {
          console.error("Error al cargar facturas:", error);
        } finally {
          setIsLoadingFacturas(false);
        }
      };
      loadFacturas();
    }
  }, [isOpen]);

  // Cargar factura seleccionada y crear rectificativa base
  useEffect(() => {
    if (facturaId) {
      const loadFactura = async () => {
        setIsLoadingFactura(true);
        try {
          const fact = await fetchFacturaById(facturaId);
          if (!fact) {
            setErrors({ factura: "Factura no encontrada" });
            return;
          }

          if (fact.type !== "factura") {
            setErrors({ factura: "Solo se pueden crear rectificativas desde facturas" });
            return;
          }

          setFactura(fact);
          
          // Crear rectificativa base desde la factura
          const rect = await convertFacturaToRectificativa(facturaId);
          setRectificativa(rect);

          // Cargar líneas de la factura original (opcional, para referencia)
          const facturaLines = await fetchSalesDocumentLines(facturaId);
          // No copiar líneas automáticamente, el usuario las añadirá manualmente
        } catch (error) {
          console.error("Error al cargar factura:", error);
          setErrors({ factura: "Error al cargar la factura" });
        } finally {
          setIsLoadingFactura(false);
        }
      };
      loadFactura();
    }
  }, [facturaId]);

  // Resetear formulario al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFacturaId("");
      setFactura(null);
      setRectificativa(null);
      setLines([]);
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!facturaId) {
        setErrors({ factura: "Debe seleccionar una factura" });
        return;
      }
      if (!factura) {
        setErrors({ factura: "Debe cargar la factura primero" });
        return;
      }
    }
    if (currentStep === 2) {
      if (lines.length === 0) {
        setErrors({ lines: "Debe añadir al menos una línea" });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!rectificativa) {
      setErrors({ submit: "Error: No se ha creado la rectificativa base" });
      return;
    }

    if (lines.length === 0) {
      setErrors({ lines: "Debe añadir al menos una línea" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear todas las líneas
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        await createSalesDocumentLine({
          document_id: rectificativa.id,
          item_id: line.item_id || null,
          concept: line.concept,
          description: line.description || null,
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percent: line.discount_percent,
          tax_percent: line.tax_percent,
          grouping_tag: line.grouping_tag,
          line_order: i + 1,
        });
      }

      // Calcular y actualizar totales
      const totals = await calculateDocumentTotals(rectificativa.id);
      const updatedRectificativa = {
        ...rectificativa,
        totals_data: totals,
      };

      await onSave(updatedRectificativa);
      onClose();
    } catch (error) {
      console.error("Error al crear rectificativa:", error);
      setErrors({ submit: "Error al crear la rectificativa. Por favor, inténtalo de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
              left: "50%",
              transform: "translateX(-50%)",
              top: "var(--spacing-lg)",
              bottom: "var(--spacing-lg)",
              width: "min(1000px, 100% - 2 * var(--spacing-lg))",
              maxHeight: "calc(100vh - 2 * var(--spacing-lg))",
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
              <h2
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                Nueva Rectificativa
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

            {/* Steps indicator */}
            <div
              style={{
                padding: "var(--spacing-md) var(--spacing-lg)",
                borderBottom: "1px solid var(--border-medium)",
                display: "flex",
                gap: "var(--spacing-sm)",
              }}
            >
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  style={{
                    flex: 1,
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor:
                      currentStep === step.id
                        ? "var(--primary)"
                        : currentStep > step.id
                        ? "var(--primary-light)"
                        : "var(--background-secondary)",
                    color:
                      currentStep === step.id || currentStep > step.id
                        ? "white"
                        : "var(--foreground-secondary)",
                    textAlign: "center",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  {step.id}. {step.label}
                </div>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: "auto", padding: "var(--spacing-lg)" }}>
              {currentStep === 1 && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Seleccionar Factura a Rectificar
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--foreground-secondary)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Las rectificativas solo pueden crearse desde facturas. Seleccione la factura que desea rectificar.
                  </p>

                  {isLoadingFacturas ? (
                    <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
                      Cargando facturas...
                    </div>
                  ) : (
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        Factura <span style={{ color: "var(--error)" }}>*</span>
                      </label>
                      <select
                        value={facturaId}
                        onChange={(e) => {
                          setFacturaId(e.target.value);
                          setErrors({});
                        }}
                        disabled={isLoadingFactura}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          fontSize: "var(--font-size-base)",
                          border: `1px solid ${errors.factura ? "var(--error)" : "var(--border-medium)"}`,
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                      >
                        <option value="">Seleccionar factura...</option>
                        {facturas.map((fact) => (
                          <option key={fact.id} value={fact.id}>
                            {fact.document_number} - {fact.client_name || "Sin cliente"} - {formatCurrency(fact.totals_data?.total || 0)}
                          </option>
                        ))}
                      </select>
                      {errors.factura && (
                        <span style={{ color: "var(--error)", fontSize: "var(--font-size-xs)", marginTop: "var(--spacing-xs)", display: "block" }}>
                          {errors.factura}
                        </span>
                      )}

                      {isLoadingFactura && (
                        <div style={{ marginTop: "var(--spacing-md)", color: "var(--foreground-secondary)" }}>
                          Cargando factura...
                        </div>
                      )}

                      {factura && rectificativa && (
                        <div
                          style={{
                            marginTop: "var(--spacing-lg)",
                            padding: "var(--spacing-md)",
                            backgroundColor: "var(--background-secondary)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-medium)",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: "var(--font-size-base)",
                              fontWeight: "var(--font-weight-semibold)",
                              color: "var(--foreground)",
                              marginBottom: "var(--spacing-sm)",
                            }}
                          >
                            Factura Seleccionada
                          </h4>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-sm)" }}>
                            <div>
                              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                                Número:
                              </span>
                              <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                                {factura.document_number}
                              </p>
                            </div>
                            <div>
                              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                                Cliente:
                              </span>
                              <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                                {factura.client_name || "Sin cliente"}
                              </p>
                            </div>
                            <div>
                              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                                Fecha:
                              </span>
                              <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                                {factura.date_issued}
                              </p>
                            </div>
                            <div>
                              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                                Total:
                              </span>
                              <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                                {formatCurrency(factura.totals_data?.total || 0)}
                              </p>
                            </div>
                          </div>
                          <div style={{ marginTop: "var(--spacing-sm)" }}>
                            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                              Rectificativa:
                            </span>
                            <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--primary)" }}>
                              {rectificativa.document_number}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Líneas de Rectificación
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color: "var(--foreground-secondary)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Añada las líneas de rectificación. Puede usar cantidades negativas para anular conceptos de la factura original.
                  </p>

                  {errors.lines && (
                    <div
                      style={{
                        padding: "var(--spacing-md)",
                        backgroundColor: "var(--error-background)",
                        color: "var(--error)",
                        borderRadius: "var(--radius-md)",
                        marginBottom: "var(--spacing-md)",
                      }}
                    >
                      {errors.lines}
                    </div>
                  )}

                  <PresupuestoLinesEditor
                    lines={lines}
                    onChange={setLines}
                    defaultTaxPercent={21}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Resumen y Totales
                  </h3>

                  {rectificativa && (
                    <div
                      style={{
                        marginBottom: "var(--spacing-lg)",
                        padding: "var(--spacing-md)",
                        backgroundColor: "var(--background-secondary)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                      }}
                    >
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                        <div>
                          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                            Número de Rectificativa:
                          </span>
                          <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--foreground)" }}>
                            {rectificativa.document_number}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                            Rectifica Factura:
                          </span>
                          <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                            {factura?.document_number || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--background-secondary)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "var(--font-size-base)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-md)",
                      }}
                    >
                      Totales Calculados
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                      {lines.length > 0 ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--foreground-secondary)" }}>Número de líneas:</span>
                            <span style={{ fontWeight: "var(--font-weight-medium)" }}>{lines.length}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--foreground-secondary)" }}>Base Imponible:</span>
                            <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                              {formatCurrency(lines.reduce((sum, line) => sum + line.subtotal, 0))}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--foreground-secondary)" }}>Total IVA:</span>
                            <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                              {formatCurrency(lines.reduce((sum, line) => sum + (line.total_line - line.subtotal), 0))}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              paddingTop: "var(--spacing-sm)",
                              borderTop: "1px solid var(--border-medium)",
                              fontSize: "var(--font-size-lg)",
                              fontWeight: "var(--font-weight-semibold)",
                            }}
                          >
                            <span>Total:</span>
                            <span
                              style={{
                                color:
                                  lines.reduce((sum, line) => sum + line.total_line, 0) < 0
                                    ? "var(--error)"
                                    : "var(--foreground)",
                              }}
                            >
                              {formatCurrency(lines.reduce((sum, line) => sum + line.total_line, 0))}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p style={{ color: "var(--foreground-secondary)", textAlign: "center" }}>
                          No hay líneas añadidas
                        </p>
                      )}
                    </div>
                  </div>

                  {errors.submit && (
                    <div
                      style={{
                        marginTop: "var(--spacing-md)",
                        padding: "var(--spacing-md)",
                        backgroundColor: "var(--error-background)",
                        color: "var(--error)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      {errors.submit}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "var(--spacing-lg)",
                borderTop: "1px solid var(--border-medium)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  backgroundColor: currentStep === 1 ? "var(--background-secondary)" : "var(--background)",
                  color: currentStep === 1 ? "var(--foreground-tertiary)" : "var(--foreground)",
                  cursor: currentStep === 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-xs)",
                  fontSize: "var(--font-size-base)",
                }}
              >
                <IconWrapper icon={ChevronLeft} size={16} />
                Atrás
              </button>

              {currentStep < STEPS.length ? (
                <button
                  onClick={handleNext}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Siguiente
                  <IconWrapper icon={ChevronRight} size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    backgroundColor: isSubmitting ? "var(--foreground-tertiary)" : "var(--primary)",
                    color: "white",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  {isSubmitting ? "Guardando..." : "Crear Rectificativa"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Función auxiliar para formatear moneda
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

