"use client";

import { DataList, DataListColumn } from "../../../components/list";
import { useState, useMemo } from "react";
import { InventoryItemData } from "../../../lib/mocks/inventoryMocks";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

/**
 * Componente de listado de servicios usando el componente reutilizable DataList
 * 
 * Basado en el schema de la tabla `inventory_items` de la base de datos (docs/base-de-datos.md)
 */

interface ServiciosListProps {
  services: InventoryItemData[];
  showFilters?: boolean;
  showTools?: boolean;
  onServiceClick?: (service: InventoryItemData) => void;
}

// Función para formatear moneda
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function ServiciosList({
  services,
  showFilters = true,
  showTools = true,
  onServiceClick,
}: ServiciosListProps) {
  const breakpoint = useBreakpoint();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterSubtype, setFilterSubtype] = useState<string>("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category_name || "Sin categoría"));
    return Array.from(cats).sort();
  }, [services]);

  // Obtener subtipos únicos
  const subtypes = useMemo(() => {
    const subs = new Set(
      services
        .map((s) => s.subtype)
        .filter((sub): sub is string => sub !== undefined && sub !== null)
    );
    return Array.from(subs).sort();
  }, [services]);

  // Filtrar servicios según los filtros aplicados
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.internal_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoría
      const matchesCategory =
        filterCategory === "" || service.category_name === filterCategory;

      // Filtro de subtipo
      const matchesSubtype =
        filterSubtype === "" || service.subtype === filterSubtype;

      // Filtro de estado activo
      const matchesActive =
        filterActive === null || service.is_active === filterActive;

      return matchesSearch && matchesCategory && matchesSubtype && matchesActive;
    });
  }, [services, searchTerm, filterCategory, filterSubtype, filterActive]);

  // Definir las columnas del listado
  const columns: DataListColumn<InventoryItemData>[] = useMemo(() => {
    return [
      {
        key: "internal_code",
        label: "Código",
        align: "left",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (service) => (
          <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
            {service.internal_code || "-"}
          </span>
        ),
      },
      {
        key: "name",
        label: "Nombre",
        align: "left",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (service) => (
          <div>
            <div style={{ fontWeight: "var(--font-weight-medium)" }}>
              {service.name}
            </div>
            {service.description && (
              <div
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--foreground-tertiary)",
                  marginTop: "2px",
                }}
              >
                {service.description.length > 60
                  ? `${service.description.substring(0, 60)}...`
                  : service.description}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "category_name",
        label: "Categoría",
        align: "left",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (service) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {service.category_name || "Sin categoría"}
          </span>
        ),
      },
      {
        key: "subtype",
        label: "Subtipo",
        align: "left",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (service) => {
          if (!service.subtype) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          // Convertir snake_case a título
          const subtypeLabel = service.subtype
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {subtypeLabel}
            </span>
          );
        },
      },
      {
        key: "average_cost",
        label: "Coste",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (service) => {
          const cost = service.average_cost ?? service.cost_price ?? 0;
          if (cost === 0) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>
                €0,00
              </span>
            );
          }
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {formatCurrency(cost)}
            </span>
          );
        },
      },
      {
        key: "base_price",
        label: "Precio",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (service) => (
          <span style={{ fontWeight: "var(--font-weight-medium)" }}>
            {formatCurrency(service.base_price)}
          </span>
        ),
      },
      {
        key: "unit",
        label: "Unidad",
        align: "left",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (service) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {service.unit || "-"}
          </span>
        ),
      },
      {
        key: "units_sold",
        label: "Unidades Vendidas",
          align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (service) => {
          const units = service.units_sold ?? 0;
          return (
            <span
              style={{
                fontWeight: "var(--font-weight-medium)",
                color: units > 0 ? "var(--foreground)" : "var(--foreground-tertiary)",
              }}
            >
              {units.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          );
        },
      },
      {
        key: "total_billing",
        label: "Facturado",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (service) => {
          const total = service.total_billing ?? 0;
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
      {
        key: "is_active",
        label: "Estado",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (service) => (
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-weight-medium)",
              backgroundColor: service.is_active
                ? "rgba(0, 200, 117, 0.1)"
                : "rgba(220, 53, 69, 0.1)",
              color: service.is_active
                ? "rgb(0, 200, 117)"
                : "rgb(220, 53, 69)",
            }}
          >
            {service.is_active ? "Activo" : "Inactivo"}
          </span>
        ),
      },
    ];
  }, []);

  // Calcular grid columns personalizado para servicios
  // Optimizado para 10 columnas: Código | Nombre | Categoría | Subtipo | Precio Base | Unidad | Unidades Vendidas | Facturado | Coste Medio | Estado
  const serviciosGridColumns = useMemo(() => {
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
    
    if (count >= 10) {
      // Desktop/Tablet-horizontal: 10 columnas
      // Orden: Código | Nombre | Categoría | Subtipo | Precio Base | Unidad | Unidades Vendidas | Facturado | Coste Medio | Estado
      // Optimizado: nombre con espacio suficiente, valores numéricos alineados a la derecha
      return "0.7fr 2.2fr 1fr 0.8fr 0.8fr 0.7fr 0.8fr 0.8fr 0.8fr 1fr";
    } else if (count === 9) {
      // Si hay 9 columnas
      return "0.7fr 2.3fr 1fr 0.95fr 1fr 0.75fr 1.05fr 1.05fr 1fr";
    } else if (count === 8) {
      // Si hay 8 columnas
      return "0.8fr 2.4fr 1.1fr 1fr 1.1fr 0.8fr 1.1fr 1.1fr";
    } else if (count === 7) {
      // Si hay 7 columnas
      return "0.8fr 2.5fr 1.2fr 1.1fr 1.2fr 1.1fr 1.2fr";
    } else if (count === 6) {
      // Si hay 6 columnas
      return "0.8fr 2.7fr 1.3fr 1.2fr 1.3fr 1.2fr";
    } else if (count === 5) {
      // Si hay 5 columnas
      return "0.9fr 3fr 1.4fr 1.3fr 1.4fr";
    } else if (count === 4) {
      // Tablet portrait: 4 columnas
      return "0.9fr 3.2fr 1.5fr 1.4fr";
    } else {
      // Mobile: 3 columnas (Código | Nombre | Estado)
      return "0.9fr 3.5fr 1.1fr";
    }
  }, [breakpoint, columns]);

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
        placeholder="Buscar servicio..."
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
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          minWidth: "150px",
        }}
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={filterSubtype}
        onChange={(e) => setFilterSubtype(e.target.value)}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          minWidth: "150px",
        }}
      >
        <option value="">Todos los subtipos</option>
        {subtypes.map((sub) => (
          <option key={sub} value={sub}>
            {sub
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </option>
        ))}
      </select>
      <select
        value={filterActive === null ? "" : filterActive ? "active" : "inactive"}
        onChange={(e) => {
          if (e.target.value === "") setFilterActive(null);
          else setFilterActive(e.target.value === "active");
        }}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          minWidth: "120px",
        }}
      >
        <option value="">Todos</option>
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
        onClick={() => {
          // TODO: Implementar modal de nuevo servicio
          console.log("Nuevo servicio");
        }}
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
        + Nuevo Servicio
      </button>
      <button
        onClick={() => {
          // TODO: Implementar exportación
          console.log("Exportar");
        }}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          cursor: "pointer",
        }}
      >
        Exportar
      </button>
    </div>
  );

  return (
    <DataList
      title="Servicios"
      data={filteredServices}
      columns={columns}
      showFilters={showFilters}
      showTools={showTools}
      renderFilters={renderFilters}
      renderTools={renderTools}
      onRowClick={onServiceClick}
      emptyMessage="No hay servicios disponibles"
      customGridColumns={serviciosGridColumns}
    />
  );
}

