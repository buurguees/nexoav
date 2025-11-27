"use client";

import { useState } from "react";
import { SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";
import { NewFacturaModal } from "./NewFacturaModal";
import { FacturaDetail } from "./FacturaDetail";

export interface FacturasListProps {
  facturas: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onFacturaClick?: (factura: SalesDocumentData) => void;
  onFacturaCreated?: () => void;
  onFacturaUpdated?: () => void;
  onFacturaDeleted?: () => void;
}

export function FacturasList({
  facturas,
  showFilters = true,
  showTools = true,
  onFacturaClick,
  onFacturaCreated,
  onFacturaUpdated,
  onFacturaDeleted,
}: FacturasListProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedFacturaId, setSelectedFacturaId] = useState<string | null>(null);

  const labels: SalesDocumentsListProps["labels"] = {
    title: "Facturas",
    searchPlaceholder: "Buscar factura...",
    newButtonLabel: "+ Nueva Factura",
    emptyMessage: "No hay facturas disponibles",
    documentSingular: "factura",
  };

  const handleClick = (factura: SalesDocumentData) => {
    setSelectedFacturaId(factura.id);
    if (onFacturaClick) onFacturaClick(factura);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleSave = async () => {
    if (onFacturaCreated) onFacturaCreated();
  };

  return (
    <>
      <SalesDocumentsList
        documents={facturas}
        showFilters={showFilters}
        showTools={showTools}
        onDocumentClick={handleClick}
        onNewClick={handleNewClick}
        labels={labels}
      />
      <NewFacturaModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSave}
      />
      {selectedFacturaId && (
        <FacturaDetail
          facturaId={selectedFacturaId}
          onClose={() => setSelectedFacturaId(null)}
          onUpdated={() => {
            if (onFacturaUpdated) onFacturaUpdated();
          }}
          onDeleted={() => {
            setSelectedFacturaId(null);
            if (onFacturaDeleted) onFacturaDeleted();
          }}
        />
      )}
    </>
  );
}

