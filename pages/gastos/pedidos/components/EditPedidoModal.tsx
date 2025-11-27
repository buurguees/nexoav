"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  PurchaseOrderData,
  updatePurchaseOrder,
} from "../../../../lib/mocks/purchaseOrdersMocks";
import { fetchSuppliers, SupplierData } from "../../../../lib/mocks/supplierMocks";

interface EditPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: PurchaseOrderData;
  onSave: (pedido: PurchaseOrderData) => Promise<void>;
}

export function EditPedidoModal({ isOpen, onClose, pedido, onSave }: EditPedidoModalProps) {
  const [formData, setFormData] = useState({
    supplier_id: pedido.supplier_id || "",
    description: pedido.description,
    estimated_amount: pedido.estimated_amount,
  });
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        supplier_id: pedido.supplier_id || "",
        description: pedido.description,
        estimated_amount: pedido.estimated_amount,
      });
      const loadSuppliers = async () => {
        setIsLoadingSuppliers(true);
        try {
          const s = await fetchSuppliers();
          setSuppliers(s);
        } catch (e) {
          console.error("Error cargando proveedores:", e);
        } finally {
          setIsLoadingSuppliers(false);
        }
      };
      loadSuppliers();
    }
  }, [isOpen, pedido]);

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

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.description.trim()) {
      nextErrors.description = "Debe indicar una descripción";
    }
    if (!formData.estimated_amount || formData.estimated_amount <= 0) {
      nextErrors.estimated_amount = "El importe previsto debe ser mayor que 0";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const updated = await updatePurchaseOrder(pedido.id, {
        supplier_id: formData.supplier_id || null,
        description: formData.description,
        estimated_amount: formData.estimated_amount,
      });
      await onSave(updated);
    } catch (e) {
      console.error("Error al actualizar pedido:", e);
      setErrors({ submit: "Error al guardar el pedido. Inténtelo de nuevo." });
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
              zIndex: 1100,
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
              maxWidth: "640px",
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
                Editar Pedido
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
              }}
            >
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
                  Descripción <span style={{ color: "var(--accent-red-primary)" }}>*</span>
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

              <div>
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
                  value={formData.estimated_amount}
                  onChange={(e) =>
                    handleChange("estimated_amount", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={0.01}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: errors.estimated_amount
                      ? "1px solid var(--accent-red-primary)"
                      : "1px solid var(--border-medium)",
                    backgroundColor: "var(--background)",
                  }}
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

              {errors.submit && (
                <div
                  style={{
                    marginTop: "var(--spacing-sm)",
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

              <div
                style={{
                  marginTop: "var(--spacing-lg)",
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
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


