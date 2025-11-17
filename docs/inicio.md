# Documentación: Pestaña de Inicio

## Descripción General

La pestaña de **Inicio** es el módulo principal de la aplicación que proporciona una vista general del calendario y las tareas programadas. Está dividida en dos secciones principales:

1. **Inicio > Resumen**: Vista simplificada del calendario con indicadores de días con tareas
2. **Inicio > Calendario**: Vista detallada del calendario con tareas completas y sus detalles

### Sistema de Categorías del Módulo Inicio

**Importante**: El sistema **NO utiliza prioridades** (low, medium, high). Todas las tareas son igual de importantes. Lo que distingue a las tareas es su **categoría/función**.

**⚠️ ACLARACIÓN IMPORTANTE**: El módulo de **Inicio** **SOLO** trabaja y muestra tareas con las siguientes **4 categorías CORE**:

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Instalación** | `"installation"` | 🟠 Naranja | Montajes, puestas en marcha, días de obra |
| **Visita de Obra** | `"site_visit"` | 🟡 Amarillo | Medidas, revisiones, supervisión previa |
| **Reunión** | `"meeting"` | 🟣 Morado | Reuniones internas o con cliente |
| **Incidencia** | `"incident"` | 🔴 Rojo | Problemas, urgencias, revisiones de error |

**El resto de categorías** (Facturación, Comercial, RRHH, Proyectos) se gestionan cada una en su respectivo módulo. Para ver el sistema completo de categorías, consulta el documento **[Categorías de Tareas](./categorias-tareas.md)**.

---

## Componentes Principales

### 1. Calendar3Months

**Ubicación**: `components/Calendar3Months.tsx`  
**Estilos**: `src/styles/components/ui/calendar.css`  
**Uso**: `Inicio > Resumen`

#### Descripción

`Calendar3Months` es el calendario utilizado en la sección **Inicio > Resumen**. Es una versión simplificada de `Calendar18.tsx` diseñada para mostrar una vista general de 3 meses (mes actual + 2 meses siguientes).

#### Características

- **Vista de 3 meses**: Muestra el mes actual y los 2 meses siguientes en una sola vista
- **Indicadores visuales**: Marca con "puntitos" los días en los que hay eventos o tareas programadas
- **Rango de fechas**: Solo permite visualizar desde el día actual hasta 2 meses en el futuro
- **Selección de fechas**: Permite seleccionar días para navegación o consulta

#### Props

```typescript
interface Calendar3MonthsProps {
  className?: string;              // Clases CSS adicionales
  selectedDate?: Date;              // Fecha seleccionada inicialmente
  onDateSelect?: (date: Date | undefined) => void;  // Callback al seleccionar fecha
  showOutsideDays?: boolean;        // Mostrar días fuera del mes actual
}
```

#### Implementación

El componente utiliza el componente base `Calendar` de la librería UI con las siguientes configuraciones:

- `numberOfMonths={3}`: Muestra 3 meses simultáneamente
- `fromDate={today}`: Limita la selección desde hoy
- `toDate={twoMonthsLater}`: Limita la selección hasta 2 meses después
- `locale={es}`: Configuración en español
- `weekStartsOn={1}`: La semana comienza en lunes

#### Estilos

Los estilos están definidos en `calendar.css` y utilizan variables CSS personalizables para:
- Tamaños de días y fuentes
- Colores de fondo, texto y bordes
- Espaciados y márgenes
- Botones de navegación

---

### 2. Calendar18

**Ubicación**: `components/Calendar18.tsx`  
**Estilos**: `src/styles/components/ui/calendar-empresa.css`  
**Uso**: `Inicio > Calendario`

#### Descripción

`Calendar18` es el calendario principal y más completo de la aplicación. Se utiliza en la sección **Inicio > Calendario** para mostrar las tareas a realizar cada día con sus detalles y duración.

#### Características Principales

- **Vista de 1 mes**: Muestra un mes completo con mayor detalle
- **Visualización de tareas**: Muestra las tareas como franjas (`TaskBar`) dentro de cada día
- **Interactividad**: Permite hacer clic en cualquier día para abrir el popup `DayPopup`
- **Gestión de solapamientos**: Algoritmo inteligente que organiza las tareas en filas cuando se solapan
- **Categorías de tareas**: Muestra tareas de "Instalación", "Visita de Obra", "Reunión" e "Incidencia" con colores distintivos

#### Props

```typescript
interface Calendar18Props {
  className?: string;              // Clases CSS adicionales
  selectedDate?: Date;              // Fecha seleccionada inicialmente
  onDateSelect?: (date: Date | undefined) => void;  // Callback al seleccionar fecha
  showOutsideDays?: boolean;        // Mostrar días fuera del mes actual
  tasks?: Task[];                   // Array de tareas a mostrar
}
```

#### Interfaz Task

```typescript
// Para el módulo Inicio, solo se usan estas 4 categorías CORE
export type InicioTaskType = 
  | "installation"
  | "site_visit"
  | "meeting"
  | "incident";

export interface Task {
  id: string;                       // Identificador único
  title: string;                    // Título de la tarea
  startDate: Date;                  // Fecha de inicio
  endDate: Date;                   // Fecha de fin
  type: InicioTaskType;             // Categoría de la tarea (obligatorio) - Solo las 4 CORE
  completed?: boolean;              // Estado de completado
  color?: string;                   // Color personalizado (opcional, se asigna según type si no se especifica)
  jobId?: string;                  // ID del trabajo/proyecto asociado
  companyId?: string;               // ID de la empresa/cliente
  assignmentId?: string;           // ID de la asignación
}
```

**Nota**: El módulo Inicio **solo filtra y muestra** estas 4 categorías CORE. Para ver el sistema completo de categorías (28 categorías en total), consulta el documento **[Categorías de Tareas](./categorias-tareas.md)**.

#### Categorías de Tareas del Módulo Inicio

Las tareas en los calendarios de Inicio se organizan por **categorías** (no por prioridades). Todas las tareas son igual de importantes; lo que se distingue es la **función** de cada tarea.

**Nota importante**: No existe el concepto de prioridad (low, medium, high) en el sistema. Todas las tareas son igual de importantes; la categoría define su función y propósito.

**El módulo Inicio solo muestra estas 4 categorías CORE:**

| Categoría | Tipo en código | Color | Uso |
|-----------|----------------|-------|-----|
| **Instalación** | `"installation"` | 🟠 Naranja | Montajes, puestas en marcha, días de obra |
| **Visita de Obra** | `"site_visit"` | 🟡 Amarillo | Medidas, revisiones, supervisión previa |
| **Reunión** | `"meeting"` | 🟣 Morado | Reuniones internas o con cliente |
| **Incidencia** | `"incident"` | 🔴 Rojo | Problemas, urgencias, revisiones de error |

**Filtrado de tareas**: Los componentes `Calendar18` y `Calendar3Months` deben filtrar las tareas para mostrar **únicamente** estas 4 categorías, ignorando el resto.

Para ver el sistema completo de categorías (28 categorías en total organizadas por departamento), consulta el documento **[Categorías de Tareas](./categorias-tareas.md)**.

#### Funcionalidades Avanzadas

1. **Algoritmo de asignación de filas**: 
   - Detecta cuando las tareas se solapan en el tiempo
   - Asigna automáticamente filas diferentes para evitar superposiciones visuales
   - Ordena las tareas por fecha de inicio y duración

2. **Renderizado dinámico de TaskBars**:
   - Inyecta las barras de tareas en las celdas del calendario después del render
   - Calcula posiciones verticales basadas en la fila asignada
   - Muestra el título solo en el primer día de la tarea

3. **Estilos de TaskBar**:
   - Bordes redondeados en inicio y fin de tarea
   - Opacidad reducida para tareas completadas
   - Colores según categoría (type) o color personalizado

#### Integración con DayPopup

Al hacer clic en cualquier día del calendario:
1. Se selecciona la fecha
2. Se abre automáticamente el componente `DayPopup`
3. El popup muestra información detallada del día seleccionado

#### Estilos

Los estilos están definidos en `calendar-empresa.css` con:
- Variables CSS para personalización completa
- Tamaños responsivos (adaptación a móviles)
- Estilos para días seleccionados, hoy, hover, etc.
- Soporte para múltiples TaskBars por día

#### Futuras Mejoras

- **Versión Widget para móviles**: Se planea crear una versión widget del calendario para facilitar el control a los trabajadores de la empresa desde dispositivos móviles
- **Más categorías**: Se podrán añadir más categorías de tareas en el futuro si es necesario

---

### 3. DayPopup

**Ubicación**: `components/DayPopup.tsx`  
**Uso**: Se muestra al hacer clic en un día de `Calendar18`

#### Descripción

`DayPopup` es un componente modal (Dialog) que se muestra cuando el usuario hace clic en un día del calendario `Calendar18`. Proporciona información detallada sobre el día seleccionado.

#### Características

- **Modal/Dialog**: Se abre como un popup centrado en la pantalla
- **Formato de fecha**: Muestra la fecha en formato legible en español (ej: "Lunes, 18 de enero de 2024")
- **Extensible**: Preparado para mostrar más información como eventos, tareas, etc.

#### Props

```typescript
interface DayPopupProps {
  open: boolean;                    // Controla si el popup está abierto
  onOpenChange: (open: boolean) => void;  // Callback al cambiar el estado
  date: Date | undefined;           // Fecha del día seleccionado
}
```

#### Implementación Actual

Actualmente muestra:
- Título con la fecha formateada
- Sección de "Información del día" (preparada para futuras funcionalidades)

#### Futuras Funcionalidades

El componente está preparado para mostrar:
- Lista de eventos del día
- Tareas programadas
- Notas o comentarios
- Acciones rápidas

---

### 4. TaskBar

**Ubicación**: `components/TaskBar.tsx`  
**Estilos**: `src/styles/components/ui/task-bar.css` (si existe)  
**Uso**: Componente reutilizable utilizado en `Calendar18`

#### Descripción

`TaskBar` es un componente reutilizable que sirve para mostrar las tareas asignadas dentro del calendario. Puede estar ubicado en cualquier sección de la aplicación.

#### Características

- **Reutilizable**: Puede usarse en múltiples módulos (Inicio, Proyectos, etc.)
- **Visualización de tareas**: Muestra el título de la tarea en una franja de color
- **Personalizable**: Soporta colores personalizados y estados (completado)
- **Responsive**: Se adapta al tamaño del contenedor
- **Colores por categoría**: Asigna colores automáticamente según el tipo de tarea

#### Props

```typescript
export interface TaskBarProps {
  title: string;                    // Título de la tarea
  color?: string;                   // Color personalizado (opcional)
  top?: number;                     // Posición vertical (px)
  height?: number;                  // Altura de la franja (px)
  className?: string;               // Clases CSS adicionales
  completed?: boolean;              // Si la tarea está completada
  type?: "installation" | "site_visit" | "meeting" | "incident";  // Solo las 4 categorías CORE del módulo Inicio
}
```

#### Colores por Categoría

Los colores se asignan automáticamente según la categoría (`type`) de la tarea. En el módulo Inicio, solo se usan estos 4 colores:

- **Instalación** (`"installation"`): 🟠 Naranja (`#f97316`)
- **Visita de Obra** (`"site_visit"`): 🟡 Amarillo (`#facc15`)
- **Reunión** (`"meeting"`): 🟣 Morado (`#a855f7`)
- **Incidencia** (`"incident"`): 🔴 Rojo (`#ef4444`)

Si se proporciona un `color` personalizado, este tiene prioridad sobre el color por defecto de la categoría.

Para ver el mapeo completo de colores de todas las categorías, consulta el documento **[Categorías de Tareas](./categorias-tareas.md)**.

#### Estados Visuales

- **Completado**: Opacidad reducida (0.6) cuando `completed={true}`
- **Normal**: Opacidad completa (1.0) cuando `completed={false}`

#### Uso en Múltiples Módulos

El componente está diseñado para ser utilizado en:
- **Inicio > Calendario**: Muestra tareas en el calendario principal
- **Proyectos**: Se puede importar y usar en módulos de proyectos
- **Otros módulos**: Cualquier módulo que necesite mostrar tareas en un calendario

#### Ejemplo de Uso

Si se crea una tarea de "Instalación" en el módulo de Proyectos:
1. La tarea se crea y se almacena
2. `TaskBar` se muestra automáticamente en `Calendar18` de Inicio > Calendario
3. `TaskBar` también se puede mostrar en otro `Calendar18` importado en el módulo de Proyectos

#### Futuras Mejoras

- Continuar desarrollando funcionalidades del módulo
- Mejorar la integración entre módulos
- Añadir más opciones de personalización

---

## Flujo de Navegación

### Inicio > Resumen

1. El usuario accede a la sección "Inicio"
2. Por defecto se muestra la vista "Resumen" (`InicioResumen`)
3. Se renderiza `Calendar3Months` con 3 meses visibles
4. Los días con tareas se marcan con indicadores visuales (puntitos)
5. El usuario puede seleccionar días para navegar o consultar

### Inicio > Calendario

1. El usuario navega a "Inicio > Calendario" desde el sidebar
2. Se muestra la vista `InicioCalendario`
3. Se renderiza `Calendar18` con un mes completo
4. Las tareas se muestran como `TaskBar` dentro de cada día
5. Al hacer clic en un día:
   - Se selecciona la fecha
   - Se abre automáticamente `DayPopup`
   - El popup muestra información del día
6. Al cerrar el popup, se deselecciona el día

---

## Estructura de Archivos

```
components/
├── Calendar3Months.tsx          # Calendario de 3 meses (Resumen)
├── Calendar18.tsx                # Calendario principal con tareas
├── DayPopup.tsx                  # Popup de información del día
├── TaskBar.tsx                   # Componente reutilizable de tareas
├── InicioResumen.tsx             # Vista Resumen
└── InicioCalendario.tsx          # Vista Calendario

src/styles/components/ui/
├── calendar.css                   # Estilos de Calendar3Months
└── calendar-empresa.css          # Estilos de Calendar18
```

---

## Dependencias

- **date-fns**: Para manejo de fechas y formateo
- **react-day-picker**: Base del componente Calendar (a través de `./ui/calendar`)
- **motion/react**: Para animaciones en las vistas principales

---

## Notas de Desarrollo

### Calendar3Months vs Calendar18

- **Calendar3Months**: Versión simplificada, solo indicadores visuales
- **Calendar18**: Versión completa, muestra tareas completas con detalles

### Reutilización de Componentes

- `TaskBar` está diseñado para ser completamente reutilizable
- `Calendar18` puede importarse en otros módulos (ej: Proyectos)
- La lógica de tareas es centralizada y se comparte entre módulos

### Responsive Design

- Ambos calendarios tienen estilos responsivos
- `Calendar18` tiene variables CSS que se adaptan a diferentes tamaños de pantalla
- Se planea una versión widget móvil para `Calendar18`

---

## Estado Actual y Preparación para Backend

### ✅ Estado de la Fase Actual

**Para esta fase: vais muy bien.**

La estructura actual con:
- `Calendar3Months` + `Calendar18` + `TaskBar` + `DayPopup`
- Documentación clara de props, interfaces y flujos
- Separación Resumen / Calendario

...son más que suficientes para seguir construyendo interfaz, navegación y experiencia sin backend todavía.

**No estás "sobrando trabajo", estás preparando muy bien el terreno.**

---

### 🎯 Qué Aprovechar Ahora Antes del Backend

Como todavía no hay API real, el foco debería ser:

#### 1. Congelar Contratos de Datos "de Frontend"

**Task está muy bien como modelo base.** Más adelante el backend ya se adaptará a esto (o ajustáis ambos a medio camino).

**Recomendación: Añadir ahora campos que sabes que existirán seguro**

```typescript
// Para el módulo Inicio, solo se usan estas 4 categorías CORE
export type InicioTaskType = 
  | "installation"
  | "site_visit"
  | "meeting"
  | "incident";

export interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: InicioTaskType;  // Categoría (obligatorio) - Solo las 4 CORE para Inicio
  completed?: boolean;
  color?: string;              // Opcional, se asigna según type si no se especifica
  
  // Campos adicionales para preparar el backend
  jobId?: string;              // ID del trabajo/proyecto asociado
  companyId?: string;          // ID de la empresa/cliente
  assignmentId?: string;        // ID de la asignación
}
```

**Importante**: El módulo Inicio debe **filtrar** las tareas para mostrar solo estas 4 categorías. Las demás categorías se gestionan en sus respectivos módulos.

**Importante sobre categorías vs prioridades:**
- **No hay prioridades** (low, medium, high) en el sistema
- Todas las tareas son igual de importantes
- Lo que se distingue es la **categoría/función** de cada tarea
- Las categorías definen el color y propósito de la tarea

Esto ayuda a:
- Definir el contrato de datos desde el frontend
- Facilitar la integración futura con el backend
- Tener claridad sobre qué datos se necesitarán

#### 2. Mock de Datos + Hooks

**Crear un hook personalizado para gestionar las tareas del calendario:**

```typescript
// hooks/useCalendarTasks.ts
export function useCalendarTasks(viewDate: Date) {
  // ahora: devuelve un mock estático o generado
  // después: hará fetch al backend
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Por ahora: mock data
    const mockTasks = generateMockTasks(viewDate);
    setTasks(mockTasks);
    
    // Futuro: fetch al backend
    // setLoading(true);
    // fetchTasksForMonth(viewDate).then(setTasks).finally(() => setLoading(false));
  }, [viewDate]);
  
  return { tasks, loading };
}
```

**Ventajas:**
- Todo el calendario ya funciona "como si hubiera backend"
- El día que tengáis backend, sólo cambiáis la implementación interna del hook
- Los componentes (`Calendar18`, `InicioCalendario`) no necesitan cambios
- Separación clara entre lógica de datos y presentación

#### 3. DayPopup Orientado a Futuro

**Aunque ahora sólo muestre la fecha, puedes dejar ya preparado:**

```typescript
interface DayPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | undefined;
  tasksForDay?: Task[];  // ← Añadir esto
}

export function DayPopup({ open, onOpenChange, date, tasksForDay = [] }: DayPopupProps) {
  // ...
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
        </DialogHeader>
        
        {/* Lista de tareas del día */}
        {tasksForDay.length > 0 && (
          <div>
            {tasksForDay.map(task => (
              <div key={task.id}>
                <h3>{task.title}</h3>
                <p>Tipo: {task.type}</p>
                {/* ... más detalles ... */}
                <button onClick={() => {/* Ver más detalles */}}>
                  Ver más detalles
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Acciones futuras preparadas */}
        <div>
          <button onClick={() => {/* Acción futura */}}>
            Ver más detalles
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Beneficios:**
- El componente ya está preparado para recibir y mostrar tareas
- Las acciones futuras tienen su sitio definido
- No habrá que refactorizar cuando llegue el backend

#### 4. Estados y Tipos, Aunque los Datos Sean Fake

**Usa ya todos los estados y tipos que necesitarás:**

```typescript
// Categorías de tareas del módulo Inicio (NO prioridades)
// Solo estas 4 categorías CORE
type: "installation" | "site_visit" | "meeting" | "incident"

// Estados
completed: true | false
```

**Esto os ayuda a:**
- Probar estilos y UX con datos realistas
- Validar que los componentes manejan todos los casos
- El backend simplemente tendrá que respetar esos valores
- Evitar cambios de tipos más adelante
- Probar los colores asociados a cada categoría

**Ejemplo de mock data para el módulo Inicio (solo las 4 categorías CORE):**

```typescript
// Mock data para el módulo Inicio - Solo categorías CORE
// Fechas distribuidas entre noviembre y diciembre de 2025
// Nota: En JavaScript Date, los meses van de 0-11 (0=enero, 10=noviembre, 11=diciembre)
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Instalación de sistema",
    startDate: new Date(2025, 10, 18),  // 18 de noviembre de 2025 (mes 10 = noviembre)
    endDate: new Date(2025, 10, 20),    // 20 de noviembre de 2025
    type: "installation",  // 🟠 Naranja
    completed: false,
    jobId: "job-123",
    companyId: "company-456",
  },
  {
    id: "task-2",
    title: "Visita de obra",
    startDate: new Date(2025, 10, 22),  // 22 de noviembre de 2025
    endDate: new Date(2025, 10, 22),   // 22 de noviembre de 2025
    type: "site_visit",  // 🟡 Amarillo
    completed: false,
    jobId: "job-124",
    companyId: "company-457",
  },
  {
    id: "task-3",
    title: "Reunión con cliente",
    startDate: new Date(2025, 10, 25),  // 25 de noviembre de 2025
    endDate: new Date(2025, 10, 25),    // 25 de noviembre de 2025
    type: "meeting",  // 🟣 Morado
    completed: false,
    companyId: "company-458",
  },
  {
    id: "task-4",
    title: "Incidencia en sistema",
    startDate: new Date(2025, 10, 28),  // 28 de noviembre de 2025
    endDate: new Date(2025, 10, 28),    // 28 de noviembre de 2025
    type: "incident",  // 🔴 Rojo
    completed: false,
    jobId: "job-126",
  },
  {
    id: "task-5",
    title: "Instalación adicional",
    startDate: new Date(2025, 11, 3),   // 3 de diciembre de 2025 (mes 11 = diciembre)
    endDate: new Date(2025, 11, 5),     // 5 de diciembre de 2025
    type: "installation",  // 🟠 Naranja
    completed: false,
    jobId: "job-127",
    companyId: "company-459",
  },
  {
    id: "task-6",
    title: "Reunión de seguimiento",
    startDate: new Date(2025, 11, 10),  // 10 de diciembre de 2025
    endDate: new Date(2025, 11, 10),    // 10 de diciembre de 2025
    type: "meeting",  // 🟣 Morado
    completed: false,
    companyId: "company-460",
  },
  // ...
];

// IMPORTANTE: Filtrar tareas para mostrar solo las 4 categorías CORE
const inicioCategories: InicioTaskType[] = ["installation", "site_visit", "meeting", "incident"];
const filteredTasks = mockTasks.filter(task => 
  inicioCategories.includes(task.type as InicioTaskType)
);
```

---

## Referencia a Categorías Completas

Para ver el **sistema completo de categorías** (28 categorías organizadas por departamento), consulta el documento:

**[📋 Categorías de Tareas](./categorias-tareas.md)**

Ese documento incluye:
- Todas las categorías por departamento (Facturación, Comercial, RRHH, Proyectos)
- Implementación completa en código
- Mapeo de colores para todas las categorías
- Información sobre cómo filtrar por módulo

---

## Próximos Pasos

1. **Implementar indicadores en Calendar3Months**: Añadir los "puntitos" para días con tareas
2. **Expandir DayPopup**: Añadir más información y funcionalidades
3. **Widget móvil**: Desarrollar versión widget de Calendar18 para móviles
4. **Implementar filtrado de categorías en Inicio**: Asegurar que los calendarios de Inicio solo muestren las 4 categorías CORE (installation, site_visit, meeting, incident) y filtren el resto
5. **Integración con otros módulos**: Continuar desarrollando la integración de TaskBar en módulos como Proyectos
6. **Implementar hook useCalendarTasks**: Crear el hook con mock data para preparar la integración con backend
7. **Expandir interfaz Task**: Añadir campos `jobId`, `companyId`, `assignmentId`, `type` a la interfaz Task
8. **Actualizar DayPopup**: Preparar para recibir `tasksForDay` y mostrar información completa

---

*Última actualización: Documentación inicial creada*

