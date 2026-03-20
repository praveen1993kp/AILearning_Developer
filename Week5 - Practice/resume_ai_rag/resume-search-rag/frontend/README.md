# Resume Search Frontend

This is the frontend scaffold for the Resume Search RAG project.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

Dev server runs on Vite (default port 5173). Adjust `VITE_API_BASE_URL` in `.env` if your backend runs on a different host/port.

Phase 2 Checklist (API client & env):
- `frontend/src/api/index.ts` implemented with typed wrappers and error handling.
- `frontend/src/types.ts` contains common types for candidates and search responses.
- `.env` contains `VITE_API_BASE_URL` and `VITE_DEFAULT_TOPK`.
- `SearchPage` calls `endToEndSearch` and logs response (use network tab to verify).

Validation steps:
1. Start backend locally and dev frontend: `cd frontend && npm run dev`.
2. Open browser console/network and run a search — confirm request goes to `http://localhost:3000/v1/search` and you get a JSON response.
3. If backend responds with errors, check frontend console for normalized error messages from the API client.
