# 01 — Embedding Prompt (for `EmbeddingService`)

Role: System assistant for generating high-quality vector embeddings for resume search.

Goal
----
Produce a fixed-length numeric embedding (array of floats) for input text. Output should be the embedding only — no explanations.

Input
-----
Provide a single field: `input` (string). The input may be a short query or a resume snippet.

Desired behavior
----------------
- Normalize text (lowercase, trim). Do not remove punctuation that changes meaning.
- Limit input length to 32k characters; when exceeded, truncate thoughtfully by preserving the start and relevant skill sections.
- Return an array of numbers matching the configured model's dimension (do not describe the dimension in output).

Output schema (consume by code)
------------------------------
{
  "embedding": [number],
  "model": "<model-name>"
}

Constraints
-----------
- Do not include metadata or explanations in the response — only JSON.
- When embedding generation fails, return a structured error upstream; do not attempt to craft pseudo-embeddings.

Example
-------
Input: "Senior Node.js backend engineer with MongoDB and distributed systems experience"

Output: {
  "embedding": [0.0123, -0.0045, ...],
  "model": "mistral-embed"
}
# Embedding Generation Prompt for GitHub Copilot

## Prompt

You are developing a Resume Search Algorithm using the RAG (Retrieval-Augmented Generation) approach. Your task is to implement the embedding generation functionality using the Mistral API. The embeddings will be generated on-demand for each query, and the model used for embeddings should be configurable.

### Instructions for GitHub Copilot

1. **Create the EmbeddingService Class**: 
   - Implement a class named `EmbeddingService` in `src/services/EmbeddingService.ts`.
   - This class should have a method `generateEmbedding(input: string, model?: string): Promise<number[]>` that:
     - Accepts a text input and an optional model name.
     - Calls the Mistral embedding API to generate embeddings.
     - Returns the generated embedding as an array of numbers.

2. **Handle API Configuration**:
   - Ensure that the API key and model configurations are loaded from environment variables.
   - Use a `.env` file to store sensitive information securely.

3. **Error Handling**:
   - Implement error handling for API calls to manage potential failures gracefully.
   - Return a meaningful error message if the embedding generation fails.

4. **Testing**:
   - Write unit tests for the `EmbeddingService` class to ensure that the embedding generation works as expected.
   - Include tests for both successful API calls and error scenarios.

### Example Usage

```typescript
const embeddingService = new EmbeddingService();
const embedding = await embeddingService.generateEmbedding("Sample resume text", "mistral-embed");
console.log(embedding);
```

### Expected Output

The output of the `generateEmbedding` method should be an array of numbers representing the embedding for the provided input text. For example:

```json
{
  "embedding": [0.123, 0.456, 0.789, ...]
}
```

### Notes

- Ensure that the embedding dimensions are consistent with the model used.
- The embedding generation should be efficient and handle multiple requests concurrently if needed.