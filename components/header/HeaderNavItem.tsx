import { motion } from 'motion/react';

interface HeaderNavItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function HeaderNavItem({ label, isActive = false, onClick }: HeaderNavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative transition-all duration-200 ease-out"
      style={{
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: 'var(--font-weight-medium)',
        color: isActive ? 'var(--foreground)' : 'var(--foreground-tertiary)',
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
    >
      <span className="relative z-10">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="headerActiveIndicator"
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
