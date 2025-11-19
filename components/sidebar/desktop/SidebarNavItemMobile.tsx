import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface SidebarNavItemMobileProps {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * Versión Mobile del SidebarNavItem
 * Texto más pequeño para móviles
 */
export function SidebarNavItemMobile({ label, icon, isActive = false, onClick }: SidebarNavItemMobileProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full text-left transition-all duration-200 ease-out group flex items-center"
      style={{
        padding: '6px 8px', // Reducido padding horizontal de 10px a 8px
        borderRadius: 'var(--radius-md)',
        gap: '8px',
        height: '32px',
        backgroundColor: isActive ? 'var(--background-secondary)' : 'transparent',
        color: isActive ? 'var(--foreground)' : 'var(--foreground-tertiary)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
          e.currentTarget.style.color = 'var(--foreground)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--foreground-tertiary)';
        }
      }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconWrapper 
        icon={icon} 
        size={16} 
        isActive={isActive}
        className="flex-shrink-0"
      />
      <span className="text-xs font-medium" style={{ fontSize: '12px', fontWeight: 'var(--font-weight-medium)' }}>{label}</span>
    </motion.button>
  );
}

