import { motion } from 'motion/react';
import { Bell, Settings } from 'lucide-react';

interface HeaderActionsProps {
  notificationCount?: number;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}

export function HeaderActions({ 
  notificationCount = 0, 
  onNotificationClick, 
  onSettingsClick 
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <motion.button
        onClick={onNotificationClick}
        className="relative p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-4 h-4" />
        {notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center"
          >
            <span className="text-[9px] font-medium text-black">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Settings */}
      <motion.button
        onClick={onSettingsClick}
        className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
        whileHover={{ scale: 1.05, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Settings className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
