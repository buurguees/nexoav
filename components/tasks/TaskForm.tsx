"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../ui/utils";
import { Task } from "../calendar/Calendar18";
import { TaskType, getCategoriesForModule, getTaskCategory } from "../../lib/taskCategories";
import { getTaskStatusConfig, type TaskStatus } from "../../lib/taskStatus";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export interface TaskFormData {
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (opcional)
  endTime?: string; // HH:mm (opcional)
  type: TaskType;
  status: "pending" | "in_progress" | "completed"; // Estado de la tarea
}

export interface TaskFormProps {
  /** Si está abierto o cerrado */
  open: boolean;
  /** Callback cuando cambia el estado de apertura */
  onOpenChange: (open: boolean) => void;
  /** Tarea existente para editar (opcional, si no se proporciona es creación) */
  task?: Task;
  /** Módulo que está usando el formulario (para filtrar categorías) */
  module: "inicio" | "facturacion" | "comercial" | "rrhh" | "proyectos";
  /** Fecha inicial sugerida (por defecto, hoy) */
  initialDate?: Date;
  /** Callback cuando se envía el formulario */
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  /** Estilos adicionales */
  className?: string;
}

/**
 * Formulario reutilizable para crear o editar tareas.
 * 
 * Campos mínimos:
 * - Título de la tarea
 * - Descripción de la tarea
 * - Horario (opcional: hora inicio y fin)
 * - Fechas de inicio y fin
 * - Categoría (filtrada según el módulo)
 * 
 * Componente reutilizable para cualquier módulo (Inicio, Facturación, Comercial, etc.)
 */
export function TaskForm({
  open,
  onOpenChange,
  task,
  module,
  initialDate,
  onSubmit,
  className,
}: TaskFormProps) {
  const isEditing = !!task;
  const defaultDate = initialDate || new Date();

  // Obtener categorías permitidas para este módulo
  const allowedCategories = React.useMemo(() => {
    return getCategoriesForModule(module);
  }, [module]);

  const form = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || "",
      description: "",
      startDate: task
        ? format(task.startDate, "yyyy-MM-dd")
        : format(defaultDate, "yyyy-MM-dd"),
      endDate: task
        ? format(task.endDate, "yyyy-MM-dd")
        : format(defaultDate, "yyyy-MM-dd"),
      startTime: "",
      endTime: "",
      type: task?.type || allowedCategories[0] || "installation",
      status: task?.status || "pending", // Por defecto: pendiente
    },
    mode: "onChange",
  });

  // Resetear formulario cuando cambia la tarea o se abre/cierra
  React.useEffect(() => {
    if (open) {
      if (task) {
        // Modo edición
        form.reset({
          title: task.title,
          description: task.description || "",
          startDate: format(task.startDate, "yyyy-MM-dd"),
          endDate: format(task.endDate, "yyyy-MM-dd"),
          startTime: task.startTime || "",
          endTime: task.endTime || "",
          type: task.type,
          status: task.status || "pending",
        });
      } else {
        // Modo creación
        form.reset({
          title: "",
          description: "",
          startDate: format(defaultDate, "yyyy-MM-dd"),
          endDate: format(defaultDate, "yyyy-MM-dd"),
          startTime: "",
          endTime: "",
          type: allowedCategories[0] || "installation",
          status: "pending", // Por defecto: pendiente
        });
      }
    }
  }, [open, task, defaultDate, allowedCategories, form]);

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
      // El error se maneja en el componente padre
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-2xl", className)}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la tarea"
              : "Completa los datos para crear una nueva tarea"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Título */}
            <FormField
              control={form.control}
              name="title"
              rules={{
                required: "El título es obligatorio",
                minLength: {
                  value: 3,
                  message: "El título debe tener al menos 3 caracteres",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la tarea</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Instalación LED - Tienda Zara Diagonal"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Texto corto que identifica la tarea
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              rules={{
                required: "La descripción es obligatoria",
                minLength: {
                  value: 10,
                  message: "La descripción debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 500,
                  message: "La descripción no puede exceder 500 caracteres",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la tarea</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles adicionales sobre la tarea..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Texto más amplio con los detalles necesarios
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categoría */}
            <FormField
              control={form.control}
              name="type"
              rules={{
                required: "La categoría es obligatoria",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allowedCategories.map((categoryType) => {
                        const category = getTaskCategory(categoryType);
                        return (
                          <SelectItem key={categoryType} value={categoryType}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: category.color,
                                  flexShrink: 0,
                                }}
                              />
                              {category.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categoría de la tarea según el módulo {module}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="status"
              rules={{
                required: "El estado es obligatorio",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#6b7280" }}>⚪</span>
                          <span>Pendiente</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="in_progress">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#f97316" }}>⏱️</span>
                          <span>En proceso</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "#22c55e" }}>✓</span>
                          <span>Completado</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Estado actual de la tarea. Útil para tareas del pasado que ya se completaron.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fechas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              <FormField
                control={form.control}
                name="startDate"
                rules={{
                  required: "La fecha de inicio es obligatoria",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                rules={{
                  required: "La fecha de fin es obligatoria",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Horario (opcional) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio (opcional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      Franja horaria de inicio del trabajo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de fin (opcional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      Franja horaria de fin del trabajo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Guardar cambios" : "Crear tarea"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

