"use client";

import { useEffect, useState } from "react";
import { ProformasList } from "../components/ProformasList";
import { fetchProformas, SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";

export function ProformasTabletHorizontal() {
  const [proformas, setProformas] = useState<SalesDocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProformas() {
      try {
        setIsLoading(true);
        const data = await fetchProformas();
        setProformas(data);
      } catch (error) {
        console.error("Error al cargar proformas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProformas();
  }, []);

  const handleProformaClick = (proforma: SalesDocumentData) => {
    console.log("Proforma seleccionada:", proforma);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        padding: "var(--spacing-sm)",
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--foreground-secondary)",
          }}
        >
          Cargando proformas...
        </div>
      ) : (
        <ProformasList
          proformas={proformas}
          showFilters={true}
          showTools={true}
          onProformaClick={handleProformaClick}
        />
      )}
    </div>
  );
}

