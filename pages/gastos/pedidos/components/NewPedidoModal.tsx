"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchProjectsByClient, ProjectData } from "../../../../lib/mocks/projectMocks";
import { fetchSuppliers, SupplierData } from "../../../../lib/mocks/supplierMocks";
import { fetchActiveClients, ClientData } from "../../../../lib/mocks/clientMocks";
import { createPurchaseOrder, PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";

interface NewPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pedido: PurchaseOrderData) => Promise<void>;
  defaultProjectId?: string;
}

const STEPS = [
  { id: 1, label: "Cliente / Proyecto" },
  { id: 2, label: "Proveedor / Detalle" },
  { id: 3, label: "Importe" },
];

export function NewPedidoModal({ isOpen, onClose, onSave, defaultProjectId }: NewPedidoModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client_id: "",
    project_id: defaultProjectId || "",
    supplier_id: "",
    description: "",
    estimated_amount: 0,
  });
  const [clients, setClients] = useState<ClientData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const load = async () => {
        setIsLoadingClients(true);
        setIsLoadingSuppliers(true);
        try {
          const [clientsData, suppliersData] = await Promise.all([
            fetchActiveClients(),
            fetchSuppliers(),
          ]);
          setClients(clientsData);
          setSuppliers(suppliersData);
        } catch (e) {
          console.error("Error cargando datos de pedidos:", e);
        } finally {
          setIsLoadingClients(false);
          setIsLoadingSuppliers(false);
        }
      };
      load();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.client_id) {
      const loadProjects = async () => {
        setIsLoadingProjects(true);
        try {
          const p = await fetchProjectsByClient(formData.client_id);
          setProjects(p);
        } catch (e) {
          console.error("Error cargando proyectos:", e);
        } finally {
          setIsLoadingProjects(false);
        }
      };
      loadProjects();
    } else if (!defaultProjectId) {
      setProjects([]);
    }
  }, [formData.client_id, defaultProjectId]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        client_id: "",
        project_id: defaultProjectId || "",
        supplier_id: "",
        description: "",
        estimated_amount: 0,
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [isOpen, defaultProjectId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.project_id) {
        nextErrors.project_id = "Debe seleccionar un proyecto";
      }
    }
    if (step === 3) {
      if (!formData.description.trim()) {
        nextErrors.description = "Debe indicar una descripción";
      }
      if (!formData.estimated_amount || formData.estimated_amount <= 0) {
        nextErrors.estimated_amount = "El importe previsto debe ser mayor que 0";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    try {
      const pedido = await createPurchaseOrder({
        project_id: formData.project_id,
        supplier_id: formData.supplier_id || null,
        description: formData.description,
        estimated_amount: formData.estimated_amount,
        status: "pending",
      });
      await onSave(pedido);
      onClose();
    } catch (e) {
      console.error("Error al crear pedido:", e);
      setErrors({ submit: "Error al crear el pedido. Inténtelo de nuevo." });
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
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
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
              maxWidth: "720px",
              maxHeight: "90vh",
              backgroundColor: "var(--background)",
              borderRadius: "var(--radius-lg)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
              }}
            >
              <h2
                style={{
                  fontSize: "var(--font-size-xl)",
                  fontWeight: "var(--font-weight-semibold)",
                  margin: 0,
                }}
              >
                Nuevo Pedido de Compra
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
                      width: 28,
                      height: 28,
                      borderRadius: "999px",
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
                      fontSize: "var(--font-size-xs)",
                      fontWeight: "var(--font-weight-semibold)",
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
                    }}
                  >
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        marginLeft: "var(--spacing-xs)",
                        backgroundColor:
                          currentStep > step.id
                            ? "var(--accent-blue-primary)"
                            : "var(--border-medium)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}
            >
              <div style={{ padding: "var(--spacing-lg)", flex: 1 }}>
                {currentStep === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                        }}
                      >
                        Cliente (solo para filtrar proyectos)
                      </label>
                      <select
                        value={formData.client_id}
                        onChange={(e) => handleChange("client_id", e.target.value)}
                        disabled={isLoadingClients}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                        }}
                      >
                        <option value="">
                          {isLoadingClients ? "Cargando clientes..." : "Sin cliente (ver todos)"}
                        </option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.commercial_name || c.fiscal_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                        }}
                      >
                        Proyecto <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <select
                        value={formData.project_id}
                        onChange={(e) => handleChange("project_id", e.target.value)}
                        disabled={isLoadingProjects && !defaultProjectId}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.project_id
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                        }}
                      >
                        <option value="">
                          {isLoadingProjects
                            ? "Cargando proyectos..."
                            : defaultProjectId
                            ? "Proyecto preseleccionado"
                            : "Seleccione un proyecto"}
                        </option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {errors.project_id && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "var(--spacing-xs)",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                          }}
                        >
                          {errors.project_id}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                        }}
                      >
                        Proveedor (opcional)
                      </label>
                      <select
                        value={formData.supplier_id}
                        onChange={(e) => handleChange("supplier_id", e.target.value)}
                        disabled={isLoadingSuppliers}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                        }}
                      >
                        <option value="">
                          {isLoadingSuppliers ? "Cargando proveedores..." : "Sin proveedor asignado"}
                        </option>
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.commercial_name || s.fiscal_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                        }}
                      >
                        Descripción del pedido{" "}
                        <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.description
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          resize: "vertical",
                        }}
                        placeholder="Ej: Servicio técnico sonido para evento X"
                      />
                      {errors.description && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "var(--spacing-xs)",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                          }}
                        >
                          {errors.description}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div style={{ maxWidth: 420 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--spacing-xs)",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Importe previsto (EUR){" "}
                      <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.estimated_amount || ""}
                      onChange={(e) =>
                        handleChange("estimated_amount", parseFloat(e.target.value) || 0)
                      }
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: errors.estimated_amount
                          ? "1px solid var(--accent-red-primary)"
                          : "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                      }}
                      min={0}
                      step={0.01}
                    />
                    {errors.estimated_amount && (
                      <span
                        style={{
                          display: "block",
                          marginTop: "var(--spacing-xs)",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--accent-red-primary)",
                        }}
                      >
                        {errors.estimated_amount}
                      </span>
                    )}
                  </div>
                )}

                {errors.submit && (
                  <div
                    style={{
                      marginTop: "var(--spacing-md)",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--accent-red-light)",
                      color: "var(--accent-red-primary)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    {errors.submit}
                  </div>
                )}
              </div>

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
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-xs)",
                    fontSize: "var(--font-size-sm)",
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
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-xs)",
                      fontSize: "var(--font-size-sm)",
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
                    {isSubmitting ? "Guardando..." : "Guardar Pedido"}
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


