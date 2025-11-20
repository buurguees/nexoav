"use client";

import { createContext, useContext, ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  sidebarWidth: number; // Ancho actual del sidebar en píxeles
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  isCollapsed: boolean;
  breakpoint: string;
}

/**
 * Provider del contexto del Sidebar
 * Proporciona el estado del sidebar (colapsado/expandido) y su ancho actual
 */
export function SidebarProvider({ children, isCollapsed, breakpoint }: SidebarProviderProps) {
  // Calcular el ancho del sidebar según el breakpoint y estado
  const getSidebarWidth = (): number => {
    if (breakpoint === 'mobile') return 0; // Mobile no tiene sidebar fijo
    if (breakpoint === 'tablet-portrait') {
      // Tablet portrait: 64px colapsado, 160px expandido
      return isCollapsed ? 64 : 160;
    }
    if (breakpoint === 'tablet') {
      // Tablet horizontal: 64px colapsado, 200px expandido
      return isCollapsed ? 64 : 200;
    }
    // Desktop: no cambiamos nada, mantener valores por defecto
    return 216; // Desktop siempre expandido (no tocamos desktop)
  };

  const sidebarWidth = getSidebarWidth();

  return (
    <SidebarContext.Provider value={{ isCollapsed, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * Hook para acceder al contexto del Sidebar
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar debe usarse dentro de un SidebarProvider');
  }
  return context;
}

