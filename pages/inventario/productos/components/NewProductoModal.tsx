"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import inventoryCategoriesData from "../../../../data/inventory/inventory_categories.json";
import {
  createInventoryItem,
  InventoryItemData,
} from "../../../../lib/mocks/inventoryMocks";

interface NewProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (item: InventoryItemData) => Promise<void> | void;
}

export function NewProductoModal({ isOpen, onClose, onCreated }: NewProductoModalProps) {
  const [formData, setFormData] = useState({
    internal_code: "",
    name: "",
    description: "",
    category_id: "",
    base_price: 0,
    cost_price: 0,
    is_stockable: true,
    stock_warehouse: 0,
    stock_min: 0,
    unit: "unidad",
    primary_supplier_id: "",
    rental_price_12m: 0,
    rental_price_18m: 0,
    rental_price_daily: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (formData.is_stockable) {
      if (formData.stock_warehouse < 0) {
        next.stock_warehouse = "El stock de almacén no puede ser negativo";
      }
      if (formData.stock_min < 0) {
        next.stock_min = "El stock mínimo no puede ser negativo";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const created = await createInventoryItem({
        internal_code: formData.internal_code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        type: "producto",
        subtype: "alquiler",
        category_id: formData.category_id,
        primary_supplier_id: formData.primary_supplier_id || undefined,
        base_price: formData.base_price,
        cost_price: formData.cost_price,
        rental_price_12m: formData.rental_price_12m || undefined,
        rental_price_18m: formData.rental_price_18m || undefined,
        rental_price_daily: formData.rental_price_daily || undefined,
        is_stockable: formData.is_stockable,
        stock_warehouse: formData.is_stockable ? formData.stock_warehouse : null,
        stock_rented: null,
        stock_committed: null,
        stock_min: formData.is_stockable ? formData.stock_min : null,
        unit: formData.unit,
        is_active: true,
      });
      await onCreated(created);
      onClose();
    } catch (error) {
      console.error("Error al crear producto:", error);
      setErrors({
        submit:
          "Ha ocurrido un error al crear el producto. Revisa los datos e inténtalo de nuevo.",
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
          maxWidth: 900,
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
              Nuevo producto
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
              }}
            >
              Alta rápida de producto de inventario. Formulario sencillo tipo Holded.
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
              gridTemplateColumns: "2fr 1.5fr",
              gap: "var(--spacing-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
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
                    placeholder="PROD-007"
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
                    placeholder="Cabinet LED ALS P2.604 indoor..."
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
                  placeholder="Descripción corta para entender rápidamente el producto..."
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
                  gridTemplateColumns: "1.4fr 1.4fr 1.2fr",
                  gap: "var(--spacing-md)",
                  alignItems: "flex-end",
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
                    Unidad
                  </label>
                  <input
                    value={formData.unit}
                    onChange={(e) => handleChange("unit", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  />
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
                    Activo
                  </label>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "var(--font-size-sm)",
                      color: "var(--foreground-secondary)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      style={{ accentColor: "var(--accent-blue-primary)" }}
                    />
                    Visible en listados
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
              }}
            >
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
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 4,
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    Alquiler 12 meses (opc.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.rental_price_12m}
                    onChange={(e) =>
                      handleChange(
                        "rental_price_12m",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  />
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
                    Alquiler 18 meses (opc.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.rental_price_18m}
                    onChange={(e) =>
                      handleChange(
                        "rental_price_18m",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  />
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
                    Alquiler diario (opc.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={formData.rental_price_daily}
                    onChange={(e) =>
                      handleChange(
                        "rental_price_daily",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: "var(--spacing-md)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-medium)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--spacing-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "var(--spacing-md)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Control de stock
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--foreground-tertiary)",
                      }}
                    >
                      Solo se aplica a productos stockables
                    </span>
                  </div>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: "var(--font-size-sm)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.is_stockable}
                      onChange={(e) => handleChange("is_stockable", e.target.checked)}
                      style={{ accentColor: "var(--accent-blue-primary)" }}
                    />
                    Es stockable
                  </label>
                </div>

                {formData.is_stockable && (
                  <div
                    style={{
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
                        Stock almacén
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.stock_warehouse}
                        onChange={(e) =>
                          handleChange(
                            "stock_warehouse",
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.stock_warehouse
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      />
                      {errors.stock_warehouse && (
                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                          }}
                        >
                          {errors.stock_warehouse}
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
                        Stock mínimo
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.stock_min}
                        onChange={(e) =>
                          handleChange(
                            "stock_min",
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.stock_min
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      />
                      {errors.stock_min && (
                        <span
                          style={{
                            display: "block",
                            marginTop: 4,
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                          }}
                        >
                          {errors.stock_min}
                        </span>
                      )}
                    </div>
                  </div>
                )}
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
              }}
            >
              {errors.submit}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
              {isSubmitting ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}


