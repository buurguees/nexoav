/**
 * Tipos e interfaces para el sistema de gestión de clientes
 * Basado en la documentación de docs/clientes.md
 */

export type ClientType = 
  | "company"        // Empresa (S.L., S.A., etc.)
  | "individual"     // Particular/Autónomo
  | "public_entity"; // Administración pública

export type ClientStatus = 
  | "active"         // Cliente activo
  | "inactive"       // Cliente inactivo (temporalmente)
  | "prospect"       // Cliente potencial (lead)
  | "blocked";       // Cliente bloqueado (moroso, etc.)

export type TaxIdType = 
  | "nif"           // NIF (Número de Identificación Fiscal) - Personas físicas
  | "cif"           // CIF (Código de Identificación Fiscal) - Empresas
  | "nie"           // NIE (Número de Identidad de Extranjero)
  | "passport"      // Pasaporte (clientes extranjeros)
  | "other";        // Otro tipo de identificación

export type VatType = 
  | "general"       // IVA General (21%)
  | "reduced"       // IVA Reducido (10%)
  | "super_reduced" // IVA Superreducido (4%)
  | "exempt";       // Exento de IVA

export type PaymentTerms = 
  | "immediate"     // Pago inmediato
  | "7_days"        // 7 días
  | "15_days"       // 15 días
  | "30_days"       // 30 días
  | "60_days"       // 60 días
  | "90_days"       // 90 días
  | "custom";       // Personalizado (usar payment_terms_days)

export interface ClientContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  department?: string;
  is_primary?: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClientLocation {
  id: string;
  name: string;
  type: "billing" | "shipping" | "work_site" | "warehouse" | "office" | "other";
  address: string;
  city: string;
  postal_code: string;
  province?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contact_name?: string;
  contact_phone?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ClientBankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  iban: string;
  swift_bic?: string;
  account_type?: "checking" | "savings" | "business";
  holder_name?: string;
  is_default?: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Cliente: Entidad principal que representa a un cliente/empresa
 */
export interface Client {
  // Identificación
  id: string;
  code: string; // Código único del cliente (ej: "CLI-2025-001")
  
  // Información básica
  name: string;
  commercial_name?: string;
  description?: string;
  type: ClientType;
  status: ClientStatus;
  
  // Datos fiscales
  tax_id: string;
  tax_id_type: TaxIdType;
  retention_percentage?: number;
  vat_exempt?: boolean;
  vat_type?: VatType;
  
  // Dirección fiscal
  fiscal_address?: string;
  fiscal_city?: string;
  fiscal_postal_code?: string;
  fiscal_country?: string;
  
  // Contacto principal
  primary_contact?: {
    name: string;
    email: string;
    phone?: string;
    mobile?: string;
    position?: string;
  };
  
  // Contactos adicionales
  contacts?: ClientContact[];
  
  // Ubicaciones
  address?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  country?: string;
  locations?: ClientLocation[];
  
  // Cuentas bancarias
  bank_accounts?: ClientBankAccount[];
  
  // Condiciones comerciales
  payment_terms?: PaymentTerms;
  payment_terms_days?: number;
  discount_percentage?: number;
  credit_limit?: number;
  
  // Facturación
  billing_email?: string;
  billing_reference?: string;
  project_reference?: string;
  
  // Resumen financiero (calculado)
  current_balance?: number;
  overdue_amount?: number;
  total_invoiced?: number;
  total_paid?: number;
  pending_amount?: number;
  total_quotes?: number;
  total_proformas?: number;
  accepted_quotes?: number;
  total_revenue?: number;
  total_costs?: number;
  net_profit?: number;
  profit_margin?: number;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
  
  // Notas
  notes?: string;
  internal_notes?: string;
  tags?: string[];
  
  // Campos calculados para el listado (no se almacenan en BD)
  projects_count?: number; // Número total de proyectos asociados
  active_projects_count?: number; // Número de proyectos activos (status: in_progress, approved)
  last_activity?: Date; // Última actividad (último proyecto, factura, etc.)
}

