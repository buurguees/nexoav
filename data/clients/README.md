# Datos de Clientes (Mock)

Este directorio contiene datos de ejemplo (mock) para el sistema de gestión de clientes.

## Archivos

- **`clients.json`**: Archivo JSON con datos de clientes de ejemplo para desarrollo frontend y preparación del backend.

## Estructura

El archivo `clients.json` contiene un array de objetos `Client`, cada uno representando un cliente completo con:

### Campos Principales

- **Identificación**: `id`, `code` (generado automáticamente)
- **Información básica**: `name`, `commercial_name`, `type`, `status`
- **Datos fiscales**: `tax_id`, `tax_id_type`, `vat_type`, `retention_percentage`
- **Contactos**: `primary_contact`, `contacts[]` (múltiples contactos)
- **Ubicaciones**: `address`, `locations[]` (múltiples direcciones)
- **Cuentas bancarias**: `bank_accounts[]` (múltiples cuentas)
- **Facturación**: `billing_email`, `billing_reference`, `project_reference`
- **Condiciones comerciales**: `payment_terms`, `credit_limit`, `discount_percentage`
- **Resumen financiero**: `total_invoiced`, `total_paid`, `net_profit`, etc. (calculados)

## Uso

Este archivo se utiliza para:

1. **Desarrollo Frontend**: Proporcionar datos de ejemplo para componentes de clientes
2. **Testing**: Probar funcionalidades sin necesidad de backend
3. **Preparación Backend**: Servir como referencia para la estructura de datos en la base de datos

## Nota Importante

⚠️ **Estructura Normalizada en Base de Datos**: 

En producción, la base de datos estará normalizada:
- `clients`: Tabla principal de clientes
- `client_contacts`: Tabla de contactos (FK: `client_id`)
- `client_locations`: Tabla de ubicaciones (FK: `client_id`)
- `client_bank_accounts`: Tabla de cuentas bancarias (FK: `client_id`)

El formato JSON aquí mostrado es **anidado** para facilitar el desarrollo frontend, pero en la base de datos real, las relaciones se resolverán mediante claves foráneas.

## Relaciones

Los clientes se relacionan con otros módulos mediante FK inversa:

- **Proyectos**: `Project.client_id → Client.id`
- **Presupuestos/Proformas**: `Quote.client_id → Client.id`
- **Facturas**: `Invoice.client_id → Client.id`
- **Pagos**: `Payment.client_id → Client.id`

## Ejemplo de Uso en Código

```typescript
import clientsData from '@/data/clients/clients.json';
import { Client } from '@/lib/types/client';

const clients: Client[] = clientsData;

// Obtener cliente por ID
const client = clients.find(c => c.id === 'client-2025-001');

// Filtrar clientes activos
const activeClients = clients.filter(c => c.status === 'active');
```

---

*Última actualización: Datos de ejemplo iniciales creados*

