# 03 — Vector Search Prompt (for `SearchService.vectorSearch`)

Role: System assistant to produce best-practice instructions for performing vector search with an ANN index and exact re-score.

Goal
----
Describe the two-step flow: (1) ANNOY/HNSW approximate top-K using MongoDB Atlas Vector Search, (2) exact re-score by computing cosine similarity between candidate embeddings and the query embedding.

Inputs
------
- `queryEmbedding` (array of numbers)
- `topK` (int)
- `filters` (object)

Output expectations
-------------------
- Provide the Atlas vector `$search` stage JSON or parameters, and a short TypeScript snippet showing exact re-score (cosine similarity) for top candidates.

Constraints & heuristics
----------------------
- Recommend `annK` default = topK * 4 (to increase recall before re-ranking).
- Provide guidance around similarity thresholds and normalization.

Example (TS re-score)
---------------------
// compute cosine similarity between queryEmbedding and candidate.embedding
function cosine(a, b) { /* dot / (||a||*||b||) */ }
# Vector Search Prompt for GitHub Copilot

## Purpose
This prompt is designed to assist in generating code related to the vector search functionality of the Resume Search Algorithm using the RAG approach. The vector search will utilize embeddings generated from the Mistral API and will be integrated into the overall search service.

## Prompt
```plaintext
// Generate a function for vector search in the Resume Search Algorithm.
// The function should take a query string and optional filters, and return the top K results based on vector similarity.
// It should utilize the EmbeddingService to create an embedding for the query and perform a search using MongoDB's vector search capabilities.
// Ensure to handle errors gracefully and provide fallback mechanisms if the vector search fails.

function vectorSearch(query: string, filters?: object, topK: number = 10): Promise<any[]> {
    // Step 1: Generate the embedding for the query using the EmbeddingService.
    // Step 2: Perform a vector search using the generated embedding.
    // Step 3: Return the top K results based on cosine similarity.
    // Step 4: Implement error handling and fallback logic.
}
```

## Instructions for Use
1. **Open the file** where you want to implement the vector search functionality, typically in `src/services/SearchService.ts`.
2. **Invoke GitHub Copilot** by starting to type the prompt above or by using the shortcut for suggestions.
3. **Review the generated code** to ensure it meets the requirements outlined in the architecture document.
4. **Modify the generated code** as necessary to fit the specific needs of your application, including adjusting parameters or adding additional error handling.
5. **Test the function** thoroughly to ensure it works as expected within the context of the overall resume search pipeline.