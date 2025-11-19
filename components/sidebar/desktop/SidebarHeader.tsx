import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface SidebarHeaderProps {
  userName: string;
  userRole: string;
  userAvatar?: string;
  onCollapse?: () => void;
}

export function SidebarHeader({ userName, userRole, userAvatar, onCollapse }: SidebarHeaderProps) {
  return (
    <div className="p-3 border-t border-white/5">
      <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-violet-400">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black text-xs font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900" />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/90 font-medium truncate">{userName}</p>
          <p className="text-[10px] text-white/40 truncate">{userRole}</p>
        </div>

        {/* Collapse Button */}
        {onCollapse && (
          <motion.button
            onClick={onCollapse}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/60" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

