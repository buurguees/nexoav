"use client";

import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { IconWrapper } from '../../icons/desktop/IconWrapper';

interface HeaderSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: 'default' | 'small' | 'mobile';
}

/**
 * Versión Tablet Horizontal de HeaderSearch
 * Optimizado para tablet horizontal
 */
export function HeaderSearch({ placeholder = 'Buscar...', onSearch, size = 'default' }: HeaderSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const isMobile = size === 'mobile';
  const iconSize = isMobile ? 14 : 16;

  return (
    <motion.form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 'var(--spacing-sm)' : 'var(--spacing-sm)',
        padding: isMobile ? 'var(--spacing-xs) var(--spacing-sm)' : 'var(--spacing-xs) var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--background-secondary)',
        border: `1px solid ${isFocused ? 'var(--border-highlight)' : 'var(--border-soft)'}`,
        transition: 'var(--transition-default)',
      }}
      onMouseEnter={(e) => {
        if (!isFocused) {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isFocused) {
          e.currentTarget.style.borderColor = 'var(--border-soft)';
        }
      }}
      whileHover={{ scale: 1.01 }}
    >
      <IconWrapper 
        icon={Search} 
        size={iconSize} 
        primaryColor="var(--foreground-tertiary)" 
        secondaryColor="var(--foreground-disabled)" 
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: isMobile ? '12px' : '13px',
          color: 'var(--foreground)',
          width: isMobile ? '128px' : '192px',
        }}
      />
      <style>{`
        input::placeholder {
          color: var(--foreground-tertiary);
        }
      `}</style>
    </motion.form>
  );
}

