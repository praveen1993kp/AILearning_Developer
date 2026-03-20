# Resume Search RAG

## Overview

The Resume Search RAG (Retrieval-Augmented Generation) project is designed to provide an enterprise-grade resume search API that prioritizes result quality over raw speed. The application is built using Node.js and Express, with MongoDB for data storage and Mistral for embeddings and LLM (Large Language Model) functionalities.

## Features

- **Health Check Endpoints**: Monitor the status of the application and database connectivity.
- **Embedding Generation**: Generate embeddings for resumes and search queries using the Mistral API.
- **BM25 Search**: Implement a search algorithm based on the BM25 ranking function to retrieve relevant resumes.
- **Vector Search**: Utilize vector embeddings for enhanced search capabilities.
- **Hybrid Search**: Combine BM25 and vector search results for improved accuracy.
- **LLM Re-Ranking**: Re-rank search results using a large language model for better relevance.
- **Summarization**: Generate summaries of candidate resumes based on job descriptions or queries.
- **Metadata Extraction**: Extract relevant metadata from resumes for improved search and filtering.

## Project Structure

```
resume-search-rag
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── routes
│   │   └── v1
│   │       ├── health.ts
│   │       ├── embeddings.ts
│   │       ├── search.ts
│   │       ├── rerank.ts
│   │       └── summarize.ts
│   ├── services
│   │   ├── SearchService.ts
│   │   ├── EmbeddingService.ts
│   │   ├── LLMService.ts
│   │   └── LoggingService.ts
│   ├── repositories
│   │   └── ResumeRepository.ts
│   ├── config
│   │   └── index.ts
│   ├── middleware
│   │   ├── requestId.ts
│   │   ├── logger.ts
│   │   └── errorHandler.ts
│   └── types
│       └── index.ts
├── prompts
│   ├── README.md
│   ├── copilot-instructions.md
│   ├── 01_embedding_prompt.md
│   ├── 02_bm25_search_prompt.md
│   ├── 03_vector_search_prompt.md
│   ├── 04_hybrid_search_prompt.md
│   ├── 05_rerank_prompt.md
│   ├── 06_summarize_prompt.md
│   └── 07_metadata_extraction_prompt.md
├── .vscode
│   └── extensions.json
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or Atlas)
- Mistral API access for embeddings and LLM functionalities

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/resume-search-rag.git
   cd resume-search-rag
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your environment variables.

### Running the Application

To start the application, run:
```
npm start
```

The server will be available at `http://localhost:3000`.

### API Documentation

Refer to the individual route files in the `src/routes/v1` directory for detailed API documentation on each endpoint.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.