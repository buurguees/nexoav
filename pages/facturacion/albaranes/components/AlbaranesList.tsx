"use client";

import { useState } from "react";
import { DataList, DataListColumn } from "../../../../components/list";
import { useMemo } from "react";
import { useBreakpoint } from "../../../../hooks/useBreakpoint";
import {
  DeliveryNoteData,
} from "../../../../lib/mocks/deliveryNotesMocks";
import { NewAlbaranModal } from "./NewAlbaranModal";
import { AlbaranDetail } from "./AlbaranDetail";

export interface AlbaranesListProps {
  albaranes: DeliveryNoteData[];
  showFilters?: boolean;
  showTools?: boolean;
  onAlbaranClick?: (albaran: DeliveryNoteData) => void;
  onAlbaranCreated?: () => void;
  onAlbaranUpdated?: () => void;
  projectId?: string; // Filtro opcional por proyecto
  defaultProjectId?: string; // Para pre-rellenar proyecto en nuevo albarán
}

export function AlbaranesList({
  albaranes,
  showFilters = true,
  showTools = true,
  onAlbaranClick,
  onAlbaranCreated,
  onAlbaranUpdated,
  projectId,
  defaultProjectId,
}: AlbaranesListProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedAlbaranId, setSelectedAlbaranId] = useState<string | null>(null);
  const breakpoint = useBreakpoint();

  // Definir columnas según breakpoint
  const columns: DataListColumn<DeliveryNoteData>[] = useMemo(() => {
    const baseColumns: DataListColumn<DeliveryNoteData>[] = [
      {
        key: "document_number",
        label: "Número",
        sortable: true,
        render: (item) => (
          <span style={{ fontWeight: 500 }}>{item.document_number}</span>
        ),
      },
      {
        key: "project_name",
        label: "Proyecto",
        sortable: true,
        render: (item) => item.project_name || "Sin proyecto",
      },
      {
        key: "client_name",
        label: "Cliente",
        sortable: true,
        render: (item) => item.client_name || "-",
        hideOnMobile: true,
      },
      {
        key: "type",
        label: "Tipo",
        sortable: true,
        render: (item) => (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              backgroundColor:
                item.type === "outbound"
                  ? "var(--color-info-light)"
                  : "var(--color-success-light)",
              color:
                item.type === "outbound"
                  ? "var(--color-info)"
                  : "var(--color-success)",
            }}
          >
            {item.type === "outbound" ? "Salida" : "Entrada"}
          </span>
        ),
      },
      {
        key: "status",
        label: "Estado",
        sortable: true,
        render: (item) => {
          const statusConfig = {
            draft: { label: "Borrador", color: "var(--color-warning)" },
            confirmed: { label: "Confirmado", color: "var(--color-success)" },
            cancelled: { label: "Cancelado", color: "var(--color-error)" },
          };
          const config = statusConfig[item.status] || statusConfig.draft;
          return (
            <span
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor: `${config.color}20`,
                color: config.color,
              }}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        key: "date_issued",
        label: "Fecha",
        sortable: true,
        render: (item) =>
          new Date(item.date_issued).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        hideOnMobile: true,
      },
      {
        key: "lines_count",
        label: "Ítems",
        sortable: true,
        align: "right",
        render: (item) => item.lines_count || 0,
        hideOnMobile: true,
      },
    ];

    return baseColumns;
  }, []);

  // Grid columns para responsive
  const albaranesGridColumns = useMemo(() => {
    if (breakpoint === "mobile") {
      return "1fr"; // Una columna en mobile
    }
    if (breakpoint === "tablet-portrait") {
      return "repeat(2, 1fr)"; // Dos columnas en tablet portrait
    }
    return "repeat(auto-fit, minmax(300px, 1fr))"; // Auto-fit en desktop/tablet
  }, [breakpoint]);

  const handleAlbaranClick = (albaran: DeliveryNoteData) => {
    setSelectedAlbaranId(albaran.id);
    if (onAlbaranClick) {
      onAlbaranClick(albaran);
    }
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleSave = async () => {
    if (onAlbaranCreated) {
      onAlbaranCreated();
    }
  };

  return (
    <>
      <DataList
        title="Albaranes"
        data={albaranes}
        columns={columns}
        showFilters={showFilters}
        showTools={showTools}
        onRowClick={(item) => handleAlbaranClick(item)}
        emptyMessage="No hay albaranes disponibles"
        customGridColumns={albaranesGridColumns}
        renderTools={() => (
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              onClick={handleNewClick}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                fontSize: "var(--font-size-sm)",
                fontWeight: "var(--font-weight-medium)",
                cursor: "pointer",
              }}
            >
              + Nuevo Albarán
            </button>
          </div>
        )}
      />
      <NewAlbaranModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSave}
        defaultProjectId={defaultProjectId}
      />
      {selectedAlbaranId && (
        <AlbaranDetail
          albaranId={selectedAlbaranId}
          onClose={() => setSelectedAlbaranId(null)}
          onUpdated={() => {
            if (onAlbaranUpdated) onAlbaranUpdated();
          }}
        />
      )}
    </>
  );
}

