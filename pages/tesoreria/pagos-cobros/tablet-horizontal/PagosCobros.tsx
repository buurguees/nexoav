"use client";

/**
 * Página de Pagos y Cobros - Versión Tablet Horizontal (768px - 1024px, horizontal)
 * Layout: 70/30 horizontal
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
          fontSize: "11px",
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
            fontSize: "9px",
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

export function PagosCobrosTabletHorizontal() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "var(--spacing-xs)",
        padding: "var(--spacing-xs)",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xs)",
          width: "70%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--spacing-xs)",
            height: "35px",
            flexShrink: 0,
          }}
        >
          <SpaceBlock label="Filtros" height="100%" color="rgba(255, 165, 0, 0.15)" />
          <SpaceBlock label="Título: Pagos y Cobros" height="100%" color="var(--background-secondary)" />
          <SpaceBlock label="Herramientas" height="100%" color="rgba(67, 83, 255, 0.15)" />
        </div>
        <div style={{ flexShrink: 0, minHeight: "35px" }}>
          <SpaceBlock label="Cabecera de la Tabla" height="35px" color="rgba(0, 200, 117, 0.15)" />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
          <SpaceBlock label="Listado de Pagos y Cobros" height="100%" color="rgba(0, 200, 117, 0.1)" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-xs)",
          width: "30%",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--spacing-xs)", height: "35px", flexShrink: 0 }}>
          <SpaceBlock label="Resumen" height="100%" color="var(--background-secondary)" />
          <SpaceBlock label="Filtro" height="100%" color="rgba(255, 165, 0, 0.15)" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--spacing-xs)", flexShrink: 0 }}>
          <SpaceBlock label="Total Pagos" height="60px" color="rgba(220, 53, 69, 0.2)" borderWidth="2px" />
          <SpaceBlock label="Total Cobros" height="60px" color="rgba(0, 200, 117, 0.2)" borderWidth="2px" />
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
          <SpaceBlock label="Gráfico: Pagos vs Cobros" height="100%" color="rgba(67, 83, 255, 0.15)" />
        </div>
      </div>
    </div>
  );
}

