# Casos de Uso: Componentes Responsivos

## Ejemplos Prácticos de Implementación

Este documento contiene ejemplos prácticos de cómo implementar y usar componentes responsivos en diferentes contextos.

---

## Caso 1: Calendar3Months en InicioResumen

### Contexto

El componente `InicioResumen` necesita mostrar un calendario de 3 meses, pero adaptado según el dispositivo.

### Implementación

```typescript
// components/InicioResumen.tsx
import { useResponsiveComponent } from "@/hooks/useResponsiveComponent";
import { Calendar3Months as CalendarDesktop } from "@/components/calendar/desktop";
import { Calendar3Months as CalendarMobile } from "@/components/calendar/mobile";
import { Calendar3Months as CalendarTablet } from "@/components/calendar/tablet";

export function InicioResumen() {
  const { isMobile, isTablet } = useResponsiveComponent();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Seleccionar componente según dispositivo
  const Calendar = isMobile 
    ? CalendarMobile 
    : isTablet 
    ? CalendarTablet 
    : CalendarDesktop;

  return (
    <div>
      <Calendar 
        tasks={tasks}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
    </div>
  );
}
```

### Resultado

- **Desktop**: Muestra 3 meses completos
- **Tablet**: Muestra 2 meses
- **Mobile**: Muestra 1 mes a la vez

---

## Caso 2: TaskSummaryWidget con Wrapper

### Contexto

Crear un wrapper que seleccione automáticamente la versión correcta del componente.

### Implementación

```typescript
// components/tasks/TaskSummaryWidget.tsx (wrapper)
"use client";

import { useResponsiveComponent } from "@/hooks/useResponsiveComponent";
import { TaskSummaryWidget as Desktop } from "./desktop/TaskSummaryWidget";
import { TaskSummaryWidget as Mobile } from "./mobile/TaskSummaryWidget";
import { TaskSummaryWidget as Tablet } from "./tablet/TaskSummaryWidget";
import type { TaskSummaryWidgetProps } from "./desktop/TaskSummaryWidget";

export function TaskSummaryWidget(props: TaskSummaryWidgetProps) {
  const { isMobile, isTablet } = useResponsiveComponent();

  if (isMobile) return <Mobile {...props} />;
  if (isTablet) return <Tablet {...props} />;
  return <Desktop {...props} />;
}
```

### Uso

```typescript
// components/InicioResumen.tsx
import { TaskSummaryWidget } from "@/components/tasks"; // Usa el wrapper

export function InicioResumen() {
  return (
    <TaskSummaryWidget 
      tasks={tasks}
      maxTasks={6}
      onTaskClick={handleTaskClick}
    />
  );
}
```

### Ventajas

- **Transparente**: El componente padre no necesita saber qué versión se usa
- **Mantenible**: Cambios en detección de dispositivo se hacen en un solo lugar
- **Reutilizable**: Se puede usar en cualquier parte sin lógica adicional

---

## Caso 3: Header con Versiones Específicas

### Contexto

El Header tiene estructuras completamente diferentes entre dispositivos.

### Implementación

```typescript
// components/Header.tsx
import { useResponsiveComponent } from "@/hooks/useResponsiveComponent";
import { HeaderDesktop } from "./layout/HeaderDesktop";
import { HeaderMobile } from "./layout/HeaderMobile";
import { HeaderTablet } from "./layout/HeaderTablet";
import { HeaderTabletPortrait } from "./layout/HeaderTabletPortrait";

export function Header(props: HeaderProps) {
  const { isMobile, isTablet, isTabletHorizontal } = useResponsiveComponent();

  if (isMobile) return <HeaderMobile {...props} />;
  if (isTablet && !isTabletHorizontal) return <HeaderTabletPortrait {...props} />;
  if (isTablet && isTabletHorizontal) return <HeaderTablet {...props} />;
  return <HeaderDesktop {...props} />;
}
```

### Diferencias Clave

**Desktop**:
- Una fila horizontal
- Navegación centrada con texto
- Búsqueda siempre visible

**Mobile**:
- Dos filas
- Navegación con iconos
- Búsqueda con toggle

**Tablet**:
- Una fila
- Navegación con iconos o texto corto
- Búsqueda visible

---

## Caso 4: TaskCategoryDot con Props Consistentes

### Contexto

Mantener la misma interfaz pero con tamaños diferentes.

### Implementación

```typescript
// Todas las versiones usan la misma interfaz
export interface TaskCategoryDotProps {
  type: TaskType;
  className?: string;
  size?: number; // Opcional, cada versión tiene su default
}

// Desktop
export function TaskCategoryDot({ type, size = 6, className }: TaskCategoryDotProps) {
  // ...
}

// Tablet
export function TaskCategoryDot({ type, size = 5, className }: TaskCategoryDotProps) {
  // ...
}

// Mobile
export function TaskCategoryDot({ type, size = 4, className }: TaskCategoryDotProps) {
  // ...
}
```

### Uso

```typescript
// El mismo código funciona en todos los dispositivos
<TaskCategoryDot type="installation" />

// Pero se puede sobrescribir el tamaño si es necesario
<TaskCategoryDot type="installation" size={8} />
```

---

## Caso 5: Sidebar con Comportamiento Diferente

### Contexto

El Sidebar es fijo en desktop/tablet pero drawer en mobile.

### Implementación

```typescript
// components/Sidebar.tsx
import { useResponsiveComponent } from "@/hooks/useResponsiveComponent";
import { SidebarDesktop } from "./layout/SidebarDesktop";
import { SidebarMobile } from "./layout/SidebarMobile";
import { SidebarTablet } from "./layout/SidebarTablet";

export function Sidebar(props: SidebarProps) {
  const { isMobile, isTablet } = useResponsiveComponent();
  const [isOpen, setIsOpen] = useState(!isMobile); // Abierto por defecto excepto mobile

  if (isMobile) {
    return (
      <SidebarMobile 
        {...props}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    );
  }

  if (isTablet) {
    return <SidebarTablet {...props} />;
  }

  return <SidebarDesktop {...props} />;
}
```

### Diferencias de Comportamiento

**Desktop/Tablet**:
- Siempre visible (o colapsable)
- Fijo a la izquierda
- Ancho completo o reducido

**Mobile**:
- Drawer/Sheet que se abre desde la izquierda
- Oculto por defecto
- Se abre con botón de menú
- Ancho 100% cuando está abierto

---

## Caso 6: TaskCalendarList con Layout Adaptativo

### Contexto

El listado de tareas cambia de layout según el dispositivo.

### Implementación

```typescript
// components/tasks/desktop/TaskCalendarList.tsx
export function TaskCalendarList({ tasks, month }: Props) {
  return (
    <div className="task-calendar-list">
      {/* Grid de 4 columnas (una por categoría) */}
      <div style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {/* ... */}
      </div>
    </div>
  );
}

// components/tasks/mobile/TaskCalendarList.tsx
export function TaskCalendarList({ tasks, month }: Props) {
  return (
    <div className="task-calendar-list-mobile">
      {/* Lista de una columna */}
      <div style={{ flexDirection: "column" }}>
        {/* ... */}
      </div>
    </div>
  );
}
```

### Diferencias

**Desktop**:
- Grid de 4 columnas (una por categoría CORE)
- Información completa
- Hover effects

**Mobile**:
- Lista de una columna
- Información esencial
- Touch-friendly

---

## Caso 7: Integración con Media Queries CSS

### Contexto

Algunos ajustes menores se pueden hacer solo con CSS.

### Implementación

```css
/* Estilos base (desktop) */
.task-card {
  padding: var(--spacing-lg);
  font-size: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

/* Tablet: ajustes menores */
@media (min-width: 768px) and (max-width: 1024px) {
  .task-card {
    padding: var(--spacing-md);
    font-size: 14px;
  }
}

/* Mobile: cambios mayores requieren componente específico */
@media (max-width: 767px) {
  .task-card {
    padding: var(--spacing-sm);
    font-size: 12px;
    grid-template-columns: 1fr; /* Cambio de layout */
  }
}
```

### Cuándo Usar CSS vs Componente Específico

**Usar CSS cuando**:
- Solo cambian tamaños/espaciados
- El layout es similar (solo cambia número de columnas)
- No hay cambios en lógica

**Usar Componente Específico cuando**:
- Cambia la estructura HTML
- Hay lógica diferente
- La información mostrada es diferente
- Las interacciones son diferentes

---

## Caso 8: Testing de Componentes Responsivos

### Contexto

Asegurar que todos los componentes funcionan en todos los dispositivos.

### Implementación

```typescript
// __tests__/TaskCategoryDot.test.tsx
import { render } from "@testing-library/react";
import { TaskCategoryDot as Desktop } from "@/components/tasks/desktop";
import { TaskCategoryDot as Mobile } from "@/components/tasks/mobile";
import { TaskCategoryDot as Tablet } from "@/components/tasks/tablet";

describe("TaskCategoryDot", () => {
  it("renders desktop version correctly", () => {
    const { container } = render(<Desktop type="installation" />);
    expect(container.querySelector(".task-category-dot")).toBeInTheDocument();
  });

  it("renders mobile version correctly", () => {
    const { container } = render(<Mobile type="installation" />);
    expect(container.querySelector(".task-category-dot-mobile")).toBeInTheDocument();
  });

  it("renders tablet version correctly", () => {
    const { container } = render(<Tablet type="installation" />);
    expect(container.querySelector(".task-category-dot-tablet")).toBeInTheDocument();
  });

  it("uses correct default sizes", () => {
    const { container: desktop } = render(<Desktop type="installation" />);
    const { container: mobile } = render(<Mobile type="installation" />);
    const { container: tablet } = render(<Tablet type="installation" />);

    expect(desktop.querySelector("div")).toHaveStyle({ width: "6px" });
    expect(tablet.querySelector("div")).toHaveStyle({ width: "5px" });
    expect(mobile.querySelector("div")).toHaveStyle({ width: "4px" });
  });
});
```

---

## Resumen de Patrones

### Patrón 1: Wrapper Component (Recomendado)

```typescript
export function Component(props: Props) {
  const { isMobile, isTablet } = useResponsiveComponent();
  if (isMobile) return <Mobile {...props} />;
  if (isTablet) return <Tablet {...props} />;
  return <Desktop {...props} />;
}
```

**Ventajas**: Transparente, fácil de usar, centralizado

### Patrón 2: Selección Manual

```typescript
const Component = isMobile ? Mobile : isTablet ? Tablet : Desktop;
return <Component {...props} />;
```

**Ventajas**: Más control, explícito

### Patrón 3: CSS Only

```css
.component { /* desktop */ }
@media (max-width: 767px) { .component { /* mobile */ } }
```

**Ventajas**: Menos código, más simple

**Desventajas**: Limitado a cambios visuales

---

## Mejores Prácticas

1. **Empezar con Desktop**: Crear la versión completa primero
2. **Mantener Props Consistentes**: Misma interfaz en todas las versiones
3. **Documentar Diferencias**: Comentarios explicando cambios
4. **Usar Wrappers**: Para simplificar el uso
5. **Testing**: Probar todas las versiones
6. **Performance**: Lazy load cuando sea posible

---

*Última actualización: Casos de uso documentados*

