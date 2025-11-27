"use client";

import { useState, useEffect } from "react";
import { PedidosList } from "../../gastos/pedidos/components/PedidosList";
import {
  fetchPurchaseOrders,
  PurchaseOrderData,
} from "../../../lib/mocks/purchaseOrdersMocks";
// TODO: Crear expenseMocks.ts con fetchExpenses
// Por ahora, importar datos directamente
import expensesData from "../../../data/expenses/expenses.json";

export interface ProyectoEconomicoTabProps {
  projectId: string;
}

// Tipo para gastos (necesario para la lista)
interface ExpenseData {
  id: string;
  supplier_id?: string;
  project_id: string;
  purchase_order_id?: string;
  description: string;
  amount_total: number;
  status: string;
  date_expense: string;
  created_at: string;
  updated_at: string;
}

/**
 * Pestaña "Económico" en el detalle de proyecto
 * Muestra resumen económico (previsión vs. real) y listas de pedidos y gastos
 */
export function ProyectoEconomicoTab({
  projectId,
}: ProyectoEconomicoTabProps) {
  const [pedidos, setPedidos] = useState<PurchaseOrderData[]>([]);
  const [gastos, setGastos] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calcular resumen económico
  const prevision = pedidos
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.estimated_amount, 0);
  const real = gastos.reduce((sum, g) => sum + g.amount_total, 0);
  const desvio = real - prevision;
  const desvioPorcentaje = prevision > 0 ? (desvio / prevision) * 100 : 0;

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Cargar pedidos del proyecto
        const pedidosData = await fetchPurchaseOrders(projectId);
        setPedidos(pedidosData);

        // Cargar gastos del proyecto
        // Filtrar gastos del proyecto desde datos mock
        const gastosData = (expensesData as any[]).filter(
          (exp) => exp.project_id === projectId
        );
        setGastos(gastosData);
      } catch (error) {
        console.error("Error al cargar datos económicos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--spacing-xl)",
          color: "var(--foreground-secondary)",
        }}
      >
        Cargando datos económicos...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
        padding: "var(--spacing-lg)",
      }}
    >
      {/* Resumen Económico */}
      <div
        style={{
          backgroundColor: "var(--background-secondary)",
          borderRadius: "var(--radius-md)",
          padding: "var(--spacing-lg)",
          border: "1px solid var(--border-light)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "var(--spacing-md)",
            color: "var(--foreground)",
          }}
        >
          Resumen Económico
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--spacing-md)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--foreground-secondary)",
                marginBottom: "4px",
              }}
            >
              Previsto
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              {formatCurrency(prevision)}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--foreground-secondary)",
                marginBottom: "4px",
              }}
            >
              Real
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              {formatCurrency(real)}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--foreground-secondary)",
                marginBottom: "4px",
              }}
            >
              Desvío
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color:
                  desvio >= 0
                    ? "var(--color-error)"
                    : "var(--color-success)",
              }}
            >
              {desvio >= 0 ? "+" : ""}
              {formatCurrency(desvio)} (
              {desvioPorcentaje >= 0 ? "+" : ""}
              {desvioPorcentaje.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "var(--spacing-md)",
            color: "var(--foreground)",
          }}
        >
          Pedidos de Compra
        </h3>
        <PedidosList
          pedidos={pedidos}
          showFilters={false}
          showTools={true}
          projectId={projectId}
        />
      </div>

      {/* Lista de Gastos */}
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "var(--spacing-md)",
            color: "var(--foreground)",
          }}
        >
          Gastos del Proyecto
        </h3>
        <div
          style={{
            backgroundColor: "var(--background-secondary)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-md)",
          }}
        >
          {gastos.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "var(--spacing-lg)",
                color: "var(--foreground-secondary)",
              }}
            >
              No hay gastos registrados para este proyecto
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {gastos.map((gasto) => (
                <div
                  key={gasto.id}
                  style={{
                    padding: "var(--spacing-sm)",
                    backgroundColor: "var(--background)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-light)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                      {gasto.description}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--foreground-secondary)",
                      }}
                    >
                      {new Date(gasto.date_expense).toLocaleDateString("es-ES")}
                      {gasto.purchase_order_id && (
                        <span style={{ marginLeft: "8px" }}>
                          (Vinculado a pedido)
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {formatCurrency(gasto.amount_total)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

