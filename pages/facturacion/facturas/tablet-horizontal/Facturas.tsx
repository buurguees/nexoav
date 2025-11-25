"use client";

import { useEffect, useState } from "react";
import { FacturasList } from "../components/FacturasList";
import { fetchFacturas, SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";

export function FacturasTabletHorizontal() {
  const [facturas, setFacturas] = useState<SalesDocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFacturas() {
      try {
        setIsLoading(true);
        const data = await fetchFacturas();
        setFacturas(data);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacturas();
  }, []);

  const handleFacturaClick = (factura: SalesDocumentData) => {
    console.log("Factura seleccionada:", factura);
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
          Cargando facturas...
        </div>
      ) : (
        <FacturasList
          facturas={facturas}
          showFilters={true}
          showTools={true}
          onFacturaClick={handleFacturaClick}
        />
      )}
    </div>
  );
}

