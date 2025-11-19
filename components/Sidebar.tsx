import { SidebarDesktop } from './layout/desktop/SidebarDesktop';

interface SidebarProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Sidebar principal que renderiza la versión apropiada según el breakpoint
 * Desktop es la versión original y por defecto
 * 
 * TODO: Implementar versiones para mobile, tablet y tablet-horizontal
 */
export function Sidebar({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange,
  isOpen: _isOpen,
  onClose: _onClose
}: SidebarProps) {
  // Por ahora solo renderizamos desktop
  // TODO: Implementar detección de breakpoint y versiones responsivas
  return (
    <SidebarDesktop
      className={className}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onCollapseChange={onCollapseChange}
    />
  );
}
