"use client";

import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, Settings, Bell, HelpCircle } from 'lucide-react';
import { IconWrapper } from '../icons/desktop/IconWrapper';
import { useState, useEffect, useRef } from 'react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onLogoutClick?: () => void;
}

/**
 * Panel de Perfil de Usuario
 * Muestra información del usuario y opciones de cuenta
 */
export function UserProfile({ 
  isOpen, 
  onClose,
  userName = 'Usuario',
  userEmail = 'usuario@nexoav.com',
  userAvatar,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick,
  onLogoutClick
}: UserProfileProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'Mi Perfil', onClick: onProfileClick },
    { icon: Bell, label: 'Notificaciones', onClick: onNotificationsClick },
    { icon: Settings, label: 'Ajustes', onClick: onSettingsClick },
    { icon: HelpCircle, label: 'Ayuda', onClick: () => console.log('Help') },
    { icon: LogOut, label: 'Cerrar Sesión', onClick: onLogoutClick, isDanger: true },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2"
          style={{
            width: '280px',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'auto',
            overflow: 'hidden',
          }}
        >
          {/* User Info */}
          <div style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
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
                  fontSize: '18px',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {userName}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--foreground-tertiary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {userEmail}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: 'var(--spacing-xs)' }}>
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                    onClose();
                  }
                }}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  color: item.isDanger ? 'var(--accent-red)' : 'var(--foreground-secondary)',
                  transition: 'var(--transition-default)',
                  marginBottom: index < menuItems.length - 1 ? '2px' : '0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                  e.currentTarget.style.color = item.isDanger ? 'var(--accent-red)' : 'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = item.isDanger ? 'var(--accent-red)' : 'var(--foreground-secondary)';
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconWrapper icon={item.icon} size={18} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

