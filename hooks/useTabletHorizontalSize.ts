"use client";

import { useState, useEffect, useMemo } from "react";
import { useSidebar } from "../src/contexts/SidebarContext";

/**
 * Hook para detectar el tamaño de pantalla tablet horizontal
 * Calcula el tamaño basándose en el ancho disponible (window.innerWidth - sidebar width)
 * Se adapta automáticamente cuando el sidebar se pliega o despliega
 * 
 * @returns 'small' | 'medium' | 'large'
 */
export function useTabletHorizontalSize(): 'small' | 'medium' | 'large' {
  // Obtener el ancho del sidebar del contexto - esto se actualiza automáticamente cuando cambia
  let sidebarWidth = 200; // Valor por defecto (expandido)
  try {
    const sidebar = useSidebar();
    sidebarWidth = sidebar.sidebarWidth;
  } catch {
    // Si no hay contexto disponible, usar valor por defecto
  }

  // Función para calcular el tamaño basándose en el ancho disponible
  const calculateSize = (width: number, sidebar: number): 'small' | 'medium' | 'large' => {
    const availableWidth = width - sidebar;
    if (availableWidth < 700) return 'small';      // < 700px disponible: Tablet pequeño
    if (availableWidth < 1000) return 'medium';    // 700px - 999px: Tablet medio
    return 'large';                                 // >= 1000px: Tablet grande
  };

  // Calcular el tamaño inicial basándose en el ancho disponible actual
  const initialSize = useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    return calculateSize(window.innerWidth, sidebarWidth);
  }, [sidebarWidth]);

  const [size, setSize] = useState<'small' | 'medium' | 'large'>(initialSize);

  useEffect(() => {
    // Recalcular cuando cambie el sidebarWidth o el tamaño de la ventana
    const updateSize = () => {
      if (typeof window === 'undefined') return;
      const newSize = calculateSize(window.innerWidth, sidebarWidth);
      setSize(newSize);
    };

    // Recalcular inmediatamente cuando cambie el sidebarWidth
    updateSize();

    const handleResize = () => {
      updateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarWidth]); // Recalcular cuando cambie el ancho del sidebar

  // También actualizar el estado cuando cambie el tamaño inicial calculado
  useEffect(() => {
    setSize(initialSize);
  }, [initialSize]);

  return size;
}
