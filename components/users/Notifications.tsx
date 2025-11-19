"use client";

import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Clock } from 'lucide-react';
import { IconWrapper } from '../icons/desktop/IconWrapper';
import { useState, useEffect, useRef } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

/**
 * Panel de Notificaciones
 * Muestra todas las notificaciones del usuario
 */
export function Notifications({ 
  isOpen, 
  onClose,
  notifications = []
}: NotificationsProps) {
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
            width: '360px',
            maxHeight: '500px',
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            pointerEvents: 'auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <IconWrapper icon={Bell} size={20} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
              }}>
                Notificaciones
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
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
            >
              <IconWrapper icon={X} size={16} />
            </button>
          </div>

          {/* Notifications List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-sm)',
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                color: 'var(--foreground-tertiary)',
              }}>
                <IconWrapper icon={Bell} size={32} />
                <p style={{ marginTop: 'var(--spacing-md)', fontSize: '14px' }}>
                  No hay notificaciones
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-xs)',
                    backgroundColor: notification.read ? 'transparent' : 'var(--background-secondary)',
                    border: '1px solid var(--border-soft)',
                    cursor: 'pointer',
                    transition: 'var(--transition-default)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : 'var(--background-secondary)';
                  }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--foreground)',
                        marginBottom: '4px',
                      }}>
                        {notification.title}
                      </h4>
                      <p style={{
                        fontSize: '13px',
                        color: 'var(--foreground-secondary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}>
                        {notification.message}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        fontSize: '11px',
                        color: 'var(--foreground-tertiary)',
                      }}>
                        <IconWrapper icon={Clock} size={12} />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--accent-blue-primary)',
                        flexShrink: 0,
                        marginTop: '4px',
                      }} />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: 'var(--spacing-md)',
              borderTop: '1px solid var(--border-soft)',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <button
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  color: 'var(--foreground-secondary)',
                  transition: 'var(--transition-default)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--foreground-secondary)';
                }}
              >
                Marcar todas como leídas
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

