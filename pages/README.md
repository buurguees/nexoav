# Páginas (Pages)

Este directorio contiene las **páginas/vistas principales** de la aplicación, organizadas por módulo.

## Estructura

```
pages/
├── inicio/              # Módulo Inicio
│   ├── InicioResumen.tsx      # Vista Resumen (calendario 3 meses)
│   ├── InicioCalendario.tsx   # Vista Calendario (calendario detallado)
│   └── index.ts               # Exportaciones del módulo
└── README.md            # Este archivo
```

## Organización

Cada módulo tiene su propia carpeta dentro de `pages/`:
- **`pages/inicio/`**: Páginas del módulo "Inicio"
- **`pages/proyectos/`**: Páginas del módulo "Proyectos" (futuro)
- **`pages/facturacion/`**: Páginas del módulo "Facturación" (futuro)
- etc.

## Diferencia con `components/`

- **`components/`**: Componentes reutilizables (calendarios, tareas, UI, etc.)
- **`pages/`**: Vistas/páginas completas que componen la aplicación

## Uso

```typescript
// Importar desde el módulo
import { InicioResumen, InicioCalendario } from './pages/inicio';

// O importar individualmente
import { InicioResumen } from './pages/inicio/InicioResumen';
```

## Convenciones

1. **Una carpeta por módulo**: Cada módulo tiene su propia subcarpeta
2. **Archivo `index.ts`**: Exporta todos los componentes del módulo para facilitar imports
3. **Nombres descriptivos**: Los nombres de archivo reflejan su función
4. **Separación de responsabilidades**: Las páginas orquestan componentes, no contienen lógica de negocio compleja

---

*Última actualización: Estructura de páginas documentada*

