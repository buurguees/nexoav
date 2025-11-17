# Componentes Reutilizables: Calendarios

## Descripción General

Los componentes de calendario están ubicados en `components/calendar/` y proporcionan funcionalidades reutilizables para visualizar calendarios con tareas y eventos.

**Ubicación**: `components/calendar/`

**Archivos**:
- `Calendar18.tsx` - Calendario principal con visualización de tareas
- `Calendar3Months.tsx` - Calendario de 3 meses con indicadores de tareas
- `DayPopup.tsx` - Popup modal para mostrar información de un día
- `index.ts` - Exportaciones centralizadas

---

## Componentes

### 1. Calendar18

**Archivo**: `components/calendar/Calendar18.tsx`

#### Descripción

Calendario principal y más completo de la aplicación. Muestra un mes completo con visualización detallada de tareas como franjas (`TaskBar`) dentro de cada día. Incluye integración con `DayPopup` para mostrar información detallada al hacer clic en un día.

#### Características Principales

- **Vista de 1 mes**: Muestra un mes completo con mayor detalle
- **Visualización de tareas**: Muestra las tareas como franjas dentro de cada día
- **Algoritmo de solapamiento**: Organiza automáticamente las tareas en filas cuando se solapan
- **Interactividad**: Al hacer clic en un día, se abre automáticamente `DayPopup`
- **Renderizado dinámico**: Inyecta las `TaskBar` en las celdas después del render usando DOM manipulation

#### Props

```typescript
interface Calendar18Props {
  className?: string;                    // Clases CSS adicionales
  selectedDate?: Date;                   // Fecha seleccionada inicialmente
  onDateSelect?: (date: Date | undefined) => void;  // Callback al seleccionar fecha
  onMonthChange?: (month: Date) => void;  // Callback al cambiar de mes
  showOutsideDays?: boolean;             // Mostrar días fuera del mes actual (default: true)
  tasks?: Task[];                         // Array de tareas a mostrar
}
```

#### Interfaz Task

```typescript
export interface Task {
  id: string;                            // Identificador único
  title: string;                         // Título de la tarea
  startDate: Date;                       // Fecha de inicio
  endDate: Date;                        // Fecha de fin
  type: TaskType;                        // Categoría de la tarea (obligatorio)
  completed?: boolean;                   // Estado de completado
  color?: string;                        // Color personalizado (opcional)
  jobId?: string;                        // ID del trabajo/proyecto asociado
  companyId?: string;                    // ID de la empresa/cliente
  assignmentId?: string;                 // ID de la asignación
}
```

#### Funcionalidades Técnicas

##### 1. Algoritmo de Asignación de Filas

El componente implementa un algoritmo inteligente para evitar solapamientos visuales:

```typescript
// Función para verificar si dos tareas se solapan
const tasksOverlap = (task1: Task, task2: Task): boolean => {
  const start1 = startOfDay(task1.startDate);
  const end1 = endOfDay(task1.endDate);
  const start2 = startOfDay(task2.startDate);
  const end2 = endOfDay(task2.endDate);
  
  return (start1 <= end2 && start2 <= end1);
};

// Algoritmo para asignar filas
const assignTaskRows = (tasks: Task[]): Map<string, number> => {
  // 1. Ordenar tareas por fecha de inicio y duración
  // 2. Para cada tarea, encontrar la primera fila libre
  // 3. Una fila está ocupada si hay otra tarea que se solapa
  // 4. Retornar un mapa de taskId -> fila asignada
};
```

**Características del algoritmo**:
- Ordena tareas por fecha de inicio
- Si empiezan el mismo día, ordena por duración (más largas primero)
- Asigna la primera fila disponible que no tenga conflictos
- Garantiza que tareas solapadas estén en filas diferentes

##### 2. Renderizado Dinámico de TaskBars

El componente inyecta las barras de tareas después del render usando DOM manipulation:

```typescript
React.useEffect(() => {
  // 1. Obtener todas las celdas del calendario
  const cells = calendarRef.current.querySelectorAll('.calendar-empresa-cell');
  
  // 2. Para cada celda:
  cells.forEach((cell) => {
    // - Obtener la fecha del día
    // - Filtrar tareas que corresponden a ese día
    // - Crear TaskBars dinámicamente
    // - Posicionar según la fila asignada
    // - Aplicar estilos (bordes redondeados en inicio/fin)
  });
  
  // 3. Cleanup al desmontar
  return () => { /* limpiar TaskBars */ };
}, [date, tasks]);
```

**Detalles de renderizado**:
- **Posición vertical**: `33px + (fila * 25px)` - 33px es la posición inicial, 25px es altura + espacio
- **Bordes redondeados**: Solo en inicio/fin de tarea
- **Título**: Solo se muestra en el primer día de la tarea
- **Color**: Se obtiene de `getTaskColor(task.type)` o `task.color`
- **Opacidad**: 0.6 si está completada, 1.0 si no

##### 3. Integración con DayPopup

Al hacer clic en un día:
1. Se selecciona la fecha (`setDate`)
2. Se abre automáticamente `DayPopup` (`setIsPopupOpen(true)`)
3. Se pasan las tareas del día al popup
4. Al cerrar el popup, se deselecciona el día

#### Estilos

Utiliza las clases CSS definidas en `src/styles/components/ui/calendar-empresa.css`:

- `calendar-empresa-container` - Contenedor principal
- `calendar-empresa-day` - Estilos de días
- `calendar-empresa-cell` - Celdas del calendario
- Variables CSS para personalización completa

#### Ejemplo de Uso

```typescript
import { Calendar18, Task } from "@/components/calendar";

const tasks: Task[] = [
  {
    id: "task-1",
    title: "Instalación de sistema",
    startDate: new Date(2025, 10, 18),
    endDate: new Date(2025, 10, 20),
    type: "installation",
    completed: false,
  },
  // ...
];

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  return (
    <Calendar18
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      tasks={tasks}
      showOutsideDays={true}
    />
  );
}
```

---

### 2. Calendar3Months

**Archivo**: `components/calendar/Calendar3Months.tsx`

#### Descripción

Calendario simplificado que muestra 3 meses simultáneamente (mes actual + 2 meses siguientes). Utiliza indicadores visuales (puntos de color) para marcar los días que tienen tareas, en lugar de mostrar las tareas completas como franjas.

#### Características Principales

- **Vista de 3 meses**: Muestra el mes actual y los 2 meses siguientes
- **Indicadores visuales**: Muestra puntos de color (`TaskCategoryDot`) para cada categoría de tarea
- **Rango limitado**: Solo permite visualizar desde hoy hasta 2 meses en el futuro
- **Múltiples puntos**: Si un día tiene tareas de diferentes categorías, muestra un punto por cada categoría

#### Props

```typescript
interface Calendar3MonthsProps {
  className?: string;                    // Clases CSS adicionales
  selectedDate?: Date;                   // Fecha seleccionada inicialmente
  onDateSelect?: (date: Date | undefined) => void;  // Callback al seleccionar fecha
  showOutsideDays?: boolean;             // Mostrar días fuera del mes actual (default: true)
  tasks?: Task[];                        // Array de tareas a mostrar
}
```

#### Funcionalidades Técnicas

##### 1. Cálculo de Rango de Fechas

```typescript
const today = new Date();
today.setHours(0, 0, 0, 0);

// Último día del mes que está 2 meses después de hoy
const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, 0);
twoMonthsLater.setHours(23, 59, 59, 999);
```

##### 2. Renderizado de Puntos de Categoría

El componente inyecta puntos de color usando React DOM manipulation:

```typescript
React.useEffect(() => {
  // 1. Obtener todas las celdas del calendario
  const cells = calendarRef.current.querySelectorAll('.calendar-cell');
  
  // 2. Para cada celda:
  cells.forEach((cell) => {
    // - Obtener la fecha del día (parseando desde el DOM)
    // - Obtener categorías únicas de tareas para ese día
    // - Crear TaskCategoryDot para cada categoría
    // - Montar usando createRoot de React
  });
  
  // 3. Cleanup: desmontar roots y eliminar contenedores
  return () => { /* cleanup */ };
}, [date, tasks, today, twoMonthsLater]);
```

**Detalles de renderizado**:
- **Parseo de fecha**: Intenta obtener desde `data-date`, `<time datetime>`, o parseando el texto del mes
- **Categorías únicas**: Usa `Set<TaskType>` para evitar duplicados
- **Posicionamiento**: Puntos centrados en la parte inferior de la celda
- **React Roots**: Usa `createRoot` para montar componentes React en el DOM

##### 3. Obtención de Fecha desde DOM

El componente implementa múltiples estrategias para obtener la fecha de cada día:

1. **Desde `data-date`**: `dayButton.getAttribute('data-date')`
2. **Desde `<time datetime>`**: `timeElement.getAttribute('datetime')`
3. **Parseando texto del mes**: Extrae mes y año del caption del calendario

#### Estilos

Utiliza las clases CSS definidas en `src/styles/components/ui/calendar.css`:

- `calendar-container` - Contenedor principal
- `calendar-day` - Estilos de días
- `calendar-cell` - Celdas del calendario

#### Ejemplo de Uso

```typescript
import { Calendar3Months, Task } from "@/components/calendar";

const tasks: Task[] = [
  {
    id: "task-1",
    title: "Instalación",
    startDate: new Date(2025, 10, 18),
    endDate: new Date(2025, 10, 20),
    type: "installation",
  },
  // ...
];

function MyCalendar() {
  return (
    <Calendar3Months
      tasks={tasks}
      showOutsideDays={true}
    />
  );
}
```

---

### 3. DayPopup

**Archivo**: `components/calendar/DayPopup.tsx`

#### Descripción

Componente modal (Dialog) que se muestra cuando el usuario hace clic en un día del calendario. Muestra información detallada sobre el día seleccionado, incluyendo todas las tareas programadas para ese día.

#### Características Principales

- **Modal/Dialog**: Se abre como un popup centrado en la pantalla
- **Formato de fecha**: Muestra la fecha en formato legible en español
- **Lista de tareas**: Muestra todas las tareas del día con sus categorías y fechas
- **Información de categoría**: Muestra el color y nombre de la categoría de cada tarea

#### Props

```typescript
interface DayPopupProps {
  open: boolean;                         // Controla si el popup está abierto
  onOpenChange: (open: boolean) => void; // Callback al cambiar el estado
  date: Date | undefined;                // Fecha del día seleccionado
  tasksForDay?: Task[];                  // Array de tareas del día
}
```

#### Funcionalidades

##### 1. Formateo de Fecha

```typescript
const formattedDate = format(date, "EEEE, d 'de' MMMM 'de' yyyy", {
  locale: es,
});
// Resultado: "Lunes, 18 de noviembre de 2025"
```

##### 2. Visualización de Tareas

Para cada tarea muestra:
- **Punto de color**: Indicador visual de la categoría
- **Título**: Nombre de la tarea
- **Categoría**: Nombre de la categoría (obtenido de `getTaskCategory`)
- **Rango de fechas**: Fecha de inicio y fin formateadas

##### 3. Estado Vacío

Si no hay tareas, muestra un mensaje: "No hay tareas programadas para este día"

#### Ejemplo de Uso

```typescript
import { DayPopup, Task } from "@/components/calendar";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const tasks: Task[] = [/* ... */];
  
  const tasksForDay = tasks.filter(task => {
    // Filtrar tareas que corresponden al día seleccionado
    return isWithinInterval(selectedDate, {
      start: startOfDay(task.startDate),
      end: endOfDay(task.endDate)
    });
  });
  
  return (
    <DayPopup
      open={isOpen}
      onOpenChange={setIsOpen}
      date={selectedDate}
      tasksForDay={tasksForDay}
    />
  );
}
```

---

## Exportaciones Centralizadas

**Archivo**: `components/calendar/index.ts`

```typescript
export { Calendar18, type Task } from "./Calendar18";
export { Calendar3Months } from "./Calendar3Months";
export { DayPopup } from "./DayPopup";
```

**Uso recomendado**:

```typescript
// Importar desde el índice centralizado
import { Calendar18, Calendar3Months, DayPopup, Task } from "@/components/calendar";
```

---

## Dependencias

- **react-day-picker**: Base del componente `Calendar` (a través de `./ui/calendar`)
- **date-fns**: Para manejo de fechas (`isSameDay`, `isWithinInterval`, `startOfDay`, `endOfDay`, `format`)
- **date-fns/locale/es**: Localización en español
- **lib/taskCategories**: Para obtener colores y categorías de tareas (`getTaskColor`, `getTaskCategory`, `TaskType`)

---

## Notas de Implementación

### Renderizado Dinámico

Tanto `Calendar18` como `Calendar3Months` utilizan **DOM manipulation** para inyectar elementos después del render. Esto es necesario porque:

1. El componente base `Calendar` de `react-day-picker` no expone hooks para personalizar el contenido de las celdas
2. Necesitamos acceso al DOM para posicionar elementos absolutamente
3. Permite mayor control sobre el layout y posicionamiento

### Cleanup

Ambos componentes implementan cleanup adecuado:
- `Calendar18`: Elimina contenedores `.task-bar-container`
- `Calendar3Months`: Desmonta React roots y elimina contenedores `.task-dot-container`

### Responsive

Los componentes utilizan variables CSS que se adaptan a diferentes tamaños de pantalla:
- `--cell-size`: Tamaño de las celdas (responsive)
- Media queries en los archivos CSS

---

## Mejores Prácticas

1. **Filtrar tareas por módulo**: Antes de pasar tareas a los calendarios, filtrar según el módulo (Inicio solo muestra 4 categorías CORE)

2. **Manejo de fechas**: Siempre normalizar fechas usando `startOfDay` y `endOfDay` para comparaciones

3. **Performance**: Los efectos de renderizado se ejecutan solo cuando cambian `date` o `tasks`

4. **Accesibilidad**: Los componentes incluyen atributos ARIA y títulos para mejor accesibilidad

---

*Última actualización: Documentación de componentes de calendario creada*

