import { useBreakpoint } from '../hooks/useBreakpoint';
import { SidebarDesktop } from './layout/SidebarDesktop';
import { SidebarTablet } from './layout/SidebarTablet';
import { SidebarTabletPortrait } from './layout/SidebarTabletPortrait';
import { SidebarMobile } from './layout/SidebarMobile';
import { HeaderSection } from './Header';

interface SidebarProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar principal que renderiza la versión apropiada según el breakpoint
 * Desktop es la versión original y por defecto
 */
export function Sidebar({ 
  className = '', 
  currentPath = '/', 
  currentSection = 'inicio',
  onNavigate,
  onCollapseChange,
  isOpen = false,
  onClose
}: SidebarProps) {
  const breakpoint = useBreakpoint();

  // Renderizar versión según breakpoint
  // Desktop es la versión original
  if (breakpoint === 'desktop') {
    return (
      <SidebarDesktop
        className={className}
        currentPath={currentPath}
        currentSection={currentSection}
        onNavigate={onNavigate}
        onCollapseChange={onCollapseChange}
      />
    );
  }

  if (breakpoint === 'tablet-portrait') {
    return (
      <SidebarTabletPortrait
        className={className}
        currentPath={currentPath}
        currentSection={currentSection}
        onNavigate={onNavigate}
      />
    );
  }

  if (breakpoint === 'tablet') {
    return (
      <SidebarTablet
        className={className}
        currentPath={currentPath}
        currentSection={currentSection}
        onNavigate={onNavigate}
        isOpen={isOpen}
        onClose={onClose}
      />
    );
  }

  // Mobile
  return (
    <SidebarMobile
      className={className}
      currentPath={currentPath}
      currentSection={currentSection}
      onNavigate={onNavigate}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
