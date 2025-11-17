import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { IconWrapper } from '../icons/IconWrapper';

interface SidebarNavItemProps {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarNavItem({ label, icon, isActive = false, onClick }: SidebarNavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full text-left transition-all duration-200 ease-out group flex items-center"
      style={{
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        gap: '10px',
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
      <span className="text-xs font-medium" style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)' }}>{label}</span>
    </motion.button>
  );
}