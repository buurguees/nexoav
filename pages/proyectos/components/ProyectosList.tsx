"use client";

import { DataList, DataListColumn } from "../../../components/list";
import { useState, useMemo } from "react";
import { NewProjectModal } from "./NewProjectModal";
import { createProject } from "../../../lib/mocks/projectMocks";
import { useBreakpoint } from "../../../hooks/useBreakpoint";

/**
 * Componente de listado de proyectos usando el componente reutilizable DataList
 * 
 * Este componente muestra cómo usar DataList para mostrar proyectos con:
 * - Título: "Proyectos"
 * - Filtros: activables
 * - Herramientas: activables
 * - Columnas responsivas según breakpoint
 * 
 * Basado en el schema de la tabla `projects` de la base de datos (docs/base-de-datos.md)
 */

// Tipo para los datos de proyecto según el schema de la BD
// Tabla: projects (docs/base-de-datos.md, línea 493)
export interface ProjectData {
  id: string; // PK (UUID)
  internal_ref: string; // Referencia interna/secuencial (ej: "0061")
  client_id: string; // FK (UUID) → clients.id
  client_po_number?: string; // Número de pedido del cliente
  name: string; // Nombre del proyecto
  status: "borrador" | "presupuestado" | "aceptado" | "ejecutando" | "finalizado" | "cancelado"; // Estado del proyecto
  location_name?: string; // Nombre de la ubicación
  location_address?: {
    street?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  }; // Dirección estructurada de la ubicación (JSONB)
  location_coords?: {
    lat?: number;
    lng?: number;
  }; // Coordenadas (lat, lng) para el mapa (JSONB)
  start_date?: string; // Fecha de inicio (ISO 8601)
  end_date?: string; // Fecha de finalización (ISO 8601)
  description?: string; // Descripción del proyecto
  budget_estimated?: number; // Presupuesto estimado
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
  // Campos calculados/relacionados (no están en la BD pero se pueden obtener con JOINs)
  client_name?: string; // Nombre del cliente (desde clients.fiscal_name o commercial_name)
  total_billing?: number; // Total facturado del proyecto (calculado desde sales_documents)
}

interface ProyectosListProps {
  projects: ProjectData[];
  showFilters?: boolean;
  showTools?: boolean;
  onProjectClick?: (project: ProjectData) => void;
  onProjectCreated?: (project: ProjectData) => void; // Callback cuando se crea un proyecto
}

// Función para formatear fecha
const formatDate = (dateString?: string): string => {
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
  }).format(amount);
};

// Función para obtener el color del estado
const getStatusColor = (status: ProjectData["status"]): string => {
  const colors: Record<ProjectData["status"], string> = {
    borrador: "var(--foreground-tertiary)",
    presupuestado: "var(--color-warning)",
    aceptado: "var(--color-info)",
    ejecutando: "var(--color-success)",
    finalizado: "var(--foreground-secondary)",
    cancelado: "var(--color-error)",
  };
  return colors[status] || "var(--foreground-secondary)";
};

// Función para formatear el estado
const formatStatus = (status: ProjectData["status"]): string => {
  const labels: Record<ProjectData["status"], string> = {
    borrador: "Borrador",
    presupuestado: "Presupuestado",
    aceptado: "Aceptado",
    ejecutando: "Ejecutando",
    finalizado: "Finalizado",
    cancelado: "Cancelado",
  };
  return labels[status] || status;
};

export function ProyectosList({
  projects,
  showFilters = true,
  showTools = true,
  onProjectClick,
  onProjectCreated,
}: ProyectosListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProjectData["status"] | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const breakpoint = useBreakpoint();

  // Filtrar proyectos según los filtros aplicados
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filtro de búsqueda
      const matchesSearch =
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.internal_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location_name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de estado
      const matchesStatus = filterStatus === "all" || project.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  // Definir las columnas del listado
  const columns: DataListColumn<ProjectData>[] = [
    {
      key: "internal_ref",
      label: "Código",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
      render: (project) => (
        <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
          {project.internal_ref}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nombre",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
      render: (project) => (
        <span style={{ fontWeight: "var(--font-weight-medium)", color: "var(--foreground)" }}>
          {project.name}
        </span>
      ),
    },
    {
      key: "client_name",
      label: "Cliente",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
      render: (project) => (
        <span style={{ color: "var(--foreground-secondary)" }}>
          {project.client_name || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: true,
      },
      render: (project) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-xs)",
            fontWeight: "var(--font-weight-medium)",
            backgroundColor: getStatusColor(project.status) === "var(--color-success)" 
              ? "rgba(0, 200, 117, 0.1)"
              : getStatusColor(project.status) === "var(--color-warning)"
              ? "rgba(255, 165, 0, 0.1)"
              : getStatusColor(project.status) === "var(--color-info)"
              ? "rgba(67, 83, 255, 0.1)"
              : getStatusColor(project.status) === "var(--color-error)"
              ? "rgba(220, 53, 69, 0.1)"
              : "rgba(128, 128, 128, 0.1)",
            color: getStatusColor(project.status),
          }}
        >
          {formatStatus(project.status)}
        </span>
      ),
    },
    {
      key: "start_date",
      label: "Fecha Inicio",
      visibleOn: {
        desktop: true,
        tablet: false,
        mobile: false,
      },
      render: (project) => (
        <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
          {formatDate(project.start_date)}
        </span>
      ),
    },
    {
      key: "end_date",
      label: "Fecha Fin",
      visibleOn: {
        desktop: true,
        tablet: false,
        mobile: false,
      },
      render: (project) => (
        <span style={{ color: "var(--foreground-secondary)", fontSize: "var(--font-size-sm)" }}>
          {formatDate(project.end_date)}
        </span>
      ),
    },
    {
      key: "budget_estimated",
      label: "Presupuesto",
      align: "right",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
      render: (project) => {
        const budget = project.budget_estimated ?? 0;
        if (budget === 0) {
          return (
            <span style={{ color: "var(--foreground-tertiary)" }}>
              €0,00
            </span>
          );
        }
        return (
          <span style={{ fontWeight: "var(--font-weight-medium)" }}>
            {formatCurrency(budget)}
          </span>
        );
      },
    },
    {
      key: "total_billing",
      label: "Facturación",
      align: "right",
      visibleOn: {
        desktop: true,
        tablet: true,
        mobile: false,
      },
      render: (project) => {
        const total = project.total_billing ?? 0;
        if (total === 0) {
          return (
            <span style={{ color: "var(--foreground-tertiary)" }}>
              €0,00
            </span>
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
      key: "location_name",
      label: "Ubicación",
      visibleOn: {
        desktop: false,
        tablet: true,
        mobile: false,
      },
      render: (project) => (
        <span style={{ color: "var(--foreground-tertiary)", fontSize: "var(--font-size-sm)" }}>
          {project.location_name || "-"}
        </span>
      ),
    },
  ];

  // Calcular grid columns personalizado para proyectos
  // Los nombres de proyectos son más cortos, así que no necesitan tanto espacio
  const projectsGridColumns = useMemo(() => {
    const isDesktop = breakpoint === "desktop";
    const isTablet = breakpoint === "tablet"; // Tablet horizontal
    const isTabletPortrait = breakpoint === "tablet-portrait";
    
    // Contar columnas visibles
    const visibleCols = columns.filter((col) => {
      if (isDesktop || isTablet) return col.visibleOn?.desktop !== false;
      if (isTabletPortrait) return col.visibleOn?.tablet !== false;
      return col.visibleOn?.mobile !== false;
    });
    
    const count = Math.min(visibleCols.length, 8); // Máximo 8 columnas
    
    if (count >= 8) {
      // Desktop/Tablet-horizontal: 8 columnas (Código | Nombre | Cliente | Estado | Fecha Inicio | Fecha Fin | Presupuesto | Facturación)
      // Ajustado: fechas más compactas, mejor distribución del espacio
      return "0.7fr 2.2fr 1.4fr 1fr 0.9fr 0.9fr 1.2fr 1.3fr";
    } else if (count === 7) {
      // Si hay 7 columnas (sin una fecha)
      return "0.7fr 2.3fr 1.4fr 1fr 0.9fr 1.2fr 1.3fr";
    } else if (count === 6) {
      // Si hay 6 columnas
      return "0.7fr 2.4fr 1.5fr 1.1fr 1.2fr 1.3fr";
    } else if (count === 5) {
      // Tablet-horizontal: 5 columnas
      return "0.8fr 2.5fr 1.5fr 1.1fr 1.4fr";
    } else if (count === 4) {
      // Tablet portrait: 4 columnas
      return "0.9fr 2.8fr 1.3fr 1.5fr";
    } else {
      // Mobile: 3 columnas (Código | Nombre | Estado)
      return "0.9fr 3.5fr 1.1fr";
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
        placeholder="Buscar proyecto..."
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
        onChange={(e) => setFilterStatus(e.target.value as ProjectData["status"] | "all")}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          cursor: "pointer",
        }}
      >
        <option value="all">Todos</option>
        <option value="borrador">Borrador</option>
        <option value="presupuestado">Presupuestado</option>
        <option value="aceptado">Aceptado</option>
        <option value="ejecutando">Ejecutando</option>
        <option value="finalizado">Finalizado</option>
        <option value="cancelado">Cancelado</option>
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
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          fontWeight: "var(--font-weight-medium)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background)";
        }}
      >
        + Nuevo Proyecto
      </button>
      <button
        type="button"
        style={{
          padding: "var(--spacing-sm) var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-medium)",
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: "var(--font-size-sm)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background)";
        }}
      >
        Exportar
      </button>
    </div>
  );

  // Manejar creación de proyecto
  const handleCreateProject = async (projectData: any) => {
    try {
      const newProject = await createProject(projectData);
      onProjectCreated?.(newProject);
      setIsModalOpen(false);
      // TODO: Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      // TODO: Mostrar mensaje de error
      throw error; // Re-lanzar para que el modal maneje el error
    }
  };

  return (
    <>
    <DataList
      title="Proyectos"
      data={filteredProjects}
      columns={columns}
      showFilters={showFilters}
      showTools={showTools}
      renderFilters={renderFilters}
      renderTools={renderTools}
      onRowClick={onProjectClick}
      emptyMessage="No se encontraron proyectos"
        customGridColumns={projectsGridColumns}
      />
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProject}
      />
    </>
  );
}

