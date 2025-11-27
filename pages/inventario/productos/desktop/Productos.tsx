"use client";

import { useState, useEffect } from "react";
import { ProductosList } from "../../components/ProductosList";
import { fetchProducts, InventoryItemData } from "../../../../lib/mocks/inventoryMocks";
import { NewProductoModal } from "../components/NewProductoModal";
import { ProductoDetail } from "../components/ProductoDetail";

/**
 * Página de Productos - Versión Desktop (> 1024px)
 * Layout: Listado completo con filtros y herramientas
 */

export function ProductosDesktop() {
  const [products, setProducts] = useState<InventoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "var(--spacing-sm)",
        gap: "var(--spacing-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--spacing-sm)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
          }}
        >
          Productos
        </h1>
        <button
          type="button"
          onClick={() => setIsNewOpen(true)}
          style={{
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            border: "none",
            backgroundColor: "var(--accent-blue-primary)",
            color: "var(--background)",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
            cursor: "pointer",
          }}
        >
          + Nuevo producto
        </button>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--foreground-secondary)",
            }}
          >
            Cargando productos...
          </div>
        ) : (
          <ProductosList
            products={products}
            showFilters={true}
            showTools={false}
            onProductClick={(product) => setSelectedId(product.id)}
          />
        )}
      </div>

      <NewProductoModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onCreated={async () => {
          await loadProducts();
        }}
      />

      {selectedId && (
        <ProductoDetail
          productId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdated={loadProducts}
        />
      )}
    </div>
  );
}
