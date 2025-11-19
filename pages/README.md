# Páginas (Pages)

Este directorio contiene las **páginas/vistas principales** de la aplicación, organizadas por módulo del sidebar.

## Estructura

```
pages/
├── inicio/              # Módulo Inicio
│   ├── desktop/
│   │   ├── InicioResumen.tsx
│   │   ├── InicioCalendario.tsx
│   │   └── index.ts
│   ├── mobile/          # (Por implementar)
│   ├── tablet/          # (Por implementar)
│   ├── tablet-horizontal/ # (Por implementar)
│   ├── components/      # Componentes específicos del módulo
│   └── index.ts
├── calendario/          # Módulo Calendario
│   ├── desktop/
│   ├── mobile/
│   ├── tablet/
│   ├── tablet-horizontal/
│   ├── components/
│   └── index.ts
├── clientes/            # Módulo Clientes
│   ├── desktop/
│   │   ├── Clientes.tsx
│   │   └── index.ts
│   ├── mobile/
│   ├── tablet/
│   ├── tablet-horizontal/
│   ├── components/
│   │   └── ClientesLayoutTemplate.tsx
│   └── index.ts
├── proyectos/           # Módulo Proyectos
│   ├── desktop/
│   │   ├── Proyectos.tsx
│   │   └── index.ts
│   ├── mobile/
│   ├── tablet/
│   ├── tablet-horizontal/
│   ├── components/
│   └── index.ts
├── proveedores/         # Módulo Proveedores
├── gastos/              # Módulo Gastos
├── facturacion/         # Módulo Facturación
├── inventario/          # Módulo Inventario
├── tesoreria/           # Módulo Tesorería
├── contabilidad/        # Módulo Contabilidad
├── impuestos/           # Módulo Impuestos
└── README.md            # Este archivo
```

## Organización

Cada módulo tiene su propia carpeta dentro de `pages/` con la siguiente estructura:

- **`desktop/`**: Versiones para pantallas desktop (> 1024px)
- **`mobile/`**: Versiones para dispositivos móviles (< 768px)
- **`tablet/`**: Versiones para tablets en modo portrait (768px - 1024px, vertical)
- **`tablet-horizontal/`**: Versiones para tablets en modo landscape (768px - 1024px, horizontal)
- **`components/`**: Componentes específicos del módulo (no reutilizables globalmente)
- **`index.ts`**: Archivo principal que exporta el componente del módulo y selecciona automáticamente la versión según el dispositivo

## Convenciones

1. **Una carpeta por módulo**: Cada módulo del sidebar tiene su propia subcarpeta
2. **Archivo `index.ts`**: Exporta el componente principal del módulo que selecciona automáticamente la versión correcta según el breakpoint
3. **Versiones responsivas**: Cada módulo puede tener versiones específicas para desktop, mobile, tablet y tablet-horizontal
4. **Componentes específicos**: Los componentes que solo se usan en un módulo específico van en `components/` dentro de ese módulo
5. **Nombres descriptivos**: Los nombres de archivo reflejan su función
6. **Separación de responsabilidades**: Las páginas orquestan componentes, no contienen lógica de negocio compleja

## Uso

```typescript
// Importar desde el módulo
import { Clientes } from './pages/clientes';
import { Proyectos } from './pages/proyectos';

// O importar individualmente
import { Clientes } from './pages/clientes/index';
```

## Módulos Implementados

- ✅ **Inicio**: Vista de resumen y calendario
- ✅ **Clientes**: Listado de clientes con versiones responsivas
- ✅ **Proyectos**: Listado de proyectos con versiones responsivas
- 🚧 **Calendario**: Por implementar
- 🚧 **Proveedores**: Por implementar
- 🚧 **Gastos**: Por implementar
- 🚧 **Facturación**: Por implementar
- 🚧 **Inventario**: Por implementar
- 🚧 **Tesorería**: Por implementar
- 🚧 **Contabilidad**: Por implementar
- 🚧 **Impuestos**: Por implementar

## Diferencia con `components/`

- **`components/`**: Componentes reutilizables globalmente (calendarios, tareas, UI, etc.)
- **`pages/`**: Vistas/páginas completas que componen la aplicación, organizadas por módulo del sidebar

---

*Última actualización: Reorganización completa por módulos del sidebar*
