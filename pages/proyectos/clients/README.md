# Página de Clientes - Versiones por Dispositivo

Esta carpeta contiene las versiones responsivas de la página de Clientes, organizadas por tipo de dispositivo.

## Estructura

```
clients/
├── desktop/
│   ├── Clientes.tsx      # Versión Desktop (> 1024px)
│   └── index.ts
├── tablet-horizontal/
│   ├── Clientes.tsx      # Versión Tablet Horizontal (768px - 1024px, horizontal)
│   └── index.ts
├── tablet/
│   ├── Clientes.tsx      # Versión Tablet Portrait (768px - 1024px, vertical)
│   └── index.ts
├── mobile/
│   ├── Clientes.tsx      # Versión Mobile (< 768px)
│   └── index.ts
└── README.md
```

## Layouts por Dispositivo

### Desktop (> 1024px)
- **Layout**: Listado (66%) + Chart (33%) lado a lado
- **Archivo**: `desktop/Clientes.tsx`
- **Componente**: `ClientesDesktop`

### Tablet Horizontal (768px - 1024px, horizontal)
- **Layout**: Chart pequeño arriba (250px) + Listado abajo (resto)
- **Archivo**: `tablet-horizontal/Clientes.tsx`
- **Componente**: `ClientesTabletHorizontal`

### Tablet Portrait (768px - 1024px, vertical)
- **Layout**: Solo Chart (sin listado)
- **Archivo**: `tablet/Clientes.tsx`
- **Componente**: `ClientesTablet`

### Mobile (< 768px)
- **Layout**: Chart pequeño arriba (200px) + Listado abajo (resto)
- **Archivo**: `mobile/Clientes.tsx`
- **Componente**: `ClientesMobile`

## Uso

El archivo principal `pages/proyectos/Clientes.tsx` detecta automáticamente el breakpoint y renderiza la versión correspondiente.

## Próximos Pasos

Los componentes funcionales se crearán en `components/clients/` con la misma estructura de carpetas:
- `components/clients/desktop/`
- `components/clients/tablet-horizontal/`
- `components/clients/tablet/`
- `components/clients/mobile/`

Cada versión de dispositivo trabajará con sus propios componentes optimizados para ese formato.

