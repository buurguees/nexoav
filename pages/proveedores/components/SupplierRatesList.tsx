"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import {
  fetchSupplierRates,
  deleteSupplierRate,
  fetchInventoryItemById,
  SupplierRateData,
  InventoryItemData,
} from "../../../lib/mocks/supplierRateMocks";
import { NewSupplierRateModal } from "./NewSupplierRateModal";
import { EditSupplierRateModal } from "./EditSupplierRateModal";

interface SupplierRatesListProps {
  supplierId: string;
}

export function SupplierRatesList({ supplierId }: SupplierRatesListProps) {
  const [rates, setRates] = useState<SupplierRateData[]>([]);
  const [services, setServices] = useState<Record<string, InventoryItemData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<SupplierRateData | null>(null);

  const loadRates = async () => {
    setIsLoading(true);
    try {
      const allRates = await fetchSupplierRates(supplierId);
      setRates(allRates);

      // Cargar servicios vinculados
      const servicesMap: Record<string, InventoryItemData> = {};
      for (const rate of allRates) {
        if (!servicesMap[rate.inventory_item_id]) {
          const service = await fetchInventoryItemById(rate.inventory_item_id);
          if (service) {
            servicesMap[rate.inventory_item_id] = service;
          }
        }
      }
      setServices(servicesMap);
    } catch (error) {
      console.error("Error al cargar tarifas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, [supplierId]);

  const handleDelete = async (rateId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta tarifa?")) return;

    try {
      await deleteSupplierRate(rateId);
      await loadRates();
    } catch (error) {
      console.error("Error al eliminar tarifa:", error);
      alert("Error al eliminar la tarifa");
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  if (isLoading) {
    return (
      <div style={{ padding: "var(--spacing-md)", textAlign: "center" }}>
        Cargando tarifas...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-semibold)",
              margin: 0,
            }}
          >
            Tarifas
          </h3>
          <button
            onClick={() => setIsNewModalOpen(true)}
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            <IconWrapper icon={Plus} size={16} />
            Nueva Tarifa
          </button>
        </div>

        {rates.length === 0 ? (
          <div
            style={{
              padding: "var(--spacing-xl)",
              textAlign: "center",
              color: "var(--foreground-secondary)",
            }}
          >
            No hay tarifas. Añade una nueva tarifa para comenzar.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
            }}
          >
            {rates.map((rate) => {
              const service = services[rate.inventory_item_id];
              const margin = service ? service.base_price - rate.cost_price : null;

              return (
                <div
                  key={rate.id}
                  style={{
                    padding: "var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-medium)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                        <h4
                          style={{
                            fontSize: "var(--font-size-base)",
                            fontWeight: "var(--font-weight-semibold)",
                            margin: 0,
                          }}
                        >
                          {service?.name || "Servicio no encontrado"}
                        </h4>
                        {!rate.is_active && (
                          <span
                            style={{
                              fontSize: "var(--font-size-xs)",
                              padding: "2px 8px",
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: "rgba(128, 128, 128, 0.1)",
                              color: "rgb(128, 128, 128)",
                            }}
                          >
                            Inactiva
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "var(--font-size-xs)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--background-secondary)",
                            color: "var(--foreground-secondary)",
                          }}
                        >
                          {rate.year}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "var(--spacing-md)",
                          marginTop: "var(--spacing-sm)",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: "var(--font-size-xs)",
                              color: "var(--foreground-tertiary)",
                            }}
                          >
                            Tipo:
                          </span>
                          <div style={{ fontSize: "var(--font-size-sm)" }}>{rate.service_type}</div>
                        </div>
                        <div>
                          <span
                            style={{
                              fontSize: "var(--font-size-xs)",
                              color: "var(--foreground-tertiary)",
                            }}
                          >
                            Coste:
                          </span>
                          <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                            {formatCurrency(rate.cost_price)}
                          </div>
                        </div>
                        {service && (
                          <>
                            <div>
                              <span
                                style={{
                                  fontSize: "var(--font-size-xs)",
                                  color: "var(--foreground-tertiary)",
                                }}
                              >
                                Precio venta:
                              </span>
                              <div style={{ fontSize: "var(--font-size-sm)", fontWeight: "var(--font-weight-medium)" }}>
                                {formatCurrency(service.base_price)}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "var(--font-size-xs)",
                                  color: "var(--foreground-tertiary)",
                                }}
                              >
                                Margen:
                              </span>
                              <div
                                style={{
                                  fontSize: "var(--font-size-sm)",
                                  fontWeight: "var(--font-weight-medium)",
                                  color: margin && margin > 0 ? "rgb(0, 200, 117)" : "var(--error)",
                                }}
                              >
                                {margin !== null ? formatCurrency(margin) : "-"}
                              </div>
                            </div>
                          </>
                        )}
                        <div>
                          <span
                            style={{
                              fontSize: "var(--font-size-xs)",
                              color: "var(--foreground-tertiary)",
                            }}
                          >
                            Unidad:
                          </span>
                          <div style={{ fontSize: "var(--font-size-sm)" }}>{rate.unit}</div>
                        </div>
                      </div>
                      {rate.notes && (
                        <p
                          style={{
                            margin: "var(--spacing-xs) 0 0",
                            fontSize: "var(--font-size-xs)",
                            color: "var(--foreground-tertiary)",
                            fontStyle: "italic",
                          }}
                        >
                          {rate.notes}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                      <button
                        onClick={() => setEditingRate(rate)}
                        style={{
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-xs)",
                          fontSize: "var(--font-size-xs)",
                        }}
                      >
                        <IconWrapper icon={Edit2} size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(rate.id)}
                        style={{
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--error)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--spacing-xs)",
                          fontSize: "var(--font-size-xs)",
                        }}
                      >
                        <IconWrapper icon={Trash2} size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isNewModalOpen && (
        <NewSupplierRateModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          supplierId={supplierId}
          onSave={async () => {
            await loadRates();
            setIsNewModalOpen(false);
          }}
        />
      )}

      {editingRate && (
        <EditSupplierRateModal
          isOpen={!!editingRate}
          onClose={() => setEditingRate(null)}
          rate={editingRate}
          onSave={async () => {
            await loadRates();
            setEditingRate(null);
          }}
        />
      )}
    </>
  );
}

