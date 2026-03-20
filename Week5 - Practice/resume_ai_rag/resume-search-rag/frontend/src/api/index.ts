import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type { SearchResponse, Candidate, SummaryOptions, SummarizeResponse } from '../types'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

const client: AxiosInstance = axios.create({ baseURL: BASE, timeout: TIMEOUT })

async function request<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
	try {
		const res = await p
		return res.data
	} catch (err: any) {
		if (err.response) {
			const msg = err.response.data?.error || err.response.data || err.response.statusText || 'Server error'
			throw new Error(String(msg))
		}
		throw new Error(err.message || 'Network error')
	}
}

export const health = async () => request(client.get('/v1/health'))

export const bm25Search = async (query: string, topK = Number(import.meta.env.VITE_DEFAULT_TOPK) || 10, filters = {}) =>
	request<SearchResponse>(client.post('/v1/search/bm25', { query, topK, filters }))

export const vectorSearch = async (query: string, topK = Number(import.meta.env.VITE_DEFAULT_TOPK) || 10, filters = {}) =>
	request<SearchResponse>(client.post('/v1/search/vector', { query, topK, filters }))

export const hybridSearch = async (query: string, options = {}) =>
	request<SearchResponse>(client.post('/v1/search/hybrid', { query, ...options }))

export const endToEndSearch = async (query: string, options = {}) =>
	request<SearchResponse & { componentTimings?: any }>(client.post('/v1/search', { query, options }))

export const rerank = async (query: string, candidates: Candidate[], topK = Number(import.meta.env.VITE_DEFAULT_TOPK) || 10) =>
	request<{ ranked: Candidate[] }>(client.post('/v1/search/rerank', { query, candidates, topK }))

export const summarize = async (query: string, candidate: Candidate, opts: SummaryOptions = {}) =>
	request<SummarizeResponse>(client.post('/v1/search/summarize', { query, candidate, ...opts }))

export const embeddings = async (input: string) => request(client.post('/v1/embeddings', { input }))

export default client
