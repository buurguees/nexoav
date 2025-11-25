"use client";

import { SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";

export interface ProformasListProps {
  proformas: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onProformaClick?: (proforma: SalesDocumentData) => void;
}

export function ProformasList({
  proformas,
  showFilters = true,
  showTools = true,
  onProformaClick,
}: ProformasListProps) {
  const labels: SalesDocumentsListProps["labels"] = {
    title: "Proformas",
    searchPlaceholder: "Buscar proforma...",
    newButtonLabel: "+ Nueva Proforma",
    emptyMessage: "No hay proformas disponibles",
    documentSingular: "proforma",
  };

  return (
    <SalesDocumentsList
      documents={proformas}
      showFilters={showFilters}
      showTools={showTools}
      onDocumentClick={onProformaClick}
      labels={labels}
    />
  );
}

