"use client";

import { useState, useEffect } from "react";
import { ServiciosList } from "../../components/ServiciosList";
import { fetchServices } from "../../../../lib/mocks/inventoryMocks";
import { InventoryItemData } from "../../../../lib/mocks/inventoryMocks";

/**
 * Página de Servicios - Versión Desktop (> 1024px)
 * Layout: Listado completo con filtros y herramientas
 */


export function ServiciosDesktop() {
  const [services, setServices] = useState<InventoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      }}
    >
      <ServiciosList
        services={services}
        showFilters={true}
        showTools={true}
        onServiceClick={(service) => {
          // TODO: Navegar a detalle del servicio
          console.log("Servicio clickeado:", service);
        }}
      />
    </div>
  );
}
