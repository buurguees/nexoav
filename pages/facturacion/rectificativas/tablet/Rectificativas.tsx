"use client";

import { useEffect, useState } from "react";
import { RectificativasList } from "../components/RectificativasList";
import { fetchRectificativas, SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";

export function RectificativasTablet() {
  const [rectificativas, setRectificativas] = useState<SalesDocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRectificativas() {
      try {
        setIsLoading(true);
        const data = await fetchRectificativas();
        setRectificativas(data);
      } catch (error) {
        console.error("Error al cargar rectificativas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRectificativas();
  }, []);

  const handleRectificativaClick = (rectificativa: SalesDocumentData) => {
    console.log("Rectificativa seleccionada:", rectificativa);
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
          Cargando rectificativas...
        </div>
      ) : (
        <RectificativasList
          rectificativas={rectificativas}
          showFilters={true}
          showTools={true}
          onRectificativaClick={handleRectificativaClick}
        />
      )}
    </div>
  );
}

