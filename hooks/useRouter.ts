import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar el routing basado en la URL del navegador
 * Simplificado: solo maneja rutas, sin secciones
 */
export function useRouter() {
  // Función para parsear la URL y obtener la ruta
  const parseUrl = useCallback((): string => {
    if (typeof window === 'undefined') {
      return '/';
    }

    const pathname = window.location.pathname;
    
    // Si la URL es "/" o está vacía, es Inicio
    if (pathname === '/' || pathname === '') {
      return '/';
    }

    // Retornar la ruta tal cual
    return pathname;
  }, []);

  // Inicializar desde la URL actual
  const [path, setPath] = useState<string>(() => {
    return parseUrl();
  });

  // Función para navegar y actualizar la URL
  const navigate = useCallback((newPath: string) => {
    // Actualizar la URL del navegador sin recargar la página
    window.history.pushState({ path: newPath }, '', newPath);
    
    // Actualizar el estado local
    setPath(newPath);
  }, []);

  // Escuchar cambios en la URL (navegación del navegador: back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseUrl();
      setPath(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [parseUrl]);

  return {
    path,
    navigate,
  };
}

