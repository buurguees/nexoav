import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface SidebarNavSubItem {
  label: string;
  path: string;
}

interface SidebarExpandableNavItemProps {
  label: string;
  icon: LucideIcon;
  subItems: SidebarNavSubItem[];
  mainPath: string; // Ruta principal del elemento (ej: '/proveedores')
  isActive?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  defaultExpanded?: boolean;
  isExpanded?: boolean; // Control externo de expansión
  onExpansionChange?: (isExpanded: boolean) => void; // Callback cuando cambia la expansión
}

export function SidebarExpandableNavItem({ 
  label, 
  icon, 
  subItems, 
  mainPath,
  isActive = false,
  currentPath = '/',
  onNavigate,
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onExpansionChange
}: SidebarExpandableNavItemProps) {
  // Si hay control externo, usar ese estado; si no, usar estado interno
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded || subItems.some(item => currentPath === item.path));
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  // Verificar si algún subitem está activo
  const hasActiveSubItem = subItems.some(item => currentPath === item.path);
  // Verificar si la ruta principal está activa
  const isMainPathActive = currentPath === mainPath;

  const handleExpansionToggle = () => {
    const newExpanded = !isExpanded;
    if (onExpansionChange) {
      // Si hay control externo, notificar al padre
      onExpansionChange(newExpanded);
    } else {
      // Si no hay control externo, usar estado interno
      setInternalExpanded(newExpanded);
    }
  };

  const handleMainClick = (e: React.MouseEvent) => {
    // Si se hace clic en el chevron, solo expandir/colapsar
    const target = e.target as HTMLElement;
    if (target.closest('.chevron-button')) {
      handleExpansionToggle();
      return;
    }
    
    // Si se hace clic en el elemento principal, navegar a la ruta principal
    if (onNavigate) {
      onNavigate(mainPath);
    }
  };

  const handleSubItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div>
      {/* Main Item */}
      <motion.button
        onClick={handleMainClick}
        className="relative w-full text-left transition-all duration-200 ease-out group flex items-center"
        style={{
          padding: `var(--spacing-xs) var(--spacing-md)`,
          borderRadius: 'var(--radius-md)',
          gap: 'var(--spacing-md)',
          height: '32px',
          backgroundColor: (isMainPathActive || hasActiveSubItem) ? 'var(--background-secondary)' : 'transparent',
          color: (isMainPathActive || hasActiveSubItem) ? 'var(--foreground)' : 'var(--foreground-tertiary)',
        }}
        onMouseEnter={(e) => {
          if (!isMainPathActive && !hasActiveSubItem) {
            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
            e.currentTarget.style.color = 'var(--foreground)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMainPathActive && !hasActiveSubItem) {
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
          isActive={isMainPathActive || hasActiveSubItem}
          className="flex-shrink-0"
        />
        <span className="text-xs font-medium flex-1" style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)' }}>
          {label}
        </span>
        <motion.div
          className="chevron-button"
          onClick={(e) => {
            e.stopPropagation();
            handleExpansionToggle();
          }}
          style={{
            flexShrink: 0,
            background: 'transparent',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleExpansionToggle();
            }
          }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} style={{ color: 'var(--foreground-tertiary)' }} />
          </motion.div>
        </motion.div>
      </motion.button>

      {/* Sub Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
            style={{ marginTop: 'var(--spacing-xs)' }}
          >
            <div style={{ 
              marginLeft: '28px', 
              paddingLeft: 'var(--spacing-md)',
              borderLeft: '1px solid var(--border-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              {subItems.map((item, index) => {
                const isSubItemActive = currentPath === item.path;
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleSubItemClick(item.path)}
                    className="relative w-full text-left transition-all duration-200 ease-out group flex items-center"
                    style={{
                      padding: `var(--spacing-xs) var(--spacing-sm)`,
                      borderRadius: 'var(--radius-sm)',
                      height: '28px',
                      backgroundColor: isSubItemActive ? 'var(--background-secondary)' : 'transparent',
                      color: isSubItemActive ? 'var(--foreground)' : 'var(--foreground-tertiary)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubItemActive) {
                        e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                        e.currentTarget.style.color = 'var(--foreground)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubItemActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--foreground-tertiary)';
                      }
                    }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xs" style={{ fontSize: '13px', fontWeight: 'var(--font-weight-medium)' }}>
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

