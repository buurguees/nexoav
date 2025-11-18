# Base de Datos de Ejemplo: Tareas

## Estructura de Archivos

Este directorio contiene datos de ejemplo para desarrollo y testing del frontend.

### ⚠️ IMPORTANTE: Estructura Normalizada

**En la base de datos real (Supabase/PostgreSQL), las tareas están en una tabla normalizada:**

- **Tabla `tasks`**: Tareas independientes con `project_id` y `phase_id` como FK
- Cuando se crea una tarea para un proyecto, se inserta en la tabla `tasks` con `project_id` asociado
- La relación se resuelve mediante JOINs en las queries

**Para más detalles, consulta:**
- `docs/proyectos.md` - Documentación completa de proyectos
- `docs/proyectos-estructura-bd.md` - Estructura normalizada de base de datos

---

## Archivos de Datos

### `tasks.json`

**Formato**: Array de tareas normalizadas (todas las tareas de proyectos)

Este archivo contiene todas las tareas extraídas de los proyectos. Cada tarea tiene:
- `project_id`: ID del proyecto al que pertenece (obligatorio)
- `phase_id`: ID de la fase a la que pertenece (opcional/nullable)

**Estructura:**
```json
[
  {
    "id": "task-proj-001-001",
    "project_id": "proj-2025-001",
    "phase_id": "phase-proj-001-001",
    "title": "Reunión inicial con cliente",
    "type": "meeting",
    "status": "completed",
    "startDate": "2025-11-01T09:00:00.000Z",
    "endDate": "2025-11-01T13:00:00.000Z",
    ...
  }
]
```

**Total de tareas**: 25 tareas distribuidas en 4 proyectos:
- `proj-2025-001`: 9 tareas
- `proj-2025-002`: 1 tarea
- `proj-2025-003`: 8 tareas
- `proj-2025-005`: 7 tareas

### `tasks-november-2025.json` y `tasks-december-2025.json`

**Formato**: Tareas independientes (no asociadas a proyectos)

Estos archivos contienen tareas que no pertenecen a proyectos específicos, utilizadas para el módulo "Inicio" (calendarios).

---

## Uso en Frontend

### Importar tareas de proyectos

```typescript
// Importar todas las tareas de proyectos
import projectTasks from '@/data/tasks/tasks.json';

// Filtrar por proyecto
const projectTasks = tasks.filter(t => t.project_id === 'proj-2025-001');

// Filtrar por fase
const phaseTasks = tasks.filter(t => t.phase_id === 'phase-proj-001-001');
```

### Usar hooks mock

```typescript
import { fetchProjectTasks, fetchAllProjectTasks } from '@/lib/mocks/projectMocks';

// Obtener tareas de un proyecto
const tasks = await fetchProjectTasks('proj-2025-001');

// Obtener tareas de una fase específica
const phaseTasks = await fetchProjectTasks('proj-2025-001', 'phase-proj-001-001');

// Obtener todas las tareas de proyectos
const allTasks = await fetchAllProjectTasks();
```

### Combinar con tareas mensuales

El hook `useCalendarTasks` ya combina automáticamente:
- Tareas de archivos mensuales (`tasks-november-2025.json`, `tasks-december-2025.json`)
- Tareas de proyectos (`tasks.json`)

---

## Notas para Desarrollo

### Mock Data vs. Producción

**Durante desarrollo (mock):**
- Usa `tasks.json` con estructura normalizada
- Facilita el desarrollo del frontend
- No requiere backend

**En producción:**
- Los datos vendrán normalizados desde la API
- Query: `SELECT * FROM tasks WHERE project_id = 'proj-001'`
- El frontend debe hacer JOINs/agrupaciones según necesidad

### Crear nueva tarea para un proyecto

```typescript
import { createProjectTask } from '@/lib/mocks/projectMocks';

const newTask = await createProjectTask({
  project_id: 'proj-2025-001',
  phase_id: 'phase-proj-001-001', // Opcional
  title: 'Nueva tarea',
  type: 'installation',
  status: 'pending',
  startDate: '2025-12-01T08:00:00.000Z',
  endDate: '2025-12-03T18:00:00.000Z',
  // ... otros campos
});

// En producción, esto insertaría en la tabla tasks:
// INSERT INTO tasks (project_id, phase_id, title, ...) VALUES (...)
```

---

*Última actualización: Estructura normalizada de tareas documentada*

