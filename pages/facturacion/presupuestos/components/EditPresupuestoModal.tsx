"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchActiveClients, ClientData } from "../../../../lib/mocks/clientMocks";
import { fetchProjectsByClient, ProjectData } from "../../../../lib/mocks/projectMocks";
import { fetchPresupuestoById, updateSalesDocument, SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import { fetchSalesDocumentLines, deleteSalesDocumentLines, createSalesDocumentLine, calculateDocumentTotals } from "../../../../lib/mocks/salesDocumentLinesMocks";
import { PresupuestoLinesEditor, PresupuestoLine } from "./PresupuestoLinesEditor";

interface EditPresupuestoModalProps {
  isOpen: boolean;
  onClose: () => void;
  presupuestoId: string;
  onSave: (presupuesto: SalesDocumentData) => Promise<void>;
}

const STEPS = [
  { id: 1, label: "Cliente" },
  { id: 2, label: "Proyecto" },
  { id: 3, label: "Líneas" },
  { id: 4, label: "Totales" },
];

export function EditPresupuestoModal({ isOpen, onClose, presupuestoId, onSave }: EditPresupuestoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [presupuesto, setPresupuesto] = useState<SalesDocumentData | null>(null);
  const [formData, setFormData] = useState({
    client_id: "",
    project_id: "",
    date_issued: "",
    date_due: "",
    notes_internal: "",
    notes_public: "",
  });
  const [lines, setLines] = useState<PresupuestoLine[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar presupuesto y datos relacionados
  useEffect(() => {
    if (isOpen && presupuestoId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Cargar presupuesto
          const doc = await fetchPresupuestoById(presupuestoId);
          if (!doc) {
            setErrors({ submit: "Presupuesto no encontrado" });
            return;
          }

          // Validar que solo se puede editar si está en borrador
          if (doc.status !== "borrador") {
            setErrors({ submit: "Solo se pueden editar presupuestos en estado 'borrador'" });
            return;
          }

          setPresupuesto(doc);
          setFormData({
            client_id: doc.client_id,
            project_id: doc.project_id || "",
            date_issued: doc.date_issued,
            date_due: doc.date_due || "",
            notes_internal: doc.notes_internal || "",
            notes_public: doc.notes_public || "",
          });

          // Cargar líneas
          const documentLines = await fetchSalesDocumentLines(presupuestoId);
          setLines(
            documentLines.map((line) => ({
              id: line.id,
              item_id: line.item_id || undefined,
              concept: line.concept,
              description: line.description,
              quantity: line.quantity,
              unit_price: line.unit_price,
              discount_percent: line.discount_percent,
              tax_percent: line.tax_percent,
              grouping_tag: line.grouping_tag,
              unit: undefined,
              subtotal: line.subtotal,
              total_line: line.total_line,
            }))
          );

          // Cargar clientes
          setIsLoadingClients(true);
          const activeClients = await fetchActiveClients();
          setClients(activeClients);
          setIsLoadingClients(false);

          // Cargar proyectos del cliente
          if (doc.client_id) {
            setIsLoadingProjects(true);
            const clientProjects = await fetchProjectsByClient(doc.client_id);
            setProjects(clientProjects);
            setIsLoadingProjects(false);
          }
        } catch (error) {
          console.error("Error al cargar presupuesto:", error);
          setErrors({ submit: "Error al cargar el presupuesto" });
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, presupuestoId]);

  // Cargar proyectos cuando cambia el cliente
  useEffect(() => {
    if (formData.client_id) {
      const loadProjects = async () => {
        setIsLoadingProjects(true);
        try {
          const clientProjects = await fetchProjectsByClient(formData.client_id);
          setProjects(clientProjects);
        } catch (error) {
          console.error("Error al cargar proyectos:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      };
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [formData.client_id]);

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setPresupuesto(null);
      setFormData({
        client_id: "",
        project_id: "",
        date_issued: "",
        date_due: "",
        notes_internal: "",
        notes_public: "",
      });
      setLines([]);
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.client_id) {
        newErrors.client_id = "Debe seleccionar un cliente";
      }
    }

    if (step === 3) {
      if (lines.length === 0) {
        newErrors.lines = "Debe añadir al menos una línea";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!presupuesto || !validateStep(4)) return;

    setIsSubmitting(true);
    try {
      // Calcular totales
      const totals = calculateDocumentTotals(
        lines.map((line) => ({
          id: line.id || "",
          document_id: presupuesto.id,
          item_id: line.item_id || null,
          concept: line.concept,
          description: line.description,
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount_percent: line.discount_percent,
          subtotal: line.subtotal,
          tax_percent: line.tax_percent,
          total_line: line.total_line,
          grouping_tag: line.grouping_tag,
          line_order: 0,
          created_at: new Date().toISOString(),
        }))
      );

      // Actualizar documento
      const updatedDoc = await updateSalesDocument(presupuesto.id, {
        client_id: formData.client_id,
        project_id: formData.project_id || null,
        date_issued: formData.date_issued,
        date_due: formData.date_due || null,
        notes_internal: formData.notes_internal || undefined,
        notes_public: formData.notes_public || undefined,
        totals_data: {
          base_imponible: totals.base_imponible,
          total_vat: totals.total_vat,
          total: totals.total,
          vat_breakdown: totals.vat_breakdown,
          total_discount: totals.total_discount,
        },
      });

      if (!updatedDoc) {
        throw new Error("Error al actualizar el documento");
      }

      // Eliminar líneas existentes y crear nuevas
      await deleteSalesDocumentLines(presupuesto.id);
      for (let i = 0; i < lines.length; i++) {
        await createSalesDocumentLine({
          document_id: presupuesto.id,
          item_id: lines[i].item_id || null,
          concept: lines[i].concept,
          description: lines[i].description,
          quantity: lines[i].quantity,
          unit_price: lines[i].unit_price,
          discount_percent: lines[i].discount_percent,
          tax_percent: lines[i].tax_percent,
          grouping_tag: lines[i].grouping_tag,
          line_order: i + 1,
        });
      }

      await onSave(updatedDoc);
      onClose();
    } catch (error) {
      console.error("Error al actualizar presupuesto:", error);
      setErrors({ submit: "Error al actualizar el presupuesto. Por favor, inténtalo de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "var(--spacing-xl)",
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-lg)",
                zIndex: 1001,
              }}
            >
              Cargando presupuesto...
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (errors.submit && !presupuesto) {
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "var(--spacing-xl)",
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-lg)",
                zIndex: 1001,
                maxWidth: "500px",
              }}
            >
              <div style={{ color: "var(--accent-red-primary)", marginBottom: "var(--spacing-md)" }}>
                {errors.submit}
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: "var(--accent-blue-primary)",
                  color: "var(--background)",
                  cursor: "pointer",
                }}
              >
                Cerrar
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Reutilizar la misma estructura que NewPresupuestoModal pero con datos precargados
  return (
    <AnimatePresence>
      {isOpen && presupuesto && (
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
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "1000px",
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
              <h2
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                Editar Presupuesto {presupuesto.document_number}
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

            {/* Steps indicator - Mismo que NewPresupuestoModal */}
            <div
              style={{
                padding: "var(--spacing-md) var(--spacing-lg)",
                borderBottom: "1px solid var(--border-medium)",
                display: "flex",
                gap: "var(--spacing-sm)",
              }}
            >
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        currentStep >= step.id
                          ? "var(--accent-blue-primary)"
                          : "var(--background-secondary)",
                      color:
                        currentStep >= step.id
                          ? "var(--background)"
                          : "var(--foreground-tertiary)",
                      fontWeight: "var(--font-weight-semibold)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    {step.id}
                  </div>
                  <span
                    style={{
                      fontSize: "var(--font-size-sm)",
                      color:
                        currentStep >= step.id
                          ? "var(--foreground)"
                          : "var(--foreground-tertiary)",
                      fontWeight:
                        currentStep === step.id
                          ? "var(--font-weight-semibold)"
                          : "var(--font-weight-normal)",
                    }}
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: "2px",
                        backgroundColor:
                          currentStep > step.id
                            ? "var(--accent-blue-primary)"
                            : "var(--border-medium)",
                        marginLeft: "var(--spacing-xs)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Content - Reutilizar estructura de NewPresupuestoModal */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "var(--spacing-lg)", flex: 1 }}>
                {/* Step 1: Cliente */}
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
                      Seleccionar Cliente
                    </h3>
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                        }}
                      >
                        Cliente <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <select
                        value={formData.client_id}
                        onChange={(e) => handleChange("client_id", e.target.value)}
                        disabled={isLoadingClients}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.client_id
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        <option value="">
                          {isLoadingClients ? "Cargando clientes..." : "Seleccione un cliente"}
                        </option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.commercial_name || client.fiscal_name}
                          </option>
                        ))}
                      </select>
                      {errors.client_id && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "var(--spacing-xs)",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                          }}
                        >
                          {errors.client_id}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Proyecto */}
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
                      Seleccionar Proyecto (Opcional)
                    </h3>
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                        }}
                      >
                        Proyecto
                      </label>
                      <select
                        value={formData.project_id}
                        onChange={(e) => handleChange("project_id", e.target.value)}
                        disabled={isLoadingProjects || !formData.client_id}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        <option value="">
                          {isLoadingProjects
                            ? "Cargando proyectos..."
                            : !formData.client_id
                            ? "Primero seleccione un cliente"
                            : "Ningún proyecto (opcional)"}
                        </option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-md)" }}>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground)",
                          }}
                        >
                          Fecha de Emisión
                        </label>
                        <input
                          type="date"
                          value={formData.date_issued}
                          onChange={(e) => handleChange("date_issued", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-medium)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                            fontSize: "var(--font-size-sm)",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "var(--spacing-xs)",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground)",
                          }}
                        >
                          Fecha de Vencimiento (Opcional)
                        </label>
                        <input
                          type="date"
                          value={formData.date_due}
                          onChange={(e) => handleChange("date_due", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-medium)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                            fontSize: "var(--font-size-sm)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Líneas */}
                {currentStep === 3 && (
                  <div>
                    <PresupuestoLinesEditor
                      lines={lines}
                      onChange={setLines}
                      defaultTaxPercent={21}
                    />
                    {errors.lines && (
                      <span
                        style={{
                          display: "block",
                          marginTop: "var(--spacing-sm)",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--accent-red-primary)",
                        }}
                      >
                        {errors.lines}
                      </span>
                    )}
                  </div>
                )}

                {/* Step 4: Totales */}
                {currentStep === 4 && (
                  <div>
                    <h3
                      style={{
                        fontSize: "var(--font-size-lg)",
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-md)",
                      }}
                    >
                      Resumen y Notas
                    </h3>
                    {(() => {
                      const totals = calculateDocumentTotals(
                        lines.map((line) => ({
                          id: line.id || "",
                          document_id: presupuesto.id,
                          item_id: line.item_id || null,
                          concept: line.concept,
                          description: line.description,
                          quantity: line.quantity,
                          unit_price: line.unit_price,
                          discount_percent: line.discount_percent,
                          subtotal: line.subtotal,
                          tax_percent: line.tax_percent,
                          total_line: line.total_line,
                          grouping_tag: line.grouping_tag,
                          line_order: 0,
                          created_at: new Date().toISOString(),
                        }))
                      );
                      return (
                        <div style={{ marginBottom: "var(--spacing-lg)" }}>
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
                                }).format(totals.base_imponible)}
                              </span>
                            </div>
                            {Object.entries(totals.vat_breakdown)
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
                                  <span style={{ color: "var(--foreground-secondary)" }}>
                                    IVA {taxPercent}%:
                                  </span>
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
                                }).format(totals.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    <div style={{ marginBottom: "var(--spacing-md)" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                        }}
                      >
                        Notas Públicas (Visibles en PDF)
                      </label>
                      <textarea
                        value={formData.notes_public}
                        onChange={(e) => handleChange("notes_public", e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          resize: "vertical",
                        }}
                        placeholder="Observaciones que aparecerán en el PDF del presupuesto"
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                        }}
                      >
                        Notas Internas (Solo para uso interno)
                      </label>
                      <textarea
                        value={formData.notes_internal}
                        onChange={(e) => handleChange("notes_internal", e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          resize: "vertical",
                        }}
                        placeholder="Notas internas que no aparecerán en el PDF"
                      />
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--accent-red-light)",
                      color: "var(--accent-red-primary)",
                      fontSize: "var(--font-size-sm)",
                      marginTop: "var(--spacing-md)",
                    }}
                  >
                    {errors.submit}
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
                  gap: "var(--spacing-md)",
                }}
              >
                <button
                  type="button"
                  onClick={currentStep === 1 ? onClose : handlePrevious}
                  disabled={isSubmitting}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "var(--font-size-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                  }}
                >
                  <IconWrapper icon={ChevronLeft} size={16} />
                  {currentStep === 1 ? "Cancelar" : "Anterior"}
                </button>
                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-lg)",
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
                    Siguiente
                    <IconWrapper icon={ChevronRight} size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "var(--spacing-sm) var(--spacing-lg)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      backgroundColor: isSubmitting
                        ? "var(--foreground-tertiary)"
                        : "var(--accent-blue-primary)",
                      color: "var(--background)",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

