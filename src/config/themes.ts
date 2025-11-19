export type ThemeName = 'silk' | 'ocean' | 'coffee' | 'dark';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  colorScheme: 'light' | 'dark';
  colors: {
    // Fondos
    background: string;
    backgroundSecondary: string;
    backgroundSidebar: string;
    backgroundHeader: string;
    // Texto
    foreground: string;
    foregroundSecondary: string;
    foregroundTertiary: string;
    foregroundDisabled: string;
    // Acentos
    accentBluePrimary: string;
    accentBlueHover: string;
    accentBlueLight: string;
    accentPurple: string;
    accentGreenCompleted: string;
    accentGreenHover: string;
    // Estados
    stateInProgress: string;
    statePending: string;
    stateCompleted: string;
    // Bordes
    borderSoft: string;
    borderMedium: string;
    borderHighlight: string;
    // Componentes base
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    inputBackground: string;
    switchBackground: string;
    ring: string;
    // Sidebar
    sidebar: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
    sidebarRing: string;
    // Charts
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
  radius: {
    selector: string;
    field: string;
    box: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
    default: string;
  };
    properties: {
      sizeSelector: string;
      sizeField: string;
      borderWidth: string;
      depth: number;
      noise: number;
    };
}

export const themes: Record<ThemeName, ThemeConfig> = {
  silk: {
    name: 'silk',
    displayName: 'Silk',
    colorScheme: 'light',
    colors: {
      background: 'oklch(97% 0.0035 67.78)',
      backgroundSecondary: 'oklch(95% 0.0081 61.42)',
      backgroundSidebar: 'oklch(90% 0.0081 61.42)',
      backgroundHeader: 'oklch(95% 0.0081 61.42)',
      foreground: 'oklch(40% 0.0081 61.42)',
      foregroundSecondary: 'oklch(50% 0.0081 61.42)',
      foregroundTertiary: 'oklch(60% 0.0081 61.42)',
      foregroundDisabled: 'oklch(70% 0.0081 61.42)',
      accentBluePrimary: 'oklch(23.27% 0.0249 284.3)',
      accentBlueHover: 'oklch(30% 0.0249 284.3)',
      accentBlueLight: 'oklch(50% 0.1148 241.68)',
      accentPurple: 'oklch(23.27% 0.0249 284.3)',
      accentGreenCompleted: 'oklch(83.92% 0.0901 136.87)',
      accentGreenHover: 'oklch(88% 0.0901 136.87)',
      stateInProgress: 'oklch(80.39% 0.1148 241.68)',
      statePending: 'oklch(60% 0.0081 61.42)',
      stateCompleted: 'oklch(83.92% 0.0901 136.87)',
      borderSoft: 'oklch(95% 0.0081 61.42)',
      borderMedium: 'oklch(90% 0.0081 61.42)',
      borderHighlight: 'oklch(85% 0.0081 61.42)',
      card: 'oklch(97% 0.0035 67.78)',
      cardForeground: 'oklch(40% 0.0081 61.42)',
      popover: 'oklch(97% 0.0035 67.78)',
      popoverForeground: 'oklch(40% 0.0081 61.42)',
      primary: 'oklch(23.27% 0.0249 284.3)',
      primaryForeground: 'oklch(94.22% 0.2505 117.44)',
      secondary: 'oklch(23.27% 0.0249 284.3)',
      secondaryForeground: 'oklch(73.92% 0.2135 50.94)',
      muted: 'oklch(90% 0.0081 61.42)',
      mutedForeground: 'oklch(50% 0.0081 61.42)',
      accent: 'oklch(23.27% 0.0249 284.3)',
      accentForeground: 'oklch(88.92% 0.2061 189.9)',
      destructive: 'oklch(75.1% 0.1814 22.37)',
      destructiveForeground: 'oklch(35.1% 0.1814 22.37)',
      border: 'oklch(90% 0.0081 61.42)',
      input: 'oklch(97% 0.0035 67.78)',
      inputBackground: 'oklch(97% 0.0035 67.78)',
      switchBackground: 'oklch(90% 0.0081 61.42)',
      ring: 'oklch(23.27% 0.0249 284.3)',
      sidebar: 'oklch(90% 0.0081 61.42)',
      sidebarForeground: 'oklch(40% 0.0081 61.42)',
      sidebarPrimary: 'oklch(23.27% 0.0249 284.3)',
      sidebarPrimaryForeground: 'oklch(94.22% 0.2505 117.44)',
      sidebarAccent: 'oklch(95% 0.0081 61.42)',
      sidebarAccentForeground: 'oklch(40% 0.0081 61.42)',
      sidebarBorder: 'oklch(90% 0.0081 61.42)',
      sidebarRing: 'oklch(23.27% 0.0249 284.3)',
      chart1: 'oklch(23.27% 0.0249 284.3)',
      chart2: 'oklch(83.92% 0.0901 136.87)',
      chart3: 'oklch(80.39% 0.1148 241.68)',
      chart4: 'oklch(83.92% 0.1085 80)',
      chart5: 'oklch(75.1% 0.1814 22.37)',
    },
    radius: {
      selector: '2rem',
      field: '0.5rem',
      box: '1rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '1rem',
      full: '9999px',
      default: '0.5rem',
    },
    properties: {
      sizeSelector: '0.25rem',
      sizeField: '0.25rem',
      borderWidth: '2px',
      depth: 1,
      noise: 0,
    },
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean',
    colorScheme: 'light',
    colors: {
      background: 'oklch(98% 0.019 200.873)',
      backgroundSecondary: 'oklch(95% 0.045 203.388)',
      backgroundSidebar: 'oklch(91% 0.08 205.041)',
      backgroundHeader: 'oklch(95% 0.045 203.388)',
      foreground: 'oklch(39% 0.07 227.392)',
      foregroundSecondary: 'oklch(45% 0.07 227.392)',
      foregroundTertiary: 'oklch(50% 0.07 227.392)',
      foregroundDisabled: 'oklch(60% 0.07 227.392)',
      accentBluePrimary: 'oklch(0% 0 0)',
      accentBlueHover: 'oklch(10% 0 0)',
      accentBlueLight: 'oklch(78% 0.154 211.53)',
      accentPurple: 'oklch(67% 0.182 276.935)',
      accentGreenCompleted: 'oklch(79% 0.209 151.711)',
      accentGreenHover: 'oklch(85% 0.209 151.711)',
      stateInProgress: 'oklch(78% 0.154 211.53)',
      statePending: 'oklch(52% 0.105 223.128)',
      stateCompleted: 'oklch(79% 0.209 151.711)',
      borderSoft: 'oklch(95% 0.045 203.388)',
      borderMedium: 'oklch(91% 0.08 205.041)',
      borderHighlight: 'oklch(87% 0.08 205.041)',
      card: 'oklch(98% 0.019 200.873)',
      cardForeground: 'oklch(39% 0.07 227.392)',
      popover: 'oklch(98% 0.019 200.873)',
      popoverForeground: 'oklch(39% 0.07 227.392)',
      primary: 'oklch(0% 0 0)',
      primaryForeground: 'oklch(100% 0 0)',
      secondary: 'oklch(67% 0.182 276.935)',
      secondaryForeground: 'oklch(25% 0.09 281.288)',
      muted: 'oklch(91% 0.08 205.041)',
      mutedForeground: 'oklch(45% 0.07 227.392)',
      accent: 'oklch(71% 0.202 349.761)',
      accentForeground: 'oklch(28% 0.109 3.907)',
      destructive: 'oklch(71% 0.194 13.428)',
      destructiveForeground: 'oklch(27% 0.105 12.094)',
      border: 'oklch(91% 0.08 205.041)',
      input: 'oklch(98% 0.019 200.873)',
      inputBackground: 'oklch(98% 0.019 200.873)',
      switchBackground: 'oklch(91% 0.08 205.041)',
      ring: 'oklch(0% 0 0)',
      sidebar: 'oklch(91% 0.08 205.041)',
      sidebarForeground: 'oklch(39% 0.07 227.392)',
      sidebarPrimary: 'oklch(0% 0 0)',
      sidebarPrimaryForeground: 'oklch(100% 0 0)',
      sidebarAccent: 'oklch(95% 0.045 203.388)',
      sidebarAccentForeground: 'oklch(39% 0.07 227.392)',
      sidebarBorder: 'oklch(91% 0.08 205.041)',
      sidebarRing: 'oklch(0% 0 0)',
      chart1: 'oklch(0% 0 0)',
      chart2: 'oklch(79% 0.209 151.711)',
      chart3: 'oklch(78% 0.154 211.53)',
      chart4: 'oklch(82% 0.189 84.429)',
      chart5: 'oklch(71% 0.194 13.428)',
    },
    radius: {
      selector: '0.5rem',
      field: '2rem',
      box: '2rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '2rem',
      full: '9999px',
      default: '0.5rem',
    },
    properties: {
      sizeSelector: '0.25rem',
      sizeField: '0.25rem',
      borderWidth: '1.5px',
      depth: 0,
      noise: 1,
    },
  },
  coffee: {
    name: 'coffee',
    displayName: 'Coffee',
    colorScheme: 'dark',
    colors: {
      background: 'oklch(24% 0.023 329.708)',
      backgroundSecondary: 'oklch(21% 0.021 329.708)',
      backgroundSidebar: 'oklch(16% 0.019 329.708)',
      backgroundHeader: 'oklch(21% 0.021 329.708)',
      foreground: 'oklch(72.354% 0.092 79.129)',
      foregroundSecondary: 'oklch(65% 0.092 79.129)',
      foregroundTertiary: 'oklch(58% 0.092 79.129)',
      foregroundDisabled: 'oklch(50% 0.092 79.129)',
      accentBluePrimary: 'oklch(42.621% 0.074 224.389)',
      accentBlueHover: 'oklch(50% 0.074 224.389)',
      accentBlueLight: 'oklch(79.49% 0.063 184.558)',
      accentPurple: 'oklch(34.465% 0.029 199.194)',
      accentGreenCompleted: 'oklch(74.722% 0.072 131.116)',
      accentGreenHover: 'oklch(80% 0.072 131.116)',
      stateInProgress: 'oklch(79.49% 0.063 184.558)',
      statePending: 'oklch(16.51% 0.015 326.261)',
      stateCompleted: 'oklch(74.722% 0.072 131.116)',
      borderSoft: 'oklch(21% 0.021 329.708)',
      borderMedium: 'oklch(16% 0.019 329.708)',
      borderHighlight: 'oklch(12% 0.019 329.708)',
      card: 'oklch(24% 0.023 329.708)',
      cardForeground: 'oklch(72.354% 0.092 79.129)',
      popover: 'oklch(24% 0.023 329.708)',
      popoverForeground: 'oklch(72.354% 0.092 79.129)',
      primary: 'oklch(71.996% 0.123 62.756)',
      primaryForeground: 'oklch(14.399% 0.024 62.756)',
      secondary: 'oklch(34.465% 0.029 199.194)',
      secondaryForeground: 'oklch(86.893% 0.005 199.194)',
      muted: 'oklch(16% 0.019 329.708)',
      mutedForeground: 'oklch(65% 0.092 79.129)',
      accent: 'oklch(42.621% 0.074 224.389)',
      accentForeground: 'oklch(88.524% 0.014 224.389)',
      destructive: 'oklch(77.318% 0.128 31.871)',
      destructiveForeground: 'oklch(15.463% 0.025 31.871)',
      border: 'oklch(16% 0.019 329.708)',
      input: 'oklch(24% 0.023 329.708)',
      inputBackground: 'oklch(24% 0.023 329.708)',
      switchBackground: 'oklch(16% 0.019 329.708)',
      ring: 'oklch(71.996% 0.123 62.756)',
      sidebar: 'oklch(16% 0.019 329.708)',
      sidebarForeground: 'oklch(72.354% 0.092 79.129)',
      sidebarPrimary: 'oklch(71.996% 0.123 62.756)',
      sidebarPrimaryForeground: 'oklch(14.399% 0.024 62.756)',
      sidebarAccent: 'oklch(21% 0.021 329.708)',
      sidebarAccentForeground: 'oklch(72.354% 0.092 79.129)',
      sidebarBorder: 'oklch(16% 0.019 329.708)',
      sidebarRing: 'oklch(71.996% 0.123 62.756)',
      chart1: 'oklch(71.996% 0.123 62.756)',
      chart2: 'oklch(74.722% 0.072 131.116)',
      chart3: 'oklch(79.49% 0.063 184.558)',
      chart4: 'oklch(88.15% 0.14 87.722)',
      chart5: 'oklch(77.318% 0.128 31.871)',
    },
    radius: {
      selector: '1rem',
      field: '0.5rem',
      box: '1rem',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      xl: '1rem',
      full: '9999px',
      default: '0.5rem',
    },
    properties: {
      sizeSelector: '0.25rem',
      sizeField: '0.25rem',
      borderWidth: '1px',
      depth: 0,
      noise: 0,
    },
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    colorScheme: 'dark',
    colors: {
      background: '#1a1a1a',
      backgroundSecondary: '#2a2a2a',
      backgroundSidebar: '#0f0f0f',
      backgroundHeader: '#1f1f1f',
      foreground: '#FFFFFF',
      foregroundSecondary: '#B4B4B4',
      foregroundTertiary: '#808080',
      foregroundDisabled: '#4D4D4D',
      accentBluePrimary: '#4353FF',
      accentBlueHover: '#5563FF',
      accentBlueLight: '#7B88FF',
      accentPurple: '#9B51E0',
      accentGreenCompleted: '#00C875',
      accentGreenHover: '#00D67F',
      stateInProgress: '#4353FF',
      statePending: '#6C757D',
      stateCompleted: '#00C875',
      borderSoft: '#2a2a2a',
      borderMedium: '#3a3a3a',
      borderHighlight: '#4a4a4a',
      card: '#2a2a2a',
      cardForeground: '#FFFFFF',
      popover: '#2a2a2a',
      popoverForeground: '#FFFFFF',
      primary: '#4353FF',
      primaryForeground: '#FFFFFF',
      secondary: '#2a2a2a',
      secondaryForeground: '#FFFFFF',
      muted: '#3a3a3a',
      mutedForeground: '#B4B4B4',
      accent: '#3a3a3a',
      accentForeground: '#FFFFFF',
      destructive: '#d4183d',
      destructiveForeground: '#ffffff',
      border: '#3a3a3a',
      input: '#2a2a2a',
      inputBackground: '#2a2a2a',
      switchBackground: '#3a3a3a',
      ring: '#4353FF',
      sidebar: '#0f0f0f',
      sidebarForeground: '#FFFFFF',
      sidebarPrimary: '#4353FF',
      sidebarPrimaryForeground: '#FFFFFF',
      sidebarAccent: '#2a2a2a',
      sidebarAccentForeground: '#FFFFFF',
      sidebarBorder: '#2a2a2a',
      sidebarRing: '#4353FF',
      chart1: '#4353FF',
      chart2: '#00C875',
      chart3: '#9B51E0',
      chart4: '#7B88FF',
      chart5: '#5563FF',
    },
    radius: {
      selector: '0.5rem',
      field: '0.5rem',
      box: '0.5rem',
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      full: '9999px',
      default: '6px',
    },
    properties: {
      sizeSelector: '0.25rem',
      sizeField: '0.25rem',
      borderWidth: '1px',
      depth: 0,
      noise: 0,
    },
  },
};

export const defaultTheme: ThemeName = 'silk';

