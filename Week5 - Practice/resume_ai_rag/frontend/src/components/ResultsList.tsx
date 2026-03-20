import React from 'react'
import type { Candidate } from '../types'
import ResultItem from './ResultItem'

type Props = {
  items: Candidate[]
}

export default function ResultsList({ items }: Props) {
  if (!items || items.length === 0) return <div className="no-results">No results</div>

  return (
    <div className="results-list">
      {items.map((it) => (
        <ResultItem key={it.resumeId || it.id || Math.random().toString(36).slice(2, 9)} item={it} />
      ))}
    </div>
  )
}
