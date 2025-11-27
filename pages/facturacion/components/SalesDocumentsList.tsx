"use client";

import { DataList, DataListColumn } from "../../../components/list";
import { useState, useMemo, useRef, useEffect } from "react";
import { SalesDocumentData } from "../../../lib/mocks/salesDocumentsMocks";
import { useBreakpoint } from "../../../hooks/useBreakpoint";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Componente genérico para listados de documentos de venta (presupuestos, proformas, etc.)
 * usando el componente reutilizable DataList.
 */

export interface SalesDocumentsListLabels {
  title: string;
  searchPlaceholder: string;
  newButtonLabel: string;
  emptyMessage: string;
  documentSingular: string; // usado para logs/acciones
}

export interface SalesDocumentsListProps {
  documents: SalesDocumentData[];
  showFilters?: boolean;
  showTools?: boolean;
  onDocumentClick?: (document: SalesDocumentData) => void;
  onNewClick?: () => void;
  labels: SalesDocumentsListLabels;
}

// Función para formatear fecha
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "-";
  }
};

// Función para formatear moneda
const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Función para obtener el color del estado
const getStatusColor = (
  status: SalesDocumentData["status"]
): { bg: string; text: string } => {
  const colors: Record<
    SalesDocumentData["status"],
    { bg: string; text: string }
  > = {
    borrador: {
      bg: "rgba(128, 128, 128, 0.1)",
      text: "rgb(128, 128, 128)",
    },
    enviado: {
      bg: "rgba(67, 83, 255, 0.1)",
      text: "rgb(67, 83, 255)",
    },
    aceptado: {
      bg: "rgba(0, 200, 117, 0.1)",
      text: "rgb(0, 200, 117)",
    },
    cobrada: {
      bg: "rgba(0, 200, 117, 0.1)",
      text: "rgb(0, 200, 117)",
    },
    rechazado: {
      bg: "rgba(220, 53, 69, 0.1)",
      text: "rgb(220, 53, 69)",
    },
    vencida: {
      bg: "rgba(255, 165, 0, 0.1)",
      text: "rgb(255, 165, 0)",
    },
  };
  return colors[status] || { bg: "rgba(128, 128, 128, 0.1)", text: "rgb(128, 128, 128)" };
};

// Función para formatear el estado
const formatStatus = (status: SalesDocumentData["status"]): string => {
  const labels: Record<SalesDocumentData["status"], string> = {
    borrador: "Borrador",
    enviado: "Enviado",
    aceptado: "Aceptado",
    cobrada: "Cobrada",
    rechazado: "Rechazado",
    vencida: "Vencida",
  };
  return labels[status] || status;
};

// Componente de menú de acciones
interface ActionMenuProps {
  document: SalesDocumentData;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  labels: SalesDocumentsListLabels;
}

function ActionMenu({ document, isOpen, onToggle, onClose, labels }: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number; showAbove: boolean } | null>(null);

  // Calcular posición del menú cuando se abre
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Calcular si hay espacio arriba, si no, mostrar abajo
      const menuHeight = 200; // Altura aproximada del menú (4 botones)
      const spaceAbove = rect.top;
      
      if (spaceAbove >= menuHeight) {
        // Mostrar arriba
        setMenuPosition({
          top: rect.top,
          right: window.innerWidth - rect.right,
          showAbove: true,
        });
      } else {
        // Mostrar abajo
        setMenuPosition({
          top: rect.bottom,
          right: window.innerWidth - rect.right,
          showAbove: false,
        });
      }
    } else {
      setMenuPosition(null);
    }
  }, [isOpen]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.document.addEventListener("mousedown", handleClickOutside);
    window.document.addEventListener("keydown", handleEscape);
    return () => {
      window.document.removeEventListener("mousedown", handleClickOutside);
      window.document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleAction = (action: string) => {
    console.log(`${action} ${labels.documentSingular}:`, document.document_number);
    // TODO: Implementar acciones
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <motion.button
          ref={buttonRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: isOpen ? "var(--background-secondary)" : "transparent",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "2.5px",
            alignItems: "center",
            justifyContent: "center",
            color: isOpen ? "var(--foreground)" : "var(--foreground-secondary)",
            borderRadius: "var(--radius-sm)",
            transition: "all 0.2s ease",
            minWidth: "32px",
            minHeight: "32px",
            width: "100%",
            height: "100%",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = "var(--background-secondary)";
              e.currentTarget.style.color = "var(--foreground)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--foreground-secondary)";
            }
          }}
        >
          <div
            style={{
              width: "2.5px",
              height: "2.5px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
              transition: "transform 0.2s",
              transform: isOpen ? "scale(1.2)" : "scale(1)",
            }}
          />
          <div
            style={{
              width: "2.5px",
              height: "2.5px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
              transition: "transform 0.2s",
              transform: isOpen ? "scale(1.2)" : "scale(1)",
            }}
          />
          <div
            style={{
              width: "2.5px",
              height: "2.5px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
              transition: "transform 0.2s",
              transform: isOpen ? "scale(1.2)" : "scale(1)",
            }}
          />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && menuPosition && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              onClick={onClose}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
                backgroundColor: "transparent",
              }}
            />
            {/* Menú */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`,
                transform: menuPosition.showAbove ? "translateY(-100%)" : "translateY(4px)",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                minWidth: "160px",
                overflow: "visible",
                padding: "4px",
                display: "flex",
                flexDirection: "column",
                maxHeight: "none",
              }}
            >
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Editar");
                }}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--foreground)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Editar
              </motion.button>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Descargar");
                }}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--foreground)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Descargar
              </motion.button>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Anular");
                }}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--foreground)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Anular
              </motion.button>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction("Compartir");
                }}
                style={{
                  width: "100%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--foreground)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  cursor: "pointer",
                  borderRadius: "var(--radius-sm)",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--background-secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Compartir
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function SalesDocumentsList({
  documents,
  showFilters = true,
  showTools = true,
  onDocumentClick,
  onNewClick,
  labels,
}: SalesDocumentsListProps) {
  const breakpoint = useBreakpoint();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterClient, setFilterClient] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Obtener clientes únicos para el filtro
  const clients = useMemo(() => {
    const clientSet = new Set(
      documents
        .map((p) => p.client_name)
        .filter((name): name is string => !!name)
    );
    return Array.from(clientSet).sort();
  }, [documents]);

  // Filtrar documentos según los filtros aplicados
  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        document.document_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        document.client_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        document.project_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Filtro de estado
      const matchesStatus =
        filterStatus === "" || document.status === filterStatus;

      // Filtro de cliente
      const matchesClient =
        filterClient === "" || document.client_name === filterClient;

      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [documents, searchTerm, filterStatus, filterClient]);

  // Definir las columnas del listado
  const columns: DataListColumn<SalesDocumentData>[] = useMemo(() => {
    return [
      {
        key: "date_issued",
        label: "Fecha",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (presupuesto) => (
          <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
            {formatDate(presupuesto.date_issued)}
          </span>
        ),
      },
      {
        key: "document_number",
        label: "Num",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (presupuesto) => (
          <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
            {presupuesto.document_number || "-"}
          </span>
        ),
      },
      {
        key: "client_name",
        label: "Cliente",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (presupuesto) => (
          <span style={{ color: "var(--foreground)" }}>
            {presupuesto.client_name || "-"}
          </span>
        ),
      },
      {
        key: "project_name",
        label: "Proyecto",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (presupuesto) => {
          if (!presupuesto.project_name) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          const projectRef = (presupuesto as any).project_ref;
          return (
            <div>
              {projectRef && (
                <span
                  style={{
                    fontWeight: "var(--font-weight-medium)",
                    color: "var(--foreground-secondary)",
                    fontSize: "var(--font-size-sm)",
                    marginRight: "var(--spacing-xs)",
                  }}
                >
                  {projectRef}
                </span>
              )}
              <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
                {presupuesto.project_name}
              </span>
            </div>
          );
        },
      },
      {
        key: "subtotal",
        label: "Subtotal",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (presupuesto) => {
          const subtotal = presupuesto.totals_data?.base_imponible ?? presupuesto.totals_data?.base ?? 0;
          if (subtotal === 0) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
            );
          }
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {formatCurrency(subtotal)}
            </span>
          );
        },
      },
      {
        key: "total",
        label: "Total",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (presupuesto) => {
          const total = presupuesto.totals_data?.total ?? 0;
          if (total === 0) {
            return (
              <span style={{ color: "var(--foreground-tertiary)" }}>-</span>
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
        key: "status",
        label: "Estado",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: true,
        },
        render: (presupuesto) => {
          const statusColors = getStatusColor(presupuesto.status);
          return (
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-medium)",
                backgroundColor: statusColors.bg,
                color: statusColors.text,
              }}
            >
              {formatStatus(presupuesto.status)}
            </span>
          );
        },
      },
      {
        key: "is_invoiced",
        label: "Facturado",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (presupuesto) => {
          const isInvoiced = (presupuesto as any).is_invoiced ?? false;
          return (
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-medium)",
                backgroundColor: isInvoiced
                  ? "rgba(0, 200, 117, 0.1)"
                  : "rgba(255, 165, 0, 0.1)",
                color: isInvoiced
                  ? "rgb(0, 200, 117)"
                  : "rgb(255, 165, 0)",
              }}
            >
              {isInvoiced ? "Facturado" : "Pendiente"}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: "",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (document) => {
          return (
            <ActionMenu
              document={document}
              isOpen={openMenuId === document.id}
              onToggle={() => {
                setOpenMenuId(openMenuId === document.id ? null : document.id);
              }}
              onClose={() => setOpenMenuId(null)}
              labels={labels}
            />
          );
        },
      },
      {
        key: "last_modified",
        label: "Modificado",
        align: "center",
        visibleOn: {
          desktop: true,
          tablet: true,
          mobile: false,
        },
        render: (presupuesto) => {
          const lastModified = (presupuesto as any).last_modified || (presupuesto as any).updated_at || presupuesto.date_issued;
          return (
            <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
              {formatDate(lastModified)}
            </span>
          );
        },
      },
    ];
  }, [openMenuId]);

  // Calcular grid columns personalizado para documentos
  const documentsGridColumns = useMemo(() => {
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
      // Orden: Fecha | Nº Documento | Cliente | Proyecto | Subtotal | Total | Estado | Facturado | Acciones | Modificado
      // Optimizado: Cliente y Proyecto con espacio suficiente, Estado y Facturado juntos, Acciones compacto
      return "0.5fr 0.5fr 1.3fr 1.5fr 0.9fr 0.9fr 0.7fr 0.7fr 0.4fr 0.7fr";
    } else if (count === 9) {
      // Desktop/Tablet-horizontal: 9 columnas (sin Proyecto)
      // Orden: Fecha | Nº Documento | Cliente | Subtotal | Total | Estado | Facturado | Acciones | Modificado
      // Optimizado: Cliente con más espacio al no tener Proyecto
      return "0.5fr 0.5fr 1.6fr 0.9fr 0.9fr 0.7fr 0.7fr 0.4fr 0.7fr";
    } else if (count === 8) {
      // Tablet: 8 columnas (con Proyecto, sin Modificado)
      // Orden: Fecha | Nº Documento | Cliente | Proyecto | Subtotal | Total | Estado | Facturado | Acciones
      return "0.6fr 0.6fr 1.4fr 1.1fr 0.9fr 0.9fr 0.7fr 0.7fr 0.4fr";
    } else if (count === 7) {
      // Tablet: 7 columnas (sin Proyecto, sin Modificado)
      // Orden: Fecha | Nº Documento | Cliente | Subtotal | Total | Estado | Facturado | Acciones
      return "0.7fr 0.7fr 1.6fr 0.9fr 0.9fr 0.7fr 0.7fr 0.4fr";
    } else if (count === 6) {
      // Tablet: 6 columnas (sin Proyecto, sin Acciones, sin Modificado)
      // Orden: Fecha | Nº Documento | Cliente | Subtotal | Total | Estado | Facturado
      return "0.8fr 0.8fr 1.9fr 0.9fr 0.9fr 0.7fr 0.7fr";
    } else if (count === 5) {
      // Tablet portrait: 5 columnas
      // Orden: Fecha | Nº Documento | Cliente | Total | Estado
      return "1fr 1.2fr 2.5fr 1.1fr 1.1fr";
    } else if (count === 4) {
      // Mobile: 4 columnas
      // Orden: Nº Documento | Cliente | Total | Estado
      return "1fr 1.2fr 2.5fr 1fr";
    } else {
      // Mobile: 3 columnas (Nº Documento | Cliente | Estado)
      return "1.2fr 2.5fr 1fr";
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
        placeholder={labels.searchPlaceholder}
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
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
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
        <option value="">Todos los estados</option>
        <option value="borrador">Borrador</option>
        <option value="enviado">Enviado</option>
        <option value="aceptado">Aceptado</option>
        <option value="rechazado">Rechazado</option>
        <option value="vencida">Vencida</option>
      </select>
      <select
        value={filterClient}
        onChange={(e) => setFilterClient(e.target.value)}
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
        <option value="">Todos los clientes</option>
        {clients.map((client) => (
          <option key={client} value={client}>
            {client}
          </option>
        ))}
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
          if (onNewClick) {
            onNewClick();
          }
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
        {labels.newButtonLabel}
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
      title={labels.title}
      data={filteredDocuments}
      columns={columns}
      showFilters={showFilters}
      showTools={showTools}
      renderFilters={renderFilters}
      renderTools={renderTools}
      onRowClick={onDocumentClick}
      emptyMessage={labels.emptyMessage}
      customGridColumns={documentsGridColumns}
    />
  );
}

