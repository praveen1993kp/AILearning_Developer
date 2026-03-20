# Atlas Search BM25 Index (example)

This file contains an example Atlas Search index configuration that uses BM25 scoring for text fields. Apply this index JSON in the MongoDB Atlas UI when creating a new Search index for the `resumes` collection.

Example index JSON (use Atlas Search UI -> Create Search Index -> 'JSON Editor'):

{
  "mappings": {
    "dynamic": false,
    "fields": {
      "text": {
        "type": "string",
        "analyzer": "lucene.english",
        "index": true
      },
      "skills": {
        "type": "string",
        "analyzer": "lucene.keyword",
        "index": true
      },
      "role": {
        "type": "string",
        "analyzer": "lucene.english",
        "index": true
      },
      "company": {
        "type": "string",
        "analyzer": "lucene.english",
        "index": true
      },
      "experienceSummary": {
        "type": "string",
        "analyzer": "lucene.english",
        "index": true
      }
    }
  },
  "default_analyzer": "lucene.english",
  "indexName": "bm25_search_resume"
}

Notes:
- Configure the index name to match `BM25_INDEX_NAME` in your `.env` (default `bm25_search_resume`).
- The `text` operator in aggregation uses the index's analyzers and scoring; BM25 is the standard scoring algorithm for lucene analyzers.
- You can refine analyzers, synonyms and mappings according to your data characteristics.
