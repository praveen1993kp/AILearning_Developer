import React from 'react'
import type { Candidate } from '../types'

type Props = {
  item: Candidate
}

export default function ResultItem({ item }: Props) {
  return (
    <div className="result-item">
      <div className="result-meta">
        <div className="result-id">{item.resumeId || item.id || '(no id)'}</div>
        {typeof item.score === 'number' && <div className="badge">score: {Number(item.score).toFixed(2)}</div>}
        <div className="result-source">{item.source || ''}</div>
      </div>

      <div className="result-snippet">{item.snippet || item.text || ''}</div>

      {item.summary && <div className="result-summary">{item.summary}</div>}
    </div>
  )
}
