"use client";

import { useState } from "react";
import { SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";
import { RectificativaDetail } from "./RectificativaDetail";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const labels: SalesDocumentsListProps["labels"] = {
    title: "Rectificativas",
    searchPlaceholder: "Buscar rectificativa...",
    newButtonLabel: "", // No se puede crear manualmente, solo desde factura
    emptyMessage: "No hay rectificativas disponibles",
    documentSingular: "rectificativa",
  };

  const handleClick = (doc: SalesDocumentData) => {
    setSelectedId(doc.id);
    if (onRectificativaClick) onRectificativaClick(doc);
  };

  return (
    <>
      <SalesDocumentsList
        documents={rectificativas}
        showFilters={showFilters}
        showTools={showTools}
        onDocumentClick={handleClick}
        labels={labels}
      />
      {selectedId && (
        <RectificativaDetail
          rectificativaId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}

