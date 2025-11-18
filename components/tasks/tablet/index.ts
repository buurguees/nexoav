/**
 * Componentes de Tareas - Tablet
 * 
 * Versiones adaptadas para tablets
 */

export { TaskCategoryDot, type TaskCategoryDotProps } from "./TaskCategoryDot";
export { TaskSummaryWidget } from "./TaskSummaryWidget";
export type { TaskSummaryWidgetProps } from "./TaskSummaryWidget";

// Por ahora, re-exportar desde desktop (pendientes de implementar)
export { TaskBar, type TaskBarProps } from "../desktop/TaskBar";
export { MonthlyTaskList, type MonthlyTaskListProps } from "../desktop/MonthlyTaskList";
export { TaskCalendarList, type TaskCalendarListProps } from "./TaskCalendarList";
export { TaskForm, type TaskFormProps, type TaskFormData } from "../desktop/TaskForm";

