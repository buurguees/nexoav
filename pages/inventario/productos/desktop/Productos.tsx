"use client";

import { useState, useEffect } from "react";
import { ProductosList } from "../../components/ProductosList";
import { fetchProducts } from "../../../../lib/mocks/inventoryMocks";
import { InventoryItemData } from "../../../../lib/mocks/inventoryMocks";

/**
 * Página de Productos - Versión Desktop (> 1024px)
 * Layout: Listado completo con filtros y herramientas
 */


export function ProductosDesktop() {
  const [products, setProducts] = useState<InventoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      }}
    >
      <ProductosList
        products={products}
        showFilters={true}
        showTools={true}
        onProductClick={(product) => {
          // TODO: Navegar a detalle del producto
          console.log("Producto clickeado:", product);
        }}
      />
    </div>
  );
}
