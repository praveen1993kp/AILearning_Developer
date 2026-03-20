import { motion } from 'framer-motion';

interface UserBubbleProps {
  content: string;
  timestamp: Date;
}

export function UserBubble({ content, timestamp }: UserBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%]">
        <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white/90">
          {content}
        </div>
        <p className="text-right text-xs text-white/25 mt-1 pr-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
