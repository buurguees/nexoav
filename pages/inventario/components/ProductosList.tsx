"use client";

import { DataList, DataListColumn } from "../../../components/list";
import { useState, useMemo } from "react";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { InventoryItemData } from "../../../lib/mocks/inventoryMocks";

/**
 * Componente de listado de productos usando el componente reutilizable DataList
 * 
 * Basado en el schema de la tabla `inventory_items` de la base de datos (docs/base-de-datos.md)
 */

interface ProductosListProps {
  products: InventoryItemData[];
  showFilters?: boolean;
  showTools?: boolean;
  onProductClick?: (product: InventoryItemData) => void;
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

export function ProductosList({
  products,
  showFilters = true,
  showTools = true,
  onProductClick,
}: ProductosListProps) {
  const breakpoint = useBreakpoint();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all");

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category_name || "Sin categoría"));
    return Array.from(cats).sort();
  }, [products]);

  // Filtrar productos según los filtros aplicados
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.internal_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de categoría
      const matchesCategory =
        filterCategory === "" || product.category_name === filterCategory;

      // Filtro de estado activo
      const matchesActive =
        filterActive === null || product.is_active === filterActive;

      // Filtro de stock
      let matchesStock = true;
      if (filterStock === "low" && product.is_stockable) {
        matchesStock =
          (product.stock_current ?? 0) > 0 &&
          (product.stock_current ?? 0) <= (product.stock_min ?? 0);
      } else if (filterStock === "out" && product.is_stockable) {
        matchesStock = (product.stock_current ?? 0) === 0;
      }

      return matchesSearch && matchesCategory && matchesActive && matchesStock;
    });
  }, [products, searchTerm, filterCategory, filterActive, filterStock]);

  // Definir las columnas del listado
  const columns: DataListColumn<InventoryItemData>[] = useMemo(() => {
    return [
      {
        key: "internal_code",
        label: "Código",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (product) => (
          <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
            {product.internal_code || "-"}
          </span>
        ),
      },
      {
        key: "name",
        label: "Nombre",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (product) => (
          <div>
            <div style={{ fontWeight: "var(--font-weight-medium)" }}>
              {product.name}
            </div>
            {product.description && (
              <div
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--foreground-tertiary)",
                  marginTop: "2px",
                }}
              >
                {product.description.length > 60
                  ? `${product.description.substring(0, 60)}...`
                  : product.description}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "category_name",
        label: "Categoría",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (product) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {product.category_name || "Sin categoría"}
          </span>
        ),
      },
      {
        key: "cost_price",
        label: "Coste",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (product) => {
          if (product.cost_price === 0) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          return (
            <span style={{ color: "var(--foreground-secondary)" }}>
              {formatCurrency(product.cost_price)}
            </span>
          );
        },
      },
      {
        key: "base_price",
        label: "Precio Base",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (product) => (
          <span style={{ fontWeight: "var(--font-weight-medium)" }}>
            {formatCurrency(product.base_price)}
          </span>
        ),
      },
      {
        key: "margin_percentage",
        label: "Margen",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (product) => {
          if (!product.margin_percentage) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          return (
            <span
              style={{
                fontWeight: "var(--font-weight-medium)",
                color: product.margin_percentage > 0 ? "rgb(0, 200, 117)" : "rgb(220, 53, 69)",
              }}
            >
              {product.margin_percentage.toFixed(2)}%
            </span>
          );
        },
      },
      {
        key: "rental_price_12m",
        label: "Alquiler 12m",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (product) => {
          if (!product.rental_price_12m) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {formatCurrency(product.rental_price_12m)}/mes
            </span>
          );
        },
      },
      {
        key: "rental_price_18m",
        label: "Alquiler 18m",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (product) => {
          if (!product.rental_price_18m) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {formatCurrency(product.rental_price_18m)}/mes
            </span>
          );
        },
      },
      {
        key: "rental_price_daily",
        label: "Alquiler Diario",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: false,
          mobile: false,
        },
        render: (product) => {
          if (!product.rental_price_daily) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {formatCurrency(product.rental_price_daily)}/día
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
        render: (product) => (
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-xs)",
              fontWeight: "var(--font-weight-medium)",
              backgroundColor: product.is_active
                ? "rgba(0, 200, 117, 0.1)"
                : "rgba(220, 53, 69, 0.1)",
              color: product.is_active
                ? "rgb(0, 200, 117)"
                : "rgb(220, 53, 69)",
            }}
          >
            {product.is_active ? "Activo" : "Inactivo"}
          </span>
        ),
      },
      {
        key: "stock_current",
        label: "Stock",
        align: "right",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (product) => {
          if (!product.is_stockable) {
            return (
              <span style={{ color: "var(--foreground-tertiary)", fontSize: "var(--font-size-xs)" }}>
                N/A
              </span>
            );
          }
          const stock = product.stock_current ?? 0;
          const stockMin = product.stock_min ?? 0;
          const isLow = stock > 0 && stock <= stockMin;
          const isOut = stock === 0;

          return (
            <span
              style={{
                fontWeight: "var(--font-weight-medium)",
                color: isOut
                  ? "rgb(220, 53, 69)"
                  : isLow
                  ? "rgb(255, 165, 0)"
                  : "var(--foreground)",
              }}
            >
              {stock} {product.unit}
            </span>
          );
        },
      },
    ];
  }, []);

  // Calcular grid columns personalizado para productos
  // Optimizado para 11 columnas: Código | Nombre | Categoría | Coste | Precio Base | Margen | Stock | Alquiler 12m | Alquiler 18m | Alquiler Diario | Estado
  const productosGridColumns = useMemo(() => {
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
    
    if (count >= 11) {
      // Desktop/Tablet-horizontal: 11 columnas
      // Orden: Código | Nombre | Categoría | Coste | Precio Base | Margen | Alquiler 12m | Alquiler 18m | Alquiler Diario | Estado | Stock
      // Optimizado: código y valores numéricos compactos, nombre con espacio suficiente pero no excesivo
      // Estado centrado entre Alquiler Diario y Stock (más espacio alrededor de Estado)
      return "0.7fr 2.0fr 0.9fr 0.7fr 0.7fr 0.7fr 0.7fr 0.7fr 0.7fr 0.7fr 0.7fr";
    } else if (count === 10) {
      // Si hay 10 columnas
      return "0.7fr 2.3fr 0.9fr 0.9fr 1fr 0.8fr 0.8fr 1fr 1fr 0.9fr";
    } else if (count === 9) {
      // Si hay 9 columnas
      return "0.7fr 2.4fr 1fr 0.95fr 1.05fr 0.85fr 0.85fr 1.05fr 1.05fr";
    } else if (count === 8) {
      // Si hay 8 columnas
      return "0.8fr 2.5fr 1.1fr 1fr 1.1fr 0.9fr 0.9fr 1.1fr";
    } else if (count === 7) {
      // Si hay 7 columnas
      return "0.8fr 2.6fr 1.2fr 1.1fr 1.2fr 1fr 1.1fr";
    } else if (count === 6) {
      // Si hay 6 columnas
      return "0.8fr 2.8fr 1.3fr 1.2fr 1.3fr 1.1fr";
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
        placeholder="Buscar producto..."
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
        value={filterStock}
        onChange={(e) => setFilterStock(e.target.value as "all" | "low" | "out")}
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
        <option value="all">Todo el stock</option>
        <option value="low">Stock bajo</option>
        <option value="out">Sin stock</option>
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
          // TODO: Implementar modal de nuevo producto
          console.log("Nuevo producto");
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
        + Nuevo Producto
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
      title="Productos"
      data={filteredProducts}
      columns={columns}
      showFilters={showFilters}
      showTools={showTools}
      renderFilters={renderFilters}
      renderTools={renderTools}
      onRowClick={onProductClick}
      emptyMessage="No hay productos disponibles"
      customGridColumns={productosGridColumns}
    />
  );
}

