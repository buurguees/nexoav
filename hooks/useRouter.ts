import { useState, useEffect, useCallback } from 'react';
import { HeaderSection } from '../components/Header';

/**
 * Hook personalizado para manejar el routing basado en la URL del navegador
 * Permite que las URLs funcionen correctamente y se mantengan al recargar
 */
export function useRouter() {
  // Función para parsear la URL y determinar la sección y ruta
  const parseUrl = useCallback((): { section: HeaderSection; path: string } => {
    if (typeof window === 'undefined') {
      return { section: 'inicio', path: '/' };
    }

    const pathname = window.location.pathname;
    
    // Si la URL es "/" o está vacía, es Inicio > Resumen
    if (pathname === '/' || pathname === '') {
      return { section: 'inicio', path: '/' };
    }

    // Rutas de Inicio
    if (pathname.startsWith('/calendario')) {
      return { section: 'inicio', path: '/calendario' };
    }
    if (pathname.startsWith('/tareas')) {
      return { section: 'inicio', path: '/tareas' };
    }
    if (pathname.startsWith('/mapa')) {
      return { section: 'inicio', path: '/mapa' };
    }
    if (pathname.startsWith('/mensajes')) {
      return { section: 'inicio', path: '/mensajes' };
    }
    if (pathname.startsWith('/favoritos')) {
      return { section: 'inicio', path: '/favoritos' };
    }

    // Rutas de Facturación
    if (pathname.startsWith('/facturacion')) {
      return { section: 'facturacion', path: pathname };
    }

    // Rutas de Proyectos
    if (pathname.startsWith('/proyectos')) {
      return { section: 'proyectos', path: pathname };
    }

    // Rutas de Productos
    if (pathname.startsWith('/productos')) {
      return { section: 'productos', path: pathname };
    }

    // Rutas de RRHH
    if (pathname.startsWith('/rrhh')) {
      return { section: 'rrhh', path: pathname };
    }

    // Rutas de Empresa
    if (pathname.startsWith('/empresa')) {
      return { section: 'empresa', path: pathname };
    }

    // Por defecto, si no coincide con nada, es Inicio > Resumen
    return { section: 'inicio', path: '/' };
  }, []);

  // Inicializar desde la URL actual
  const [section, setSection] = useState<HeaderSection>(() => {
    return parseUrl().section;
  });
  const [path, setPath] = useState<string>(() => {
    return parseUrl().path;
  });

  // Función para parsear una ruta específica y determinar la sección
  const parsePath = useCallback((pathToParse: string): { section: HeaderSection; path: string } => {
    // Si la URL es "/" o está vacía, es Inicio > Resumen
    if (pathToParse === '/' || pathToParse === '') {
      return { section: 'inicio', path: '/' };
    }

    // Rutas de Inicio
    if (pathToParse.startsWith('/calendario')) {
      return { section: 'inicio', path: '/calendario' };
    }
    if (pathToParse.startsWith('/tareas')) {
      return { section: 'inicio', path: '/tareas' };
    }
    if (pathToParse.startsWith('/mapa')) {
      return { section: 'inicio', path: '/mapa' };
    }
    if (pathToParse.startsWith('/mensajes')) {
      return { section: 'inicio', path: '/mensajes' };
    }
    if (pathToParse.startsWith('/favoritos')) {
      return { section: 'inicio', path: '/favoritos' };
    }

    // Rutas de Facturación
    if (pathToParse.startsWith('/facturacion')) {
      return { section: 'facturacion', path: pathToParse };
    }

    // Rutas de Proyectos
    if (pathToParse.startsWith('/proyectos')) {
      return { section: 'proyectos', path: pathToParse };
    }

    // Rutas de Productos
    if (pathToParse.startsWith('/productos')) {
      return { section: 'productos', path: pathToParse };
    }

    // Rutas de RRHH
    if (pathToParse.startsWith('/rrhh')) {
      return { section: 'rrhh', path: pathToParse };
    }

    // Rutas de Empresa
    if (pathToParse.startsWith('/empresa')) {
      return { section: 'empresa', path: pathToParse };
    }

    // Por defecto, si no coincide con nada, es Inicio > Resumen
    return { section: 'inicio', path: '/' };
  }, []);

  // Función para navegar y actualizar la URL
  const navigate = useCallback((newPath: string) => {
    // Parsear la nueva ruta para determinar la sección ANTES de actualizar
    const parsed = parsePath(newPath);
    
    // Actualizar la URL del navegador sin recargar la página
    window.history.pushState({ path: newPath }, '', newPath);
    
    // Actualizar el estado local
    setPath(parsed.path);
    setSection(parsed.section);
  }, [parsePath]);

  // Función para cambiar de sección
  const changeSection = useCallback((newSection: HeaderSection, defaultPath?: string) => {
    const targetPath = defaultPath || (newSection === 'inicio' ? '/' : `/${newSection}`);
    
    // Actualizar la URL del navegador
    window.history.pushState({ path: targetPath, section: newSection }, '', targetPath);
    
    // Actualizar el estado local
    setSection(newSection);
    setPath(targetPath);
  }, []);

  // Escuchar cambios en la URL (navegación del navegador: back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseUrl();
      setSection(parsed.section);
      setPath(parsed.path);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [parseUrl]);

  // Sincronizar con la URL actual al montar (solo una vez)
  // Nota: No necesitamos este useEffect porque ya inicializamos el estado desde parseUrl()
  // en el useState inicial. Esto evita problemas de sincronización y renderizado doble.

  return {
    section,
    path,
    navigate,
    changeSection,
  };
}

