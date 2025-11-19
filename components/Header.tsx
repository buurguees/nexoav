import { HeaderDesktop } from './layout/desktop/HeaderDesktop';

interface HeaderProps {
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Header principal que renderiza la versión apropiada según el breakpoint
 * Simplificado: solo búsqueda, notificaciones y perfil (sin secciones)
 * 
 * TODO: Implementar versiones para mobile, tablet y tablet-horizontal
 */
export function Header({ 
  notificationCount = 0,
  onMenuClick: _onMenuClick
}: HeaderProps) {
  // Por ahora solo renderizamos desktop
  // TODO: Implementar detección de breakpoint y versiones responsivas
  return (
    <HeaderDesktop
      notificationCount={notificationCount}
    />
  );
}