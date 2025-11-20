"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook para obtener el ancho disponible del contenedor
 * Calcula el ancho real disponible después de restar el sidebar
 * 
 * @returns El ancho disponible en píxeles
 */
export function useAvailableWidth(): number {
  const [availableWidth, setAvailableWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 1024;
    // Inicializar con el ancho de la ventana menos el sidebar colapsado (80px) por defecto
    return window.innerWidth - 80;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si no hay contenedor, usar el ancho de la ventana menos el sidebar colapsado
    if (!containerRef.current) {
      const updateWidth = () => {
        // Por defecto, asumimos sidebar colapsado (80px)
        // Esto se ajustará cuando el componente se monte y pueda leer el ancho real
        setAvailableWidth(window.innerWidth - 80);
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    // Usar ResizeObserver para leer el ancho real del contenedor
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setAvailableWidth(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return availableWidth;
}

/**
 * Hook para obtener el ancho disponible usando el contenedor padre
 * Útil cuando el componente está dentro de un contenedor con ancho definido
 */
export function useAvailableWidthFromParent(): { availableWidth: number; containerRef: React.RefObject<HTMLDivElement> } {
  const [availableWidth, setAvailableWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 1024;
    return window.innerWidth - 80; // Sidebar colapsado por defecto
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      const updateWidth = () => {
        setAvailableWidth(window.innerWidth - 80);
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setAvailableWidth(width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { availableWidth, containerRef };
}

