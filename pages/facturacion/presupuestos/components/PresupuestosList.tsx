"use client";

import { useState } from "react";
import { SalesDocumentData, convertPresupuestoToProforma, convertToFactura } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";
import { NewPresupuestoModal } from "./NewPresupuestoModal";
import { PresupuestoDetail } from "./PresupuestoDetail";
import { fetchSalesDocumentLines, createSalesDocumentLine } from "../../../../lib/mocks/salesDocumentLinesMocks";

export interface PresupuestosListProps {
  presupuestos: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onPresupuestoClick?: (presupuesto: SalesDocumentData) => void;
  onPresupuestoCreated?: () => void;
  onPresupuestoUpdated?: () => void;
  onPresupuestoDeleted?: () => void;
}

export function PresupuestosList({
  presupuestos,
  showFilters = true,
  showTools = true,
  onPresupuestoClick,
  onPresupuestoCreated,
  onPresupuestoUpdated,
  onPresupuestoDeleted,
}: PresupuestosListProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPresupuestoId, setSelectedPresupuestoId] = useState<string | null>(null);

  const labels: SalesDocumentsListProps["labels"] = {
    title: "Presupuestos",
    searchPlaceholder: "Buscar presupuesto...",
    newButtonLabel: "+ Nuevo Presupuesto",
    emptyMessage: "No hay presupuestos disponibles",
    documentSingular: "presupuesto",
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleSave = async () => {
    // El documento ya se guardó en el mock, solo recargar
    if (onPresupuestoCreated) {
      onPresupuestoCreated();
    }
  };

  const handlePresupuestoClick = (presupuesto: SalesDocumentData) => {
    setSelectedPresupuestoId(presupuesto.id);
    if (onPresupuestoClick) {
      onPresupuestoClick(presupuesto);
    }
  };

  return (
    <>
      <SalesDocumentsList
        documents={presupuestos}
        showFilters={showFilters}
        showTools={showTools}
        onDocumentClick={handlePresupuestoClick}
        onNewClick={handleNewClick}
        labels={labels}
      />
      <NewPresupuestoModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSave}
      />
      {selectedPresupuestoId && (
        <PresupuestoDetail
          presupuestoId={selectedPresupuestoId}
          onClose={() => setSelectedPresupuestoId(null)}
          onUpdated={() => {
            if (onPresupuestoUpdated) onPresupuestoUpdated();
          }}
          onDeleted={() => {
            setSelectedPresupuestoId(null);
            if (onPresupuestoDeleted) onPresupuestoDeleted();
          }}
          onConvertToProforma={async (presupuestoId) => {
            try {
              const lines = await fetchSalesDocumentLines(presupuestoId);
              const proforma = await convertPresupuestoToProforma(presupuestoId);

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                await createSalesDocumentLine({
                  document_id: proforma.id,
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

              if (onPresupuestoUpdated) onPresupuestoUpdated();
            } catch (error) {
              console.error("Error al convertir presupuesto a proforma:", error);
            }
          }}
          onConvertToFactura={async (presupuestoId) => {
            try {
              const lines = await fetchSalesDocumentLines(presupuestoId);
              const factura = await convertToFactura(presupuestoId);

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

              if (onPresupuestoUpdated) onPresupuestoUpdated();
            } catch (error) {
              console.error("Error al convertir presupuesto a factura:", error);
            }
          }}
        />
      )}
    </>
  );
}

