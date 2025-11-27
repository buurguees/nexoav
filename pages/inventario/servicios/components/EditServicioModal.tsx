"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import inventoryCategoriesData from "../../../../data/inventory/inventory_categories.json";
import {
  InventoryItemData,
  updateInventoryItem,
} from "../../../../lib/mocks/inventoryMocks";
import { fetchSuppliers } from "../../../../lib/mocks/supplierMocks";

interface EditServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: InventoryItemData;
  onUpdated: (item: InventoryItemData) => Promise<void> | void;
}

const SERVICE_SUBTYPES = [
  { value: "mano_de_obra", label: "Mano de Obra" },
  { value: "logistica", label: "Logística" },
  { value: "servicio", label: "Servicio General" },
];

const UNITS = ["hora", "día", "unidad", "jornada", "servicio"];

export function EditServicioModal({
  isOpen,
  onClose,
  service,
  onUpdated,
}: EditServicioModalProps) {
  const [formData, setFormData] = useState({
    internal_code: service.internal_code,
    name: service.name,
    description: service.description || "",
    category_id: service.category_id,
    subtype: service.subtype || "mano_de_obra",
    base_price: service.base_price,
    cost_price: service.cost_price,
    unit: service.unit,
    primary_supplier_id: service.primary_supplier_id || "",
  });
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar proveedores
  useEffect(() => {
    if (isOpen) {
      const loadSuppliers = async () => {
        setIsLoadingSuppliers(true);
        try {
          const allSuppliers = await fetchSuppliers();
          setSuppliers(allSuppliers.filter(s => s.is_active));
        } catch (error) {
          console.error("Error al cargar proveedores:", error);
        } finally {
          setIsLoadingSuppliers(false);
        }
      };
      loadSuppliers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        internal_code: service.internal_code,
        name: service.name,
        description: service.description || "",
        category_id: service.category_id,
        subtype: service.subtype || "mano_de_obra",
        base_price: service.base_price,
        cost_price: service.cost_price,
        unit: service.unit,
        primary_supplier_id: service.primary_supplier_id || "",
      });
      setErrors({});
    }
  }, [isOpen, service]);

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
    const next: Record<string, string> = {};
    if (!formData.internal_code.trim()) {
      next.internal_code = "El código interno es obligatorio";
    }
    if (!formData.name.trim()) {
      next.name = "El nombre es obligatorio";
    }
    if (!formData.category_id) {
      next.category_id = "Debe seleccionar una categoría";
    }
    if (formData.base_price < 0) {
      next.base_price = "El precio base no puede ser negativo";
    }
    if (formData.cost_price < 0) {
      next.cost_price = "El coste no puede ser negativo";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const updated = await updateInventoryItem(service.id, {
        internal_code: formData.internal_code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category_id: formData.category_id,
        subtype: formData.subtype,
        base_price: formData.base_price,
        cost_price: formData.cost_price,
        primary_supplier_id: formData.primary_supplier_id || undefined,
        unit: formData.unit,
      });
      await onUpdated(updated);
      onClose();
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      setErrors({
        submit:
          "Ha ocurrido un error al actualizar el servicio. Revisa los datos e inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          backgroundColor: "rgba(0,0,0,0.4)",
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
          width: "95%",
          maxWidth: 800,
          maxHeight: "90vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 24px 48px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.06)",
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
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--spacing-md)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Editar servicio
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
              }}
            >
              Actualiza la ficha del servicio. Los cambios afectarán a futuros documentos.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              padding: "var(--spacing-xs)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--foreground-secondary)",
            }}
          >
            <IconWrapper icon={X} size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-lg)",
            padding: "var(--spacing-lg)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 2fr",
              gap: "var(--spacing-md)",
              alignItems: "flex-start",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Código interno{" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <input
                value={formData.internal_code}
                onChange={(e) =>
                  handleChange("internal_code", e.target.value.toUpperCase())
                }
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.internal_code
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontFamily: "monospace",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              {errors.internal_code && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.internal_code}
                </span>
              )}
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Nombre{" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.name
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              {errors.name && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                resize: "vertical",
                fontSize: "var(--font-size-sm)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Categoría{" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.category_id
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                <option value="">Selecciona categoría</option>
                {(inventoryCategoriesData as any[]).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.category_id}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Subtipo
              </label>
              <select
                value={formData.subtype}
                onChange={(e) => handleChange("subtype", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                {SERVICE_SUBTYPES.map((subtype) => (
                  <option key={subtype.value} value={subtype.value}>
                    {subtype.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Unidad
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                  backgroundColor: "var(--background)",
                }}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              padding: "var(--spacing-md)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-medium)",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.02), rgba(56,189,248,0.02))",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-md)",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Precio base (€){" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={formData.base_price}
                onChange={(e) =>
                  handleChange("base_price", parseFloat(e.target.value) || 0)
                }
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.base_price
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              {errors.base_price && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.base_price}
                </span>
              )}
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                }}
              >
                Coste (€)
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={formData.cost_price}
                onChange={(e) =>
                  handleChange("cost_price", parseFloat(e.target.value) || 0)
                }
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.cost_price
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              {errors.cost_price && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.cost_price}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Proveedor Principal (opcional)
            </label>
            <select
              value={formData.primary_supplier_id}
              onChange={(e) => handleChange("primary_supplier_id", e.target.value)}
              disabled={isLoadingSuppliers}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                backgroundColor: "var(--background)",
              }}
            >
              <option value="">Sin proveedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.fiscal_name || supplier.name}
                </option>
              ))}
            </select>
          </div>

          {errors.submit && (
            <div
              style={{
                padding: "var(--spacing-md)",
                backgroundColor: "var(--error-background)",
                color: "var(--error)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              {errors.submit}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--spacing-md)",
              paddingTop: "var(--spacing-md)",
              borderTop: "1px solid var(--border-medium)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "var(--spacing-sm) var(--spacing-lg)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
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
                  : "var(--primary)",
                color: "white",
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
    </AnimatePresence>
  );
}

