import { motion } from 'motion/react';
import { Logo } from '../Logo';
import { SidebarNavItem } from '../sidebar/SidebarNavItem';
import { 
  LayoutDashboard, 
  Calendar,
  CheckSquare,
  MapPin,
  MessageSquare,
  Star,
  FolderKanban,
  Users,
} from 'lucide-react';
import { HeaderSection } from '../Header';

interface SidebarTabletProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Versión Tablet Horizontal del Sidebar
 * Sidebar fijo siempre visible, similar a desktop pero con ancho reducido
 * NO usa Sheet/Drawer - está siempre visible como desktop
 */
export function SidebarTablet({ 
  className = '', 
  currentPath = '/', 
  currentSection = 'inicio',
  onNavigate,
  onCollapseChange,
  isOpen: _isOpen, // No se usa en tablet horizontal (siempre visible)
  onClose: _onClose // No se usa en tablet horizontal (siempre visible)
}: SidebarTabletProps) {
  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

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
    
    if (currentSection === 'proyectos') {
      return (
        <div className="space-y-0.5">
          <SidebarNavItem
            label="Resumen"
            icon={LayoutDashboard}
            isActive={currentPath === '/proyectos'}
            onClick={() => handleNavClick('/proyectos')}
          />
          <SidebarNavItem
            label="Clientes"
            icon={Users}
            isActive={currentPath === '/proyectos/clientes'}
            onClick={() => handleNavClick('/proyectos/clientes')}
          />
          <SidebarNavItem
            label="Proyectos"
            icon={FolderKanban}
            isActive={currentPath === '/proyectos/listado'}
            onClick={() => handleNavClick('/proyectos/listado')}
          />
          <SidebarNavItem
            label="Tareas"
            icon={CheckSquare}
            isActive={currentPath === '/proyectos/tareas'}
            onClick={() => handleNavClick('/proyectos/tareas')}
          />
          <SidebarNavItem
            label="Calendario"
            icon={Calendar}
            isActive={currentPath === '/proyectos/calendario'}
            onClick={() => handleNavClick('/proyectos/calendario')}
          />
          <SidebarNavItem
            label="Mapa"
            icon={MapPin}
            isActive={currentPath === '/proyectos/mapa'}
            onClick={() => handleNavClick('/proyectos/mapa')}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`flex flex-col ${className}`}
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width-tablet-horizontal)', // 200px según tablet-horizontal.css
        height: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--background-sidebar)',
        borderRight: '1px solid var(--border-soft)',
        zIndex: 999,
      }}
    >
      {/* Logo Header */}
      <div className="px-4 py-3 flex items-center justify-center gap-2" style={{ borderBottom: '1px solid var(--border-soft)', color: 'var(--foreground)' }}>
        <Logo variant="icon" animated={false} className="w-6 h-6" />
        <div className="flex items-baseline gap-[0.15em]">
          <span className="text-sm tracking-[0.15em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
          <span className="text-sm tracking-[0.15em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        {renderSidebarContent()}
      </div>
    </motion.aside>
  );
}

