"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { updateCompanyBank, CompanyBankData } from "../../../../lib/mocks/companyMocks";

interface EditBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: CompanyBankData;
  onSave: (bank: CompanyBankData) => Promise<void>;
}

// Función para validar IBAN
function validateIBAN(iban: string): boolean {
  if (!iban) return false;
  const cleaned = iban.replace(/\s/g, "");
  const ibanRegex = /^[A-Z]{2}\d{22}$/;
  return ibanRegex.test(cleaned);
}

// Función para formatear IBAN
function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  if (cleaned.length <= 2) return cleaned;
  const country = cleaned.substring(0, 2);
  const rest = cleaned.substring(2);
  return `${country} ${rest.match(/.{1,4}/g)?.join(" ") || rest}`;
}

export function EditBankAccountModal({ isOpen, onClose, bank, onSave }: EditBankAccountModalProps) {
  const [formData, setFormData] = useState({
    bank_name: bank.bank_name,
    iban: formatIBAN(bank.iban),
    swift_bic: bank.swift_bic || "",
    is_visible_on_invoices: bank.is_visible_on_invoices,
    is_default: bank.is_default,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && bank) {
      setFormData({
        bank_name: bank.bank_name,
        iban: formatIBAN(bank.iban),
        swift_bic: bank.swift_bic || "",
        is_visible_on_invoices: bank.is_visible_on_invoices,
        is_default: bank.is_default,
      });
      setErrors({});
    }
  }, [isOpen, bank]);

  const handleChange = (field: string, value: any) => {
    if (field === "iban") {
      const formatted = formatIBAN(value);
      setFormData((prev) => ({ ...prev, [field]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

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

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "El nombre del banco es obligatorio";
    }

    if (!formData.iban.trim()) {
      newErrors.iban = "El IBAN es obligatorio";
    } else if (!validateIBAN(formData.iban)) {
      newErrors.iban = "Formato de IBAN inválido";
    }

    if (formData.swift_bic && formData.swift_bic.length !== 8 && formData.swift_bic.length !== 11) {
      newErrors.swift_bic = "El código SWIFT/BIC debe tener 8 u 11 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateCompanyBank(bank.id, {
        bank_name: formData.bank_name.trim(),
        iban: formData.iban.replace(/\s/g, "").toUpperCase(),
        swift_bic: formData.swift_bic.trim().toUpperCase() || undefined,
        is_visible_on_invoices: formData.is_visible_on_invoices,
        is_default: formData.is_default,
      });
      await onSave(updated);
      onClose();
    } catch (error) {
      console.error("Error al actualizar cuenta bancaria:", error);
      setErrors({
        submit: "Error al actualizar la cuenta bancaria. Por favor, inténtalo de nuevo.",
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
              Editar Cuenta Bancaria
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
              }}
            >
              Actualizar información de la cuenta bancaria
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
              Nombre del Banco{" "}
              <span style={{ color: "var(--accent-red-primary)" }}>*</span>
            </label>
            <input
              value={formData.bank_name}
              onChange={(e) => handleChange("bank_name", e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.bank_name
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
              }}
            />
            {errors.bank_name && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.bank_name}
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
              IBAN{" "}
              <span style={{ color: "var(--accent-red-primary)" }}>*</span>
            </label>
            <input
              value={formData.iban}
              onChange={(e) => handleChange("iban", e.target.value)}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.iban
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                fontFamily: "monospace",
              }}
            />
            {errors.iban && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.iban}
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
              Código SWIFT/BIC (opcional)
            </label>
            <input
              value={formData.swift_bic}
              onChange={(e) => handleChange("swift_bic", e.target.value.toUpperCase())}
              maxLength={11}
              style={{
                width: "100%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: errors.swift_bic
                  ? "1px solid var(--accent-red-primary)"
                  : "1px solid var(--border-medium)",
                fontSize: "var(--font-size-sm)",
                fontFamily: "monospace",
              }}
            />
            {errors.swift_bic && (
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  fontSize: "var(--font-size-xs)",
                  color: "var(--accent-red-primary)",
                }}
              >
                {errors.swift_bic}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
            }}
          >
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
                checked={formData.is_visible_on_invoices}
                onChange={(e) => handleChange("is_visible_on_invoices", e.target.checked)}
                style={{ accentColor: "var(--primary)" }}
              />
              <span>Visible en facturas</span>
            </label>

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
                checked={formData.is_default}
                onChange={(e) => handleChange("is_default", e.target.checked)}
                style={{ accentColor: "var(--primary)" }}
              />
              <span>Cuenta por defecto</span>
            </label>
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

