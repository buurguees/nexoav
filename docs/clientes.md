# Sistema de Gestión de Clientes

## Descripción General

Este documento define la estructura completa del sistema de gestión de clientes para NEXOAV. El módulo de clientes es fundamental para la gestión comercial, fiscal y de proyectos, ya que centraliza toda la información necesaria para:

- **Gestión comercial**: Presupuestos, proformas, facturas
- **Gestión fiscal**: Datos fiscales, retenciones, IVA
- **Gestión de proyectos**: Asignación de proyectos a clientes
- **Análisis financiero**: Resumen de facturación, beneficios, historial
- **Facturación profesional**: Email específico, referencias (PO, proyecto), cumplimiento normativo

### ✅ Validación de Facturación

Este sistema incluye **todos los datos imprescindibles** para facturar correctamente según la normativa española:

- ✅ Razón social / Nombre del cliente
- ✅ CIF/NIF/NIE con validación
- ✅ Dirección fiscal completa
- ✅ Persona de contacto y email
- ✅ Condiciones de pago
- ✅ Cliente exento de IVA o tipo de IVA
- ✅ Retención IRPF (solo autónomos)
- ✅ **Email específico de facturación** (`billing_email`)
- ✅ **Referencia interna del cliente** (`billing_reference`)
- ✅ **Referencia de proyecto** (`project_reference`)

**Conclusión**: El sistema cumple totalmente con los requisitos de Hacienda y permite emitir facturas sin fallos, incluso para clientes corporativos y administración pública.

---

## Modelo de Datos

### Interfaz Principal: `Client`

```typescript
/**
 * Cliente: Entidad principal que representa a un cliente/empresa
 * 
 * Un cliente puede tener:
 * - Múltiples ubicaciones (direcciones de facturación, envío, obra)
 * - Múltiples cuentas bancarias
 * - Múltiples proyectos asociados
 * - Historial de presupuestos, proformas y facturas
 */
export interface Client {
  // ============================================
  // IDENTIFICACIÓN
  // ============================================
  id: string;                    // ID único del cliente (UUID aleatorio)
                                // Generado automáticamente por el backend
  code: string;                  // Código único del cliente (ej: "0001", "0002", "0003")
                                // ⚠️ GENERADO AUTOMÁTICAMENTE por el backend
                                // Formato: #### (0001 a 9999)
                                // Secuencial, no editable por el usuario
  
  // ============================================
  // INFORMACIÓN BÁSICA
  // ============================================
  name: string;                  // Nombre o razón social (obligatorio)
  commercial_name?: string;      // Nombre comercial (opcional, para mostrar en facturas)
  description?: string;          // Descripción general del cliente
  
  // Tipo de cliente
  type: ClientType;              // "company" | "individual" | "public_entity"
  
  // Estado del cliente
  status: ClientStatus;          // "active" | "inactive" | "prospect" | "blocked"
  
  // ============================================
  // DATOS FISCALES
  // ============================================
  tax_id: string;                // NIF/CIF/NIE (obligatorio)
                                // Formato validado según tipo de cliente
  tax_id_type: TaxIdType;       // "nif" | "cif" | "nie" | "passport" | "other"
  
  // Retenciones y IVA
  retention_percentage?: number; // Porcentaje de retención IRPF (ej: 15, 19)
                                // Solo para profesionales/autónomos
  vat_exempt?: boolean;          // Cliente exento de IVA
  vat_type?: VatType;           // "general" | "reduced" | "super_reduced" | "exempt"
  
  // Datos fiscales adicionales
  fiscal_address?: string;      // Dirección fiscal (puede diferir de la principal)
  fiscal_city?: string;
  fiscal_postal_code?: string;
  fiscal_country?: string;      // Por defecto: "España"
  
  // ============================================
  // CONTACTO PRINCIPAL
  // ============================================
  primary_contact?: {
    name: string;                // Nombre del contacto principal
    email: string;              // Email principal
    phone?: string;             // Teléfono principal
    mobile?: string;            // Móvil principal
    position?: string;          // Cargo (ej: "Director Comercial")
  };
  
  // Contactos adicionales (múltiples)
  contacts?: ClientContact[];   // Array de contactos adicionales
  
  // ============================================
  // UBICACIONES
  // ============================================
  // Dirección principal (puede ser fiscal, comercial o ambas)
  address?: string;             // Dirección principal
  city?: string;
  postal_code?: string;
  province?: string;            // Provincia/Comunidad Autónoma
  country?: string;            // Por defecto: "España"
  
  // Ubicaciones adicionales (múltiples direcciones)
  locations?: ClientLocation[]; // Array de ubicaciones adicionales
                                // Ej: dirección de obra, almacén, oficina secundaria
  
  // ============================================
  // CUENTAS BANCARIAS
  // ============================================
  bank_accounts?: ClientBankAccount[]; // Array de cuentas bancarias
                                       // Puede tener múltiples cuentas
  
  // ============================================
  // INFORMACIÓN COMERCIAL
  // ============================================
  // Condiciones comerciales
  payment_terms?: PaymentTerms; // "immediate" | "7_days" | "15_days" | "30_days" | "60_days" | "custom"
  payment_terms_days?: number;  // Días personalizados si payment_terms = "custom"
  discount_percentage?: number; // Descuento general aplicable (0-100)
  
  // Límites y crédito
  credit_limit?: number;        // Límite de crédito (€)
  current_balance?: number;     // ⚠️ CALCULADO: Saldo actual (facturado - pagado)
  overdue_amount?: number;      // ⚠️ CALCULADO: Importe vencido
  
  // ============================================
  // FACTURACIÓN
  // ============================================
  // Email específico para facturación
  // En empresas medianas/grandes suele haber un email administrativo exclusivo
  // Ejemplo: facturacion@empresa.com
  // Evita errores cuando el contacto principal es comercial o técnico
  billing_email?: string;       // Email específico para envío de facturas
  
  // Referencias para facturación
  // Muy importante para corporaciones, cadenas y ayuntamientos
  billing_reference?: string;    // Referencia interna que pide el cliente
                                // PO (Purchase Order), referencia contable, etc.
                                // Evita devoluciones de facturas por "falta de referencia"
  project_reference?: string;   // Referencia de proyecto solicitada por el cliente
                                // Usado por corporaciones, cadenas y administración pública
  
  // ============================================
  // RESUMEN FINANCIERO (CALCULADO)
  // ============================================
  // ⚠️ Estos campos son CALCULADOS por el backend, no se editan manualmente
  
  // Facturación
  total_invoiced?: number;      // Total facturado (histórico)
  total_paid?: number;           // Total pagado (histórico)
  pending_amount?: number;       // Importe pendiente de pago
  
  // Presupuestos y proformas
  total_quotes?: number;         // Total de presupuestos emitidos
  total_proformas?: number;      // Total de proformas emitidas
  accepted_quotes?: number;      // Presupuestos aceptados
  
  // Beneficios
  total_revenue?: number;        // Ingresos totales (facturado)
  total_costs?: number;          // Costes totales (compras, gastos, horas)
  net_profit?: number;           // Beneficio neto (revenue - costs)
  profit_margin?: number;        // Margen de beneficio (%)
  
  // ============================================
  // RELACIONES (NO SE ALMACENAN COMO ARRAYS)
  // ============================================
  // ⚠️ IMPORTANTE: Las relaciones se resuelven mediante FK inversa
  // - Project.client_id → Client.id
  // - Quote.client_id → Client.id
  // - Invoice.client_id → Client.id
  // - PurchaseOrder.client_id → Client.id (si aplica)
  
  // ============================================
  // METADATOS
  // ============================================
  created_at: Date;             // Fecha de creación
  updated_at: Date;             // Fecha de última actualización
  created_by?: string;          // ID del usuario que creó el cliente
  updated_by?: string;          // ID del usuario que actualizó el cliente
  
  // ============================================
  // NOTAS Y OBSERVACIONES
  // ============================================
  notes?: string;               // Notas generales (visibles para el equipo)
  internal_notes?: string;      // Notas internas (no visibles para el cliente)
  tags?: string[];              // Etiquetas para categorización y búsqueda
}
```

---

## Tipos y Enumeraciones

### `ClientType`

```typescript
export type ClientType = 
  | "company"        // Empresa (S.L., S.A., etc.)
  | "individual"     // Particular/Autónomo
  | "public_entity"; // Administración pública
```

### `ClientStatus`

```typescript
export type ClientStatus = 
  | "active"         // Cliente activo
  | "inactive"       // Cliente inactivo (temporalmente)
  | "prospect"       // Cliente potencial (lead)
  | "blocked";       // Cliente bloqueado (moroso, etc.)
```

### `TaxIdType`

```typescript
export type TaxIdType = 
  | "nif"           // NIF (Número de Identificación Fiscal) - Personas físicas
  | "cif"           // CIF (Código de Identificación Fiscal) - Empresas
  | "nie"           // NIE (Número de Identidad de Extranjero)
  | "passport"      // Pasaporte (clientes extranjeros)
  | "other";        // Otro tipo de identificación
```

### `VatType`

```typescript
export type VatType = 
  | "general"       // IVA General (21%)
  | "reduced"       // IVA Reducido (10%)
  | "super_reduced" // IVA Superreducido (4%)
  | "exempt";       // Exento de IVA
```

### `PaymentTerms`

```typescript
export type PaymentTerms = 
  | "immediate"     // Pago inmediato
  | "7_days"        // 7 días
  | "15_days"       // 15 días
  | "30_days"       // 30 días
  | "60_days"       // 60 días
  | "90_days"       // 90 días
  | "custom";       // Personalizado (usar payment_terms_days)
```

---

## Interfaces Adicionales

### `ClientContact`

```typescript
/**
 * Contacto adicional del cliente
 * Un cliente puede tener múltiples contactos (comercial, técnico, administrativo, etc.)
 */
export interface ClientContact {
  id: string;                   // ID único del contacto
  name: string;                 // Nombre completo
  email: string;                // Email
  phone?: string;               // Teléfono fijo
  mobile?: string;              // Móvil
  position?: string;            // Cargo/Posición
  department?: string;          // Departamento
  is_primary?: boolean;        // ¿Es contacto principal?
  notes?: string;              // Notas sobre el contacto
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
}
```

### `ClientLocation`

```typescript
/**
 * Ubicación adicional del cliente
 * Un cliente puede tener múltiples ubicaciones (obra, almacén, oficina, etc.)
 */
export interface ClientLocation {
  id: string;                   // ID único de la ubicación
  name: string;                 // Nombre de la ubicación (ej: "Obra Principal", "Almacén")
  type: LocationType;          // Tipo de ubicación
  
  // Dirección
  address: string;              // Dirección completa
  city: string;
  postal_code: string;
  province?: string;
  country?: string;            // Por defecto: "España"
  
  // Coordenadas GPS (opcional, para futura integración con mapas)
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Información adicional
  contact_name?: string;       // Contacto en esta ubicación
  contact_phone?: string;
  notes?: string;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
}

export type LocationType = 
  | "billing"      // Facturación
  | "shipping"     // Envío
  | "work_site"    // Obra
  | "warehouse"   // Almacén
  | "office"       // Oficina
  | "other";       // Otra
```

### `ClientBankAccount`

```typescript
/**
 * Cuenta bancaria del cliente
 * Un cliente puede tener múltiples cuentas bancarias
 */
export interface ClientBankAccount {
  id: string;                   // ID único de la cuenta
  bank_name: string;            // Nombre del banco
  account_number: string;      // Número de cuenta (IBAN completo)
  iban: string;                // IBAN (formato: ESXX XXXX XXXX XXXX XXXX XXXX)
  swift_bic?: string;          // Código SWIFT/BIC (para transferencias internacionales)
  
  // Tipo de cuenta
  account_type?: "checking" | "savings" | "business";
  
  // Información adicional
  holder_name?: string;        // Titular de la cuenta
  is_default?: boolean;        // ¿Es la cuenta por defecto para pagos?
  notes?: string;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
}
```

---

## Relaciones con Otros Módulos

### 1. Proyectos (Project)

```typescript
/**
 * Relación: Client -> Project[]
 * Un cliente puede tener múltiples proyectos
 * La relación se resuelve mediante FK inversa: Project.client_id → Client.id
 */
interface Project {
  client_id: string;            // FK a Client.id
  client_name?: string;         // Cache automático
  client_code?: string;         // Cache automático
}

// Para obtener proyectos de un cliente:
// SELECT * FROM projects WHERE client_id = 'client-123'
```

### 2. Presupuestos y Cotizaciones (Quote)

```typescript
/**
 * Relación: Client -> Quote[]
 * Un cliente puede tener múltiples presupuestos/proformas
 * La relación se resuelve mediante FK inversa: Quote.client_id → Client.id
 */
interface Quote {
  id: string;
  client_id: string;            // FK a Client.id
  project_id?: string;          // FK a Project.id (opcional)
  type: "quote" | "proforma";   // Tipo: presupuesto o proforma
  status: "draft" | "sent" | "accepted" | "rejected";
  total_amount: number;
  // ...
}

// Para obtener presupuestos de un cliente:
// SELECT * FROM quotes WHERE client_id = 'client-123'
```

### 3. Facturas (Invoice)

```typescript
/**
 * Relación: Client -> Invoice[]
 * Un cliente puede tener múltiples facturas
 * La relación se resuelve mediante FK inversa: Invoice.client_id → Client.id
 */
interface Invoice {
  id: string;
  client_id: string;            // FK a Client.id
  project_id?: string;          // FK a Project.id (opcional)
  invoice_number: string;       // Número de factura
  total_amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  // ...
}

// Para obtener facturas de un cliente:
// SELECT * FROM invoices WHERE client_id = 'client-123'
```

### 4. Pagos (Payment)

```typescript
/**
 * Relación: Client -> Payment[]
 * Un cliente puede tener múltiples pagos
 * La relación se resuelve mediante FK inversa: Payment.client_id → Client.id
 */
interface Payment {
  id: string;
  client_id: string;            // FK a Client.id
  invoice_id: string;           // FK a Invoice.id
  amount: number;
  payment_date: Date;
  payment_method: "transfer" | "cash" | "check" | "card";
  // ...
}

// Para obtener pagos de un cliente:
// SELECT * FROM payments WHERE client_id = 'client-123'
```

---

## Cálculos Automáticos del Backend

### Resumen de Facturación

Los siguientes campos se calculan automáticamente por el backend:

```typescript
// ⚠️ IMPORTANTE: Total facturado SIN IVA (histórico)
// Se usa subtotal (base imponible) NO total_amount (que incluye IVA)
total_invoiced = SUM(invoices.subtotal WHERE invoices.client_id = client.id AND invoices.status != 'cancelled')

// Total pagado (histórico)
total_paid = SUM(payments.amount WHERE payments.client_id = client.id)

// Importe pendiente de pago
pending_amount = SUM(invoices.total_amount WHERE invoices.client_id = client.id AND invoices.status IN ('sent', 'overdue')) - total_paid

// Saldo actual
current_balance = total_invoiced - total_paid

// Importe vencido
overdue_amount = SUM(invoices.total_amount WHERE invoices.client_id = client.id AND invoices.status = 'overdue')
```

### Resumen de Presupuestos y Proformas

```typescript
// Total de presupuestos emitidos
total_quotes = COUNT(quotes WHERE quotes.client_id = client.id AND quotes.type = 'quote')

// Total de proformas emitidas
total_proformas = COUNT(quotes WHERE quotes.client_id = client.id AND quotes.type = 'proforma')

// Presupuestos aceptados
accepted_quotes = COUNT(quotes WHERE quotes.client_id = client.id AND quotes.type = 'quote' AND quotes.status = 'accepted')
```

### Beneficio Neto

```typescript
// ⚠️ IMPORTANTE: Ingresos totales SIN IVA (facturado)
// total_invoiced ya está calculado sin IVA (usa subtotal)
total_revenue = total_invoiced

// ⚠️ IMPORTANTE: Costes totales SIN IVA (compras, gastos, horas trabajadas)
// Todos los cálculos se realizan sin IVA para mantener consistencia
total_costs = 
  SUM(purchase_orders.subtotal WHERE purchase_orders.client_id = client.id) +
  SUM(expenses.amount WHERE expenses.client_id = client.id) +
  SUM(tasks.actual_hours * hourly_rate WHERE tasks.project_id IN (SELECT id FROM projects WHERE client_id = client.id))

// Beneficio neto
net_profit = total_revenue - total_costs

// Margen de beneficio (%)
profit_margin = (net_profit / total_revenue) * 100  // Si total_revenue > 0
```

---

## Estructura de Base de Datos

### Tabla Principal: `clients`

```sql
CREATE TABLE clients (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- UUID aleatorio
  code VARCHAR(4) UNIQUE NOT NULL,  -- 0001 a 9999 (secuencial)
  
  -- Información básica
  name VARCHAR(255) NOT NULL,
  commercial_name VARCHAR(255),
  description TEXT,
  type VARCHAR(20) NOT NULL,  -- company, individual, public_entity
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- active, inactive, prospect, blocked
  
  -- Datos fiscales
  tax_id VARCHAR(50) NOT NULL,
  tax_id_type VARCHAR(20) NOT NULL,  -- nif, cif, nie, passport, other
  retention_percentage DECIMAL(5,2),  -- 0-100
  vat_exempt BOOLEAN DEFAULT FALSE,
  vat_type VARCHAR(20),  -- general, reduced, super_reduced, exempt
  
  -- Dirección fiscal
  fiscal_address TEXT,
  fiscal_city VARCHAR(100),
  fiscal_postal_code VARCHAR(20),
  fiscal_country VARCHAR(100) DEFAULT 'España',
  
  -- Contacto principal
  primary_contact_name VARCHAR(255),
  primary_contact_email VARCHAR(255),
  primary_contact_phone VARCHAR(50),
  primary_contact_mobile VARCHAR(50),
  primary_contact_position VARCHAR(100),
  
  -- Dirección principal
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  province VARCHAR(100),
  country VARCHAR(100) DEFAULT 'España',
  
  -- Condiciones comerciales
  payment_terms VARCHAR(20),  -- immediate, 7_days, 15_days, 30_days, 60_days, 90_days, custom
  payment_terms_days INTEGER,
  discount_percentage DECIMAL(5,2),  -- 0-100
  credit_limit DECIMAL(12,2),
  
  -- Facturación
  billing_email VARCHAR(255),  -- Email específico para envío de facturas
  billing_reference VARCHAR(255),  -- Referencia interna (PO, referencia contable)
  project_reference VARCHAR(255),  -- Referencia de proyecto (corporaciones, ayuntamientos)
  
  -- Resumen financiero (calculado, se actualiza con triggers)
  current_balance DECIMAL(12,2) DEFAULT 0,
  overdue_amount DECIMAL(12,2) DEFAULT 0,
  total_invoiced DECIMAL(12,2) DEFAULT 0,
  total_paid DECIMAL(12,2) DEFAULT 0,
  pending_amount DECIMAL(12,2) DEFAULT 0,
  total_quotes INTEGER DEFAULT 0,
  total_proformas INTEGER DEFAULT 0,
  accepted_quotes INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_costs DECIMAL(12,2) DEFAULT 0,
  net_profit DECIMAL(12,2) DEFAULT 0,
  profit_margin DECIMAL(5,2) DEFAULT 0,
  
  -- Metadatos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  -- Notas
  notes TEXT,
  internal_notes TEXT,
  tags TEXT[]  -- Array de etiquetas
);

-- Índices
CREATE INDEX idx_clients_code ON clients(code);
CREATE INDEX idx_clients_tax_id ON clients(tax_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_type ON clients(type);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_tags ON clients USING GIN(tags);  -- Para búsqueda por etiquetas
```

### Tabla: `client_contacts`

```sql
CREATE TABLE client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  mobile VARCHAR(50),
  position VARCHAR(100),
  department VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_client_email UNIQUE (client_id, email)
);

CREATE INDEX idx_client_contacts_client_id ON client_contacts(client_id);
```

### Tabla: `client_locations`

```sql
CREATE TABLE client_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- billing, shipping, work_site, warehouse, office, other
  
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  province VARCHAR(100),
  country VARCHAR(100) DEFAULT 'España',
  
  -- Coordenadas GPS (PostGIS)
  coordinates POINT,
  
  contact_name VARCHAR(255),
  contact_phone VARCHAR(50),
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_client_locations_client_id ON client_locations(client_id);
CREATE INDEX idx_client_locations_type ON client_locations(type);
CREATE INDEX idx_client_locations_coordinates ON client_locations USING GIST(coordinates);  -- Para búsquedas geográficas
```

### Tabla: `client_bank_accounts`

```sql
CREATE TABLE client_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  bank_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  iban VARCHAR(34) NOT NULL,  -- IBAN puede tener hasta 34 caracteres
  swift_bic VARCHAR(11),
  account_type VARCHAR(20),  -- checking, savings, business
  holder_name VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_client_iban UNIQUE (client_id, iban)
);

CREATE INDEX idx_client_bank_accounts_client_id ON client_bank_accounts(client_id);
```

---

## Triggers y Funciones Automáticas

### 1. Generación Automática de Código

```sql
-- Función para generar código único de cliente
CREATE OR REPLACE FUNCTION generate_client_code()
RETURNS TRIGGER AS $$
DECLARE
  sequence_num INTEGER;
BEGIN
  -- Obtener el siguiente número de secuencia (0001 a 9999)
  SELECT COALESCE(MAX(CAST(code AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM clients;
  
  -- Validar que no exceda 9999
  IF sequence_num > 9999 THEN
    RAISE EXCEPTION 'Se ha alcanzado el límite máximo de códigos de cliente (9999)';
  END IF;
  
  -- Generar código: 0001, 0002, 0003, ..., 9999
  NEW.code := LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar código antes de insertar
CREATE TRIGGER trigger_generate_client_code
BEFORE INSERT ON clients
FOR EACH ROW
WHEN (NEW.code IS NULL OR NEW.code = '')
EXECUTE FUNCTION generate_client_code();
```

### 2. Actualización de Resumen Financiero

```sql
-- Función para actualizar resumen financiero del cliente
CREATE OR REPLACE FUNCTION update_client_financial_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar resumen cuando cambie una factura o pago
  UPDATE clients
  SET
    total_invoiced = (
      SELECT COALESCE(SUM(total_amount), 0)
      FROM invoices
      WHERE client_id = NEW.client_id
        AND status != 'cancelled'
    ),
    total_paid = (
      SELECT COALESCE(SUM(amount), 0)
      FROM payments
      WHERE client_id = NEW.client_id
    ),
    pending_amount = (
      SELECT COALESCE(SUM(subtotal), 0)  -- ⚠️ SIN IVA: usar subtotal
      FROM invoices
      WHERE client_id = NEW.client_id
        AND status IN ('sent', 'overdue')
    ) - (
      SELECT COALESCE(SUM(amount), 0)
      FROM payments
      WHERE client_id = NEW.client_id
    ),
    current_balance = (
      SELECT COALESCE(SUM(subtotal), 0)  -- ⚠️ SIN IVA: usar subtotal
      FROM invoices
      WHERE client_id = NEW.client_id
        AND status != 'cancelled'
    ) - (
      SELECT COALESCE(SUM(amount), 0)
      FROM payments
      WHERE client_id = NEW.client_id
    ),
    overdue_amount = (
      SELECT COALESCE(SUM(subtotal), 0)  -- ⚠️ SIN IVA: usar subtotal
      FROM invoices
      WHERE client_id = NEW.client_id
        AND status = 'overdue'
    ),
    updated_at = NOW()
  WHERE id = NEW.client_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar resumen cuando cambien facturas o pagos
CREATE TRIGGER trigger_update_client_summary_on_invoice
AFTER INSERT OR UPDATE OR DELETE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_client_financial_summary();

CREATE TRIGGER trigger_update_client_summary_on_payment
AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_client_financial_summary();
```

### 3. Actualización de Beneficio Neto

```sql
-- Función para calcular y actualizar beneficio neto
CREATE OR REPLACE FUNCTION update_client_profit()
RETURNS TRIGGER AS $$
DECLARE
  client_revenue DECIMAL(12,2);
  client_costs DECIMAL(12,2);
  client_profit DECIMAL(12,2);
  client_margin DECIMAL(5,2);
BEGIN
  -- Calcular ingresos (facturado)
  SELECT COALESCE(SUM(total_amount), 0)
  INTO client_revenue
  FROM invoices
  WHERE client_id = NEW.client_id
    AND status != 'cancelled';
  
  -- Calcular costes (compras + gastos + horas)
  SELECT 
    COALESCE(SUM(po.total_amount), 0) +
    COALESCE(SUM(e.amount), 0) +
    COALESCE(SUM(t.actual_hours * u.hourly_rate), 0)
  INTO client_costs
  FROM projects p
  LEFT JOIN purchase_orders po ON po.project_id = p.id
  LEFT JOIN expenses e ON e.project_id = p.id
  LEFT JOIN tasks t ON t.project_id = p.id
  LEFT JOIN users u ON u.id = t.assigned_to[1]  -- Simplificado, en producción usar tabla de relación
  WHERE p.client_id = NEW.client_id;
  
  -- Calcular beneficio y margen
  client_profit := client_revenue - client_costs;
  client_margin := CASE 
    WHEN client_revenue > 0 THEN (client_profit / client_revenue) * 100
    ELSE 0
  END;
  
  -- Actualizar cliente
  UPDATE clients
  SET
    total_revenue = client_revenue,
    total_costs = client_costs,
    net_profit = client_profit,
    profit_margin = client_margin,
    updated_at = NOW()
  WHERE id = NEW.client_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Row Level Security (RLS) - Supabase

### Políticas de Seguridad

```sql
-- Habilitar RLS en la tabla clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver todos los clientes activos
CREATE POLICY "Users can view active clients"
ON clients
FOR SELECT
USING (
  status = 'active' OR
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
);

-- Política: Solo admins y managers pueden crear clientes
CREATE POLICY "Admins and managers can create clients"
ON clients
FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
);

-- Política: Solo admins y managers pueden actualizar clientes
CREATE POLICY "Admins and managers can update clients"
ON clients
FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
);

-- Política: Solo admins pueden eliminar clientes
CREATE POLICY "Only admins can delete clients"
ON clients
FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
);
```

---

## Ejemplo de Uso

### Cliente Completo

```typescript
const exampleClient: Client = {
  // Identificación
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",  // UUID aleatorio
  code: "0001",  // Código secuencial (0001 a 9999)
  
  // Información básica
  name: "Constructora ABC, S.L.",
  commercial_name: "ABC Construcciones",
  description: "Cliente principal del sector construcción",
  type: "company",
  status: "active",
  
  // Datos fiscales
  tax_id: "B12345678",
  tax_id_type: "cif",
  retention_percentage: 0,  // Empresa, no retención
  vat_exempt: false,
  vat_type: "general",
  
  // Dirección fiscal
  fiscal_address: "Calle Principal, 123",
  fiscal_city: "Madrid",
  fiscal_postal_code: "28001",
  fiscal_country: "España",
  
  // Contacto principal
  primary_contact: {
    name: "Juan Pérez",
    email: "juan.perez@abcconstrucciones.es",
    phone: "+34 91 123 45 67",
    mobile: "+34 600 123 456",
    position: "Director Comercial"
  },
  
  // Dirección principal
  address: "Calle Principal, 123",
  city: "Madrid",
  postal_code: "28001",
  province: "Madrid",
  country: "España",
  
  // Ubicaciones adicionales
  locations: [
    {
      id: "loc-001",
      name: "Obra Principal - Calle Obra, 45",
      type: "work_site",
      address: "Calle Obra, 45",
      city: "Madrid",
      postal_code: "28002",
      province: "Madrid",
      country: "España",
      contact_name: "María García",
      contact_phone: "+34 91 987 65 43",
      created_at: new Date("2025-01-15"),
      updated_at: new Date("2025-01-15")
    }
  ],
  
  // Cuentas bancarias
  bank_accounts: [
    {
      id: "bank-001",
      bank_name: "Banco Santander",
      account_number: "0049 0001 23 1234567890",
      iban: "ES91 2100 0418 4502 0005 1332",
      swift_bic: "BSCHESMM",
      account_type: "business",
      holder_name: "Constructora ABC, S.L.",
      is_default: true,
      created_at: new Date("2025-01-10"),
      updated_at: new Date("2025-01-10")
    }
  ],
  
  // Condiciones comerciales
  payment_terms: "30_days",
  discount_percentage: 5,
  credit_limit: 50000,
  
  // Facturación
  billing_email: "facturacion@abcconstrucciones.es",  // Email específico para facturas
  billing_reference: "PO-2025-001",  // Referencia interna del cliente
  project_reference: "PROJ-ABC-2025",  // Referencia de proyecto del cliente
  
  // Resumen financiero (calculado)
  current_balance: 15000,
  overdue_amount: 0,
  total_invoiced: 125000,
  total_paid: 110000,
  pending_amount: 15000,
  total_quotes: 8,
  total_proformas: 3,
  accepted_quotes: 5,
  total_revenue: 125000,
  total_costs: 95000,
  net_profit: 30000,
  profit_margin: 24,
  
  // Metadatos
  created_at: new Date("2025-01-10"),
  updated_at: new Date("2025-01-20"),
  created_by: "user-001",
  updated_by: "user-001",
  
  // Notas
  notes: "Cliente prioritario, atención especial",
  tags: ["construcción", "prioritario", "madrid"]
};
```

---

## Campos Específicos para Facturación

### `billing_email`

**Propósito**: Email específico para el envío de facturas.

**Motivación**: En empresas medianas/grandes suele haber un email administrativo exclusivo para facturas (ej: `facturacion@empresa.com`). Esto evita errores cuando el contacto principal es comercial o técnico.

**Uso**:
- Si está definido, se usa para enviar facturas automáticamente
- Si no está definido, se usa `primary_contact.email` como fallback
- Validación: Debe ser un email válido

### `billing_reference`

**Propósito**: Referencia interna que solicita el cliente para facturación.

**Motivación**: Muchas empresas (especialmente corporaciones y administración pública) requieren incluir una referencia en las facturas. Puede ser:
- PO (Purchase Order) - Orden de compra
- Referencia contable interna
- Número de expediente
- Cualquier otra referencia administrativa

**Uso**:
- Se incluye automáticamente en todas las facturas del cliente
- Evita devoluciones de facturas por "falta de referencia"
- Opcional pero altamente recomendado para clientes corporativos

### `project_reference`

**Propósito**: Referencia de proyecto solicitada por el cliente.

**Motivación**: Corporaciones, cadenas comerciales y administración pública suelen solicitar una referencia de proyecto específica en las facturas. Esto permite:
- Trazabilidad de instalaciones
- Asociación con proyectos internos del cliente
- Cumplimiento de requisitos administrativos

**Uso**:
- Se incluye en facturas relacionadas con proyectos
- Puede variar por proyecto (se puede sobrescribir a nivel de proyecto)
- Opcional pero recomendado para clientes corporativos y administración pública

**Ejemplo de uso en factura**:
```
Factura #FAC-2025-001
Cliente: Constructora ABC, S.L.
Referencia Cliente: PO-2025-001
Referencia Proyecto: PROJ-ABC-2025
```

---

## Funcionalidades Futuras

### 1. Historial Completo

- Historial de todas las interacciones (llamadas, emails, reuniones)
- Historial de cambios en datos fiscales
- Historial de cambios en condiciones comerciales

### 2. Análisis Avanzado

- Gráficos de evolución de facturación
- Análisis de rentabilidad por cliente
- Comparativa de clientes
- Predicción de pagos

### 3. Integración con Facturación

- Generación automática de facturas recurrentes
- Recordatorios de pago automáticos
- Conciliación bancaria automática

### 4. Gestión de Documentos

- Almacenamiento de documentos fiscales (NIF, CIF, etc.)
- Almacenamiento de contratos
- Almacenamiento de presupuestos y facturas en PDF

---

## Listado de Clientes

### Campos del Listado

El listado de clientes muestra los siguientes campos en orden:

1. **Número de Cliente** (`code`)
   - Código secuencial del cliente (0001, 0002, 0003, ..., 9999)
   - Campo: `client.code`
   - Formato: String con padding de 4 dígitos

2. **Nombre del Cliente** (`name`)
   - Razón social o nombre del cliente
   - Campo: `client.name`
   - Se puede mostrar `commercial_name` si está disponible

3. **Estado** (`status`)
   - Estado actual del cliente
   - Campo: `client.status`
   - Valores: `"active"`, `"inactive"`, `"prospect"`, `"blocked"`
   - Se muestra con badge/etiqueta de color según estado

4. **Nº de Proyectos Totales** (`projects_count`)
   - Total de proyectos asociados al cliente (todos los estados)
   - Campo calculado: `projects_count`
   - Cálculo: `COUNT(projects WHERE projects.client_id = client.id)`
   - No se almacena en BD, se calcula en tiempo real o se cachea

5. **Nº de Proyectos Activos** (`active_projects_count`)
   - Proyectos en estado activo (en progreso o aprobados)
   - Campo calculado: `active_projects_count`
   - Cálculo: `COUNT(projects WHERE projects.client_id = client.id AND projects.status IN ('in_progress', 'approved'))`
   - No se almacena en BD, se calcula en tiempo real o se cachea

6. **Total Facturado** (`total_invoiced`)
   - Total facturado históricamente al cliente
   - Campo: `client.total_invoiced`
   - ⚠️ **IMPORTANTE: Sin IVA** - Se calcula excluyendo el IVA de las facturas
   - Cálculo: `SUM(invoices.subtotal WHERE invoices.client_id = client.id AND invoices.status != 'cancelled')`
   - Formato: Moneda (€) sin decimales o con 2 decimales según preferencia

7. **Margen Limpio** (`net_profit` o `profit_margin`)
   - Beneficio neto del cliente (ingresos - costes)
   - Campo: `client.net_profit` (en €) o `client.profit_margin` (en %)
   - ⚠️ **IMPORTANTE: Sin IVA** - Todos los cálculos se realizan sin IVA
   - Cálculo: `total_revenue - total_costs` (ambos sin IVA)
   - Se puede mostrar como:
     - Monto absoluto: `net_profit` (ej: €22,500)
     - Porcentaje: `profit_margin` (ej: 25.71%)

### Cálculo de Total Facturado (Sin IVA)

```typescript
// ⚠️ CRÍTICO: El total facturado se calcula SIN IVA
total_invoiced = SUM(
  invoices.subtotal  // Base imponible (sin IVA)
  WHERE invoices.client_id = client.id 
    AND invoices.status != 'cancelled'
)

// NO usar invoices.total_amount (que incluye IVA)
// Usar invoices.subtotal (base imponible sin IVA)
```

**Estructura de Invoice para el cálculo**:
```typescript
interface Invoice {
  id: string;
  client_id: string;
  subtotal: number;      // Base imponible (SIN IVA) ✅ Usar este
  vat_amount: number;   // Importe de IVA
  total_amount: number; // Total con IVA ❌ NO usar para total_invoiced
  // ...
}
```

### Cálculo de Proyectos

```typescript
// Total de proyectos
projects_count = COUNT(
  SELECT * FROM projects 
  WHERE client_id = client.id
)

// Proyectos activos
active_projects_count = COUNT(
  SELECT * FROM projects 
  WHERE client_id = client.id 
    AND status IN ('in_progress', 'approved')
)
```

**Estados de proyecto considerados "activos"**:
- `"approved"`: Proyecto aprobado, listo para iniciar
- `"in_progress"`: Proyecto en ejecución

**Estados NO considerados activos**:
- `"draft"`: Borrador
- `"quoted"`: Presupuestado
- `"on_hold"`: En pausa
- `"completed"`: Completado
- `"cancelled"`: Cancelado

### Cálculo de Margen Limpio (Sin IVA)

```typescript
// Ingresos totales (SIN IVA)
total_revenue = SUM(
  invoices.subtotal  // Base imponible sin IVA
  WHERE invoices.client_id = client.id 
    AND invoices.status != 'cancelled'
)

// Costes totales (SIN IVA)
total_costs = 
  SUM(purchase_orders.subtotal WHERE purchase_orders.client_id = client.id) +
  SUM(expenses.amount WHERE expenses.client_id = client.id) +
  SUM(tasks.actual_hours * hourly_rate WHERE tasks.project_id IN (
    SELECT id FROM projects WHERE client_id = client.id
  ))

// Beneficio neto (SIN IVA)
net_profit = total_revenue - total_costs

// Margen de beneficio (%)
profit_margin = (net_profit / total_revenue) * 100  // Si total_revenue > 0
```

### Ejemplo de Query SQL para Listado

```sql
-- Query optimizado para listado de clientes
SELECT 
  c.id,
  c.code,
  c.name,
  c.commercial_name,
  c.status,
  
  -- Proyectos (calculados)
  COUNT(DISTINCT p.id) AS projects_count,
  COUNT(DISTINCT CASE 
    WHEN p.status IN ('in_progress', 'approved') 
    THEN p.id 
  END) AS active_projects_count,
  
  -- Facturación (SIN IVA)
  COALESCE(SUM(i.subtotal), 0) AS total_invoiced,
  
  -- Beneficio neto (SIN IVA)
  COALESCE(SUM(i.subtotal), 0) - COALESCE(SUM(po.subtotal), 0) - COALESCE(SUM(e.amount), 0) AS net_profit,
  
  -- Margen (%)
  CASE 
    WHEN COALESCE(SUM(i.subtotal), 0) > 0 
    THEN ((COALESCE(SUM(i.subtotal), 0) - COALESCE(SUM(po.subtotal), 0) - COALESCE(SUM(e.amount), 0)) / COALESCE(SUM(i.subtotal), 0)) * 100
    ELSE 0
  END AS profit_margin
  
FROM clients c
LEFT JOIN projects p ON p.client_id = c.id
LEFT JOIN invoices i ON i.client_id = c.id AND i.status != 'cancelled'
LEFT JOIN purchase_orders po ON po.client_id = c.id
LEFT JOIN expenses e ON e.client_id = c.id
GROUP BY c.id, c.code, c.name, c.commercial_name, c.status
ORDER BY c.code;
```

### Ordenación y Filtrado

**Ordenación por defecto**: Por `code` (número de cliente) ascendente

**Filtros recomendados**:
- Por estado (`active`, `inactive`, `prospect`, `blocked`)
- Por rango de facturación
- Por margen de beneficio
- Por número de proyectos

### Formato de Visualización

```typescript
// Ejemplo de formato para el listado
interface ClientListItem {
  code: string;                    // "0001"
  name: string;                    // "SOFT CONTROLS DOMOTICA Y AUDIOVISUALES S"
  status: ClientStatus;            // "active" → Badge verde "Activo"
  projects_count: number;          // 8
  active_projects_count: number;   // 3
  total_invoiced: number;          // 87500 → "€87.500" o "87.500 €"
  net_profit: number;              // 22500 → "€22.500" o "22.500 €"
  profit_margin: number;           // 25.71 → "25,71%" o "25.71%"
}
```

---

## Notas de Implementación

### Validaciones Importantes

1. **Código de Cliente**: Debe ser único y generarse automáticamente
2. **NIF/CIF**: Validar formato según tipo de cliente
3. **IBAN**: Validar formato IBAN español e internacional
4. **Email**: Validar formato de email en contactos
5. **Retención**: Solo aplicable a profesionales/autónomos (no empresas)

### Consideraciones de Rendimiento

1. **Resumen Financiero**: Los cálculos se realizan mediante triggers para mantener consistencia
2. **Índices**: Se han creado índices en campos de búsqueda frecuente (code, tax_id, name, status)
3. **Búsqueda por Etiquetas**: Se usa índice GIN para búsqueda eficiente de tags
4. **Coordenadas GPS**: Se usa índice GIST para búsquedas geográficas

### Migración desde Sistema Anterior

Si existe un sistema anterior, considerar:
1. Mapeo de campos antiguos a nuevos
2. Migración de datos fiscales
3. Migración de contactos y ubicaciones
4. Cálculo inicial de resúmenes financieros

---

*Última actualización: Documentación inicial del sistema de clientes*

