/**
 * Componentes de Tareas
 * 
 * Componentes reutilizables relacionados con la visualización y gestión de tareas
 * 
 * Por defecto exporta desde desktop. Para usar versiones específicas:
 * - import { TaskBar } from "@/components/tasks/desktop"
 * - import { TaskBar } from "@/components/tasks/mobile"
 * - import { TaskBar } from "@/components/tasks/tablet"
 */

// Exportar desde desktop por defecto
export { TaskBar, type TaskBarProps } from "./desktop/TaskBar";
export { TaskCategoryDot, type TaskCategoryDotProps } from "./desktop/TaskCategoryDot";
export { MonthlyTaskList, type MonthlyTaskListProps } from "./desktop/MonthlyTaskList";
export { TaskSummaryWidget, type TaskSummaryWidgetProps } from "./TaskSummaryWidget";
export { TaskCalendarList, type TaskCalendarListProps } from "./TaskCalendarList";
export { TaskForm, type TaskFormProps, type TaskFormData } from "./desktop/TaskForm";
