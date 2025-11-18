"use client";

import * as React from "react";
import { Client } from "../../../lib/types/client";

export interface ClientListProps {
  clients: Client[];
  onClientClick?: (client: Client) => void;
  onCreateClient?: () => void;
  className?: string;
}

/**
 * Listado de clientes para mobile
 * Versión compacta con información esencial en formato de tarjetas
 */
export function ClientList({
  clients,
  onClientClick,
  onCreateClient,
  className,
}: ClientListProps) {
  const getStatusColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "#22c55e"; // Verde
      case "inactive":
        return "#ef4444"; // Rojo
      case "prospect":
        return "var(--warning)";
      case "blocked":
        return "var(--error)";
      default:
        return "var(--foreground-secondary)";
    }
  };

  const getStatusBackgroundColor = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "#dcfce7"; // Verde pastel
      case "inactive":
        return "#fee2e2"; // Rojo pastel
      case "prospect":
        return "var(--warning)20";
      case "blocked":
        return "var(--error)20";
      default:
        return "var(--background-secondary)";
    }
  };

  const getStatusLabel = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "prospect":
        return "Prospecto";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "€0";
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalInvoicedWithVAT = (client: Client): number => {
    if (!client.total_invoiced) return 0;
    if (client.vat_exempt) return client.total_invoiced;
    let vatRate = 0;
    switch (client.vat_type) {
      case "general": vatRate = 0.21; break;
      case "reduced": vatRate = 0.10; break;
      case "super_reduced": vatRate = 0.04; break;
      case "exempt": return client.total_invoiced;
      default: vatRate = 0.21;
    }
    return client.total_invoiced * (1 + vatRate);
  };

  const calculateRealMargin = (client: Client): number | null => {
    const totalInvoicedWithVAT = calculateTotalInvoicedWithVAT(client);
    if (!client.total_costs || totalInvoicedWithVAT === 0) return null;
    const costsWithVAT = client.total_costs * 1.21;
    const netProfitWithVAT = totalInvoicedWithVAT - costsWithVAT;
    return (netProfitWithVAT / totalInvoicedWithVAT) * 100;
  };

  const formatMargin = (client: Client) => {
    const realMargin = calculateRealMargin(client);
    return realMargin !== null ? `${realMargin.toFixed(1)}%` : "-";
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-sm)",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--spacing-xs)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--foreground)",
          }}
        >
          Clientes ({clients.length})
        </h2>
        {onCreateClient && (
          <button
            onClick={onCreateClient}
            style={{
              padding: "6px var(--spacing-xs)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "var(--font-weight-medium)",
              transition: "all var(--transition-default)",
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-hover)";
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
            }}
          >
            + Nuevo
          </button>
        )}
      </div>

      {/* Lista */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xs)",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {clients.length === 0 ? (
          <div
            style={{
              padding: "var(--spacing-lg)",
              textAlign: "center",
              color: "var(--foreground-secondary)",
              fontSize: "14px",
            }}
          >
            No hay clientes disponibles
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              onClick={() => onClientClick?.(client)}
              style={{
                padding: "var(--spacing-md)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--background)",
                cursor: onClientClick ? "pointer" : "default",
                transition: "all var(--transition-default)",
              }}
              onTouchStart={(e) => {
                if (onClientClick) {
                  e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                }
              }}
              onTouchEnd={(e) => {
                if (onClientClick) {
                  e.currentTarget.style.backgroundColor = "var(--background)";
                }
              }}
            >
              {/* Línea principal: Nombre comercial y Total facturado */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "var(--spacing-sm)",
                }}
              >
                {/* Nombre comercial */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                  }}
                >
                  {client.commercial_name || client.name}
                </div>

                {/* Total facturado */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    flexShrink: 0,
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(calculateTotalInvoicedWithVAT(client))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
