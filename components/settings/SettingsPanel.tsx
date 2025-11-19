import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Monitor, X, Palette } from 'lucide-react';
import { useTheme as useThemeMode, ThemeMode } from '../../hooks/useTheme';
import { useTheme } from '../../src/contexts/ThemeContext';
import { themes, ThemeName } from '../../src/config/themes';
import { IconWrapper } from '../icons/desktop/IconWrapper';
import { useEffect, useRef } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme: themeMode, changeTheme: changeThemeMode } = useThemeMode();
  const { theme: currentTheme, setTheme } = useTheme();
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

  const themeModeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ];

  const themeStyleOptions: { value: ThemeName; label: string }[] = [
    { value: 'silk', label: 'Silk' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          />
          
          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 'calc(var(--header-height) + 8px)',
              right: '24px',
              width: '320px',
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 9999,
              padding: 'var(--spacing-lg)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: 'var(--foreground)',
                margin: 0,
              }}>
                Configuración
              </h3>
              <motion.button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors"
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
                <IconWrapper icon={X} size={16} />
              </motion.button>
            </div>

            {/* Theme Style Section */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--foreground-secondary)',
                marginBottom: 'var(--spacing-md)',
              }}>
                Estilo de Tema
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {themeStyleOptions.map((option) => {
                  const isSelected = currentTheme === option.value;
                  const themeConfig = themes[option.value];
                  
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isSelected ? 'var(--accent-blue-primary)' : 'var(--border-soft)'}`,
                        backgroundColor: isSelected ? 'var(--accent-blue-light)' : 'transparent',
                        color: isSelected ? 'var(--foreground)' : 'var(--foreground-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                          e.currentTarget.style.borderColor = 'var(--border-medium)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'var(--border-soft)';
                        }
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <IconWrapper 
                        icon={Palette} 
                        size={18} 
                        isActive={isSelected}
                      />
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: isSelected ? 500 : 400,
                        flex: 1,
                      }}>
                        {themeConfig.displayName}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-blue-primary)',
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Theme Mode Section (Light/Dark/System) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--foreground-secondary)',
                marginBottom: 'var(--spacing-md)',
              }}>
                Modo de Tema
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {themeModeOptions.map((option) => {
                  const isSelected = themeMode === option.value;
                  const Icon = option.icon;
                  
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => changeThemeMode(option.value)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isSelected ? 'var(--accent-blue-primary)' : 'var(--border-soft)'}`,
                        backgroundColor: isSelected ? 'var(--accent-blue-light)' : 'transparent',
                        color: isSelected ? 'var(--foreground)' : 'var(--foreground-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                          e.currentTarget.style.borderColor = 'var(--border-medium)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'var(--border-soft)';
                        }
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <IconWrapper 
                        icon={Icon} 
                        size={18} 
                        isActive={isSelected}
                      />
                      <span style={{ 
                        fontSize: '14px',
                        fontWeight: isSelected ? 500 : 400,
                        flex: 1,
                      }}>
                        {option.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-blue-primary)',
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer - Preparado para más opciones */}
            <div style={{
              marginTop: 'var(--spacing-lg)',
              paddingTop: 'var(--spacing-lg)',
              borderTop: '1px solid var(--border-soft)',
              fontSize: '12px',
              color: 'var(--foreground-tertiary)',
              textAlign: 'center',
            }}>
              Más opciones próximamente
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

