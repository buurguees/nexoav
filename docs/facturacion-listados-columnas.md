# Columnas en Listados de Documentos de Venta

Documentación de las columnas estándar que deben mostrarse en los listados de Presupuestos, Proformas, Facturas y Rectificativas.

---

## Columnas Comunes

Todos los listados de documentos de venta (`sales_documents`) deben incluir las siguientes columnas:

### 1. Fecha de Emisión
- **Campo**: `date_issued`
- **Tipo**: DATE
- **Formato visual**: `DD/MM/YYYY`
- **Visible en**: Desktop, Tablet
- **Oculto en**: Mobile
- **Alineación**: Centro
- **Descripción**: Fecha en que se emitió el documento

### 2. Número de Documento
- **Campo**: `document_number`
- **Tipo**: TEXT
- **Formato visual**: Texto tal cual (ej: `E250001` para presupuesto, `FP250001` para proforma, `F-250001` para factura, `RT-250001` para rectificativa)
- **Visible en**: Desktop, Tablet, Mobile
- **Alineación**: Izquierda
- **Descripción**: Número único del documento según su tipo

### 3. Cliente
- **Campo**: `client_snapshot.fiscal_name` o `client_snapshot.commercial_name`
- **Tipo**: TEXT (desde JSONB)
- **Formato visual**: Nombre del cliente
- **Visible en**: Desktop, Tablet
- **Oculto en**: Mobile
- **Alineación**: Izquierda
- **Descripción**: Nombre del cliente desde el snapshot (inmutable)

### 4. Proyecto
- **Campo**: `project_name` (calculado desde `project_id`)
- **Tipo**: TEXT (relación)
- **Formato visual**: Nombre del proyecto
- **Visible en**: Desktop, Tablet
- **Oculto en**: Mobile
- **Alineación**: Izquierda
- **Descripción**: Nombre del proyecto asociado (opcional, puede estar vacío)

### 5. Total
- **Campo**: `totals_data.total`
- **Tipo**: NUMERIC (desde JSONB)
- **Formato visual**: Moneda (€X.XXX,XX)
- **Visible en**: Desktop, Tablet, Mobile
- **Alineación**: Derecha
- **Descripción**: Total del documento incluyendo IVA

### 6. Estado
- **Campo**: `status`
- **Tipo**: ENUM
- **Formato visual**: Badge con color según estado
- **Visible en**: Desktop, Tablet, Mobile
- **Alineación**: Centro
- **Descripción**: Estado actual del documento
- **Valores posibles**:
  - `borrador`: Gris
  - `enviado`: Azul
  - `aceptado`/`cobrada`: Verde
  - `rechazado`/`vencida`: Rojo/Naranja

### 7. Fecha de Última Actualización ⭐
- **Campo**: `updated_at`
- **Tipo**: TIMESTAMPTZ
- **Formato visual**: `DD/MM/YYYY HH:MM` (fecha y hora)
- **Visible en**: Desktop, Tablet
- **Oculto en**: Mobile
- **Alineación**: Centro
- **Descripción**: Fecha y hora de la última modificación del documento
- **Propósito**: 
  - Auditoría de cambios
  - Identificar documentos recientemente modificados
  - Seguimiento de actualizaciones

---

## Orden de Columnas Recomendado

### Desktop
1. Fecha de Emisión
2. Número de Documento
3. Cliente
4. Proyecto
5. Total
6. Estado
7. Fecha de Última Actualización

### Tablet
1. Fecha de Emisión
2. Número de Documento
3. Cliente
4. Proyecto
5. Total
6. Estado
7. Fecha de Última Actualización

### Mobile
1. Número de Documento
2. Total
3. Estado

---

## Funciones de Formateo

### Formatear Fecha de Emisión
```typescript
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
```

### Formatear Fecha de Última Actualización
```typescript
const formatUpdatedAt = (dateString?: string | null): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};
```

### Formatear Moneda
```typescript
const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null) return "-";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
```

---

## Implementación en Componentes

### Ejemplo de Columna de Última Actualización

```typescript
{
  key: "updated_at",
  label: "Última Actualización",
  align: "center",
  visibleOn: {
    desktop: true,
    tablet: true,
    mobile: false,
  },
  render: (document) => (
    <span style={{ 
      color: "var(--foreground-secondary)", 
      fontSize: "var(--font-size-sm)" 
    }}>
      {formatUpdatedAt(document.updated_at)}
    </span>
  ),
}
```

---

## Consideraciones

1. **Actualización Automática**: El campo `updated_at` se actualiza automáticamente mediante triggers o funciones de la base de datos cada vez que se modifica el documento.

2. **Zona Horaria**: Los timestamps se almacenan en UTC. Al mostrar, convertir a la zona horaria local del usuario.

3. **Rendimiento**: Para listados grandes, considerar mostrar solo la fecha (sin hora) en el listado principal y la hora completa en el detalle.

4. **Filtrado**: Permitir filtrar por fecha de última actualización para encontrar documentos modificados recientemente.

5. **Ordenamiento**: Permitir ordenar por fecha de última actualización (más recientes primero o más antiguos primero).

---

**Fecha de creación**: 2025-01-21  
**Última actualización**: 2025-01-21  
**Estado**: Documentación completa

