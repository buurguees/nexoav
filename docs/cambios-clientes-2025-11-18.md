# Cambios: Sistema de Gestión de Clientes

## Fecha: 18 de Noviembre de 2025

## Resumen Ejecutivo

Se ha implementado y documentado completamente el **Sistema de Gestión de Clientes** para NEXOAV, incluyendo:

- ✅ Documentación completa del modelo de datos
- ✅ Estructura de base de datos normalizada
- ✅ Datos mock para desarrollo frontend
- ✅ Campos específicos para facturación profesional
- ✅ Listado de clientes con 8 campos
- ✅ Cálculos financieros sin IVA
- ✅ Componentes de listado responsivos

---

## 1. Documentación del Sistema de Clientes

### Archivo: `docs/clientes.md`

**Contenido completo**:
- Modelo de datos TypeScript (`Client` interface)
- Tipos y enumeraciones (ClientType, ClientStatus, TaxIdType, VatType, PaymentTerms)
- Interfaces adicionales (ClientContact, ClientLocation, ClientBankAccount)
- Relaciones con otros módulos (Proyectos, Presupuestos, Facturas, Pagos)
- Cálculos automáticos del backend
- Estructura de base de datos SQL
- Triggers y funciones automáticas
- Políticas RLS para Supabase
- Ejemplos de uso
- **Listado de clientes** con 8 campos definidos

**Características destacadas**:
- ✅ Todos los datos imprescindibles para facturación según normativa española
- ✅ Soporte para clientes corporativos y administración pública
- ✅ Múltiples ubicaciones, contactos y cuentas bancarias
- ✅ Resumen financiero calculado automáticamente
- ✅ Cálculo de beneficio neto y margen

---

## 2. Estructura de Datos

### Archivo: `lib/types/client.ts`

**Interfaz `Client` completa** con:
- Identificación: `id` (UUID), `code` (0001-9999)
- Información básica: `name`, `commercial_name`, `type`, `status`
- Datos fiscales: `tax_id`, `tax_id_type`, `vat_type`, `retention_percentage`
- Contactos: `primary_contact`, `contacts[]`
- Ubicaciones: `address`, `locations[]`
- Cuentas bancarias: `bank_accounts[]`
- Facturación: `billing_email`, `billing_reference`, `project_reference`
- Resumen financiero: `total_invoiced`, `pending_amount`, `net_profit`, etc.
- Campos calculados para listado: `projects_count`, `active_projects_count`

### Archivos de Tipos
- `ClientType`: "company" | "individual" | "public_entity"
- `ClientStatus`: "active" | "inactive" | "prospect" | "blocked"
- `TaxIdType`: "nif" | "cif" | "nie" | "passport" | "other"
- `VatType`: "general" | "reduced" | "super_reduced" | "exempt"
- `PaymentTerms`: "immediate" | "7_days" | "15_days" | "30_days" | "60_days" | "90_days" | "custom"

---

## 3. Datos Mock

### Archivo: `data/clients/clients.json`

**2 clientes de ejemplo**:

1. **SOFT CONTROLS DOMOTICA Y AUDIOVISUALES S**
   - Código: 0001
   - Nombre comercial: "SOFT CONTROLS"
   - CIF: B92971670
   - Ubicación: Valencia
   - 2 contactos adicionales
   - 2 ubicaciones (oficina + almacén)
   - 1 cuenta bancaria
   - Resumen financiero completo

2. **SOLUCIONES Y EQUIPOS MULTIFUNCIONALES SL**
   - Código: 0002
   - Nombre comercial: "CANON BCN"
   - CIF: B65595621
   - Ubicación: Barcelona
   - 1 ubicación
   - 1 cuenta bancaria
   - Resumen financiero completo

### Archivo: `data/clients/README.md`
- Documentación de la estructura de datos mock
- Explicación de la diferencia entre estructura anidada (mock) y normalizada (BD)
- Ejemplos de uso en código

---

## 4. Campos Específicos para Facturación

### Campos Añadidos

1. **`billing_email`**: Email específico para envío de facturas
   - Evita errores cuando el contacto principal es comercial/técnico
   - Fallback a `primary_contact.email` si no está definido

2. **`billing_reference`**: Referencia interna del cliente (PO, referencia contable)
   - Evita devoluciones de facturas por "falta de referencia"
   - Recomendado para clientes corporativos

3. **`project_reference`**: Referencia de proyecto solicitada por el cliente
   - Trazabilidad de instalaciones
   - Requerido por corporaciones, cadenas y administración pública

**Documentación**: Sección completa en `docs/clientes.md` explicando propósito, motivación y uso de cada campo.

---

## 5. Listado de Clientes

### Campos del Listado (8 campos)

1. **Número de Cliente** (`code`) - 0001, 0002, 0003, ...
2. **Nombre del Cliente** (`commercial_name ?? name`)
3. **Estado** (`status`) - active, inactive, prospect, blocked
4. **Nº de Proyectos Totales** (`projects_count`) - Calculado
5. **Nº de Proyectos Activos** (`active_projects_count`) - Calculado
6. **Total Facturado** (`total_invoiced`) - **SIN IVA**
7. **Pendiente de Cobrar** (`pending_amount`) - **SIN IVA** ⭐ Nuevo
8. **Margen Limpio** (`net_profit` o `profit_margin`) - **SIN IVA**

### Query SQL Optimizado

Incluye cálculo de todos los campos del listado en una sola query:
- Proyectos totales y activos
- Total facturado (SIN IVA)
- Pendiente de cobrar (SIN IVA)
- Beneficio neto y margen (SIN IVA)

---

## 6. Cálculos Sin IVA

### ⚠️ IMPORTANTE: Todos los cálculos financieros se realizan SIN IVA

**Cambios realizados**:
- `total_invoiced`: Usa `invoices.subtotal` (no `total_amount`)
- `pending_amount`: Usa `invoices.subtotal`
- `total_revenue`: Usa `invoices.subtotal`
- `total_costs`: Usa `purchase_orders.subtotal`
- `net_profit`: Calculado con valores sin IVA
- `profit_margin`: Calculado con valores sin IVA

**Triggers SQL actualizados**:
- Todos los triggers usan `subtotal` en lugar de `total_amount`
- Comentarios indicando "SIN IVA" en cada cálculo

---

## 7. Formato de Código e ID

### Cambios en Identificación

**Antes**:
- `id`: "client-2025-001" (secuencial)
- `code`: "CLI-2025-0001" (con prefijo y año)

**Ahora**:
- `id`: UUID aleatorio (ej: "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
- `code`: Secuencial simple "0001", "0002", "0003", ..., "9999"

**Trigger SQL actualizado**:
- Genera códigos secuenciales simples (0001-9999)
- Validación para no exceder 9999 clientes

---

## 8. Nombre Comercial

### Campo `commercial_name`

**Propósito**: Nombre más corto y amigable que la razón social

**Ejemplos**:
- Razón social: "SOFT CONTROLS DOMOTICA Y AUDIOVISUALES S"
  - Nombre comercial: "SOFT CONTROLS"
- Razón social: "SOLUCIONES Y EQUIPOS MULTIFUNCIONALES SL"
  - Nombre comercial: "CANON BCN"

**Uso en listado**: Se muestra `commercial_name` si existe, si no `name`

---

## 9. Componentes de Clientes

### Estructura Creada

```
components/clients/
├── desktop/
│   └── ClientList.tsx
├── mobile/
│   └── ClientList.tsx
├── tablet/
│   └── ClientList.tsx
└── tablet-horizontal/
    └── ClientList.tsx
```

**Estado**: Componentes creados (pendiente de revisión y ajustes según especificaciones del listado)

---

## 10. Mocks y Utilidades

### Archivo: `lib/mocks/clientMocks.ts`

**Funciones mock** para desarrollo frontend:
- `fetchClients()`: Obtener todos los clientes
- `fetchClient(id)`: Obtener cliente por ID
- Funciones adicionales según necesidad

**Estado**: Creado (pendiente de implementación completa)

---

## 11. Reorganización de Páginas

### Estructura: `pages/inicio/`

**Páginas movidas**:
- `components/InicioCalendario.tsx` → `pages/inicio/InicioCalendario.tsx`
- `components/InicioResumen.tsx` → `pages/inicio/InicioResumen.tsx`

**Archivo**: `pages/inicio/index.ts` - Exportaciones centralizadas

**Documentación**: `pages/README.md` - Explicación de la estructura

**Beneficios**:
- Separación clara entre componentes reutilizables y páginas
- Organización escalable para futuros módulos
- Fácil añadir nuevas páginas por módulo

---

## 12. Archivos Modificados

### Archivos de Layout y Navegación

- `App.tsx`: Importaciones actualizadas para usar `pages/inicio/`
- `components/layout/Sidebar*.tsx`: Actualizados (cambios menores)
- `hooks/useRouter.ts`: Actualizado (cambios menores)
- `components/tasks/index.ts`: Exportaciones actualizadas

### Archivos de Datos

- `data/clients/clients.json`: 
  - 2 clientes de ejemplo completos
  - Formato de código e ID actualizado
  - Nombre comercial corregido

---

## 13. Validaciones y Consideraciones

### Validaciones Implementadas

1. **Código de Cliente**: Generación automática secuencial (0001-9999)
2. **ID de Cliente**: UUID aleatorio generado automáticamente
3. **Cálculos Financieros**: Todos sin IVA para consistencia
4. **Nombre Comercial**: Opcional, fallback a razón social

### Consideraciones de Rendimiento

1. **Índices SQL**: Creados en campos de búsqueda frecuente
2. **Triggers**: Cálculos automáticos para mantener consistencia
3. **Query Optimizado**: Listado calcula todos los campos en una sola query
4. **Cache**: Campos calculados pueden cachearse para mejor rendimiento

---

## 14. Próximos Pasos

### Pendiente de Implementación

1. **Componentes de Clientes**: Ajustar según especificaciones del listado (8 campos)
2. **Mocks Completos**: Implementar todas las funciones mock
3. **Formulario de Cliente**: Crear formulario para crear/editar clientes
4. **Vista Detalle**: Página de detalle de cliente
5. **Integración Backend**: Conectar con API real cuando esté disponible

---

## Archivos Creados

1. `docs/clientes.md` - Documentación completa del sistema
2. `lib/types/client.ts` - Tipos e interfaces TypeScript
3. `data/clients/clients.json` - Datos mock de clientes
4. `data/clients/README.md` - Documentación de datos mock
5. `pages/inicio/InicioCalendario.tsx` - Página movida
6. `pages/inicio/InicioResumen.tsx` - Página movida
7. `pages/inicio/index.ts` - Exportaciones
8. `pages/README.md` - Documentación de estructura de páginas
9. `components/clients/` - Componentes de listado (4 versiones)
10. `lib/mocks/clientMocks.ts` - Funciones mock

## Archivos Modificados

1. `docs/clientes.md` - Múltiples actualizaciones y mejoras
2. `data/clients/clients.json` - Actualización de formatos y datos
3. `App.tsx` - Importaciones actualizadas
4. `components/layout/*` - Actualizaciones menores
5. `hooks/useRouter.ts` - Actualizaciones menores
6. `components/tasks/index.ts` - Exportaciones actualizadas

## Archivos Eliminados

1. `components/InicioCalendario.tsx` - Movido a `pages/inicio/`
2. `components/InicioResumen.tsx` - Movido a `pages/inicio/`

---

## Impacto

### Beneficios

1. **Sistema Completo**: Modelo de datos completo para gestión de clientes
2. **Facturación Profesional**: Campos específicos para clientes corporativos
3. **Cálculos Precisos**: Todos los cálculos sin IVA para consistencia
4. **Escalabilidad**: Estructura preparada para crecimiento
5. **Documentación**: Documentación completa para desarrollo y mantenimiento

### Compatibilidad

- ✅ Compatible con Supabase (RLS documentado)
- ✅ Compatible con estructura normalizada de BD
- ✅ Compatible con frontend React/TypeScript
- ✅ Preparado para integración con backend NestJS

---

*Documentación generada: 18 de Noviembre de 2025*

