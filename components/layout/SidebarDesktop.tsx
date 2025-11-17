import { motion } from 'motion/react';
import { Logo } from '../Logo';
import { SidebarHeader } from '../sidebar/SidebarHeader';
import { SidebarNavItem } from '../sidebar/SidebarNavItem';
import { 
  LayoutDashboard, 
  Calendar,
  CheckSquare,
  MapPin,
  MessageSquare,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { HeaderSection } from '../Header';

interface SidebarDesktopProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
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
  currentSection = 'inicio',
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

  // Sidebar content based on current section
  const renderSidebarContent = () => {
    if (currentSection === 'inicio') {
      return (
        <div className="space-y-0.5">
          <SidebarNavItem
            label="Resumen"
            icon={LayoutDashboard}
            isActive={currentPath === '/'}
            onClick={() => handleNavClick('/')}
          />
          <SidebarNavItem
            label="Calendario"
            icon={Calendar}
            isActive={currentPath === '/calendario'}
            onClick={() => handleNavClick('/calendario')}
          />
          <SidebarNavItem
            label="Tareas"
            icon={CheckSquare}
            isActive={currentPath === '/tareas'}
            onClick={() => handleNavClick('/tareas')}
          />
          <SidebarNavItem
            label="Mapa"
            icon={MapPin}
            isActive={currentPath === '/mapa'}
            onClick={() => handleNavClick('/mapa')}
          />
          <SidebarNavItem
            label="Mensajes"
            icon={MessageSquare}
            isActive={currentPath === '/mensajes'}
            onClick={() => handleNavClick('/mensajes')}
          />
          <SidebarNavItem
            label="Favoritos"
            icon={Star}
            isActive={currentPath === '/favoritos'}
            onClick={() => handleNavClick('/favoritos')}
          />
        </div>
      );
    }
    // TODO: Agregar otros módulos cuando sea necesario
    return null;
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
          >
            <Logo variant="default" animated={false} style={{ color: 'var(--foreground)' }} />
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
          {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Main Navigation */}
      {!isCollapsed && (
        <motion.div
          key={currentSection}
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

