# 04 — Hybrid Search Prompt (for `SearchService.hybridSearch`)

Role: Assistant to describe an implementation for running BM25 and vector search in parallel and returning both ranked lists.

Goal
----
Provide a clear implementation pattern for running BM25 and vector searches concurrently, de-duplicating by `_id`, and returning both lists for debugging or combined use.

Inputs
------
- `query` (string)
- `filters` (object)
- `topK` (int)

Desired guidance
----------------
- Example Node.js/TypeScript code that runs `bm25Search` and `vectorSearch` in parallel using `Promise.allSettled`.
- Dedup rules: prefer candidate with higher BM25 score when deduping source-agnostic results, but keep both lists intact.

Output schema
-------------
{
  "bm25": [{ "_id": "...", "score": number, "snippet": "..." }],
  "vector": [{ "_id": "...", "score": number, "snippet": "..." }]
}
# Hybrid Search Prompt for GitHub Copilot

## Prompt

You are tasked with implementing a hybrid search functionality for a resume search algorithm using the RAG (Retrieval-Augmented Generation) approach. The hybrid search combines BM25 and vector search methods to provide a comprehensive search experience. 

### Requirements

1. **SearchService Class**: 
   - Implement a method called `hybridSearch(query: string, filters?: object, options?: object): Promise<any[]>`.
   - This method should:
     - Execute BM25 search and vector search in parallel.
     - Return both result sets without merging scores for debugging purposes.

2. **BM25 Search**:
   - Use the existing `bm25Search` method to perform the BM25 search.
   - Ensure that the search considers relevant filters such as minimum years of experience.

3. **Vector Search**:
   - Use the existing `vectorSearch` method to perform the vector search.
   - Ensure that the query embedding is generated on-demand using the `EmbeddingService`.

4. **Response Structure**:
   - The response should include both BM25 and vector search results, clearly labeled.

5. **Error Handling**:
   - Implement fallback logic in case either search method fails.
   - If BM25 fails, return only vector search results, and vice versa.

### Example Code Snippet

```typescript
import { SearchService } from './SearchService';

class HybridSearchService extends SearchService {
    async hybridSearch(query: string, filters?: object, options?: object): Promise<any[]> {
        const bm25Results = this.bm25Search(query, filters);
        const vectorResults = this.vectorSearch(query, filters);

        const [bm25, vector] = await Promise.all([bm25Results, vectorResults]);

        return {
            bm25Results,
            vectorResults
        };
    }
}
```

### Usage

- Use this prompt to guide GitHub Copilot in generating the hybrid search functionality.
- Ensure that the generated code adheres to the project's architecture and coding standards.
- Review and test the generated code to confirm its correctness and performance.

### Additional Notes

- Consider adding logging for both search methods to track performance and issues.
- Ensure that the method is well-documented with comments explaining the logic and flow.
- Test the hybrid search method thoroughly with various queries and filters to validate its effectiveness.