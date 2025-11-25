"use client";

import { SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";

export interface FacturasListProps {
  facturas: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onFacturaClick?: (factura: SalesDocumentData) => void;
}

export function FacturasList({
  facturas,
  showFilters = true,
  showTools = true,
  onFacturaClick,
}: FacturasListProps) {
  const labels: SalesDocumentsListProps["labels"] = {
    title: "Facturas",
    searchPlaceholder: "Buscar factura...",
    newButtonLabel: "+ Nueva Factura",
    emptyMessage: "No hay facturas disponibles",
    documentSingular: "factura",
  };

  return (
    <SalesDocumentsList
      documents={facturas}
      showFilters={showFilters}
      showTools={showTools}
      onDocumentClick={onFacturaClick}
      labels={labels}
    />
  );
}

