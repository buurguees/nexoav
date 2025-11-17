# Hook useBreakpoint - Documentación Técnica

## Descripción

El hook `useBreakpoint` es el núcleo del sistema de detección de dispositivos en la aplicación. Detecta automáticamente el tipo de dispositivo basándose en el ancho de la ventana, altura y orientación.

## Ubicación

`hooks/useBreakpoint.ts`

## API

### useBreakpoint()

Hook principal que retorna el breakpoint actual.

**Retorna**: `Breakpoint` - `'mobile' | 'tablet' | 'tablet-portrait' | 'desktop'`

**Ejemplo**:
```typescript
const breakpoint = useBreakpoint();
// 'mobile' | 'tablet' | 'tablet-portrait' | 'desktop'
```

### useIsMobile()

Hook auxiliar que retorna `true` si el dispositivo es mobile.

**Retorna**: `boolean`

**Ejemplo**:
```typescript
const isMobile = useIsMobile();
if (isMobile) {
  // Lógica específica para mobile
}
```

### useIsTablet()

Hook auxiliar que retorna `true` si el dispositivo es tablet (cualquier orientación).

**Retorna**: `boolean`

**Ejemplo**:
```typescript
const isTablet = useIsTablet();
if (isTablet) {
  // Lógica específica para tablet
}
```

### useIsDesktop()

Hook auxiliar que retorna `true` si el dispositivo es desktop.

**Retorna**: `boolean`

**Ejemplo**:
```typescript
const isDesktop = useIsDesktop();
if (isDesktop) {
  // Lógica específica para desktop
}
```

### useBreakpointInfo()

Hook que retorna información completa del breakpoint actual.

**Retorna**: 
```typescript
{
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isTabletPortrait: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}
```

**Ejemplo**:
```typescript
const { breakpoint, isMobile, width, height } = useBreakpointInfo();
console.log(`Breakpoint: ${breakpoint}, Width: ${width}, Height: ${height}`);
```

## Lógica de Detección

### Breakpoints Definidos

```typescript
export const BREAKPOINTS = {
  mobile: 768,      // < 768px: móvil
  tablet: 1024,    // 768px - 1024px: tablet
  desktop: 1025,    // > 1024px: desktop
} as const;
```

### Algoritmo de Detección

1. **Mobile** (`< 768px`):
   - Si `width < 768px` → `'mobile'`

2. **Tablet Portrait** (`768px - 1024px`, vertical):
   - Si `768px <= width < 1024px` y `height > width` → `'tablet-portrait'`

3. **Tablet Horizontal** (`768px - 1600px`, horizontal, aspect ratio 1.3-1.8):
   - Si `width >= 768px` y `width <= 1600px`
   - Y `aspectRatio >= 1.3` y `aspectRatio <= 1.8`
   - Y `height <= width` (landscape)
   - → `'tablet'`

4. **Desktop** (`> 1024px` o fuera de los rangos de tablet):
   - Cualquier otro caso → `'desktop'`

### Cálculo de Aspect Ratio

```typescript
const aspectRatio = width / height;

// Tablets horizontales típicos:
// iPad Pro 12.9": 1024x1366 (portrait) → 1366/1024 = 1.33 (landscape)
// iPad Air: 820x1180 (portrait) → 1180/820 = 1.44 (landscape)
// Rango típico: 1.3 - 1.8
```

## Actualización Automática

El hook se actualiza automáticamente cuando:

1. **Resize de ventana**: El usuario cambia el tamaño de la ventana
2. **Cambio de orientación**: El dispositivo rota (mobile/tablet)

**Event Listeners**:
```typescript
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);
```

**Cleanup**: Los listeners se eliminan automáticamente cuando el componente se desmonta.

## SSR Safety

El hook es seguro para Server-Side Rendering (SSR):

```typescript
const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
  if (typeof window === 'undefined') return 'desktop'; // SSR: retorna desktop por defecto
  // ... lógica de detección
});
```

## Performance

- **Inicialización**: El breakpoint se calcula una vez al montar el componente
- **Actualización**: Solo se recalcula en eventos de resize/orientationchange
- **Memoización**: El estado se mantiene hasta que cambia el tamaño de ventana

## Casos Especiales

### Tablets Horizontales Grandes

Tablets horizontales grandes (hasta 1600px) se detectan como `'tablet'` en lugar de `'desktop'`:

```typescript
// iPad Pro 12.9" en landscape: 1366x1024
// Se detecta como 'tablet' aunque tenga más de 1024px de ancho
if (width >= BREAKPOINTS.tablet && width <= 1600 && 
    aspectRatio >= 1.3 && aspectRatio <= 1.8 && !isPortrait) {
  return 'tablet';
}
```

**Razón**: Mantener la experiencia de tablet incluso en tablets grandes en orientación horizontal.

### Dispositivos en el Límite

- **767px**: Se detecta como `'mobile'`
- **768px**: Se detecta como `'tablet'` o `'tablet-portrait'` según orientación
- **1024px**: Se detecta como `'tablet'` (si cumple condiciones) o `'desktop'`
- **1025px+**: Se detecta como `'desktop'` (a menos que sea tablet horizontal)

## Ejemplos de Uso

### Ejemplo 1: Selección Simple

```typescript
const breakpoint = useBreakpoint();

if (breakpoint === 'mobile') {
  return <MobileComponent />;
}
if (breakpoint === 'tablet' || breakpoint === 'tablet-portrait') {
  return <TabletComponent />;
}
return <DesktopComponent />;
```

### Ejemplo 2: Con Hooks Auxiliares

```typescript
const isMobile = useIsMobile();
const isTablet = useIsTablet();

if (isMobile) return <MobileComponent />;
if (isTablet) return <TabletComponent />;
return <DesktopComponent />;
```

### Ejemplo 3: Con Información Completa

```typescript
const { breakpoint, isMobile, width, height } = useBreakpointInfo();

console.log(`Device: ${breakpoint}, Size: ${width}x${height}`);

if (isMobile && width < 400) {
  // Dispositivo muy pequeño
  return <CompactMobileComponent />;
}
if (isMobile) {
  return <MobileComponent />;
}
```

### Ejemplo 4: Ajuste de Layout

```typescript
const { isMobile, isTablet, width } = useBreakpointInfo();

const sidebarWidth = isMobile 
  ? 0 // Sin sidebar en mobile
  : isTablet 
  ? 200 // Sidebar reducido en tablet
  : 240; // Sidebar completo en desktop

const marginLeft = sidebarWidth;
```

## Testing

### Test Manual

1. Abrir DevTools
2. Cambiar tamaño de ventana
3. Verificar que el breakpoint se actualiza correctamente
4. Rotar dispositivo (si es posible)
5. Verificar detección de orientación

### Test Automatizado

```typescript
// Ejemplo con testing-library
import { renderHook } from '@testing-library/react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 500, // Mobile
});

const { result } = renderHook(() => useBreakpoint());
expect(result.current).toBe('mobile');
```

## Troubleshooting

### El breakpoint no se actualiza

- Verificar que los event listeners están activos
- Comprobar que no hay errores en la consola
- Verificar que `window` está disponible (no en SSR)

### Detección incorrecta de tablet

- Verificar el aspect ratio del dispositivo
- Comprobar que `width` y `height` son correctos
- Ajustar los rangos en `BREAKPOINTS` si es necesario

### Performance issues

- El hook solo se actualiza en resize/orientationchange
- Si hay problemas, considerar debounce en el handler

---

*Última actualización: Hook useBreakpoint documentado*

