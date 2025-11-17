import { SidebarNavItem } from '../sidebar/SidebarNavItem';
import { 
  LayoutDashboard, 
  Calendar,
  CheckSquare,
  MapPin,
  MessageSquare,
  Star,
  X,
} from 'lucide-react';
import { HeaderSection } from '../Header';
import { Sheet, SheetContent } from '../ui/sheet';

interface SidebarMobileProps {
  className?: string;
  currentPath?: string;
  currentSection?: HeaderSection;
  onNavigate?: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Versión Mobile del Sidebar
 * Usa un Sheet/Drawer de pantalla completa o casi completa
 */
export function SidebarMobile({ 
  className = '', 
  currentPath = '/', 
  currentSection = 'inicio',
  onNavigate,
  isOpen = false,
  onClose
}: SidebarMobileProps) {
  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    if (onClose) {
      onClose();
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
    return null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[280px] sm:w-[320px] p-0"
        style={{
          backgroundColor: 'var(--background-sidebar)',
          borderRight: '1px solid var(--border-soft)',
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-soft)' }}>
            <span style={{ 
              color: 'var(--foreground)', 
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: '18px'
            }}>
              Menú
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--foreground-tertiary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {renderSidebarContent()}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

