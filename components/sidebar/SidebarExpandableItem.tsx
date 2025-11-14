import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SubMenuItem {
  label: string;
  onClick?: () => void;
}

interface SidebarExpandableItemProps {
  label: string;
  icon: LucideIcon;
  subItems: SubMenuItem[];
  isActive?: boolean;
  defaultExpanded?: boolean;
}

export function SidebarExpandableItem({ 
  label, 
  icon: Icon, 
  subItems, 
  isActive = false,
  defaultExpanded = false 
}: SidebarExpandableItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      {/* Main Item */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative w-full px-3 py-1.5 rounded-lg text-left
          transition-all duration-200 ease-out
          group flex items-center gap-2.5
          ${isActive 
            ? 'bg-white/10 text-white' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
          }
        `}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-medium flex-1">{label}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>

        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.button>

      {/* Sub Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 mt-0.5 space-y-0.5 border-l border-white/10 pl-3 py-1">
              {subItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={item.onClick}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-white/50 hover:text-white/90 hover:bg-white/5 transition-colors"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 2 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}