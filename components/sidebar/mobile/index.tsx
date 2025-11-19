"use client";

interface SidebarMobileProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Versión Mobile del Sidebar
 * TODO: Implementar diseño específico para mobile
 */
export function SidebarMobile({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange,
  isOpen = false,
  onClose
}: SidebarMobileProps) {
  // Por ahora usa la misma implementación que desktop
  // TODO: Implementar diseño específico para mobile
  return (
    <div className={className} style={{ padding: 'var(--spacing-lg)' }}>
      <p style={{ color: 'var(--foreground-secondary)' }}>Sidebar Mobile - En desarrollo</p>
    </div>
  );
}

