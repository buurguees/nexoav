"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "../../../lib/types/task";
import { getTaskCategory } from "../../../lib/taskCategories";
import { getTaskStatusConfig, type TaskStatus } from "../../../lib/taskStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface DayPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | undefined;
  tasksForDay?: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

/**
 * Popup que muestra las tareas de un día específico - Versión Tablet Horizontal
 * 
 * Similar a la versión desktop pero adaptado para tablet horizontal
 */
export function DayPopup({ 
  open, 
  onOpenChange, 
  date, 
  tasksForDay = [],
  onTaskStatusChange,
}: DayPopupProps) {
  if (!date) return null;

  const formattedDate = format(date, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (onTaskStatusChange) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {tasksForDay.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay tareas programadas para este día
            </p>
          ) : (
            tasksForDay.map((task) => {
              const category = getTaskCategory(task.type);
              const statusConfig = getTaskStatusConfig(task.status);
              const isSingleDay = isSameDay(task.startDate, task.endDate);

              return (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg space-y-3"
                  style={{
                    borderLeft: `4px solid ${category.color}`,
                  }}
                >
                  <div>
                    <h4 className="font-medium text-base">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    {task.project_name && (
                      <div>
                        <span className="font-medium">Proyecto: </span>
                        <span>{task.project_name}</span>
                      </div>
                    )}
                    {task.client_name && (
                      <div>
                        <span className="font-medium">Cliente: </span>
                        <span>{task.client_name}</span>
                      </div>
                    )}
                    {task.city && (
                      <div>
                        <span className="font-medium">Ubicación: </span>
                        <span>{task.city}</span>
                        {task.address && <span>, {task.address}</span>}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Fechas: </span>
                      <span>
                        {isSingleDay
                          ? format(task.startDate, "d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })
                          : `${format(task.startDate, "d 'de' MMMM", {
                              locale: es,
                            })} - ${format(task.endDate, "d 'de' MMMM 'de' yyyy", {
                              locale: es,
                            })}`}
                      </span>
                    </div>
                    {(task.startTime || task.endTime) && (
                      <div>
                        <span className="font-medium">Horario: </span>
                        <span>
                          {task.startTime && task.endTime
                            ? `${task.startTime} - ${task.endTime}`
                            : task.startTime || task.endTime}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                        }}
                      >
                        {category.label}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: statusConfig.color }}
                      >
                        {statusConfig.icon} {statusConfig.label}
                      </span>
                    </div>
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        handleStatusChange(task.id, value as TaskStatus)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="in_progress">En progreso</SelectItem>
                        <SelectItem value="completed">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

