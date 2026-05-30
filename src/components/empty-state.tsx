import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-white/80 mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-xs mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
