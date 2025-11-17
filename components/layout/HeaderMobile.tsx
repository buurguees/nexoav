import { motion, AnimatePresence } from 'motion/react';
import { HeaderNavItemIcon } from '../header/HeaderNavItemIcon';
import { HeaderSearch } from '../header/HeaderSearch';
import { HeaderSection } from '../Header';
import { Menu, Bell, Search, X, Home, Receipt, FolderKanban, Package, Users, Building2 } from 'lucide-react';
import { useState } from 'react';
import { IconWrapper } from '../icons/IconWrapper';

interface HeaderMobileProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Versión Mobile del Header
 * Header superior: menú, icono de búsqueda (toggle), notificaciones y avatar
 * Header inferior: navegación de secciones con texto más pequeño
 */
export function HeaderMobile({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0,
  onMenuClick
}: HeaderMobileProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sections: Array<{ id: HeaderSection; label: string; icon: typeof Home }> = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'facturacion', label: 'Facturación', icon: Receipt },
    { id: 'proyectos', label: 'Proyectos', icon: FolderKanban },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'rrhh', label: 'RRHH', icon: Users },
    { id: 'empresa', label: 'Empresa', icon: Building2 },
  ];

  const handleSectionClick = (section: HeaderSection) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <>
      {/* Header Superior: Menú, Búsqueda (toggle), Notificaciones y Avatar */}
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
          padding: '0 var(--spacing-md)',
          zIndex: 1001, // Mayor que el Sheet (z-50) para que el botón de menú siempre funcione
          pointerEvents: 'auto', // Asegurar que los clicks funcionen
        }}
      >
        {/* Left: Menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-colors"
          style={{
            color: 'var(--foreground-tertiary)',
            borderRadius: 'var(--radius-md)',
            pointerEvents: 'auto', // Asegurar que el toggle siempre funcione
            zIndex: 1002, // Mayor que el header para asegurar que siempre sea clickeable
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
          <IconWrapper icon={Menu} size={20} />
        </button>

        {/* Center: Empty space */}
        <div className="flex-1" />

        {/* Right: Search Toggle, Notifications and User Avatar */}
        <div className="flex items-center gap-2">
          {/* Search Toggle or Search Input */}
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-input"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <HeaderSearch placeholder="Buscar en NEXO AV..." size="mobile" />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg transition-colors flex-shrink-0"
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
                  <IconWrapper icon={X} size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchOpen(true)}
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
                <IconWrapper icon={Search} size={20} />
              </motion.button>
            )}
          </AnimatePresence>

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
            <IconWrapper icon={Bell} size={20} />
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

          {/* User Avatar */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(to bottom right, #22d3ee, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                color: '#000000',
              }}
            >
              A
            </div>
            {/* Online status indicator */}
            <div 
              className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#22c55e',
                borderColor: '#18181b',
              }}
            />
          </div>
        </div>
      </motion.header>

      {/* Header Inferior: Navegación de Secciones con texto más pequeño */}
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
          padding: '0 var(--spacing-sm)',
          zIndex: 1002, // Mayor que el Sheet (z-50 = 50) y el overlay para que siempre sea clickeable
          pointerEvents: 'auto', // Asegurar que los clicks funcionen
        }}
      >
        {/* Navigation Sections - Centered with icons only */}
        <nav 
          className="flex items-center gap-1 overflow-x-auto w-full justify-center"
          style={{
            pointerEvents: 'auto', // Asegurar que los clicks funcionen siempre
          }}
        >
          {sections.map((section) => (
            <HeaderNavItemIcon
              key={section.id}
              icon={section.icon}
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
