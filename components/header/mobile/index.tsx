"use client";

import { motion, AnimatePresence } from 'motion/react';
import { HeaderSearch } from './HeaderSearch';
import { HeaderActions } from './HeaderActions';
import { SettingsPanel } from '../../settings/SettingsPanel';
import { Search, X } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';
import { Logo } from '../../Logo';
import { useRouter } from '../../../hooks/useRouter';
import { useState } from 'react';

interface HeaderMobileProps {
  notificationCount?: number;
  onMenuClick?: () => void;
  onNavigate?: (path: string) => void;
}

/**
 * Versión Mobile del Header
 * Optimizado para móviles - más compacto
 */
export function HeaderMobile({ 
  notificationCount = 0,
  onMenuClick,
  onNavigate
}: HeaderMobileProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { navigate: routerNavigate } = useRouter();
  
  // Usar la función de navegación pasada como prop, o la del hook como fallback
  const navigate = onNavigate || routerNavigate;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
      className="flex items-center relative"
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
        margin: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Left Side - Logo (clickeable para ir a inicio) */}
      <motion.button
        onClick={() => navigate('/')}
        className="p-1.5 rounded-lg transition-colors mr-2"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--foreground)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-md)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Logo variant="icon" animated={false} className="w-8 h-8" />
      </motion.button>

      {/* Right Side Actions - Absolute positioned */}
      <div 
        style={{
          position: 'absolute',
          right: 'var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
        }}
      >
        {/* Search Toggle or Search Input */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-input"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <HeaderSearch placeholder="Buscar..." size="mobile" />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                style={{
                  color: 'var(--foreground-tertiary)',
                  borderRadius: 'var(--radius-md)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--foreground-tertiary)';
                }}
              >
                <IconWrapper icon={X} size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--foreground-tertiary)',
                borderRadius: 'var(--radius-md)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--foreground-tertiary)';
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconWrapper icon={Search} size={20} />
            </motion.button>
          )}
        </AnimatePresence>
        
        <HeaderActions 
          notificationCount={notificationCount}
          onNotificationClick={() => console.log('Notifications')}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onProfileClick={() => console.log('Profile')}
          userName="Usuario"
        />
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </motion.header>
  );
}
