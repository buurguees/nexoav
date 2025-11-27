"use client";

import { useState } from "react";
import { DataList, DataListColumn } from "../../../../components/list";
import { useMemo } from "react";
import { useBreakpoint } from "../../../../hooks/useBreakpoint";
import { ExpenseData } from "../../../../lib/mocks/expenseMocks";
import { NewGastoModal } from "./NewGastoModal";
import { GastoDetail } from "./GastoDetail";

export interface TicketsListProps {
  expenses: ExpenseData[];
  showFilters?: boolean;
  showTools?: boolean;
  onExpenseClick?: (expense: ExpenseData) => void;
  onExpenseCreated?: () => void;
  onExpenseUpdated?: () => void;
  onExpenseDeleted?: () => void;
  projectId?: string; // Filtro opcional por proyecto
}

export function TicketsList({
  expenses,
  showFilters = true,
  showTools = true,
  onExpenseClick,
  onExpenseCreated,
  onExpenseUpdated,
  onExpenseDeleted,
  projectId,
}: TicketsListProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const breakpoint = useBreakpoint();

  // Definir columnas según breakpoint
  const columns: DataListColumn<ExpenseData>[] = useMemo(() => {
    const baseColumns: DataListColumn<ExpenseData>[] = [
      {
        key: "date_expense",
        label: "Fecha",
        render: (item) =>
          new Date(item.date_expense).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
      },
      {
        key: "description",
        label: "Concepto",
        render: (item) => (
          <span style={{ fontWeight: 500 }}>{item.description}</span>
        ),
      },
      {
        key: "supplier_name",
        label: "Proveedor",
        render: (item) => item.supplier_name || "-",
        hideOnMobile: true,
      },
      {
        key: "project_name",
        label: "Proyecto",
        render: (item) => item.project_name || "-",
        hideOnMobile: true,
      },
      {
        key: "amount_total",
        label: "Importe",
        align: "right",
        render: (item) =>
          new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
          }).format(item.amount_total),
      },
      {
        key: "status",
        label: "Estado",
        render: (item) => {
          const statusConfig = {
            pendiente_aprobacion: {
              label: "Pendiente",
              color: "var(--color-warning)",
            },
            aprobado: { label: "Aprobado", color: "var(--color-info)" },
            pagado: { label: "Pagado", color: "var(--color-success)" },
          };
          const config = statusConfig[item.status] || statusConfig.pendiente_aprobacion;
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
    ];

    return baseColumns;
  }, []);

  // Grid columns para responsive
  const expensesGridColumns = useMemo(() => {
    if (breakpoint === "mobile") {
      return "1fr";
    }
    if (breakpoint === "tablet-portrait") {
      return "repeat(2, 1fr)";
    }
    return "repeat(auto-fit, minmax(300px, 1fr))";
  }, [breakpoint]);

  const handleExpenseClick = (expense: ExpenseData) => {
    setSelectedExpenseId(expense.id);
    if (onExpenseClick) {
      onExpenseClick(expense);
    }
  };

  const handleNewClick = () => {
    setIsNewModalOpen(true);
  };

  const handleSave = async () => {
    if (onExpenseCreated) {
      onExpenseCreated();
    }
  };

  return (
    <>
      <DataList
        title="Gastos"
        data={expenses}
        columns={columns}
        showFilters={showFilters}
        showTools={showTools}
        onRowClick={(item) => handleExpenseClick(item)}
        emptyMessage="No hay gastos disponibles"
        customGridColumns={expensesGridColumns}
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
              + Nuevo Gasto
            </button>
          </div>
        )}
      />
      <NewGastoModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSave}
        defaultProjectId={projectId}
      />
      {selectedExpenseId && (
        <GastoDetail
          expenseId={selectedExpenseId}
          onClose={() => setSelectedExpenseId(null)}
          onUpdated={() => {
            if (onExpenseUpdated) onExpenseUpdated();
          }}
          onDeleted={() => {
            setSelectedExpenseId(null);
            if (onExpenseDeleted) onExpenseDeleted();
          }}
        />
      )}
    </>
  );
}

