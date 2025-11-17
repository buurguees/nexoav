import { motion } from 'motion/react';
import { HeaderActions } from '../header/HeaderActions';
import { HeaderSection } from '../Header';
import { Menu } from 'lucide-react';

interface HeaderMobileProps {
  currentSection?: HeaderSection;
  onSectionChange?: (section: HeaderSection) => void;
  notificationCount?: number;
  onMenuClick?: () => void;
}

/**
 * Versión Mobile del Header
 * Versión simplificada para móviles (< 768px)
 */
export function HeaderMobile({ 
  currentSection = 'inicio', 
  onSectionChange,
  notificationCount = 0,
  onMenuClick
}: HeaderMobileProps) {
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
        zIndex: 1000,
      }}
    >
      {/* Left: Menu button */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg transition-colors"
        style={{
          color: 'var(--foreground)',
          borderRadius: 'var(--radius-md)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Current Section Title */}
      <div className="flex-1 text-center">
        <span style={{ 
          fontSize: '14px', 
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--foreground)'
        }}>
          {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
        </span>
      </div>

      {/* Right: Actions only */}
      <div className="flex items-center gap-2">
        <HeaderActions 
          notificationCount={notificationCount}
          onNotificationClick={() => console.log('Notifications')}
          onSettingsClick={() => handleSectionClick('empresa')}
        />
      </div>
    </motion.header>
  );
}

