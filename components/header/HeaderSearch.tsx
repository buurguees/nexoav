import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function HeaderSearch({ placeholder = 'Buscar...', onSearch }: HeaderSearchProps) {
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
      className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-lg
        bg-white/5 border border-white/10
        transition-all duration-200
        ${isFocused ? 'border-white/20 bg-white/10' : 'hover:border-white/15'}
      `}
      whileHover={{ scale: 1.01 }}
    >
      <Search className="w-4 h-4 text-white/40" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-sm text-white/90 placeholder:text-white/30 w-48"
      />
    </motion.form>
  );
}
