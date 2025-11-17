# Base de Datos de Ejemplo: Proyectos

## Estructura de Archivos

Este directorio contiene datos de ejemplo para desarrollo y testing del frontend.

### ⚠️ IMPORTANTE: Estructura Normalizada

**En la base de datos real (Supabase/PostgreSQL), las tablas están normalizadas:**

- **Tabla `projects`**: Solo proyectos (sin fases ni tareas)
- **Tabla `phases`**: Fases independientes con `project_id` como FK
- **Tabla `tasks`**: Tareas independientes con `project_id` y `phase_id` como FK

**Para más detalles, consulta:**
- `docs/proyectos.md` - Documentación completa de proyectos
- `docs/proyectos-estructura-bd.md` - Estructura normalizada de base de datos

---

## Archivos de Datos

### `projects-2025.json`

**Formato**: Estructura anidada (solo para mock/frontend)

Este archivo contiene proyectos con fases y tareas anidadas **únicamente para facilitar el desarrollo del frontend**. En producción, estos datos vendrán normalizados desde la API.

**Estructura:**
```json
[
  {
    "id": "proj-2025-001",
    "code": "PROJ-2025-001",
    "name": "...",
    "phases": [
      {
        "id": "phase-001",
        "project_id": "proj-2025-001",
        "tasks": [
          {
            "id": "task-001",
            "project_id": "proj-2025-001",
            "phase_id": "phase-001",
            ...
          }
        ]
      }
    ]
  }
]
```

**Uso en Frontend:**
```typescript
// Importar datos mock
import projectsData from '@/data/projects/projects-2025.json';

// En producción, los datos vendrán normalizados desde la API:
// const projects = await fetch('/api/projects').then(r => r.json());
// const phases = await fetch('/api/phases?project_id=proj-001').then(r => r.json());
// const tasks = await fetch('/api/tasks?project_id=proj-001').then(r => r.json());
```

---

## Proyectos Incluidos

1. **PROJ-2025-001** - Instalación LED - Tienda Zara Diagonal (Barcelona)
   - Estado: `in_progress` (45%)
   - 6 fases, múltiples tareas

2. **PROJ-2025-002** - Sistema de Videowall - Oficinas BBVA Madrid
   - Estado: `approved` (0%)
   - Pendiente de inicio

3. **PROJ-2025-003** - Instalación LED Retail - Primark Valencia
   - Estado: `in_progress` (75%)
   - 7 fases, tareas detalladas

4. **PROJ-2025-004** - Sistema de Señalización Digital - Hospital Clínic Barcelona
   - Estado: `quoted` (0%)
   - Esperando aprobación

5. **PROJ-2025-005** - Videowall Corporativo - Inditex Arteixo
   - Estado: `completed` (100%)
   - Proyecto finalizado

6. **PROJ-2025-006** - Sistema LED Exterior - Estadio Mestalla
   - Estado: `draft` (0%)
   - En borrador

---

## Notas para Desarrollo

### Mock Data vs. Producción

**Durante desarrollo (mock):**
- Usa `projects-2025.json` con estructura anidada
- Facilita el desarrollo del frontend
- No requiere backend

**En producción:**
- Los datos vendrán normalizados desde la API
- El frontend debe hacer JOINs/agrupaciones según necesidad
- Estructura: 3 endpoints separados (`/api/projects`, `/api/phases`, `/api/tasks`)

### Hooks Recomendados

```typescript
// hooks/useProjects.ts
export function useProjects() {
  // En desarrollo: leer de JSON
  // En producción: fetch desde API
}

// hooks/useProjectPhases.ts
export function useProjectPhases(projectId: string) {
  // En desarrollo: filtrar de JSON anidado
  // En producción: fetch `/api/phases?project_id=${projectId}`
}

// hooks/useProjectTasks.ts
export function useProjectTasks(projectId: string, phaseId?: string) {
  // En desarrollo: filtrar de JSON anidado
  // En producción: fetch `/api/tasks?project_id=${projectId}&phase_id=${phaseId}`
}
```

---

*Última actualización: Estructura de datos de ejemplo documentada*

