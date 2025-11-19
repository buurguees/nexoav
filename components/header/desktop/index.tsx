"use client";

import { motion, AnimatePresence } from 'motion/react';
import { HeaderSearch } from './HeaderSearch';
import { HeaderActions } from './HeaderActions';
import { SettingsPanel } from '../../settings/SettingsPanel';
import { Search, X } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';
import { useState } from 'react';

interface HeaderDesktopProps {
  notificationCount?: number;
}

/**
 * Versión Desktop del Header (simplificado)
 * Solo búsqueda, notificaciones y perfil (sin secciones)
 */
export function HeaderDesktop({ 
  notificationCount = 0
}: HeaderDesktopProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="flex items-center relative"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--header-height)',
        backgroundColor: 'var(--background-header)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '0 var(--spacing-2xl)',
        zIndex: 1000,
      }}
    >
      {/* Right Side Actions - Absolute positioned */}
      <div 
        style={{
          position: 'absolute',
          right: 'var(--spacing-2xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
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
              <HeaderSearch placeholder="Buscar en NEXO AV..." size="mobile" />
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

