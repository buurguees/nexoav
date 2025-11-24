# Módulo: Configuración y Empresa

Este módulo contiene los datos fiscales y de configuración principal de la empresa (NEXOAV/AV TECH).

## Tablas

### `company_settings.json`
Datos fiscales y configuración global de la empresa. Solo debe existir un registro (singleton).

**Campos clave:**
- `fiscal_name`: Razón social fiscal
- `trade_name`: Nombre comercial
- `cif`: CIF/NIF de la empresa
- `address_fiscal`: Dirección fiscal estructurada (JSONB)
- `address_warehouse`: Dirección de almacén (JSONB)
- `default_vat`: IVA por defecto (%)
- `default_currency`: Moneda por defecto

### `company_banks.json`
Cuentas bancarias de la empresa que aparecen en las facturas.

**Campos clave:**
- `bank_name`: Nombre del banco
- `iban`: Número IBAN completo
- `swift_bic`: Código SWIFT/BIC
- `is_visible_on_invoices`: Si se muestra en facturas
- `is_default`: Cuenta por defecto

### `document_templates.json`
Plantillas personalizadas para documentos (facturas, presupuestos, emails).

**Campos clave:**
- `type`: Tipo de plantilla (`presupuesto`, `factura`, `email`)
- `name`: Nombre descriptivo
- `template_html`: Diseño del PDF (HTML o JSON)
- `terms_text`: Bloque legal que aparece al final del PDF
- `is_active`: Si está activa
- `is_default`: Plantilla por defecto

