"use client";

import { useState, useEffect } from "react";
import { AlbaranesList } from "../../facturacion/albaranes/components/AlbaranesList";
import {
  fetchDeliveryNotes,
  DeliveryNoteData,
} from "../../../lib/mocks/deliveryNotesMocks";
import {
  fetchDeliveryNoteLines,
  DeliveryNoteLineData,
} from "../../../lib/mocks/deliveryNotesMocks";
import { fetchInventoryItems } from "../../../lib/mocks/inventoryMocks";

export interface ProyectoLogisticaTabProps {
  projectId: string;
}

/**
 * Pestaña "Logística" en el detalle de proyecto
 * Muestra albaranes del proyecto y stock en uso
 */
export function ProyectoLogisticaTab({
  projectId,
}: ProyectoLogisticaTabProps) {
  const [albaranes, setAlbaranes] = useState<DeliveryNoteData[]>([]);
  const [stockEnUso, setStockEnUso] = useState<
    Array<{
      item_id: string;
      item_name: string;
      item_code: string;
      quantity: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Cargar albaranes del proyecto
        const albaranesData = await fetchDeliveryNotes(projectId);
        setAlbaranes(albaranesData);

        // Calcular stock en uso desde albaranes outbound confirmados sin retorno
        const outboundConfirmed = albaranesData.filter(
          (a) => a.type === "outbound" && a.status === "confirmed"
        );

        const stockMap = new Map<string, number>();

        for (const albaran of outboundConfirmed) {
          // Verificar si tiene albarán de retorno
          const hasReturn = albaranesData.some(
            (a) =>
              a.type === "inbound" &&
              a.status === "confirmed" &&
              a.project_id === albaran.project_id
          );

          if (!hasReturn) {
            // Obtener líneas del albarán
            const lines = await fetchDeliveryNoteLines(albaran.id);
            lines.forEach((line) => {
              const current = stockMap.get(line.item_id) || 0;
              stockMap.set(line.item_id, current + line.quantity);
            });
          }
        }

        // Obtener nombres de ítems
        const items = await fetchInventoryItems("producto");
        const stockEnUsoArray = Array.from(stockMap.entries()).map(
          ([item_id, quantity]) => {
            const item = items.find((i) => i.id === item_id);
            return {
              item_id,
              item_name: item?.name || "Ítem no encontrado",
              item_code: item?.internal_code || "",
              quantity,
            };
          }
        );

        setStockEnUso(stockEnUsoArray);
      } catch (error) {
        console.error("Error al cargar datos de logística:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleAlbaranClick = (albaran: DeliveryNoteData) => {
    console.log("Albarán seleccionado:", albaran);
    // TODO: Implementar navegación al detalle del albarán
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--spacing-xl)",
          color: "var(--foreground-secondary)",
        }}
      >
        Cargando datos de logística...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
        padding: "var(--spacing-lg)",
      }}
    >
      {/* Sección: Albaranes del Proyecto */}
      <div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "var(--spacing-md)",
            color: "var(--foreground)",
          }}
        >
          Albaranes del Proyecto
        </h3>
        <AlbaranesList
          albaranes={albaranes}
          showFilters={true}
          showTools={true}
          onAlbaranClick={handleAlbaranClick}
          projectId={projectId}
        />
      </div>

      {/* Sección: Stock en Uso */}
      {stockEnUso.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "var(--spacing-md)",
              color: "var(--foreground)",
            }}
          >
            Stock en Uso
          </h3>
          <div
            style={{
              backgroundColor: "var(--background-secondary)",
              borderRadius: "var(--radius-md)",
              padding: "var(--spacing-md)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "var(--spacing-sm)",
              }}
            >
              {stockEnUso.map((item) => (
                <div
                  key={item.item_id}
                  style={{
                    padding: "var(--spacing-sm)",
                    backgroundColor: "var(--background)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                    {item.item_name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--foreground-secondary)",
                      marginBottom: "4px",
                    }}
                  >
                    {item.item_code}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-info)",
                    }}
                  >
                    Cantidad: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {stockEnUso.length === 0 && albaranes.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "var(--spacing-xl)",
            color: "var(--foreground-secondary)",
          }}
        >
          No hay albaranes ni stock en uso para este proyecto
        </div>
      )}
    </div>
  );
}

