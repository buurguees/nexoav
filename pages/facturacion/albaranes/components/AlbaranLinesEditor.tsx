"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import { fetchInventoryItems, InventoryItemData } from "../../../../lib/mocks/inventoryMocks";

export interface AlbaranLine {
  id?: string; // Temporal ID para líneas nuevas
  item_id: string;
  quantity: number;
  description: string;
  serial_number?: string;
  // Calculados
  item_name?: string;
  item_code?: string;
}

interface AlbaranLinesEditorProps {
  lines: AlbaranLine[];
  onChange: (lines: AlbaranLine[]) => void;
  type: "outbound" | "inbound";
  projectId?: string;
}

export function AlbaranLinesEditor({
  lines,
  onChange,
  type,
  projectId,
}: AlbaranLinesEditorProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemSelector, setShowItemSelector] = useState(false);

  // Cargar items stockables del inventario
  useEffect(() => {
    const loadItems = async () => {
      setIsLoadingItems(true);
      try {
        const items = await fetchInventoryItems("producto");
        // Solo items stockables y activos
        setInventoryItems(items.filter((item) => item.is_stockable && item.is_active));
      } catch (error) {
        console.error("Error al cargar items:", error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadItems();
  }, []);

  // Filtrar items según búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm) return inventoryItems;

    const term = searchTerm.toLowerCase();
    return inventoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.internal_code.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
    );
  }, [inventoryItems, searchTerm]);

  // Añadir línea desde item del inventario
  const handleAddLineFromItem = (item: InventoryItemData) => {
    // Validar stock disponible para outbound
    if (type === "outbound") {
      const availableStock = (item.stock_warehouse || 0) - (item.stock_committed || 0);
      if (availableStock <= 0) {
        alert(`No hay stock disponible para ${item.name}. Stock en almacén: ${item.stock_warehouse || 0}`);
        return;
      }
    }

    const newLine: AlbaranLine = {
      id: `temp-${Date.now()}`,
      item_id: item.id,
      quantity: 1,
      description: item.name,
      serial_number: "",
      item_name: item.name,
      item_code: item.internal_code,
    };

    onChange([...lines, newLine]);
    setShowItemSelector(false);
    setSearchTerm("");
  };

  // Actualizar línea
  const handleUpdateLine = (lineId: string | undefined, field: keyof AlbaranLine, value: any) => {
    if (!lineId) return;

    const updatedLines = lines.map((line) => {
      if (line.id === lineId) {
        return { ...line, [field]: value };
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
          Líneas del Albarán
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
          Añadir Producto
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
          {/* Búsqueda */}
          <div style={{ position: "relative", marginBottom: "var(--spacing-md)" }}>
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
                No se encontraron productos stockables
              </div>
            ) : (
              filteredItems.map((item) => {
                const availableStock = (item.stock_warehouse || 0) - (item.stock_committed || 0);
                const canAdd = type === "inbound" || availableStock > 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => canAdd && handleAddLineFromItem(item)}
                    disabled={!canAdd}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-soft)",
                      backgroundColor: canAdd ? "var(--background)" : "var(--background-secondary)",
                      color: canAdd ? "var(--foreground)" : "var(--foreground-tertiary)",
                      cursor: canAdd ? "pointer" : "not-allowed",
                      textAlign: "left",
                      fontSize: "var(--font-size-sm)",
                      opacity: canAdd ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      if (canAdd) {
                        e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (canAdd) {
                        e.currentTarget.style.backgroundColor = "var(--background)";
                      }
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "var(--font-weight-medium)" }}>
                        {item.internal_code} - {item.name}
                      </div>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)" }}>
                        {type === "outbound" && `Stock disponible: ${availableStock}`}
                        {type === "inbound" && "Producto para retorno"}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tabla de líneas */}
      {lines.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-medium)" }}>
                <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Producto</th>
                <th style={{ padding: "var(--spacing-sm)", textAlign: "right", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Cantidad</th>
                <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Descripción</th>
                <th style={{ padding: "var(--spacing-sm)", textAlign: "left", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}>Nº Serie</th>
                <th style={{ padding: "var(--spacing-sm)", textAlign: "center", fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground-secondary)" }}></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  <td style={{ padding: "var(--spacing-sm)" }}>
                    <div style={{ fontWeight: "var(--font-weight-medium)" }}>
                      {line.item_code} - {line.item_name}
                    </div>
                  </td>
                  <td style={{ padding: "var(--spacing-sm)", textAlign: "right" }}>
                    <input
                      type="number"
                      min="0.01"
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
                  <td style={{ padding: "var(--spacing-sm)" }}>
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleUpdateLine(line.id, "description", e.target.value)}
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
                  <td style={{ padding: "var(--spacing-sm)" }}>
                    <input
                      type="text"
                      value={line.serial_number || ""}
                      onChange={(e) => handleUpdateLine(line.id, "serial_number", e.target.value)}
                      placeholder="Opcional"
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
          No hay líneas añadidas. Haz clic en "Añadir Producto" para comenzar.
        </div>
      )}
    </div>
  );
}

