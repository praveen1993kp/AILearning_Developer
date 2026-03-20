import { truncate } from '@/lib/utils/formatters';

interface ResultSummaryProps {
  snippet: string;
  query?: string;
}

export function ResultSummary({ snippet, query }: ResultSummaryProps) {
  const text = truncate(snippet, 250);

  // Highlight query terms (simple approach)
  if (!query) {
    return <p className="text-xs text-white/50 leading-relaxed line-clamp-3">{text}</p>;
  }

  const terms = query.trim().split(/\s+/).filter((t) => t.length > 2);
  const regex = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/30 text-white/80 rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}
