# Proceso de Desarrollo de Componentes Responsivos

## Flujo de Trabajo

### 1. Identificar Necesidad de Versión Responsiva

**Cuándo crear una versión específica**:

- ✅ El componente necesita diferentes layouts según dispositivo
- ✅ Los tamaños/espaciados deben variar significativamente
- ✅ La información mostrada cambia entre dispositivos
- ✅ Las interacciones son diferentes (hover vs touch)

**Cuándo NO crear una versión específica**:

- ❌ El componente es suficientemente flexible con CSS
- ❌ Solo cambian colores o tamaños menores
- ❌ Se puede resolver con media queries en CSS

### 2. Crear Versión Base (Desktop)

**Paso 1**: Crear el componente en la carpeta `desktop/`

```typescript
// components/tasks/desktop/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 6 }: TaskCategoryDotProps) {
  // Implementación completa
}
```

**Paso 2**: Documentar props, funcionalidades y casos de uso

**Paso 3**: Probar en desktop

### 3. Crear Versiones para Otros Dispositivos

**Orden recomendado**: Desktop → Tablet → Mobile

#### Para Tablet

1. **Copiar componente desktop** a `tablet/`
2. **Ajustar tamaños**: Reducir ~15%
3. **Ajustar layout**: Si es necesario
4. **Actualizar clases CSS**: Añadir sufijo `-tablet`
5. **Probar en tablet**

**Ejemplo**:

```typescript
// components/tasks/tablet/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 5 }: TaskCategoryDotProps) {
  // Misma lógica, tamaño reducido
  return (
    <div className={cn("task-category-dot-tablet", className)}>
      {/* ... */}
    </div>
  );
}
```

#### Para Mobile

1. **Copiar componente tablet** (o desktop) a `mobile/`
2. **Ajustar tamaños**: Reducir ~35% vs desktop
3. **Simplificar layout**: Una columna, menos información
4. **Actualizar clases CSS**: Añadir sufijo `-mobile`
5. **Optimizar para touch**: Áreas de toque más grandes
6. **Probar en mobile**

**Ejemplo**:

```typescript
// components/tasks/mobile/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 4 }: TaskCategoryDotProps) {
  // Misma lógica, tamaño más reducido
  return (
    <div 
      className={cn("task-category-dot-mobile", className)}
      style={{
        // Estilos específicos para mobile
        display: "inline-block",
        verticalAlign: "middle",
      }}
    >
      {/* ... */}
    </div>
  );
}
```

### 4. Crear Archivos Index

Cada carpeta de dispositivo debe tener su `index.ts`:

```typescript
// components/tasks/desktop/index.ts
export { TaskCategoryDot } from "./TaskCategoryDot";
export { TaskSummaryWidget } from "./TaskSummaryWidget";

// components/tasks/mobile/index.ts
export { TaskCategoryDot } from "./TaskCategoryDot";
export { TaskSummaryWidget } from "./TaskSummaryWidget";
```

### 5. Crear Estilos CSS Específicos

**Estructura de estilos**:

```
src/styles/
├── components/
│   ├── mobile.css
│   ├── tablet-portrait.css
│   └── tablet-horizontal.css
└── ui/
    ├── calendar-mobile.css
    ├── calendar-tablet.css
    └── calendar.css (desktop)
```

**Convención de nombres**:

- Desktop: Sin sufijo (ej: `calendar.css`)
- Tablet: Sufijo `-tablet` (ej: `calendar-tablet.css`)
- Mobile: Sufijo `-mobile` (ej: `calendar-mobile.css`)

### 6. Integrar en Componentes de Páginas

**Opción 1: Detección manual**

```typescript
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TaskCategoryDot as TaskDotDesktop } from "@/components/tasks/desktop";
import { TaskCategoryDot as TaskDotMobile } from "@/components/tasks/mobile";

export function MyComponent() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  const TaskDot = isMobile ? TaskDotMobile : TaskDotDesktop;
  
  return <TaskDot type="installation" />;
}
```

**Opción 2: Hook de selección**

```typescript
import { useResponsiveComponent } from "@/hooks/useResponsiveComponent";
import { TaskCategoryDot as TaskDotDesktop } from "@/components/tasks/desktop";
import { TaskCategoryDot as TaskDotMobile } from "@/components/tasks/mobile";
import { TaskCategoryDot as TaskDotTablet } from "@/components/tasks/tablet";

export function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsiveComponent();
  
  if (isMobile) return <TaskDotMobile type="installation" />;
  if (isTablet) return <TaskDotTablet type="installation" />;
  return <TaskDotDesktop type="installation" />;
}
```

**Opción 3: Componente wrapper (recomendado)**

```typescript
// components/tasks/TaskCategoryDot.tsx (wrapper)
import { useResponsiveComponent } from "@/hooks/useResponsiveComponent";
import { TaskCategoryDot as Desktop } from "./desktop";
import { TaskCategoryDot as Mobile } from "./mobile";
import { TaskCategoryDot as Tablet } from "./tablet";

export function TaskCategoryDot(props: TaskCategoryDotProps) {
  const { isMobile, isTablet } = useResponsiveComponent();
  
  if (isMobile) return <Mobile {...props} />;
  if (isTablet) return <Tablet {...props} />;
  return <Desktop {...props} />;
}
```

### 7. Testing

**Checklist de testing**:

- [ ] Componente funciona en desktop
- [ ] Componente funciona en tablet
- [ ] Componente funciona en mobile
- [ ] Props son consistentes entre versiones
- [ ] Estilos se aplican correctamente
- [ ] Interacciones funcionan (hover, touch, click)
- [ ] Performance es aceptable en cada dispositivo
- [ ] Accesibilidad se mantiene

### 8. Documentación

**Actualizar documentación**:

- [ ] Añadir a `docs/responsive-components/diferencias-dispositivos.md`
- [ ] Documentar cambios específicos en cada versión
- [ ] Actualizar ejemplos de uso
- [ ] Documentar props y comportamientos

---

## Buenas Prácticas

### 1. Mantener Props Consistentes

**✅ Correcto**:

```typescript
// Todas las versiones usan la misma interfaz
export interface TaskCategoryDotProps {
  type: TaskType;
  className?: string;
  size?: number;
}
```

**❌ Incorrecto**:

```typescript
// Desktop
export interface TaskCategoryDotProps {
  type: TaskType;
  size?: number;
}

// Mobile (falta className)
export interface TaskCategoryDotProps {
  type: TaskType;
  size?: number;
}
```

### 2. Usar Valores por Defecto Apropiados

```typescript
// Desktop: tamaño estándar
size = 6

// Tablet: tamaño reducido
size = 5

// Mobile: tamaño más reducido
size = 4
```

### 3. Documentar Diferencias en Comentarios

```typescript
/**
 * Componente reutilizable - Versión Mobile
 * 
 * Diferencias vs Desktop:
 * - Tamaño por defecto: 4px (vs 6px desktop)
 * - Clase CSS: task-category-dot-mobile
 * - Display: inline-block (vs flex desktop)
 */
export function TaskCategoryDot({ ... }) { ... }
```

### 4. Reutilizar Lógica Compartida

**Extraer lógica común**:

```typescript
// lib/taskUtils.ts
export function getTaskColor(type: TaskType): string {
  // Lógica compartida
}

// Todas las versiones usan esta función
import { getTaskColor } from "../../../lib/taskCategories";
```

### 5. Evitar Duplicación Excesiva

**Si la lógica es idéntica, considerar**:

- Componente base compartido
- Hook personalizado
- Utilidad compartida

**Ejemplo**:

```typescript
// components/tasks/TaskCategoryDotBase.tsx (compartido)
export function TaskCategoryDotBase({ type, size, className, variant }: Props) {
  const color = getTaskColor(type);
  const baseClass = `task-category-dot-${variant}`;
  
  return (
    <div className={cn(baseClass, className)} style={{ ... }}>
      {/* ... */}
    </div>
  );
}

// Versiones específicas solo ajustan variant y size
export function TaskCategoryDot({ type, size = 6, ...props }) {
  return <TaskCategoryDotBase type={type} size={size} variant="desktop" {...props} />;
}
```

---

## Checklist de Desarrollo

### Antes de Crear Versión Responsiva

- [ ] ¿Realmente necesita una versión específica?
- [ ] ¿Se puede resolver con CSS/media queries?
- [ ] ¿Las props serán consistentes?

### Durante el Desarrollo

- [ ] Crear versión desktop primero
- [ ] Documentar props y funcionalidades
- [ ] Crear versiones tablet y mobile
- [ ] Mantener props consistentes
- [ ] Añadir clases CSS específicas
- [ ] Probar en cada dispositivo

### Después del Desarrollo

- [ ] Testing en todos los dispositivos
- [ ] Actualizar documentación
- [ ] Revisar performance
- [ ] Verificar accesibilidad
- [ ] Actualizar ejemplos de uso

---

## Ejemplo Completo: TaskCategoryDot

### 1. Versión Desktop

```typescript
// components/tasks/desktop/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 6, className }: Props) {
  const color = getTaskColor(type);
  return (
    <div className={cn("task-category-dot", className)} style={{ ... }} />
  );
}
```

### 2. Versión Tablet

```typescript
// components/tasks/tablet/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 5, className }: Props) {
  const color = getTaskColor(type);
  return (
    <div className={cn("task-category-dot-tablet", className)} style={{ ... }} />
  );
}
```

### 3. Versión Mobile

```typescript
// components/tasks/mobile/TaskCategoryDot.tsx
export function TaskCategoryDot({ type, size = 4, className }: Props) {
  const color = getTaskColor(type);
  return (
    <div 
      className={cn("task-category-dot-mobile", className)}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        // ... otros estilos mobile
      }}
    />
  );
}
```

### 4. Wrapper (Opcional)

```typescript
// components/tasks/TaskCategoryDot.tsx
export function TaskCategoryDot(props: Props) {
  const { isMobile, isTablet } = useResponsiveComponent();
  if (isMobile) return <Mobile {...props} />;
  if (isTablet) return <Tablet {...props} />;
  return <Desktop {...props} />;
}
```

---

*Última actualización: Proceso de desarrollo documentado*

