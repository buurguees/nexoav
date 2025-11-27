"use client";

import { useState, useEffect } from "react";
import { TicketsList } from "../tickets/components/TicketsList";
import { fetchExpenses, ExpenseData } from "../../../lib/mocks/expenseMocks";

/**
 * Página de Gastos - Versión Desktop (> 1024px)
 */
export function GastosDesktop() {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        console.error("Error al cargar gastos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExpenses();
  }, []);

  const handleExpenseCreated = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error al recargar gastos:", error);
    }
  };

  const handleExpenseUpdated = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error al recargar gastos:", error);
    }
  };

  const handleExpenseDeleted = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error al recargar gastos:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ height: '100%', width: '100%', padding: 'var(--spacing-lg)' }}>
        <p style={{ color: 'var(--foreground-secondary)' }}>Cargando gastos...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', padding: 'var(--spacing-lg)' }}>
      <TicketsList
        expenses={expenses}
        onExpenseCreated={handleExpenseCreated}
        onExpenseUpdated={handleExpenseUpdated}
        onExpenseDeleted={handleExpenseDeleted}
      />
    </div>
  );
}

