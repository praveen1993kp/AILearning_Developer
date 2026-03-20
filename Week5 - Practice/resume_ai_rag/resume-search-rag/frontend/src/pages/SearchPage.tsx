import React, { useState } from 'react'
import { endToEndSearch, health, bm25Search, vectorSearch, hybridSearch, rerank } from '../api'
import type { SearchResponse } from '../types'
import ResultsList from '../components/ResultsList'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('unknown')
  const [results, setResults] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState<'pipeline'|'bm25'|'vector'|'hybrid'>('pipeline')
  const [topK, setTopK] = useState<number>(Number(import.meta.env.VITE_DEFAULT_TOPK) || 10)
  const [summarize, setSummarize] = useState<boolean>(false)

  const checkHealth = async () => {
    try {
      const r = await health()
      setStatus(r?.status === 'healthy' ? 'ok' : 'bad')
    } catch (e) {
      setStatus('down')
    }
  }

  React.useEffect(() => { checkHealth() }, [])

  const onSearch = async () => {
    setLoading(true)
    try {
      let resp: any = null
      if (mode === 'bm25') {
        resp = await bm25Search(query, topK)
      } else if (mode === 'vector') {
        resp = await vectorSearch(query, topK)
      } else if (mode === 'hybrid') {
        resp = await hybridSearch(query, { topK })
      } else {
        resp = await endToEndSearch(query, { topK, summarize })
      }

      // normalize response shape (some endpoints return array directly)
      let items: any[] = []
      if (Array.isArray(resp)) {
        items = resp
      } else if (resp?.results) {
        items = resp.results
      } else if (resp?.ranked) {
        items = resp.ranked
      } else if (resp?.rankedCandidates) {
        items = resp.rankedCandidates
      } else if (resp?.data) {
        items = Array.isArray(resp.data) ? resp.data : resp.data.results ?? []
      } else if (resp?.bm25Results || resp?.vectorResults) {
        const bm = Array.isArray(resp.bm25Results) ? resp.bm25Results : []
        const ve = Array.isArray(resp.vectorResults) ? resp.vectorResults : []
        const map = new Map<string, any>()
        ;[...bm, ...ve].forEach((r: any) => {
          const key = r.resumeId || r.id || JSON.stringify(r)
          if (!map.has(key)) map.set(key, r)
        })
        items = Array.from(map.values())
      } else {
        items = []
      }

      setResults(items)
      console.log('search response', resp)
    } catch (e) {
      console.error(e)
      setResults([])
    } finally { setLoading(false) }
  }

  const onToggle = (resumeId: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) next.add(resumeId)
      else next.delete(resumeId)
      return next
    })
  }

  const onRerankSelected = async () => {
    if (!query) return alert('Please enter query before reranking')
    if (selectedIds.size === 0) return alert('No candidates selected for rerank')

    const candidates = results.filter(r => selectedIds.has(r.resumeId))
    try {
      const resp = await rerank(query, candidates, topK)
      const ranked = resp?.ranked || []

      // Reorder results: put ranked first in returned order, then append others
      const rankedMap = new Set(ranked.map((r: any) => r.resumeId))
      const remaining = results.filter(r => !rankedMap.has(r.resumeId))
      const newResults = [...ranked, ...remaining]
      setResults(newResults)
      setSelectedIds(new Set())
      alert('Re-ranked selected candidates')
    } catch (err: any) {
      console.error('Rerank failed', err)
      alert('Rerank failed: ' + (err.message || 'unknown'))
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Search</h2>
      <div>Status: <strong>{status}</strong></div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Enter query" style={{ width: 420, padding: 8 }} />
        <label>
          Mode:
          <select value={mode} onChange={e => setMode(e.target.value as any)} style={{ marginLeft: 8 }}>
            <option value="pipeline">Pipeline</option>
            <option value="bm25">BM25</option>
            <option value="vector">Vector</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>
        <label>
          topK:
          <input type="number" value={topK} onChange={e => setTopK(Number(e.target.value))} style={{ width: 72, marginLeft: 8 }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={summarize} onChange={e => setSummarize(e.target.checked)} /> Summarize
        </label>
        <button onClick={onSearch} disabled={loading || !query} style={{ marginLeft: 8, padding: '8px 12px' }}>{loading ? 'Searching...' : 'Search'}</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Results ({results.length})</h3>
          <div>
            <button onClick={onRerankSelected} disabled={selectedIds.size === 0} style={{ padding: '6px 10px' }}>Rerank selected</button>
          </div>
        </div>
        <ResultsList items={results} selectedIds={selectedIds} onToggle={onToggle} query={query} onSummarize={(rid, s) => {
          setResults(prev => prev.map(it => it.resumeId === rid ? { ...it, summary: s } : it))
        }} />
      </div>
    </div>
  )
}
