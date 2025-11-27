"use client";

import { DataList, DataListColumn } from "../../../../components/list";
import { useState, useMemo } from "react";
import { useBreakpoint } from "../../../../hooks/useBreakpoint";
import { PurchaseOrderData } from "../../../../lib/mocks/purchaseOrdersMocks";
import { NewPedidoModal } from "./NewPedidoModal";
import { PedidoDetail } from "./PedidoDetail";
import { LinkExpenseModal } from "./LinkExpenseModal";

export interface PedidosListProps {
  pedidos: PurchaseOrderData[];
  showFilters?: boolean;
  showTools?: boolean;
  onPedidoClick?: (pedido: PurchaseOrderData) => void;
  onPedidoCreated?: () => void;
  onPedidoUpdated?: () => void;
  onPedidoDeleted?: () => void;
  projectId?: string; // Filtro opcional por proyecto
}

export function PedidosList({
  pedidos,
  showFilters = true,
  showTools = true,
  onPedidoClick,
  onPedidoCreated,
  onPedidoUpdated,
  onPedidoDeleted,
  projectId,
}: PedidosListProps) {
  const breakpoint = useBreakpoint();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  const [linkExpenseForId, setLinkExpenseForId] = useState<string | null>(null);

  // Formatear moneda
  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Definir columnas según breakpoint
  const columns: DataListColumn<PurchaseOrderData>[] = useMemo(() => {
    const baseColumns: DataListColumn<PurchaseOrderData>[] = [
      {
        key: "document_number",
        label: "Número",
        sortable: true,
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (item) => (
          <span style={{ fontWeight: 500 }}>{item.document_number}</span>
        ),
      },
      {
        key: "project_name",
        label: "Proyecto",
        sortable: true,
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (item) => item.project_name || "Sin proyecto",
      },
      {
        key: "supplier_name",
        label: "Proveedor",
        sortable: true,
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (item) => item.supplier_name || "-",
      },
      {
        key: "description",
        label: "Descripción",
        sortable: true,
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (item) => (
          <span
            style={{
              display: "block",
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={item.description}
          >
            {item.description}
          </span>
        ),
      },
      {
        key: "estimated_amount",
        label: "Previsto",
        sortable: true,
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (item) => formatCurrency(item.estimated_amount),
      },
      {
        key: "status",
        label: "Estado",
        sortable: true,
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (item) => {
          const statusConfig = {
            pending: { label: "Pendiente", color: "var(--color-warning)" },
            fulfilled: { label: "Cumplido", color: "var(--color-success)" },
            cancelled: { label: "Cancelado", color: "var(--color-error)" },
          };
          const config = statusConfig[item.status] || statusConfig.pending;
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
        key: "expense_amount",
        label: "Real",
        sortable: true,
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (item) => formatCurrency(item.expense_amount),
      },
      {
        key: "deviation",
        label: "Desvío",
        sortable: true,
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (item) => {
          if (item.deviation === null || item.deviation === undefined) return "-";
          const isPositive = item.deviation >= 0;
          return (
            <span
              style={{
                color: isPositive ? "var(--color-error)" : "var(--color-success)",
                fontWeight: 500,
              }}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(item.deviation)}
            </span>
          );
        },
      },
    ];

    return baseColumns;
  }, []);

  // Grid columns optimizado para pedidos
  const pedidosGridColumns = useMemo(() => {
    const isDesktop = breakpoint === "desktop";
    const isTablet = breakpoint === "tablet"; // Tablet horizontal
    const isTabletPortrait = breakpoint === "tablet-portrait";
    
    // Contar columnas visibles
    const visibleCols = columns.filter((col) => {
      if (isDesktop || isTablet) return col.visibleOn?.desktop !== false;
      if (isTabletPortrait) return col.visibleOn?.tablet !== false;
      return col.visibleOn?.mobile !== false;
    });
    
    const count = visibleCols.length;
    
    // Orden: Número | Proyecto | Proveedor | Descripción | Previsto | Estado | Real | Desvío
    if (count >= 8) {
      // Desktop: 8 columnas (todas visibles)
      // Optimizado: Número compacto, Proyecto y Proveedor con espacio suficiente, Descripción amplia, montos alineados
      return "0.6fr 1.2fr 1.3fr 1.8fr 0.9fr 0.8fr 0.9fr 0.9fr";
    } else if (count === 7) {
      // Desktop/Tablet-horizontal: 7 columnas (sin Descripción)
      return "0.6fr 1.3fr 1.4fr 0.9fr 0.8fr 0.9fr 0.9fr";
    } else if (count === 6) {
      // Tablet: 6 columnas (sin Descripción ni Desvío)
      return "0.7fr 1.4fr 1.5fr 0.9fr 0.8fr 0.9fr";
    } else if (count === 5) {
      // Tablet portrait: 5 columnas (sin Descripción, Desvío, Real)
      return "0.8fr 1.5fr 1.6fr 0.9fr 0.8fr";
    } else if (count === 4) {
      // Tablet portrait: 4 columnas (sin Proyecto)
      return "0.8fr 1.8fr 0.9fr 0.8fr";
    } else {
      // Mobile: 3 columnas (Número | Previsto | Estado)
      return "1fr 1.2fr 1fr";
    }
  }, [breakpoint, columns]);

  const handleRowClick = (pedido: PurchaseOrderData) => {
    setSelectedPedidoId(pedido.id);
    if (onPedidoClick) onPedidoClick(pedido);
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  return (
    <>
      <DataList
        title="Pedidos de Compra"
        data={pedidos}
        columns={columns}
        searchPlaceholder="Buscar pedido..."
        showFilters={showFilters}
        showTools={showTools}
        newButtonLabel="+ Nuevo Pedido"
        emptyMessage="No hay pedidos de compra disponibles"
        onItemClick={handleRowClick}
        customGridColumns={pedidosGridColumns}
        filters={[
          {
            key: "status",
            label: "Estado",
            type: "select",
            options: [
              { value: "all", label: "Todos" },
              { value: "pending", label: "Pendiente" },
              { value: "fulfilled", label: "Cumplido" },
              { value: "cancelled", label: "Cancelado" },
            ],
          },
        ]}
        onNewClick={handleNewClick}
      />
      <NewPedidoModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={async () => {
          if (onPedidoCreated) onPedidoCreated();
        }}
        defaultProjectId={projectId}
      />
      {selectedPedidoId && (
        <PedidoDetail
          pedidoId={selectedPedidoId}
          onClose={() => setSelectedPedidoId(null)}
          onUpdated={() => {
            if (onPedidoUpdated) onPedidoUpdated();
          }}
          onDeleted={() => {
            setSelectedPedidoId(null);
            if (onPedidoDeleted) onPedidoDeleted();
          }}
          onLinkExpense={(pedidoId) => setLinkExpenseForId(pedidoId)}
        />
      )}
      {linkExpenseForId && (
        <LinkExpenseModal
          purchaseOrderId={linkExpenseForId}
          onClose={() => setLinkExpenseForId(null)}
          onLinked={() => {
            setLinkExpenseForId(null);
            if (onPedidoUpdated) onPedidoUpdated();
          }}
        />
      )}
    </>
  );
}

