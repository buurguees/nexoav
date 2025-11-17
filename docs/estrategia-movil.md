# Estrategia de Desarrollo Móvil

## Descripción General

Este documento describe la estrategia para desarrollar aplicaciones móviles usando **React Native / Expo** dentro de un monorepo que comparte código con la aplicación web Next.js y la API NestJS.

## Tecnología Elegida: React Native / Expo

### ¿Por qué Expo?

- **Mismo ecosistema mental**: React, TypeScript
- **Compartir código**: Tipos TS, esquemas Zod, modelos de dominio en packages comunes
- **Desarrollo rápido**: Hot reload, builds nativos sin configurar Xcode/Android Studio
- **Ecosistema maduro**: Expo Router, bibliotecas bien mantenidas
- **Despliegue simplificado**: EAS Build para builds nativos, OTA updates

### Casos de Uso

1. **App de Técnicos** (`mobile-technician`)
   - Ver asignaciones de trabajo
   - Registrar horas trabajadas
   - Subir gastos y fotos
   - Marcar tareas como completadas
   - Ver calendario de tareas

2. **App Simple para Empresa** (`mobile-company`)
   - Ver planning y calendarios
   - Aprobar acciones básicas
   - Ver resúmenes y estadísticas
   - Notificaciones de tareas importantes

---

## Estructura del Monorepo

### Estructura Propuesta

```
nexoav/
├── apps/
│   ├── web/                    # Next.js (empresa, panel completo)
│   ├── api/                    # NestJS (backend)
│   ├── mobile-technician/      # Expo React Native (futuro desarrollo para técnicos)
│   └── mobile-company/         # Expo React Native (actual desarrollo)
│
├── packages/
│   ├── ui/                     # Componentes compartidos (lógica/estilos compatibles RN)
│   ├── api-client/            # Cliente TS para la API (fetch/axios + React Query)
│   ├── schemas/                # Zod/Tipos compartidos (Task, Job, Invoice, etc.)
│   └── config/                # ESLint, tsconfig, etc.
│
├── package.json                # Workspace root
├── pnpm-workspace.yaml         # Configuración de workspace (o npm/yarn)
└── turbo.json                  # Configuración de Turborepo (opcional)
```

### Principios Clave

1. **No repetir modelos**: `Task`, `Job`, `Assignment`, `Invoice`... todos en `packages/schemas`
2. **No repetir lógica de acceso a datos**: Cliente API en `packages/api-client`
3. **La app móvil solo se centra en**:
   - Pantallas específicas (mis trabajos, mis gastos, registrar tiempos)
   - Lógica de UI adaptada a móvil
   - Navegación móvil (Expo Router)

---

## Packages Compartidos

### 1. `packages/schemas`

**Propósito**: Definir tipos TypeScript y esquemas Zod compartidos entre web, mobile y API.

**Estructura**:

```
packages/schemas/
├── src/
│   ├── task/
│   │   ├── task.schema.ts      # Zod schema
│   │   ├── task.types.ts       # TypeScript types
│   │   └── task-status.schema.ts
│   ├── job/
│   │   ├── job.schema.ts
│   │   └── job.types.ts
│   ├── assignment/
│   │   ├── assignment.schema.ts
│   │   └── assignment.types.ts
│   ├── invoice/
│   │   ├── invoice.schema.ts
│   │   └── invoice.types.ts
│   └── index.ts                # Exportaciones centralizadas
├── package.json
└── tsconfig.json
```

**Ejemplo de implementación**:

```typescript
// packages/schemas/src/task/task-status.schema.ts
import { z } from "zod";

export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// packages/schemas/src/task/task.schema.ts
import { z } from "zod";
import { TaskStatusSchema } from "./task-status.schema";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500).optional(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  type: z.enum([
    "installation",
    "site_visit",
    "meeting",
    "incident",
    // ... todas las categorías
  ]),
  status: TaskStatusSchema,
  completed: z.boolean().optional(),
  jobId: z.string().optional(),
  companyId: z.string().optional(),
  assignmentId: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// packages/schemas/src/task/index.ts
export * from "./task.schema";
export * from "./task-status.schema";
```

**Uso en web y mobile**:

```typescript
// apps/web/components/TaskForm.tsx
import { Task, TaskSchema } from "@nexoav/schemas";

// apps/mobile-company/screens/TaskDetail.tsx
import { Task, TaskSchema } from "@nexoav/schemas";
```

### 2. `packages/api-client`

**Propósito**: Cliente TypeScript para la API compartido entre web y mobile.

**Estructura**:

```
packages/api-client/
├── src/
│   ├── client.ts               # Cliente base (fetch/axios)
│   ├── tasks/
│   │   ├── tasks.api.ts       # Endpoints de tareas
│   │   └── tasks.hooks.ts     # React Query hooks (opcional)
│   ├── jobs/
│   │   ├── jobs.api.ts
│   │   └── jobs.hooks.ts
│   ├── assignments/
│   │   ├── assignments.api.ts
│   │   └── assignments.hooks.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Ejemplo de implementación**:

```typescript
// packages/api-client/src/client.ts
import axios, { AxiosInstance } from "axios";

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, token?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}

// packages/api-client/src/tasks/tasks.api.ts
import { ApiClient } from "../client";
import { Task, TaskSchema } from "@nexoav/schemas";

export class TasksApi {
  constructor(private client: ApiClient) {}

  async getTasks(params?: { month?: Date; module?: string }): Promise<Task[]> {
    const response = await this.client.get<Task[]>("/api/tasks", {
      params: {
        month: params?.month?.toISOString(),
        module: params?.module,
      },
    });
    return response.map((task) => TaskSchema.parse(task));
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.client.get<Task>(`/api/tasks/${id}`);
    return TaskSchema.parse(response);
  }

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    const response = await this.client.post<Task>("/api/tasks", task);
    return TaskSchema.parse(response);
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await this.client.put<Task>(`/api/tasks/${id}`, task);
    return TaskSchema.parse(response);
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/api/tasks/${id}`);
  }
}
```

**Uso en web y mobile**:

```typescript
// apps/web/hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query";
import { TasksApi } from "@nexoav/api-client";
import { apiClient } from "@/lib/api-client";

const tasksApi = new TasksApi(apiClient);

export function useTasks(month?: Date) {
  return useQuery({
    queryKey: ["tasks", month],
    queryFn: () => tasksApi.getTasks({ month }),
  });
}

// apps/mobile-company/hooks/useTasks.ts
import { useQuery } from "@tanstack/react-query";
import { TasksApi } from "@nexoav/api-client";
import { apiClient } from "@/lib/api-client";

const tasksApi = new TasksApi(apiClient);

export function useTasks(month?: Date) {
  return useQuery({
    queryKey: ["tasks", month],
    queryFn: () => tasksApi.getTasks({ month }),
  });
}
```

### 3. `packages/ui`

**Propósito**: Componentes UI compartidos (solo lógica/estilos compatibles con React Native).

**Limitaciones**:
- No usar componentes específicos de web (DOM)
- Usar abstracciones compatibles (ej: `View` en lugar de `div`)
- Estilos compatibles (StyleSheet en RN, CSS en web)

**Estructura**:

```
packages/ui/
├── src/
│   ├── button/
│   │   ├── Button.tsx          # Componente base
│   │   ├── Button.web.tsx      # Implementación web
│   │   └── Button.native.tsx   # Implementación React Native
│   ├── input/
│   │   ├── Input.tsx
│   │   ├── Input.web.tsx
│   │   └── Input.native.tsx
│   └── index.ts
├── package.json
└── tsconfig.json
```

**Alternativa (más simple)**: Solo compartir lógica, no componentes UI. Cada plataforma tiene sus propios componentes.

---

## Aplicaciones Móviles

### 1. `apps/mobile-company`

**Propósito**: App simple para empresa (ver planning, aprobar acciones básicas).

**Stack**:
- **Expo** (SDK 50+)
- **Expo Router** (navegación basada en archivos)
- **React Native** (UI nativa)
- **TypeScript**
- **React Query** (gestión de estado del servidor)
- **Zustand** o **Jotai** (estado local)

**Estructura**:

```
apps/mobile-company/
├── app/                         # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx           # Pantalla principal
│   │   ├── calendar.tsx         # Calendario
│   │   └── tasks.tsx           # Lista de tareas
│   ├── task/
│   │   ├── [id].tsx            # Detalle de tarea
│   │   └── create.tsx          # Crear tarea
│   └── _layout.tsx             # Layout raíz
├── components/
│   ├── calendar/
│   │   └── MobileCalendar.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   └── TaskList.tsx
│   └── ui/                     # Componentes UI específicos de mobile
├── hooks/
│   ├── useTasks.ts
│   └── useTaskStatus.ts
├── lib/
│   ├── api-client.ts           # Instancia del cliente API
│   └── storage.ts               # AsyncStorage para persistencia local
├── app.json                    # Configuración de Expo
├── package.json
└── tsconfig.json
```

**Pantallas principales**:

1. **Home** (`app/(tabs)/index.tsx`)
   - Resumen de tareas del día
   - Widget de próximas tareas
   - Accesos rápidos

2. **Calendario** (`app/(tabs)/calendar.tsx`)
   - Vista mensual simplificada
   - Tareas por día
   - Filtros por categoría

3. **Tareas** (`app/(tabs)/tasks.tsx`)
   - Lista de tareas del mes
   - Filtros y búsqueda
   - Cambio de estado

4. **Detalle de Tarea** (`app/task/[id].tsx`)
   - Información completa
   - Cambiar estado
   - Editar (si tiene permisos)

### 2. `apps/mobile-technician` (Futuro)

**Propósito**: App para técnicos (ver asignaciones, registrar horas, subir gastos/fotos).

**Stack**: Similar a `mobile-company`, pero con funcionalidades específicas.

**Pantallas principales**:

1. **Mis Trabajos**
   - Asignaciones del técnico
   - Tareas pendientes
   - Calendario personal

2. **Registrar Tiempo**
   - Iniciar/parar cronómetro
   - Registrar horas manualmente
   - Ver historial

3. **Gastos**
   - Subir foto de ticket
   - Registrar gasto
   - Categorizar (combustible, material, etc.)

4. **Fotos**
   - Subir fotos de trabajo
   - Galería de fotos
   - Compartir con cliente

---

## Configuración del Monorepo

### 1. Workspace Configuration

**`pnpm-workspace.yaml`** (o equivalente para npm/yarn):

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`package.json` (root)**:

```json
{
  "name": "nexoav-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "dev:mobile": "pnpm --filter mobile-company start",
    "build:web": "pnpm --filter web build",
    "build:mobile": "pnpm --filter mobile-company build",
    "lint": "pnpm -r lint",
    "type-check": "pnpm -r type-check"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### 2. TypeScript Configuration

**`packages/config/tsconfig.base.json`**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@nexoav/schemas": ["../../packages/schemas/src"],
      "@nexoav/api-client": ["../../packages/api-client/src"],
      "@nexoav/ui": ["../../packages/ui/src"]
    }
  }
}
```

**`apps/mobile-company/tsconfig.json`**:

```json
{
  "extends": "@nexoav/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./",
    "jsx": "react-native"
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Package Dependencies

**`packages/schemas/package.json`**:

```json
{
  "name": "@nexoav/schemas",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**`packages/api-client/package.json`**:

```json
{
  "name": "@nexoav/api-client",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@nexoav/schemas": "workspace:*",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**`apps/mobile-company/package.json`**:

```json
{
  "name": "mobile-company",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@nexoav/schemas": "workspace:*",
    "@nexoav/api-client": "workspace:*",
    "expo": "~50.0.0",
    "expo-router": "~3.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

---

## Flujo de Desarrollo

### 1. Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Desarrollo web
pnpm dev:web

# Desarrollo mobile (en otra terminal)
pnpm dev:mobile

# Build de producción
pnpm build:web
pnpm build:mobile
```

### 2. Compartir Código

**Ejemplo: Añadir un nuevo campo a Task**

1. Actualizar `packages/schemas/src/task/task.schema.ts`
2. Los cambios se reflejan automáticamente en:
   - `apps/web` (Next.js)
   - `apps/mobile-company` (Expo)
   - `apps/api` (NestJS - validación con Zod)

### 3. Testing

```bash
# Test de schemas
pnpm --filter schemas test

# Test de API client
pnpm --filter api-client test

# Test de mobile app
pnpm --filter mobile-company test
```

---

## Ventajas de esta Estructura

1. **DRY (Don't Repeat Yourself)**: Modelos y lógica de API compartidos
2. **Type Safety**: TypeScript compartido entre todas las apps
3. **Validación Consistente**: Zod schemas validan en frontend y backend
4. **Desarrollo Paralelo**: Equipos pueden trabajar en web y mobile simultáneamente
5. **Mantenibilidad**: Cambios en modelos se propagan automáticamente
6. **Escalabilidad**: Fácil añadir nuevas apps (ej: `mobile-technician`)

---

## Próximos Pasos

1. **Fase 1: Setup del Monorepo**
   - Configurar workspace (pnpm/npm/yarn)
   - Crear estructura de carpetas
   - Configurar TypeScript compartido

2. **Fase 2: Packages Compartidos**
   - Crear `packages/schemas` con Task, Job, etc.
   - Crear `packages/api-client` con cliente base
   - Migrar tipos existentes a schemas

3. **Fase 3: App Mobile Empresa**
   - Inicializar `apps/mobile-company` con Expo
   - Configurar Expo Router
   - Implementar pantallas básicas (Home, Calendario, Tareas)

4. **Fase 4: Integración**
   - Conectar app mobile con API
   - Implementar autenticación
   - Sincronizar datos

5. **Fase 5: App Mobile Técnicos** (Futuro)
   - Crear `apps/mobile-technician`
   - Implementar funcionalidades específicas
   - Integrar cámara y geolocalización

---

## Referencias

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [Turborepo](https://turbo.build/repo) (opcional, para builds más rápidos)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

*Última actualización: Estrategia de desarrollo móvil documentada*

