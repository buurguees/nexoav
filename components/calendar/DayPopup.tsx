"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Task } from "./Calendar18";
import { getTaskCategory } from "../../lib/taskCategories";
import { getTaskStatusConfig, type TaskStatus } from "../../lib/taskStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DayPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | undefined;
  tasksForDay?: Task[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
          </DialogTitle>
        </DialogHeader>
        <div style={{ marginTop: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          {/* Lista de tareas del día */}
          {tasksForDay.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <h3 style={{ 
                fontSize: "16px", 
                fontWeight: "var(--font-weight-semibold)", 
                color: "var(--foreground)",
                marginBottom: "var(--spacing-sm)"
              }}>
                Tareas ({tasksForDay.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
                {tasksForDay.map((task) => {
                  const category = getTaskCategory(task.type);
                  const statusConfig = getTaskStatusConfig(task.status);
                  const isSingleDay = isSameDay(task.startDate, task.endDate);
                  const dateRange = isSingleDay
                    ? format(task.startDate, "d MMM", { locale: es })
                    : `${format(task.startDate, "d MMM", { locale: es })} - ${format(task.endDate, "d MMM", { locale: es })}`;

                  return (
                    <div
                      key={task.id}
                      style={{
                        padding: "var(--spacing-md)",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid var(--border-medium)`,
                        backgroundColor: "var(--background-secondary)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-sm)",
                      }}
                    >
                      {/* Título y categoría */}
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: category.color,
                            flexShrink: 0,
                          }}
                        />
                        <h4 style={{ 
                          fontSize: "16px", 
                          fontWeight: "var(--font-weight-semibold)", 
                          color: "var(--foreground)",
                          margin: 0,
                        }}>
                          {task.title}
                        </h4>
                      </div>

                      {/* Descripción */}
                      {task.description && (
                        <p style={{
                          fontSize: "14px",
                          color: "var(--foreground-secondary)",
                          margin: 0,
                          lineHeight: "1.5",
                        }}>
                          {task.description}
                        </p>
                      )}

                      {/* Información del proyecto y cliente */}
                      {(task.project_name || task.client_name) && (
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-xs)",
                          fontSize: "13px",
                          color: "var(--foreground-secondary)",
                        }}>
                          {task.project_name && (
                            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                              <span style={{ fontWeight: "var(--font-weight-medium)" }}>Proyecto:</span>
                              <span>{task.project_name}</span>
                            </div>
                          )}
                          {task.client_name && (
                            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                              <span style={{ fontWeight: "var(--font-weight-medium)" }}>Cliente:</span>
                              <span>{task.client_name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fechas y horario */}
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-xs)",
                        fontSize: "13px",
                        color: "var(--foreground-secondary)",
                      }}>
                        <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                          <span style={{ fontWeight: "var(--font-weight-medium)" }}>Fechas:</span>
                          <span>{dateRange}</span>
                        </div>
                        {(task.startTime || task.endTime) && (
                          <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
                            <span style={{ fontWeight: "var(--font-weight-medium)" }}>Horario:</span>
                            <span>
                              {task.startTime && task.endTime
                                ? `${task.startTime} - ${task.endTime}`
                                : task.startTime || task.endTime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Estado */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-sm)",
                        marginTop: "var(--spacing-xs)",
                      }}>
                        <span style={{
                          fontSize: "13px",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--foreground-secondary)",
                        }}>
                          Estado:
                        </span>
                        <Select
                          value={task.status}
                          onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                        >
                          <SelectTrigger style={{ width: "180px" }}>
                            <SelectValue>
                              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                                <span style={{ color: statusConfig.color }}>
                                  {statusConfig.icon}
                                </span>
                                <span>{statusConfig.label}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "14px", color: "var(--foreground-secondary)" }}>
              <p>No hay tareas programadas para este día</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
