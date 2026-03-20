import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try refining your search query',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="p-4 rounded-full bg-white/5 text-white/30">
        {icon ?? <Search size={28} />}
      </div>
      <p className="text-white/60 font-medium text-sm">{title}</p>
      {description && <p className="text-white/35 text-xs max-w-xs">{description}</p>}
    </div>
  );
}
