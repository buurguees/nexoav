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
 * Versión Mobile de HeaderSearch
 * Optimizado para móviles - más compacto
 */
export function HeaderSearch({ placeholder = 'Buscar...', onSearch, size = 'mobile' }: HeaderSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
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
        size={14} 
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
          fontSize: '12px',
          color: 'var(--foreground)',
          width: '100px',
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

