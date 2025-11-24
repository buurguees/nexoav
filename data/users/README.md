# Módulo: Usuarios y Seguridad

Este módulo gestiona quién entra en la plataforma y qué puede ver. Utiliza el sistema de autenticación de Supabase (`auth.users`).

## Tablas

### `profiles.json`
Extensión de `auth.users` de Supabase con información adicional del perfil.

**Campos clave:**
- `id`: UUID vinculado a `auth.users.id`
- `email`: Email del usuario
- `full_name`: Nombre completo
- `role`: Rol del usuario (`admin`, `staff`, `freelance`, `client`)
- `department`: Departamento (`produccion`, `facturacion`, `tecnico`)
- `supplier_id`: Si es freelance, vinculación a `suppliers.id` (UUID)
- `is_active`: Si el usuario está activo

**Roles:**
- `admin`: Acceso completo a todas las secciones
- `staff`: Empleado interno con permisos según departamento
- `freelance`: Técnico externo, acceso limitado a sus proyectos
- `client`: Cliente, acceso solo a sus proyectos y facturas

**Notas:**
- `supplier_id` solo se usa cuando `role = 'freelance'`
- Se crea automáticamente cuando se registra un usuario en `auth.users`

