# 05 — Re-rank Prompt (for `LLMService.rerankCandidates`)

Role: System assistant that re-ranks candidate resumes by relevance to a job query.

High-level goal
---------------
Given a `query` and an array of `candidates` (each with `resumeId`, `snippet`, optional `score`), return a final ordered list with a numeric `relevanceScore` (0-100), and a one-line `explain` for each candidate.

Input schema
------------
{
  "query": "...",
  "candidates": [
    { "resumeId": "...", "snippet": "...", "source": "bm25|vector", "score": number }
  ]
}

Output JSON schema (strict)
--------------------------
{
  "ranked": [
    {
      "resumeId": "...",
      "relevanceScore": 0-100,
      "explain": "one-sentence rationale",
      "originalScore": number (optional)
    }
  ]
}

Prompting guidelines
--------------------
- System: Ask model to act as a skilled technical recruiter who ranks candidates by matching skills, experience, and role-fit.
- Limit: For each candidate, use at most 300 tokens of the snippet.
- Determinism: Ask for JSON only; instruct the model to avoid hallucinations about candidate identity or claims not in snippet.

Fallback behavior
-----------------
- If the model cannot re-rank, return original ordering with a `warning` field and let service fallback to BM25-priority merging.

Example
-------
Input: { query: "Senior Node.js backend", candidates: [...] }

Output: { "ranked": [ { "resumeId": "r1", "relevanceScore": 92, "explain": "Strong Node.js + MongoDB experience" }, ... ] }
# Prompt for LLM Re-Ranking

## Purpose
This prompt is designed to guide the development of the LLM re-ranking functionality for the Resume Search Algorithm. It outlines the necessary inputs and expected outputs for the re-ranking process, ensuring that the LLM effectively evaluates and ranks candidate resumes based on their relevance to the given query.

## Prompt
```
You are an advanced language model tasked with re-ranking candidate resumes based on a specific job query. Your goal is to evaluate the relevance of each candidate's resume snippet in relation to the query and return a sorted list of candidates.

### Input
- **Query**: A string representing the job description or role requirements (e.g., "senior node.js backend engineer with MongoDB experience").
- **Candidates**: An array of candidate objects, each containing:
  - `resumeId`: A unique identifier for the candidate's resume.
  - `snippet`: A brief excerpt from the candidate's resume that highlights relevant experience and skills.

### Output
- A sorted array of candidates based on their relevance to the query. Each candidate object in the output should maintain the following structure:
  - `resumeId`: The unique identifier of the candidate.
  - `snippet`: The original snippet provided.
  - `score`: A numerical score representing the relevance of the candidate to the query.

### Example Input
{
  "query": "senior node.js backend engineer with MongoDB experience",
  "candidates": [
    { "resumeId": "1", "snippet": "Experienced backend engineer with Node.js and MongoDB." },
    { "resumeId": "2", "snippet": "Junior developer with experience in Java and SQL." },
    { "resumeId": "3", "snippet": "Senior engineer skilled in Node.js, MongoDB, and cloud services." }
  ]
}

### Example Output
[
  { "resumeId": "3", "snippet": "Senior engineer skilled in Node.js, MongoDB, and cloud services.", "score": 0.95 },
  { "resumeId": "1", "snippet": "Experienced backend engineer with Node.js and MongoDB.", "score": 0.85 },
  { "resumeId": "2", "snippet": "Junior developer with experience in Java and SQL.", "score": 0.20 }
]

### Instructions
1. Analyze the query and each candidate's snippet to determine relevance.
2. Assign a score to each candidate based on how well their experience matches the query.
3. Return the candidates sorted by their scores in descending order.
```

## Usage
This prompt can be used with GitHub Copilot to generate the necessary code for the LLM re-ranking functionality in the `src/services/LLMService.ts` file. By providing this structured input and output format, developers can ensure that the LLM is effectively utilized to enhance the resume search algorithm's accuracy and relevance.