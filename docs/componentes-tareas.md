# Componentes Reutilizables: Tareas

## Descripción General

Los componentes de tareas están ubicados en `components/tasks/` y proporcionan funcionalidades reutilizables para visualizar y representar tareas en diferentes contextos (calendarios, listas, etc.).

**Ubicación**: `components/tasks/`

**Archivos**:
- `TaskBar.tsx` - Franja visual de tarea para calendarios ✅ **Implementado**
- `TaskCategoryDot.tsx` - Punto de color que representa una categoría ✅ **Implementado**
- `InicioResumenTaskWidget.tsx` - Widget de resumen para Inicio > Resumen ⏳ **A crear**
- `TaskCalendarList.tsx` - Listado de tareas para Inicio > Calendario ✅ **Implementado**
- `TaskForm.tsx` - Formulario de creación/edición de tareas ⏳ **A crear**
- `index.ts` - Exportaciones centralizadas ✅ **Implementado**

**Nota**: Los componentes marcados con ⏳ **A crear** están documentados como especificaciones de diseño. Esta documentación sirve como guía para su implementación futura.

---

## Sistema de Estados de Tareas

### Descripción

El sistema de tareas incluye un sistema de estados que permite rastrear el progreso de cada tarea. Los estados pueden ser modificados manualmente por el usuario o cambiar automáticamente según la fecha y hora de la tarea.

### Estados Disponibles

El sistema define tres estados principales:

1. **Completado** 🟢
   - **Color**: Verde (`#22c55e` o similar)
   - **Icono**: ✓ (tick/check)
   - **Descripción**: Tarea finalizada

2. **En proceso** 🟠
   - **Color**: Naranja (`#f97316` o similar)
   - **Icono**: ⏱️ (reloj)
   - **Descripción**: Tarea actualmente en ejecución

3. **Pendiente** ⚪
   - **Color**: Gris (`#6b7280` o similar)
   - **Icono**: Ninguno (o indicador neutro)
   - **Descripción**: Tarea programada pero aún no iniciada

### Definición de Tipos

```typescript
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: TaskType;
  status: TaskStatus; // Estado de la tarea (obligatorio)
  // ... otros campos
  startTime?: string; // Formato: "HH:mm" (ej: "09:00", "14:30")
  endTime?: string; // Formato: "HH:mm" (ej: "17:00", "18:30")
  // Campos de ubicación
  address?: string; // Dirección completa
  city?: string; // Población/ciudad ✨ **NUEVO**
  postal_code?: string; // Código postal
  country?: string; // País
}
```

### Mapa de Estados

```typescript
export const TASK_STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  color: string;
  icon: string;
}> = {
  pending: {
    label: "Pendiente",
    color: "#6b7280", // Gris
    icon: "", // Sin icono o indicador neutro
  },
  in_progress: {
    label: "En proceso",
    color: "#f97316", // Naranja
    icon: "⏱️", // Reloj
  },
  completed: {
    label: "Completado",
    color: "#22c55e", // Verde
    icon: "✓", // Tick
  },
};
```

### Gestión Manual de Estados

Los usuarios pueden cambiar el estado de una tarea manualmente mediante un desplegable (select/dropdown) en:

- **Formulario de edición de tarea** (`TaskForm`)
- **Vista de detalle de tarea**
- **Listados de tareas** (tablas y widgets)

**Ejemplo de componente de selección de estado**:

```typescript
<Select
  value={task.status}
  onValueChange={(newStatus: TaskStatus) => {
    updateTaskStatus(task.id, newStatus);
  }}
>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pending">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#6b7280" }}>⚪</span>
        Pendiente
      </div>
    </SelectItem>
    <SelectItem value="in_progress">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#f97316" }}>⏱️</span>
        En proceso
      </div>
    </SelectItem>
    <SelectItem value="completed">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#22c55e" }}>✓</span>
        Completado
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### Lógica Automática de Cambio de Estado

El sistema incluye una lógica automática que cambia el estado de las tareas según la fecha y hora actual:

#### Reglas de Cambio Automático

1. **Cambio a "En proceso"**:
   - Se activa cuando la fecha y hora actual coinciden con la fecha y hora de inicio de la tarea
   - Solo se aplica si el estado actual es "Pendiente"
   - **NO se aplica si el estado es "Completado"** (prioridad manual)

2. **Protección de estado "Completado"**:
   - Si una tarea está marcada manualmente como "Completado", **nunca** cambiará automáticamente a "En proceso"
   - Esto previene que tareas ya finalizadas se reactiven automáticamente

#### Algoritmo de Evaluación

```typescript
function evaluateTaskStatus(task: Task, currentDate: Date): TaskStatus {
  // Si está completado manualmente, mantener el estado
  if (task.status === "completed") {
    return "completed";
  }

  // Calcular fecha/hora de inicio de la tarea
  const taskStartDateTime = combineDateAndTime(
    task.startDate,
    task.startTime || "00:00"
  );

  // Si la fecha/hora actual coincide o ha pasado la fecha/hora de inicio
  if (currentDate >= taskStartDateTime) {
    // Y el estado actual es "Pendiente", cambiar a "En proceso"
    if (task.status === "pending") {
      return "in_progress";
    }
  }

  // Mantener el estado actual
  return task.status;
}

function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}
```

#### Ejemplos de Funcionamiento

**Ejemplo 1: Tarea que cambia automáticamente**

```
Tarea: Instalación
Fecha inicio: 18 de noviembre de 2025
Hora inicio: 09:00
Estado inicial: Pendiente

- Día 17 de noviembre, 10:00 → Estado: Pendiente (aún no ha llegado la fecha/hora)
- Día 18 de noviembre, 08:59 → Estado: Pendiente (aún no ha llegado la hora)
- Día 18 de noviembre, 09:00 → Estado: En proceso (cambio automático)
- Día 18 de noviembre, 10:00 → Estado: En proceso (mantiene el estado)
```

**Ejemplo 2: Tarea completada manualmente (no cambia automáticamente)**

```
Tarea: Incidencia
Fecha inicio: 18 de noviembre de 2025
Hora inicio: 10:00
Estado inicial: Pendiente

- Día 17 de noviembre, 20:00 → Usuario marca manualmente: Completado
- Día 18 de noviembre, 09:59 → Estado: Completado (no cambia)
- Día 18 de noviembre, 10:00 → Estado: Completado (NO cambia automáticamente)
- Día 18 de noviembre, 11:00 → Estado: Completado (mantiene el estado manual)
```

**Ejemplo 3: Tarea sin hora específica**

```
Tarea: Reunión
Fecha inicio: 18 de noviembre de 2025
Hora inicio: (no especificada, se asume 00:00)
Estado inicial: Pendiente

- Día 18 de noviembre, 00:00 → Estado: En proceso (cambio automático al inicio del día)
```

### Visualización de Estados en Componentes

#### En Tablas y Listados

Los estados deben mostrarse visualmente en todos los componentes que muestran tareas:

```typescript
// Ejemplo en TaskCalendarList o MonthlyTaskList
<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <span
    style={{
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: TASK_STATUS_CONFIG[task.status].color,
    }}
  />
  <span style={{ color: TASK_STATUS_CONFIG[task.status].color }}>
    {TASK_STATUS_CONFIG[task.status].icon}
  </span>
  <span>{TASK_STATUS_CONFIG[task.status].label}</span>
</div>
```

#### En Widgets

Los widgets de resumen (`TaskSummaryWidget`) también deben mostrar el estado:

```typescript
// Ejemplo en TaskSummaryWidget
<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
  <span style={{ color: TASK_STATUS_CONFIG[task.status].color }}>
    {TASK_STATUS_CONFIG[task.status].icon}
  </span>
  <span style={{ 
    fontSize: "10px",
    color: TASK_STATUS_CONFIG[task.status].color 
  }}>
    {TASK_STATUS_CONFIG[task.status].label}
  </span>
</div>
```

#### En TaskBar (Calendario)

El `TaskBar` puede mostrar un indicador de estado:

```typescript
// Ejemplo en TaskBar
<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
  <span style={{ 
    fontSize: "10px",
    color: TASK_STATUS_CONFIG[task.status].color 
  }}>
    {TASK_STATUS_CONFIG[task.status].icon}
  </span>
  <span>{task.title}</span>
</div>
```

### Implementación Técnica

#### Hook para Evaluación Automática

```typescript
// hooks/useTaskStatus.ts
import { useEffect, useState } from "react";
import { Task, TaskStatus } from "@/components/calendar/Calendar18";

export function useTaskStatus(task: Task): TaskStatus {
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task.status);

  useEffect(() => {
    // Evaluar estado cada minuto
    const interval = setInterval(() => {
      const now = new Date();
      const newStatus = evaluateTaskStatus(task, now);
      
      if (newStatus !== currentStatus) {
        setCurrentStatus(newStatus);
        // Opcional: actualizar en backend
        // updateTaskStatus(task.id, newStatus);
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [task, currentStatus]);

  return currentStatus;
}
```

#### Función de Evaluación Global

```typescript
// lib/taskStatus.ts
import { Task, TaskStatus } from "@/components/calendar/Calendar18";

export function evaluateTaskStatus(task: Task, currentDate: Date = new Date()): TaskStatus {
  // Protección: si está completado manualmente, mantener
  if (task.status === "completed") {
    return "completed";
  }

  // Si no tiene hora, usar inicio del día (00:00)
  const startTime = task.startTime || "00:00";
  const [hours, minutes] = startTime.split(':').map(Number);
  
  const taskStartDateTime = new Date(task.startDate);
  taskStartDateTime.setHours(hours, minutes, 0, 0);

  // Si la fecha/hora actual >= fecha/hora de inicio
  if (currentDate >= taskStartDateTime) {
    // Y el estado es "Pendiente", cambiar a "En proceso"
    if (task.status === "pending") {
      return "in_progress";
    }
  }

  // Mantener estado actual
  return task.status;
}

// Función para obtener configuración de estado
export function getTaskStatusConfig(status: TaskStatus) {
  return TASK_STATUS_CONFIG[status];
}
```

### Integración con Backend

Cuando se implemente el backend, el estado debe:

1. **Persistirse** en la base de datos
2. **Sincronizarse** entre cliente y servidor
3. **Evaluarse periódicamente** en el servidor (opcional, para evitar dependencia del cliente)
4. **Notificarse** cuando cambie automáticamente (opcional, para alertas)

### Notas Importantes

1. **Prioridad manual sobre automática**: Si un usuario marca una tarea como "Completado", ese estado tiene prioridad absoluta y no cambiará automáticamente.

2. **Evaluación periódica**: La evaluación del estado debe ejecutarse periódicamente (cada minuto o al cargar/actualizar la vista) para detectar cambios automáticos.

3. **Sin notificaciones para completadas**: Si una tarea está "Completado" y llega su fecha/hora de inicio, **no se genera ninguna notificación** ni cambio de estado.

4. **Estados en todos los componentes**: Todos los componentes que muestran tareas (tablas, widgets, calendarios) deben mostrar el estado visualmente.

---

## Componentes

### 1. TaskBar

**Archivo**: `components/tasks/TaskBar.tsx`

#### Descripción

Componente reutilizable que muestra una tarea como una franja horizontal de color dentro de un calendario. Se utiliza principalmente en `Calendar18` para visualizar tareas que se extienden a lo largo de varios días.

#### Características Principales

- **Visualización de tarea**: Muestra el título de la tarea en una franja de color
- **Colores automáticos**: Asigna colores según la categoría (`type`) de la tarea
- **Estado completado**: Reduce la opacidad cuando la tarea está completada
- **Posicionamiento absoluto**: Se posiciona absolutamente dentro de su contenedor
- **Responsive**: Se adapta al tamaño del contenedor

#### Props

```typescript
export interface TaskBarProps {
  /** Título de la tarea */
  title: string;
  
  /** Color de la franja (opcional, se asigna según type si no se especifica) */
  color?: string;
  
  /** Posición vertical de la franja (en píxeles desde arriba) */
  top?: number;
  
  /** Altura de la franja en píxeles */
  height?: number;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Si la tarea está completada */
  completed?: boolean;
  
  /** Categoría de la tarea (obligatorio para asignar color automático) */
  type?: TaskType;
}
```

#### Funcionalidades

##### 1. Asignación de Color

El componente asigna colores automáticamente según la categoría:

```typescript
// Obtener color según la categoría (type) de la tarea
// Si no hay type ni color, usar un color por defecto
const barColor = color || (type ? getTaskColor(type) : "var(--accent-blue-primary)");
```

**Prioridad de colores**:
1. `color` (prop personalizado) - Mayor prioridad
2. `getTaskColor(type)` - Si se proporciona `type`
3. `var(--accent-blue-primary)` - Color por defecto

##### 2. Estado Visual

```typescript
const opacity = completed ? 0.6 : 1;
```

- **Completado**: Opacidad 0.6 (60%)
- **No completado**: Opacidad 1.0 (100%)

##### 3. Estilos Aplicados

```typescript
style={{
  position: "absolute",
  left: 0,
  right: 0,
  top: `${top}px`,           // Por defecto: 28px
  height: `${height}px`,      // Por defecto: 20px
  backgroundColor: barColor,
  opacity: opacity,
  display: "flex",
  alignItems: "center",
  paddingLeft: "8px",
  paddingRight: "8px",
  cursor: "pointer",
  zIndex: 1,
  transition: "opacity var(--transition-default)",
}}
```

**Características del texto**:
- Tamaño de fuente: `11px`
- Color: `#ffffff` (blanco)
- `white-space: nowrap` - No se corta en múltiples líneas
- `overflow: hidden` + `text-overflow: ellipsis` - Muestra "..." si es muy largo

#### Uso en Calendar18

En `Calendar18`, el componente `TaskBar` se crea dinámicamente usando DOM manipulation:

```typescript
// Ejemplo de cómo Calendar18 crea TaskBars
const taskBar = document.createElement('div');
taskBar.className = 'task-bar';
taskBar.style.cssText = `
  position: absolute;
  left: 0;
  right: 0;
  top: ${topPosition}px;
  height: 20px;
  background-color: ${barColor};
  opacity: ${opacity};
  border-radius: ${borderRadius};  // Redondeado en inicio/fin
`;

// Título solo en el primer día
const titleSpan = document.createElement('span');
titleSpan.textContent = isStart ? task.title : '';
```

**Nota**: Aunque `TaskBar` es un componente React, en `Calendar18` se crea como elemento DOM directamente para mayor control sobre el posicionamiento.

#### Ejemplo de Uso Directo

```typescript
import { TaskBar } from "@/components/tasks";

function MyComponent() {
  return (
    <div style={{ position: "relative", height: "100px" }}>
      <TaskBar
        title="Instalación de sistema"
        type="installation"
        top={28}
        height={20}
        completed={false}
      />
    </div>
  );
}
```

#### Valores por Defecto

- `top`: `28` (píxeles)
- `height`: `20` (píxeles)
- `completed`: `false`
- `color`: Se asigna automáticamente según `type`

---

### 2. TaskCategoryDot

**Archivo**: `components/tasks/TaskCategoryDot.tsx`

#### Descripción

Componente reutilizable que muestra un punto de color circular que representa una categoría de tarea. Se utiliza principalmente en `Calendar3Months` para mostrar indicadores visuales de las categorías de tareas asignadas a cada día.

#### Características Principales

- **Indicador visual**: Punto circular de color que representa una categoría
- **Color automático**: Obtiene el color de la categoría desde `getTaskColor`
- **Tamaño configurable**: Permite ajustar el tamaño del punto
- **Accesibilidad**: Incluye atributos ARIA y título

#### Props

```typescript
export interface TaskCategoryDotProps {
  /** Categoría de la tarea (obligatorio) */
  type: TaskType;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Tamaño del punto en píxeles */
  size?: number;
}
```

#### Funcionalidades

##### 1. Obtención de Color

```typescript
const color = getTaskColor(type);
```

El color se obtiene automáticamente desde el sistema de categorías (`lib/taskCategories`).

##### 2. Estilos Aplicados

```typescript
style={{
  width: `${size}px`,        // Por defecto: 6px
  height: `${size}px`,        // Por defecto: 6px
  borderRadius: "50%",        // Círculo perfecto
  backgroundColor: color,
  flexShrink: 0,              // No se comprime
}}
```

##### 3. Accesibilidad

```typescript
title={type}                  // Tooltip con el tipo
aria-label={`Categoría: ${type}`}  // Etiqueta para lectores de pantalla
```

#### Uso en Calendar3Months

En `Calendar3Months`, se crean múltiples puntos si un día tiene tareas de diferentes categorías:

```typescript
// Obtener categorías únicas para el día
const taskTypes = getTaskTypesForDay(dayDate);

// Crear un punto por cada categoría
const dotElements = Array.from(taskTypes).map((taskType) =>
  React.createElement(TaskCategoryDot, {
    key: taskType,
    type: taskType,
    size: 6,
  })
);

// Montar usando createRoot
const root = createRoot(dotsContainer);
root.render(React.createElement(React.Fragment, null, ...dotElements));
```

**Características**:
- Múltiples puntos si hay múltiples categorías
- Espaciado de `3px` entre puntos (`gap: 3px`)
- Posicionado en la parte inferior de la celda del calendario

#### Ejemplo de Uso Directo

```typescript
import { TaskCategoryDot } from "@/components/tasks";

function MyComponent() {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <TaskCategoryDot type="installation" size={6} />
      <TaskCategoryDot type="meeting" size={6} />
      <TaskCategoryDot type="incident" size={8} />
    </div>
  );
}
```

#### Valores por Defecto

- `size`: `6` (píxeles)

---

### 3. InicioResumenTaskWidget

**Archivo**: `components/tasks/InicioResumenTaskWidget.tsx` (a crear)

#### Descripción

Widget anotativo, visual, sencillo y rápido de leer que muestra un resumen de las tareas más relevantes del mes. Funciona como complemento directo de `Calendar3Months` en la vista **Inicio > Resumen**.

#### Características Principales

- **Widget compacto**: Diseño ligero y visualmente simple
- **Priorización temporal**: Muestra tareas de hoy y próximos días
- **Información mínima**: Solo título y referencia temporal básica
- **Color de categoría**: Usa el color de categoría como referencia visual
- **Sin detalles extensos**: No muestra descripciones ni metadata completa

#### Props

```typescript
export interface InicioResumenTaskWidgetProps {
  /** Array de tareas del periodo visible */
  tasks: Task[];
  
  /** Fecha de referencia para priorizar tareas (por defecto: hoy) */
  referenceDate?: Date;
  
  /** Número máximo de tareas a mostrar (por defecto: 5-7) */
  maxTasks?: number;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Callback al hacer clic en una tarea */
  onTaskClick?: (task: Task) => void;
}
```

#### Funcionalidades

##### 1. Priorización de Tareas

El widget prioriza tareas según su proximidad temporal:

```typescript
// Algoritmo de priorización
const prioritizeTasks = (tasks: Task[], referenceDate: Date): Task[] => {
  const today = startOfDay(referenceDate);
  const nextWeek = addDays(today, 7);
  
  return tasks
    .filter(task => {
      const taskStart = startOfDay(task.startDate);
      const taskEnd = endOfDay(task.endDate);
      // Incluir tareas que están activas en el periodo visible
      return isWithinInterval(today, { start: taskStart, end: taskEnd }) ||
             (taskStart >= today && taskStart <= nextWeek);
    })
    .sort((a, b) => {
      // Priorizar: hoy > próximos días > resto
      const aIsToday = isSameDay(a.startDate, today);
      const bIsToday = isSameDay(b.startDate, today);
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;
      
      // Luego por fecha de inicio
      return a.startDate.getTime() - b.startDate.getTime();
    })
    .slice(0, maxTasks);
};
```

##### 2. Presentación Condensada

Cada tarea se muestra en una fila muy simple:

```typescript
// Estructura de cada fila
<div className="task-widget-row">
  {/* Indicador de color de categoría */}
  <TaskCategoryDot type={task.type} size={8} />
  
  {/* Título de la tarea */}
  <span className="task-title">{task.title}</span>
  
  {/* Referencia temporal básica */}
  <span className="task-time">
    {formatRelativeTime(task.startDate, referenceDate)}
  </span>
</div>
```

**Información mostrada**:
- **Indicador de color**: Punto de color según categoría
- **Título**: Texto corto de la tarea
- **Referencia temporal**: "Hoy", "Mañana", "En 3 días", o fecha formateada

**Información NO mostrada**:
- Descripciones extensas
- Todas las propiedades de la tarea
- Metadata avanzada
- Campos extendidos

##### 3. Integración con Calendar3Months

El widget trabaja sobre el mismo conjunto de tareas que `Calendar3Months`:

```typescript
// En InicioResumen.tsx
const { tasks } = useCalendarTasks(currentPeriod);
const filteredTasks = filterTasksByModule(tasks, "inicio");

return (
  <div>
    <Calendar3Months tasks={filteredTasks} />
    <InicioResumenTaskWidget 
      tasks={filteredTasks}
      referenceDate={new Date()}
      maxTasks={6}
    />
  </div>
);
```

#### Objetivos de Diseño

- **Ser muy ligero visualmente**: No sobrecargar la vista
- **Consultado de pasada**: Información rápida sin interacción compleja
- **Complemento del calendario**: Refuerza la información visual del calendario

#### Ejemplo de Uso

```typescript
import { InicioResumenTaskWidget } from "@/components/tasks";
import { Task } from "@/components/calendar";

function InicioResumen() {
  const tasks: Task[] = [/* ... */];
  
  return (
    <InicioResumenTaskWidget
      tasks={tasks}
      referenceDate={new Date()}
      maxTasks={6}
      onTaskClick={(task) => {
        // Navegar a detalle o abrir popup
        console.log("Tarea clickeada:", task);
      }}
    />
  );
}
```

#### Valores por Defecto

- `referenceDate`: `new Date()` (hoy)
- `maxTasks`: `6`
- `onTaskClick`: `undefined` (opcional)

---

### 4. TaskCalendarList

**Archivo**: `components/tasks/desktop/TaskCalendarList.tsx` ✅ **Implementado**

**Versiones disponibles**:
- `components/tasks/desktop/TaskCalendarList.tsx` - Versión desktop
- `components/tasks/mobile/TaskCalendarList.tsx` - Versión mobile
- `components/tasks/tablet/TaskCalendarList.tsx` - Versión tablet portrait
- `components/tasks/tablet-horizontal/TaskCalendarList.tsx` - Versión tablet horizontal

#### Descripción

Componente de listado mensual de tareas asociado a la vista de `Calendar18`. Muestra todas las tareas del mes en curso, permitiendo entender qué se hace y cuándo, sin entrar en el nivel de detalle total que tendrá **Inicio > Tareas**.

#### Características Principales

- **Listado mensual**: Muestra todas las tareas del mes actual
- **Agrupación por día**: Organiza tareas por día para facilitar la lectura
- **Información intermedia**: Más información que el widget, menos que la vista completa
- **Puente visual-gestión**: Conecta la vista de calendario con la gestión avanzada
- **Sincronización con Calendar18**: Trabaja sobre el mismo rango temporal

#### Props

```typescript
export interface TaskCalendarListProps {
  /** Tareas ya filtradas por el módulo que lo usa */
  tasks: Task[];
  
  /** Mes a mostrar (por defecto: mes actual) */
  month?: Date;
  
  /** Módulo que está usando el componente (para determinar las categorías) */
  module?: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos";
  
  /** Acción al hacer clic en una tarea */
  onTaskClick?: (task: Task) => void;
  
  /** Callback al hacer clic en un día */
  onDayClick?: (date: Date) => void;
  
  /** Estilos adicionales */
  className?: string;
}
```

#### Funcionalidades

##### 1. Agrupación por Día

Las tareas se agrupan y organizan por día:

```typescript
// Agrupar tareas por día
const groupTasksByDay = (tasks: Task[]): Map<string, Task[]> => {
  const grouped = new Map<string, Task[]>();
  
  tasks.forEach(task => {
    // Obtener todos los días que abarca la tarea
    const days = eachDayOfInterval({
      start: startOfDay(task.startDate),
      end: endOfDay(task.endDate)
    });
    
    days.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      if (!grouped.has(dayKey)) {
        grouped.set(dayKey, []);
      }
      grouped.get(dayKey)!.push(task);
    });
  });
  
  return grouped;
};
```

##### 2. Información Mostrada

Para cada tarea se muestra:

**Desktop y Tablet-Horizontal**:

```typescript
// Estructura de cada tarea en el listado
<div className="task-list-item">
  {/* Primera línea: Título y población */}
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <h5>{task.title}</h5>
    {/* Población a la derecha del título */}
    {task.city && (
      <span style={{ fontSize: "10px", color: "var(--foreground-secondary)" }}>
        {task.city}
      </span>
    )}
  </div>
  
  {/* Segunda línea: Fechas, estado y horario */}
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    {/* Fechas */}
    <span>{dateRange}</span>
    
    {/* Estado, población y horario en columna */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      {/* Primera línea: Estado y población */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
        {/* Indicador de estado */}
        <span style={{ color: statusConfig.color }}>
          {statusConfig.icon}
        </span>
        {/* Población (si no se mostró arriba) */}
        {task.city && (
          <span style={{ fontSize: "10px", color: "var(--foreground-secondary)" }}>
            {task.city}
          </span>
        )}
      </div>
      {/* Segunda línea: Horario */}
      {(task.startTime || task.endTime) && (
        <span style={{ fontSize: "10px" }}>
          {task.startTime} - {task.endTime}
        </span>
      )}
    </div>
  </div>
</div>
```

**Mobile y Tablet Portrait**:

Layout similar pero adaptado a pantallas más pequeñas, con información más compacta.

**Información incluida**:
- ✅ Título de la tarea
- ✅ **Población/ciudad** (`task.city`) ✨ **NUEVO**
- ✅ Fechas de inicio y fin (formateadas)
- ✅ **Estado de la tarea** (icono y color) ✨ **NUEVO**
- ✅ Horario asociado (si existe)
- ✅ Categoría visualmente identificable
- ✅ Día de la tarea (agrupación)

**Información NO incluida**:
- ❌ Descripciones extensas
- ❌ Todos los campos extendidos
- ❌ Toda la metadata disponible
- ❌ Funcionalidades de gestión avanzada

**Nota**: El contador de tareas ("X tareas") debajo del mes ha sido eliminado. Solo se muestra el título del mes.

##### 3. Organización Temporal

El listado se organiza de forma que:

```typescript
// Estructura del listado
<div className="task-list">
  {sortedDays.map(day => (
    <div key={dayKey} className="task-day-group">
      {/* Encabezado del día */}
      <div className="day-header">
        <h3>{format(day, "EEEE, d 'de' MMMM", { locale: es })}</h3>
        <span className="task-count">{dayTasks.length} tarea(s)</span>
      </div>
      
      {/* Lista de tareas del día */}
      <div className="day-tasks">
        {dayTasks.map(task => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  ))}
</div>
```

##### 4. Sincronización con Calendar18

El componente trabaja sobre el mismo rango temporal:

```typescript
// En InicioCalendario.tsx
const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
const { tasks } = useCalendarTasks(currentMonth);
const filteredTasks = filterTasksByModule(tasks, "inicio");

return (
  <div>
    <Calendar18 
      tasks={filteredTasks}
      onMonthChange={setCurrentMonth}
    />
    <InicioCalendarioTaskList
      tasks={filteredTasks}
      month={currentMonth}
      onTaskClick={(task) => {
        // Navegar a detalle o abrir modal
      }}
      onDayClick={(date) => {
        // Seleccionar día en el calendario
      }}
    />
  </div>
);
```

#### Objetivos de Diseño

- **Puente entre vistas**: Conecta la vista visual (calendario) con la gestión (Inicio > Tareas)
- **Entender la carga del mes**: Permite ver la distribución de tareas en el tiempo
- **Posición temporal clara**: Facilita identificar cuándo ocurre cada tarea
- **No gestión profunda**: El foco está en visualización, no en edición avanzada

#### Ejemplo de Uso

```typescript
import { TaskCalendarList } from "@/components/tasks";
import { Task } from "@/lib/types/task";

function InicioCalendario() {
  const [month, setMonth] = useState(new Date());
  const tasks: Task[] = [/* ... */];
  
  return (
    <TaskCalendarList
      tasks={tasks}
      month={month}
      module="inicio"
      onTaskClick={(task) => {
        // Abrir modal de detalle o navegar
      }}
      onDayClick={(date) => {
        // Seleccionar día en Calendar18
        setSelectedDate(date);
      }}
    />
  );
}
```

---

### 5. TaskForm

**Archivo**: `components/tasks/TaskForm.tsx` (a crear)

#### Descripción

Formulario reutilizable para crear nuevas tareas. Se utiliza tanto en **Inicio > Calendario** como en **Inicio > Tareas** con los mismos campos básicos, pero con comportamientos adaptados al contexto.

#### Características Principales

- **Formulario consistente**: Mismos campos en ambos módulos
- **Contexto adaptable**: Se adapta al módulo donde se usa
- **Validación**: Valida campos obligatorios
- **Integración**: La tarea creada aparece automáticamente en calendarios y listados

#### Props

```typescript
export interface TaskFormProps {
  /** Fecha inicial sugerida (para Inicio > Calendario) */
  initialDate?: Date;
  
  /** Callback al crear la tarea */
  onSubmit: (taskData: TaskFormData) => void | Promise<void>;
  
  /** Callback al cancelar */
  onCancel?: () => void;
  
  /** Si el formulario está en modo de edición */
  isEditing?: boolean;
  
  /** Tarea existente para editar (si isEditing es true) */
  existingTask?: Task;
  
  /** Clase CSS adicional */
  className?: string;
}
```

#### Campos del Formulario

##### Interfaz TaskFormData

```typescript
export interface TaskFormData {
  /** Título de la tarea (obligatorio) */
  title: string;
  
  /** Descripción de la tarea (obligatorio) */
  description: string;
  
  /** Fecha de inicio (obligatorio) */
  startDate: Date;
  
  /** Fecha de fin (obligatorio) */
  endDate: Date;
  
  /** Horario de inicio (opcional) */
  startTime?: string;  // Formato: "HH:mm"
  
  /** Horario de fin (opcional) */
  endTime?: string;    // Formato: "HH:mm"
  
  /** Categoría de la tarea (obligatorio) */
  type: TaskType;
  
  /** Estado de la tarea (obligatorio) */
  status: TaskStatus;  // "pending" | "in_progress" | "completed"
  
  /** Campos adicionales opcionales */
  jobId?: string;
  companyId?: string;
  assignmentId?: string;
}
```

##### Campos Mínimos

1. **Título de la tarea**
   - Tipo: `string`
   - Obligatorio: ✅ Sí
   - Validación: Mínimo 3 caracteres, máximo 100
   - Descripción: Texto corto que identifica la tarea

2. **Descripción de la tarea**
   - Tipo: `string`
   - Obligatorio: ✅ Sí
   - Validación: Mínimo 10 caracteres, máximo 500
   - Descripción: Texto más amplio con los detalles necesarios

3. **Horario**
   - Tipo: `{ startTime?: string, endTime?: string }`
   - Obligatorio: ❌ No
   - Formato: "HH:mm" (ej: "09:00", "17:30")
   - Descripción: Información temporal dentro del día (franja horaria)

4. **Fechas de inicio y fin**
   - Tipo: `{ startDate: Date, endDate: Date }`
   - Obligatorio: ✅ Sí
   - Validación: `endDate >= startDate`
   - Descripción: Rango de fechas en el que la tarea está activa

5. **Categoría**
   - Tipo: `TaskType`
   - Obligatorio: ✅ Sí
   - Opciones: Solo las categorías permitidas del módulo (Inicio: 4 CORE)

6. **Estado**
   - Tipo: `TaskStatus`
   - Obligatorio: ✅ Sí
   - Opciones: `"pending"` (Pendiente), `"in_progress"` (En proceso), `"completed"` (Completado)
   - Por defecto: `"pending"` para nuevas tareas
   - **Nota**: El estado puede cambiar automáticamente según la fecha/hora de inicio (ver sección "Sistema de Estados de Tareas")

#### Comportamiento por Módulo

##### Inicio > Calendario

```typescript
// El formulario se integra con el contexto del mes actual
function InicioCalendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleCreateTask = async (taskData: TaskFormData) => {
    // Crear tarea
    const newTask = await createTask(taskData);
    
    // La tarea aparece automáticamente en:
    // - Calendar18 (como TaskBar)
    // - InicioCalendarioTaskList (en el listado)
    
    setIsFormOpen(false);
  };
  
  return (
    <>
      <Calendar18 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      {isFormOpen && (
        <TaskForm
          initialDate={selectedDate}  // Pre-rellenar con día seleccionado
          onSubmit={handleCreateTask}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}
```

**Características**:
- Puede estar vinculado a un día concreto del calendario
- `initialDate` se pre-rellena con el día seleccionado
- La tarea creada aparece inmediatamente en `Calendar18` y `InicioCalendarioTaskList`

##### Inicio > Tareas

```typescript
// La creación se hace desde una vista más orientada a gestión
function InicioTareas() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleCreateTask = async (taskData: TaskFormData) => {
    // Crear tarea
    const newTask = await createTask(taskData);
    
    // La tarea se integra en:
    // - Listado completo de tareas
    // - Con posibilidad futura de filtros y ordenación
    // - Con más campos y metadata
    
    setIsFormOpen(false);
    // Refrescar listado
  };
  
  return (
    <>
      <TaskList />
      
      {isFormOpen && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}
```

**Características**:
- Vista más orientada a gestión
- Mismos campos básicos que en Calendario
- Integración con listado completo
- Preparado para funcionalidades futuras (filtros, ordenación, más campos)

#### Estructura del Formulario

```typescript
// Estructura básica del formulario
<form onSubmit={handleSubmit}>
  {/* Título */}
  <Input
    label="Título de la tarea"
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    required
    minLength={3}
    maxLength={100}
  />
  
  {/* Descripción */}
  <Textarea
    label="Descripción"
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
    required
    minLength={10}
    maxLength={500}
    rows={4}
  />
  
  {/* Fechas */}
  <div className="date-range">
    <DatePicker
      label="Fecha de inicio"
      value={formData.startDate}
      onChange={(date) => setFormData({ ...formData, startDate: date })}
      required
    />
    <DatePicker
      label="Fecha de fin"
      value={formData.endDate}
      onChange={(date) => setFormData({ ...formData, endDate: date })}
      required
      minDate={formData.startDate}
    />
  </div>
  
  {/* Horario (opcional) */}
  <div className="time-range">
    <TimePicker
      label="Hora de inicio"
      value={formData.startTime}
      onChange={(time) => setFormData({ ...formData, startTime: time })}
    />
    <TimePicker
      label="Hora de fin"
      value={formData.endTime}
      onChange={(time) => setFormData({ ...formData, endTime: time })}
      minTime={formData.startTime}
    />
  </div>
  
  {/* Categoría */}
  <Select
    label="Categoría"
    value={formData.type}
    onChange={(type) => setFormData({ ...formData, type })}
    options={getCategoriesForModule("inicio")}  // Solo categorías CORE
    required
  />
  
  {/* Estado */}
  <Select
    label="Estado"
    value={formData.status}
    onChange={(status) => setFormData({ ...formData, status })}
    options={[
      { value: "pending", label: "Pendiente" },
      { value: "in_progress", label: "En proceso" },
      { value: "completed", label: "Completado" },
    ]}
    required
  />
  
  {/* Botones */}
  <div className="form-actions">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancelar
    </Button>
    <Button type="submit" disabled={!isValid}>
      {isEditing ? "Guardar cambios" : "Crear tarea"}
    </Button>
  </div>
</form>
```

#### Validación

```typescript
const validateForm = (data: TaskFormData): ValidationResult => {
  const errors: string[] = [];
  
  // Título
  if (!data.title || data.title.length < 3) {
    errors.push("El título debe tener al menos 3 caracteres");
  }
  if (data.title.length > 100) {
    errors.push("El título no puede exceder 100 caracteres");
  }
  
  // Descripción
  if (!data.description || data.description.length < 10) {
    errors.push("La descripción debe tener al menos 10 caracteres");
  }
  if (data.description.length > 500) {
    errors.push("La descripción no puede exceder 500 caracteres");
  }
  
  // Fechas
  if (!data.startDate) {
    errors.push("La fecha de inicio es obligatoria");
  }
  if (!data.endDate) {
    errors.push("La fecha de fin es obligatoria");
  }
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    errors.push("La fecha de fin debe ser posterior a la fecha de inicio");
  }
  
  // Categoría
  if (!data.type) {
    errors.push("La categoría es obligatoria");
  }
  
  // Estado
  if (!data.status) {
    errors.push("El estado es obligatorio");
  }
  const validStatuses: TaskStatus[] = ["pending", "in_progress", "completed"];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push("El estado debe ser uno de: pending, in_progress, completed");
  }
  
  // Horario (si se proporciona)
  if (data.startTime && data.endTime) {
    if (data.endTime <= data.startTime) {
      errors.push("La hora de fin debe ser posterior a la hora de inicio");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

#### Ejemplo de Uso

```typescript
import { TaskForm } from "@/components/tasks";
import type { TaskFormData } from "@/components/tasks";

function MyComponent() {
  const handleSubmit = async (taskData: TaskFormData) => {
    try {
      // Crear tarea en backend (futuro)
      // Por ahora: agregar a estado local
      const newTask = {
        id: generateId(),
        ...taskData,
        startDate: combineDateAndTime(taskData.startDate, taskData.startTime),
        endDate: combineDateAndTime(taskData.endDate, taskData.endTime),
      };
      
      await createTask(newTask);
      // La tarea aparecerá automáticamente en calendarios y listados
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };
  
  return (
    <TaskForm
      initialDate={new Date()}  // Pre-rellenar con hoy
      onSubmit={handleSubmit}
      onCancel={() => console.log("Cancelado")}
    />
  );
}
```

#### Funciones Auxiliares

```typescript
// Combinar fecha y hora
function combineDateAndTime(date: Date, time?: string): Date {
  const result = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    result.setHours(hours, minutes, 0, 0);
  } else {
    result.setHours(0, 0, 0, 0);
  }
  return result;
}

// Obtener categorías permitidas para el módulo
function getCategoriesForModule(module: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos"): TaskType[] {
  // Ver lib/taskCategories.ts
  return filterTasksByModule([], module).map(() => /* ... */);
}
```

---

## Exportaciones Centralizadas

**Archivo**: `components/tasks/index.ts`

```typescript
export { TaskBar, type TaskBarProps } from "./TaskBar";
export { TaskCategoryDot, type TaskCategoryDotProps } from "./TaskCategoryDot";
export { InicioResumenTaskWidget, type InicioResumenTaskWidgetProps } from "./InicioResumenTaskWidget";
export { InicioCalendarioTaskList, type InicioCalendarioTaskListProps } from "./InicioCalendarioTaskList";
export { TaskForm, type TaskFormProps, type TaskFormData } from "./TaskForm";
```

**Uso recomendado**:

```typescript
// Importar desde el índice centralizado
import { TaskBar, TaskCategoryDot } from "@/components/tasks";
import type { TaskBarProps, TaskCategoryDotProps } from "@/components/tasks";
```

---

## Dependencias

### Dependencias Comunes

- **lib/taskCategories**: 
  - `TaskType` - Tipo de categoría
  - `getTaskColor(type)` - Obtener color de una categoría
  - `getTaskCategory(type)` - Obtener información completa de una categoría
  - `filterTasksByModule()` - Filtrar tareas por módulo
- **components/ui/utils**: 
  - `cn()` - Función para combinar clases CSS (clsx + tailwind-merge)
- **components/calendar**: 
  - `Task` - Interfaz de tarea

### Dependencias por Componente

#### InicioResumenTaskWidget
- **date-fns**: 
  - `startOfDay`, `endOfDay` - Normalización de fechas
  - `isWithinInterval` - Verificar si una fecha está en un intervalo
  - `isSameDay` - Comparar días
  - `addDays` - Añadir días a una fecha
  - `formatDistanceToNow` o función personalizada para "Hoy", "Mañana", etc.

#### InicioCalendarioTaskList
- **date-fns**: 
  - `startOfDay`, `endOfDay` - Normalización de fechas
  - `eachDayOfInterval` - Obtener todos los días de un intervalo
  - `format` - Formatear fechas
  - `isSameDay` - Comparar días
- **date-fns/locale/es**: Localización en español

#### TaskForm
- **date-fns**: 
  - `format` - Formatear fechas
  - Validación de rangos de fechas
- **components/ui**: 
  - `Input` - Campo de texto
  - `Textarea` - Campo de texto multilínea
  - `DatePicker` - Selector de fecha
  - `TimePicker` - Selector de hora (a crear o usar componente existente)
  - `Select` - Selector de opciones
  - `Button` - Botón
- **Validación**: Función personalizada o librería de validación (ej: zod, yup)

---

## Relación con el Sistema de Categorías

Ambos componentes dependen del sistema de categorías definido en `lib/taskCategories.ts`:

### TaskBar

- Usa `getTaskColor(type)` para asignar colores automáticamente
- Si no se proporciona `type`, usa un color por defecto
- El prop `color` tiene prioridad sobre el color automático

### TaskCategoryDot

- Requiere `type` como prop obligatorio
- Siempre usa `getTaskColor(type)` para el color
- No acepta color personalizado (solo muestra el color de la categoría)

---

## Casos de Uso

### TaskBar

1. **En Calendar18**: Se crea dinámicamente para cada tarea en cada día
2. **En otros calendarios**: Puede usarse en cualquier calendario personalizado
3. **En listas de tareas**: Puede adaptarse para mostrar tareas en formato de lista

### TaskCategoryDot

1. **En Calendar3Months**: Múltiples puntos por día si hay múltiples categorías
2. **En filtros**: Puede usarse en interfaces de filtrado por categoría
3. **En leyendas**: Útil para crear leyendas que expliquen los colores

### InicioResumenTaskWidget

1. **En Inicio > Resumen**: Complemento visual de Calendar3Months
2. **Vista rápida**: Para consultar tareas relevantes sin entrar en detalle
3. **Dashboard**: Útil en dashboards o vistas de resumen

### InicioCalendarioTaskList

1. **En Inicio > Calendario**: Listado complementario de Calendar18
2. **Vista mensual**: Para entender la distribución de tareas del mes
3. **Puente de navegación**: Conecta calendario con gestión avanzada

### TaskForm

1. **En Inicio > Calendario**: Crear tareas vinculadas a días específicos
2. **En Inicio > Tareas**: Crear tareas desde vista de gestión
3. **Reutilizable**: Mismo formulario en diferentes contextos

---

## Mejores Prácticas

1. **Siempre proporcionar `type`**: Para que los colores se asignen correctamente según la categoría

2. **Usar colores personalizados con cuidado**: Solo cuando sea necesario sobrescribir el color de la categoría

3. **Mantener consistencia**: Usar los mismos tamaños y estilos en toda la aplicación

4. **Accesibilidad**: Los componentes incluyen atributos ARIA, mantenerlos al extender

5. **Performance**: En `Calendar18`, los TaskBars se crean como elementos DOM directamente para mejor rendimiento

6. **Widget de Resumen**: `InicioResumenTaskWidget` debe ser ligero y mostrar solo lo esencial

7. **Listado mensual**: `InicioCalendarioTaskList` debe agrupar por día para facilitar la lectura

8. **Formulario consistente**: `TaskForm` debe usar los mismos campos en todos los módulos para mantener coherencia

---

## Notas de Implementación

### TaskBar en Calendar18

Aunque `TaskBar` es un componente React, en `Calendar18` se crea como elemento DOM directamente. Esto permite:
- Mayor control sobre posicionamiento absoluto
- Mejor rendimiento al evitar múltiples renders de React
- Flexibilidad para aplicar estilos dinámicos (bordes redondeados, etc.)

### TaskCategoryDot en Calendar3Months

Se monta usando `createRoot` de React para poder renderizar componentes React dentro del DOM manipulado:
- Permite usar el componente React completo
- Mantiene la reactividad y accesibilidad
- Requiere cleanup adecuado (desmontar roots)

---

## Resumen de Componentes por Contexto

### Componentes Implementados ✅

1. **TaskBar**: Franja visual para calendarios (usado en Calendar18)
2. **TaskCategoryDot**: Punto de color para categorías (usado en Calendar3Months)

### Componentes a Crear ⏳

1. **InicioResumenTaskWidget**: Widget compacto para Inicio > Resumen
   - Complemento de Calendar3Months
   - Muestra tareas prioritarias (hoy y próximos días)
   - Información mínima y visual

2. **InicioCalendarioTaskList**: Listado mensual para Inicio > Calendario
   - Complemento de Calendar18
   - Muestra todas las tareas del mes
   - Agrupado por día
   - Información intermedia (más que widget, menos que vista completa)

3. **TaskForm**: Formulario de creación/edición
   - Reutilizable en Inicio > Calendario e Inicio > Tareas
   - Mismos campos básicos en ambos contextos
   - Adaptable al contexto (pre-rellenar fecha, etc.)

### Flujo de Uso

```
Inicio > Resumen
├── Calendar3Months (muestra 3 meses con puntos de categoría)
└── InicioResumenTaskWidget (muestra tareas prioritarias)

Inicio > Calendario
├── Calendar18 (muestra mes con TaskBars)
├── InicioCalendarioTaskList (muestra listado mensual)
└── TaskForm (crear nuevas tareas)

Inicio > Tareas (futuro)
├── Listado completo de tareas
└── TaskForm (crear/editar tareas)
```

### Jerarquía de Información

1. **Nivel 1 - Visual mínimo** (Calendar3Months + InicioResumenTaskWidget)
   - Solo indicadores y títulos
   - Información esencial

2. **Nivel 2 - Visual detallado** (Calendar18 + InicioCalendarioTaskList)
   - Tareas completas con fechas
   - Horarios y categorías
   - Información intermedia

3. **Nivel 3 - Gestión completa** (Inicio > Tareas - futuro)
   - Todos los campos
   - Metadata completa
   - Funcionalidades avanzadas

---

*Última actualización: Documentación de componentes de tareas actualizada con nuevos componentes*

