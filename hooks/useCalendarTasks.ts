/**
 * Hook para gestionar tareas del calendario
 * 
 * Este hook abstrae la obtención de tareas, permitiendo
 * cambiar fácilmente entre mocks y llamadas reales al backend.
 * 
 * TODO: Cuando el backend esté listo, cambiar fetchTasksForMonth
 * por la llamada real a la API
 */

import { useState, useEffect, useCallback } from "react";
import { Task } from "../lib/types/task";
import { fetchTasksForMonth } from "../lib/mocks/taskMocks";
import { startOfMonth } from "date-fns";

interface UseCalendarTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener tareas de un mes específico
 * 
 * @param viewDate - Fecha del mes a consultar
 * @returns Objeto con tasks, loading, error y función refetch
 */
export function useCalendarTasks(viewDate: Date): UseCalendarTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Normalizar la fecha al inicio del mes para evitar recargas innecesarias
  const monthKey = startOfMonth(viewDate).getTime();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Por ahora: usar mock
      // Futuro: cambiar por llamada real al backend
      const fetchedTasks = await fetchTasksForMonth(viewDate);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error al cargar tareas"));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [viewDate]);

  useEffect(() => {
    fetchTasks();
  }, [monthKey, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
}

