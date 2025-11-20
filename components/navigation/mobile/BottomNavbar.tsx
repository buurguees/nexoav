"use client";

import { motion } from 'motion/react';
import { Calendar, FolderKanban, Receipt, ShoppingCart, MoreHorizontal } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface BottomNavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

/**
 * Navbar inferior para Mobile
 * Muestra los elementos principales de navegación en la parte inferior
 */
export function BottomNavbar({ currentPath = '/', onNavigate }: BottomNavbarProps) {
  const navItems = [
    {
      label: 'Calendario',
      path: '/calendario',
      icon: Calendar,
    },
    {
      label: 'Proyectos',
      path: '/proyectos',
      icon: FolderKanban,
    },
    {
      label: 'Facturación',
      path: '/facturacion',
      icon: Receipt,
    },
    {
      label: 'Gastos',
      path: '/gastos',
      icon: ShoppingCart,
    },
    {
      label: 'Más',
      path: '/more',
      icon: MoreHorizontal,
    },
  ];

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'var(--background-header)',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 var(--spacing-xs)',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      {navItems.map((item) => {
        const isActive = currentPath === item.path || 
          (item.path !== '/more' && currentPath.startsWith(item.path));
        
        return (
          <motion.button
            key={item.path}
            onClick={() => {
              if (onNavigate && item.path !== '/more') {
                onNavigate(item.path);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: 'var(--spacing-xs)',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              border: 'none',
              cursor: item.path === '/more' ? 'default' : 'pointer',
              color: isActive ? 'var(--foreground)' : 'var(--foreground-tertiary)',
              flex: 1,
              minWidth: 0,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive && item.path !== '/more') {
                e.currentTarget.style.color = 'var(--foreground)';
                e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && item.path !== '/more') {
                e.currentTarget.style.color = 'var(--foreground-tertiary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
            whileHover={item.path !== '/more' ? { scale: 1.05 } : {}}
            whileTap={item.path !== '/more' ? { scale: 0.95 } : {}}
          >
            <IconWrapper 
              icon={item.icon} 
              size={20} 
              isActive={isActive}
            />
            <span 
              style={{ 
                fontSize: '10px',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

