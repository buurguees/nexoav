"use client";

import { SalesDocumentData } from "../../../../lib/mocks/salesDocumentsMocks";
import {
  SalesDocumentsList,
  SalesDocumentsListProps,
} from "../../components/SalesDocumentsList";

export interface PresupuestosListProps {
  presupuestos: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onPresupuestoClick?: (presupuesto: SalesDocumentData) => void;
}

export function PresupuestosList({
  presupuestos,
  showFilters = true,
  showTools = true,
  onPresupuestoClick,
}: PresupuestosListProps) {
  const labels: SalesDocumentsListProps["labels"] = {
    title: "Presupuestos",
    searchPlaceholder: "Buscar presupuesto...",
    newButtonLabel: "+ Nuevo Presupuesto",
    emptyMessage: "No hay presupuestos disponibles",
    documentSingular: "presupuesto",
  };

  return (
    <SalesDocumentsList
      documents={presupuestos}
      showFilters={showFilters}
      showTools={showTools}
      onDocumentClick={onPresupuestoClick}
      labels={labels}
    />
  );
}

