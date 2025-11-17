"use client";

import { useBreakpoint } from "../../hooks/useBreakpoint";
import { TaskCalendarList as TaskCalendarListDesktop } from "./desktop/TaskCalendarList";
import { TaskCalendarList as TaskCalendarListTablet } from "./tablet/TaskCalendarList";
import { TaskCalendarList as TaskCalendarListTabletHorizontal } from "./tablet-horizontal/TaskCalendarList";
import { TaskCalendarList as TaskCalendarListMobile } from "./mobile/TaskCalendarList";
import type { TaskCalendarListProps } from "./desktop/TaskCalendarList";

/**
 * Componente TaskCalendarList que renderiza automáticamente
 * la versión correcta según el dispositivo detectado
 */
export function TaskCalendarList(props: TaskCalendarListProps) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  if (breakpoint === 'mobile') {
    return <TaskCalendarListMobile {...props} />;
  }
  
  // Tablet horizontal: igual que tablet portrait
  if (breakpoint === 'tablet') {
    return <TaskCalendarListTabletHorizontal {...props} />;
  }

  // Tablet portrait
  if (breakpoint === 'tablet-portrait') {
    return <TaskCalendarListTablet {...props} />;
  }

  // Desktop (por defecto)
  return <TaskCalendarListDesktop {...props} />;
}

