# Estructura de Componentes por Dispositivo

## Organización de Carpetas

Los componentes están organizados en subcarpetas según el tipo de dispositivo:

```
components/
├── calendar/
│   ├── desktop/
│   │   ├── Calendar18.tsx
│   │   ├── Calendar3Months.tsx
│   │   ├── DayPopup.tsx
│   │   └── index.ts
│   ├── mobile/
│   │   ├── Calendar3Months.tsx
│   │   └── index.ts
│   ├── tablet/
│   │   ├── Calendar3Months.tsx
│   │   └── index.ts
│   ├── tablet-horizontal/
│   │   ├── Calendar3Months.tsx
│   │   └── index.ts
│   └── Calendar3Months.tsx (versión base/legacy)
│
├── tasks/
│   ├── desktop/
│   │   ├── TaskBar.tsx
│   │   ├── TaskCategoryDot.tsx
│   │   ├── TaskSummaryWidget.tsx
│   │   ├── TaskCalendarList.tsx
│   │   ├── MonthlyTaskList.tsx
│   │   ├── TaskForm.tsx
│   │   └── index.ts
│   ├── mobile/
│   │   ├── TaskCategoryDot.tsx
│   │   ├── TaskSummaryWidget.tsx
│   │   └── index.ts
│   ├── tablet/
│   │   ├── TaskCategoryDot.tsx
│   │   ├── TaskSummaryWidget.tsx
│   │   └── index.ts
│   └── tablet-horizontal/
│       ├── TaskSummaryWidget.tsx
│       └── index.ts
│
└── layout/
    ├── HeaderDesktop.tsx
    ├── HeaderMobile.tsx
    ├── HeaderTablet.tsx
    ├── HeaderTabletPortrait.tsx
    ├── SidebarDesktop.tsx
    ├── SidebarMobile.tsx
    ├── SidebarTablet.tsx
    └── SidebarTabletPortrait.tsx
```

## Convención de Nombres

### Carpetas de Dispositivos

- **`desktop/`**: Componentes para pantallas grandes (> 1024px)
- **`mobile/`**: Componentes para smartphones (< 768px)
- **`tablet/`**: Componentes para tablets en orientación vertical (768px - 1024px)
- **`tablet-horizontal/`**: Componentes para tablets en orientación horizontal (768px - 1024px)

### Archivos de Componentes

- **Mismo nombre**: Todos los dispositivos usan el mismo nombre de componente (ej: `TaskCategoryDot.tsx`)
- **Mismo nombre de función**: La función exportada mantiene el mismo nombre (ej: `TaskCategoryDot`)
- **Mismas props**: Las interfaces de props son idénticas entre dispositivos

**Ejemplo**:

```typescript
// components/tasks/desktop/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 6 }: TaskCategoryDotProps) { ... }

// components/tasks/mobile/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 4 }: TaskCategoryDotProps) { ... }

// components/tasks/tablet/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 5 }: TaskCategoryDotProps) { ... }
```

## Archivos Index

Cada carpeta de dispositivo tiene su propio `index.ts` para exportaciones centralizadas:

```typescript
// components/tasks/desktop/index.ts
export { TaskCategoryDot } from "./TaskCategoryDot";
export { TaskSummaryWidget } from "./TaskSummaryWidget";
// ...

// components/tasks/mobile/index.ts
export { TaskCategoryDot } from "./TaskCategoryDot";
export { TaskSummaryWidget } from "./TaskSummaryWidget";
```

## Estilos CSS por Dispositivo

Los estilos están organizados en:

```
src/styles/
├── components/
│   ├── mobile.css
│   ├── tablet-portrait.css
│   ├── tablet-horizontal.css
│   └── ui/
│       ├── calendar-mobile.css
│       ├── calendar-tablet.css
│       ├── calendar-tablet-horizontal.css
│       └── calendar.css (desktop)
```

## Patrón de Importación

### En Componentes de Páginas

Los componentes se importan según el dispositivo detectado:

```typescript
// Ejemplo: components/InicioResumen.tsx
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Calendar3Months as CalendarDesktop } from "@/components/calendar/desktop";
import { Calendar3Months as CalendarMobile } from "@/components/calendar/mobile";
import { Calendar3Months as CalendarTablet } from "@/components/calendar/tablet";

export function InicioResumen() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  
  if (isMobile) {
    return <CalendarMobile tasks={tasks} />;
  }
  if (isTablet) {
    return <CalendarTablet tasks={tasks} />;
  }
  return <CalendarDesktop tasks={tasks} />;
}
```

### Alternativa: Hook de Selección

```typescript
// hooks/useResponsiveComponent.ts
import { useMediaQuery } from "./useMediaQuery";

export function useResponsiveComponent() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");
  const isTabletHorizontal = useMediaQuery("(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)");
  
  return {
    isMobile,
    isTablet,
    isTabletHorizontal,
    isDesktop: !isMobile && !isTablet,
  };
}
```

## Componentes Compartidos vs Específicos

### Componentes Compartidos

Algunos componentes no necesitan versión por dispositivo porque son suficientemente flexibles:

- Componentes UI base (`Button`, `Input`, etc.)
- Utilidades (`utils.ts`, `hooks`)
- Tipos e interfaces (`types.ts`)

### Componentes Específicos

Componentes que requieren versiones por dispositivo:

- **Calendarios**: Diferentes layouts y tamaños
- **Listados de tareas**: Diferentes densidades de información
- **Headers/Sidebars**: Diferentes estructuras de navegación
- **Widgets**: Diferentes tamaños y disposiciones

## Ventajas de esta Estructura

1. **Separación clara**: Cada dispositivo tiene su propia implementación
2. **Mantenibilidad**: Cambios en un dispositivo no afectan a otros
3. **Performance**: Solo se carga el código necesario para cada dispositivo
4. **Escalabilidad**: Fácil añadir nuevos dispositivos (ej: `tablet-horizontal`)
5. **Testing**: Cada versión puede testearse independientemente

## Desventajas y Consideraciones

1. **Duplicación de código**: Algunos componentes pueden tener lógica similar
2. **Sincronización**: Cambios en props deben replicarse en todas las versiones
3. **Mantenimiento**: Más archivos que mantener

**Mitigación**: 
- Usar componentes base compartidos cuando sea posible
- Documentar cambios en props en todos los dispositivos
- Usar TypeScript para garantizar consistencia de interfaces

---

*Última actualización: Estructura de componentes documentada*

