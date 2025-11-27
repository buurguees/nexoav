"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { IconWrapper } from "../../../../components/icons/desktop/IconWrapper";
import {
  fetchCompanyBanks,
  deleteCompanyBank,
  CompanyBankData,
} from "../../../../lib/mocks/companyMocks";
import { NewBankAccountModal } from "./NewBankAccountModal";
import { EditBankAccountModal } from "./EditBankAccountModal";

export function BankAccountList() {
  const [banks, setBanks] = useState<CompanyBankData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<CompanyBankData | null>(null);

  const loadBanks = async () => {
    setIsLoading(true);
    try {
      const allBanks = await fetchCompanyBanks();
      setBanks(allBanks);
    } catch (error) {
      console.error("Error al cargar cuentas bancarias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanks();
  }, []);

  const handleDelete = async (bankId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta cuenta bancaria?")) return;

    try {
      await deleteCompanyBank(bankId);
      await loadBanks();
    } catch (error) {
      console.error("Error al eliminar cuenta bancaria:", error);
      alert("Error al eliminar la cuenta bancaria");
    }
  };

  const formatIBAN = (iban: string): string => {
    const cleaned = iban.replace(/\s/g, "");
    if (cleaned.length <= 2) return cleaned;
    const country = cleaned.substring(0, 2);
    const rest = cleaned.substring(2);
    return `${country} ${rest.match(/.{1,4}/g)?.join(" ") || rest}`;
  };

  if (isLoading) {
    return (
      <div style={{ padding: "var(--spacing-xl)", textAlign: "center" }}>
        Cargando cuentas bancarias...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "var(--font-size-xl)",
              fontWeight: "var(--font-weight-semibold)",
              margin: 0,
            }}
          >
            Cuentas Bancarias
          </h2>
          <button
            onClick={() => setIsNewModalOpen(true)}
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
              fontSize: "var(--font-size-sm)",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            <IconWrapper icon={Plus} size={16} />
            Nueva Cuenta
          </button>
        </div>

        {banks.length === 0 ? (
          <div
            style={{
              padding: "var(--spacing-xl)",
              textAlign: "center",
              color: "var(--foreground-secondary)",
            }}
          >
            No hay cuentas bancarias. Añade una nueva cuenta para comenzar.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
            }}
          >
            {banks.map((bank) => (
              <div
                key={bank.id}
                style={{
                  padding: "var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  backgroundColor: "var(--background)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                    <h3
                      style={{
                        fontSize: "var(--font-size-base)",
                        fontWeight: "var(--font-weight-semibold)",
                        margin: 0,
                      }}
                    >
                      {bank.bank_name}
                    </h3>
                    {bank.is_default && (
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "rgba(67, 83, 255, 0.1)",
                          color: "rgb(67, 83, 255)",
                        }}
                      >
                        Por defecto
                      </span>
                    )}
                    {!bank.is_visible_on_invoices && (
                      <span
                        style={{
                          fontSize: "var(--font-size-xs)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: "rgba(128, 128, 128, 0.1)",
                          color: "rgb(128, 128, 128)",
                        }}
                      >
                        Oculto en facturas
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "var(--font-size-sm)",
                      color: "var(--foreground-secondary)",
                      fontFamily: "monospace",
                    }}
                  >
                    {formatIBAN(bank.iban)}
                  </p>
                  {bank.swift_bic && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "var(--font-size-xs)",
                        color: "var(--foreground-tertiary)",
                        fontFamily: "monospace",
                      }}
                    >
                      SWIFT: {bank.swift_bic}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                  <button
                    onClick={() => setEditingBank(bank)}
                    style={{
                      padding: "var(--spacing-xs) var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-xs)",
                      fontSize: "var(--font-size-xs)",
                    }}
                  >
                    <IconWrapper icon={Edit2} size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(bank.id)}
                    style={{
                      padding: "var(--spacing-xs) var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-medium)",
                      backgroundColor: "var(--background)",
                      color: "var(--error)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-xs)",
                      fontSize: "var(--font-size-xs)",
                    }}
                  >
                    <IconWrapper icon={Trash2} size={14} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isNewModalOpen && (
        <NewBankAccountModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSave={async () => {
            await loadBanks();
            setIsNewModalOpen(false);
          }}
        />
      )}

      {editingBank && (
        <EditBankAccountModal
          isOpen={!!editingBank}
          onClose={() => setEditingBank(null)}
          bank={editingBank}
          onSave={async () => {
            await loadBanks();
            setEditingBank(null);
          }}
        />
      )}
    </>
  );
}

