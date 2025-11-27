"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Edit2 } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  InventoryItemData,
  fetchInventoryItemById,
} from "../../../../lib/mocks/inventoryMocks";
import { EditProductoModal } from "./EditProductoModal";

interface ProductoDetailProps {
  productId: string;
  onClose: () => void;
  onUpdated: () => void;
}

export function ProductoDetail({ productId, onClose, onUpdated }: ProductoDetailProps) {
  const [product, setProduct] = useState<InventoryItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const item = await fetchInventoryItemById(productId);
        setProduct(item);
      } catch (e) {
        console.error("Error al cargar producto:", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [productId]);

  const formatCurrency = (value: number | undefined | null) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--background)",
          }}
        >
          Cargando producto...
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const margin =
    product.base_price && product.cost_price
      ? ((product.base_price - product.cost_price) / product.cost_price) * 100
      : null;

  const stockWarehouse = product.stock_warehouse ?? 0;
  const stockRented = product.stock_rented ?? 0;
  const stockCommitted = product.stock_committed ?? 0;

  const available =
    product.is_stockable && stockWarehouse - stockRented - stockCommitted >= 0
      ? stockWarehouse - stockRented - stockCommitted
      : null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1000,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(70vw, 100% - 2 * var(--spacing-lg))",
          maxHeight: "90vh",
          backgroundColor: "var(--background)",
          borderRadius: "var(--radius-lg)",
          boxShadow:
            "0 24px 48px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderBottom: "1px solid var(--border-medium)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--spacing-md)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--foreground-tertiary)",
                }}
              >
                Producto
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  backgroundColor: "var(--background-secondary)",
                  fontSize: "var(--font-size-xs)",
                  fontFamily: "monospace",
                }}
              >
                {product.internal_code}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  backgroundColor: product.is_active
                    ? "rgba(0,200,117,0.1)"
                    : "rgba(220,53,69,0.1)",
                  color: product.is_active ? "rgb(0,200,117)" : "rgb(220,53,69)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 500,
                }}
              >
                {product.is_active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              {product.name}
            </h2>
            <span
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--foreground-secondary)",
              }}
            >
              {product.category_name || "Sin categoría"} · {product.unit}
            </span>
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "var(--font-size-sm)",
                cursor: "pointer",
              }}
            >
              <IconWrapper icon={Edit2} size={16} />
              Editar
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "var(--spacing-sm)",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--foreground-secondary)",
              }}
            >
              <IconWrapper icon={X} size={20} />
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "var(--spacing-lg)",
            display: "grid",
            gridTemplateColumns: "1.7fr 1.3fr",
            gap: "var(--spacing-lg)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background-secondary)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Descripción
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--font-size-sm)",
                  color: "var(--foreground-secondary)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {product.description || "Sin descripción"}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "var(--spacing-md)",
              }}
            >
              <MetricCard
                label="Precio base"
                value={formatCurrency(product.base_price)}
              />
              <MetricCard
                label="Coste"
                value={formatCurrency(product.cost_price)}
              />
              <MetricCard
                label="Margen"
                value={
                  margin !== null
                    ? `${margin.toFixed(1)}%`
                    : "—"
                }
              />
              <MetricCard
                label="Unidades vendidas"
                value={(product.units_sold ?? 0).toLocaleString("es-ES")}
              />
              <MetricCard
                label="Total facturado"
                value={formatCurrency(product.total_billing ?? 0)}
              />
              <MetricCard
                label="Coste medio"
                value={formatCurrency(product.average_cost ?? product.cost_price)}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-medium)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Stock
              </h3>
              {!product.is_stockable ? (
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--foreground-tertiary)",
                    margin: 0,
                  }}
                >
                  Este producto no controla stock.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "var(--spacing-sm)",
                    fontSize: "var(--font-size-sm)",
                  }}
                >
                  <StockRow label="Almacén" value={stockWarehouse} />
                  <StockRow label="Mínimo" value={product.stock_min ?? 0} />
                  <StockRow label="En proyectos" value={stockRented} />
                  <StockRow label="Reservado" value={stockCommitted} />
                  <div
                    style={{
                      gridColumn: "span 2",
                      marginTop: 4,
                      paddingTop: 4,
                      borderTop: "1px dashed var(--border-medium)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--foreground-secondary)",
                      }}
                    >
                      Disponible estimado
                    </span>
                    <span
                      style={{
                        fontWeight: "var(--font-weight-semibold)",
                        color:
                          available !== null && available <= (product.stock_min ?? 0)
                            ? "rgb(220,53,69)"
                            : "var(--foreground)",
                      }}
                    >
                      {available !== null ? available : "—"} {product.unit}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-medium)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Alquiler
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "var(--spacing-sm)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                <PriceRow
                  label="12 meses"
                  value={
                    product.rental_price_12m
                      ? `${formatCurrency(product.rental_price_12m)}/mes`
                      : "Sin definir"
                  }
                />
                <PriceRow
                  label="18 meses"
                  value={
                    product.rental_price_18m
                      ? `${formatCurrency(product.rental_price_18m)}/mes`
                      : "Sin definir"
                  }
                />
                <PriceRow
                  label="Diario"
                  value={
                    product.rental_price_daily
                      ? `${formatCurrency(product.rental_price_daily)}/día`
                      : "Sin definir"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {isEditOpen && product && (
        <EditProductoModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          product={product}
          onUpdated={async () => {
            const refreshed = await fetchInventoryItemById(productId);
            if (refreshed) {
              setProduct(refreshed);
            }
            onUpdated();
          }}
        />
      )}
    </>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div
      style={{
        padding: "var(--spacing-md)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--background-secondary)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: "var(--font-size-xs)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--foreground-tertiary)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "var(--font-size-md)",
          fontWeight: "var(--font-weight-semibold)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface StockRowProps {
  label: string;
  value: number;
}

function StockRow({ label, value }: StockRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          color: "var(--foreground-secondary)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface PriceRowProps {
  label: string;
  value: string;
}

function PriceRow({ label, value }: PriceRowProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span
        style={{
          fontSize: "var(--font-size-xs)",
          color: "var(--foreground-tertiary)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        {value}
      </span>
    </div>
  );
}


