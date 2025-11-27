"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import { fetchSupplierById, updateSupplier, SupplierData } from "../../../lib/mocks/supplierMocks";

/**
 * Componente Modal para editar un proveedor existente
 * Basado en el schema de la tabla `suppliers` (docs/base-de-datos.md, línea 1200)
 */

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
  onSave: (supplier: SupplierData) => Promise<void>;
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

const SUPPLIER_CATEGORIES = [
  { value: "tecnico_freelance", label: "Técnico Freelance" },
  { value: "material", label: "Material" },
  { value: "transporte", label: "Transporte" },
  { value: "software", label: "Software" },
  { value: "externo", label: "Externo" },
];

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
  if (!vat) return false;
  const vatRegex = /^[A-Z]{1}[0-9]{8}$/;
  return vatRegex.test(vat.toUpperCase());
}

// Función para validar código postal (5 dígitos)
function validateZipCode(zip: string): boolean {
  if (!zip) return false;
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zip);
}

// Función para validar email
function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function EditSupplierModal({ isOpen, onClose, supplierId, onSave }: EditSupplierModalProps) {
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [formData, setFormData] = useState({
    fiscal_name: "",
    commercial_name: "",
    cif: "",
    category: "tecnico_freelance" as SupplierData["category"],
    address: {
      street: "",
      city: "",
      zip: "",
      province: "",
      country: "España",
    },
    contact_email: "",
    contact_phone: "",
    payment_terms_days: 30,
    is_active: true,
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar proveedor al abrir
  useEffect(() => {
    if (isOpen && supplierId) {
      const loadSupplier = async () => {
        setIsLoading(true);
        try {
          const doc = await fetchSupplierById(supplierId);
          if (!doc) {
            setErrors({ submit: "Proveedor no encontrado" });
            return;
          }

          setSupplier(doc);
          setFormData({
            fiscal_name: doc.fiscal_name || "",
            commercial_name: doc.commercial_name || "",
            cif: doc.cif || "",
            category: doc.category,
            address: doc.address || {
              street: "",
              city: "",
              zip: "",
              province: "",
              country: "España",
            },
            contact_email: doc.contact_email || "",
            contact_phone: doc.contact_phone || "",
            payment_terms_days: doc.payment_terms_days || 30,
            is_active: doc.is_active ?? true,
            notes: doc.notes || "",
          });
        } catch (error) {
          console.error("Error al cargar proveedor:", error);
          setErrors({ submit: "Error al cargar el proveedor" });
        } finally {
          setIsLoading(false);
        }
      };
      loadSupplier();
    }
  }, [isOpen, supplierId]);

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSupplier(null);
      setFormData({
        fiscal_name: "",
        commercial_name: "",
        cif: "",
        category: "tecnico_freelance",
        address: {
          street: "",
          city: "",
          zip: "",
          province: "",
          country: "España",
        },
        contact_email: "",
        contact_phone: "",
        payment_terms_days: 30,
        is_active: true,
        notes: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fiscal_name.trim()) {
      newErrors.fiscal_name = "La razón social es obligatoria";
    }
    if (formData.cif && !validateVatNumber(formData.cif)) {
      newErrors.cif = "Formato de CIF/NIF inválido (ej: B12345678)";
    }
    if (!formData.category) {
      newErrors.category = "La categoría es obligatoria";
    }
    if (formData.address.zip && !validateZipCode(formData.address.zip)) {
      newErrors["address.zip"] = "El código postal debe tener 5 dígitos";
    }
    if (formData.contact_email && !validateEmail(formData.contact_email)) {
      newErrors.contact_email = "Formato de email inválido";
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
      const transformedData = {
        fiscal_name: formData.fiscal_name.toUpperCase().trim(),
        commercial_name: formData.commercial_name
          ? formData.commercial_name.toUpperCase().trim()
          : undefined,
        cif: formData.cif ? formData.cif.toUpperCase().trim() : undefined,
        category: formData.category,
        address: formData.address.street || formData.address.city
          ? {
              street: formData.address.street ? toTitleCase(formData.address.street.trim()) : undefined,
              city: formData.address.city ? toTitleCase(formData.address.city.trim()) : undefined,
              zip: formData.address.zip ? formData.address.zip.trim() : undefined,
              province: formData.address.province ? toTitleCase(formData.address.province) : undefined,
              country: formData.address.country || "España",
            }
          : undefined,
        contact_email: formData.contact_email ? formData.contact_email.trim() : undefined,
        contact_phone: formData.contact_phone ? formData.contact_phone.trim() : undefined,
        payment_terms_days: formData.payment_terms_days || 30,
        is_active: formData.is_active,
        notes: formData.notes.trim() || undefined,
      };

      const updated = await updateSupplier(supplierId, transformedData);
      await onSave(updated);
      onClose();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      setErrors({ submit: "Error al actualizar el proveedor" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                zIndex: 9998,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                x: "-50%",
                y: "-50%",
                padding: "var(--spacing-xl)",
                backgroundColor: "var(--background)",
                borderRadius: "var(--radius-lg)",
                zIndex: 9999,
              }}
            >
              <div>Cargando proveedor...</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (!supplier) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && supplier && (
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
                Editar Proveedor
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

            {/* Content - Reutilizar estructura de NewSupplierModal */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflow: "auto" }}>
              <div style={{ padding: "var(--spacing-lg)" }}>
                {/* Información Fiscal */}
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
                        Razón Social <span style={{ color: "var(--error)" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fiscal_name}
                        onChange={(e) => handleChange("fiscal_name", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          fontSize: "var(--font-size-base)",
                          border: `1px solid ${errors.fiscal_name ? "var(--error)" : "var(--border-medium)"}`,
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                        placeholder="PROVEEDOR XYZ SL"
                      />
                      {errors.fiscal_name && (
                        <span style={{ color: "var(--error)", fontSize: "var(--font-size-xs)", marginTop: "var(--spacing-xs)", display: "block" }}>
                          {errors.fiscal_name}
                        </span>
                      )}
                    </div>

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
                        Nombre Comercial
                      </label>
                      <input
                        type="text"
                        value={formData.commercial_name}
                        onChange={(e) => handleChange("commercial_name", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          fontSize: "var(--font-size-base)",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                        placeholder="Proveedor XYZ"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
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
                          CIF/NIF
                        </label>
                        <input
                          type="text"
                          value={formData.cif}
                          onChange={(e) => handleChange("cif", e.target.value.toUpperCase())}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            border: `1px solid ${errors.cif ? "var(--error)" : "var(--border-medium)"}`,
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                          }}
                          placeholder="B12345678"
                          maxLength={9}
                        />
                        {errors.cif && (
                          <span style={{ color: "var(--error)", fontSize: "var(--font-size-xs)", marginTop: "var(--spacing-xs)", display: "block" }}>
                            {errors.cif}
                          </span>
                        )}
                      </div>

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
                          Categoría <span style={{ color: "var(--error)" }}>*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleChange("category", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            border: `1px solid ${errors.category ? "var(--error)" : "var(--border-medium)"}`,
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                          }}
                        >
                          {SUPPLIER_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <span style={{ color: "var(--error)", fontSize: "var(--font-size-xs)", marginTop: "var(--spacing-xs)", display: "block" }}>
                            {errors.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div style={{ marginBottom: "var(--spacing-xl)" }}>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Dirección
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
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
                        Calle
                      </label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => handleChange("address.street", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          fontSize: "var(--font-size-base)",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                        placeholder="Calle Principal, 123"
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-md)" }}>
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
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => handleChange("address.city", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            border: "1px solid var(--border-medium)",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                          }}
                          placeholder="Madrid"
                        />
                      </div>

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
                          Código Postal
                        </label>
                        <input
                          type="text"
                          value={formData.address.zip}
                          onChange={(e) => handleChange("address.zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            border: `1px solid ${errors["address.zip"] ? "var(--error)" : "var(--border-medium)"}`,
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                          }}
                          placeholder="28001"
                          maxLength={5}
                        />
                        {errors["address.zip"] && (
                          <span style={{ color: "var(--error)", fontSize: "var(--font-size-xs)", marginTop: "var(--spacing-xs)", display: "block" }}>
                            {errors["address.zip"]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
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
                          Provincia
                        </label>
                        <select
                          value={formData.address.province}
                          onChange={(e) => handleChange("address.province", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            border: "1px solid var(--border-medium)",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
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
                            color: "var(--foreground)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          País
                        </label>
                        <input
                          type="text"
                          value={formData.address.country}
                          onChange={(e) => handleChange("address.country", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "var(--spacing-sm) var(--spacing-md)",
                            fontSize: "var(--font-size-base)",
                            border: "1px solid var(--border-medium)",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--background)",
                            color: "var(--foreground)",
                          }}
                          placeholder="España"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacto */}
                <div style={{ marginBottom: "var(--spacing-xl)" }}>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Contacto
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
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
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => handleChange("contact_email", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          fontSize: "var(--font-size-base)",
                          border: `1px solid ${errors.contact_email ? "var(--error)" : "var(--border-medium)"}`,
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                        placeholder="contacto@proveedor.com"
                      />
                      {errors.contact_email && (
                        <span style={{ color: "var(--error)", fontSize: "var(--font-size-xs)", marginTop: "var(--spacing-xs)", display: "block" }}>
                          {errors.contact_email}
                        </span>
                      )}
                    </div>

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
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => handleChange("contact_phone", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          fontSize: "var(--font-size-base)",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                        }}
                        placeholder="+34 123 456 789"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "var(--spacing-md)" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      Días de Pago
                    </label>
                    <input
                      type="number"
                      value={formData.payment_terms_days}
                      onChange={(e) => handleChange("payment_terms_days", parseInt(e.target.value) || 30)}
                      min={0}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm) var(--spacing-md)",
                        fontSize: "var(--font-size-base)",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                </div>

                {/* Notas */}
                <div style={{ marginBottom: "var(--spacing-xl)" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-xs)",
                    }}
                  >
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      fontSize: "var(--font-size-base)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    placeholder="Notas adicionales sobre el proveedor..."
                  />
                </div>

                {/* Estado */}
                <div style={{ marginBottom: "var(--spacing-xl)" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleChange("is_active", e.target.checked)}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span>Proveedor activo</span>
                  </label>
                </div>

                {errors.submit && (
                  <div
                    style={{
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--error-background)",
                      color: "var(--error)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    {errors.submit}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
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
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-medium)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
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
                  disabled={isSubmitting}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-lg)",
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-medium)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isSubmitting ? "var(--foreground-tertiary)" : "var(--primary)",
                    color: "white",
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

