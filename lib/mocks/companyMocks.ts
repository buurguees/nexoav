/**
 * Funciones Mock para Configuración de Empresa
 * 
 * Estas funciones leen datos desde archivos JSON locales (provisional)
 * para simular una base de datos y facilitar la transición cuando el backend esté listo.
 * 
 * TODO: Reemplazar con llamadas reales al backend (Supabase)
 * 
 * Basado en el schema de la tabla `company_settings` (docs/base-de-datos.md, línea 73)
 */

// Importar datos JSON (en producción esto vendría del backend)
import companySettingsData from "../../data/company/company_settings.json";
import companyBanksData from "../../data/company/company_banks.json";

// Tipo para los datos de configuración de empresa según el schema de la BD
export interface CompanySettingsData {
  id: string; // PK (UUID)
  fiscal_name: string; // Razón social fiscal
  trade_name?: string; // Nombre comercial
  cif: string; // CIF/NIF de la empresa
  address_fiscal?: {
    street?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  }; // Dirección fiscal estructurada (JSONB)
  address_warehouse?: {
    street?: string;
    city?: string;
    zip?: string;
    province?: string;
    country?: string;
  }; // Dirección de almacén (JSONB)
  phone?: string; // Teléfono de contacto
  email_contact?: string; // Email de contacto
  default_vat?: number; // IVA por defecto (%)
  default_currency?: string; // Moneda por defecto
  logo_url?: string; // URL del logo de la empresa
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
}

// Tipo para las cuentas bancarias de la empresa
export interface CompanyBankData {
  id: string; // PK (UUID)
  bank_name: string; // Nombre del banco
  iban: string; // Número IBAN completo
  swift_bic?: string; // Código SWIFT/BIC
  is_visible_on_invoices: boolean; // Si se muestra en facturas
  is_default: boolean; // Cuenta por defecto
  created_at: string; // Fecha de creación (ISO 8601)
  updated_at: string; // Fecha de última actualización (ISO 8601)
}

/**
 * Simula una llamada al backend para obtener la configuración de empresa
 * Como es un singleton, siempre retorna el primer registro
 * 
 * @returns Promise con la configuración de empresa
 */
export async function fetchCompanySettings(): Promise<CompanySettingsData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  const settings = (companySettingsData as any[])[0];
  if (!settings) {
    throw new Error("No se encontró configuración de empresa");
  }

  return settings as CompanySettingsData;
}

/**
 * Simula una llamada al backend para obtener las cuentas bancarias de la empresa
 * Opcionalmente filtradas por visibilidad en facturas
 * 
 * @param visibleOnly - Si true, solo retorna cuentas visibles en facturas
 * @returns Promise con array de cuentas bancarias
 */
export async function fetchCompanyBanks(visibleOnly: boolean = false): Promise<CompanyBankData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 200));

  let banks = companyBanksData as any[];

  if (visibleOnly) {
    banks = banks.filter((bank) => bank.is_visible_on_invoices === true);
  }

  return banks as CompanyBankData[];
}

/**
 * Simula una llamada al backend para obtener la cuenta bancaria por defecto
 * 
 * @returns Promise con la cuenta bancaria por defecto o null
 */
export async function fetchDefaultBank(): Promise<CompanyBankData | null> {
  const banks = await fetchCompanyBanks();
  return banks.find((bank) => bank.is_default) || banks[0] || null;
}

/**
 * Simula una llamada al backend para actualizar la configuración de empresa
 * 
 * @param updates - Campos a actualizar (parciales)
 * @returns Promise con la configuración actualizada
 */
export async function updateCompanySettings(
  updates: Partial<Omit<CompanySettingsData, "id" | "created_at" | "updated_at">>
): Promise<CompanySettingsData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const settings = (companySettingsData as any[])[0];
  if (!settings) {
    throw new Error("No se encontró configuración de empresa");
  }

  const updated: CompanySettingsData = {
    ...settings,
    ...updates,
    updated_at: new Date().toISOString(),
  } as CompanySettingsData;

  // En producción, aquí se haría un PATCH/PUT a la API
  // TODO: Implementar actualización real en Supabase cuando esté listo

  return updated;
}

/**
 * Simula una llamada al backend para crear una nueva cuenta bancaria
 * 
 * @param bankData - Datos de la cuenta bancaria a crear
 * @returns Promise con la cuenta bancaria creada
 */
export async function createCompanyBank(
  bankData: Omit<CompanyBankData, "id" | "created_at" | "updated_at">
): Promise<CompanyBankData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const newBank: CompanyBankData = {
    id,
    ...bankData,
    created_at: now,
    updated_at: now,
  };

  // Si se marca como por defecto, desmarcar las demás
  if (bankData.is_default) {
    const banks = companyBanksData as any[];
    banks.forEach((bank) => {
      if (bank.id !== id) {
        bank.is_default = false;
      }
    });
  }

  // En producción, aquí se haría un POST a la API
  // TODO: Implementar creación real en Supabase cuando esté listo

  return newBank;
}

/**
 * Simula una llamada al backend para actualizar una cuenta bancaria
 * 
 * @param bankId - ID de la cuenta bancaria
 * @param updates - Campos a actualizar (parciales)
 * @returns Promise con la cuenta bancaria actualizada
 */
export async function updateCompanyBank(
  bankId: string,
  updates: Partial<Omit<CompanyBankData, "id" | "created_at" | "updated_at">>
): Promise<CompanyBankData> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const banks = companyBanksData as any[];
  const bank = banks.find((b) => b.id === bankId);

  if (!bank) {
    throw new Error("Cuenta bancaria no encontrada");
  }

  // Si se marca como por defecto, desmarcar las demás
  if (updates.is_default === true) {
    banks.forEach((b) => {
      if (b.id !== bankId) {
        b.is_default = false;
      }
    });
  }

  const updated: CompanyBankData = {
    ...bank,
    ...updates,
    updated_at: new Date().toISOString(),
  } as CompanyBankData;

  // En producción, aquí se haría un PATCH/PUT a la API
  // TODO: Implementar actualización real en Supabase cuando esté listo

  return updated;
}

/**
 * Simula una llamada al backend para eliminar una cuenta bancaria
 * 
 * @param bankId - ID de la cuenta bancaria a eliminar
 * @returns Promise que se resuelve cuando la cuenta es eliminada
 */
export async function deleteCompanyBank(bankId: string): Promise<void> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  const banks = companyBanksData as any[];
  const index = banks.findIndex((b) => b.id === bankId);

  if (index === -1) {
    throw new Error("Cuenta bancaria no encontrada");
  }

  // En producción, aquí se haría un DELETE a la API
  // TODO: Implementar eliminación real en Supabase cuando esté listo
}

