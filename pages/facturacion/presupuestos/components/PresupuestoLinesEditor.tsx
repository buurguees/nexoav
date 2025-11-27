"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchInventoryItems, InventoryItemData } from "../../../../lib/mocks/inventoryMocks";
import { SalesDocumentLineData } from "../../../../lib/mocks/salesDocumentLinesMocks";

export interface PresupuestoLine {
  id?: string; // Temporal ID para líneas nuevas
  item_id?: string | null;
  concept: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
  grouping_tag: "Productos" | "Servicios";
  unit?: string;
  // Calculados
  subtotal: number;
  total_line: number;
}

interface PresupuestoLinesEditorProps {
  lines: PresupuestoLine[];
  onChange: (lines: PresupuestoLine[]) => void;
  defaultTaxPercent?: number;
}

// Calcular subtotal y total_line
function calculateLineTotals(
  quantity: number,
  unitPrice: number,
  discountPercent: number,
  taxPercent: number
): { subtotal: number; totalLine: number } {
  const subtotal = quantity * unitPrice * (1 - discountPercent / 100);
  const totalLine = subtotal * (1 + taxPercent / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalLine: Math.round(totalLine * 100) / 100,
  };
}

export function PresupuestoLinesEditor({
  lines,
  onChange,
  defaultTaxPercent = 21,
}: PresupuestoLinesEditorProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [filterType, setFilterType] = useState<"producto" | "servicio" | "all">("all");

  // Cargar items del inventario
  useEffect(() => {
    const loadItems = async () => {
      setIsLoadingItems(true);
      try {
        const items = await fetchInventoryItems();
        setInventoryItems(items.filter((item) => item.is_active));
      } catch (error) {
        console.error("Error al cargar items:", error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadItems();
  }, []);

  // Filtrar items según búsqueda y tipo
  const filteredItems = useMemo(() => {
    let filtered = inventoryItems;

    // Filtrar por tipo
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.internal_code.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [inventoryItems, searchTerm, filterType]);

  // Añadir línea desde item del inventario
  const handleAddLineFromItem = (item: InventoryItemData) => {
    const newLine: PresupuestoLine = {
      id: `temp-${Date.now()}`,
      item_id: item.id,
      concept: item.name,
      description: item.description || "",
      quantity: 1,
      unit_price: item.base_price,
      discount_percent: 0,
      tax_percent: defaultTaxPercent,
      grouping_tag: item.type === "producto" ? "Productos" : "Servicios",
      unit: item.unit || "unidad",
      ...calculateLineTotals(1, item.base_price, 0, defaultTaxPercent),
    };

    onChange([...lines, newLine]);
    setShowItemSelector(false);
    setSearchTerm("");
  };

  // Actualizar línea
  const handleUpdateLine = (lineId: string | undefined, field: keyof PresupuestoLine, value: any) => {
    if (!lineId) return;

    const updatedLines = lines.map((line) => {
      if (line.id === lineId) {
        const updated = { ...line, [field]: value };
        // Recalcular si cambió quantity, unit_price, discount_percent o tax_percent
        if (["quantity", "unit_price", "discount_percent", "tax_percent"].includes(field)) {
          const totals = calculateLineTotals(
            updated.quantity,
            updated.unit_price,
            updated.discount_percent,
            updated.tax_percent
          );
          updated.subtotal = totals.subtotal;
          updated.total_line = totals.totalLine;
        }
        return updated;
      }
      return line;
    });

    onChange(updatedLines);
  };

  // Eliminar línea
  const handleDeleteLine = (lineId: string | undefined) => {
    if (!lineId) return;
    onChange(lines.filter((line) => line.id !== lineId));
  };

  // Separar líneas por tipo
  const productosLines = lines.filter((line) => line.grouping_tag === "Productos");
  const serviciosLines = lines.filter((line) => line.grouping_tag === "Servicios");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
      {/* Botón para añadir item */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3
          style={{
            fontSize: "var(--font-size-lg)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--foreground)",
          }}
        >
          Líneas del Presupuesto
        </h3>
        <button
          type="button"
          onClick={() => setShowItemSelector(!showItemSelector)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-xs)",
            padding: "var(--spacing-sm) var(--spacing-md)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-medium)",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            cursor: "pointer",
            fontSize: "var(--font-size-sm)",
          }}
        >
          <IconWrapper icon={Plus} size={16} />
          Añadir Item
        </button>
      </div>

      {/* Selector de items */}
      {showItemSelector && (
        <div
          style={{
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "var(--spacing-md)",
            backgroundColor: "var(--background-secondary)",
          }}
        >
          {/* Búsqueda y filtros */}
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <IconWrapper
                icon={Search}
                size={16}
                style={{
                  position: "absolute",
                  left: "var(--spacing-sm)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--foreground-tertiary)",
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código o nombre..."
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) calc(var(--spacing-md) + 16px + var(--spacing-xs))",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "var(--font-size-sm)",
                }}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
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
              <option value="producto">Productos</option>
              <option value="servicio">Servicios</option>
            </select>
          </div>

          {/* Lista de items */}
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-xs)",
            }}
          >
            {isLoadingItems ? (
              <div style={{ padding: "var(--spacing-md)", textAlign: "center", color: "var(--foreground-tertiary)" }}>
                Cargando...
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ padding: "var(--spacing-md)", textAlign: "center", color: "var(--foreground-tertiary)" }}>
                No se encontraron items
              </div>
            ) : (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddLineFromItem(item)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-soft)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "var(--font-size-sm)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--background)";
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "var(--font-weight-medium)" }}>
                      {item.internal_code} - {item.name}
                    </div>
                    <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                      {item.type === "producto" ? "Producto" : "Servicio"} - {new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      }).format(item.base_price)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tabla de líneas - Productos */}
      {productosLines.length > 0 && (
        <div>
          <h4
            style={{
              fontSize: "var(--font-size-md)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--foreground)",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            Productos
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-medium)" }}>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Concepto</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Cantidad</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Precio</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>DTO %</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>IVA %</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Total</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "center", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}></th>
                </tr>
              </thead>
              <tbody>
                {productosLines.map((line) => (
                  <tr key={line.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <td style={{ padding: "var(--spacing-sm)" }}>
                      <input
                        type="text"
                        value={line.concept}
                        onChange={(e) => handleUpdateLine(line.id, "concept", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.quantity}
                        onChange={(e) => handleUpdateLine(line.id, "quantity", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "80px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.unit_price}
                        onChange={(e) => handleUpdateLine(line.id, "unit_price", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "100px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.discount_percent}
                        onChange={(e) => handleUpdateLine(line.id, "discount_percent", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "70px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.tax_percent}
                        onChange={(e) => handleUpdateLine(line.id, "tax_percent", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "70px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right", fontWeight: "var(--font-weight-medium)" }}>
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(line.total_line)}
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteLine(line.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "var(--spacing-xs)",
                          borderRadius: "var(--radius-sm)",
                          border: "none",
                          backgroundColor: "transparent",
                          color: "var(--accent-red-primary)",
                          cursor: "pointer",
                        }}
                      >
                        <IconWrapper icon={Trash2} size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabla de líneas - Servicios */}
      {serviciosLines.length > 0 && (
        <div>
          <h4
            style={{
              fontSize: "var(--font-size-md)",
              fontWeight: "var(--font-weight-semibold)",
              color: "var(--foreground)",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            Servicios
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-medium)" }}>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Concepto</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Cantidad</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Precio</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>DTO %</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>IVA %</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Total</th>
                  <th style={{ padding: "var(--spacing-sm)", textAlign: "center", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}></th>
                </tr>
              </thead>
              <tbody>
                {serviciosLines.map((line) => (
                  <tr key={line.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <td style={{ padding: "var(--spacing-sm)" }}>
                      <input
                        type="text"
                        value={line.concept}
                        onChange={(e) => handleUpdateLine(line.id, "concept", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.quantity}
                        onChange={(e) => handleUpdateLine(line.id, "quantity", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "80px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={line.unit_price}
                        onChange={(e) => handleUpdateLine(line.id, "unit_price", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "100px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.discount_percent}
                        onChange={(e) => handleUpdateLine(line.id, "discount_percent", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "70px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={line.tax_percent}
                        onChange={(e) => handleUpdateLine(line.id, "tax_percent", parseFloat(e.target.value) || 0)}
                        style={{
                          width: "70px",
                          padding: "var(--spacing-xs) var(--spacing-sm)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-medium)",
                          backgroundColor: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "var(--font-size-sm)",
                          textAlign: "right",
                        }}
                      />
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "right", fontWeight: "var(--font-weight-medium)" }}>
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(line.total_line)}
                    </td>
                    <td style={{ padding: "var(--spacing-sm)", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleDeleteLine(line.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "var(--spacing-xs)",
                          borderRadius: "var(--radius-sm)",
                          border: "none",
                          backgroundColor: "transparent",
                          color: "var(--accent-red-primary)",
                          cursor: "pointer",
                        }}
                      >
                        <IconWrapper icon={Trash2} size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lines.length === 0 && (
        <div
          style={{
            padding: "var(--spacing-xl)",
            textAlign: "center",
            color: "var(--foreground-tertiary)",
            border: "1px dashed var(--border-medium)",
            borderRadius: "var(--radius-md)",
          }}
        >
          No hay líneas añadidas. Haz clic en "Añadir Item" para comenzar.
        </div>
      )}
    </div>
  );
}

