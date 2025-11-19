"use client";

import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { sidebarNavigation, empresaNavigation } from '../../../lib/config/sidebarNavigation';
import { useState, useCallback, useEffect } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface SidebarDesktopProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

interface SidebarNavSubItem {
  label: string;
  path: string;
}

// Componente SidebarNavItem (item simple sin submenús)
function SidebarNavItem({ label, icon, isActive = false, onClick }: { label: string; icon: LucideIcon; isActive?: boolean; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full text-left transition-all duration-200 ease-out group flex items-center"
      style={{
        padding: `var(--spacing-xs) var(--spacing-md)`,
        borderRadius: 'var(--radius-md)',
        gap: 'var(--spacing-md)',
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
      <span className="text-xs font-medium" style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)' }}>{label}</span>
    </motion.button>
  );
}

// Componente SidebarExpandableNavItem (item con submenús)
function SidebarExpandableNavItem({ 
  label, 
  icon, 
  subItems, 
  mainPath,
  isActive = false,
  currentPath = '/',
  onNavigate,
  isExpanded,
  onExpansionChange
}: { 
  label: string; 
  icon: LucideIcon; 
  subItems: SidebarNavSubItem[]; 
  mainPath: string;
  isActive?: boolean;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  isExpanded?: boolean;
  onExpansionChange?: (isExpanded: boolean) => void;
}) {
  const handleExpansionToggle = () => {
    const newExpanded = !isExpanded;
    if (onExpansionChange) {
      onExpansionChange(newExpanded);
    }
  };

  const handleMainClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.chevron-button')) {
      handleExpansionToggle();
      return;
    }
    
    if (onNavigate) {
      onNavigate(mainPath);
    }
  };

  const handleSubItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const hasActiveSubItem = subItems.some(item => currentPath === item.path);
  const isMainPathActive = currentPath === mainPath;

  return (
    <div>
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

/**
 * Versión Desktop del Sidebar
 * Esta es la versión por defecto y original del diseño
 */
export function SidebarDesktop({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange
}: SidebarDesktopProps) {
  // Estado para gestionar qué elementos están expandidos (máximo 2)
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const activeItems: string[] = [];
    sidebarNavigation.forEach(item => {
      if (item.subItems && item.subItems.some(subItem => currentPath === subItem.path)) {
        activeItems.push(item.path);
      }
    });
    if (empresaNavigation.subItems && empresaNavigation.subItems.some(subItem => currentPath === subItem.path)) {
      activeItems.push(empresaNavigation.path);
    }
    return activeItems.slice(0, 2);
  });

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleExpansionChange = useCallback((itemPath: string, isExpanded: boolean) => {
    setExpandedItems(prev => {
      if (isExpanded) {
        if (prev.includes(itemPath)) {
          return prev;
        }
        if (prev.length >= 2) {
          return [prev[1], itemPath];
        }
        return [...prev, itemPath];
      } else {
        return prev.filter(path => path !== itemPath);
      }
    });
  }, []);

  useEffect(() => {
    let parentPath: string | null = null;
    
    for (const item of sidebarNavigation) {
      if (item.subItems && item.subItems.some(subItem => subItem.path === currentPath)) {
        parentPath = item.path;
        break;
      }
    }
    
    if (!parentPath && empresaNavigation.subItems) {
      if (empresaNavigation.subItems.some(subItem => subItem.path === currentPath)) {
        parentPath = empresaNavigation.path;
      }
    }
    
    if (parentPath && !expandedItems.includes(parentPath)) {
      handleExpansionChange(parentPath, true);
    }
  }, [currentPath, expandedItems, handleExpansionChange]);

  const renderSidebarContent = () => {
    return (
      <div className="space-y-0.5">
        {sidebarNavigation.map((item) => {
          if (item.subItems && item.subItems.length > 0) {
            const isExpanded = expandedItems.includes(item.path);
            return (
              <SidebarExpandableNavItem
                key={item.path}
                label={item.label}
                icon={item.icon}
                subItems={item.subItems}
                mainPath={item.path}
                isActive={currentPath === item.path}
                currentPath={currentPath}
                onNavigate={handleNavClick}
                isExpanded={isExpanded}
                onExpansionChange={(expanded) => handleExpansionChange(item.path, expanded)}
              />
            );
          }
          return (
            <SidebarNavItem
              key={item.path}
              label={item.label}
              icon={item.icon}
              isActive={currentPath === item.path}
              onClick={() => handleNavClick(item.path)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ 
        x: 0,
        width: 'var(--sidebar-width)'
      }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={`flex flex-col ${className}`}
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        bottom: 0,
        height: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--background-sidebar)',
        borderRight: '1px solid var(--border-soft)',
        zIndex: 999,
      }}
    >
      {/* Logo Header */}
      <div style={{
        padding: `var(--spacing-md) var(--spacing-lg)`,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--border-soft)',
      }}>
        <Logo variant="icon" animated={false} className="w-6 h-6" />
        <div className="flex items-baseline gap-[0.15em]">
          <span className="text-sm tracking-[0.15em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
          <span className="text-sm tracking-[0.15em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          flex: 1,
          overflowY: 'hidden',
          overflowX: 'hidden',
          padding: `var(--spacing-md) var(--spacing-md)`,
        }}
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Sección Empresa - Parte inferior */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{
          borderTop: '1px solid var(--border-soft)',
          padding: 'var(--spacing-sm) var(--spacing-xs)',
        }}
      >
          <SidebarExpandableNavItem
            label={empresaNavigation.label}
            icon={empresaNavigation.icon}
            subItems={empresaNavigation.subItems || []}
            mainPath={empresaNavigation.path}
            isActive={currentPath === empresaNavigation.path}
            currentPath={currentPath}
            onNavigate={handleNavClick}
            isExpanded={expandedItems.includes(empresaNavigation.path)}
            onExpansionChange={(expanded) => handleExpansionChange(empresaNavigation.path, expanded)}
          />
      </motion.div>

    </motion.aside>
  );
}

