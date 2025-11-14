import { motion } from 'motion/react';
import { HeaderNavItem } from './header/HeaderNavItem';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderActions } from './header/HeaderActions';

export type HeaderSection = 'inicio' | 'facturacion' | 'proyectos' | 'productos' | 'rrhh' | 'empresa';

interface HeaderProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
}

export function Header({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0
}: HeaderProps) {
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
      className="flex items-center justify-center relative"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--background-header)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '0 var(--spacing-2xl)',
      }}
    >
      {/* Navigation Sections - Centered */}
      <nav className="flex items-center gap-1">
        {sections.map((section) => (
          <HeaderNavItem
            key={section.id}
            label={section.label}
            isActive={currentSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </nav>

      {/* Right Side Actions - Absolute positioned */}
      <div className="absolute right-6 flex items-center gap-4">
        <HeaderSearch placeholder="Buscar en NEXO AV..." />
        <HeaderActions 
          notificationCount={notificationCount}
          onNotificationClick={() => console.log('Notifications')}
          onSettingsClick={() => handleSectionClick('empresa')}
        />
      </div>
    </motion.header>
  );
}