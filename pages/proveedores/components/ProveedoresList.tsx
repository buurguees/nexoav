"use client";

import { DataList, DataListColumn } from "../../../components/list";
import { useState, useMemo } from "react";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

/**
 * Componente de listado de proveedores usando el componente reutilizable DataList
 * 
 * Este componente muestra cómo usar DataList para mostrar proveedores con:
 * - Título: "Proveedores" o según categoría
 * - Filtros: activables
 * - Herramientas: activables
 * - Columnas responsivas según breakpoint y tipo de proveedor
 * 
 * Basado en el schema de la tabla `suppliers` de la base de datos (docs/base-de-datos.md, línea 1073)
 */

// Tipo para los datos de proveedor según el schema de la BD
// Tabla: suppliers (docs/base-de-datos.md, línea 1073)
export interface SupplierData {
  id: string; // PK (UUID)
  name: string; // Nombre del proveedor
  cif?: string; // CIF/NIF del proveedor
  category: "tecnico_freelance" | "material" | "transporte" | "software" | "externo"; // Categoría del proveedor
  freelance_profile_id?: string; // FK (UUID) → profiles.id (solo para técnicos)
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  }; // Dirección estructurada (JSONB)
  contact_email?: string; // Email de contacto
  contact_phone?: string; // Teléfono de contacto
  payment_terms_days?: number; // Días de pago
  notes?: string; // Notas internas
  is_active: boolean; // Si el proveedor está activo
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/relacionados (no están en la BD pero se pueden obtener con JOINs)
  total_projects?: number; // Total de proyectos asignados (calculado desde project_staffing)
  total_expenses?: number; // Total de gastos con este proveedor (calculado desde expenses)
  total_billed?: number; // Total facturado/pagado a este proveedor (calculado desde expenses donde status = 'pagado')
}

interface ProveedoresListProps {
  suppliers: SupplierData[];
  category?: SupplierData["category"]; // Categoría específica (opcional, para filtrar)
  showFilters?: boolean;
  showTools?: boolean;
  onSupplierClick?: (supplier: SupplierData) => void;
  onSupplierCreated?: (supplier: SupplierData) => void; // Callback cuando se crea un proveedor
}

// Función para formatear moneda
const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null || amount === 0) return "-";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Función para obtener el título según la categoría
const getTitleByCategory = (category?: SupplierData["category"]): string => {
  switch (category) {
    case "tecnico_freelance":
      return "Técnicos";
    case "material":
      return "Materiales";
    case "software":
      return "Softwares";
    case "transporte":
      return "Transporte";
    case "externo":
      return "Externos";
    default:
      return "Proveedores";
  }
};

export function ProveedoresList({
  suppliers,
  category,
  showFilters = true,
  showTools = true,
  onSupplierClick,
  onSupplierCreated,
}: ProveedoresListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const breakpoint = useBreakpoint();

  // Filtrar proveedores según los filtros aplicados
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      // Filtro de categoría (si se especifica)
      const matchesCategory = !category || supplier.category === category;

      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.cif?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.address?.province?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de estado activo
      const matchesActive =
        filterActive === null || supplier.is_active === filterActive;

      return matchesCategory && matchesSearch && matchesActive;
    });
  }, [suppliers, category, searchTerm, filterActive]);

  // Definir las columnas del listado según el tipo de proveedor
  const columns: DataListColumn<SupplierData>[] = useMemo(() => {
    const baseColumns: DataListColumn<SupplierData>[] = [
      {
        key: "name",
        label: "Nombre",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (supplier) => (
          <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
            {supplier.name}
          </span>
        ),
      },
      {
        key: "cif",
        label: "CIF/NIF",
        visibleOn: {
          desktop: category !== "software" ? true : false, // Softwares pueden no tener CIF
          tablet: category === "material" || category === "externo" ? true : false,
          mobile: false,
        },
        render: (supplier) => (
          <span style={{ color: "var(--foreground-secondary)" }}>
            {supplier.cif || "-"}
          </span>
        ),
      },
      {
        key: "contact_email",
        label: "Email",
        visibleOn: {
          desktop: category === "tecnico_freelance" || category === "material" || category === "software" || category === "externo" ? true : false,
          tablet: category === "tecnico_freelance" || category === "material" ? true : false,
          mobile: false,
        },
        render: (supplier) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {supplier.contact_email || "-"}
          </span>
        ),
      },
      {
        key: "contact_phone",
        label: "Teléfono",
        visibleOn: {
          desktop: category === "tecnico_freelance" || category === "material" || category === "software" || category === "externo" ? true : false,
          tablet: category === "tecnico_freelance" ? true : false,
          mobile: false,
        },
        render: (supplier) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {supplier.contact_phone || "-"}
          </span>
        ),
      },
      {
        key: "address.province",
        label: "Provincia",
        visibleOn: {
          desktop: false, // Por ahora no se muestra, pero está disponible para filtros
          tablet: false,
          mobile: false,
        },
        render: (supplier) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {supplier.address?.province || "-"}
          </span>
        ),
      },
      {
        key: "address.country",
        label: "País",
        visibleOn: {
          desktop: category === "material" ? true : false,
          tablet: false,
          mobile: false,
        },
        render: (supplier) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {supplier.address?.country || "-"}
          </span>
        ),
      },
      {
        key: "is_active",
        label: "Estado",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (supplier) => (
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-weight-medium)",
              backgroundColor: supplier.is_active
                ? "rgba(0, 200, 117, 0.1)"
                : "rgba(220, 53, 69, 0.1)",
              color: supplier.is_active
                ? "rgb(0, 200, 117)"
                : "rgb(220, 53, 69)",
            }}
          >
            {supplier.is_active ? "Activo" : "Inactivo"}
          </span>
        ),
      },
      {
        key: "total_billed",
        label: "Facturado",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (supplier) => {
          const total = supplier.total_billed ?? 0;
          if (total === 0) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>
                €0,00
              </span>
            );
          }
          return (
            <span style={{ fontWeight: "var(--font-weight-medium)" }}>
              {formatCurrency(total)}
            </span>
          );
        },
      },
    ];

    // Añadir columnas específicas según el tipo de proveedor
    if (category === "tecnico_freelance") {
      baseColumns.push({
        key: "total_projects",
        label: "Proyectos",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (supplier) => {
          const count = supplier.total_projects ?? 0;
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
      });
    }

    if (category === "material") {
      // Total productos (requeriría contar desde inventory_items, por ahora mostramos total_expenses)
      baseColumns.push({
        key: "total_expenses",
        label: "Total Gastos",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (supplier) => {
          const total = supplier.total_expenses ?? 0;
          if (total === 0) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>
                €0,00
              </span>
            );
          }
          return (
            <span style={{ fontWeight: "var(--font-weight-medium)" }}>
              {formatCurrency(total)}
            </span>
          );
        },
      });
    }

    // Columnas específicas para softwares (por ahora básicas, se pueden extender con datos adicionales)
    if (category === "software") {
      // TODO: Añadir columnas específicas cuando haya datos de suscripciones
      // - Tipo de suscripción
      // - Coste mensual/anual
      // - Próxima renovación
    }

    // Columnas específicas para externos
    if (category === "externo") {
      // TODO: Añadir columna "Tipo de servicio" cuando haya datos adicionales
    }

    return baseColumns;
  }, [category]);

  // Calcular grid columns personalizado para proveedores
  const suppliersGridColumns = useMemo(() => {
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

    if (count >= 8) {
      // Desktop/Tablet-horizontal: 8+ columnas (con Facturado)
      if (category === "tecnico_freelance") {
        // Nombre | CIF | Email | Teléfono | Estado | Facturado | Proyectos
        return "2fr 1.2fr 1.4fr 1.2fr 1fr 1.3fr 0.9fr";
      } else if (category === "material") {
        // Nombre | CIF | Email | Teléfono | País | Estado | Facturado | Total Gastos
        return "2.2fr 1.2fr 1.3fr 1.2fr 1fr 1fr 1.3fr 1.2fr";
      } else if (category === "externo") {
        // Nombre | CIF | Email | Teléfono | Estado | Facturado
        return "2.3fr 1.2fr 1.5fr 1.3fr 1fr 1.3fr";
      } else {
        // Fallback genérico
        return "2.5fr 1.3fr 1.6fr 1.2fr 1fr 1.2fr";
      }
    } else if (count >= 7) {
      // Desktop/Tablet-horizontal: 7 columnas
      if (category === "tecnico_freelance") {
        // Nombre | CIF | Email | Teléfono | Estado | Facturado | Proyectos
        return "2fr 1.2fr 1.4fr 1.2fr 1fr 1.3fr 0.9fr";
      } else if (category === "material") {
        // Nombre | CIF | Email | Teléfono | País | Estado | Facturado
        return "2.2fr 1.2fr 1.3fr 1.2fr 1fr 1fr 1.3fr";
      } else if (category === "software") {
        // Nombre | Email | Teléfono | Estado | Facturado
        return "2.5fr 1.8fr 1.5fr 1fr 1.3fr";
      } else if (category === "externo") {
        // Nombre | CIF | Email | Teléfono | Estado | Facturado
        return "2.3fr 1.2fr 1.5fr 1.3fr 1fr 1.3fr";
      } else {
        // Fallback genérico
        return "2.5fr 1.3fr 1.6fr 1.2fr 1fr 1.2fr";
      }
    } else if (count === 6) {
      if (category === "material") {
        return "2.2fr 1.2fr 1.3fr 1.2fr 1fr 1.3fr";
      } else if (category === "externo") {
        return "2.3fr 1.2fr 1.5fr 1.3fr 1fr 1.3fr";
      }
      return "2.2fr 1.2fr 1.5fr 1fr 1fr 1.2fr";
    } else if (count === 5) {
      return "2.3fr 1.3fr 1.5fr 1fr 1.2fr";
    } else if (count === 4) {
      // Tablet portrait: 4 columnas
      return "2.5fr 1.3fr 1.2fr 1fr";
    } else {
      // Mobile: 3 columnas (Nombre | CIF | Estado)
      return "2.5fr 1.3fr 1.2fr";
    }
  }, [breakpoint, columns, category]);

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
        placeholder="Buscar proveedor..."
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
          cursor: "pointer",
        }}
      >
        <option value="all">Todos</option>
        <option value="active">Activos</option>
        <option value="inactive">Inactivos</option>
      </select>
    </div>
  );

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
        + Nuevo Proveedor
      </button>
      <button
        type="button"
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
    <DataList
      title={getTitleByCategory(category)}
      data={filteredSuppliers}
      columns={columns}
      showFilters={showFilters}
      showTools={showTools}
      renderFilters={renderFilters}
      renderTools={renderTools}
      onRowClick={onSupplierClick}
      emptyMessage="No se encontraron proveedores"
      customGridColumns={suppliersGridColumns}
    />
  );
}

