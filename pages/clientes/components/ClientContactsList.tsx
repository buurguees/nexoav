"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Mail, Phone } from "lucide-react";
import { IconWrapper } from "../../../components/icons/desktop/IconWrapper";
import {
  fetchClientContacts,
  deleteClientContact,
  ClientContactData,
} from "../../../lib/mocks/clientContactMocks";
import { NewClientContactModal } from "./NewClientContactModal";
import { EditClientContactModal } from "./EditClientContactModal";

interface ClientContactsListProps {
  clientId: string;
}

export function ClientContactsList({ clientId }: ClientContactsListProps) {
  const [contacts, setContacts] = useState<ClientContactData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ClientContactData | null>(null);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const allContacts = await fetchClientContacts(clientId);
      setContacts(allContacts);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [clientId]);

  const handleDelete = async (contactId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este contacto?")) return;

    try {
      await deleteClientContact(contactId);
      await loadContacts();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      alert("Error al eliminar el contacto");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "var(--spacing-md)", textAlign: "center" }}>
        Cargando contactos...
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "var(--font-weight-semibold)",
              margin: 0,
            }}
          >
            Contactos
          </h3>
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
            Nuevo Contacto
          </button>
        </div>

        {contacts.length === 0 ? (
          <div
            style={{
              padding: "var(--spacing-xl)",
              textAlign: "center",
              color: "var(--foreground-secondary)",
            }}
          >
            No hay contactos. Añade un nuevo contacto para comenzar.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-sm)",
            }}
          >
            {contacts.map((contact) => (
              <div
                key={contact.id}
                style={{
                  padding: "var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-medium)",
                  backgroundColor: "var(--background)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                      <h4
                        style={{
                          fontSize: "var(--font-size-base)",
                          fontWeight: "var(--font-weight-semibold)",
                          margin: 0,
                        }}
                      >
                        {contact.full_name}
                      </h4>
                      {contact.is_primary && (
                        <span
                          style={{
                            fontSize: "var(--font-size-xs)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "rgba(67, 83, 255, 0.1)",
                            color: "rgb(67, 83, 255)",
                          }}
                        >
                          Principal
                        </span>
                      )}
                      {contact.is_billing_contact && (
                        <span
                          style={{
                            fontSize: "var(--font-size-xs)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "rgba(0, 200, 117, 0.1)",
                            color: "rgb(0, 200, 117)",
                          }}
                        >
                          Facturación
                        </span>
                      )}
                    </div>
                    {contact.position && (
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: "var(--font-size-sm)",
                          color: "var(--foreground-secondary)",
                        }}
                      >
                        {contact.position}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        marginTop: "var(--spacing-xs)",
                      }}
                    >
                      {contact.email && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-xs)",
                            fontSize: "var(--font-size-sm)",
                            color: "var(--foreground-secondary)",
                          }}
                        >
                          <IconWrapper icon={Mail} size={14} />
                          {contact.email}
                        </div>
                      )}
                      {contact.phone && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--spacing-xs)",
                            fontSize: "var(--font-size-sm)",
                            color: "var(--foreground-secondary)",
                          }}
                        >
                          <IconWrapper icon={Phone} size={14} />
                          {contact.phone}
                        </div>
                      )}
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "var(--spacing-xs)",
                          marginTop: "var(--spacing-xs)",
                        }}
                      >
                        {contact.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: "var(--font-size-xs)",
                              padding: "2px 6px",
                              borderRadius: "var(--radius-sm)",
                              backgroundColor: "var(--background-secondary)",
                              color: "var(--foreground-secondary)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {contact.notes && (
                      <p
                        style={{
                          margin: "var(--spacing-xs) 0 0",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--foreground-tertiary)",
                          fontStyle: "italic",
                        }}
                      >
                        {contact.notes}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                    <button
                      onClick={() => setEditingContact(contact)}
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
                      onClick={() => handleDelete(contact.id)}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {isNewModalOpen && (
        <NewClientContactModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          clientId={clientId}
          onSave={async () => {
            await loadContacts();
            setIsNewModalOpen(false);
          }}
        />
      )}

      {editingContact && (
        <EditClientContactModal
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          contact={editingContact}
          onSave={async () => {
            await loadContacts();
            setEditingContact(null);
          }}
        />
      )}
    </>
  );
}

