"use client";

import * as React from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { TaskSummaryWidget as TaskSummaryWidgetDesktop } from "./desktop/TaskSummaryWidget";
import { TaskSummaryWidget as TaskSummaryWidgetTablet } from "./tablet/TaskSummaryWidget";
import { TaskSummaryWidget as TaskSummaryWidgetTabletHorizontal } from "./tablet-horizontal/TaskSummaryWidget";
import { TaskSummaryWidget as TaskSummaryWidgetMobile } from "./mobile/TaskSummaryWidget";
import type { TaskSummaryWidgetProps } from "./desktop/TaskSummaryWidget";

/**
 * Componente TaskSummaryWidget que renderiza automáticamente
 * la versión correcta según el dispositivo detectado
 */
export function TaskSummaryWidget(props: TaskSummaryWidgetProps) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  if (breakpoint === 'mobile') {
    return <TaskSummaryWidgetMobile {...props} />;
  }
  
  // Tablet horizontal: igual que tablet portrait
  if (breakpoint === 'tablet') {
    return <TaskSummaryWidgetTabletHorizontal {...props} />;
  }

  // Tablet portrait
  if (breakpoint === 'tablet-portrait') {
    return <TaskSummaryWidgetTablet {...props} />;
  }

  // Desktop (por defecto)
  return <TaskSummaryWidgetDesktop {...props} />;
}

