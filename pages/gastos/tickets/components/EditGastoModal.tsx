"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchSuppliers } from "../../../../lib/mocks/supplierMocks";
import { fetchProjects, ProjectData } from "../../../../lib/mocks/projectMocks";
import { fetchPurchaseOrders, PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";
import { fetchExpenseById, updateExpense, ExpenseData } from "../../../../lib/mocks/expenseMocks";

interface EditGastoModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseId: string;
  onSave: (expense: ExpenseData) => Promise<void>;
}

export function EditGastoModal({ isOpen, onClose, expenseId, onSave }: EditGastoModalProps) {
  const [expense, setExpense] = useState<ExpenseData | null>(null);
  const [formData, setFormData] = useState({
    supplier_id: "",
    project_id: "",
    purchase_order_id: "",
    description: "",
    amount_base: 0,
    amount_tax: 0,
    amount_total: 0,
    tax_percent: 21,
    date_expense: "",
    status: "pendiente_aprobacion" as "pendiente_aprobacion" | "aprobado" | "pagado",
    payment_date: "",
    notes: "",
  });
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingPurchaseOrders, setIsLoadingPurchaseOrders] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar gasto y datos relacionados
  useEffect(() => {
    if (isOpen && expenseId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const doc = await fetchExpenseById(expenseId);
          if (!doc) {
            setErrors({ submit: "Gasto no encontrado" });
            return;
          }

          setExpense(doc);
          setFormData({
            supplier_id: doc.supplier_id || "",
            project_id: doc.project_id || "",
            purchase_order_id: doc.purchase_order_id || "",
            description: doc.description,
            amount_base: doc.amount_base,
            amount_tax: doc.amount_tax,
            amount_total: doc.amount_total,
            tax_percent: doc.amount_base > 0 ? (doc.amount_tax / doc.amount_base) * 100 : 21,
            date_expense: doc.date_expense,
            status: doc.status,
            payment_date: doc.payment_date || "",
            notes: doc.notes || "",
          });

          // Cargar datos relacionados
          setIsLoadingSuppliers(true);
          setIsLoadingProjects(true);
          const allSuppliers = await fetchSuppliers();
          setSuppliers(allSuppliers.filter((s) => s.is_active));
          const allProjects = await fetchProjects();
          setProjects(allProjects);
          setIsLoadingSuppliers(false);
          setIsLoadingProjects(false);

          // Cargar pedidos si hay proyecto
          if (doc.project_id) {
            setIsLoadingPurchaseOrders(true);
            const orders = await fetchPurchaseOrders(doc.project_id);
            setPurchaseOrders(orders.filter((o) => o.status === "pending" && !o.expense_id));
            setIsLoadingPurchaseOrders(false);
          }
        } catch (error) {
          console.error("Error al cargar gasto:", error);
          setErrors({ submit: "Error al cargar el gasto" });
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, expenseId]);

  // Cargar pedidos cuando cambia el proyecto
  useEffect(() => {
    if (formData.project_id) {
      const loadPurchaseOrders = async () => {
        setIsLoadingPurchaseOrders(true);
        try {
          const orders = await fetchPurchaseOrders(formData.project_id);
          setPurchaseOrders(orders.filter((o) => o.status === "pending" && !o.expense_id));
        } catch (error) {
          console.error("Error al cargar pedidos:", error);
        } finally {
          setIsLoadingPurchaseOrders(false);
        }
      };
      loadPurchaseOrders();
    } else {
      setPurchaseOrders([]);
    }
  }, [formData.project_id]);

  // Calcular totales cuando cambia base o IVA
  useEffect(() => {
    const tax = (formData.amount_base * formData.tax_percent) / 100;
    const total = formData.amount_base + tax;
    setFormData((prev) => ({
      ...prev,
      amount_tax: Math.round(tax * 100) / 100,
      amount_total: Math.round(total * 100) / 100,
    }));
  }, [formData.amount_base, formData.tax_percent]);

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setExpense(null);
      setFormData({
        supplier_id: "",
        project_id: "",
        purchase_order_id: "",
        description: "",
        amount_base: 0,
        amount_tax: 0,
        amount_total: 0,
        tax_percent: 21,
        date_expense: "",
        status: "pendiente_aprobacion",
        payment_date: "",
        notes: "",
      });
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (formData.amount_base <= 0) {
      newErrors.amount_base = "El importe debe ser mayor que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expense || !validateForm()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateExpense(expense.id, {
        supplier_id: formData.supplier_id || null,
        project_id: formData.project_id || null,
        purchase_order_id: formData.purchase_order_id || null,
        description: formData.description,
        amount_base: formData.amount_base,
        amount_tax: formData.amount_tax,
        amount_total: formData.amount_total,
        date_expense: formData.date_expense,
        status: formData.status,
        payment_date: formData.payment_date || null,
        notes: formData.notes || null,
      });

      if (!updated) {
        throw new Error("Error al actualizar el gasto");
      }

      await onSave(updated);
      onClose();
    } catch (error) {
      console.error("Error al actualizar gasto:", error);
      setErrors({ submit: "Error al actualizar el gasto. Por favor, inténtalo de nuevo." });
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
              Cargando gasto...
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (errors.submit && !expense) {
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

  // Mostrar comparación si hay pedido seleccionado
  const selectedPurchaseOrder = purchaseOrders.find((po) => po.id === formData.purchase_order_id);

  // Reutilizar estructura de NewGastoModal pero con datos precargados
  return (
    <AnimatePresence>
      {isOpen && expense && (
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
              width: "90%",
              maxWidth: "800px",
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
                Editar Gasto
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

            {/* Content - Misma estructura que NewGastoModal */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "var(--spacing-lg)", flex: 1 }}>
                {/* Información básica */}
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Información del Gasto
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                    {/* Descripción */}
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
                        Descripción <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.description
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
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

                    {/* Proveedor */}
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
                        Proveedor
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
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        <option value="">
                          {isLoadingSuppliers ? "Cargando proveedores..." : "Seleccione un proveedor (opcional)"}
                        </option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.commercial_name || supplier.fiscal_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Proyecto */}
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
                        Proyecto
                      </label>
                      <select
                        value={formData.project_id}
                        onChange={(e) => handleChange("project_id", e.target.value)}
                        disabled={isLoadingProjects}
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
                          {isLoadingProjects ? "Cargando proyectos..." : "Ningún proyecto (opcional)"}
                        </option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pedido de Compra */}
                    {formData.project_id && (
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
                          Pedido de Compra (Recomendado)
                        </label>
                        <select
                          value={formData.purchase_order_id}
                          onChange={(e) => handleChange("purchase_order_id", e.target.value)}
                          disabled={isLoadingPurchaseOrders || !formData.project_id}
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
                            {isLoadingPurchaseOrders
                              ? "Cargando pedidos..."
                              : !formData.project_id
                              ? "Primero seleccione un proyecto"
                              : "Ningún pedido (opcional)"}
                          </option>
                          {purchaseOrders.map((order) => (
                            <option key={order.id} value={order.id}>
                              {order.document_number} - {order.description} (Previsto: {new Intl.NumberFormat("es-ES", {
                                style: "currency",
                                currency: "EUR",
                              }).format(order.estimated_amount)})
                            </option>
                          ))}
                        </select>
                        {selectedPurchaseOrder && (
                          <div
                            style={{
                              marginTop: "var(--spacing-sm)",
                              padding: "var(--spacing-sm)",
                              backgroundColor: "var(--background-secondary)",
                              borderRadius: "var(--radius-md)",
                              fontSize: "var(--font-size-sm)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--spacing-xs)" }}>
                              <span style={{ color: "var(--foreground-secondary)" }}>Previsto:</span>
                              <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                                {new Intl.NumberFormat("es-ES", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(selectedPurchaseOrder.estimated_amount)}
                              </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--foreground-secondary)" }}>Real:</span>
                              <span style={{ fontWeight: "var(--font-weight-medium)" }}>
                                {new Intl.NumberFormat("es-ES", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(formData.amount_total)}
                              </span>
                            </div>
                            {formData.amount_total > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginTop: "var(--spacing-xs)",
                                  paddingTop: "var(--spacing-xs)",
                                  borderTop: "1px solid var(--border-medium)",
                                  color:
                                    formData.amount_total > selectedPurchaseOrder.estimated_amount
                                      ? "var(--accent-red-primary)"
                                      : "var(--accent-green-primary)",
                                  fontWeight: "var(--font-weight-medium)",
                                }}
                              >
                                <span>Desvío:</span>
                                <span>
                                  {formData.amount_total > selectedPurchaseOrder.estimated_amount ? "+" : ""}
                                  {new Intl.NumberFormat("es-ES", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(formData.amount_total - selectedPurchaseOrder.estimated_amount)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fecha */}
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
                        Fecha del Gasto
                      </label>
                      <input
                        type="date"
                        value={formData.date_expense}
                        onChange={(e) => handleChange("date_expense", e.target.value)}
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

                    {/* Importes */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-md)" }}>
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
                          Base Imponible <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.amount_base}
                          onChange={(e) => handleChange("amount_base", parseFloat(e.target.value) || 0)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-md)",
                            border: errors.amount_base
                              ? "1px solid var(--accent-red-primary)"
                              : "1px solid var(--border-medium)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                            fontSize: "var(--font-size-sm)",
                          }}
                        />
                        {errors.amount_base && (
                          <span
                            style={{
                              display: "block",
                              marginTop: "var(--spacing-xs)",
                              fontSize: "var(--font-size-xs)",
                              color: "var(--accent-red-primary)",
                            }}
                          >
                            {errors.amount_base}
                          </span>
                        )}
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
                          IVA %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={formData.tax_percent}
                          onChange={(e) => handleChange("tax_percent", parseFloat(e.target.value) || 0)}
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
                          Total
                        </label>
                        <div
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-medium)",
                            backgroundColor: "var(--background-secondary)",
                            color: "var(--foreground)",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            textAlign: "right",
                          }}
                        >
                          {new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                          }).format(formData.amount_total)}
                        </div>
                      </div>
                    </div>

                    {/* Estado */}
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
                        Estado
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleChange("status", e.target.value)}
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
                        <option value="pendiente_aprobacion">Pendiente de Aprobación</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="pagado">Pagado</option>
                      </select>
                    </div>

                    {/* Fecha de pago (si está pagado) */}
                    {formData.status === "pagado" && (
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
                          Fecha de Pago
                        </label>
                        <input
                          type="date"
                          value={formData.payment_date}
                          onChange={(e) => handleChange("payment_date", e.target.value)}
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
                    )}

                    {/* Notas */}
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
                        Notas
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
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
                        placeholder="Notas adicionales sobre el gasto..."
                      />
                    </div>

                    {/* Upload de archivo (placeholder) */}
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
                        Factura/Ticket (PDF/Imagen)
                      </label>
                      <div
                        style={{
                          padding: "var(--spacing-md)",
                          border: "2px dashed var(--border-medium)",
                          borderRadius: "var(--radius-md)",
                          textAlign: "center",
                          cursor: "pointer",
                          backgroundColor: "var(--background-secondary)",
                        }}
                      >
                        <IconWrapper icon={Upload} size={24} style={{ marginBottom: "var(--spacing-xs)", color: "var(--foreground-tertiary)" }} />
                        <div style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                          {expense.file_url ? "Archivo actual: " + expense.file_url : "Haz clic para subir o arrastra el archivo aquí"}
                        </div>
                        <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", marginTop: "var(--spacing-xs)" }}>
                          PDF, JPG, PNG (máx. 10MB)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  Cancelar
                </button>
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
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

