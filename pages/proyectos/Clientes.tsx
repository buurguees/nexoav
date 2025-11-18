"use client";

import * as React from "react";
import { fetchClients } from "../../lib/mocks/clientMocks";
import { Client } from "../../lib/types/client";
import { motion } from "motion/react";

export interface ClientesProps {
  className?: string;
}

/**
 * Página de listado de clientes
 * Muestra todos los clientes con información relevante para gestión de proyectos
 */
export function Clientes({ className }: ClientesProps) {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Cargar clientes al montar
  React.useEffect(() => {
    let isMounted = true;
    
    const loadClients = async () => {
      try {
        setLoading(true);
        const clientsData = await fetchClients();
        
        // Eliminar duplicados por ID (por si acaso)
        const uniqueClients = clientsData.filter((client, index, self) =>
          index === self.findIndex(c => c.id === client.id)
        );
        
        if (isMounted) {
          setClients(uniqueClients);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        if (isMounted) {
          setClients([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadClients();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClientClick = (client: Client) => {
    console.log("Cliente clickeado:", client);
    // TODO: Navegar a detalle del cliente o abrir modal
  };

  const handleCreateClient = () => {
    console.log("Crear nuevo cliente");
    // TODO: Abrir formulario de creación de cliente
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--foreground-secondary)",
        }}
      >
        Cargando clientes...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`page-content-scroll ${className || ''}`}
      style={{
        height: '100%',
        padding: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: 'var(--foreground)', marginBottom: 'var(--spacing-md)' }}>
          Clientes ({clients.length})
        </h1>
        <p style={{ color: 'var(--foreground-secondary)' }}>
          El componente ClientList ha sido eliminado.
        </p>
        <p style={{ color: 'var(--foreground-tertiary)', fontSize: '12px', marginTop: 'var(--spacing-sm)' }}>
          Se cargaron {clients.length} clientes correctamente.
        </p>
      </div>
    </motion.div>
  );
}

