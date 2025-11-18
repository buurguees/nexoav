"use client";

import { Client } from "../../../lib/types/client";

export interface ClientListProps {
  clients: Client[];
  onClientClick?: (client: Client) => void;
  onCreateClient?: () => void;
  className?: string;
}

/**
 * Listado de clientes para tablet horizontal
 * Muestra columnas: Número, Nombre, Estado, Proyectos Totales, Proyectos Activos, Total Facturado, Margen Limpio
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
    return realMargin !== null ? `${realMargin.toFixed(2)}%` : "-";
  };

  // Grid compartido para header y filas - responsive con porcentajes
  const gridTemplateColumns = "60px minmax(150px, 2fr) 85px 95px 95px 115px 95px";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-md)",
        height: "100%",
        width: "60%",
        maxWidth: "60%",
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
            fontSize: "22px",
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
              padding: "var(--spacing-xs) var(--spacing-md)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "var(--font-weight-medium)",
              transition: "all var(--transition-default)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
            }}
          >
            + Nuevo Cliente
          </button>
        )}
      </div>

      {/* Tabla */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          flex: 1,
        }}
      >
        {/* Header de la tabla */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns,
            gap: "clamp(10px, 2vw, 30px)",
            padding: "var(--spacing-xs) var(--spacing-sm)",
            borderBottom: "1px solid var(--border-medium)",
            backgroundColor: "var(--background-secondary)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "12px",
            color: "var(--foreground-secondary)",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>Número</div>
          <div style={{ textAlign: "left" }}>Nombre</div>
          <div style={{ textAlign: "center" }}>Estado</div>
          <div style={{ textAlign: "right" }}>Proy. Tot.</div>
          <div style={{ textAlign: "right" }}>Proy. Act.</div>
          <div style={{ textAlign: "right" }}>Facturado</div>
          <div style={{ textAlign: "right" }}>Margen</div>
        </div>

        {/* Cuerpo */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
          }}
        >
          {clients.length === 0 ? (
            <div
              style={{
                padding: "var(--spacing-xl)",
                textAlign: "center",
                color: "var(--foreground-secondary)",
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
                  display: "grid",
                  gridTemplateColumns,
                  gap: "clamp(10px, 2vw, 30px)",
                  padding: "var(--spacing-xs) var(--spacing-sm)",
                  borderBottom: "1px solid var(--border-medium)",
                  backgroundColor: "var(--background)",
                  cursor: onClientClick ? "pointer" : "default",
                  transition: "all var(--transition-default)",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  if (onClientClick) {
                    e.currentTarget.style.backgroundColor = "var(--background-tertiary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (onClientClick) {
                    e.currentTarget.style.backgroundColor = "var(--background)";
                  }
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    textAlign: "left",
                  }}
                >
                  {client.code}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                  }}
                >
                  {client.commercial_name || client.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "3px 6px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "transparent",
                      color: getStatusColor(client.status),
                      border: `1px solid ${getStatusColor(client.status)}`,
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {getStatusLabel(client.status)}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {client.projects_count ?? 0}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {client.active_projects_count ?? 0}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(calculateTotalInvoicedWithVAT(client))}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {formatMargin(client)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
