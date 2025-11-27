# Módulo: CRM

Este módulo gestiona la base de datos de clientes y sus contactos.

## Tablas

### `clients.json`
Información completa de los clientes de la empresa.

**Campos clave:**
- `internal_code`: Código interno único (ej: CLI-0001)
- `fiscal_name`: Razón social fiscal
- `commercial_name`: Nombre comercial
- `vat_number`: CIF/NIF del cliente
- `billing_address`: Dirección de facturación estructurada (JSONB)
- `shipping_address`: Dirección de envío estructurada (JSONB)
- `payment_terms`: Condiciones de pago
- `payment_method`: Método de pago preferido
- `total_billing`: **Total facturado acumulado** - Suma de todas las facturas del cliente (calculado automáticamente)
- `total_projects`: **Total de proyectos realizados** - Cantidad de proyectos del cliente (calculado automáticamente)
- `is_active`: **Estado del cliente** - `true` (activo) o `false` (inactivo)

**Notas sobre `total_billing`:**
- Se calcula automáticamente mediante trigger cuando se crean/modifican/eliminan facturas
- Solo incluye facturas definitivas (`type = 'factura'`) con estado `'cobrada'` o `'aceptada'`
- No incluye presupuestos ni proformas
- Permite mostrar el total facturado en el listado de clientes sin necesidad de JOINs complejos
- Se actualiza en tiempo real cuando cambia el estado de una factura o se modifica su total

**Notas sobre `total_projects` (AUTOMÁTICO):**
- ✅ **Se calcula AUTOMÁTICAMENTE mediante trigger al guardar un proyecto nuevo**
- ✅ **Se ejecuta al darle al botón de guardar** cuando se crea un proyecto
- ✅ **No requiere intervención manual**, es completamente automático
- Cuenta todos los proyectos donde `client_id = clients.id`, independientemente del estado
- Incluye proyectos en cualquier estado (borrador, presupuestado, aceptado, ejecutando, finalizado, cancelado)
- Permite mostrar el total de proyectos realizados en el listado de clientes sin necesidad de JOINs complejos
- Se actualiza en tiempo real cuando:
  - Se crea un nuevo proyecto → **Incrementa automáticamente el contador**
  - Se modifica el `client_id` de un proyecto → Recalcula ambos clientes
  - Se elimina un proyecto → Decrementa automáticamente el contador
- **Flujo**: Usuario crea proyecto → Guarda → Trigger se ejecuta → `total_projects` se actualiza automáticamente

---

## 📝 Formulario de Nuevo Cliente

**Documentación completa**: Ver `docs/base-de-datos.md` sección "Formulario de Nuevo Cliente"

### Resumen Rápido:

**Campos Automáticos (NO implementar en formulario):**
- ✅ `id` - UUID generado automáticamente
- ✅ `internal_code` - Generado por trigger (CLI-0001, CLI-0002...)
- ✅ `total_billing` - Inicializado en 0.00, calculado automáticamente
- ✅ `total_projects` - Inicializado en 0, calculado automáticamente
- ✅ `created_at` - Timestamp automático
- ✅ `updated_at` - Timestamp automático

**Campos a Implementar:**

1. **Información Fiscal** (Obligatorio):
   - `fiscal_name` ✅ (MAYÚSCULAS)
   - `commercial_name` (opcional, MAYÚSCULAS)
   - `vat_number` ✅ (validar formato CIF/NIF, verificar unicidad)

2. **Dirección de Facturación** (Obligatorio):
   - `billing_address.street` ✅ (formato título)
   - `billing_address.city` ✅ (formato título)
   - `billing_address.zip` ✅ (5 dígitos)
   - `billing_address.province` ✅ (dropdown provincias)
   - `billing_address.country` ✅ (dropdown países, default "España")

3. **Dirección de Envío** (Opcional):
   - Misma estructura que facturación
   - Checkbox "Usar misma dirección" para copiar automáticamente

4. **Condiciones de Pago** (Opcional):
   - `payment_terms` (dropdown: "30 días", "60 días", etc.)
   - `payment_method` (dropdown: "transferencia", "confirming", etc.)

5. **Estado y Notas** (Opcional):
   - `is_active` (checkbox, default: true)
   - `notes` (textarea)

**Transformaciones Automáticas:**
- Nombres → MAYÚSCULAS antes de guardar
- Direcciones → Formato título (primera mayúscula) antes de guardar

**Validaciones:**
- Campos obligatorios no vacíos
- Formato CIF/NIF válido
- Código postal 5 dígitos
- Unicidad de `vat_number` (consulta a BD)

**Notas sobre `is_active` (Estado del Cliente):**
- **Activo (`true`)**: Cliente activo que puede recibir presupuestos y facturas. Aparece en listados principales.
- **Inactivo (`false`)**: Cliente inactivo que no aparece en listados principales, pero se mantiene en el historial.
- Por defecto, todos los clientes nuevos se crean como `is_active = true`
- Se marca como inactivo cuando:
  - El cliente ya no trabaja con la empresa
  - Está temporalmente suspendido
  - Se quiere ocultar del listado principal sin eliminar el historial
- Los clientes inactivos se mantienen en la base de datos para consultas históricas y facturación pasada

**Formato de datos:**
- **Nombres** (`fiscal_name`, `commercial_name`): Siempre en MAYÚSCULAS completas
  - Ejemplo: `"CBCN SOLUCIONES Y EQUIPOS MULTIFUNCIONALES SL"`
- **Direcciones** (`billing_address`, `shipping_address`): Formato título (primera letra mayúscula, resto minúsculas)
  - `street`: `"Calle espronceda, 333 - 333"`
  - `city`: `"Barcelona"`
  - `province`: `"Barcelona"`
  - `country`: `"España"` (mantiene mayúsculas en nombres propios)

**Estructura de direcciones JSONB:**
```json
{
  "street": "Calle y número",
  "city": "Ciudad/Municipio",
  "zip": "Código Postal",
  "province": "Provincia",
  "country": "País"
}
```

### `client_contacts.json`
Múltiples contactos por cliente (1:N). Permite tener Productor, Administrativo, Técnico de Sala, etc.

**Campos clave:**
- `client_id`: Cliente asociado (UUID)
- `full_name`: Nombre completo del contacto
- `position`: Cargo/Posición
- `email`: Email de contacto
- `phone`: Teléfono de contacto
- `tags`: Array de etiquetas (ej: ['facturacion', 'tecnico'])
- `is_billing_contact`: Si es contacto de facturación (para envío automático)
- `is_primary`: Contacto principal

**Etiquetas comunes:**
- `facturacion`: Para envío de facturas
- `tecnico`: Para temas técnicos
- `produccion`: Para coordinación de producción
- `administracion`: Para temas administrativos

