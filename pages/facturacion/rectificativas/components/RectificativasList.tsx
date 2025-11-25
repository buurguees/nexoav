"use client";

import { SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";

export interface RectificativasListProps {
  rectificativas: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onRectificativaClick?: (rectificativa: SalesDocumentData) => void;
}

export function RectificativasList({
  rectificativas,
  showFilters = true,
  showTools = true,
  onRectificativaClick,
}: RectificativasListProps) {
  const labels: SalesDocumentsListProps["labels"] = {
    title: "Rectificativas",
    searchPlaceholder: "Buscar rectificativa...",
    newButtonLabel: "+ Nueva Rectificativa",
    emptyMessage: "No hay rectificativas disponibles",
    documentSingular: "rectificativa",
  };

  return (
    <SalesDocumentsList
      documents={rectificativas}
      showFilters={showFilters}
      showTools={showTools}
      onDocumentClick={onRectificativaClick}
      labels={labels}
    />
  );
}

