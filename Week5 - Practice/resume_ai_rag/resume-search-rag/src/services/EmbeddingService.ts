import axios from 'axios';
import config from '../config';

export class EmbeddingService {
    private apiUrl: string | undefined;
    private apiKey: string;
    private modelName: string;

    constructor() {
        this.apiUrl = process.env.MISTRAL_EMBEDDING_API_URL;
        this.apiKey = config.MISTRAL_EMBEDDING_API_KEY;
        this.modelName = config.EMBEDDING_MODEL || 'mistral-embed';
    }

    public getModelName(): string {
        return this.modelName;
    }

    public async generateEmbedding(input: string | string[], model?: string): Promise<number[]> {
        const modelToUse = model || this.modelName;

        if (!this.apiUrl) {
            throw new Error('Embedding API URL not configured (MISTRAL_EMBEDDING_API_URL)');
        }

        const inputArray = Array.isArray(input) ? input : [input];

        const requestBody = {
            model: modelToUse,
            input: inputArray,
        };

        if (!this.apiKey) {
            throw new Error('Embedding API key not configured (MISTRAL_EMBEDDING_API_KEY)');
        }

        const callProvider = async (body: any) => {
            return axios.post(this.apiUrl as string, body, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });
        };

        try {
            const response = await callProvider(requestBody);

            const parsed = parseEmbeddingFromResponse(response.data);
            if (!parsed) {
                console.error('Unexpected embedding provider response format:', response.data);
                throw new Error('Unexpected embedding provider response format');
            }

            return parsed;
        } catch (err: any) {
            // If provider complains about invalid model, attempt small set of fallbacks
            const resp = err.response;
            if (resp && resp.data && typeof resp.data === 'object') {
                const data = resp.data;
                console.error('Embedding provider error', { status: resp.status, data });

                const invalidModel = (data.type === 'invalid_model') || (typeof data.message === 'string' && data.message.toLowerCase().includes('invalid model'));

                if (invalidModel) {
                    // First try: ask provider to use its default by omitting the model field
                    try {
                        console.info('Embedding provider rejected model; retrying without model field to use provider default');
                        const rDefault = await callProvider({ input: inputArray });
                        if (rDefault?.data && Array.isArray(rDefault.data.embedding)) {
                            return rDefault.data.embedding as number[];
                        }
                    } catch (e: any) {
                        console.warn('Provider default attempt failed:', e?.response?.data || e.message || e);
                    }

                    const candidates = [modelToUse, 'mistral-embed'];
                    const tried = new Set<string>();

                    for (const candidate of candidates) {
                        if (!candidate || tried.has(candidate)) continue;
                        tried.add(candidate);
                        if (candidate === modelToUse) continue; // already tried

                        try {
                            console.info(`Retrying embedding call with model=${candidate}`);
                            const tryBody = { model: candidate, input: inputArray };
                            const r = await callProvider(tryBody);
                            if (r?.data && Array.isArray(r.data.embedding)) {
                                return r.data.embedding as number[];
                            }
                        } catch (e: any) {
                            // continue trying other candidates
                            console.warn(`Model ${candidate} failed:`, e?.response?.data || e.message || e);
                        }
                    }

                    throw new Error(`Embedding provider invalid model: tried candidates ${Array.from(tried).join(', ')}`);
                }
            }

            console.error('Error generating embedding:', err.message || err);
            throw new Error(err.message || 'Failed to generate embedding');
        }
    }
}

function parseEmbeddingFromResponse(data: any): number[] | null {
    if (!data) return null;

    // Common shapes:
    // { embedding: [num...] }
    if (Array.isArray(data.embedding)) return data.embedding as number[];

    // { embeddings: [[num...], ...] } or { embeddings: [{ embedding: [...] }, ...] }
    if (Array.isArray(data.embeddings)) {
        const first = data.embeddings[0];
        if (Array.isArray(first)) return first as number[];
        if (first && Array.isArray(first.embedding)) return first.embedding as number[];
    }

    // { data: [{ embedding: [...] }, ...] }
    if (Array.isArray(data.data) && data.data.length > 0) {
        const first = data.data[0];
        if (first && Array.isArray(first.embedding)) return first.embedding as number[];
    }

    // If API returns an array at the top-level: [{ embedding: [...] }]
    if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first && Array.isArray(first.embedding)) return first.embedding as number[];
    }

    // other providers may nest under `outputs` or similar
    if (Array.isArray(data.outputs) && data.outputs.length > 0) {
        const out = data.outputs[0];
        if (out && Array.isArray(out.embedding)) return out.embedding as number[];
    }

    return null;
}