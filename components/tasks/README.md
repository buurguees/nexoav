# Componentes de Tareas

Componentes reutilizables relacionados con la visualización y gestión de tareas, organizados por dispositivo.

## Estructura

```
tasks/
├── desktop/          # Versiones para escritorio
│   ├── TaskBar.tsx
│   ├── TaskCategoryDot.tsx
│   ├── MonthlyTaskList.tsx
│   ├── TaskSummaryWidget.tsx
│   ├── TaskCalendarList.tsx
│   ├── TaskForm.tsx
│   └── index.ts
├── mobile/           # Versiones para móviles
│   ├── TaskCategoryDot.tsx
│   ├── TaskSummaryWidget.tsx
│   └── index.ts
├── tablet/           # Versiones para tablets (portrait)
│   ├── TaskCategoryDot.tsx
│   ├── TaskSummaryWidget.tsx
│   └── index.ts
├── tablet-horizontal/ # Versiones para tablets (horizontal)
│   ├── TaskCategoryDot.tsx
│   ├── TaskSummaryWidget.tsx
│   └── index.ts
└── index.ts          # Exporta desde desktop por defecto
```

## Uso

### Importación por defecto (Desktop)

```typescript
import { 
  TaskBar, 
  TaskCategoryDot, 
  MonthlyTaskList,
  TaskSummaryWidget,
  TaskCalendarList,
  TaskForm 
} from "@/components/tasks";
```

### Importación específica por dispositivo

```typescript
// Desktop
import { TaskBar } from "@/components/tasks/desktop";

// Mobile (cuando esté implementado)
import { TaskBar } from "@/components/tasks/mobile";

// Tablet (cuando esté implementado)
import { TaskBar } from "@/components/tasks/tablet";
```

## Componentes

### Desktop

- **TaskBar**: Franja visual de tarea para calendarios
- **TaskCategoryDot**: Punto de color que representa una categoría
- **MonthlyTaskList**: Lista mensual de tareas
- **TaskSummaryWidget**: Widget compacto de resumen de tareas
- **TaskCalendarList**: Listado de tareas del mes agrupado por categoría
- **TaskForm**: Formulario de creación/edición de tareas

### Mobile ✅

- **TaskCategoryDot**: Punto de 4px (vs 6px desktop)
- **TaskSummaryWidget**: Lista de una columna, información esencial
- Optimizado para interacción táctil y pantallas pequeñas

### Tablet ✅

- **TaskCategoryDot**: Punto de 5px (intermedio)
- **TaskSummaryWidget**: Grid de 2 columnas, información completa
- Diseño balanceado entre compacto y funcional

### Tablet Horizontal ✅

- **TaskCategoryDot**: Punto de 5px
- **TaskSummaryWidget**: Optimizado para orientación horizontal
- Aprovecha el espacio horizontal adicional

