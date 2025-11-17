# Guía de Estilos por Dispositivo

## Sistema de Variables CSS

El proyecto usa variables CSS globales definidas en `src/styles/globals.css` que se adaptan según el dispositivo.

### Variables Globales

```css
:root {
  /* Espaciados */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Radios */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Alturas */
  --header-height: 64px;
  --sidebar-width: 240px;
}
```

## Estilos Específicos por Dispositivo

### Estructura de Archivos

```
src/styles/
├── components/
│   ├── mobile.css
│   ├── tablet-portrait.css
│   └── tablet-horizontal.css
└── ui/
    ├── calendar-mobile.css
    ├── calendar-tablet.css
    ├── calendar-tablet-horizontal.css
    └── calendar.css (desktop)
```

### Convención de Nombres CSS

**Desktop**: Sin sufijo
```css
.task-category-dot { ... }
.calendar-container { ... }
```

**Tablet**: Sufijo `-tablet`
```css
.task-category-dot-tablet { ... }
.calendar-container-tablet { ... }
```

**Mobile**: Sufijo `-mobile`
```css
.task-category-dot-mobile { ... }
.calendar-container-mobile { ... }
```

## Tamaños y Espaciados

### Reglas de Reducción

| Elemento | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Font size | 100% | ~90% | ~75% |
| Padding | 100% | ~85% | ~65% |
| Gap | 100% | ~85% | ~65% |
| Icon size | 100% | ~90% | ~80% |

### Ejemplos Prácticos

**Font Sizes**:

```css
/* Desktop */
.task-title { font-size: 16px; }

/* Tablet */
.task-title-tablet { font-size: 14px; }

/* Mobile */
.task-title-mobile { font-size: 12px; }
```

**Padding**:

```css
/* Desktop */
.task-card { padding: var(--spacing-lg); }

/* Tablet */
.task-card-tablet { padding: var(--spacing-md); }

/* Mobile */
.task-card-mobile { padding: var(--spacing-sm); }
```

**Gaps**:

```css
/* Desktop */
.task-list { gap: var(--spacing-md); }

/* Tablet */
.task-list-tablet { gap: var(--spacing-sm); }

/* Mobile */
.task-list-mobile { gap: var(--spacing-xs); }
```

## Layouts por Dispositivo

### Desktop

- **Grid**: Múltiples columnas (2-4)
- **Flex**: Horizontal cuando sea posible
- **Ancho máximo**: Contenedores con `max-width`

```css
.task-grid-desktop {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  max-width: 1200px;
}
```

### Tablet

- **Grid**: 1-2 columnas
- **Flex**: Horizontal o vertical según contexto
- **Ancho máximo**: Ligeramente reducido

```css
.task-grid-tablet {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  max-width: 900px;
}
```

### Mobile

- **Grid**: 1 columna
- **Flex**: Vertical (column)
- **Ancho máximo**: 100%

```css
.task-grid-mobile {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}
```

## Componentes Específicos

### Calendar

**Desktop** (`calendar.css`):
```css
.calendar-container {
  padding: var(--spacing-xl);
}

.calendar-cell {
  min-height: 80px;
  padding: var(--spacing-sm);
}
```

**Tablet** (`calendar-tablet.css`):
```css
.calendar-container-tablet {
  padding: var(--spacing-lg);
}

.calendar-cell-tablet {
  min-height: 60px;
  padding: var(--spacing-xs);
}
```

**Mobile** (`calendar-mobile.css`):
```css
.calendar-container-mobile {
  padding: var(--spacing-md);
}

.calendar-cell-mobile {
  min-height: 40px;
  padding: 2px;
}
```

### Task Components

**TaskCategoryDot**:

```css
/* Desktop */
.task-category-dot {
  width: 6px;
  height: 6px;
}

/* Tablet */
.task-category-dot-tablet {
  width: 5px;
  height: 5px;
}

/* Mobile */
.task-category-dot-mobile {
  width: 4px;
  height: 4px;
  display: inline-block;
  vertical-align: middle;
}
```

**TaskSummaryWidget**:

```css
/* Desktop */
.task-summary-widget {
  max-width: 1000px;
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
}

/* Tablet */
.task-summary-widget-tablet {
  max-width: 900px;
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
}

/* Mobile */
.task-summary-widget-mobile {
  width: 100%;
  padding: var(--spacing-sm);
  gap: var(--spacing-xs);
}
```

## Media Queries

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { ... }

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) { ... }

/* Tablet Horizontal */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }
```

### Uso en Componentes

**Opción 1: CSS puro**

```css
.task-card {
  padding: var(--spacing-lg);
}

@media (max-width: 767px) {
  .task-card {
    padding: var(--spacing-sm);
  }
}
```

**Opción 2: Clases específicas (recomendado)**

```css
.task-card { padding: var(--spacing-lg); }
.task-card-mobile { padding: var(--spacing-sm); }
```

## Variables Específicas por Dispositivo

### Mobile

```css
:root {
  --sidebar-width-mobile: auto;
  --header-height-mobile: 120px; /* 2 filas */
  --font-size-mobile: 12px;
}
```

### Tablet

```css
:root {
  --sidebar-width-tablet: 180px;
  --header-height-tablet: 64px;
  --font-size-tablet: 14px;
}
```

## Mejores Prácticas

### 1. Usar Variables CSS

**✅ Correcto**:
```css
.task-card {
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
}
```

**❌ Incorrecto**:
```css
.task-card {
  padding: 16px;
  gap: 8px;
}
```

### 2. Mantener Consistencia

- Usar las mismas variables en todos los dispositivos
- Solo ajustar valores, no crear nuevas variables innecesarias

### 3. Documentar Cambios

```css
/* MOBILE: padding reducido para ahorrar espacio */
.task-card-mobile {
  padding: var(--spacing-sm); /* Desktop usa var(--spacing-lg) */
}
```

### 4. Optimizar para Touch (Mobile)

```css
/* Mobile: áreas de toque más grandes */
.button-mobile {
  min-height: 44px; /* Tamaño mínimo recomendado para touch */
  min-width: 44px;
  padding: var(--spacing-sm) var(--spacing-md);
}
```

### 5. Evitar !important

**✅ Correcto**:
```css
.sidebar-mobile-nav-item {
  font-size: 12px;
}
```

**❌ Incorrecto**:
```css
.sidebar-mobile-nav-item {
  font-size: 12px !important;
}
```

**Excepción**: Solo cuando sea absolutamente necesario (ej: sobrescribir estilos de librerías externas)

---

## Checklist de Estilos

Al crear estilos para un nuevo componente:

- [ ] Definir estilos desktop primero
- [ ] Crear versiones tablet y mobile
- [ ] Usar variables CSS cuando sea posible
- [ ] Aplicar reglas de reducción de tamaños
- [ ] Añadir sufijos a clases CSS (`-tablet`, `-mobile`)
- [ ] Optimizar para touch en mobile
- [ ] Documentar diferencias en comentarios
- [ ] Probar en todos los dispositivos

---

*Última actualización: Guía de estilos documentada*

