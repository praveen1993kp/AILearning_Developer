import React, { useState } from 'react'
import type { Candidate } from '../../types'
import { summarize } from '../api'

type Props = {
  item: Candidate
  selected?: boolean
  onSelectChange?: (resumeId: string, checked: boolean) => void
  query?: string
  onSummary?: (resumeId: string, summary: string) => void
}

export default function ResultItem({ item, selected, onSelectChange, query, onSummary }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [localSummary, setLocalSummary] = useState<string | undefined>(item.summary)

  const handleCopy = async () => {
    try {
      const text = item.text || item.snippet || JSON.stringify(item, null, 2)
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${item.resumeId || 'resume'}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('export failed', e)
    }
  }

  const handleSummarize = async () => {
    if (!query) return alert('Run a search first to provide query context for summarization')
    try {
      setSummarizing(true)
      const resp = await summarize(query, item)
      const s = resp?.summary ?? ''
      setLocalSummary(s)
      onSummary && onSummary(item.resumeId, s)
    } catch (err: any) {
      console.error('Summarize failed', err)
      alert('Summarize failed: ' + (err.message || 'unknown'))
    } finally {
      setSummarizing(false)
    }
  }

  return (
    <div className="result-item">
      <div style={{ position: 'absolute', left: 8, top: 12 }}>
        <input
          type="checkbox"
          checked={!!selected}
          onChange={(e) => onSelectChange && onSelectChange(item.resumeId, e.target.checked)}
        />
      </div>
      <div className="result-meta">
        <div className="result-id">{item.resumeId || '(no id)'}</div>
        {typeof item.score === 'number' && <div className="badge">score: {Number(item.score).toFixed(2)}</div>}
        <div className="result-source">{item.source || ''}</div>
      </div>

      <div className="result-snippet">{item.snippet || item.text || ''}</div>

      {(localSummary || item.summary) && <div className="result-summary">{localSummary ?? item.summary}</div>}

      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button onClick={() => setOpen(true)} style={{ padding: '6px 8px' }}>View</button>
        <button onClick={handleCopy} style={{ padding: '6px 8px' }}>{copied ? 'Copied' : 'Copy'}</button>
        <button onClick={handleExport} style={{ padding: '6px 8px' }}>Export</button>
        <button onClick={handleSummarize} disabled={summarizing} style={{ padding: '6px 8px' }}>{summarizing ? 'Summarizing...' : 'Summarize'}</button>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Resume: {item.resumeId || '(no id)'}</strong>
              <button onClick={() => setOpen(false)} style={{ padding: '4px 8px' }}>Close</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600 }}>Source:</div>
              <div style={{ marginBottom: 8 }}>{item.source || 'n/a'}</div>

              <div style={{ fontWeight: 600 }}>Snippet / Text:</div>
              <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '40vh', overflow: 'auto', background: '#fafafa', padding: 8 }}>{item.text || item.snippet || '(no text)'}</pre>

              <div style={{ fontWeight: 600, marginTop: 8 }}>Full JSON</div>
              <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '30vh', overflow: 'auto', background: '#fff', padding: 8 }}>{JSON.stringify(item, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
