"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { Calendar18 as Calendar18Desktop } from "./desktop/Calendar18";
import { Calendar18 as Calendar18Tablet } from "./tablet/Calendar18";
import { Calendar18 as Calendar18TabletHorizontal } from "./tablet-horizontal/Calendar18";
import { Calendar18 as Calendar18Mobile } from "./mobile/Calendar18";
import type { Task } from "../../lib/types/task";

interface Calendar18Props {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  tasks?: Task[];
}

/**
 * Componente Calendar18 que renderiza automáticamente
 * la versión correcta según el dispositivo detectado
 */
export function Calendar18(props: Calendar18Props) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  if (breakpoint === 'mobile') {
    return <Calendar18Mobile {...props} />;
  }

  // Tablet horizontal: similar a desktop pero con tamaños ajustados
  if (breakpoint === 'tablet') {
    return <Calendar18TabletHorizontal {...props} />;
  }

  // Tablet portrait: versión compacta
  if (breakpoint === 'tablet-portrait') {
    return <Calendar18Tablet {...props} />;
  }

  // Desktop (por defecto)
  return <Calendar18Desktop {...props} />;
}

