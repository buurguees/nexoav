import { useState, useEffect } from 'react';

/**
 * Breakpoints para diferentes dispositivos
 * Desktop es la versión original y por defecto
 */
export const BREAKPOINTS = {
  mobile: 768,      // < 768px: móvil
  tablet: 1024,    // 768px - 1024px: tablet
  desktop: 1025,    // > 1024px: desktop (versión original)
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'tablet-portrait' | 'desktop';

/**
 * Hook para detectar el breakpoint actual
 * Desktop es la versión por defecto y original
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const aspectRatio = width / height;
    
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) {
      // Si es tablet y está en vertical, es tablet-portrait
      return isPortrait ? 'tablet-portrait' : 'tablet';
    }
    // Para pantallas más grandes, verificar si es tablet horizontal (aspect ratio típico de tablet)
    // Tablets horizontales suelen tener aspect ratio entre 1.3 y 1.8
    // Ampliamos el rango hasta 1600px para cubrir tablets horizontales grandes
    if (width >= BREAKPOINTS.tablet && width <= 1600 && aspectRatio >= 1.3 && aspectRatio <= 1.8 && !isPortrait) {
      return 'tablet';
    }
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      const aspectRatio = width / height;
      
      if (width < BREAKPOINTS.mobile) {
        setBreakpoint('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setBreakpoint(isPortrait ? 'tablet-portrait' : 'tablet');
      } else if (width >= BREAKPOINTS.tablet && width <= 1600 && aspectRatio >= 1.3 && aspectRatio <= 1.8 && !isPortrait) {
        // Tablets horizontales grandes (hasta 1600px de ancho con aspect ratio típico)
        // Usa componentes de tablet, no de desktop
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return breakpoint;
}

/**
 * Hook para verificar si es móvil
 */
export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
}

/**
 * Hook para verificar si es tablet
 */
export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'tablet';
}

/**
 * Hook para verificar si es desktop (versión original)
 */
export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
}

/**
 * Hook para obtener información completa del breakpoint
 */
export function useBreakpointInfo() {
  const breakpoint = useBreakpoint();
  
  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isTabletPortrait: breakpoint === 'tablet-portrait',
    isDesktop: breakpoint === 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}

