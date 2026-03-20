# Prompts Directory

This folder contains production-ready LLM prompt templates and Co-pilot guidance for the `resume-search-rag` project. Use these templates when implementing `EmbeddingService`, `SearchService`, and `LLMService` methods.

Files
- `01_embedding_prompt.md` — embedding generation prompt and constraints.
- `02_bm25_search_prompt.md` — instructions for BM25/Atlas Search pipeline.
- `03_vector_search_prompt.md` — vector search + re-score prompt guidance.
- `04_hybrid_search_prompt.md` — how to run parallel BM25 + vector and merge/dedup.
- `05_rerank_prompt.md` — LLM re-ranking system prompt + output schema.
- `06_summarize_prompt.md` — summarization prompt and style options.
- `07_metadata_extraction_prompt.md` — metadata extraction (skills, titles, exp).

Usage
-----
1. Copy the prompt text into your `LLMService` call payload as the system/instruction text.
2. Always request strict JSON output and validate the response against the schema.
3. Keep prompts stable; only change after consensus and update unit tests for prompt-driven behavior.
# Prompts for Resume Search Algorithm Development

This directory contains various prompt files designed to assist in the development of a Resume Search Algorithm using the Retrieval-Augmented Generation (RAG) approach. Each prompt is tailored to guide the generation of specific components of the application, leveraging GitHub Copilot for efficient coding.

## Prompt Files

1. **01_embedding_prompt.md**
   - Purpose: To generate code related to embedding generation using the Mistral API.
   - Usage: Use this prompt to create the `EmbeddingService` class that interacts with the Mistral API for generating embeddings from input text.

2. **02_bm25_search_prompt.md**
   - Purpose: To generate code for implementing the BM25 search algorithm.
   - Usage: This prompt will help in developing the `bm25Search` method within the `SearchService` class, which handles search queries based on the BM25 algorithm.

3. **03_vector_search_prompt.md**
   - Purpose: To generate code for vector search functionality.
   - Usage: Utilize this prompt to implement the `vectorSearch` method in the `SearchService`, which performs vector-based searches using embeddings.

4. **04_hybrid_search_prompt.md**
   - Purpose: To generate code for the hybrid search approach that combines BM25 and vector search.
   - Usage: This prompt will assist in creating the `hybridSearch` method in the `SearchService`, allowing for parallel execution of both search methods.

5. **05_rerank_prompt.md**
   - Purpose: To generate code for the LLM re-ranking process.
   - Usage: Use this prompt to develop the `rerankCandidates` method in the `LLMService`, which re-ranks candidate snippets based on LLM scoring.

6. **06_summarize_prompt.md**
   - Purpose: To generate code for summarizing candidate resumes.
   - Usage: This prompt will guide the creation of the `summarizeCandidateFit` method in the `LLMService`, which generates summaries based on the provided query and candidate information.

7. **07_metadata_extraction_prompt.md**
   - Purpose: To generate code for extracting metadata from resumes.
   - Usage: Utilize this prompt to implement the `extractMetadata` method in the `LLMService`, which extracts relevant information such as skills and job titles from raw resume text.

## Using GitHub Copilot

To effectively use GitHub Copilot with these prompts:

- Open the relevant prompt file in your code editor.
- Read through the prompt to understand the context and requirements.
- Start typing the function or class you want to implement, and Copilot will suggest code snippets based on the prompt.
- Review and modify the suggestions as needed to fit your specific implementation requirements.
- Test the generated code to ensure it meets the desired functionality.

By following these instructions and utilizing the prompts, you can streamline the development process of the Resume Search Algorithm and enhance code quality with the assistance of GitHub Copilot.