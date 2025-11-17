import { motion } from 'motion/react';
import { HeaderNavItem } from '../header/HeaderNavItem';
import { HeaderSearch } from '../header/HeaderSearch';
import { HeaderSection } from '../Header';
import { Menu, Bell } from 'lucide-react';

interface HeaderTabletPortraitProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Versión Tablet Portrait del Header
 * Tiene dos headers:
 * - Header superior: búsqueda, perfil y notificaciones
 * - Header inferior: navegación de secciones
 */
export function HeaderTabletPortrait({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0,
  onMenuClick
}: HeaderTabletPortraitProps) {
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
    <>
      {/* Header Superior: Búsqueda, Perfil y Notificaciones */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="flex items-center justify-between"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--header-height)',
          backgroundColor: 'var(--background-header)',
          borderBottom: '1px solid var(--border-soft)',
          padding: '0 var(--spacing-lg)',
          zIndex: 1001,
        }}
      >
        {/* Left: Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-colors"
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
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-4">
          <HeaderSearch placeholder="Buscar en NEXO AV..." />
        </div>

        {/* Right: Notifications and User Avatar */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            onClick={() => console.log('Notifications')}
            className="relative p-2 rounded-lg transition-colors"
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
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-blue-primary)',
                }}
              >
                <span className="text-[9px] font-medium" style={{ color: 'var(--foreground)' }}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </motion.div>
            )}
          </motion.button>

          {/* User Avatar - Replaces Settings */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(to bottom right, #22d3ee, #a78bfa)', // from-cyan-400 to-violet-400
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
                color: '#000000', // text-black como en desktop
              }}
            >
              A
            </div>
            {/* Online status indicator - Misma estética que desktop */}
            <div 
              className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#22c55e', // bg-green-500
                borderColor: '#18181b', // border-zinc-900
              }}
            />
          </div>
        </div>
      </motion.header>

      {/* Header Inferior: Navegación de Secciones */}
      <motion.header
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
        className="flex items-center justify-center"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--header-height)',
          backgroundColor: 'var(--background-header)',
          borderTop: '1px solid var(--border-soft)',
          padding: '0 var(--spacing-md)',
          zIndex: 1000,
        }}
      >
        {/* Navigation Sections - Centered */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full justify-center">
          {sections.map((section) => (
            <HeaderNavItem
              key={section.id}
              label={section.label}
              isActive={currentSection === section.id}
              onClick={() => handleSectionClick(section.id)}
            />
          ))}
        </nav>
      </motion.header>
    </>
  );
}

