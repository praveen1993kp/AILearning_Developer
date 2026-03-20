# 02 — BM25 Search Prompt (for `ResumeRepository` / BM25 pipeline)

Role: Assistant that returns precise Atlas Search BM25 query DSL and expected JSON result subset for resumes.

Goal
----
Generate the MongoDB Atlas Search pipeline (or a parameterized template) for BM25-style ranking across resume text, skills, job titles, and experience summary.

Inputs
------
- `query` (string)
- `topK` (integer)
- `filters` (object) e.g. `{ minYearsExperience: 5, location: "Bangalore" }`

Desired output
--------------
- A parameterized search pipeline snippet as JSON (aggregation `$search` stage) and a plain list of fields to project.
- Also include a short explanation (1-2 lines) of how score is computed, and recommended `topK` defaults.

Example output snippet
----------------------
{
  "$search": {
    "index": "resumes-bm25",
    "text": {
      "query": "{{query}}",
      "path": ["text", "skills", "role", "experienceSummary"],
      "fuzzy": { "maxEdits": 1 }
    }
  }
}

Notes
-----
- Keep returned pipeline safe for direct use in Node.js MongoDB driver (no comments, valid JSON).
- Provide recommended analyzers (e.g., english) and tokenization settings if relevant.
# BM25 Search Prompt

## Purpose
This prompt is designed to assist in generating code for implementing the BM25 search algorithm within the Resume Search API. The BM25 algorithm is a probabilistic model used for information retrieval that ranks documents based on the query terms appearing in each document, considering term frequency and document length.

## Instructions
1. **Context**: You are developing a Resume Search API that utilizes the BM25 algorithm to search through resumes stored in a MongoDB database. The search should consider various fields such as raw text, skills, job titles, and experience summaries.

2. **Functionality**: The BM25 search should:
   - Accept a search query and optional filters (e.g., minimum years of experience).
   - Return a ranked list of resumes based on the relevance to the search query.
   - Utilize the MongoDB Atlas Search capabilities for efficient querying.

3. **Code Generation**: Use the following guidelines to generate the necessary code:
   - Create a function within the `SearchService` class that implements the BM25 search logic.
   - Ensure the function interacts with the `ResumeRepository` to fetch resumes and apply the BM25 ranking.
   - Handle any potential errors gracefully and log relevant information for debugging.

4. **Example Prompt**:
   ```
   Generate a TypeScript function for the BM25 search implementation in the SearchService class. The function should:
   - Take a query string and optional filters as parameters.
   - Use MongoDB Atlas Search to perform the search across the relevant fields.
   - Return a list of resumes ranked by relevance.
   - Include error handling and logging for any issues that arise during the search process.
   ```

5. **Testing**: After generating the code, ensure to write unit tests to validate the functionality of the BM25 search implementation. The tests should cover various scenarios, including:
   - Valid search queries with and without filters.
   - Edge cases such as empty queries or invalid filters.
   - Performance considerations for larger datasets.

By following this prompt, you will be able to effectively implement the BM25 search functionality in your Resume Search API, ensuring high-quality search results for users.