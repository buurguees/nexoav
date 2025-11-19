import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface HeaderNavItemIconProps {
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
  label?: string; // Para tooltip/accessibility
}

/**
 * Versión Mobile del HeaderNavItem con solo iconos
 * Optimizado para ahorrar espacio en móviles
 */
export function HeaderNavItemIcon({ icon, isActive = false, onClick, label }: HeaderNavItemIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative transition-all duration-200 ease-out"
      style={{
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: 'var(--font-weight-medium)',
        color: isActive ? 'var(--foreground)' : 'var(--foreground-tertiary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        pointerEvents: 'auto', // Asegurar que los clicks funcionen siempre
        zIndex: 1003, // Mayor que el navbar (1002) para asegurar que los clicks funcionen
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--foreground-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = 'var(--foreground-tertiary)';
        }
      }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      title={label} // Tooltip para accesibilidad
    >
      <IconWrapper 
        icon={icon} 
        size={20} 
        isActive={isActive}
      />
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="headerActiveIndicatorIcon"
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '2px',
            backgroundColor: 'var(--accent-blue-primary)',
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      
      {/* Hover effect */}
      {!isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '2px',
            backgroundColor: 'var(--accent-blue-primary)',
            opacity: 0.3,
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
}

