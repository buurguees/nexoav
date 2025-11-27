"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  fetchCompanySettings,
  updateCompanySettings,
  CompanySettingsData,
} from "../../../../lib/mocks/companyMocks";

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

const CURRENCIES = ["EUR", "USD", "GBP"];

// Función para convertir a formato título
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

// Función para validar código postal
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

export function DatosFiscalesForm() {
  const [formData, setFormData] = useState({
    fiscal_name: "",
    trade_name: "",
    cif: "",
    address_fiscal: {
      street: "",
      city: "",
      zip: "",
      province: "",
      country: "España",
    },
    address_warehouse: {
      street: "",
      city: "",
      zip: "",
      province: "",
      country: "España",
    },
    phone: "",
    email_contact: "",
    default_vat: 21.0,
    default_currency: "EUR",
    logo_url: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const settings = await fetchCompanySettings();
        setFormData({
          fiscal_name: settings.fiscal_name || "",
          trade_name: settings.trade_name || "",
          cif: settings.cif || "",
          address_fiscal: settings.address_fiscal || {
            street: "",
            city: "",
            zip: "",
            province: "",
            country: "España",
          },
          address_warehouse: settings.address_warehouse || {
            street: "",
            city: "",
            zip: "",
            province: "",
            country: "España",
          },
          phone: settings.phone || "",
          email_contact: settings.email_contact || "",
          default_vat: settings.default_vat || 21.0,
          default_currency: settings.default_currency || "EUR",
          logo_url: settings.logo_url || "",
        });
      } catch (error) {
        console.error("Error al cargar datos fiscales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (field: string, value: any) => {
    if (field.startsWith("address_fiscal.") || field.startsWith("address_warehouse.")) {
      const [addressType, addressField] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType as keyof typeof prev],
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setSaveSuccess(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fiscal_name.trim()) {
      newErrors.fiscal_name = "La razón social es obligatoria";
    }

    if (!formData.cif.trim()) {
      newErrors.cif = "El CIF es obligatorio";
    } else if (!validateVatNumber(formData.cif)) {
      newErrors.cif = "Formato de CIF inválido (ej: B12345678)";
    }

    if (formData.address_fiscal.zip && !validateZipCode(formData.address_fiscal.zip)) {
      newErrors["address_fiscal.zip"] = "El código postal debe tener 5 dígitos";
    }

    if (formData.address_warehouse.zip && !validateZipCode(formData.address_warehouse.zip)) {
      newErrors["address_warehouse.zip"] = "El código postal debe tener 5 dígitos";
    }

    if (formData.email_contact && !validateEmail(formData.email_contact)) {
      newErrors.email_contact = "Email inválido";
    }

    if (formData.default_vat < 0 || formData.default_vat > 100) {
      newErrors.default_vat = "El IVA debe estar entre 0 y 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Transformar datos antes de guardar
      const updates: Partial<CompanySettingsData> = {
        fiscal_name: formData.fiscal_name.trim().toUpperCase(),
        trade_name: formData.trade_name.trim().toUpperCase() || undefined,
        cif: formData.cif.toUpperCase().trim(),
        address_fiscal: {
          street: toTitleCase(formData.address_fiscal.street.trim()),
          city: toTitleCase(formData.address_fiscal.city.trim()),
          zip: formData.address_fiscal.zip.trim(),
          province: toTitleCase(formData.address_fiscal.province.trim()),
          country: formData.address_fiscal.country.trim(),
        },
        address_warehouse: {
          street: toTitleCase(formData.address_warehouse.street.trim()),
          city: toTitleCase(formData.address_warehouse.city.trim()),
          zip: formData.address_warehouse.zip.trim(),
          province: toTitleCase(formData.address_warehouse.province.trim()),
          country: formData.address_warehouse.country.trim(),
        },
        phone: formData.phone.trim() || undefined,
        email_contact: formData.email_contact.trim() || undefined,
        default_vat: formData.default_vat,
        default_currency: formData.default_currency,
        logo_url: formData.logo_url.trim() || undefined,
      };

      await updateCompanySettings(updates);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error al guardar datos fiscales:", error);
      setErrors({ submit: "Error al guardar los datos. Por favor, inténtalo de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "var(--spacing-xl)", textAlign: "center" }}>
        Cargando datos fiscales...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
      {/* Sección: Datos Básicos */}
      <div
        style={{
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Datos Básicos
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Razón Social{" "}
              <span style={{ color: "var(--accent-red-primary)" }}>*</span>
            </label>
            <input
              value={formData.fiscal_name}
              onChange={(e) => handleChange("fiscal_name", e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.fiscal_name
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors.fiscal_name && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.fiscal_name}
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
              Nombre Comercial
            </label>
            <input
              value={formData.trade_name}
              onChange={(e) => handleChange("trade_name", e.target.value)}
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
              CIF/NIF{" "}
              <span style={{ color: "var(--accent-red-primary)" }}>*</span>
            </label>
            <input
              value={formData.cif}
              onChange={(e) => handleChange("cif", e.target.value.toUpperCase())}
              placeholder="B12345678"
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.cif
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                fontFamily: "monospace",
              }}
            />
            {errors.cif && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.cif}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sección: Dirección Fiscal */}
      <div
        style={{
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Dirección Fiscal
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Calle
            </label>
            <input
              value={formData.address_fiscal.street}
              onChange={(e) => handleChange("address_fiscal.street", e.target.value)}
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
              Código Postal
            </label>
            <input
              value={formData.address_fiscal.zip}
              onChange={(e) => handleChange("address_fiscal.zip", e.target.value)}
              maxLength={5}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors["address_fiscal.zip"]
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors["address_fiscal.zip"] && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors["address_fiscal.zip"]}
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
              Ciudad
            </label>
            <input
              value={formData.address_fiscal.city}
              onChange={(e) => handleChange("address_fiscal.city", e.target.value)}
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
              Provincia
            </label>
            <select
              value={formData.address_fiscal.province}
              onChange={(e) => handleChange("address_fiscal.province", e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                backgroundColor: "var(--background)",
              }}
            >
              <option value="">Seleccionar...</option>
              {SPANISH_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección: Dirección de Almacén */}
      <div
        style={{
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Dirección de Almacén
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Calle
            </label>
            <input
              value={formData.address_warehouse.street}
              onChange={(e) => handleChange("address_warehouse.street", e.target.value)}
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
              Código Postal
            </label>
            <input
              value={formData.address_warehouse.zip}
              onChange={(e) => handleChange("address_warehouse.zip", e.target.value)}
              maxLength={5}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors["address_warehouse.zip"]
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors["address_warehouse.zip"] && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors["address_warehouse.zip"]}
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
              Ciudad
            </label>
            <input
              value={formData.address_warehouse.city}
              onChange={(e) => handleChange("address_warehouse.city", e.target.value)}
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
              Provincia
            </label>
            <select
              value={formData.address_warehouse.province}
              onChange={(e) => handleChange("address_warehouse.province", e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                backgroundColor: "var(--background)",
              }}
            >
              <option value="">Seleccionar...</option>
              {SPANISH_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección: Datos de Contacto */}
      <div
        style={{
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Datos de Contacto
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              Teléfono
            </label>
            <input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+34 123 456 789"
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
              Email de Contacto
            </label>
            <input
              type="email"
              value={formData.email_contact}
              onChange={(e) => handleChange("email_contact", e.target.value)}
              placeholder="info@empresa.com"
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.email_contact
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors.email_contact && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.email_contact}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sección: Información Adicional */}
      <div
        style={{
          padding: "var(--spacing-lg)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
        }}
      >
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Información Adicional
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-md)" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              IVA por Defecto (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={formData.default_vat}
              onChange={(e) => handleChange("default_vat", parseFloat(e.target.value) || 0)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.default_vat
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors.default_vat && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.default_vat}
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
              Moneda por Defecto
            </label>
            <select
              value={formData.default_currency}
              onChange={(e) => handleChange("default_currency", e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                backgroundColor: "var(--background)",
              }}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
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
              URL del Logo
            </label>
            <input
              value={formData.logo_url}
              onChange={(e) => handleChange("logo_url", e.target.value)}
              placeholder="/logos/company-logo.png"
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
      </div>

      {/* Mensajes de error y éxito */}
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

      {saveSuccess && (
        <div
          style={{
            padding: "var(--spacing-md)",
            backgroundColor: "rgba(0, 200, 117, 0.1)",
            color: "rgb(0, 200, 117)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          Datos guardados correctamente
        </div>
      )}

      {/* Botón de guardar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)" }}>
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
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-xs)",
          }}
        >
          <IconWrapper icon={Save} size={16} />
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}

