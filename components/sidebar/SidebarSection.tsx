import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  icon?: LucideIcon;
  action?: {
    icon: LucideIcon;
    onClick: () => void;
  };
  children: ReactNode;
}

export function SidebarSection({ title, icon: Icon, action, children }: SidebarSectionProps) {
  return (
    <div className="space-y-1">
      {/* Section Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3 text-white/30" />}
          <span className="text-[10px] font-medium text-white/30 tracking-wider uppercase">
            {title}
          </span>
        </div>
        {action && (
          <motion.button
            onClick={action.onClick}
            className="p-0.5 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <action.icon className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* Section Content */}
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}