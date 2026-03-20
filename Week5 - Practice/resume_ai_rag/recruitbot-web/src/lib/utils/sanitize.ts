export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function sanitizeQuery(q: string): string {
  return q.replace(/[<>"'&]/g, '').trim().slice(0, 500);
}
