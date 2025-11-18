"use client";

import * as React from "react";
import { Calendar18 } from "../../components/calendar";
import { TaskCalendarList, TaskForm } from "../../components/tasks";
import { motion } from "motion/react";
import { useCalendarTasks } from "../../hooks/useCalendarTasks";
import { filterTasksByModule } from "../../lib/taskCategories";
import { TaskFormData } from "../../components/tasks";

export interface InicioCalendarioProps {
  className?: string;
}

export function InicioCalendario({ className }: InicioCalendarioProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    console.log("Fecha seleccionada en Calendario:", date);
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Obtener tareas del mes visible usando el hook
  // El hook maneja automáticamente la carga de datos (mock por ahora)
  const { tasks, loading: _loading, error: _error } = useCalendarTasks(currentMonth);
  // TODO: Usar loading y error para mostrar estados de carga y errores en el futuro

  // Filtrar tareas para mostrar solo las 4 categorías CORE del módulo Inicio
  // Según inicio.md y categorias-tareas.md, el módulo Inicio solo muestra:
  // - installation (Instalación) 🟠
  // - site_visit (Visita de Obra) 🟡
  // - meeting (Reunión) 🟣
  // - incident (Incidencia) 🔴
  const filteredTasks = React.useMemo(() => {
    return filterTasksByModule(tasks, "inicio");
  }, [tasks]);

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      // TODO: Implementar creación de tarea en backend
      // Por ahora, solo loguear
      console.log("Crear tarea:", taskData);
      // La tarea aparecerá automáticamente en Calendar18 y TaskCalendarList
      // cuando se implemente la integración con el backend
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // Opcional: abrir formulario con fecha pre-rellenada
    // setIsFormOpen(true);
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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-lg)",
        }}
      >
        <Calendar18
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          showOutsideDays={true}
          className="w-full"
          tasks={filteredTasks}
        />
        
        <TaskCalendarList
          tasks={filteredTasks}
          month={currentMonth}
          module="inicio"
          onTaskClick={(task) => {
            console.log("Tarea clickeada en listado:", task);
            // TODO: Abrir modal de detalle o navegar
          }}
          onDayClick={handleDayClick}
          onCreateTask={() => setIsFormOpen(true)}
        />
      </div>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        module="inicio"
        initialDate={selectedDate}
        onSubmit={handleCreateTask}
      />
    </motion.div>
  );
}

