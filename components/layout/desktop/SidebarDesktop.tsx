import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { SidebarHeader } from '../../sidebar/desktop/SidebarHeader';
import { SidebarNavItem } from '../../sidebar/desktop/SidebarNavItem';
import { 
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';
import { sidebarNavigation } from '../../../lib/config/sidebarNavigation';

interface SidebarDesktopProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

/**
 * Versión Desktop del Sidebar (versión original)
 * Esta es la versión por defecto y original del diseño
 */
export function SidebarDesktop({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange
}: SidebarDesktopProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  // Notificar el estado inicial al montar
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, []);

  // Sidebar content - Navigation with all 11 main modules
  const renderSidebarContent = () => {
    return (
      <div className="space-y-0.5">
        {sidebarNavigation.map((item) => (
          <SidebarNavItem
            key={item.path}
            label={item.label}
            icon={item.icon}
            isActive={currentPath === item.path}
            onClick={() => handleNavClick(item.path)}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ 
        x: 0,
        width: isCollapsed ? '80px' : 'var(--sidebar-width)'
      }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`flex flex-col ${className}`}
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        height: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--background-sidebar)',
        borderRight: '1px solid var(--border-soft)',
        zIndex: 999,
      }}
    >
      {/* Logo Header with Toggle */}
      <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Logo variant="icon" animated={false} className="w-6 h-6" />
            <div className="flex items-baseline gap-[0.15em]">
              <span className="text-sm tracking-[0.15em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
              <span className="text-sm tracking-[0.15em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
            </div>
          </motion.div>
        )}
        
        <motion.button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg transition-colors"
          style={{
            color: 'var(--foreground-tertiary)',
            borderRadius: 'var(--radius-md)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
            e.currentTarget.style.color = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--foreground-tertiary)';
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCollapsed ? <IconWrapper icon={Menu} size={16} /> : <IconWrapper icon={X} size={16} />}
        </motion.button>
      </div>

      {/* Main Navigation */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1 overflow-y-auto px-2.5 py-3"
        >
          {renderSidebarContent()}
        </motion.div>
      )}

      {/* User Profile at Bottom */}
      {!isCollapsed && (
        <SidebarHeader
          userName="Andrew Smith"
          userRole="Product Designer"
        />
      )}
    </motion.aside>
  );
}

