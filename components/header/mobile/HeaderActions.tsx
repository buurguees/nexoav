"use client";

import { motion } from 'motion/react';
import { Bell, Settings } from 'lucide-react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface HeaderActionsProps {
  notificationCount?: number;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  userName?: string;
  userAvatar?: string;
}

/**
 * Versión Mobile de HeaderActions
 * Optimizado para móviles - iconos más grandes y sin texto
 */
export function HeaderActions({ 
  notificationCount = 0, 
  onNotificationClick, 
  onSettingsClick,
  onProfileClick,
  userName = 'Usuario',
  userAvatar
}: HeaderActionsProps) {
  return (
    <div className="flex items-center" style={{ gap: 'var(--spacing-xs)' }}>
      {/* Notifications */}
      <motion.button
        onClick={onNotificationClick}
        style={{
          position: 'relative',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--foreground-tertiary)',
          transition: 'var(--transition-default)',
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
        <IconWrapper icon={Bell} size={20} />
        {notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '18px',
              height: '18px',
              backgroundColor: 'var(--accent-blue-primary)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--primary-foreground)',
            }}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Settings */}
      <motion.button
        onClick={onSettingsClick}
        style={{
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--foreground-tertiary)',
          transition: 'var(--transition-default)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
          e.currentTarget.style.color = 'var(--foreground)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--foreground-tertiary)';
        }}
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper icon={Settings} size={20} />
      </motion.button>

      {/* User Profile - Solo avatar en mobile */}
      <motion.button
        onClick={onProfileClick}
        style={{
          position: 'relative',
          padding: '2px',
          borderRadius: 'var(--radius-md)',
          transition: 'var(--transition-default)',
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
        <div style={{
          position: 'relative',
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--accent-blue-light), var(--accent-purple))',
          flexShrink: 0,
        }}>
          {userAvatar ? (
            <img src={userAvatar} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--foreground)',
              fontSize: '12px',
              fontWeight: 'var(--font-weight-medium)',
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Online status indicator */}
        <div style={{
          position: 'absolute',
          right: '0',
          bottom: '0',
          width: '10px',
          height: '10px',
          backgroundColor: 'var(--accent-green-completed)',
          borderRadius: 'var(--radius-full)',
          border: '2px solid var(--background-header)',
        }} />
      </motion.button>
    </div>
  );
}

