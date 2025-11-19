import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeName, themes, defaultTheme } from '../config/themes';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeConfig: typeof themes[ThemeName];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    // Intentar cargar el tema desde localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      return savedTheme;
    }
    return defaultTheme;
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (themeName: ThemeName) => {
    const themeConfig = themes[themeName];
    const root = document.documentElement;

    // Remover todas las clases de tema existentes
    root.classList.remove('theme-silk', 'theme-ocean', 'theme-coffee', 'theme-dark');

    // Agregar la clase del tema seleccionado
    // globals.css tiene prioridad y define todas las variables CSS
    root.classList.add(`theme-${themeName}`);

    // Aplicar color-scheme
    root.style.colorScheme = themeConfig.colorScheme;

    // Aplicar clase dark según el colorScheme del tema
    if (themeConfig.colorScheme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  };

  // Aplicar tema al montar y cuando cambie
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeConfig: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

