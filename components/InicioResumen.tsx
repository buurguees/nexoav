"use client";

import * as React from "react";
import { Calendar3Months, Task } from "./calendar";
import { TaskSummaryWidget } from "./tasks";
import { motion } from "motion/react";
import { fetchTasksForMonth } from "../lib/mocks/taskMocks";
import { filterTasksByModule } from "../lib/taskCategories";

interface InicioResumenProps {
  className?: string;
}

export function InicioResumen({ className }: InicioResumenProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [allTasks, setAllTasks] = React.useState<Task[]>([]);

  // Obtener tareas para los 3 meses visibles (mes actual + 2 siguientes)
  React.useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const today = new Date();
        const tasks: Task[] = [];
        
        // Obtener tareas para el mes actual y los 2 siguientes
        for (let i = 0; i < 3; i++) {
          const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
          const monthTasks = await fetchTasksForMonth(monthDate);
          tasks.push(...monthTasks);
        }
        
        // Filtrar tareas para mostrar solo las 4 categorías CORE del módulo Inicio
        // Según inicio.md y categorias-tareas.md, el módulo Inicio solo muestra:
        // - installation (Instalación) 🟠
        // - site_visit (Visita de Obra) 🟡
        // - meeting (Reunión) 🟣
        // - incident (Incidencia) 🔴
        const filteredTasks = filterTasksByModule(tasks, "inicio");
        setAllTasks(filteredTasks);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
        setAllTasks([]);
      }
    };

    fetchAllTasks();
  }, []); // Solo cargar una vez al montar

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    console.log("Fecha seleccionada en Resumen:", date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`page-content-scroll ${className || ''}`}
      style={{
        height: '100%',
      }}
    >
      <div
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-lg)",
        }}
      >
        <Calendar3Months
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          showOutsideDays={true}
          className="w-full"
          tasks={allTasks}
        />
        <TaskSummaryWidget
          tasks={allTasks}
          referenceDate={new Date()}
          maxTasks={6}
          onTaskClick={(task) => {
            console.log("Tarea clickeada en widget:", task);
            // TODO: Navegar a detalle o abrir popup
          }}
        />
      </div>
    </motion.div>
  );
}

