# Componentes de Calendario

Componentes reutilizables relacionados con la visualización de calendarios, organizados por dispositivo.

## Estructura

```
calendar/
├── desktop/          # Versiones para escritorio
│   ├── Calendar18.tsx
│   ├── Calendar3Months.tsx
│   ├── DayPopup.tsx
│   └── index.ts
├── mobile/           # Versiones para móviles
│   ├── Calendar3Months.tsx
│   └── index.ts
├── tablet/           # Versiones para tablets (portrait)
│   ├── Calendar3Months.tsx
│   └── index.ts
├── tablet-horizontal/ # Versiones para tablets (horizontal)
│   ├── Calendar3Months.tsx
│   ├── DayPopup.tsx
│   └── index.ts
└── index.ts          # Exporta desde desktop por defecto
```

## Uso

### Importación por defecto (Desktop)

```typescript
import { Calendar18, Calendar3Months, DayPopup } from "@/components/calendar";
```

### Importación específica por dispositivo

```typescript
// Desktop
import { Calendar18 } from "@/components/calendar/desktop";

// Mobile (cuando esté implementado)
import { Calendar18 } from "@/components/calendar/mobile";

// Tablet (cuando esté implementado)
import { Calendar18 } from "@/components/calendar/tablet";
```

## Componentes

### Desktop

- **Calendar18**: Calendario mensual grande para vista detallada
- **Calendar3Months**: Calendario de 3 meses para vista resumen
- **DayPopup**: Popup modal con información detallada de un día

### Mobile ✅

- **Calendar3Months**: Calendario de 1 mes visible, optimizado para pantallas pequeñas
- Tamaños reducidos, interacción táctil optimizada
- Puntos de categoría más pequeños (4px)

### Tablet ✅

- **Calendar3Months**: Calendario de 2 meses, diseño intermedio
- Tamaños ligeramente reducidos vs desktop
- Puntos de categoría medianos (5px)

### Tablet Horizontal ✅

- **Calendar3Months**: Calendario optimizado para orientación horizontal
- **DayPopup**: Popup de detalles del día
- Aprovecha el espacio horizontal adicional

