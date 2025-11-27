"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Edit2 } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  InventoryItemData,
  fetchInventoryItemById,
} from "../../../../lib/mocks/inventoryMocks";
import { EditServicioModal } from "./EditServicioModal";

interface ServicioDetailProps {
  serviceId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export function ServicioDetail({ serviceId, onClose, onUpdated }: ServicioDetailProps) {
  const [service, setService] = useState<InventoryItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const item = await fetchInventoryItemById(serviceId);
        setService(item);
      } catch (e) {
        console.error("Error al cargar servicio:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [serviceId]);

  const formatCurrency = (value: number | undefined | null) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--background)",
          }}
        >
          Cargando servicio...
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const margin =
    service.base_price && service.cost_price
      ? ((service.base_price - service.cost_price) / service.cost_price) * 100
      : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1000,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(70vw, 100% - 2 * var(--spacing-lg))",
          maxHeight: "90vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 24px 48px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)",
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
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Servicio
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: service.is_active
                    ? "rgba(0, 200, 117, 0.1)"
                    : "rgba(128, 128, 128, 0.1)",
                  color: service.is_active
                    ? "rgb(0, 200, 117)"
                    : "rgb(128, 128, 128)",
                }}
              >
                {service.is_active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "var(--font-size-2xl)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              {service.name}
            </h2>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
                fontFamily: "monospace",
              }}
            >
              {service.internal_code}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              onClick={() => setIsEditOpen(true)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <IconWrapper icon={Edit2} size={16} />
              Editar
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--foreground-tertiary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconWrapper icon={X} size={20} />
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "var(--spacing-lg)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--spacing-xl)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Información General
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                  <div>
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--foreground-tertiary)",
                      }}
                    >
                      Categoría
                    </span>
                    <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)" }}>
                      {service.category_name || "Sin categoría"}
                    </p>
                  </div>
                  {service.subtype && (
                    <div>
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--foreground-tertiary)",
                        }}
                      >
                        Subtipo
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)" }}>
                        {service.subtype}
                      </p>
                    </div>
                  )}
                  <div>
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--foreground-tertiary)",
                      }}
                    >
                      Unidad
                    </span>
                    <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)" }}>
                      {service.unit}
                    </p>
                  </div>
                  {service.description && (
                    <div>
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          color: "var(--foreground-tertiary)",
                        }}
                      >
                        Descripción
                      </span>
                      <p style={{ margin: "4px 0 0", fontSize: "var(--font-size-sm)", whiteSpace: "pre-wrap" }}>
                        {service.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Precios y Costes
                </h3>
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-medium)",
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.02), rgba(56,189,248,0.02))",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-sm)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                      Precio Base:
                    </span>
                    <span style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                      {formatCurrency(service.base_price)}
                    </span>
                  </div>
                  {service.cost_price > 0 && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                          Coste:
                        </span>
                        <span style={{ fontSize: "var(--font-size-base)" }}>
                          {formatCurrency(service.cost_price)}
                        </span>
                      </div>
                      {margin !== null && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                            Margen:
                          </span>
                          <span
                            style={{
                              fontSize: "var(--font-size-base)",
                              fontWeight: "var(--font-weight-semibold)",
                              color: margin > 0 ? "var(--success)" : "var(--error)",
                            }}
                          >
                            {margin.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-base)",
                    fontWeight: "var(--font-weight-semibold)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Estadísticas
                </h3>
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
                  {service.units_sold !== undefined && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                        Unidades Vendidas:
                      </span>
                      <span style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-medium)" }}>
                        {service.units_sold}
                      </span>
                    </div>
                  )}
                  {service.total_billing !== undefined && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "var(--font-size-sm)", color: "var(--foreground-secondary)" }}>
                        Total Facturado:
                      </span>
                      <span style={{ fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)" }}>
                        {formatCurrency(service.total_billing)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {isEditOpen && service && (
        <EditServicioModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          service={service}
          onUpdated={async (updated) => {
            setService(updated);
            setIsEditOpen(false);
            onUpdated();
          }}
        />
      )}
    </>
  );
}

