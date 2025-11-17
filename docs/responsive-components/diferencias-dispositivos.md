# Diferencias entre Versiones por Dispositivo

## Resumen Ejecutivo

Este documento detalla las diferencias específicas entre las versiones de componentes para cada tipo de dispositivo. Las diferencias principales se centran en:

1. **Tamaños y espaciados**
2. **Layout y disposición**
3. **Funcionalidades visibles**
4. **Interacciones y UX**
5. **Rendimiento y optimizaciones**

---

## TaskCategoryDot

### Desktop
- **Tamaño por defecto**: `6px`
- **Clase CSS**: `task-category-dot`
- **Estilos**: Estándar, sin restricciones de espacio

### Tablet
- **Tamaño por defecto**: `5px` (reducido 17%)
- **Clase CSS**: `task-category-dot-tablet`
- **Estilos**: Similar a desktop pero con tamaños ligeramente reducidos
- **Nota**: Incluye `minWidth` y `minHeight` para evitar compresión

### Mobile
- **Tamaño por defecto**: `4px` (reducido 33% vs desktop)
- **Clase CSS**: `task-category-dot-mobile`
- **Estilos**: 
  - `display: inline-block` (en lugar de flex)
  - `verticalAlign: middle` para mejor alineación
  - `minWidth` y `minHeight` para evitar compresión en espacios pequeños

**Comparación de tamaños**:

| Dispositivo | Tamaño por defecto | Reducción vs Desktop |
|-------------|-------------------|---------------------|
| Desktop     | 6px               | -                   |
| Tablet      | 5px               | -17%                |
| Mobile      | 4px               | -33%                |

---

## Calendar3Months

### Desktop
- **Meses mostrados**: 3 meses (hoy + 2 siguientes)
- **Clase CSS contenedor**: `calendar-container`
- **Clases CSS calendario**: Sin sufijo (estándar)
- **Puntos de tareas**: Tamaño `6px`, gap `3px`
- **Funcionalidad completa**: Todas las características disponibles

**Código clave**:
```typescript
const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, 0);
// 3 meses en total: hoy + 2 siguientes
```

### Tablet
- **Meses mostrados**: 2 meses (hoy + 1 siguiente)
- **Clase CSS contenedor**: `calendar-container-tablet`
- **Clases CSS calendario**: Sufijo `-tablet` en todas las clases
- **Puntos de tareas**: Tamaño `5px`, gap `2px`
- **Funcionalidad**: Similar a desktop pero con menos meses visibles

**Código clave**:
```typescript
const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, 0);
// 2 meses en total: hoy + 1 siguiente
```

### Mobile
- **Meses mostrados**: 1 mes (solo el mes actual)
- **Clase CSS contenedor**: `calendar-container-mobile`
- **Clases CSS calendario**: Sufijo `-mobile` en todas las clases
- **Puntos de tareas**: Tamaño `4px`, gap `1.5px`
- **Funcionalidad**: Versión simplificada, un mes a la vez

**Código clave**:
```typescript
numberOfMonths={1}  // Solo 1 mes visible
const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, 0);
// Rango de 2 meses pero solo muestra 1
```

**Comparación de meses visibles**:

| Dispositivo | Meses visibles | Rango de datos |
|-------------|---------------|----------------|
| Desktop     | 3 meses       | 3 meses        |
| Tablet      | 2 meses       | 2 meses        |
| Mobile      | 1 mes         | 2 meses        |

---

## TaskSummaryWidget

### Desktop
- **Layout**: Grid de 2 columnas (`gridTemplateColumns: "repeat(2, 1fr)"`)
- **Máximo de tareas**: 6 (configurable)
- **Información mostrada**:
  - Título completo
  - Fechas formateadas
  - Horario (si existe)
  - Categoría con etiqueta
  - Estado de la tarea
- **Espaciado**: Generoso (`var(--spacing-md)`, `var(--spacing-lg)`)
- **Ancho máximo**: `1000px`

### Tablet
- **Layout**: Grid de 2 columnas (similar a desktop)
- **Máximo de tareas**: 6 (configurable)
- **Información mostrada**: Similar a desktop
- **Espaciado**: Ligeramente reducido
- **Ancho máximo**: `900px` (reducido)

### Mobile
- **Layout**: Lista de una sola columna (`flexDirection: "column"`)
- **Máximo de tareas**: 6 (configurable)
- **Información mostrada**:
  - Título con ellipsis si es muy largo
  - **Sin fechas ni horarios** (solo título y categoría)
  - Contorno de color según categoría (en lugar de fondo)
- **Espaciado**: Compacto (`var(--spacing-sm)`)
- **Ancho máximo**: `100%` (sin restricción)

**Comparación de información**:

| Información      | Desktop | Tablet | Mobile |
|------------------|---------|--------|--------|
| Título           | ✅      | ✅     | ✅     |
| Fechas           | ✅      | ✅     | ❌     |
| Horario          | ✅      | ✅     | ❌     |
| Categoría        | ✅      | ✅     | ✅     |
| Estado           | ✅      | ✅     | ❌     |
| Layout           | 2 cols  | 2 cols | 1 col  |

---

## Header

### Desktop
- **Estructura**: Una sola fila horizontal
- **Navegación**: Centrada, con texto completo
- **Búsqueda**: Campo de búsqueda visible siempre
- **Acciones**: Notificaciones y avatar a la derecha
- **Altura**: `var(--header-height)` (estándar)
- **Padding**: `var(--spacing-2xl)` (generoso)

### Tablet / Tablet Portrait
- **Estructura**: Similar a desktop pero con menos padding
- **Navegación**: Texto más pequeño o iconos
- **Búsqueda**: Campo visible pero más compacto
- **Acciones**: Similar a desktop
- **Padding**: `var(--spacing-lg)` (reducido)

### Mobile
- **Estructura**: Dos filas
  - **Fila superior**: Menú, búsqueda (toggle), notificaciones, avatar
  - **Fila inferior**: Navegación de secciones con iconos
- **Navegación**: Solo iconos, sin texto
- **Búsqueda**: Toggle (se abre/cierra)
- **Acciones**: Reducidas, solo esenciales
- **Altura**: Variable (2 filas)
- **Padding**: `var(--spacing-md)` (mínimo)

**Comparación de estructura**:

| Dispositivo | Filas | Navegación | Búsqueda |
|-------------|-------|-----------|----------|
| Desktop     | 1     | Texto     | Siempre visible |
| Tablet      | 1     | Texto/Iconos | Siempre visible |
| Mobile      | 2     | Solo iconos | Toggle |

---

## Sidebar

### Desktop
- **Posición**: Fija a la izquierda
- **Ancho**: `var(--sidebar-width)` (ancho completo)
- **Contenido**: Texto completo + iconos
- **Estado**: Siempre visible (o colapsable)
- **Navegación**: Expandible con secciones

### Tablet
- **Posición**: Fija a la izquierda
- **Ancho**: Reducido (solo iconos o texto corto)
- **Contenido**: Principalmente iconos
- **Estado**: Siempre visible o drawer
- **Navegación**: Simplificada

### Mobile
- **Posición**: Drawer/Sheet (se abre desde la izquierda)
- **Ancho**: `100%` cuando está abierto
- **Contenido**: Texto completo + iconos (cuando está abierto)
- **Estado**: Oculto por defecto, se abre con botón de menú
- **Navegación**: Completa cuando está abierto

**Comparación de comportamiento**:

| Dispositivo | Tipo      | Visibilidad | Ancho |
|-------------|-----------|-------------|-------|
| Desktop     | Fijo      | Siempre     | Completo |
| Tablet      | Fijo/Drawer | Siempre/Opcional | Reducido |
| Mobile      | Drawer    | Toggle      | 100% cuando abierto |

---

## Patrones Comunes de Diferencias

### 1. Tamaños y Espaciados

**Regla general**: Reducir proporcionalmente según el dispositivo

- **Desktop**: 100% (referencia)
- **Tablet**: ~85% (reducción del 15%)
- **Mobile**: ~65% (reducción del 35%)

**Ejemplos**:
- Font sizes: Desktop 16px → Tablet 14px → Mobile 12px
- Padding: Desktop `var(--spacing-lg)` → Tablet `var(--spacing-md)` → Mobile `var(--spacing-sm)`
- Gaps: Desktop `var(--spacing-md)` → Tablet `var(--spacing-sm)` → Mobile `var(--spacing-xs)`

### 2. Layout y Disposición

- **Desktop**: Máximo espacio, múltiples columnas
- **Tablet**: Balance entre espacio y compacto, 1-2 columnas
- **Mobile**: Una columna, máximo aprovechamiento vertical

### 3. Información Mostrada

- **Desktop**: Toda la información disponible
- **Tablet**: Información esencial + algunos detalles
- **Mobile**: Solo información esencial

### 4. Interacciones

- **Desktop**: Hover, click, keyboard navigation
- **Tablet**: Touch, swipe, click
- **Mobile**: Touch, swipe, gestos, sin hover

### 5. Performance

- **Desktop**: Cargar todos los datos y funcionalidades
- **Tablet**: Cargar datos esenciales, lazy load del resto
- **Mobile**: Cargar solo lo visible, lazy load agresivo

---

## Checklist de Diferencias

Al crear una nueva versión de componente para un dispositivo, verificar:

- [ ] Tamaños de elementos (fuentes, iconos, espaciados)
- [ ] Layout (columnas, filas, grid)
- [ ] Información mostrada (qué campos se muestran)
- [ ] Clases CSS (sufijos por dispositivo)
- [ ] Interacciones (hover, touch, gestos)
- [ ] Performance (lazy load, código splitting)
- [ ] Accesibilidad (mantener en todos los dispositivos)

---

*Última actualización: Diferencias entre dispositivos documentadas*

