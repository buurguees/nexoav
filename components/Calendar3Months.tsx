"use client";

import * as React from "react";
import { Calendar } from "./ui/calendar";
import { cn } from "./ui/utils";
import { es } from "date-fns/locale";

interface Calendar3MonthsProps {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  showOutsideDays?: boolean;
}

export function Calendar3Months({
  className,
  selectedDate,
  onDateSelect,
  showOutsideDays = true,
}: Calendar3MonthsProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || new Date()
  );

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
  };

  return (
    <div className={cn("calendar-container w-full", className)}>
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
    </div>
  );
}

