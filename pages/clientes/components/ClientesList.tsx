"use client";

import { DataList, DataListColumn } from "../../../components/list";
import { useState, useMemo } from "react";
import { NewClientModal } from "./NewClientModal";
import { createClient } from "../../../lib/mocks/clientMocks";

/**
 * Componente de listado de clientes usando el componente reutilizable DataList
 * 
 * Este componente muestra cómo usar DataList para mostrar clientes con:
 * - Título: "Clientes"
 * - Filtros: activables
 * - Herramientas: activables
 * - Columnas responsivas según breakpoint
 * 
 * Basado en el schema de la tabla `clients` de la base de datos (docs/base-de-datos.md)
 */

// Tipo para los datos de cliente según el schema de la BD
// Tabla: clients (docs/base-de-datos.md, línea 179)
export interface ClientData {
  id: string; // PK (UUID)
  internal_code: string; // Código interno único (ej: "CLI-0001")
  fiscal_name: string; // Razón social fiscal
  commercial_name?: string; // Nombre comercial (opcional)
  vat_number: string; // CIF/NIF del cliente
  billing_address?: {
    street?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  }; // Dirección de facturación estructurada (JSONB)
  shipping_address?: {
    street?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  }; // Dirección de envío estructurada (JSONB)
  payment_terms?: string; // Condiciones de pago (ej: "30 días")
  payment_method?: string; // Método de pago preferido (ej: "transferencia")
  total_billing?: number; // Total facturado acumulado (calculado automáticamente)
  total_projects?: number; // Total de proyectos realizados (calculado automáticamente)
  projects_count?: number; // Alias para total_projects (compatibilidad)
  notes?: string; // Notas internas
  is_active: boolean; // Si el cliente está activo
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
}

interface ClientesListProps {
  clients: ClientData[];
  showFilters?: boolean;
  showTools?: boolean;
  onClientClick?: (client: ClientData) => void;
  onClientCreated?: (client: ClientData) => void; // Callback cuando se crea un cliente
}

export function ClientesList({
  clients,
  showFilters = true,
  showTools = true,
  onClientClick,
  onClientCreated,
}: ClientesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar clientes según los filtros aplicados
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        client.fiscal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.commercial_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.internal_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.vat_number.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de estado activo
      const matchesActive =
        filterActive === null || client.is_active === filterActive;

      return matchesSearch && matchesActive;
    });
  }, [clients, searchTerm, filterActive]);

  // Definir las columnas del listado
  const columns: DataListColumn<ClientData>[] = [
    {
      key: "internal_code",
      label: "Código",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
    },
    {
      key: "fiscal_name",
      label: "Nombre",
      render: (client) => (
        <div>
          <div style={{ fontWeight: "var(--font-weight-medium)" }}>
            {client.commercial_name || client.fiscal_name}
          </div>
          {client.commercial_name && (
            <div
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--foreground-tertiary)",
              }}
            >
              {client.fiscal_name}
            </div>
          )}
        </div>
      ),
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
    },
    {
      key: "vat_number",
      label: "CIF/NIF",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
    },
    {
      key: "billing_address",
      label: "Ciudad",
      render: (client) => {
        const city = client.billing_address?.city || "-";
        return (
          <span style={{ color: "var(--foreground-secondary)" }}>
            {city}
          </span>
        );
      },
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
    },
    {
      key: "is_active",
      label: "Estado",
      render: (client) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-xs)",
            fontWeight: "var(--font-weight-medium)",
            backgroundColor: client.is_active
              ? "rgba(0, 200, 117, 0.1)"
              : "rgba(220, 53, 69, 0.1)",
            color: client.is_active
              ? "rgb(0, 200, 117)"
              : "rgb(220, 53, 69)",
          }}
        >
          {client.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
    },
    {
      key: "projects_count",
      label: "Proyectos",
      align: "right", // Alineado a la derecha
      render: (client) => {
        const count = client.total_projects ?? client.projects_count ?? 0;
        return (
          <span
            style={{
              fontWeight: "var(--font-weight-medium)",
              color: count > 0 ? "var(--foreground)" : "var(--foreground-tertiary)",
            }}
          >
            {count}
          </span>
        );
      },
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
    },
    {
      key: "total_billing",
      label: "Total Facturación",
      align: "right", // Alineado a la derecha
      render: (client) => {
        const total = client.total_billing ?? 0;
        if (total === 0) {
          return (
            <span style={{ color: "var(--foreground-tertiary)" }}>
              €0,00
            </span>
          );
        }
        return (
          <span style={{ fontWeight: "var(--font-weight-medium)" }}>
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(total)}
          </span>
        );
      },
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
    },
    {
      key: "created_at",
      label: "Fecha Alta",
      render: (client) => {
        const date = new Date(client.created_at);
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      visibleOn: {
        desktop: true,
        tablet: false,
        mobile: false,
      },
    },
  ];

  // Renderizado de filtros
  const renderFilters = () => (
    <div
      style={{
        display: "flex",
        gap: "var(--spacing-sm)",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          flex: 1,
          minWidth: "200px",
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
        }}
      />
      <select
        value={filterActive === null ? "all" : filterActive ? "active" : "inactive"}
        onChange={(e) => {
          const value = e.target.value;
          setFilterActive(
            value === "all" ? null : value === "active" ? true : false
          );
        }}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
        }}
      >
        <option value="all">Todos</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
    </div>
  );

  // Manejar creación de cliente
  const handleCreateClient = async (clientData: any) => {
    try {
      const newClient = await createClient(clientData);
      onClientCreated?.(newClient);
      setIsModalOpen(false);
      // TODO: Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al crear cliente:", error);
      // TODO: Mostrar mensaje de error
      throw error; // Re-lanzar para que el modal maneje el error
    }
  };

  // Renderizado de herramientas
  const renderTools = () => (
    <div
      style={{
        display: "flex",
        gap: "var(--spacing-sm)",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background)";
        }}
      >
        + Nuevo Cliente
      </button>
      <button
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background)";
        }}
      >
        Exportar
      </button>
    </div>
  );

  return (
    <>
      <DataList
        title="Clientes"
        data={filteredClients}
        columns={columns}
        showFilters={showFilters}
        showTools={showTools}
        renderFilters={renderFilters}
        renderTools={renderTools}
        onRowClick={onClientClick}
        emptyMessage="No se encontraron clientes"
      />
      
      {/* Modal de Nuevo Cliente */}
      <NewClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateClient}
      />
    </>
  );
}

