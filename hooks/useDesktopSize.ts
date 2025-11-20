"use client";

import { useState, useEffect } from "react";

/**
 * Hook para detectar el tamaño de pantalla desktop
 * Calcula el tamaño basándose en el ancho disponible (window.innerWidth - sidebar width)
 * Por defecto, asume sidebar colapsado (80px) para que las páginas se carguen con el tamaño correcto
 * 
 * @returns 'small' | 'medium' | 'large' | 'xlarge'
 */
export function useDesktopSize(): 'small' | 'medium' | 'large' | 'xlarge' {
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>(() => {
    if (typeof window === 'undefined') return 'medium';
    // Calcular ancho disponible: window.innerWidth - sidebar width
    // Por defecto, asumimos sidebar colapsado (80px) para carga inicial
    const availableWidth = window.innerWidth - 80;
    
    if (availableWidth < 1200) return 'small';      // < 1200px disponible: Desktop pequeño
    if (availableWidth < 1520) return 'medium';     // 1200px - 1519px: Desktop medio
    if (availableWidth < 1840) return 'large';      // 1520px - 1839px: Desktop grande
    return 'xlarge';                                // >= 1840px: Desktop extra grande
  });

  useEffect(() => {
    const handleResize = () => {
      // Calcular ancho disponible restando el sidebar
      // Intentar leer el ancho real del sidebar desde CSS, pero por defecto usar 80px (colapsado)
      const sidebarWidth = 80; // Sidebar colapsado por defecto
      const availableWidth = window.innerWidth - sidebarWidth;
      
      if (availableWidth < 1200) setSize('small');
      else if (availableWidth < 1520) setSize('medium');
      else if (availableWidth < 1840) setSize('large');
      else setSize('xlarge');
    };

    // Ejecutar una vez al montar para obtener el tamaño correcto
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

