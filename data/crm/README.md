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

