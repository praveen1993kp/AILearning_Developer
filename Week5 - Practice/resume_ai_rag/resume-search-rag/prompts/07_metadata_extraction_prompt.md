# 07 — Metadata Extraction Prompt (for `LLMService.extractMetadata`)

Role: Assistant that extracts structured metadata from raw resume text.

Goal
----
Return a compact JSON object with `skills`, `jobTitles`, `totalExperienceYears`, `relevantExperienceYears`, and optionally `education` and `location`.

Input
-----
Single field: `rawText` (string)

Output schema
-------------
{
  "skills": ["skill1", "skill2"],
  "jobTitles": ["title1", "title2"],
  "totalExperienceYears": number | null,
  "relevantExperienceYears": number | null,
  "education": ["degree, institution, year?"],
  "location": "city, country" | null
}

Constraints
-----------
- Return only data present or directly inferable from the text. Do not hallucinate.
- Normalize skills to known tokens where possible (e.g., "node.js" -> "Node.js").

Example
-------
Input: rawText describing 5 years as a backend engineer with Node.js and MongoDB

Output: { "skills": ["Node.js","MongoDB"], "jobTitles": ["Backend Engineer"], "totalExperienceYears": 5 }
# Metadata Extraction Prompt for GitHub Copilot

## Purpose
This prompt is designed to assist in generating code for extracting metadata from resumes. The metadata includes skills, job titles, and experience summaries, which are crucial for the resume search algorithm.

## Prompt
```markdown
# Metadata Extraction Prompt

You are tasked with implementing a function that extracts metadata from a given resume text. The metadata should include:

1. **Skills**: A list of skills mentioned in the resume.
2. **Job Titles**: The job titles held by the candidate.
3. **Experience Summary**: A brief summary of the candidate's work experience.

### Requirements
- The function should take a string input representing the resume text.
- It should return an object containing the extracted metadata.
- Use regular expressions or natural language processing techniques to identify and extract the relevant information.
- Ensure that the function is robust and can handle various resume formats.

### Example Input
```plaintext
ASHWIN P is an experienced Automation QA Engineer with 3.3 years of hands-on experience in designing, developing, and executing automated test scripts for web and API applications. He is skilled in Selenium WebDriver, Java, TestNG, Maven, Jenkins, Git, Postman, and SQL.
```

### Example Output
```json
{
  "skills": ["Selenium WebDriver", "Java", "TestNG", "Maven", "Jenkins", "Git", "Postman", "SQL"],
  "jobTitles": ["Automation QA Engineer"],
  "experienceSummary": "3.3 years of hands-on experience in designing, developing, and executing automated test scripts."
}
```

### Additional Notes
- Consider using a library for natural language processing if necessary.
- Ensure that the function is well-documented and includes unit tests to verify its functionality.
```
