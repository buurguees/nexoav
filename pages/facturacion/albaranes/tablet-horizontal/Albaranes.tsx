"use client";

import { useState, useEffect } from "react";
import { AlbaranesList } from "../components/AlbaranesList";
import { fetchDeliveryNotes } from "../../../../lib/mocks/deliveryNotesMocks";
import { DeliveryNoteData } from "../../../../lib/mocks/deliveryNotesMocks";

/**
 * Página de Albaranes - Versión Tablet Horizontal (1024px - 1280px)
 * Layout: Listado adaptado para tablet horizontal
 */

export function AlbaranesTabletHorizontal() {
  const [albaranes, setAlbaranes] = useState<DeliveryNoteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAlbaranes() {
      try {
        setIsLoading(true);
        const data = await fetchDeliveryNotes();
        setAlbaranes(data);
      } catch (error) {
        console.error("Error al cargar albaranes:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAlbaranes();
  }, []);

  const handleAlbaranClick = (albaran: DeliveryNoteData) => {
    console.log("Albarán seleccionado:", albaran);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-sm)",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
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
          Cargando albaranes...
        </div>
      ) : (
        <AlbaranesList
          albaranes={albaranes}
          showFilters={true}
          showTools={true}
          onAlbaranClick={handleAlbaranClick}
        />
      )}
    </div>
  );
}

