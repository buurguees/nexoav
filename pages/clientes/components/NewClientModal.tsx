"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";

/**
 * Componente Modal para crear un nuevo cliente
 * Basado en el schema de la tabla `clients` (docs/base-de-datos.md)
 * 
 * Campos automáticos (NO se implementan):
 * - id, internal_code, total_billing, total_projects, created_at, updated_at
 */

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: any) => Promise<void>;
}

// Lista de provincias españolas
const SPANISH_PROVINCES = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz",
  "Barcelona", "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real",
  "Córdoba", "Cuenca", "Girona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva",
  "Huesca", "Jaén", "La Coruña", "La Rioja", "Las Palmas", "León", "Lleida",
  "Lugo", "Madrid", "Málaga", "Murcia", "Navarra", "Ourense", "Palencia",
  "Pontevedra", "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla",
  "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya",
  "Zamora", "Zaragoza"
];

const PAYMENT_TERMS = ["30 días", "60 días", "90 días", "Contado"];
const PAYMENT_METHODS = ["transferencia", "confirming", "cheque", "efectivo"];

// Función para convertir a formato título (primera letra mayúscula, resto minúsculas)
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Función para validar CIF/NIF español
function validateVatNumber(vat: string): boolean {
  const vatRegex = /^[A-Z]{1}[0-9]{8}$/;
  return vatRegex.test(vat);
}

// Función para validar código postal (5 dígitos)
function validateZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zip);
}

export function NewClientModal({ isOpen, onClose, onSave }: NewClientModalProps) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información Fiscal
    fiscal_name: "",
    commercial_name: "",
    vat_number: "",
    
    // Dirección de Facturación
    billing_address: {
      street: "",
      city: "",
      zip: "",
      province: "",
      country: "España",
    },
    
    // Dirección de Envío
    use_same_shipping: true,
    shipping_address: {
      street: "",
      city: "",
      zip: "",
      province: "",
      country: "España",
    },
    
    // Condiciones de Pago
    payment_terms: "30 días",
    payment_method: "transferencia",
    
    // Estado y Notas
    is_active: true,
    notes: "",
  });

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear formulario al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fiscal_name: "",
        commercial_name: "",
        vat_number: "",
        billing_address: {
          street: "",
          city: "",
          zip: "",
          province: "",
          country: "España",
        },
        use_same_shipping: true,
        shipping_address: {
          street: "",
          city: "",
          zip: "",
          province: "",
          country: "España",
        },
        payment_terms: "30 días",
        payment_method: "transferencia",
        is_active: true,
        notes: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Copiar dirección de facturación a envío cuando se marca el checkbox
  useEffect(() => {
    if (formData.use_same_shipping) {
      setFormData((prev) => ({
        ...prev,
        shipping_address: { ...prev.billing_address },
      }));
    }
  }, [formData.use_same_shipping, formData.billing_address]);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Información Fiscal
    if (!formData.fiscal_name.trim()) {
      newErrors.fiscal_name = "La razón social es obligatoria";
    }
    if (!formData.vat_number.trim()) {
      newErrors.vat_number = "El CIF/NIF es obligatorio";
    } else if (!validateVatNumber(formData.vat_number.toUpperCase())) {
      newErrors.vat_number = "Formato de CIF/NIF inválido (ej: B12345678)";
    }

    // Dirección de Facturación
    if (!formData.billing_address.street.trim()) {
      newErrors["billing_address.street"] = "La calle es obligatoria";
    }
    if (!formData.billing_address.city.trim()) {
      newErrors["billing_address.city"] = "La ciudad es obligatoria";
    }
    if (!formData.billing_address.zip.trim()) {
      newErrors["billing_address.zip"] = "El código postal es obligatorio";
    } else if (!validateZipCode(formData.billing_address.zip)) {
      newErrors["billing_address.zip"] = "El código postal debe tener 5 dígitos";
    }
    if (!formData.billing_address.province) {
      newErrors["billing_address.province"] = "La provincia es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio en campos
  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Aplicar transformaciones antes de guardar
      const transformedData = {
        // Nombres a MAYÚSCULAS
        fiscal_name: formData.fiscal_name.toUpperCase().trim(),
        commercial_name: formData.commercial_name
          ? formData.commercial_name.toUpperCase().trim()
          : null,
        vat_number: formData.vat_number.toUpperCase().trim(),

        // Direcciones a formato título
        billing_address: {
          street: toTitleCase(formData.billing_address.street.trim()),
          city: toTitleCase(formData.billing_address.city.trim()),
          zip: formData.billing_address.zip.trim(),
          province: toTitleCase(formData.billing_address.province),
          country: formData.billing_address.country,
        },
        shipping_address: formData.use_same_shipping
          ? {
              street: toTitleCase(formData.billing_address.street.trim()),
              city: toTitleCase(formData.billing_address.city.trim()),
              zip: formData.billing_address.zip.trim(),
              province: toTitleCase(formData.billing_address.province),
              country: formData.billing_address.country,
            }
          : {
              street: toTitleCase(formData.shipping_address.street.trim()),
              city: toTitleCase(formData.shipping_address.city.trim()),
              zip: formData.shipping_address.zip.trim(),
              province: toTitleCase(formData.shipping_address.province),
              country: formData.shipping_address.country,
            },

        // Condiciones de Pago
        payment_terms: formData.payment_terms || null,
        payment_method: formData.payment_method || null,

        // Estado y Notas
        is_active: formData.is_active,
        notes: formData.notes.trim() || null,
      };

      await onSave(transformedData);
      onClose();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      // TODO: Mostrar mensaje de error al usuario
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
              zIndex: 9998,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              backgroundColor: "var(--background)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "var(--spacing-lg)",
                borderBottom: "1px solid var(--border-soft)",
                flexShrink: 0,
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
                Nuevo Cliente
              </h2>
              <button
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "var(--foreground-tertiary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-tertiary)";
                }}
              >
                <IconWrapper icon={X} size={20} />
              </button>
            </div>

            {/* Formulario con scroll */}
            <form
              onSubmit={handleSubmit}
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "var(--spacing-lg)",
                className: "page-content-scroll",
              }}
              className="page-content-scroll"
            >
              {/* 1. Información Fiscal */}
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Información Fiscal
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                  {/* Razón Social */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Razón Social <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fiscal_name}
                      onChange={(e) => handleChange("fiscal_name", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${errors.fiscal_name ? "var(--accent-red-primary)" : "var(--border-medium)"}`,
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                      placeholder="Ej: CBCN SOLUCIONES Y EQUIPOS MULTIFUNCIONALES SL"
                    />
                    {errors.fiscal_name && (
                      <span
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--accent-red-primary)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        {errors.fiscal_name}
                      </span>
                    )}
                  </div>

                  {/* Nombre Comercial */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      value={formData.commercial_name}
                      onChange={(e) => handleChange("commercial_name", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                      placeholder="Ej: CANON BCN 22"
                    />
                  </div>

                  {/* CIF/NIF */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      CIF/NIF <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.vat_number}
                      onChange={(e) => handleChange("vat_number", e.target.value.toUpperCase())}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${errors.vat_number ? "var(--accent-red-primary)" : "var(--border-medium)"}`,
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                        textTransform: "uppercase",
                      }}
                      placeholder="Ej: B65595621"
                      maxLength={9}
                    />
                    {errors.vat_number && (
                      <span
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--accent-red-primary)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        {errors.vat_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Dirección de Facturación */}
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Dirección de Facturación
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                  {/* Calle */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Calle y Número <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.billing_address.street}
                      onChange={(e) => handleChange("billing_address.street", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${errors["billing_address.street"] ? "var(--accent-red-primary)" : "var(--border-medium)"}`,
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                      placeholder="Ej: Calle espronceda, 333 - 333"
                    />
                    {errors["billing_address.street"] && (
                      <span
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--accent-red-primary)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        {errors["billing_address.street"]}
                      </span>
                    )}
                  </div>

                  {/* Ciudad y Código Postal */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-md)" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground-secondary)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        Ciudad <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.billing_address.city}
                        onChange={(e) => handleChange("billing_address.city", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: `1px solid ${errors["billing_address.city"] ? "var(--accent-red-primary)" : "var(--border-medium)"}`,
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                        placeholder="Ej: Barcelona"
                      />
                      {errors["billing_address.city"] && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                            marginTop: "var(--spacing-xs)",
                          }}
                        >
                          {errors["billing_address.city"]}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground-secondary)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        Código Postal <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.billing_address.zip}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                          handleChange("billing_address.zip", value);
                        }}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: `1px solid ${errors["billing_address.zip"] ? "var(--accent-red-primary)" : "var(--border-medium)"}`,
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                        placeholder="08027"
                        maxLength={5}
                      />
                      {errors["billing_address.zip"] && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                            marginTop: "var(--spacing-xs)",
                          }}
                        >
                          {errors["billing_address.zip"]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provincia y País */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-md)" }}>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground-secondary)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        Provincia <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <select
                        value={formData.billing_address.province}
                        onChange={(e) => handleChange("billing_address.province", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: `1px solid ${errors["billing_address.province"] ? "var(--accent-red-primary)" : "var(--border-medium)"}`,
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        <option value="">Seleccionar provincia</option>
                        {SPANISH_PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      {errors["billing_address.province"] && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                            marginTop: "var(--spacing-xs)",
                          }}
                        >
                          {errors["billing_address.province"]}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground-secondary)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        País <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <select
                        value={formData.billing_address.country}
                        onChange={(e) => handleChange("billing_address.country", e.target.value)}
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
                        <option value="España">España</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Francia">Francia</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Dirección de Envío */}
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Dirección de Envío
                </h3>

                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--foreground-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.use_same_shipping}
                      onChange={(e) => handleChange("use_same_shipping", e.target.checked)}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                    Usar misma dirección que facturación
                  </label>
                </div>

                {!formData.use_same_shipping && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                    {/* Mismos campos que billing_address */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground-secondary)",
                          marginBottom: "var(--spacing-xs)",
                        }}
                      >
                        Calle y Número
                      </label>
                      <input
                        type="text"
                        value={formData.shipping_address.street}
                        onChange={(e) => handleChange("shipping_address.street", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                        placeholder="Ej: Calle mayor, 10"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-md)" }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground-secondary)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={formData.shipping_address.city}
                          onChange={(e) => handleChange("shipping_address.city", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-medium)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                            fontSize: "var(--font-size-sm)",
                          }}
                          placeholder="Ej: Madrid"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground-secondary)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          Código Postal
                        </label>
                        <input
                          type="text"
                          value={formData.shipping_address.zip}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                            handleChange("shipping_address.zip", value);
                          }}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border-medium)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                            fontSize: "var(--font-size-sm)",
                          }}
                          placeholder="28001"
                          maxLength={5}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-md)" }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground-secondary)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          Provincia
                        </label>
                        <select
                          value={formData.shipping_address.province}
                          onChange={(e) => handleChange("shipping_address.province", e.target.value)}
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
                          <option value="">Seleccionar provincia</option>
                          {SPANISH_PROVINCES.map((province) => (
                            <option key={province} value={province}>
                              {province}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "var(--font-size-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            color: "var(--foreground-secondary)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          País
                        </label>
                        <select
                          value={formData.shipping_address.country}
                          onChange={(e) => handleChange("shipping_address.country", e.target.value)}
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
                          <option value="España">España</option>
                          <option value="Portugal">Portugal</option>
                          <option value="Francia">Francia</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Condiciones de Pago */}
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Condiciones de Pago
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Condiciones de Pago
                    </label>
                    <select
                      value={formData.payment_terms}
                      onChange={(e) => handleChange("payment_terms", e.target.value)}
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
                      {PAYMENT_TERMS.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Método de Pago
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => handleChange("payment_method", e.target.value)}
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
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 5. Estado y Notas */}
              <div style={{ marginBottom: "var(--spacing-xl)" }}>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Estado y Notas
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-sm)",
                        fontSize: "var(--font-size-sm)",
                        color: "var(--foreground-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleChange("is_active", e.target.checked)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                        }}
                      />
                      Cliente activo
                    </label>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground-secondary)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Notas Internas
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                      placeholder="Notas internas sobre el cliente..."
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Footer con botones */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "var(--spacing-md)",
                padding: "var(--spacing-lg)",
                borderTop: "1px solid var(--border-soft)",
                flexShrink: 0,
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
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background)";
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: "var(--spacing-sm) var(--spacing-lg)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: isSubmitting
                    ? "var(--foreground-tertiary)"
                    : "var(--accent-blue-primary)",
                  color: "white",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.opacity = "0.9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.opacity = "1";
                  }
                }}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cliente"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

