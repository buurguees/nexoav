"use client";

import { useState } from "react";
import { SalesDocumentData, convertToFactura } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";
import { NewProformaModal } from "./NewProformaModal";
import { ProformaDetail } from "./ProformaDetail";
import { fetchSalesDocumentLines, createSalesDocumentLine } from "../../../../lib/mocks/salesDocumentLinesMocks";

export interface ProformasListProps {
  proformas: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onProformaClick?: (proforma: SalesDocumentData) => void;
  onProformaCreated?: () => void;
  onProformaUpdated?: () => void;
  onProformaDeleted?: () => void;
}

export function ProformasList({
  proformas,
  showFilters = true,
  showTools = true,
  onProformaClick,
  onProformaCreated,
  onProformaUpdated,
  onProformaDeleted,
}: ProformasListProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedProformaId, setSelectedProformaId] = useState<string | null>(null);

  const labels: SalesDocumentsListProps["labels"] = {
    title: "Proformas",
    searchPlaceholder: "Buscar proforma...",
    newButtonLabel: "+ Nueva Proforma",
    emptyMessage: "No hay proformas disponibles",
    documentSingular: "proforma",
  };

  const handleClick = (doc: SalesDocumentData) => {
    setSelectedProformaId(doc.id);
    if (onProformaClick) onProformaClick(doc);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleSave = async () => {
    if (onProformaCreated) onProformaCreated();
  };

  return (
    <>
      <SalesDocumentsList
        documents={proformas}
        showFilters={showFilters}
        showTools={showTools}
        onDocumentClick={handleClick}
        onNewClick={handleNewClick}
        labels={labels}
      />
      <NewProformaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSave}
      />
      {selectedProformaId && (
        <ProformaDetail
          proformaId={selectedProformaId}
          onClose={() => setSelectedProformaId(null)}
          onUpdated={() => {
            if (onProformaUpdated) onProformaUpdated();
          }}
          onDeleted={() => {
            setSelectedProformaId(null);
            if (onProformaDeleted) onProformaDeleted();
          }}
          onConvertToFactura={async (proformaId) => {
            try {
              const lines = await fetchSalesDocumentLines(proformaId);
              const factura = await convertToFactura(proformaId);

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                await createSalesDocumentLine({
                  document_id: factura.id,
                  item_id: line.item_id || null,
                  concept: line.concept,
                  description: line.description,
                  quantity: line.quantity,
                  unit_price: line.unit_price,
                  discount_percent: line.discount_percent,
                  tax_percent: line.tax_percent,
                  grouping_tag: line.grouping_tag,
                  line_order: i + 1,
                });
              }

              if (onProformaUpdated) onProformaUpdated();
            } catch (error) {
              console.error("Error al convertir proforma a factura:", error);
            }
          }}
        />
      )}
    </>
  );
}


