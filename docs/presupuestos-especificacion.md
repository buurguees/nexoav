# Especificación: Módulo de Presupuestos

Documentación completa para la implementación del módulo de presupuestos en NEXOAV, basada en el análisis del presupuesto de ejemplo y la estructura de base de datos existente.

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura del Documento](#estructura-del-documento)
3. [Fuentes de Datos](#fuentes-de-datos)
4. [Numeración Automática](#numeración-automática)
5. [Asignación a Cliente y Proyecto](#asignación-a-cliente-y-proyecto)
6. [Gestión de Líneas (Productos y Servicios)](#gestión-de-líneas-productos-y-servicios)
7. [Cálculos y Totales](#cálculos-y-totales)
8. [Separación de Tipos de IVA](#separación-de-tipos-de-iva)
9. [Presentación Visual (PDF)](#presentación-visual-pdf)
10. [Flujo de Trabajo](#flujo-de-trabajo)
11. [Casos de Uso](#casos-de-uso)

---

## Visión General

El módulo de presupuestos permite crear ofertas comerciales estructuradas que incluyen:
- **Header**: Información de la empresa, cliente, número de documento, fechas
- **Líneas de productos y servicios**: Organizadas en dos secciones separadas
- **Totales**: Con desglose por tipos de IVA
- **Condiciones de pago**: Información bancaria y términos

**Tipo de documento**: `presupuesto` (tabla `sales_documents`)

---

## Estructura del Documento

### 1. Header del Presupuesto

#### 1.1. Información de la Empresa (Izquierda)
**Fuente**: Tabla `company_settings`

```typescript
{
  fiscal_name: "AV TECH ESDEVENIMENTS S.L.",
  trade_name: "AV TECH", // Opcional, si existe
  cif: "B75835728",
  address_fiscal: {
    street: "C/ Francesc Hombravella Maristany 13",
    city: "El Masnou",
    zip: "08320",
    province: "Barcelona",
    country: "España"
  },
  phone: "+34 663 850 001",
  email_contact: "facturacion@avtechesdeveniments.com"
}
```

**Visualización**:
- Nombre fiscal en **negrita**
- Dirección completa en formato estándar
- Teléfono y email en líneas separadas

#### 1.2. Información del Cliente (Derecha)
**Fuente**: Campo `client_snapshot` (JSONB) de `sales_documents` (inmutabilidad fiscal)

```typescript
{
  fiscal_name: "CBCN SOLUCIONES Y EQUIPOS MULTIFUNCIONALES SL",
  commercial_name: "CBCN", // Opcional
  vat_number: "B65595621",
  address: {
    street: "CALLE ESPRONCEDA, 333-333",
    city: "BARCELONA",
    zip: "08027",
    province: "Barcelona",
    country: "España"
  },
  phone: "865595621",
  email: "contacto@cliente.com" // Opcional
}
```

**Visualización**:
- Título "Cliente" en **negrita**
- Nombre fiscal (o comercial si existe)
- Dirección completa
- Teléfono (y email si existe)

#### 1.3. Datos del Documento (Header Superior)
**Fuente**: Tabla `sales_documents`

```typescript
{
  document_number: "E250066", // Numeración automática
  date_issued: "2025-11-25", // Fecha de emisión
  date_due: "2025-12-25", // Fecha de vencimiento
  type: "presupuesto"
}
```

**Visualización**:
- **Título**: "Presupuesto" (grande, negrita, color destacado)
- **Número**: "# E250066"
- **Fecha**: "Fecha: 25/11/2025"
- **Vencimiento**: "Vencimiento: 25/12/2025"
- **Logo**: Desde `company_settings.logo_url` (arriba a la derecha)

---

### 2. Cuerpo del Documento

#### 2.1. Título de la Sección
**Fuente**: Campo `notes_public` o nombre del proyecto

Si el presupuesto está asociado a un proyecto (`project_id`), mostrar:
- Nombre del proyecto desde `projects.name`
- Ejemplo: "Instalación Adicional Audio"

Si no hay proyecto, usar:
- Campo `notes_public` de `sales_documents` (si existe)
- O texto genérico: "Presupuesto de Servicios"

#### 2.2. Tabla de Líneas

**Estructura de la tabla**:
| CONCEPTO | PRECIO | UNIDADES | DTO | SUBTOTAL | IVA | TOTAL |

**Fuente**: Tabla `sales_document_lines` ordenadas por:
1. `grouping_tag` (primero "Productos", luego "Servicios")
2. `line_order` (orden dentro de cada grupo)

---

## Fuentes de Datos

### 3.1. Búsqueda de Productos y Servicios

#### Origen de Datos
**Tabla**: `inventory_items`

**Filtros por defecto**:
- `is_active = true` (solo items activos)
- Ordenar por: `name` (alfabético) o `internal_code`

#### Búsqueda en el Formulario
El usuario debe poder:
1. **Buscar por código interno**: `internal_code` (ej: "Ambit-16")
2. **Buscar por nombre**: `name` (ej: "Altavoz zona común")
3. **Filtrar por tipo**: `type = "producto"` o `type = "servicio"`
4. **Filtrar por categoría**: `category_id` (opcional)

#### Datos que se Copian al Añadir un Item

Cuando el usuario selecciona un item del inventario:

```typescript
{
  item_id: inventory_item.id, // Referencia al item
  concept: inventory_item.name, // Nombre principal
  description: inventory_item.description || "", // Descripción detallada
  unit_price: inventory_item.base_price, // Precio sugerido (editable)
  quantity: 1, // Por defecto
  discount_percent: 0, // Por defecto
  tax_percent: 21, // IVA por defecto (desde company_settings.default_vat)
  grouping_tag: inventory_item.type === "producto" ? "Productos" : "Servicios",
  unit: inventory_item.unit || "unidad" // Para mostrar en la tabla
}
```

**IMPORTANTE**: El usuario puede modificar:
- `unit_price` (precio unitario)
- `quantity` (cantidad)
- `discount_percent` (descuento %)
- `tax_percent` (IVA %)
- `concept` (nombre)
- `description` (descripción)

**El precio final se guarda en `sales_document_lines.unit_price`** (no depende del `base_price` del item).

---

## Numeración Automática

### 4.1. Formato de Numeración

**Formato**: `E{YY}{NNNNN}`

- `E`: Prefijo fijo para presupuestos (estimación)
- `YY`: Año (2 dígitos, ej: 25 para 2025)
- `NNNNN`: Número secuencial (5 dígitos, ej: 00066)

**Ejemplos**:
- `E250001` (primer presupuesto de 2025)
- `E250066` (presupuesto número 66 de 2025)
- `E260001` (primer presupuesto de 2026)

### 4.2. Lógica de Generación

**Al crear un nuevo presupuesto**:

1. Obtener el último número de presupuesto del año actual:
   ```sql
   SELECT document_number 
   FROM sales_documents 
   WHERE type = 'presupuesto' 
     AND document_number LIKE 'E{YY}%'
   ORDER BY document_number DESC 
   LIMIT 1
   ```

2. Extraer el número secuencial:
   - Si existe: `E250066` → `00066` → siguiente: `00067`
   - Si no existe: empezar en `00001`

3. Generar el nuevo número:
   - Año actual: `25`
   - Número siguiente: `00067`
   - Resultado: `E250067`

### 4.3. Validación de Unicidad

- El campo `document_number` debe ser **único** en la tabla `sales_documents`
- Validar antes de guardar que no existe otro documento con el mismo número

### 4.4. Numeración de Proformas

**Regla especial**: Las proformas mantienen el mismo número que el presupuesto del que provienen, cambiando solo el prefijo.

**Formato**: `FP{YY}{NNNNN}`

- `FP`: Prefijo fijo para proformas
- `YY`: Año (2 dígitos, mismo que el presupuesto)
- `NNNNN`: Número secuencial (mismo que el presupuesto)

**Ejemplos**:
- Presupuesto: `E250001` → Proforma: `FP250001`
- Presupuesto: `E250066` → Proforma: `FP250066`

**Lógica de generación al convertir presupuesto a proforma**:
1. Obtener el `document_number` del presupuesto original
2. Extraer el año y número secuencial: `E250001` → año: `25`, número: `00001`
3. Generar el nuevo número: `FP250001`

**Ventajas**:
- Relación clara entre presupuesto y proforma
- Fácil identificación del documento origen
- Numeración consistente

### 4.5. Configuración Futura

**Preparado para**:
- Configuración de prefijos por tipo de documento:
  - Presupuestos: `E`
  - Proformas: `FP` (mismo número que presupuesto)
  - Facturas: `F-` (mismo número que presupuesto/proforma)
  - Rectificativas: `RT-` (mismo número que factura rectificada)
- Configuración de formato de numeración (tabla `document_numbering_config` futura)

---

## Asignación a Cliente y Proyecto

### 5.1. Asignación a Cliente (Obligatorio)

**Campo**: `sales_documents.client_id` (FK → `clients.id`)

**Flujo**:
1. Al crear un presupuesto, **obligatorio** seleccionar un cliente
2. Dropdown con clientes activos (`clients.is_active = true`)
3. Ordenar por: `fiscal_name` o `commercial_name` (alfabético)
4. Búsqueda por nombre o CIF

**Al guardar el presupuesto**:
- Crear `client_snapshot` (JSONB) con datos fiscales congelados:
  ```typescript
  {
    fiscal_name: client.fiscal_name,
    commercial_name: client.commercial_name || null,
    vat_number: client.vat_number,
    address: client.billing_address, // Dirección estructurada
    phone: client.phone || null,
    email: client.email || null
  }
  ```
- Esto garantiza **inmutabilidad fiscal**: si el cliente cambia sus datos, el presupuesto histórico mantiene los datos originales

### 5.2. Asignación a Proyecto (Opcional)

**Campo**: `sales_documents.project_id` (FK → `projects.id`, nullable)

**Flujo**:
1. Al crear un presupuesto, **opcional** seleccionar un proyecto
2. Si hay cliente seleccionado, filtrar proyectos por `client_id`:
   ```sql
   SELECT * FROM projects 
   WHERE client_id = {client_id} 
     AND status IN ('borrador', 'presupuestado', 'aceptado', 'ejecutando')
   ORDER BY name
   ```
3. Si no hay cliente, mostrar todos los proyectos (o deshabilitar el campo)

**Ventajas**:
- Vincular presupuesto a proyecto permite:
  - Mostrar el nombre del proyecto en el PDF
  - Calcular totales facturados del proyecto
  - Seguimiento de presupuestos por proyecto

**Visualización en el PDF**:
- Si hay `project_id`, mostrar el nombre del proyecto como título de sección
- Ejemplo: "Instalación Adicional Audio"

---

## Gestión de Líneas (Productos y Servicios)

### 6.1. Separación Visual en el PDF

**Organización**:
1. **Sección "Productos"** (primero)
   - Todas las líneas con `grouping_tag = "Productos"`
   - Ordenadas por `line_order`

2. **Sección "Servicios"** (después)
   - Todas las líneas con `grouping_tag = "Servicios"`
   - Ordenadas por `line_order`

**Visualización**:
- Título de sección en negrita: "**Productos**" o "**Servicios**"
- Tabla con las líneas de esa sección
- Espacio entre secciones

### 6.2. Determinación Automática del `grouping_tag`

**Al añadir un item del inventario**:
```typescript
if (inventory_item.type === "producto") {
  grouping_tag = "Productos";
} else if (inventory_item.type === "servicio") {
  grouping_tag = "Servicios";
}
```

**Al crear una línea manual** (sin `item_id`):
- El usuario puede seleccionar manualmente: "Productos" o "Servicios"

### 6.3. Estructura de una Línea

**Campos de `sales_document_lines`**:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `concept` | Nombre principal | "Ambit-16" |
| `description` | Descripción detallada (opcional) | "Altavoz zona común" |
| `quantity` | Cantidad | `10.00` |
| `unit_price` | Precio unitario | `135.56` |
| `discount_percent` | Descuento (%) | `10.00` |
| `subtotal` | Subtotal (calculado) | `1220.04` |
| `tax_percent` | IVA (%) | `21.00` |
| `total_line` | Total línea (calculado) | `1476.25` |
| `grouping_tag` | "Productos" o "Servicios" | "Productos" |
| `line_order` | Orden en el documento | `1`, `2`, `3`... |

### 6.4. Cálculo de Línea

**Fórmulas**:

1. **Subtotal** (después de descuento):
   ```
   subtotal = (quantity × unit_price) × (1 - discount_percent / 100)
   ```
   Ejemplo: `(10 × 135.56) × (1 - 10/100) = 1355.60 × 0.9 = 1220.04`

2. **Total de la línea** (con IVA):
   ```
   total_line = subtotal × (1 + tax_percent / 100)
   ```
   Ejemplo: `1220.04 × (1 + 21/100) = 1220.04 × 1.21 = 1476.25`

**Validaciones**:
- `quantity > 0`
- `unit_price >= 0`
- `discount_percent >= 0` y `<= 100`
- `tax_percent >= 0` (puede ser 0 para exentos)

### 6.5. Edición de Líneas

**El usuario puede**:
- Modificar cualquier campo de la línea
- Eliminar líneas
- Reordenar líneas (cambiar `line_order`)
- Añadir líneas manuales (sin `item_id`)

**Al modificar**:
- Recalcular automáticamente `subtotal` y `total_line`
- Actualizar `line_order` si se reordena

---

## Cálculos y Totales

### 7.1. Totales por Línea

Cada línea calcula:
- `subtotal`: `(quantity × unit_price) × (1 - discount_percent / 100)`
- `total_line`: `subtotal × (1 + tax_percent / 100)`

### 7.2. Totales del Documento

**Estructura en `sales_documents.totals_data` (JSONB)**:

```typescript
{
  // Desglose por tipo de IVA
  vat_breakdown: {
    "21": { base: 3265.02, vat: 685.66, total: 3950.68 },
    "10": { base: 0, vat: 0, total: 0 },
    "4": { base: 0, vat: 0, total: 0 },
    "0": { base: 0, vat: 0, total: 0 } // Exento
  },
  
  // Totales generales
  total_discount: 248.01, // Suma de descuentos por item
  base_imponible: 3265.02, // Base imponible total (suma de subtotales)
  total_vat: 685.66, // IVA total (suma de todos los IVAs)
  total: 3950.68 // Total final (base + IVA)
}
```

### 7.3. Cálculo de Totales

**Algoritmo**:

1. **Inicializar desglose de IVA**:
   ```typescript
   vat_breakdown = {
     "21": { base: 0, vat: 0, total: 0 },
     "10": { base: 0, vat: 0, total: 0 },
     "4": { base: 0, vat: 0, total: 0 },
     "0": { base: 0, vat: 0, total: 0 }
   }
   ```

2. **Recorrer todas las líneas** (`sales_document_lines`):
   ```typescript
   for (line of lines) {
     const vatKey = line.tax_percent.toString();
     
     // Acumular base imponible
     vat_breakdown[vatKey].base += line.subtotal;
     
     // Calcular IVA de esta línea
     const lineVat = line.subtotal * (line.tax_percent / 100);
     vat_breakdown[vatKey].vat += lineVat;
     
     // Acumular total
     vat_breakdown[vatKey].total += line.total_line;
   }
   ```

3. **Calcular totales generales**:
   ```typescript
   total_discount = sum(lines.map(l => 
     (l.quantity * l.unit_price) - l.subtotal
   ));
   
   base_imponible = sum(vat_breakdown.map(v => v.base));
   total_vat = sum(vat_breakdown.map(v => v.vat));
   total = sum(vat_breakdown.map(v => v.total));
   ```

4. **Guardar en `totals_data`**:
   ```typescript
   sales_document.totals_data = {
     vat_breakdown,
     total_discount,
     base_imponible,
     total_vat,
     total
   };
   ```

### 7.4. Actualización Automática

**Los totales se recalculan automáticamente cuando**:
- Se añade una línea
- Se modifica una línea (cantidad, precio, descuento, IVA)
- Se elimina una línea
- Se reordena una línea (no afecta totales, solo visualización)

**Trigger o función en la aplicación**:
- Después de cada cambio en `sales_document_lines`, recalcular `totals_data`
- Guardar en `sales_documents.totals_data`

---

## Separación de Tipos de IVA

### 8.1. Tipos de IVA en España

**Tipos comunes**:
- **21%**: General (productos y servicios estándar)
- **10%**: Reducido (algunos servicios, productos básicos)
- **4%**: Superreducido (productos de primera necesidad)
- **0%**: Exento (exportaciones, algunos servicios médicos)

**Por defecto**: `company_settings.default_vat` (normalmente 21%)

### 8.2. Visualización en el Resumen

**En el PDF, mostrar**:

```
DESCUENTO POR ITEM:        248,01€
BASE IMPONIBLE:          3.265,02€

IVA 21%:                   685,66€
IVA 10%:                     0,00€
IVA 4%:                      0,00€
IVA 0% (Exento):             0,00€

TOTAL IVA:                 685,66€
────────────────────────────────────
TOTAL:                   3.950,68€
```

**Reglas**:
- Solo mostrar tipos de IVA que tengan `base > 0`
- Si todos los items tienen el mismo IVA, mostrar solo ese tipo
- Formato de moneda: `€X.XXX,XX` (punto para miles, coma para decimales)

### 8.3. Estructura de Datos

**En `totals_data.vat_breakdown`**:
```typescript
{
  "21": {
    base: 3265.02,
    vat: 685.66,
    total: 3950.68
  },
  "10": {
    base: 0,
    vat: 0,
    total: 0
  },
  // ... otros tipos
}
```

**Al renderizar el PDF**:
- Filtrar solo los tipos con `base > 0`
- Ordenar por porcentaje (mayor a menor): 21%, 10%, 4%, 0%

---

## Presentación Visual (PDF)

### 9.1. Estructura del PDF

**Páginas**:
- **Página 1**: Header, tabla de líneas (Productos y Servicios), resumen de totales
- **Páginas siguientes**: Condiciones de pago, información adicional

**Paginación**:
- "Pag. 1 de 3" (abajo a la derecha)
- Calcular número de páginas según contenido

### 9.2. Header

**Layout**:
```
┌─────────────────────────────────────────────────┐
│  PRESUPUESTO                    [LOGO]          │
│  Número # E250066                               │
│  Fecha: 25/11/2025  Vencimiento: 25/12/2025    │
├──────────────────┬──────────────────────────────┤
│  AV TECH...      │  Cliente                     │
│  Dirección...    │  CBCN SOLUCIONES...          │
│  Tel: ...        │  Dirección...                │
│  Email: ...      │  Tel: ...                    │
└──────────────────┴──────────────────────────────┘
```

### 9.3. Tabla de Líneas

**Columnas**:
- **CONCEPTO**: `concept` (negrita) + `description` (texto pequeño debajo, si existe)
- **PRECIO**: `unit_price` (formato moneda)
- **UNIDADES**: `quantity` (número)
- **DTO**: `discount_percent` (formato: "10%")
- **SUBTOTAL**: `subtotal` (formato moneda)
- **IVA**: `tax_percent` (formato: "21%")
- **TOTAL**: `total_line` (formato moneda, negrita)

**Agrupación**:
- Título de sección: "**Productos**" (negrita)
- Tabla con líneas de productos
- Espacio
- Título de sección: "**Servicios**" (negrita)
- Tabla con líneas de servicios

### 9.4. Resumen de Totales

**Layout**:
```
DESCUENTO POR ITEM:        248,01€
BASE IMPONIBLE:          3.265,02€

IVA 21%:                   685,66€
────────────────────────────────────
TOTAL IVA:                 685,66€
────────────────────────────────────
TOTAL:                   3.950,68€
```

**Alineación**: Números a la derecha

### 9.5. Condiciones de Pago

**Fuente**: Tabla `company_banks` (donde `is_visible_on_invoices = true`)

**Contenido**:
```
Condiciones de pago

Los pagos deberán realizarse mediante transferencia bancaria a la siguiente cuenta:

Banco: Sabadell - Cuenta Negocios
Titular: AV TECH ESDEVENIMENTS, S.L.
IBAN: ES52 0081 0200 2900 0473 7679

Una vez emitida la factura, el pago se efectuará en el plazo acordado según las condiciones del presupuesto o contrato.

En caso de facturas asociadas a proyectos o instalaciones, será necesario abonar el 30% del importe total antes del inicio de los trabajos, y el 70% restante a la finalización o según el calendario de hitos pactado.

La factura se considerará liquidada una vez confirmado el ingreso en cuenta.
```

**Visualización**:
- Título "Condiciones de pago" en negrita
- Información bancaria destacada
- Texto de condiciones estándar

### 9.6. Pie de Página

**Información**:
- Referencia del documento: "E250066 - 3.950,68€ Vencimiento 25/12/2025" (abajo izquierda)
- Número de página: "Pag. 1 de 3" (abajo derecha)

---

## Flujo de Trabajo

### 10.1. Crear Nuevo Presupuesto

1. **Usuario hace clic en "Nuevo Presupuesto"**
2. **Formulario se abre con**:
   - Cliente (obligatorio, dropdown)
   - Proyecto (opcional, dropdown filtrado por cliente)
   - Fecha de emisión (por defecto: hoy)
   - Fecha de vencimiento (por defecto: +30 días)
   - Notas públicas (opcional, texto largo)
   - Notas internas (opcional, no visible en PDF)

3. **Usuario guarda el borrador**:
   - Se genera `document_number` automáticamente
   - Se crea registro en `sales_documents` con `status = "borrador"`
   - Se crea `client_snapshot` con datos fiscales congelados

4. **Usuario añade líneas**:
   - Buscar productos/servicios en inventario
   - Seleccionar item → se copian datos
   - Modificar precio, cantidad, descuento, IVA si es necesario
   - Añadir descripción adicional si es necesario
   - Guardar línea → se recalcula `subtotal` y `total_line`

5. **Totales se calculan automáticamente**:
   - Al guardar cada línea, se recalcula `totals_data`
   - Se actualiza `sales_documents.totals_data`

6. **Usuario puede**:
   - Reordenar líneas (drag & drop o botones)
   - Eliminar líneas
   - Editar líneas
   - Añadir líneas manuales (sin item del inventario)

7. **Usuario finaliza el presupuesto**:
   - Cambiar `status` a "enviado" (o mantener "borrador")
   - Generar PDF
   - Enviar al cliente (futuro: email automático)

### 10.2. Editar Presupuesto Existente

**Restricciones**:
- Solo se puede editar si `status = "borrador"` o `status = "enviado"`
- Si `status = "aceptado"`, no se puede editar (debe crear factura)

**Flujo**:
1. Abrir presupuesto
2. Modificar campos permitidos
3. Guardar cambios
4. Recalcular totales automáticamente

### 10.3. Convertir Presupuesto a Proforma

**Flujo**:
1. Usuario hace clic en "Convertir a Proforma" en un presupuesto aceptado
2. Se crea nuevo documento de tipo `proforma`
3. Se copian todos los datos del presupuesto:
   - Cliente y `client_snapshot`
   - Proyecto
   - Todas las líneas (`sales_document_lines`)
   - Totales
4. Se genera `document_number`:
   - Extraer número del presupuesto: `E250001` → `250001`
   - Aplicar prefijo de proforma: `FP250001`
5. Estado inicial: `enviado`
6. Fechas: Emisión = hoy, Vencimiento = +30 días

**Nota**: El presupuesto original mantiene su estado `aceptado` y no se modifica.

### 10.4. Convertir Presupuesto/Proforma a Factura

**Flujo**:
1. Usuario hace clic en "Convertir a Factura" en un presupuesto aceptado o proforma
2. Se crea nuevo documento de tipo `factura`
3. Se copian todos los datos del documento origen:
   - Cliente y `client_snapshot`
   - Proyecto
   - Todas las líneas (`sales_document_lines`)
   - Totales
4. Se genera `document_number`:
   - Extraer número del presupuesto/proforma: `E250001` o `FP250001` → `250001`
   - Aplicar prefijo de factura: `F-250001`
5. Estado inicial: `enviado` o `cobrada` (según corresponda)
6. Fechas: Emisión = hoy, Vencimiento = +30 días

**Nota**: El documento original (presupuesto/proforma) mantiene su estado y no se modifica.

**Formato de numeración de facturas**:
- **Formato**: `F-{YY}{NNNNN}`
- `F-`: Prefijo fijo para facturas (con guion)
- `YY`: Año (2 dígitos, mismo que el presupuesto/proforma)
- `NNNNN`: Número secuencial (mismo que el presupuesto/proforma)

**Ejemplos**:
- Presupuesto: `E250001` → Factura: `F-250001`
- Proforma: `FP250001` → Factura: `F-250001`

---

## Casos de Uso

### 11.1. Presupuesto Simple (Solo Productos)

**Escenario**: Cliente solicita presupuesto de productos físicos

**Flujo**:
1. Crear presupuesto para cliente
2. Añadir productos del inventario
3. Todos los items tienen `grouping_tag = "Productos"`
4. PDF muestra solo sección "Productos"
5. Resumen con IVA correspondiente

### 11.2. Presupuesto Mixto (Productos + Servicios)

**Escenario**: Cliente solicita presupuesto con productos y servicios de instalación

**Flujo**:
1. Crear presupuesto para cliente
2. Añadir productos (ej: altavoces, cables)
3. Añadir servicios (ej: instalación, jornada técnico)
4. PDF muestra:
   - Sección "Productos" (primero)
   - Sección "Servicios" (después)
5. Resumen con totales combinados

### 11.3. Presupuesto con Múltiples Tipos de IVA

**Escenario**: Presupuesto con productos al 21% y servicios al 10%

**Flujo**:
1. Crear presupuesto
2. Añadir productos con IVA 21%
3. Añadir servicios con IVA 10%
4. Resumen muestra:
   - BASE IMPONIBLE: X€
   - IVA 21%: Y€
   - IVA 10%: Z€
   - TOTAL IVA: (Y + Z)€
   - TOTAL: X + Y + Z€

### 11.4. Presupuesto Vinculado a Proyecto

**Escenario**: Presupuesto para un proyecto específico

**Flujo**:
1. Crear presupuesto
2. Seleccionar cliente
3. Seleccionar proyecto del cliente
4. PDF muestra nombre del proyecto como título de sección
5. El presupuesto queda vinculado al proyecto para seguimiento

### 11.5. Presupuesto con Descuentos

**Escenario**: Cliente recibe descuento del 10% en algunos items

**Flujo**:
1. Añadir items al presupuesto
2. Modificar `discount_percent` en líneas específicas
3. El sistema recalcula `subtotal` automáticamente
4. Resumen muestra "DESCUENTO POR ITEM: X€"

---

## Consideraciones Técnicas

### 12.1. Inmutabilidad Fiscal

**CRÍTICO**: Al guardar el presupuesto, crear `client_snapshot` con datos fiscales congelados.

**Razón**: Si el cliente cambia su dirección o CIF, los presupuestos históricos deben mantener los datos originales para cumplimiento legal.

### 12.2. Precios Editables

**IMPORTANTE**: `sales_document_lines.unit_price` siempre guarda el precio real aplicado, independientemente del `base_price` del item.

**Razón**: Permite tarifas especiales por cliente sin afectar documentos históricos.

### 12.3. Cálculo de Totales

**Recomendación**: Usar funciones o triggers en la base de datos para recalcular `totals_data` automáticamente.

**Ventajas**:
- Consistencia de datos
- Menos errores
- Actualización automática

### 12.4. Validaciones

**Antes de guardar**:
- Cliente obligatorio
- Al menos una línea
- `document_number` único
- Fechas válidas (`date_due >= date_issued`)
- Totales calculados correctamente

---

## Listados de Documentos de Venta

### Columnas Estándar en Listados

Todos los listados de documentos de venta (Presupuestos, Proformas, Facturas, Rectificativas) deben incluir las siguientes columnas:

1. **Fecha de Emisión** (`date_issued`)
   - Formato: `DD/MM/YYYY`
   - Visible en: Desktop, Tablet
   - Alineación: Centro

2. **Número de Documento** (`document_number`)
   - Ejemplos: `E250001` (presupuesto), `FP250001` (proforma), `F-250001` (factura), `RT-250001` (rectificativa)
   - Visible en: Desktop, Tablet, Mobile
   - Alineación: Izquierda

3. **Cliente** (`client_snapshot.fiscal_name` o `client_snapshot.commercial_name`)
   - Nombre del cliente desde el snapshot (inmutable)
   - Visible en: Desktop, Tablet
   - Alineación: Izquierda

4. **Proyecto** (`project_name` - calculado desde `project_id`)
   - Nombre del proyecto asociado (opcional)
   - Visible en: Desktop, Tablet
   - Alineación: Izquierda

5. **Total** (`totals_data.total`)
   - Formato: Moneda (€X.XXX,XX)
   - Visible en: Desktop, Tablet, Mobile
   - Alineación: Derecha

6. **Estado** (`status`)
   - Badge con color según estado
   - Visible en: Desktop, Tablet, Mobile
   - Alineación: Centro

7. **Fecha de Última Actualización** (`updated_at`) ⭐ **NUEVO**
   - Formato: `DD/MM/YYYY HH:MM` (fecha y hora)
   - Visible en: Desktop, Tablet
   - Alineación: Centro
   - **Propósito**: Indicar cuándo fue la última modificación del documento
   - **Uso**: Útil para auditoría y seguimiento de cambios en documentos

**Notas sobre `updated_at`:**
- Se actualiza automáticamente cada vez que se modifica el documento
- Incluye fecha y hora para mayor precisión
- Permite identificar documentos recientemente modificados
- Útil para filtrar o ordenar por fecha de modificación

---

## Próximos Pasos de Implementación

1. **Crear componente de formulario de presupuesto**
   - Header (cliente, proyecto, fechas)
   - Tabla de líneas (editable)
   - Búsqueda de items del inventario
   - Cálculo automático de totales

2. **Implementar numeración automática**
   - Función para generar `document_number`
   - Validación de unicidad

3. **Implementar cálculo de totales**
   - Función para recalcular `totals_data`
   - Desglose por tipos de IVA

4. **Generar PDF**
   - Plantilla de PDF con estructura definida
   - Renderizado de header, líneas, totales, condiciones

5. **Gestión de estados**
   - Flujo: borrador → enviado → aceptado/rechazado
   - Restricciones de edición según estado

6. **Añadir columna de última actualización en listados**
   - Implementar en PresupuestosList, ProformasList, FacturasList, RectificativasList
   - Formato: fecha y hora
   - Visible en Desktop y Tablet

---

**Fecha de creación**: 2025-01-21  
**Última actualización**: 2025-01-21  
**Estado**: Especificación completa, lista para implementación

