# Estructura de Base de Datos: Proyectos, Fases y Tareas

## Descripción General

Este documento describe la estructura normalizada de la base de datos para proyectos, fases y tareas. **Las tablas están completamente normalizadas** y se relacionan mediante claves foráneas (FK).

---

## Modelo de Datos Normalizado

### Diagrama de Relaciones

```
┌─────────────┐
│  projects   │
│─────────────│
│ id (PK)     │
│ code        │
│ name        │
│ client_id   │──┐
│ ...         │  │
└─────────────┘  │
                 │
                 │ 1:N
                 │
┌─────────────┐  │
│   phases    │  │
│─────────────│  │
│ id (PK)     │  │
│ project_id │──┘ (FK)
│ name        │
│ order       │
│ ...         │
└─────────────┘
       │
       │ 1:N
       │
┌─────────────┐
│   tasks     │
│─────────────│
│ id (PK)     │
│ project_id │──┐ (FK)
│ phase_id   │──┼──┐ (FK, nullable)
│ title      │  │  │
│ status     │  │  │
│ type       │  │  │
│ ...        │  │  │
└─────────────┘  │  │
                 │  │
                 │  │
                 └──┴──┘
```

---

## Tablas de Base de Datos

### 1. Tabla: `projects`

**Descripción**: Tabla principal que almacena los proyectos. **NO contiene fases ni tareas anidadas**.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,  -- PROJ-YYYY-####
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Estado
  status VARCHAR(20) NOT NULL,  -- draft, quoted, approved, in_progress, on_hold, completed, cancelled
  progress INTEGER DEFAULT 0,   -- 0-100, calculado automáticamente
  
  -- Cliente
  client_id UUID NOT NULL REFERENCES clients(id),
  client_name VARCHAR(255),     -- Cache automático
  client_code VARCHAR(50),      -- Cache automático
  
  -- Fechas
  start_date TIMESTAMP,
  estimated_end_date TIMESTAMP,
  actual_end_date TIMESTAMP,
  
  -- Horas
  estimated_hours INTEGER,
  actual_hours INTEGER,         -- Calculado desde tareas
  
  -- Presupuesto
  quote_id UUID REFERENCES quotes(id),
  
  -- Ubicación
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  location_coordinates POINT,    -- PostGIS (lat, lng)
  
  -- Asignaciones
  project_manager_id UUID REFERENCES users(id),
  
  -- Metadatos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  -- Notas
  notes TEXT,
  internal_notes TEXT
);

-- Índices
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_code ON projects(code);
```

**Relación con técnicos asignados:**
```sql
-- Tabla de relación muchos-a-muchos
CREATE TABLE project_technicians (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technician_id)
);
```

---

### 2. Tabla: `phases`

**Descripción**: Tabla independiente que almacena las fases de los proyectos. Cada fase pertenece a un proyecto mediante `project_id`.

```sql
CREATE TABLE phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order INTEGER NOT NULL,
  
  -- Estado
  status VARCHAR(20) NOT NULL,  -- pending, in_progress, completed, blocked
  progress INTEGER DEFAULT 0,   -- 0-100, calculado automáticamente
  
  -- Control de flujo
  required_for_next_phase BOOLEAN DEFAULT false,
  
  -- Fechas
  estimated_start_date TIMESTAMP,
  estimated_end_date TIMESTAMP,
  actual_start_date TIMESTAMP,
  actual_end_date TIMESTAMP,
  
  -- Metadatos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_phases_project_id ON phases(project_id);
CREATE INDEX idx_phases_order ON phases(project_id, order);
```

**Obtener fases de un proyecto:**
```sql
SELECT * FROM phases 
WHERE project_id = 'proj-001' 
ORDER BY order ASC;
```

---

### 3. Tabla: `tasks`

**Descripción**: Tabla independiente que almacena todas las tareas. **Cuando se crea una tarea para un proyecto, se inserta aquí con `project_id` y opcionalmente `phase_id`**.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relaciones
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,  -- FK a proyecto
  phase_id UUID REFERENCES phases(id) ON DELETE SET NULL,      -- FK a fase (nullable)
  
  -- Información básica
  title VARCHAR(255) NOT NULL,
  description TEXT,
  notes TEXT,
  
  -- Estado y tipo
  status VARCHAR(20) NOT NULL,  -- pending, in_progress, completed, cancelled
  type VARCHAR(50) NOT NULL,    -- installation, site_visit, meeting, incident, etc.
  priority VARCHAR(10),          -- low, medium, high
  
  -- Fechas y horarios
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  start_time TIME,              -- HH:MM
  end_time TIME,                -- HH:MM
  
  -- Horas
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),
  
  -- Orden dentro de la fase
  order INTEGER,
  
  -- Dependencias (opcional, para futuras expansiones)
  depends_on UUID[],            -- Array de task IDs
  
  -- Ubicación
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  
  -- Metadatos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id)
);

-- Índices
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_phase_id ON tasks(phase_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_start_date ON tasks(start_date);
```

**Relación con técnicos asignados:**
```sql
-- Tabla de relación muchos-a-muchos
CREATE TABLE task_assignments (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, user_id)
);
```

---

## Flujo de Creación de Tareas

### Escenario: Crear una tarea para un proyecto

**1. Usuario crea tarea desde el módulo de Proyectos:**

```typescript
// Frontend envía:
{
  project_id: "proj-2025-001",
  phase_id: "phase-001",  // Opcional
  title: "Instalación de pantallas LED",
  type: "installation",
  status: "pending",
  start_date: "2025-12-01",
  end_date: "2025-12-03",
  assigned_to: ["user-tech-001", "user-tech-002"]
}
```

**2. Backend inserta en la tabla `tasks`:**

```sql
INSERT INTO tasks (
  project_id,
  phase_id,
  title,
  type,
  status,
  start_date,
  end_date,
  created_by
) VALUES (
  'proj-2025-001',
  'phase-001',
  'Instalación de pantallas LED',
  'installation',
  'pending',
  '2025-12-01',
  '2025-12-03',
  'user-manager-001'
) RETURNING *;
```

**3. Backend asigna técnicos (tabla `task_assignments`):**

```sql
INSERT INTO task_assignments (task_id, user_id) VALUES
  ('task-001', 'user-tech-001'),
  ('task-001', 'user-tech-002');
```

**4. La tarea aparece automáticamente en:**
- ✅ El proyecto (mediante JOIN: `SELECT * FROM tasks WHERE project_id = 'proj-2025-001'`)
- ✅ La fase (mediante JOIN: `SELECT * FROM tasks WHERE phase_id = 'phase-001'`)
- ✅ El calendario (si tiene `start_date` y `end_date`)
- ✅ La vista de tareas del técnico asignado

---

## Queries Comunes

### Obtener proyecto con sus fases y tareas

```sql
-- Proyecto
SELECT * FROM projects WHERE id = 'proj-001';

-- Fases del proyecto
SELECT * FROM phases 
WHERE project_id = 'proj-001' 
ORDER BY order ASC;

-- Tareas del proyecto (agrupadas por fase)
SELECT 
  t.*,
  p.name as phase_name,
  p.order as phase_order
FROM tasks t
LEFT JOIN phases p ON t.phase_id = p.id
WHERE t.project_id = 'proj-001'
ORDER BY p.order ASC, t.order ASC;
```

### Obtener todas las tareas de un proyecto (para diagrama de Gantt)

```sql
SELECT 
  t.id,
  t.title,
  t.status,
  t.type,
  t.order,
  p.id as phase_id,
  p.name as phase_name,
  p.order as phase_order
FROM tasks t
LEFT JOIN phases p ON t.phase_id = p.id
WHERE t.project_id = 'proj-001'
ORDER BY p.order ASC, t.order ASC;
```

### Obtener tareas de un técnico

```sql
SELECT t.*
FROM tasks t
INNER JOIN task_assignments ta ON t.id = ta.task_id
WHERE ta.user_id = 'user-tech-001'
ORDER BY t.start_date ASC;
```

### Calcular progreso de una fase

```sql
-- El progreso de una fase se calcula desde las tareas
SELECT 
  phase_id,
  COUNT(*) as total_tasks,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
  ) as progress
FROM tasks
WHERE phase_id = 'phase-001'
GROUP BY phase_id;
```

### Calcular progreso de un proyecto

```sql
-- El progreso de un proyecto se calcula desde las fases
SELECT 
  project_id,
  AVG(progress) as project_progress
FROM phases
WHERE project_id = 'proj-001'
GROUP BY project_id;
```

---

## Triggers y Funciones Automáticas

### Trigger: Actualizar progreso de fase cuando cambia una tarea

```sql
CREATE OR REPLACE FUNCTION update_phase_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE phases
  SET progress = (
    SELECT COALESCE(
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100
      ),
      0
    )
    FROM tasks
    WHERE phase_id = COALESCE(NEW.phase_id, OLD.phase_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.phase_id, OLD.phase_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_phase_progress
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_phase_progress();
```

### Trigger: Actualizar progreso de proyecto cuando cambia una fase

```sql
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET progress = (
    SELECT COALESCE(AVG(progress), 0)
    FROM phases
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_progress
AFTER INSERT OR UPDATE OR DELETE ON phases
FOR EACH ROW
EXECUTE FUNCTION update_project_progress();
```

### Trigger: Actualizar cache de cliente en proyecto

```sql
CREATE OR REPLACE FUNCTION update_project_client_cache()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET 
    client_name = NEW.name,
    client_code = NEW.code,
    updated_at = NOW()
  WHERE client_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_client_cache
AFTER UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_project_client_cache();
```

---

## Row Level Security (RLS) en Supabase

### Política para Projects

```sql
-- Los usuarios solo pueden ver proyectos donde son manager o técnico asignado
CREATE POLICY "Users can view projects they are assigned to"
ON projects FOR SELECT
USING (
  project_manager_id = auth.uid() OR
  id IN (
    SELECT project_id FROM project_technicians 
    WHERE technician_id = auth.uid()
  )
);
```

### Política para Tasks

```sql
-- Los usuarios solo pueden ver tareas donde están asignados o son manager del proyecto
CREATE POLICY "Users can view tasks they are assigned to"
ON tasks FOR SELECT
USING (
  id IN (
    SELECT task_id FROM task_assignments 
    WHERE user_id = auth.uid()
  ) OR
  project_id IN (
    SELECT id FROM projects 
    WHERE project_manager_id = auth.uid()
  )
);
```

---

## Ventajas de la Estructura Normalizada

✅ **Escalabilidad**: No hay límite de fases ni tareas por proyecto  
✅ **Consistencia**: Los datos están normalizados, sin duplicación  
✅ **RLS**: Facilita la implementación de Row Level Security en Supabase  
✅ **Queries eficientes**: JOINs optimizados con índices  
✅ **Mantenibilidad**: Cambios en una tabla no afectan a otras  
✅ **Flexibilidad**: Las tareas pueden existir sin fase (`phase_id` nullable)  
✅ **Relaciones claras**: FK explícitas y documentadas  

---

## Migración desde Estructura Anidada

Si tienes datos en formato anidado (proyectos con fases y tareas dentro), puedes migrarlos así:

```sql
-- 1. Insertar proyectos
INSERT INTO projects (id, code, name, ...)
SELECT id, code, name, ...
FROM json_projects;

-- 2. Insertar fases
INSERT INTO phases (id, project_id, name, order, ...)
SELECT 
  phase->>'id',
  project_id,
  phase->>'name',
  (phase->>'order')::INTEGER,
  ...
FROM json_projects,
LATERAL json_array_elements(phases) AS phase;

-- 3. Insertar tareas
INSERT INTO tasks (id, project_id, phase_id, title, ...)
SELECT 
  task->>'id',
  project_id,
  task->>'phase_id',
  task->>'title',
  ...
FROM json_projects,
LATERAL json_array_elements(phases) AS phase,
LATERAL json_array_elements(phase->'tasks') AS task;
```

---

*Última actualización: Estructura normalizada documentada*

