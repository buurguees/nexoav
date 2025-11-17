import { motion } from 'motion/react';
import { HeaderNavItem } from '../header/HeaderNavItem';
import { HeaderSearch } from '../header/HeaderSearch';
import { HeaderActions } from '../header/HeaderActions';
import { HeaderSection } from '../Header';

interface HeaderTabletProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Versión Tablet del Header
 * Adaptación del header para tablets (768px - 1024px)
 */
export function HeaderTablet({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0,
  onMenuClick
}: HeaderTabletProps) {
  const sections: Array<{ id: HeaderSection; label: string }> = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'facturacion', label: 'Facturación' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'productos', label: 'Productos' },
    { id: 'rrhh', label: 'RRHH' },
    { id: 'empresa', label: 'Empresa' },
  ];

  const handleSectionClick = (section: HeaderSection) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="flex items-center justify-between relative"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'var(--background-header)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '0 var(--spacing-lg)',
        zIndex: 1000,
      }}
    >
      {/* Left: Empty space - Menu button removed for tablet */}
      <div className="flex items-center gap-3" style={{ width: '0', minWidth: '0' }}>
      </div>

      {/* Center: Navigation Sections - Reduced gap */}
      <nav className="flex items-center gap-0.5 flex-1 justify-center">
        {sections.map((section) => (
          <HeaderNavItem
            key={section.id}
            label={section.label}
            isActive={currentSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        <HeaderSearch placeholder="Buscar..." />
        <HeaderActions 
          notificationCount={notificationCount}
          onNotificationClick={() => console.log('Notifications')}
          onSettingsClick={() => handleSectionClick('empresa')}
        />
      </div>
    </motion.header>
  );
}

