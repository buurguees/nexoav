"use client";

import * as React from "react";
import { Calendar } from "../../ui/calendar";
import { cn } from "../../ui/utils";
import { es } from "date-fns/locale";
import { DayPopup } from "../desktop/DayPopup";
import { isSameDay, startOfDay, endOfDay } from "date-fns";
import { getTaskColor } from "../../../lib/taskCategories";
import { Task } from "../../../lib/types/task";

interface Calendar18Props {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  tasks?: Task[];
}

export function Calendar18({
  className,
  selectedDate,
  onDateSelect,
  onMonthChange,
  showOutsideDays = true,
  tasks = [],
}: Calendar18Props) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || new Date()
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selectedDate || new Date()
  );
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [popupDate, setPopupDate] = React.useState<Date | undefined>(undefined);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  // Sincronizar el mes cuando cambia selectedDate
  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  // Efecto para inyectar las TaskBars en las celdas del calendario después del render
  React.useEffect(() => {
    if (!calendarRef.current || tasks.length === 0) return;

    // Función para verificar si dos tareas se solapan
    const tasksOverlap = (task1: Task, task2: Task): boolean => {
      const start1 = startOfDay(task1.startDate);
      const end1 = endOfDay(task1.endDate);
      const start2 = startOfDay(task2.startDate);
      const end2 = endOfDay(task2.endDate);
      
      return (start1 <= end2 && start2 <= end1);
    };

    // Algoritmo para asignar filas a las tareas basándose en solapamientos
    const assignTaskRows = (tasks: Task[]): Map<string, number> => {
      const taskRows = new Map<string, number>();
      const sortedTasks = [...tasks].sort((a, b) => {
        const dateA = startOfDay(a.startDate).getTime();
        const dateB = startOfDay(b.startDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        // Si empiezan el mismo día, ordenar por duración (más largas primero)
        const durationA = endOfDay(a.endDate).getTime() - dateA;
        const durationB = endOfDay(b.endDate).getTime() - dateB;
        return durationB - durationA;
      });

      sortedTasks.forEach((task) => {
        // Encontrar la primera fila disponible que no tenga conflictos
        let assignedRow = -1;
        const occupiedRows = new Set<number>();
        
        // Ver qué filas están ocupadas por tareas que se solapan con esta
        sortedTasks.forEach((otherTask) => {
          if (otherTask.id === task.id) return;
          if (taskRows.has(otherTask.id) && tasksOverlap(task, otherTask)) {
            occupiedRows.add(taskRows.get(otherTask.id)!);
          }
        });
        
        // Encontrar la primera fila libre
        let row = 0;
        while (occupiedRows.has(row)) {
          row++;
        }
        
        assignedRow = row;
        taskRows.set(task.id, assignedRow);
      });

      return taskRows;
    };

    const taskRows = assignTaskRows(tasks);

    // Funciones auxiliares dentro del efecto
    // Mostrar tareas en TODOS los días que dura la tarea (para las franjas del calendario)
    const getTasksForDayLocal = (day: Date): Task[] => {
      const dayStart = startOfDay(day);
      
      return tasks.filter((task) => {
        const taskStart = startOfDay(task.startDate);
        const taskEnd = endOfDay(task.endDate);
        
        // Mostrar la tarea si el día está dentro del rango de la tarea
        return dayStart >= taskStart && dayStart <= taskEnd;
      });
    };

    const isTaskStartLocal = (day: Date, task: Task): boolean => {
      return isSameDay(day, task.startDate);
    };

    const isTaskEndLocal = (day: Date, task: Task): boolean => {
      return isSameDay(day, task.endDate);
    };

    const calendarContainer = calendarRef.current;
    const cells = calendarContainer.querySelectorAll('.calendar-empresa-cell-mobile');
    
    cells.forEach((cell) => {
      // Limpiar TaskBars anteriores
      const existingBars = cell.querySelectorAll('.task-bar-container');
      existingBars.forEach(bar => bar.remove());
      
      // Obtener la fecha del día desde el botón dentro de la celda
      const dayButton = cell.querySelector('button[role="gridcell"]') as HTMLButtonElement;
      if (!dayButton) return;
      
      const dayText = dayButton.textContent?.trim();
      if (!dayText || dayText === '') return;
      
      // Obtener la fecha del día
      let dayDate: Date | null = null;
      
      // Intentar obtener desde data-date del botón
      const dataDate = dayButton.getAttribute('data-date');
      if (dataDate) {
        dayDate = new Date(dataDate);
        if (isNaN(dayDate.getTime())) {
          dayDate = null;
        }
      }
      
      // Si no hay data-date, intentar desde el elemento <time>
      if (!dayDate) {
        const timeElement = dayButton.querySelector('time');
        if (timeElement) {
          const dateTime = timeElement.getAttribute('datetime');
          if (dateTime) {
            dayDate = new Date(dateTime);
            if (isNaN(dayDate.getTime())) {
              dayDate = null;
            }
          }
        }
      }
      
      // Si no hay elemento time o la fecha no es válida, calcular desde el mes y el número del día
      if (!dayDate || isNaN(dayDate.getTime())) {
        const dayNumber = parseInt(dayText);
        if (isNaN(dayNumber)) return;
        
        // Verificar si el día es del mes anterior o siguiente usando la clase day-outside
        const isOutside = dayButton.classList.contains('day-outside-mobile') || dayButton.classList.contains('day-outside');
        const calendarMonth = currentMonth || new Date();
        let year = calendarMonth.getFullYear();
        let month = calendarMonth.getMonth();
        
        // Si es un día fuera del mes, necesitamos determinar si es del mes anterior o siguiente
        if (isOutside) {
          // Si el número del día es mayor a 15, probablemente es del mes anterior
          // Si es menor o igual a 7, probablemente es del mes siguiente
          if (dayNumber > 15) {
            // Mes anterior
            month -= 1;
            if (month < 0) {
              month = 11;
              year -= 1;
            }
          } else {
            // Mes siguiente
            month += 1;
            if (month > 11) {
              month = 0;
              year += 1;
            }
          }
        }
        
        dayDate = new Date(year, month, dayNumber);
      }
      
      if (!dayDate || isNaN(dayDate.getTime())) return;
      
      const dayTasks = getTasksForDayLocal(dayDate);
      
      if (dayTasks.length === 0) return;
      
      // Crear contenedor para las TaskBars
      const taskContainer = document.createElement('div');
      taskContainer.className = 'task-bar-container';
      taskContainer.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1;';
      
      dayTasks.forEach((task) => {
        const isStart = isTaskStartLocal(dayDate, task);
        const isEnd = isTaskEndLocal(dayDate, task);
        // Usar la fila asignada a esta tarea (siempre la misma para la misma tarea)
        const taskRow = taskRows.get(task.id) || 0;
        // MOBILE: posición inicial después del número + espacio (muy reducido)
        // MOBILE: altura del TaskBar muy reducida + espacio entre TaskBars
        const topPosition = 22 + taskRow * 16; // MOBILE: valores muy reducidos
        
        const taskBar = document.createElement('div');
        const classNames = ['task-bar'];
        if (isStart) classNames.push('task-bar-start');
        if (isEnd) classNames.push('task-bar-end');
        taskBar.className = classNames.join(' ');
        
        // Obtener color según la categoría (type) de la tarea
        const barColor = task.color || getTaskColor(task.type);
        // Usar status si está disponible, sino usar completed (legacy)
        const isCompleted = task.status === "completed" || task.completed === true;
        const opacity = isCompleted ? 0.6 : 1;
        const borderRadius = isStart && isEnd ? "2px" : isStart ? "2px 0 0 2px" : isEnd ? "0 2px 2px 0" : "0";
        
        taskBar.style.cssText = `
          position: absolute;
          left: 0;
          right: 0;
          top: ${topPosition}px;
          height: 12px; /* MOBILE: altura muy reducida */
          background-color: ${barColor};
          opacity: ${opacity};
          display: flex;
          align-items: center;
          padding-left: 4px; /* MOBILE: padding muy reducido */
          padding-right: 4px;
          cursor: pointer;
          border-radius: ${borderRadius};
        `;
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = isStart ? task.title : '';
        titleSpan.style.cssText = `
          font-size: 9px; /* MOBILE: fuente muy pequeña */
          font-weight: var(--font-weight-medium);
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        `;
        
        taskBar.appendChild(titleSpan);
        taskContainer.appendChild(taskBar);
      });
      
      cell.appendChild(taskContainer);
    });
    
    // Cleanup
    return () => {
      const containers = calendarContainer.querySelectorAll('.task-bar-container');
      containers.forEach(container => container.remove());
    };
  }, [date, tasks, currentMonth]);

  // Función para obtener las tareas de un día específico
  // Mostrar tareas en TODOS los días que dura la tarea (para el popup)
  const getTasksForDay = (day: Date): Task[] => {
    const dayStart = startOfDay(day);
    
    return tasks.filter((task) => {
      const taskStart = startOfDay(task.startDate);
      const taskEnd = endOfDay(task.endDate);
      
      // Mostrar la tarea si el día está dentro del rango de la tarea
      return dayStart >= taskStart && dayStart <= taskEnd;
    });
  };

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (onDateSelect) {
      onDateSelect(selected);
    }
    // Abrir el popup cuando se selecciona un día
    if (selected) {
      setPopupDate(selected);
      setIsPopupOpen(true);
      // Actualizar el mes actual si la fecha seleccionada está en otro mes
      if (selected) {
        const newMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
        if (newMonth.getTime() !== currentMonth.getTime()) {
          setCurrentMonth(newMonth);
          if (onMonthChange) {
            onMonthChange(newMonth);
          }
        }
      }
    }
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    if (onMonthChange) {
      onMonthChange(month);
    }
  };

  const handlePopupClose = (open: boolean) => {
    setIsPopupOpen(open);
    // Cuando se cierra el popup, deseleccionar el día
    if (!open) {
      setDate(undefined);
      setPopupDate(undefined);
    }
  };

  return (
    <>
      <div ref={calendarRef} className={cn("calendar-empresa-container-mobile w-full", className)} style={{ position: "relative" }}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={handleMonthChange}
          numberOfMonths={1}
          showOutsideDays={showOutsideDays}
          locale={es}
          weekStartsOn={1}
          className="w-full"
          classNames={{
            months: "calendar-empresa-months-mobile",
            month: "calendar-empresa-month-mobile",
            caption: "calendar-empresa-caption-mobile",
            caption_label: "calendar-empresa-caption-label-mobile",
            nav: "calendar-empresa-nav-mobile",
            nav_button: "calendar-empresa-nav-button-mobile",
            nav_button_previous: "calendar-empresa-nav-button-mobile calendar-empresa-nav-button-previous-mobile",
            nav_button_next: "calendar-empresa-nav-button-mobile calendar-empresa-nav-button-next-mobile",
            table: "calendar-empresa-table-mobile",
            head_row: "calendar-empresa-head-row-mobile",
            head_cell: "calendar-empresa-head-cell-mobile",
            row: "calendar-empresa-row-mobile",
            cell: "calendar-empresa-cell-mobile",
            day: "calendar-empresa-day-mobile",
            day_range_start: "calendar-empresa-day-mobile day-range-start-mobile",
            day_range_end: "calendar-empresa-day-mobile day-range-end-mobile",
            day_selected: "calendar-empresa-day-mobile",
            day_today: "calendar-empresa-day-mobile day-today-mobile",
            day_outside: "calendar-empresa-day-mobile day-outside-mobile",
            day_disabled: "calendar-empresa-day-mobile",
            day_range_middle: "calendar-empresa-day-mobile",
            day_hidden: "calendar-empresa-day-hidden-mobile",
          }}
        />
      </div>
      <DayPopup
        open={isPopupOpen}
        onOpenChange={handlePopupClose}
        date={popupDate}
        tasksForDay={popupDate ? getTasksForDay(popupDate) : []}
        onTaskStatusChange={(taskId, newStatus) => {
          // TODO: Actualizar estado en backend
          // Por ahora, solo loguear
          console.log("Cambiar estado de tarea:", taskId, "a", newStatus);
          // En el futuro: actualizar la tarea en el estado local o backend
        }}
      />
    </>
  );
}

