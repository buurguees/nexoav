import { useBreakpoint } from '../hooks/useBreakpoint';
import { HeaderDesktop } from './layout/HeaderDesktop';
import { HeaderTablet } from './layout/HeaderTablet';
import { HeaderTabletPortrait } from './layout/HeaderTabletPortrait';
import { HeaderMobile } from './layout/HeaderMobile';

export type HeaderSection = 'inicio' | 'facturacion' | 'proyectos' | 'productos' | 'rrhh' | 'empresa';

interface HeaderProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Header principal que renderiza la versión apropiada según el breakpoint
 * Desktop es la versión original y por defecto
 */
export function Header({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0,
  onMenuClick
}: HeaderProps) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  // Desktop es la versión original
  if (breakpoint === 'desktop') {
    return (
      <HeaderDesktop
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        notificationCount={notificationCount}
      />
    );
  }

  if (breakpoint === 'tablet-portrait') {
    return (
      <HeaderTabletPortrait
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        notificationCount={notificationCount}
        onMenuClick={onMenuClick}
      />
    );
  }

  if (breakpoint === 'tablet') {
    return (
      <HeaderTablet
        currentSection={currentSection}
        onSectionChange={onSectionChange}
        notificationCount={notificationCount}
        onMenuClick={onMenuClick}
      />
    );
  }

  // Mobile
  return (
    <HeaderMobile
      currentSection={currentSection}
      onSectionChange={onSectionChange}
      notificationCount={notificationCount}
      onMenuClick={onMenuClick}
    />
  );
}