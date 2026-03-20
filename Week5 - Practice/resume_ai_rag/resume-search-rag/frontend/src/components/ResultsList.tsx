import React from 'react'
import type { Candidate } from '../../types'
import ResultItem from './ResultItem'

type Props = {
  items: Candidate[]
  selectedIds?: Set<string>
  onToggle?: (resumeId: string, checked: boolean) => void
  query?: string
  onSummarize?: (resumeId: string, summary: string) => void
}

export default function ResultsList({ items, selectedIds, onToggle, query, onSummarize }: Props) {
  if (!items || items.length === 0) return <div className="no-results">No results</div>

  return (
    <div className="results-list">
      {items.map((it) => (
        <ResultItem
          key={it.resumeId || Math.random().toString(36).slice(2, 9)}
          item={it}
          selected={!!selectedIds?.has(it.resumeId)}
          onSelectChange={onToggle}
          query={query}
          onSummary={(rid, summary) => onSummarize && onSummarize(rid, summary)}
        />
      ))}
    </div>
  )
}
