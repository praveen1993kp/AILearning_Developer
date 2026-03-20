# 06 — Summarize Prompt (for `LLMService.summarizeCandidateFit`)

Role: Assistant that produces short or detailed fit summaries for a candidate relative to a job query.

Inputs
------
- `query` (string)
- `candidate` { `resumeId`, `snippet`, `metadata`? }
- `style`: "short" | "detailed"
- `maxTokens`: integer

Output schema
-------------
{
  "summary": "...",
  "highlights": ["skill1", "skill2"],
  "gaps": ["missing skill or lower experience"]
}

Guidelines
----------
- `short`: 1-2 sentences (max 50 words). Focus on top 3 fit signals.
- `detailed`: 3-6 sentences (maxTokens respected). Include quantified experience if present.
- Avoid adding facts not present in the snippet.

Example
-------
Input: query "Senior Node.js backend" candidate snippet mentioning "3+ years Node.js, MongoDB"

Output: { "summary": "Good Node.js engineer with 3+ years experience; strong MongoDB exposure.", "highlights": ["Node.js","MongoDB"], "gaps": ["No distributed systems experience mentioned"] }
# Summarization Prompt for Resume Search Algorithm

## Purpose
This prompt is designed to guide the development of the summarization functionality for candidate resumes within the Resume Search Algorithm using the RAG approach. It outlines the expected input and output for the summarization process, ensuring that the implementation aligns with the overall architecture and requirements of the project.

## Prompt
You are tasked with implementing a summarization function for candidate resumes in a resume search application. The function should take a job description or role description as input, along with a candidate's resume snippet, and generate a concise summary that highlights the candidate's fit for the role.

### Input
- **query**: A string representing the job description or role description.
- **candidate**: An object containing:
  - **resumeId**: A unique identifier for the candidate's resume.
  - **snippet**: A string containing the relevant portion of the candidate's resume.

### Options
- **style**: A string that specifies the desired summary style. Options include:
  - `"short"`: A brief summary focusing on key qualifications.
  - `"detailed"`: A more comprehensive summary that includes additional context and details.
- **maxTokens**: An integer that defines the maximum number of tokens (words) in the generated summary.

### Output
The function should return a summary string that effectively communicates the candidate's qualifications and relevance to the specified role.

### Example
```json
{
  "query": "Looking for a senior software engineer with experience in Node.js and MongoDB.",
  "candidate": {
    "resumeId": "12345",
    "snippet": "John Doe is a senior software engineer with over 5 years of experience in developing scalable applications using Node.js and MongoDB. He has a strong background in building RESTful APIs and has worked on various projects in the e-commerce sector."
  },
  "style": "short",
  "maxTokens": 50
}
```

### Expected Output
A concise summary that highlights John's qualifications for the senior software engineer role, such as:
"John Doe is a senior software engineer with 5+ years of experience in Node.js and MongoDB, specializing in scalable applications and RESTful APIs."