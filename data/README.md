# Estructura de Datos Mock - NEXOAV

Esta carpeta contiene datos mock (simulación) de la base de datos, organizados por módulos/schemas.

## Estructura

Cada subcarpeta representa un **módulo/schema** de la base de datos, y cada archivo JSON dentro representa una **tabla**.

```
data/
├── company/          # Módulo: Configuración y Empresa
│   ├── company_settings.json
│   ├── company_banks.json
│   └── document_templates.json
├── users/            # Módulo: Usuarios y Seguridad
│   └── profiles.json
├── crm/              # Módulo: CRM
│   ├── clients.json
│   └── client_contacts.json
├── operations/       # Módulo: Operaciones
│   ├── projects.json
│   ├── project_staffing.json
│   └── tasks.json
├── inventory/        # Módulo: Inventario
│   ├── inventory_categories.json
│   └── inventory_items.json
├── billing/          # Módulo: Facturación
│   ├── sales_documents.json
│   └── sales_document_lines.json
└── expenses/         # Módulo: Compras y Gastos
    ├── suppliers.json
    ├── expenses.json
    └── expense_categories.json
```

## Convenciones

- **Cada JSON es un array** que contiene los registros de la tabla
- **Los UUIDs** se generan siguiendo el formato estándar UUID v4
- **Las fechas** se almacenan en formato ISO 8601 (UTC): `"2025-01-21T00:00:00Z"`
- **Los campos JSONB** (direcciones, snapshots, etc.) se almacenan como objetos JSON anidados
- **Los arrays** (como `tags`, `dates`) se almacenan como arrays JSON

## Uso

Estos datos mock se pueden usar para:
- Desarrollo y pruebas locales
- Generación de tipos TypeScript
- Validación de esquemas
- Migración a Supabase/PostgreSQL

---

**Última actualización:** 2025-01-21

