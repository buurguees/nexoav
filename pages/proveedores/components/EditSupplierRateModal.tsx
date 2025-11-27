"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import {
  updateSupplierRate,
  fetchServices,
  SupplierRateData,
  InventoryItemData,
} from "../../../lib/mocks/supplierRateMocks";

interface EditSupplierRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate: SupplierRateData;
  onSave: (rate: SupplierRateData) => Promise<void>;
}

const SERVICE_TYPES = [
  { value: "jornada", label: "Jornada" },
  { value: "hora_extra", label: "Hora Extra" },
  { value: "media_jornada", label: "Media Jornada" },
  { value: "dieta", label: "Dieta" },
  { value: "desplazamiento", label: "Desplazamiento" },
];

const UNITS = [
  { value: "día", label: "Día" },
  { value: "hora", label: "Hora" },
  { value: "unidad", label: "Unidad" },
  { value: "jornada", label: "Jornada" },
];

export function EditSupplierRateModal({
  isOpen,
  onClose,
  rate,
  onSave,
}: EditSupplierRateModalProps) {
  const [formData, setFormData] = useState({
    inventory_item_id: rate.inventory_item_id,
    service_type: rate.service_type,
    cost_price: rate.cost_price,
    unit: rate.unit,
    year: rate.year,
    is_active: rate.is_active,
    notes: rate.notes || "",
  });
  const [services, setServices] = useState<InventoryItemData[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && rate) {
      setFormData({
        inventory_item_id: rate.inventory_item_id,
        service_type: rate.service_type,
        cost_price: rate.cost_price,
        unit: rate.unit,
        year: rate.year,
        is_active: rate.is_active,
        notes: rate.notes || "",
      });
      setErrors({});
    }
  }, [isOpen, rate]);

  useEffect(() => {
    if (isOpen) {
      const loadServices = async () => {
        setIsLoadingServices(true);
        try {
          const allServices = await fetchServices();
          setServices(allServices);
        } catch (error) {
          console.error("Error al cargar servicios:", error);
        } finally {
          setIsLoadingServices(false);
        }
      };
      loadServices();
    }
  }, [isOpen]);

  const selectedService = services.find((s) => s.id === formData.inventory_item_id);
  const margin = selectedService
    ? selectedService.base_price - formData.cost_price
    : null;

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.inventory_item_id) {
      newErrors.inventory_item_id = "Debe seleccionar un servicio";
    }

    if (formData.cost_price < 0) {
      newErrors.cost_price = "El coste no puede ser negativo";
    }

    if (formData.year < 2020 || formData.year > 2100) {
      newErrors.year = "Año inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateSupplierRate(rate.id, {
        inventory_item_id: formData.inventory_item_id,
        service_type: formData.service_type,
        cost_price: formData.cost_price,
        unit: formData.unit,
        year: formData.year,
        is_active: formData.is_active,
        notes: formData.notes.trim() || undefined,
      });
      await onSave(updated);
      onClose();
    } catch (error) {
      console.error("Error al actualizar tarifa:", error);
      setErrors({
        submit: "Error al actualizar la tarifa. Por favor, inténtalo de nuevo.",
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
          maxWidth: 600,
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
              Editar Tarifa
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
              }}
            >
              Actualizar información de la tarifa
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
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Servicio Vinculado{" "}
              <span style={{ color: "var(--accent-red-primary)" }}>*</span>
            </label>
            {isLoadingServices ? (
              <div style={{ padding: "var(--spacing-md)", textAlign: "center" }}>
                Cargando servicios...
              </div>
            ) : (
              <select
                value={formData.inventory_item_id}
                onChange={(e) => handleChange("inventory_item_id", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.inventory_item_id
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                <option value="">Seleccionar servicio...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.base_price}€)
                  </option>
                ))}
              </select>
            )}
            {errors.inventory_item_id && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.inventory_item_id}
              </span>
            )}
          </div>

          {selectedService && (
            <div
              style={{
                padding: "var(--spacing-md)",
                backgroundColor: "var(--background-secondary)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Precio de venta:</span>
                <strong>{selectedService.base_price.toFixed(2)}€</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Coste proveedor:</span>
                <strong>{formData.cost_price.toFixed(2)}€</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "var(--spacing-xs)",
                  borderTop: "1px solid var(--border-medium)",
                  color: margin && margin > 0 ? "rgb(0, 200, 117)" : "var(--error)",
                }}
              >
                <span>Margen:</span>
                <strong>{margin?.toFixed(2)}€</strong>
              </div>
            </div>
          )}

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
                Tipo de Servicio
              </label>
              <select
                value={formData.service_type}
                onChange={(e) => handleChange("service_type", e.target.value)}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                }}
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                Coste Proveedor (€){" "}
                <span style={{ color: "var(--accent-red-primary)" }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) => handleChange("cost_price", parseFloat(e.target.value) || 0)}
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
                Año
              </label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={formData.year}
                onChange={(e) => handleChange("year", parseInt(e.target.value) || new Date().getFullYear())}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: errors.year
                    ? "1px solid var(--accent-red-primary)"
                    : "1px solid var(--border-medium)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
              {errors.year && (
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: "var(--font-size-xs)",
                    color: "var(--accent-red-primary)",
                  }}
                >
                  {errors.year}
                </span>
              )}
            </div>
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                style={{ accentColor: "var(--primary)" }}
              />
              <span>Tarifa activa</span>
            </label>
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
                resize: "vertical",
                fontSize: "var(--font-size-sm)",
              }}
            />
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

