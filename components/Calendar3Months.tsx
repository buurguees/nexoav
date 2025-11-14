"use client";

import * as React from "react";
import { Calendar } from "./ui/calendar";
import { cn } from "./ui/utils";

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

  // Calcular la fecha de inicio (hoy) y fin (3 meses desde hoy)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);
  threeMonthsLater.setHours(23, 59, 59, 999);

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    if (onDateSelect) {
      onDateSelect(selected);
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 w-full",
        className
      )}
      style={{
        backgroundColor: "var(--background-secondary)",
        borderColor: "var(--border-medium)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
      }}
    >
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        numberOfMonths={3}
        defaultMonth={today}
        fromDate={today}
        toDate={threeMonthsLater}
        showOutsideDays={showOutsideDays}
        className="w-full"
        classNames={{
          months: "flex flex-col lg:flex-row justify-center w-full [&>*:not(:last-child)]:mr-[8px] [&>*:not(:last-child)]:lg:mr-[8px] [&>*:not(:last-child)]:mb-[8px] lg:[&>*:not(:last-child)]:mb-0",
          month: "flex flex-col gap-4 flex-1",
          caption: "flex justify-center pt-1 relative items-center w-full mb-2",
          caption_label: cn(
            "text-sm font-medium",
            "text-[var(--foreground)]"
          ),
          nav: "flex items-center gap-1",
          nav_button: cn(
            "h-7 w-7 bg-transparent p-0 rounded-md",
            "border border-[var(--border-medium)]",
            "hover:bg-[var(--background-secondary)]",
            "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]",
            "transition-colors",
            "opacity-70 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-x-1",
          head_row: "flex",
          head_cell: cn(
            "rounded-md w-8 font-normal text-[0.8rem]",
            "text-[var(--foreground-tertiary)]",
            "uppercase tracking-wider"
          ),
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            "[&:has([aria-selected])]:bg-[var(--accent-blue-primary)]/20",
            "[&:has([aria-selected])]:rounded-md"
          ),
          day: cn(
            "h-8 w-8 p-0 font-normal rounded-md",
            "text-[var(--foreground-secondary)]",
            "hover:bg-[var(--background-secondary)]",
            "hover:text-[var(--foreground)]",
            "transition-colors",
            "aria-selected:opacity-100"
          ),
          day_range_start: cn(
            "day-range-start",
            "aria-selected:bg-[var(--accent-blue-primary)]",
            "aria-selected:text-[var(--foreground)]"
          ),
          day_range_end: cn(
            "day-range-end",
            "aria-selected:bg-[var(--accent-blue-primary)]",
            "aria-selected:text-[var(--foreground)]"
          ),
          day_selected: cn(
            "bg-[var(--accent-blue-primary)]",
            "text-[var(--foreground)]",
            "hover:bg-[var(--accent-blue-hover)]",
            "hover:text-[var(--foreground)]",
            "focus:bg-[var(--accent-blue-primary)]",
            "focus:text-[var(--foreground)]"
          ),
          day_today: cn(
            "bg-[var(--background-secondary)]",
            "text-[var(--foreground)]",
            "font-semibold",
            "border border-[var(--accent-blue-primary)]"
          ),
          day_outside: cn(
            "day-outside",
            "text-[var(--foreground-disabled)]",
            "opacity-50",
            "aria-selected:text-[var(--foreground-disabled)]"
          ),
          day_disabled: cn(
            "text-[var(--foreground-disabled)]",
            "opacity-50",
            "cursor-not-allowed"
          ),
          day_range_middle: cn(
            "aria-selected:bg-[var(--accent-blue-primary)]/20",
            "aria-selected:text-[var(--foreground)]"
          ),
          day_hidden: "invisible",
        }}
      />
    </div>
  );
}

