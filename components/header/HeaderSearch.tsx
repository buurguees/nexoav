import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { IconWrapper } from '../icons/IconWrapper';

interface HeaderSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: 'default' | 'small' | 'mobile';
}

export function HeaderSearch({ placeholder = 'Buscar...', onSearch, size = 'default' }: HeaderSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  // Estilos según el tamaño
  const isMobile = size === 'mobile';
  const padding = isMobile ? 'px-2 py-1' : 'px-3 py-1.5';
  const iconSize = isMobile ? 14 : 16;
  const inputWidth = isMobile ? 'w-32' : 'w-48';
  const fontSize = isMobile ? 'text-xs' : 'text-sm';
  const gap = isMobile ? 'gap-1.5' : 'gap-2';

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`
        relative flex items-center ${gap} ${padding} rounded-lg
        bg-white/5 border border-white/10
        transition-all duration-200
        ${isFocused ? 'border-white/20 bg-white/10' : 'hover:border-white/15'}
      `}
      whileHover={{ scale: 1.01 }}
    >
      <IconWrapper icon={Search} size={iconSize} primaryColor="rgba(255, 255, 255, 0.4)" secondaryColor="rgba(255, 255, 255, 0.2)" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`bg-transparent border-none outline-none ${fontSize} text-white/90 placeholder:text-white/30 ${inputWidth}`}
      />
    </motion.form>
  );
}
