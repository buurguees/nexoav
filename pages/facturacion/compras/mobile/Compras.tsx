"use client";

/**
 * Página de Compras - Versión Mobile (< 768px)
 */

interface SpaceBlockProps {
  label: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  description?: string;
  borderStyle?: "dashed" | "solid";
  borderWidth?: string;
}

function SpaceBlock({
  label,
  width = "100%",
  height = "200px",
  color = "var(--background-secondary)",
  description,
  borderStyle = "dashed",
  borderWidth = "2px"
}: SpaceBlockProps) {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: color,
        border: `${borderWidth} ${borderStyle} var(--border-medium)`,
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-xs)",
        position: "relative",
        minHeight: typeof height === "number" ? `${height}px` : height,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--foreground-secondary)",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: "8px",
            color: "var(--foreground-tertiary)",
            textAlign: "center",
            marginTop: "var(--spacing-xs)",
            maxWidth: "80%",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}

export function ComprasMobile() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-sm)",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "var(--spacing-sm)",
          height: "100px",
          flexShrink: 0,
          minHeight: "100px",
        }}
      >
        <SpaceBlock label="Total Compras" height="100%" color="rgba(0, 200, 117, 0.2)" borderWidth="2px" />
        <SpaceBlock label="Pagadas" height="100%" color="rgba(67, 83, 255, 0.2)" borderWidth="2px" />
        <SpaceBlock label="Importe Total" height="100%" color="rgba(255, 165, 0, 0.2)" borderWidth="2px" />
        <SpaceBlock label="Pendientes" height="100%" color="rgba(220, 53, 69, 0.2)" borderWidth="2px" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", flexShrink: 0 }}>
          <SpaceBlock label="Título: Compras" height="30px" color="var(--background-secondary)" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-sm)", height: "30px" }}>
            <SpaceBlock label="Filtros" height="100%" color="rgba(255, 165, 0, 0.15)" />
            <SpaceBlock label="Herramientas" height="100%" color="rgba(67, 83, 255, 0.15)" />
          </div>
        </div>
        <div style={{ flexShrink: 0, minHeight: "30px" }}>
          <SpaceBlock label="Cabecera de la Tabla" height="30px" color="rgba(0, 200, 117, 0.15)" />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
          <SpaceBlock label="Listado de Compras" height="100%" color="rgba(0, 200, 117, 0.1)" />
        </div>
      </div>
    </div>
  );
}

