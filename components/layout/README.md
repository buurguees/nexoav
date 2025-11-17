# Estructura de Layout Responsive

Este directorio contiene las versiones responsive de los componentes principales del layout.

## Principio Fundamental

**Desktop es la versión original y por defecto**. Todas las demás versiones (tablet, mobile) son adaptaciones de la versión desktop.

## Estructura

```
components/layout/
├── HeaderDesktop.tsx    # Versión original del Header (desktop)
├── HeaderTablet.tsx     # Adaptación del Header para tablets
├── HeaderMobile.tsx     # Adaptación del Header para móviles
├── SidebarDesktop.tsx   # Versión original del Sidebar (desktop)
├── SidebarTablet.tsx    # Adaptación del Sidebar para tablets
└── SidebarMobile.tsx    # Adaptación del Sidebar para móviles
```

## Breakpoints

Los breakpoints están definidos en `hooks/useBreakpoint.ts`:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (versión original)

## Cómo Funciona

1. Los componentes principales (`Header.tsx`, `Sidebar.tsx`) detectan el breakpoint actual usando `useBreakpoint()`
2. Renderizan la versión apropiada según el dispositivo
3. Desktop siempre es la versión por defecto y original

## Agregar Nuevas Versiones Responsive

1. Crear el componente en `components/layout/` siguiendo el patrón `[Component][Breakpoint].tsx`
2. Importar y usar en el componente principal
3. Mantener la funcionalidad de desktop como referencia

## Convenciones

- **Desktop**: Versión completa con todas las funcionalidades
- **Tablet**: Versión adaptada, puede ocultar algunos elementos o usar drawers
- **Mobile**: Versión simplificada, usa drawers/sheets para navegación

