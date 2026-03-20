# Create `/v1/embeddings` Endpoint

Purpose: Implement the vector embedding endpoint used by the resume RAG pipeline. This prompt documents the endpoint contract, request/response examples, and implementation notes for `EmbeddingService`.

Endpoint
- POST /v1/embeddings

Request Body
```
{
  "model": "optional model name, e.g. mistral-embed-small",
  "input": "text to embed (single input string)"
}
```

Response
```
{
  "embedding": [0.123, 0.456, ...],
  "model": "mistral-embed"
}
```

Behavior & Notes
- The endpoint accepts a single input string per request (no batching).
- If `model` is omitted, the server uses the configured default in `.env` (`EMBEDDING_MODEL`).
- Errors:
  - 400 when `input` is missing or not a string.
  - 500 for provider or internal errors.
- The `EmbeddingService` should call the configured provider URL (`MISTRAL_EMBEDDING_API_URL`) with `MISTRAL_EMBEDDING_API_KEY` in the `Authorization` header.
- The provider response is expected to contain an `embedding` numeric array.

Implementation Checklist
- Read `EMBEDDING_MODEL`, `MISTRAL_EMBEDDING_API_URL`, and `MISTRAL_EMBEDDING_API_KEY` from `.env` via `src/config`.
- Implement `src/services/EmbeddingService.ts` to call provider and return `number[]`.
- Implement `src/routes/v1/embeddings.ts` to validate input and return the embedding and `model` used.

Security
- Do not log API keys. Keep `.env` out of source control.

Examples
- Curl example:
```
curl -X POST http://localhost:3000/v1/embeddings \
  -H "Content-Type: application/json" \
  -d '{"input":"senior node.js backend engineer","model":"mistral-embed"}'
```
