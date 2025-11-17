/**
 * Componentes de Calendario
 * 
 * Componentes reutilizables relacionados con la visualización de calendarios
 * 
 * Los componentes detectan automáticamente el dispositivo y renderizan
 * la versión apropiada (desktop, tablet, mobile).
 * 
 * Para usar versiones específicas manualmente:
 * - import { Calendar18 } from "@/components/calendar/desktop"
 * - import { Calendar18 } from "@/components/calendar/mobile"
 * - import { Calendar18 } from "@/components/calendar/tablet"
 */

// Exportar componentes con detección automática de dispositivo
export { Calendar18 } from "./Calendar18";
export type { Task } from "../../lib/types/task";
export { Calendar3Months } from "./Calendar3Months";
export { DayPopup } from "./desktop/DayPopup";
