"use client";

import { useState, useEffect } from "react";
import { ServiciosList } from "../../components/ServiciosList";
import { fetchServices, InventoryItemData } from "../../../../lib/mocks/inventoryMocks";
import { NewServicioModal } from "../components/NewServicioModal";
import { ServicioDetail } from "../components/ServicioDetail";

/**
 * Página de Servicios - Versión Desktop (> 1024px)
 * Layout: Listado completo con filtros y botón de nuevo servicio
 */

export function ServiciosDesktop() {
  const [services, setServices] = useState<InventoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "var(--spacing-sm)",
        gap: "var(--spacing-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-sm)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
          }}
        >
          Servicios
        </h1>
        <button
          type="button"
          onClick={() => setIsNewOpen(true)}
          style={{
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            border: "none",
            backgroundColor: "var(--accent-blue-primary)",
            color: "var(--background)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            cursor: "pointer",
          }}
        >
          + Nuevo servicio
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--foreground-secondary)",
            }}
          >
            Cargando servicios...
          </div>
        ) : (
          <ServiciosList
            services={services}
            showFilters={true}
            showTools={false}
            onServiceClick={(service) => setSelectedId(service.id)}
          />
        )}
      </div>

      <NewServicioModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onCreated={async () => {
          await loadServices();
        }}
      />

      {selectedId && (
        <ServicioDetail
          serviceId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={loadServices}
        />
      )}
    </div>
  );
}
