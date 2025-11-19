import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { SidebarNavItem } from '../../sidebar/desktop/SidebarNavItem';
import { SidebarExpandableNavItem } from '../../sidebar/desktop/SidebarExpandableNavItem';
import { sidebarNavigation, empresaNavigation } from '../../../lib/config/sidebarNavigation';
import { useState, useCallback, useEffect } from 'react';

interface SidebarDesktopProps {
  className?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

/**
 * Versión Desktop del Sidebar (versión original)
 * Esta es la versión por defecto y original del diseño
 */
export function SidebarDesktop({ 
  className = '', 
  currentPath = '/', 
  onNavigate,
  onCollapseChange
}: SidebarDesktopProps) {
  // Estado para gestionar qué elementos están expandidos (máximo 2)
  // Usamos un array para mantener el orden FIFO
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Inicializar con los elementos que tienen subitems activos
    const activeItems: string[] = [];
    sidebarNavigation.forEach(item => {
      if (item.subItems && item.subItems.some(subItem => currentPath === subItem.path)) {
        activeItems.push(item.path);
      }
    });
    if (empresaNavigation.subItems && empresaNavigation.subItems.some(subItem => currentPath === subItem.path)) {
      activeItems.push(empresaNavigation.path);
    }
    return activeItems.slice(0, 2); // Máximo 2
  });

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  // Función para manejar la expansión/colapso de elementos
  const handleExpansionChange = useCallback((itemPath: string, isExpanded: boolean) => {
    setExpandedItems(prev => {
      if (isExpanded) {
        // Si se está expandiendo
        if (prev.includes(itemPath)) {
          // Ya está expandido, no hacer nada
          return prev;
        }
        // Si ya hay 2 expandidos, quitar el primero (FIFO)
        if (prev.length >= 2) {
          return [prev[1], itemPath]; // Mantener el segundo y añadir el nuevo
        }
        // Añadir el nuevo
        return [...prev, itemPath];
      } else {
        // Si se está colapsando, simplemente remover
        return prev.filter(path => path !== itemPath);
      }
    });
  }, []);

  // Efecto para expandir automáticamente el elemento padre cuando se navega a un subitem
  useEffect(() => {
    // Buscar si el currentPath corresponde a un subitem
    let parentPath: string | null = null;
    
    // Buscar en sidebarNavigation
    for (const item of sidebarNavigation) {
      if (item.subItems && item.subItems.some(subItem => subItem.path === currentPath)) {
        parentPath = item.path;
        break;
      }
    }
    
    // Si no se encontró, buscar en empresaNavigation
    if (!parentPath && empresaNavigation.subItems) {
      if (empresaNavigation.subItems.some(subItem => subItem.path === currentPath)) {
        parentPath = empresaNavigation.path;
      }
    }
    
    // Si encontramos un padre y no está expandido, expandirlo
    if (parentPath && !expandedItems.includes(parentPath)) {
      handleExpansionChange(parentPath, true);
    }
  }, [currentPath, expandedItems, handleExpansionChange]);

  // Sidebar content - Navigation with all 11 main modules
  const renderSidebarContent = () => {
    return (
      <div className="space-y-0.5">
        {sidebarNavigation.map((item) => {
          // Si tiene submenús, usar el componente expandible
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
          // Si no tiene submenús, usar el componente normal
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
          overflowY: 'hidden', // Sin scroll para evitar scrollbar
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

