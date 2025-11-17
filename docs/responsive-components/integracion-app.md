# Integración de Componentes Responsivos en la Aplicación

## Uso de useBreakpoint

La aplicación utiliza el hook `useBreakpoint` para detectar el tipo de dispositivo y seleccionar automáticamente los componentes apropiados.

### Hook useBreakpoint

**Ubicación**: `hooks/useBreakpoint.ts`

**Funcionalidad**:
- Detecta el breakpoint actual basado en el ancho de la ventana
- Soporta: `mobile`, `tablet`, `tablet-portrait`, `desktop`
- Se actualiza automáticamente al cambiar el tamaño de la ventana

**Breakpoints definidos**:
```typescript
export const BREAKPOINTS = {
  mobile: 768,      // < 768px: móvil
  tablet: 1024,    // 768px - 1024px: tablet
  desktop: 1025,    // > 1024px: desktop
} as const;
```

### Hooks Auxiliares

```typescript
// Detectar breakpoint completo
const breakpoint = useBreakpoint(); // 'mobile' | 'tablet' | 'tablet-portrait' | 'desktop'

// Verificaciones booleanas
const isMobile = useIsMobile(); // boolean
const isTablet = useIsTablet(); // boolean
const isDesktop = useIsDesktop(); // boolean

// Información completa
const { breakpoint, isMobile, isTablet, isTabletPortrait, isDesktop, width, height } = useBreakpointInfo();
```

## Integración en App.tsx

### Ejemplo de Uso

```typescript
// App.tsx
import { useBreakpoint } from './hooks/useBreakpoint';

export default function App() {
  const breakpoint = useBreakpoint();
  const isTabletPortrait = breakpoint === 'tablet-portrait';
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';

  // Usar breakpoint para ajustar layout
  return (
    <div>
      <Header 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
      />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main 
        style={{ 
          marginLeft: isTabletPortrait 
            ? '160px' // Sidebar fijo en tablet-portrait
            : isMobile
            ? '0' // Sin sidebar fijo en mobile
            : isTablet
            ? 'var(--sidebar-width-tablet-horizontal)' // Tablet horizontal
            : (isSidebarCollapsed ? '80px' : 'var(--sidebar-width)'), // Desktop
        }}
      >
        {/* Contenido */}
      </main>
    </div>
  );
}
```

## Selección de Componentes

### Patrón 1: Selección Directa en Componentes

```typescript
// components/InicioResumen.tsx
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Calendar3Months as CalendarDesktop } from "@/components/calendar/desktop";
import { Calendar3Months as CalendarMobile } from "@/components/calendar/mobile";
import { Calendar3Months as CalendarTablet } from "@/components/calendar/tablet";

export function InicioResumen() {
  const breakpoint = useBreakpoint();
  
  const Calendar = breakpoint === 'mobile' 
    ? CalendarMobile 
    : breakpoint === 'tablet' || breakpoint === 'tablet-portrait'
    ? CalendarTablet 
    : CalendarDesktop;

  return <Calendar tasks={tasks} />;
}
```

### Patrón 2: Usando Hooks Auxiliares

```typescript
import { useIsMobile, useIsTablet } from "@/hooks/useBreakpoint";
import { Calendar3Months as CalendarDesktop } from "@/components/calendar/desktop";
import { Calendar3Months as CalendarMobile } from "@/components/calendar/mobile";
import { Calendar3Months as CalendarTablet } from "@/components/calendar/tablet";

export function InicioResumen() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  if (isMobile) return <CalendarMobile tasks={tasks} />;
  if (isTablet) return <CalendarTablet tasks={tasks} />;
  return <CalendarDesktop tasks={tasks} />;
}
```

### Patrón 3: Wrapper Component (Recomendado)

```typescript
// components/calendar/Calendar3Months.tsx (wrapper)
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Calendar3Months as Desktop } from "./desktop/Calendar3Months";
import { Calendar3Months as Mobile } from "./mobile/Calendar3Months";
import { Calendar3Months as Tablet } from "./tablet/Calendar3Months";

export function Calendar3Months(props: Calendar3MonthsProps) {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'mobile') return <Mobile {...props} />;
  if (breakpoint === 'tablet' || breakpoint === 'tablet-portrait') return <Tablet {...props} />;
  return <Desktop {...props} />;
}
```

## Ajustes de Layout en App.tsx

### Margins Dinámicos

El componente `App.tsx` ajusta los márgenes según el dispositivo:

```typescript
// Margen izquierdo (para sidebar)
marginLeft: isTabletPortrait 
  ? '160px' // Sidebar fijo en tablet-portrait
  : isMobile
  ? '0' // Sin sidebar fijo en mobile (usa drawer)
  : isTablet
  ? 'var(--sidebar-width-tablet-horizontal)' // Tablet horizontal: 200px
  : (isSidebarCollapsed ? '80px' : 'var(--sidebar-width)'), // Desktop

// Margen inferior (para header inferior en mobile/tablet-portrait)
marginBottom: (isTabletPortrait || isMobile) 
  ? 'var(--header-height)' // Header inferior ocupa espacio
  : '0', // Desktop no tiene header inferior
```

### Comportamiento del Sidebar

```typescript
// Mobile: Sidebar es un drawer (se abre/cierra)
// Tablet Portrait: Sidebar fijo a 160px
// Tablet Horizontal: Sidebar fijo a 200px
// Desktop: Sidebar colapsable (240px o 80px)
```

## Header y Sidebar Responsivos

### Header

El componente `Header` selecciona automáticamente la versión correcta:

```typescript
// components/Header.tsx
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { HeaderDesktop } from "./layout/HeaderDesktop";
import { HeaderMobile } from "./layout/HeaderMobile";
import { HeaderTablet } from "./layout/HeaderTablet";
import { HeaderTabletPortrait } from "./layout/HeaderTabletPortrait";

export function Header(props: HeaderProps) {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'mobile') return <HeaderMobile {...props} />;
  if (breakpoint === 'tablet-portrait') return <HeaderTabletPortrait {...props} />;
  if (breakpoint === 'tablet') return <HeaderTablet {...props} />;
  return <HeaderDesktop {...props} />;
}
```

### Sidebar

Similar al Header, el Sidebar se selecciona automáticamente:

```typescript
// components/Sidebar.tsx
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { SidebarDesktop } from "./layout/SidebarDesktop";
import { SidebarMobile } from "./layout/SidebarMobile";
import { SidebarTablet } from "./layout/SidebarTablet";
import { SidebarTabletPortrait } from "./layout/SidebarTabletPortrait";

export function Sidebar(props: SidebarProps) {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'mobile') return <SidebarMobile {...props} />;
  if (breakpoint === 'tablet-portrait') return <SidebarTabletPortrait {...props} />;
  if (breakpoint === 'tablet') return <SidebarTablet {...props} />;
  return <SidebarDesktop {...props} />;
}
```

## Detección de Orientación

El hook `useBreakpoint` detecta automáticamente la orientación:

```typescript
// Detecta si es portrait o landscape
const isPortrait = height > width;
const aspectRatio = width / height;

// Tablets horizontales: aspect ratio entre 1.3 y 1.8
if (width >= BREAKPOINTS.tablet && width <= 1600 && 
    aspectRatio >= 1.3 && aspectRatio <= 1.8 && !isPortrait) {
  return 'tablet'; // Tablet horizontal
}
```

## Event Listeners

El hook se actualiza automáticamente cuando:

1. **Resize de ventana**: `window.addEventListener('resize', handleResize)`
2. **Cambio de orientación**: `window.addEventListener('orientationchange', handleResize)`

Esto asegura que los componentes se actualicen inmediatamente al cambiar el tamaño u orientación del dispositivo.

## Mejores Prácticas

1. **Usar wrappers**: Crear componentes wrapper que seleccionen automáticamente la versión correcta
2. **Evitar selección manual repetida**: Centralizar la lógica de selección
3. **Testing**: Probar en todos los breakpoints
4. **Performance**: El hook solo se recalcula en resize/orientationchange
5. **SSR Safety**: El hook retorna 'desktop' por defecto en servidor (`typeof window === 'undefined'`)

## Ejemplo Completo

```typescript
// components/InicioResumen.tsx
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Calendar3Months as CalendarDesktop } from "@/components/calendar/desktop";
import { Calendar3Months as CalendarMobile } from "@/components/calendar/mobile";
import { Calendar3Months as CalendarTablet } from "@/components/calendar/tablet";
import { TaskSummaryWidget as WidgetDesktop } from "@/components/tasks/desktop";
import { TaskSummaryWidget as WidgetMobile } from "@/components/tasks/mobile";
import { TaskSummaryWidget as WidgetTablet } from "@/components/tasks/tablet";

export function InicioResumen() {
  const breakpoint = useBreakpoint();
  const tasks = useTasks();
  
  // Seleccionar componentes según dispositivo
  const Calendar = breakpoint === 'mobile' 
    ? CalendarMobile 
    : breakpoint === 'tablet' || breakpoint === 'tablet-portrait'
    ? CalendarTablet 
    : CalendarDesktop;
    
  const Widget = breakpoint === 'mobile' 
    ? WidgetMobile 
    : breakpoint === 'tablet' || breakpoint === 'tablet-portrait'
    ? WidgetTablet 
    : WidgetDesktop;

  return (
    <div>
      <Calendar tasks={tasks} />
      <Widget tasks={tasks} />
    </div>
  );
}
```

---

*Última actualización: Integración en App.tsx documentada*

