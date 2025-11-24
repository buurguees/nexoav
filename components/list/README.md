# Componente DataList

Componente reutilizable para crear listados de datos con título, filtros, herramientas y tabla responsiva.

## Características

- ✅ **Título configurable**: Título personalizable para cada listado
- ✅ **Filtros opcionales**: Activables/desactivables con prop `showFilters`
- ✅ **Herramientas opcionales**: Activables/desactivables con prop `showTools`
- ✅ **Tabla responsiva**: Se adapta automáticamente según el breakpoint:
  - **Desktop/Tablet-horizontal**: 5 columnas
  - **Tablet**: 4 columnas
  - **Mobile**: 3 columnas
- ✅ **Flexible**: Permite personalizar completamente la lectura y trabajo de datos
- ✅ **Type-safe**: Totalmente tipado con TypeScript

## Uso Básico

```tsx
import { DataList, DataListColumn } from "../../components/list";

interface MyData {
  id: string;
  name: string;
  status: string;
}

const columns: DataListColumn<MyData>[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "status",
    label: "Estado",
    render: (item) => <Badge>{item.status}</Badge>,
  },
];

function MyList() {
  const data: MyData[] = [
    { id: "1", name: "Item 1", status: "active" },
    { id: "2", name: "Item 2", status: "inactive" },
  ];

  return (
    <DataList
      title="Mi Listado"
      data={data}
      columns={columns}
      showFilters={true}
      showTools={true}
    />
  );
}
```

## Props

### DataListProps

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `title` | `string` | ✅ | Título del listado |
| `data` | `T[]` | ✅ | Array de datos a mostrar |
| `columns` | `DataListColumn<T>[]` | ✅ | Definición de columnas |
| `showFilters` | `boolean` | ❌ | Mostrar sección de filtros (default: `false`) |
| `showTools` | `boolean` | ❌ | Mostrar sección de herramientas (default: `false`) |
| `renderFilters` | `() => ReactNode` | ❌ | Función para renderizar filtros personalizados |
| `renderTools` | `() => ReactNode` | ❌ | Función para renderizar herramientas personalizadas |
| `renderRow` | `(item: T, index: number) => ReactNode` | ❌ | Función para renderizar filas personalizadas |
| `onRowClick` | `(item: T, index: number) => void` | ❌ | Callback al hacer click en una fila |
| `onRowDoubleClick` | `(item: T, index: number) => void` | ❌ | Callback al hacer doble click en una fila |
| `isLoading` | `boolean` | ❌ | Estado de carga (default: `false`) |
| `emptyMessage` | `string` | ❌ | Mensaje cuando no hay datos (default: `"No hay datos disponibles"`) |
| `className` | `string` | ❌ | Clase CSS adicional para el contenedor de datos |
| `containerClassName` | `string` | ❌ | Clase CSS adicional para el contenedor principal |

### DataListColumn

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `key` | `string` | ✅ | Clave del campo en el objeto de datos |
| `label` | `string` | ✅ | Etiqueta de la columna en el header |
| `render` | `(item: T, index: number) => ReactNode` | ❌ | Función para renderizar el contenido de la celda |
| `className` | `string` | ❌ | Clase CSS adicional para las celdas |
| `headerClassName` | `string` | ❌ | Clase CSS adicional para el header |
| `visibleOn` | `{ desktop?: boolean, tablet?: boolean, mobile?: boolean }` | ❌ | Control de visibilidad por breakpoint |

## Ejemplos

### Ejemplo Completo con Filtros y Herramientas

```tsx
import { DataList, DataListColumn } from "../../components/list";
import { useState, useMemo } from "react";

interface Client {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

function ClientsList({ clients }: { clients: Client[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const columns: DataListColumn<Client>[] = [
    {
      key: "name",
      label: "Nombre",
      visibleOn: { desktop: true, tablet: true, mobile: true },
    },
    {
      key: "email",
      label: "Email",
      visibleOn: { desktop: true, tablet: true, mobile: false },
    },
    {
      key: "status",
      label: "Estado",
      render: (client) => (
        <span className={client.status === "active" ? "text-green" : "text-red"}>
          {client.status}
        </span>
      ),
      visibleOn: { desktop: true, tablet: true, mobile: true },
    },
  ];

  return (
    <DataList
      title="Clientes"
      data={filteredClients}
      columns={columns}
      showFilters={true}
      showTools={true}
      renderFilters={() => (
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      renderTools={() => (
        <button>+ Nuevo Cliente</button>
      )}
      onRowClick={(client) => console.log("Clicked:", client)}
    />
  );
}
```

### Control de Visibilidad por Breakpoint

```tsx
const columns: DataListColumn<MyData>[] = [
  {
    key: "id",
    label: "ID",
    visibleOn: {
      desktop: true,   // Visible en desktop
      tablet: true,    // Visible en tablet
      mobile: true,    // Visible en mobile
    },
  },
  {
    key: "details",
    label: "Detalles",
    visibleOn: {
      desktop: true,   // Visible en desktop
      tablet: false,   // Oculto en tablet
      mobile: false,   // Oculto en mobile
    },
  },
];
```

## Responsive

El componente se adapta automáticamente según el breakpoint:

- **Desktop** (`> 1024px`): Muestra hasta 5 columnas
- **Tablet-horizontal** (`768px - 1024px`, horizontal): Muestra hasta 5 columnas
- **Tablet-portrait** (`768px - 1024px`, vertical): Muestra hasta 4 columnas
- **Mobile** (`< 768px`): Muestra hasta 3 columnas

Las columnas se seleccionan según:
1. El orden en el array `columns`
2. La propiedad `visibleOn` de cada columna
3. El límite de columnas según el breakpoint

## Estilos

El componente usa las variables CSS del proyecto:

- `var(--background)`: Fondo principal
- `var(--background-secondary)`: Fondo secundario
- `var(--foreground)`: Color de texto principal
- `var(--foreground-secondary)`: Color de texto secundario
- `var(--border-soft)`: Borde suave
- `var(--border-medium)`: Borde medio
- `var(--spacing-*)`: Espaciados
- `var(--font-size-*)`: Tamaños de fuente
- `var(--font-weight-*)`: Pesos de fuente
- `var(--radius-*)`: Radios de borde

## Notas

- El componente es completamente genérico y no depende de ninguna estructura de datos específica
- Cada implementación puede personalizar completamente la lectura y trabajo de datos
- Los filtros y herramientas son opcionales y se pueden activar/desactivar fácilmente
- El componente maneja automáticamente el scroll y la responsividad

