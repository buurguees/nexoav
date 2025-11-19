import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserThemePreferences {
  theme: ThemeMode;
  // Aquí se pueden añadir más preferencias en el futuro
  // accentColor?: string;
  // fontSize?: 'small' | 'medium' | 'large';
}

/**
 * Hook para gestionar el tema de la aplicación
 * Preparado para integración con backend
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Intentar cargar desde localStorage
    const saved = localStorage.getItem('user-theme-preference');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserThemePreferences;
        return parsed.theme;
      } catch {
        // Si hay error, usar 'system' por defecto
      }
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  // Función para aplicar el tema al documento
  const applyTheme = (themeToApply: 'light' | 'dark') => {
    const root = document.documentElement;
    if (themeToApply === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Función para guardar preferencias (preparada para backend)
  const saveThemePreference = async (newTheme: ThemeMode) => {
    const preferences: UserThemePreferences = {
      theme: newTheme,
    };

    // Guardar en localStorage (temporal, hasta que tengamos backend)
    localStorage.setItem('user-theme-preference', JSON.stringify(preferences));

    // TODO: Cuando tengamos backend, descomentar esto:
    // try {
    //   await fetch('/api/user/preferences', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(preferences),
    //   });
    // } catch (error) {
    //   console.error('Error al guardar preferencias:', error);
    //   // Mantener en localStorage como fallback
    // }
  };

  // Función para cambiar el tema
  const changeTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveThemePreference(newTheme);

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);
    } else {
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    }
  };

  // Efecto para aplicar el tema inicial
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Efecto para escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    changeTheme,
  };
}

