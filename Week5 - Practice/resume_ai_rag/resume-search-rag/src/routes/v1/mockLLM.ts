import { Router, Request, Response } from 'express'

const router = Router()

// Simple mock rerank: sort candidates by snippet length (descending) and return as `ranked`
router.post('/rerank', async (req: Request, res: Response) => {
  const { query, candidates, topK } = req.body
  if (!query || !Array.isArray(candidates)) return res.status(400).json({ error: 'query and candidates required' })

  const ranked = [...candidates]
    .map((c: any) => ({ ...c, score: (c.snippet || '').length }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, topK || candidates.length)

  return res.json({ ranked })
})

// Simple mock summarize: return the first 120 chars as a 'summary'
router.post('/summarize', async (req: Request, res: Response) => {
  const { query, candidate } = req.body
  if (!query || !candidate) return res.status(400).json({ error: 'query and candidate required' })

  const text = candidate.text || candidate.snippet || ''
  const summary = text.length > 120 ? text.slice(0, 117) + '...' : text

  return res.json({ summary })
})

export default router
