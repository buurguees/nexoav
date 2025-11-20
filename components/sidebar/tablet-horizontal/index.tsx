"use client";

import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../Logo';
import { sidebarNavigation, empresaNavigation } from '../../../lib/config/sidebarNavigation';
import { useState, useCallback, useEffect } from 'react';
import { LucideIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';
import { useSidebar } from '../../../src/contexts/SidebarContext';

interface SidebarTabletHorizontalProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean; // Estado inicial del sidebar desde App.tsx
}

interface SidebarNavSubItem {
  label: string;
  path: string;
}

// Componente SidebarNavItem (item simple sin submenús)
function SidebarNavItem({ 
  label, 
  icon, 
  isActive = false, 
  onClick,
  isCollapsed = false
}: { 
  label: string; 
  icon: LucideIcon; 
  isActive?: boolean; 
  onClick?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full text-left transition-all duration-200 ease-out group flex items-center justify-center"
      style={{
        padding: `var(--spacing-xs) ${isCollapsed ? 'var(--spacing-xs)' : 'var(--spacing-md)'}`,
        borderRadius: 'var(--radius-md)',
        gap: isCollapsed ? '0' : 'var(--spacing-md)',
        height: '32px',
        backgroundColor: isActive ? 'var(--background-secondary)' : 'transparent',
        color: isActive ? 'var(--foreground)' : 'var(--foreground-tertiary)',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
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
      whileHover={{ x: isCollapsed ? 0 : 2 }}
      whileTap={{ scale: 0.98 }}
      title={isCollapsed ? label : undefined}
    >
      <IconWrapper 
        icon={icon} 
        size={16} 
        isActive={isActive}
        className="flex-shrink-0"
      />
      {!isCollapsed && (
        <motion.span 
          className="text-xs font-medium" 
          style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)' }}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}

// Componente SidebarExpandableNavItem (item con submenús)
function SidebarExpandableNavItem({ 
  label, 
  icon, 
  subItems, 
  mainPath,
  currentPath = '/',
  onNavigate,
  isExpanded,
  onExpansionChange,
  isCollapsed = false
}: { 
  label: string; 
  icon: LucideIcon; 
  subItems: SidebarNavSubItem[]; 
  mainPath: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  isExpanded?: boolean;
  onExpansionChange?: (isExpanded: boolean) => void;
  isCollapsed?: boolean;
}) {
  const handleExpansionToggle = () => {
    if (isCollapsed) return; // No permitir expansión cuando está colapsado
    const newExpanded = !isExpanded;
    if (onExpansionChange) {
      onExpansionChange(newExpanded);
    }
  };

  const handleMainClick = (e: React.MouseEvent) => {
    if (isCollapsed) {
      // Cuando está colapsado, solo navegar a la ruta principal
      if (onNavigate) {
        onNavigate(mainPath);
      }
      return;
    }

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
          padding: `var(--spacing-xs) ${isCollapsed ? 'var(--spacing-xs)' : 'var(--spacing-md)'}`,
          borderRadius: 'var(--radius-md)',
          gap: isCollapsed ? '0' : 'var(--spacing-md)',
          height: '32px',
          backgroundColor: (isMainPathActive || hasActiveSubItem) ? 'var(--background-secondary)' : 'transparent',
          color: (isMainPathActive || hasActiveSubItem) ? 'var(--foreground)' : 'var(--foreground-tertiary)',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
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
        whileHover={{ x: isCollapsed ? 0 : 2 }}
        whileTap={{ scale: 0.98 }}
        title={isCollapsed ? label : undefined}
      >
        <IconWrapper 
          icon={icon} 
          size={16} 
          isActive={isMainPathActive || hasActiveSubItem}
          className="flex-shrink-0"
        />
        {!isCollapsed && (
          <>
            <motion.span 
              className="text-xs font-medium flex-1" 
              style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)' }}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              {label}
            </motion.span>
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
          </>
        )}
      </motion.button>

      {/* Solo mostrar subitems si NO está colapsado */}
      {!isCollapsed && (
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
      )}
    </div>
  );
}

/**
 * Versión Tablet Horizontal del Sidebar
 * Incluye funcionalidad de toggle para colapsar/expandir
 */
export function SidebarTabletHorizontal({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange,
  isOpen: _isOpen = false,
  onClose,
  isCollapsed: externalIsCollapsed = false
}: SidebarTabletHorizontalProps) {
  const [isCollapsed, setIsCollapsed] = useState(externalIsCollapsed);
  
  // Sincronizar el estado interno con el estado externo
  useEffect(() => {
    setIsCollapsed(externalIsCollapsed);
  }, [externalIsCollapsed]);
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const activeItems: string[] = [];
    sidebarNavigation.forEach((item: typeof sidebarNavigation[0]) => {
      if (item.subItems && item.subItems.some((subItem: { path: string }) => currentPath === subItem.path)) {
        activeItems.push(item.path);
      }
    });
    if (empresaNavigation.subItems && empresaNavigation.subItems.some((subItem: { path: string }) => currentPath === subItem.path)) {
      activeItems.push(empresaNavigation.path);
    }
    return activeItems.slice(0, 2);
  });

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
    // Si se colapsa, cerrar todos los submenús
    if (newCollapsed) {
      setExpandedItems([]);
    }
  };

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    // Cerrar el sidebar automáticamente al navegar en tablet
    if (onClose) {
      onClose();
    }
  };

  const handleExpansionChange = useCallback((itemPath: string, isExpanded: boolean) => {
    if (isCollapsed) return; // No permitir expansión cuando está colapsado
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
  }, [isCollapsed]);

  useEffect(() => {
    if (isCollapsed) return; // No expandir automáticamente cuando está colapsado
    
    let parentPath: string | null = null;
    
    for (const item of sidebarNavigation) {
      if (item.subItems && item.subItems.some((subItem: { path: string }) => subItem.path === currentPath)) {
        parentPath = item.path;
        break;
      }
    }
    
    if (!parentPath && empresaNavigation.subItems) {
      if (empresaNavigation.subItems.some((subItem: { path: string }) => subItem.path === currentPath)) {
        parentPath = empresaNavigation.path;
      }
    }
    
    if (parentPath && !expandedItems.includes(parentPath)) {
      handleExpansionChange(parentPath, true);
    }
  }, [currentPath, expandedItems, handleExpansionChange, isCollapsed]);

  const renderSidebarContent = () => {
    return (
      <div className="space-y-0.5">
        {sidebarNavigation.map((item: typeof sidebarNavigation[0]) => {
          if (item.subItems && item.subItems.length > 0) {
            const isExpanded = expandedItems.includes(item.path);
            return (
              <SidebarExpandableNavItem
                key={item.path}
                label={item.label}
                icon={item.icon}
                subItems={item.subItems}
                mainPath={item.path}
                currentPath={currentPath}
                onNavigate={handleNavClick}
                isExpanded={isExpanded}
                onExpansionChange={(expanded) => handleExpansionChange(item.path, expanded)}
                isCollapsed={isCollapsed}
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
              isCollapsed={isCollapsed}
            />
          );
        })}
      </div>
    );
  };

  // Usar el ancho del contexto del sidebar para tablet horizontal (200px expandido, 64px colapsado)
  const { sidebarWidth: contextSidebarWidth } = useSidebar();
  const sidebarWidth = `${contextSidebarWidth}px`;

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ 
        x: 0,
        width: sidebarWidth
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
      {/* Logo Header con botón de toggle */}
      <div style={{
        padding: `var(--spacing-md) ${isCollapsed ? 'var(--spacing-md)' : 'var(--spacing-lg)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--border-soft)',
        justifyContent: isCollapsed ? 'center' : 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <Logo variant="icon" animated={false} className="w-6 h-6" />
          {!isCollapsed && (
            <motion.div 
              className="flex items-baseline gap-[0.15em]"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
            >
              <span className="text-sm tracking-[0.15em] font-light" style={{ color: 'var(--foreground)' }}>NEXO</span>
              <span className="text-sm tracking-[0.15em] font-extralight" style={{ color: 'var(--foreground-tertiary)' }}>AV</span>
            </motion.div>
          )}
        </div>
        {!isCollapsed && (
          <motion.button
            onClick={handleToggle}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--foreground-tertiary)',
              borderRadius: 'var(--radius-sm)',
            }}
            whileHover={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)' }}
            whileTap={{ scale: 0.95 }}
            title="Colapsar sidebar"
          >
            <ChevronLeft size={16} />
          </motion.button>
        )}
      </div>

      {/* Botón de toggle cuando está colapsado */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: 'var(--spacing-sm)',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <motion.button
            onClick={handleToggle}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--foreground-tertiary)',
              borderRadius: 'var(--radius-sm)',
            }}
            whileHover={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)' }}
            whileTap={{ scale: 0.95 }}
            title="Expandir sidebar"
          >
            <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      )}

      {/* Main Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          flex: 1,
          overflowY: 'hidden',
          overflowX: 'hidden',
          padding: `var(--spacing-md) ${isCollapsed ? 'var(--spacing-xs)' : 'var(--spacing-md)'}`,
        }}
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Sección Empresa - Parte inferior */}
      {!isCollapsed && (
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
            currentPath={currentPath}
            onNavigate={handleNavClick}
            isExpanded={expandedItems.includes(empresaNavigation.path)}
            onExpansionChange={(expanded) => handleExpansionChange(empresaNavigation.path, expanded)}
            isCollapsed={isCollapsed}
          />
        </motion.div>
      )}

      {/* Sección Empresa cuando está colapsado - solo icono */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            borderTop: '1px solid var(--border-soft)',
            padding: 'var(--spacing-sm) var(--spacing-xs)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SidebarNavItem
            label={empresaNavigation.label}
            icon={empresaNavigation.icon}
            isActive={currentPath === empresaNavigation.path || empresaNavigation.subItems?.some((subItem: { path: string }) => currentPath === subItem.path)}
            onClick={() => handleNavClick(empresaNavigation.path)}
            isCollapsed={isCollapsed}
          />
        </motion.div>
      )}

    </motion.aside>
  );
}

