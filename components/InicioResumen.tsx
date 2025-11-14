"use client";

import * as React from "react";
import { Calendar3Months } from "./Calendar3Months";
import { motion } from "motion/react";

interface InicioResumenProps {
  className?: string;
}

export function InicioResumen({ className }: InicioResumenProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    console.log("Fecha seleccionada en Resumen:", date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div style={{ marginBottom: "var(--spacing-xl)" }}>
        <h1
          style={{
            color: "var(--foreground)",
            fontSize: "20px",
            fontWeight: "var(--font-weight-medium)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          Resumen
        </h1>
        <p
          style={{
            color: "var(--foreground-secondary)",
            fontSize: "13px",
          }}
        >
          Vista general de tu calendario y actividades
        </p>
      </div>

      <div
        style={{
          maxWidth: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
          }}
        >
          <Calendar3Months
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            showOutsideDays={true}
            className="w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

