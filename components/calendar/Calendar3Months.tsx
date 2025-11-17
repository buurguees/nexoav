"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { Calendar } from "../ui/calendar";
import { cn } from "../ui/utils";
import { es } from "date-fns/locale";
import { Task } from "./Calendar18";
import { isWithinInterval, startOfDay, endOfDay, parse, isSameDay } from "date-fns";
import { TaskType } from "../../lib/taskCategories";
import { TaskCategoryDot } from "../tasks";
import { DayPopup } from "./DayPopup";

interface Calendar3MonthsProps {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  showOutsideDays?: boolean;
  tasks?: Task[];
}

export function Calendar3Months({
  className,
  selectedDate,
  onDateSelect,
  showOutsideDays = true,
  tasks = [],
}: Calendar3MonthsProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || new Date()
  );
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [popupDate, setPopupDate] = React.useState<Date | undefined>(undefined);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  // Calcular la fecha de inicio (hoy) y fin (2 meses desde hoy = 3 meses en total: hoy + 2 siguientes)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calcular el último día del mes que está 2 meses después de hoy
  const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, 0); // Último día del mes 2 meses después
  twoMonthsLater.setHours(23, 59, 59, 999);

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (onDateSelect) {
      onDateSelect(selected);
    }
    // Abrir el popup cuando se selecciona un día
    if (selected) {
      setPopupDate(selected);
      setIsPopupOpen(true);
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

  // Función para obtener las tareas de un día específico
  const getTasksForDay = (day: Date): Task[] => {
    const dayStart = startOfDay(day);
    
    return tasks.filter((task) => {
      const taskStart = startOfDay(task.startDate);
      const taskEnd = endOfDay(task.endDate);
      
      // Mostrar la tarea si el día está dentro del rango de la tarea
      return dayStart >= taskStart && dayStart <= taskEnd;
    });
  };

  // Efecto para inyectar puntos de color en las celdas del calendario
  React.useEffect(() => {
    if (!calendarRef.current || tasks.length === 0) return;

    // Almacenar los roots de React para cleanup
    const roots: ReturnType<typeof createRoot>[] = [];

    // Función para obtener las categorías únicas de las tareas de un día
    // Mostrar tareas en TODOS los días que dura la tarea (para los puntos del calendario)
    const getTaskTypesForDay = (day: Date): Set<TaskType> => {
      const dayStart = startOfDay(day);
      const taskTypes = new Set<TaskType>();
      
      tasks.forEach((task) => {
        const taskStart = startOfDay(task.startDate);
        const taskEnd = endOfDay(task.endDate);
        
        // Mostrar la tarea si el día está dentro del rango de la tarea
        if (dayStart >= taskStart && dayStart <= taskEnd) {
          taskTypes.add(task.type);
        }
      });
      
      return taskTypes;
    };

    const calendarContainer = calendarRef.current;
    const cells = calendarContainer.querySelectorAll('.calendar-cell');
    
    cells.forEach((cell) => {
      // Limpiar puntos anteriores
      const existingDots = cell.querySelectorAll('.task-dot-container');
      existingDots.forEach(dot => dot.remove());
      
      // Obtener la fecha del día desde el botón dentro de la celda
      const dayButton = cell.querySelector('button[role="gridcell"]') as HTMLButtonElement;
      if (!dayButton) return;
      
      // Obtener el texto del día (número)
      const dayText = dayButton.textContent?.trim();
      if (!dayText || dayText === '') return;
      
      // Obtener la fecha del día
      // react-day-picker puede usar un elemento <time> dentro del botón con datetime
      // O puede tener el atributo data-date directamente en el botón
      let dayDate: Date | null = null;
      
      // Intentar obtener desde data-date del botón
      const dataDate = dayButton.getAttribute('data-date');
      if (dataDate) {
        dayDate = new Date(dataDate);
        if (!isNaN(dayDate.getTime())) {
          // Fecha válida obtenida desde data-date
        } else {
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
            // Verificar que la fecha sea válida
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
        
        // Encontrar el mes al que pertenece esta celda
        const monthElement = cell.closest('.calendar-month');
        if (!monthElement) return;
        
        // Obtener el texto del caption del mes (ej: "noviembre 2025")
        const captionLabel = monthElement.querySelector('.calendar-caption-label');
        if (!captionLabel) return;
        
        const monthText = captionLabel.textContent?.trim();
        if (!monthText) return;
        
        // Verificar si el día es del mes anterior o siguiente usando la clase day-outside
        const isOutside = dayButton.classList.contains('day-outside');
        
        // Parsear el mes y año desde el texto
        // El formato puede ser "noviembre 2025" o similar según el locale
        try {
          // Primero intentar parsear manualmente (más confiable)
          const parts = monthText.split(' ');
          if (parts.length >= 2) {
            const year = parseInt(parts[parts.length - 1]);
            if (!isNaN(year)) {
              // Buscar el mes en el texto (puede estar en español)
              const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
              let monthIndex = -1;
              for (let i = 0; i < monthNames.length; i++) {
                if (monthText.toLowerCase().includes(monthNames[i])) {
                  monthIndex = i;
                  break;
                }
              }
              
              if (monthIndex !== -1) {
                let finalYear = year;
                let finalMonth = monthIndex;
                
                // Si es un día fuera del mes, ajustar el mes
                if (isOutside) {
                  // Si el número del día es mayor a 15, probablemente es del mes anterior
                  // Si es menor o igual a 7, probablemente es del mes siguiente
                  if (dayNumber > 15) {
                    // Mes anterior
                    finalMonth -= 1;
                    if (finalMonth < 0) {
                      finalMonth = 11;
                      finalYear -= 1;
                    }
                  } else {
                    // Mes siguiente
                    finalMonth += 1;
                    if (finalMonth > 11) {
                      finalMonth = 0;
                      finalYear += 1;
                    }
                  }
                }
                
                dayDate = new Date(finalYear, finalMonth, dayNumber);
              }
            }
          }
          
          // Si el parseo manual falló, intentar con date-fns
          if (!dayDate || isNaN(dayDate.getTime())) {
            const parsedDate = parse(monthText, 'MMMM yyyy', new Date(), { locale: es });
            
            if (!isNaN(parsedDate.getTime())) {
              let finalYear = parsedDate.getFullYear();
              let finalMonth = parsedDate.getMonth();
              
              // Si es un día fuera del mes, ajustar el mes
              if (isOutside) {
                if (dayNumber > 15) {
                  finalMonth -= 1;
                  if (finalMonth < 0) {
                    finalMonth = 11;
                    finalYear -= 1;
                  }
                } else {
                  finalMonth += 1;
                  if (finalMonth > 11) {
                    finalMonth = 0;
                    finalYear += 1;
                  }
                }
              }
              
              // Usar el año y mes parseados junto con el número del día
              dayDate = new Date(finalYear, finalMonth, dayNumber);
            }
          }
        } catch (error) {
          // Si falla el parseo, no mostrar puntos para este día
          console.warn('Error parsing date from month text:', monthText, error);
          return;
        }
        
        // Si aún no tenemos una fecha válida, no continuar
        if (!dayDate || isNaN(dayDate.getTime())) {
          console.warn('Could not determine date for day:', dayText, 'in month:', monthText);
          return;
        }
      }
      
      if (!dayDate || isNaN(dayDate.getTime())) return;
      
      // Verificar que la fecha esté en el rango válido
      if (dayDate < today || dayDate > twoMonthsLater) return;
      
      // Normalizar la fecha del día para comparación (solo año, mes, día, sin horas)
      const normalizedDayDate = startOfDay(dayDate);
      
      const taskTypes = getTaskTypesForDay(normalizedDayDate);
      if (taskTypes.size === 0) return;
      
      // Crear contenedor para los puntos
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'task-dot-container';
      dotsContainer.style.cssText = `
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 3px;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 1;
      `;
      
      // Crear un punto por cada categoría única usando el componente TaskCategoryDot
      // Usamos React.createElement para crear los componentes y luego los montamos
      const root = createRoot(dotsContainer);
      roots.push(root);
      
      const dotElements = Array.from(taskTypes).map((taskType) =>
        React.createElement(TaskCategoryDot, {
          key: taskType,
          type: taskType,
          size: 6,
        })
      );
      root.render(
        React.createElement(React.Fragment, null, ...dotElements)
      );
      
      cell.appendChild(dotsContainer);
    });
    
    // Cleanup
    return () => {
      // Desmontar todos los roots de React
      roots.forEach(root => root.unmount());
      // Eliminar los contenedores del DOM
      const containers = calendarContainer.querySelectorAll('.task-dot-container');
      containers.forEach(container => container.remove());
    };
  }, [date, tasks, today, twoMonthsLater]);

  return (
    <div ref={calendarRef} className={cn("calendar-container w-full", className)} style={{ position: "relative" }}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        numberOfMonths={3}
        defaultMonth={today}
        fromDate={today}
        toDate={twoMonthsLater}
        showOutsideDays={showOutsideDays}
        locale={es}
        weekStartsOn={1}
        className="w-full"
        classNames={{
          months: "calendar-months",
          month: "calendar-month",
          caption: "calendar-caption",
          caption_label: "calendar-caption-label",
          nav: "calendar-nav",
          nav_button: "calendar-nav-button",
          nav_button_previous: "calendar-nav-button calendar-nav-button-previous",
          nav_button_next: "calendar-nav-button calendar-nav-button-next",
          table: "calendar-table",
          head_row: "calendar-head-row",
          head_cell: "calendar-head-cell",
          row: "calendar-row",
          cell: "calendar-cell",
          day: "calendar-day",
          day_range_start: "calendar-day day-range-start",
          day_range_end: "calendar-day day-range-end",
          day_selected: "calendar-day",
          day_today: "calendar-day day-today",
          day_outside: "calendar-day day-outside",
          day_disabled: "calendar-day",
          day_range_middle: "calendar-day",
          day_hidden: "calendar-day-hidden",
        }}
      />
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
    </div>
  );
}

