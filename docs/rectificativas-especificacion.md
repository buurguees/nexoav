# Especificación: Módulo de Rectificativas

Documentación completa para la implementación del módulo de facturas rectificativas en NEXOAV.

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Restricciones Importantes](#restricciones-importantes)
3. [Numeración Automática](#numeración-automática)
4. [Estructura del Documento](#estructura-del-documento)
5. [Gestión de Líneas](#gestión-de-líneas)
6. [Cálculos y Totales](#cálculos-y-totales)
7. [Flujo de Trabajo](#flujo-de-trabajo)

---

## Visión General

Las facturas rectificativas permiten corregir errores o modificar facturas ya emitidas. Son documentos legales que anulan o corrigen total o parcialmente una factura original.

**Tipo de documento**: `rectificativa` (tabla `sales_documents`)

**Características principales**:
- Siempre deben estar vinculadas a una factura original
- Pueden tener cantidades negativas para anular conceptos
- Los totales pueden ser negativos
- Mantienen el mismo número que la factura original (con prefijo `RT-`)

---

## Restricciones Importantes

### ⚠️ CRÍTICO: Solo desde Facturas

**Las rectificativas SOLO pueden generarse a partir de Facturas.**

- ❌ **NO se pueden crear rectificativas desde presupuestos**
- ❌ **NO se pueden crear rectificativas desde proformas**
- ✅ **SÍ se pueden crear rectificativas desde facturas**

**Razón legal**: Las rectificativas son documentos fiscales que modifican facturas ya emitidas. Los presupuestos y proformas no son documentos fiscales definitivos, por lo que no requieren rectificación.

### Validación en la Aplicación

Al crear una rectificativa, validar que:
1. El documento origen (`rectifies_document_id`) existe
2. El documento origen tiene `type = 'factura'`
3. El documento origen no es otra rectificativa (no se pueden rectificar rectificativas)

---

## Numeración Automática

### Formato de Numeración

**Formato**: `RT-{YY}{NNNNN}`

- `RT-`: Prefijo fijo para rectificativas (con guion)
- `YY`: Año (2 dígitos, mismo que la factura original)
- `NNNNN`: Número secuencial (mismo que la factura original)

**Ejemplos**:
- Factura: `F-250001` → Rectificativa: `RT-250001`
- Factura: `F-250066` → Rectificativa: `RT-250066`

### Lógica de Generación

**Al crear una rectificativa desde una factura**:

1. Obtener el `document_number` de la factura original
2. Extraer el año y número secuencial: `F-250001` → año: `25`, número: `00001`
3. Generar el nuevo número: `RT-250001`

**Ventajas**:
- Relación clara entre factura y rectificativa
- Fácil identificación del documento origen
- Numeración consistente

---

## Estructura del Documento

### Campos Específicos de Rectificativas

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `type` | ENUM | Debe ser `"rectificativa"` | `"rectificativa"` |
| `document_number` | TEXT | Número de rectificativa | `"RT-250001"` |
| `rectifies_document_id` | FK (UUID) | **ID de la factura original** (obligatorio) | UUID → `sales_documents.id` |
| `client_snapshot` | JSONB | Datos fiscales congelados (igual que factura original) | Mismo que factura |
| `totals_data` | JSONB | Totales (pueden ser negativos) | `{"total": -338.80}` |

### Relación con Factura Original

**Campo `rectifies_document_id`**:
- Debe apuntar siempre a una factura (`type = 'factura'`)
- Es obligatorio para rectificativas
- Permite rastrear qué factura se está rectificando

**Datos copiados de la factura original**:
- `client_id`: Mismo cliente
- `client_snapshot`: Mismos datos fiscales (inmutabilidad)
- `project_id`: Mismo proyecto (si existe)

---

## Gestión de Líneas

### Líneas con Cantidades Negativas

Las rectificativas pueden tener líneas con cantidades negativas para anular conceptos de la factura original.

**Ejemplo**:
```json
{
  "concept": "Jornada Técnico General",
  "description": "Rectificación: Anulación de 1 jornada por error en facturación original",
  "quantity": -1.00,
  "unit_price": 280.00,
  "discount_percent": 0.00,
  "subtotal": -280.00,
  "tax_percent": 21.00,
  "total_line": -338.80,
  "grouping_tag": "Servicios"
}
```

### Tipos de Rectificativas

1. **Rectificativa por Anulación**:
   - Anula total o parcialmente la factura original
   - Líneas con cantidades negativas
   - Total negativo

2. **Rectificativa por Corrección**:
   - Corrige errores en la factura original
   - Puede tener líneas positivas y negativas
   - Total puede ser positivo, negativo o cero

### Separación Productos/Servicios

Las rectificativas también se organizan en dos secciones:
- **Productos** (`grouping_tag = "Productos"`)
- **Servicios** (`grouping_tag = "Servicios"`)

---

## Cálculos y Totales

### Totales Negativos

Las rectificativas pueden tener totales negativos cuando anulan conceptos.

**Estructura de `totals_data`**:
```typescript
{
  vat_breakdown: {
    "21": {
      base: -280.00,
      vat: -58.80,
      total: -338.80
    },
    // ... otros tipos de IVA
  },
  total_discount: 0.00,
  base_imponible: -280.00,
  total_vat: -58.80,
  total: -338.80
}
```

### Cálculo de Totales

**Algoritmo** (igual que otros documentos, pero permite negativos):

1. **Inicializar desglose de IVA**
2. **Recorrer todas las líneas** (pueden tener cantidades negativas)
3. **Calcular totales generales** (pueden ser negativos)
4. **Guardar en `totals_data`**

**Validaciones**:
- Permitir cantidades negativas
- Permitir totales negativos
- Validar que `rectifies_document_id` apunta a una factura

---

## Flujo de Trabajo

### Crear Rectificativa desde Factura

1. **Usuario selecciona una factura** (solo facturas, no presupuestos ni proformas)
2. **Usuario hace clic en "Crear Rectificativa"**
3. **Se crea nuevo documento**:
   - `type = "rectificativa"`
   - `document_number = "RT-{número de factura}"`
   - `rectifies_document_id = {id de la factura}`
   - Se copian datos de la factura (cliente, proyecto, etc.)
4. **Usuario añade líneas**:
   - Puede añadir líneas con cantidades negativas para anular
   - Puede añadir líneas con cantidades positivas para corregir
5. **Totales se calculan automáticamente** (pueden ser negativos)
6. **Usuario guarda la rectificativa**
7. **Estado inicial**: `enviado` o `aceptado` según corresponda

### Validaciones

**Antes de guardar**:
- `rectifies_document_id` obligatorio
- El documento referenciado debe ser una factura (`type = 'factura'`)
- Al menos una línea
- `document_number` único

---

## Resumen de Numeración Completo

| Tipo | Prefijo | Formato | Ejemplo | Origen |
|------|---------|---------|---------|--------|
| Presupuesto | `E` | `E{YY}{NNNNN}` | `E250001` | Independiente |
| Proforma | `FP` | `FP{YY}{NNNNN}` | `FP250001` | Mismo número que presupuesto |
| Factura | `F-` | `F-{YY}{NNNNN}` | `F-250001` | Mismo número que presupuesto/proforma |
| Rectificativa | `RT-` | `RT-{YY}{NNNNN}` | `RT-250001` | **Mismo número que factura** |

---

## Consideraciones Técnicas

### 1. Restricción de Origen

**CRÍTICO**: Implementar validación en la aplicación para que solo se puedan crear rectificativas desde facturas.

**Código de validación**:
```typescript
if (originalDocument.type !== 'factura') {
  throw new Error('Las rectificativas solo pueden crearse desde facturas');
}
```

### 2. Totales Negativos

- Permitir totales negativos en rectificativas
- Mostrar totales negativos con formato especial (color rojo, paréntesis, etc.)
- Validar que los cálculos sean correctos

### 3. Visualización en PDF

- Indicar claramente que es una "FACTURA RECTIFICATIVA"
- Mostrar referencia a la factura original: "Rectifica factura F-250001"
- Resaltar totales negativos si los hay

---

**Fecha de creación**: 2025-01-21  
**Última actualización**: 2025-01-21  
**Estado**: Especificación completa, lista para implementación

