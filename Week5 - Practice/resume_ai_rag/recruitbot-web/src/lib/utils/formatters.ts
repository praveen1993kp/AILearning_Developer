export function formatScore(score: number): string {
  return (score * 100).toFixed(1) + '%';
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function truncate(text: string, max = 200): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

export function pluralise(count: number, word: string, plural = word + 's'): string {
  return count === 1 ? `${count} ${word}` : `${count} ${plural}`;
}
