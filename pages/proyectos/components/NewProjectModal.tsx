"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import { fetchActiveClients } from "../../../lib/mocks/clientMocks";
import { ClientData } from "../../clientes/components/ClientesList";

/**
 * Componente Modal para crear un nuevo proyecto
 * Basado en el schema de la tabla `projects` (docs/base-de-datos.md)
 * 
 * Campos automáticos (NO se implementan):
 * - id, internal_ref, created_at, updated_at
 * 
 * Campos obligatorios:
 * - client_id (debe seleccionarse un cliente)
 * - name (nombre del proyecto)
 * 
 * Campos opcionales:
 * - client_po_number (número de pedido del cliente)
 * - status (por defecto "borrador")
 * - location_name, location_address, start_date, end_date, description, budget_estimated
 */

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: any) => Promise<void>;
}

// Estados del proyecto según el schema
const PROJECT_STATUSES = [
  { value: "borrador", label: "Borrador" },
  { value: "presupuestado", label: "Presupuestado" },
  { value: "aceptado", label: "Aceptado" },
  { value: "ejecutando", label: "Ejecutando" },
  { value: "finalizado", label: "Finalizado" },
  { value: "cancelado", label: "Cancelado" },
];

// Lista de provincias españolas (para dirección de ubicación)
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

// Función para convertir a formato título (primera letra mayúscula, resto minúsculas)
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function NewProjectModal({ isOpen, onClose, onSave }: NewProjectModalProps) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Cliente (OBLIGATORIO)
    client_id: "",
    
    // Número de pedido del cliente (opcional)
    client_po_number: "",
    
    // Información del Proyecto
    name: "",
    status: "borrador" as const,
    description: "",
    budget_estimated: "",
    
    // Ubicación
    location_name: "",
    location_address: {
      street: "",
      city: "",
      zip: "",
      province: "",
      country: "España",
    },
    
    // Fechas
    start_date: "",
    end_date: "",
  });

  // Lista de clientes activos para el dropdown
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar clientes activos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const loadClients = async () => {
        try {
          setIsLoadingClients(true);
          const activeClients = await fetchActiveClients();
          setClients(activeClients);
        } catch (error) {
          console.error("Error al cargar clientes:", error);
        } finally {
          setIsLoadingClients(false);
        }
      };
      loadClients();
    }
  }, [isOpen]);

  // Resetear formulario al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        client_id: "",
        client_po_number: "",
        name: "",
        status: "borrador",
        description: "",
        budget_estimated: "",
        location_name: "",
        location_address: {
          street: "",
          city: "",
          zip: "",
          province: "",
          country: "España",
        },
        start_date: "",
        end_date: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  // Manejar cambios en los campos del formulario
  const handleChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
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

  // Validar formulario
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar cliente (obligatorio)
    if (!formData.client_id) {
      newErrors.client_id = "Debe seleccionar un cliente";
    }

    // Validar nombre (obligatorio)
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del proyecto es obligatorio";
    }

    // Validar presupuesto (si se rellena, debe ser numérico)
    if (formData.budget_estimated && isNaN(parseFloat(formData.budget_estimated))) {
      newErrors.budget_estimated = "El presupuesto debe ser un número válido";
    }

    // Validar código postal (si se rellena la dirección)
    if (formData.location_address.zip && !/^\d{5}$/.test(formData.location_address.zip)) {
      newErrors["location_address.zip"] = "El código postal debe tener 5 dígitos";
    }

    // Validar fechas
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end < start) {
        newErrors.end_date = "La fecha de fin no puede ser anterior a la fecha de inicio";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar (aplicar transformaciones)
      const projectData = {
        client_id: formData.client_id,
        client_po_number: formData.client_po_number || null,
        name: formData.name.trim(),
        status: formData.status,
        description: formData.description.trim() || null,
        budget_estimated: formData.budget_estimated
          ? parseFloat(formData.budget_estimated)
          : null,
        location_name: formData.location_name.trim() || null,
        location_address:
          formData.location_address.street ||
          formData.location_address.city ||
          formData.location_address.zip
            ? {
                street: toTitleCase(formData.location_address.street.trim()),
                city: toTitleCase(formData.location_address.city.trim()),
                zip: formData.location_address.zip.trim(),
                province: toTitleCase(formData.location_address.province.trim()),
                country: formData.location_address.country,
              }
            : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      await onSave(projectData);
      onClose();
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      setErrors({ submit: "Error al crear el proyecto. Por favor, inténtalo de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
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

          {/* Modal */}
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
                Nuevo Proyecto
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
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--foreground-secondary)";
                }}
              >
                <IconWrapper size={20}>
                  <X />
                </IconWrapper>
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: "auto" }}>
              <div style={{ padding: "var(--spacing-lg)" }}>
                {/* Cliente (OBLIGATORIO) */}
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                    }}
                  >
                    Cliente <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => handleChange("client_id", e.target.value)}
                    disabled={isLoadingClients}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      border: errors.client_id
                        ? "1px solid var(--color-error)"
                        : "1px solid var(--border-medium)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "var(--font-size-sm)",
                      cursor: isLoadingClients ? "not-allowed" : "pointer",
                    }}
                  >
                    <option value="">
                      {isLoadingClients ? "Cargando clientes..." : "Seleccione un cliente"}
                    </option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.commercial_name || client.fiscal_name}
                      </option>
                    ))}
                  </select>
                  {errors.client_id && (
                    <span
                      style={{
                        display: "block",
                        marginTop: "var(--spacing-xs)",
                        fontSize: "var(--font-size-xs)",
                        color: "var(--color-error)",
                      }}
                    >
                      {errors.client_id}
                    </span>
                  )}
                </div>

                {/* Número de Pedido del Cliente (OPCIONAL) */}
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                    }}
                  >
                    Número de Pedido del Cliente
                  </label>
                  <input
                    type="text"
                    value={formData.client_po_number}
                    onChange={(e) => handleChange("client_po_number", e.target.value)}
                    placeholder="PO-2025-001"
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      marginTop: "var(--spacing-xs)",
                      fontSize: "var(--font-size-xs)",
                      color: "var(--foreground-tertiary)",
                    }}
                  >
                    Número de pedido o referencia que el cliente proporciona
                  </span>
                </div>

                {/* Nombre del Proyecto (OBLIGATORIO) */}
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                    }}
                  >
                    Nombre del Proyecto <span style={{ color: "var(--color-error)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Instalación Monitores Cuenca"
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      border: errors.name
                        ? "1px solid var(--color-error)"
                        : "1px solid var(--border-medium)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "var(--font-size-sm)",
                    }}
                  />
                  {errors.name && (
                    <span
                      style={{
                        display: "block",
                        marginTop: "var(--spacing-xs)",
                        fontSize: "var(--font-size-xs)",
                        color: "var(--color-error)",
                      }}
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Estado y Presupuesto en la misma fila */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--spacing-md)",
                    marginBottom: "var(--spacing-lg)",
                  }}
                >
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
                      onChange={(e) =>
                        handleChange("status", e.target.value as typeof formData.status)
                      }
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                        cursor: "pointer",
                      }}
                    >
                      {PROJECT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Presupuesto Estimado */}
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
                      Presupuesto Estimado (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.budget_estimated}
                      onChange={(e) => handleChange("budget_estimated", e.target.value)}
                      placeholder="5000.00"
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        border: errors.budget_estimated
                          ? "1px solid var(--color-error)"
                          : "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                    />
                    {errors.budget_estimated && (
                      <span
                        style={{
                          display: "block",
                          marginTop: "var(--spacing-xs)",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--color-error)",
                        }}
                      >
                        {errors.budget_estimated}
                      </span>
                    )}
                  </div>
                </div>

                {/* Fechas */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "var(--spacing-md)",
                    marginBottom: "var(--spacing-lg)",
                  }}
                >
                  {/* Fecha de Inicio */}
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
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange("start_date", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                    />
                  </div>

                  {/* Fecha de Fin */}
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
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      min={formData.start_date || undefined}
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        border: errors.end_date
                          ? "1px solid var(--color-error)"
                          : "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                    />
                    {errors.end_date && (
                      <span
                        style={{
                          display: "block",
                          marginTop: "var(--spacing-xs)",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--color-error)",
                        }}
                      >
                        {errors.end_date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ubicación */}
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <h3
                    style={{
                      fontSize: "var(--font-size-md)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Ubicación del Proyecto
                  </h3>

                  {/* Nombre de la Ubicación */}
                  <div style={{ marginBottom: "var(--spacing-md)" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "var(--spacing-xs)",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        color: "var(--foreground)",
                      }}
                    >
                      Nombre de la Ubicación
                    </label>
                    <input
                      type="text"
                      value={formData.location_name}
                      onChange={(e) => handleChange("location_name", e.target.value)}
                      placeholder="Centro de Convenciones Cuenca"
                      style={{
                        width: "100%",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-medium)",
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        fontSize: "var(--font-size-sm)",
                      }}
                    />
                  </div>

                  {/* Dirección */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "var(--spacing-sm)",
                      marginBottom: "var(--spacing-sm)",
                    }}
                  >
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
                        Calle y Número
                      </label>
                      <input
                        type="text"
                        value={formData.location_address.street}
                        onChange={(e) => handleChange("location_address.street", e.target.value)}
                        placeholder="Calle Mayor 1"
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm)",
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
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={formData.location_address.zip}
                        onChange={(e) => handleChange("location_address.zip", e.target.value)}
                        placeholder="16001"
                        maxLength={5}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm)",
                          borderRadius: "var(--radius-md)",
                          border: errors["location_address.zip"]
                            ? "1px solid var(--color-error)"
                            : "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      />
                      {errors["location_address.zip"] && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "var(--spacing-xs)",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--color-error)",
                          }}
                        >
                          {errors["location_address.zip"]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "var(--spacing-sm)",
                    }}
                  >
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
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={formData.location_address.city}
                        onChange={(e) => handleChange("location_address.city", e.target.value)}
                        placeholder="Cuenca"
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm)",
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
                        Provincia
                      </label>
                      <select
                        value={formData.location_address.province}
                        onChange={(e) => handleChange("location_address.province", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          cursor: "pointer",
                        }}
                      >
                        <option value="">Seleccione provincia</option>
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
                          marginBottom: "var(--spacing-xs)",
                          fontSize: "var(--font-size-sm)",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground)",
                        }}
                      >
                        País
                      </label>
                      <input
                        type="text"
                        value={formData.location_address.country}
                        onChange={(e) => handleChange("location_address.country", e.target.value)}
                        placeholder="España"
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div style={{ marginBottom: "var(--spacing-lg)" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "var(--spacing-xs)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--foreground)",
                    }}
                  >
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Descripción detallada del proyecto..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      fontSize: "var(--font-size-sm)",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Error de envío */}
                {errors.submit && (
                  <div
                    style={{
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "rgba(220, 53, 69, 0.1)",
                      border: "1px solid var(--color-error)",
                      color: "var(--color-error)",
                      fontSize: "var(--font-size-sm)",
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
                  padding: "var(--spacing-lg)",
                  borderTop: "1px solid var(--border-medium)",
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
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    fontSize: "var(--font-size-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Proyecto"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

