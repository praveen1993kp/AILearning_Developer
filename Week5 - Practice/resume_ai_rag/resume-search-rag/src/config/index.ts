import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/resume_search',
    DB_NAME: process.env.DB_NAME || 'resume_search',
    MISTRAL_EMBEDDING_API_KEY: process.env.MISTRAL_EMBEDDING_API_KEY || '',
    MISTRAL_EMBEDDING_API_URL: process.env.MISTRAL_EMBEDDING_API_URL || '',
    MISTRAL_LLM_API_URL: process.env.MISTRAL_LLM_API_URL || process.env.GROQ_API_URL || process.env.GROQ_LLM_API_URL || '',
    LLM_API_URL: process.env.LLM_API_URL || process.env.GROQ_API_URL || process.env.GROQ_LLM_API_URL || '',
    COLLECTION_NAME: process.env.COLLECTION_NAME || 'resumes',
    VECTOR_INDEX_NAME: process.env.VECTOR_INDEX_NAME || 'vector_index_resume',
    BM25_INDEX_NAME: process.env.BM25_INDEX_NAME || 'bm25_search_resume',
    MISTRAL_LLM_API_KEY: process.env.MISTRAL_LLM_API_KEY || '',
    EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'mistral-embed',
    LLM_MODEL: process.env.LLM_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct',
    SUMMARIZATION_MODEL: process.env.GROQ_SUMMARIZATION_MODEL || process.env.SUMMARIZATION_MODEL || 'gpt-4o-mini',
    DEFAULT_SUMMARY_MAX_TOKENS: Number(process.env.DEFAULT_SUMMARY_MAX_TOKENS) || 150,
    LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'info',
};

export default config;