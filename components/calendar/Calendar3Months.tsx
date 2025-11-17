"use client";

import * as React from "react";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { Calendar3Months as Calendar3MonthsDesktop } from "./desktop/Calendar3Months";
import { Calendar3Months as Calendar3MonthsTablet } from "./tablet/Calendar3Months";
import { Calendar3Months as Calendar3MonthsTabletHorizontal } from "./tablet-horizontal/Calendar3Months";
import { Calendar3Months as Calendar3MonthsMobile } from "./mobile/Calendar3Months";
import type { Task } from "../../lib/types/task";

interface Calendar3MonthsProps {
  className?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  showOutsideDays?: boolean;
  tasks?: Task[];
}

/**
 * Componente Calendar3Months que renderiza automáticamente
 * la versión correcta según el dispositivo detectado
 */
export function Calendar3Months(props: Calendar3MonthsProps) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  if (breakpoint === 'mobile') {
    return <Calendar3MonthsMobile {...props} />;
  }

  // Tablet horizontal: similar a desktop pero con tamaños ajustados
  if (breakpoint === 'tablet') {
    return <Calendar3MonthsTabletHorizontal {...props} />;
  }

  // Tablet portrait: versión compacta con 2 meses
  if (breakpoint === 'tablet-portrait') {
    return <Calendar3MonthsTablet {...props} />;
  }

  // Desktop (por defecto)
  return <Calendar3MonthsDesktop {...props} />;
}

