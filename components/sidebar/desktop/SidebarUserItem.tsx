import { motion } from 'motion/react';

interface SidebarUserItemProps {
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  unreadCount?: number;
  onClick?: () => void;
}

export function SidebarUserItem({ name, avatar, status = 'offline', unreadCount, onClick }: SidebarUserItemProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-amber-500'
  };

  return (
    <motion.button
      onClick={onClick}
      className="w-full px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2.5 group"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400/20 to-violet-400/20">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60 text-[10px] font-medium">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Status indicator */}
        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${statusColors[status]} rounded-full border-2 border-zinc-900`} />
      </div>

      {/* Name */}
      <span className="flex-1 text-xs text-white/60 group-hover:text-white/90 transition-colors text-left truncate">
        {name}
      </span>

      {/* Unread Badge */}
      {unreadCount && unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-1.5 py-0.5 bg-cyan-500 rounded-full text-[10px] font-medium text-black min-w-[18px] text-center"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>
      )}
    </motion.button>
  );
}

