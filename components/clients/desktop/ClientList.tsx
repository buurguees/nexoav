"use client";

import { Client } from "../../../lib/types/client";

export interface ClientListProps {
  clients: Client[];
  onClientClick?: (client: Client) => void;
  onCreateClient?: () => void;
  className?: string;
}

/**
 * Listado de clientes para desktop
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

  /**
   * Calcular total facturado CON IVA
   * Si el cliente está exento de IVA, devuelve el total sin IVA
   */
  const calculateTotalInvoicedWithVAT = (client: Client): number => {
    if (!client.total_invoiced) return 0;
    
    // Si está exento de IVA, el total es el mismo
    if (client.vat_exempt) {
      return client.total_invoiced;
    }

    // Calcular IVA según el tipo
    let vatRate = 0;
    switch (client.vat_type) {
      case "general":
        vatRate = 0.21; // 21%
        break;
      case "reduced":
        vatRate = 0.10; // 10%
        break;
      case "super_reduced":
        vatRate = 0.04; // 4%
        break;
      case "exempt":
        return client.total_invoiced;
      default:
        vatRate = 0.21; // Por defecto 21%
    }

    return client.total_invoiced * (1 + vatRate);
  };

  /**
   * Calcular margen real considerando IVA en ingresos y costes
   * Margen = (Ingresos con IVA - Costes con IVA) / Ingresos con IVA * 100
   */
  const calculateRealMargin = (client: Client): number | null => {
    const totalInvoicedWithVAT = calculateTotalInvoicedWithVAT(client);
    
    if (!client.total_costs || totalInvoicedWithVAT === 0) {
      return null;
    }

    // Calcular costes con IVA (asumiendo que los costes también tienen IVA)
    // Por defecto, los costes tienen IVA general (21%)
    const costsWithVAT = client.total_costs * 1.21;
    
    // Beneficio neto real (con IVA)
    const netProfitWithVAT = totalInvoicedWithVAT - costsWithVAT;
    
    // Margen porcentual
    const margin = (netProfitWithVAT / totalInvoicedWithVAT) * 100;
    
    return margin;
  };

  const formatMargin = (client: Client) => {
    const realMargin = calculateRealMargin(client);
    if (realMargin !== null) {
      return `${realMargin.toFixed(2)}%`;
    }
    return "-";
  };

  // Grid compartido para header y filas - responsive con porcentajes
  const gridTemplateColumns = "70px minmax(200px, 2fr) 100px 110px 110px 130px 130px 110px";

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-md)",
        height: "100%",
        width: "50%",
        maxWidth: "50%",
      }}
    >
      {/* Header con título y botón */}
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
            fontSize: "24px",
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
              fontSize: "14px",
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

      {/* Tabla de clientes */}
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
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderBottom: "1px solid var(--border-medium)",
            backgroundColor: "var(--background-secondary)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "13px",
            color: "var(--foreground-secondary)",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left" }}>Número</div>
          <div style={{ textAlign: "left" }}>Nombre del Cliente</div>
          <div style={{ textAlign: "center" }}>Estado</div>
          <div style={{ textAlign: "right" }}>Proyectos Totales</div>
          <div style={{ textAlign: "right" }}>Proyectos Activos</div>
          <div style={{ textAlign: "right" }}>Pendiente</div>
          <div style={{ textAlign: "right" }}>Total Facturado</div>
          <div style={{ textAlign: "right" }}>Margen Limpio</div>
        </div>

        {/* Cuerpo de la tabla */}
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
                  padding: "var(--spacing-sm) var(--spacing-md)",
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
                {/* Número de Cliente */}
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    textAlign: "left",
                  }}
                >
                  {client.code}
                </div>

                {/* Nombre del Cliente (commercial_name o name) */}
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--foreground)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                  }}
                >
                  {client.commercial_name || client.name}
                </div>

                {/* Estado */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
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

                {/* Proyectos Totales */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {client.projects_count ?? 0}
                </div>

                {/* Proyectos Activos */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {client.active_projects_count ?? 0}
                </div>

                {/* Pendiente */}
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "var(--font-weight-medium)",
                    color: client.pending_amount && client.pending_amount > 0 ? "var(--warning)" : "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(client.pending_amount)}
                </div>

                {/* Total Facturado CON IVA */}
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground)",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(calculateTotalInvoicedWithVAT(client))}
                </div>

                {/* Margen Limpio Real */}
                <div
                  style={{
                    fontSize: "13px",
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
