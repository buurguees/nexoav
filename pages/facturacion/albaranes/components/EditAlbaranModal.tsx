"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchProjects, ProjectData } from "../../../../lib/mocks/projectMocks";
import { fetchDeliveryNoteById, updateDeliveryNote, DeliveryNoteData } from "../../../../lib/mocks/deliveryNotesMocks";
import { fetchDeliveryNoteLines, deleteDeliveryNoteLines, createDeliveryNoteLine } from "../../../../lib/mocks/deliveryNotesMocks";
import { AlbaranLinesEditor, AlbaranLine } from "./AlbaranLinesEditor";

interface EditAlbaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  albaranId: string;
  onSave: (albaran: DeliveryNoteData) => Promise<void>;
}

export function EditAlbaranModal({ isOpen, onClose, albaranId, onSave }: EditAlbaranModalProps) {
  const [albaran, setAlbaran] = useState<DeliveryNoteData | null>(null);
  const [formData, setFormData] = useState({
    project_id: "",
    client_id: "",
    type: "outbound" as "outbound" | "inbound",
    date_issued: "",
    notes: "",
  });
  const [lines, setLines] = useState<AlbaranLine[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar albarán y datos relacionados
  useEffect(() => {
    if (isOpen && albaranId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const doc = await fetchDeliveryNoteById(albaranId);
          if (!doc) {
            setErrors({ submit: "Albarán no encontrado" });
            return;
          }

          // Validar que solo se puede editar si está en draft
          if (doc.status !== "draft") {
            setErrors({ submit: "Solo se pueden editar albaranes en estado 'borrador'" });
            return;
          }

          setAlbaran(doc);
          setFormData({
            project_id: doc.project_id,
            client_id: doc.client_id || "",
            type: doc.type,
            date_issued: doc.date_issued,
            notes: doc.notes || "",
          });

          // Cargar líneas
          const documentLines = await fetchDeliveryNoteLines(albaranId);
          setLines(
            documentLines.map((line) => ({
              id: line.id,
              item_id: line.item_id,
              quantity: line.quantity,
              description: line.description,
              serial_number: line.serial_number || undefined,
              item_name: line.item_name,
              item_code: line.item_code || undefined,
            }))
          );

          // Cargar proyectos
          setIsLoadingProjects(true);
          const allProjects = await fetchProjects();
          setProjects(allProjects);
          setIsLoadingProjects(false);
        } catch (error) {
          console.error("Error al cargar albarán:", error);
          setErrors({ submit: "Error al cargar el albarán" });
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, albaranId]);

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setAlbaran(null);
      setFormData({
        project_id: "",
        client_id: "",
        type: "outbound",
        date_issued: "",
        notes: "",
      });
      setLines([]);
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

    if (!formData.project_id) {
      newErrors.project_id = "Debe seleccionar un proyecto";
    }

    if (lines.length === 0) {
      newErrors.lines = "Debe añadir al menos una línea";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!albaran || !validateForm()) return;

    setIsSubmitting(true);
    try {
      // Actualizar albarán
      const updated = await updateDeliveryNote(albaran.id, {
        project_id: formData.project_id,
        client_id: formData.client_id || null,
        type: formData.type,
        date_issued: formData.date_issued,
        notes: formData.notes || null,
      });

      if (!updated) {
        throw new Error("Error al actualizar el albarán");
      }

      // Eliminar líneas existentes y crear nuevas
      await deleteDeliveryNoteLines(albaran.id);
      for (const line of lines) {
        await createDeliveryNoteLine({
          delivery_note_id: albaran.id,
          item_id: line.item_id,
          quantity: line.quantity,
          description: line.description,
          serial_number: line.serial_number || null,
        });
      }

      await onSave(updated);
      onClose();
    } catch (error) {
      console.error("Error al actualizar albarán:", error);
      setErrors({ submit: "Error al actualizar el albarán. Por favor, inténtalo de nuevo." });
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
              Cargando albarán...
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  if (errors.submit && !albaran) {
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

  // Reutilizar estructura de NewAlbaranModal pero con datos precargados
  return (
    <AnimatePresence>
      {isOpen && albaran && (
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
              maxWidth: "1000px",
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
                Editar Albarán {albaran.document_number}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "var(--spacing-sm)",
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

            {/* Content - Misma estructura que NewAlbaranModal */}
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
                    Información del Albarán
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
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
                        Proyecto <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <select
                        value={formData.project_id}
                        onChange={(e) => handleChange("project_id", e.target.value)}
                        disabled={isLoadingProjects}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-sm) var(--spacing-md)",
                          borderRadius: "var(--radius-md)",
                          border: errors.project_id
                            ? "1px solid var(--accent-red-primary)"
                            : "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        <option value="">
                          {isLoadingProjects ? "Cargando proyectos..." : "Seleccione un proyecto"}
                        </option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name} {project.client_name ? `(${project.client_name})` : ""}
                          </option>
                        ))}
                      </select>
                      {errors.project_id && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "var(--spacing-xs)",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--accent-red-primary)",
                          }}
                        >
                          {errors.project_id}
                        </span>
                      )}
                    </div>

                    {/* Tipo */}
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
                        Tipo <span style={{ color: "var(--accent-red-primary)" }}>*</span>
                      </label>
                      <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-xs)",
                            cursor: "pointer",
                            fontSize: "var(--font-size-sm)",
                          }}
                        >
                          <input
                            type="radio"
                            name="type"
                            value="outbound"
                            checked={formData.type === "outbound"}
                            onChange={(e) => handleChange("type", e.target.value)}
                            style={{ cursor: "pointer" }}
                          />
                          Salida (Entrega)
                        </label>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-xs)",
                            cursor: "pointer",
                            fontSize: "var(--font-size-sm)",
                          }}
                        >
                          <input
                            type="radio"
                            name="type"
                            value="inbound"
                            checked={formData.type === "inbound"}
                            onChange={(e) => handleChange("type", e.target.value)}
                            style={{ cursor: "pointer" }}
                          />
                          Entrada (Retorno)
                        </label>
                      </div>
                    </div>

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
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={formData.date_issued}
                        onChange={(e) => handleChange("date_issued", e.target.value)}
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

                    {/* Observaciones */}
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
                        Observaciones
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
                        placeholder="Observaciones logísticas..."
                      />
                    </div>
                  </div>
                </div>

                {/* Líneas */}
                <div>
                  <AlbaranLinesEditor
                    lines={lines}
                    onChange={setLines}
                    type={formData.type}
                    projectId={formData.project_id}
                  />
                  {errors.lines && (
                    <span
                      style={{
                        display: "block",
                        marginTop: "var(--spacing-sm)",
                        fontSize: "var(--font-size-xs)",
                        color: "var(--accent-red-primary)",
                      }}
                    >
                      {errors.lines}
                    </span>
                  )}
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

