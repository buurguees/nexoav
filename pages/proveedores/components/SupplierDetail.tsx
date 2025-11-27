"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Edit, Trash2 } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import { fetchSupplierById, deleteSupplier, SupplierData } from "../../../lib/mocks/supplierMocks";
import { fetchExpenses, ExpenseData } from "../../../lib/mocks/expenseMocks";
import { EditSupplierModal } from "./EditSupplierModal";
import { SupplierRatesList } from "./SupplierRatesList";

interface SupplierDetailProps {
  supplierId: string;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

type TabType = "general" | "tarifas" | "productos" | "gastos";

export function SupplierDetail({
  supplierId,
  onClose,
  onUpdated,
  onDeleted,
}: SupplierDetailProps) {
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doc = await fetchSupplierById(supplierId);
        if (doc) {
          setSupplier(doc);
          // Cargar gastos del proveedor
          const allExpenses = await fetchExpenses();
          setExpenses(allExpenses.filter((e) => e.supplier_id === supplierId));
        }
      } catch (error) {
        console.error("Error al cargar proveedor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [supplierId]);

  const handleDelete = async () => {
    if (!supplier || !confirm("¿Está seguro de que desea eliminar este proveedor?")) return;

    setIsDeleting(true);
    try {
      await deleteSupplier(supplier.id);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      alert("Error al eliminar el proveedor");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (value: number | undefined | null) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value ?? 0);

  const getCategoryLabel = (category: SupplierData["category"]) => {
    const labels: Record<SupplierData["category"], string> = {
      tecnico_freelance: "Técnico Freelance",
      material: "Material",
      transporte: "Transporte",
      software: "Software",
      externo: "Externo",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            backgroundColor: "var(--background)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          Cargando proveedor...
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            backgroundColor: "var(--background)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          Proveedor no encontrado
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; show: boolean }[] = [
    { id: "general", label: "General", show: true },
    { id: "tarifas", label: "Tarifas", show: supplier.category === "tecnico_freelance" },
    { id: "productos", label: "Productos", show: supplier.category === "material" },
    { id: "gastos", label: "Gastos", show: true },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
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
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "var(--spacing-lg)",
            borderBottom: "1px solid var(--border-soft)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "var(--font-size-xl)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--foreground)",
                margin: 0,
                marginBottom: "var(--spacing-xs)",
              }}
            >
              {supplier.fiscal_name}
            </h2>
            {supplier.commercial_name && (
              <p
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--foreground-secondary)",
                  margin: 0,
                }}
              >
                {supplier.commercial_name}
              </p>
            )}
            <div style={{ display: "flex", gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--background-secondary)",
                  color: "var(--foreground-secondary)",
                }}
              >
                {getCategoryLabel(supplier.category)}
              </span>
              {supplier.internal_code && (
                <span
                  style={{
                    fontSize: "var(--font-size-xs)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--background-secondary)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {supplier.internal_code}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "center" }}>
            <button
              onClick={() => setIsEditModalOpen(true)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <IconWrapper icon={Edit} size={16} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                backgroundColor: "var(--background)",
                color: "var(--error)",
                cursor: isDeleting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              <IconWrapper icon={Trash2} size={16} />
              Eliminar
            </button>
            <button
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--foreground-tertiary)",
                cursor: "pointer",
              }}
            >
              <IconWrapper icon={X} size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-soft)",
            padding: "0 var(--spacing-lg)",
            flexShrink: 0,
          }}
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "var(--spacing-md) var(--spacing-lg)",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--primary)" : "transparent"}`,
                backgroundColor: "transparent",
                color: activeTab === tab.id ? "var(--primary)" : "var(--foreground-secondary)",
                cursor: "pointer",
                fontSize: "var(--font-size-sm)",
                fontWeight: activeTab === tab.id ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "var(--spacing-lg)" }}>
          {activeTab === "general" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              {/* Información Fiscal */}
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Información Fiscal
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                      Razón Social
                    </label>
                    <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                      {supplier.fiscal_name}
                    </p>
                  </div>
                  {supplier.commercial_name && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                        Nombre Comercial
                      </label>
                      <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                        {supplier.commercial_name}
                      </p>
                    </div>
                  )}
                  {supplier.cif && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                        CIF/NIF
                      </label>
                      <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                        {supplier.cif}
                      </p>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                      Categoría
                    </label>
                    <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                      {getCategoryLabel(supplier.category)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              {supplier.address && (supplier.address.street || supplier.address.city) && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Dirección
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                    {supplier.address.street && (
                      <div>
                        <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                          Calle
                        </label>
                        <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                          {supplier.address.street}
                        </p>
                      </div>
                    )}
                    {supplier.address.city && (
                      <div>
                        <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                          Ciudad
                        </label>
                        <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                          {supplier.address.city}
                        </p>
                      </div>
                    )}
                    {supplier.address.zip && (
                      <div>
                        <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                          Código Postal
                        </label>
                        <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                          {supplier.address.zip}
                        </p>
                      </div>
                    )}
                    {supplier.address.province && (
                      <div>
                        <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                          Provincia
                        </label>
                        <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                          {supplier.address.province}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contacto */}
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Contacto
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
                  {supplier.contact_email && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                        Email
                      </label>
                      <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                        {supplier.contact_email}
                      </p>
                    </div>
                  )}
                  {supplier.contact_phone && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                        Teléfono
                      </label>
                      <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                        {supplier.contact_phone}
                      </p>
                    </div>
                  )}
                  {supplier.payment_terms_days && (
                    <div>
                      <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                        Días de Pago
                      </label>
                      <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)" }}>
                        {supplier.payment_terms_days} días
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas */}
              <div>
                <h3
                  style={{
                    fontSize: "var(--font-size-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--foreground)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  Estadísticas
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-md)" }}>
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                      Total Facturado
                    </label>
                    <p style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--foreground)" }}>
                      {formatCurrency(supplier.total_billing)}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                      Nº Gastos
                    </label>
                    <p style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--foreground)" }}>
                      {expenses.length}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: "var(--font-size-xs)", color: "var(--foreground-tertiary)", display: "block", marginBottom: "4px" }}>
                      Estado
                    </label>
                    <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: supplier.is_active ? "var(--success)" : "var(--error)" }}>
                      {supplier.is_active ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {supplier.notes && (
                <div>
                  <h3
                    style={{
                      fontSize: "var(--font-size-lg)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--foreground)",
                      marginBottom: "var(--spacing-md)",
                    }}
                  >
                    Notas
                  </h3>
                  <p style={{ margin: 0, fontSize: "var(--font-size-base)", color: "var(--foreground)", whiteSpace: "pre-wrap" }}>
                    {supplier.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "tarifas" && (
            <div style={{ padding: "var(--spacing-lg)" }}>
              <SupplierRatesList supplierId={supplier.id} />
            </div>
          )}

          {activeTab === "productos" && (
            <div style={{ padding: "var(--spacing-xl)", textAlign: "center", color: "var(--foreground-secondary)" }}>
              <p>La gestión de productos se implementará en la Fase 4.</p>
            </div>
          )}

          {activeTab === "gastos" && (
            <div>
              <h3
                style={{
                  fontSize: "var(--font-size-lg)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--foreground)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                Gastos ({expenses.length})
              </h3>
              {expenses.length === 0 ? (
                <p style={{ color: "var(--foreground-secondary)", textAlign: "center", padding: "var(--spacing-xl)" }}>
                  No hay gastos asociados a este proveedor.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      style={{
                        padding: "var(--spacing-md)",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--background-secondary)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
                            {expense.description}
                          </p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "var(--font-size-xs)", color: "var(--foreground-secondary)" }}>
                            {expense.date_expense} • {expense.project_name || "Sin proyecto"}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontSize: "var(--font-size-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--foreground)" }}>
                            {formatCurrency(expense.amount_total)}
                          </p>
                          <p
                            style={{
                              margin: "4px 0 0 0",
                              fontSize: "var(--font-size-xs)",
                              color:
                                expense.status === "pagado"
                                  ? "var(--success)"
                                  : expense.status === "aprobado"
                                  ? "var(--primary)"
                                  : "var(--foreground-secondary)",
                            }}
                          >
                            {expense.status === "pagado"
                              ? "Pagado"
                              : expense.status === "aprobado"
                              ? "Aprobado"
                              : "Pendiente"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de edición */}
      {isEditModalOpen && supplier && (
        <EditSupplierModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          supplierId={supplier.id}
          onSave={async (updated) => {
            setSupplier(updated);
            setIsEditModalOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      )}
    </>
  );
}

