# Frontend Implementation Steps

## Phase 1 — Scaffold frontend (React + Vite + TypeScript)
- Goal: Create a minimal React + TypeScript app in `frontend/` to host the UI.
- Actions:
  - Run Vite scaffold and install deps: React, axios, react-router, Zustand (or context) for state, Tailwind or Chakra for styling (optional), testing libs.
  - Create `frontend/` folder, basic `index.html`, `src/main.tsx`, `src/App.tsx`.
- Files to create:
  - `frontend/package.json`, `frontend/vite.config.ts`, `frontend/src/main.tsx`, `frontend/src/App.tsx`
- Commands:
  - `npm create vite@latest frontend -- --template react-ts`
  - `cd frontend`
  - `npm install axios react-router-dom`
- Checkpoints / validation:
  - `npm run dev` starts without errors.
  - Open `http://localhost:5173` (or Vite port) — default app renders.

## Phase 2 — Add API client + env config
- Goal: Create a small typed API client to call server endpoints and centralize base URL.
- Actions:
  - Add `src/api/index.ts` with functions: `health()`, `bm25Search()`, `vectorSearch()`, `hybridSearch()`, `endToEndSearch()`, `rerank()`, `summarize()`, `embeddings()`.
  - Use `axios` with `BASE_URL` from `.env` (`VITE_API_BASE_URL`).
- Files:
  - `frontend/src/api/index.ts`
  - `frontend/.env` (local dev: `VITE_API_BASE_URL=http://localhost:3000`)
- Checkpoints:
  - From React app console, call `health()` and print response.
  - `network` tab shows request to `http://localhost:3000/v1/health`.

## Phase 3 — Create basic Search UI + health check
- Goal: Implement a simple `SearchPage` with a text input, submit button, and health status indicator.
- Actions:
  - Components: `SearchForm.tsx`, `HealthIndicator.tsx`, `SearchPage.tsx`
  - Wire router: `/` → `SearchPage`
- Behavior:
  - Enter query, press search → call `endToEndSearch` (or start with BM25) and show loading indicator.
- Checkpoints:
  - Health status shows green/OK from `health()` endpoint.
  - Typing query and pressing Search triggers API call and shows a “loading” state.

## Phase 4 — Add BM25 / Vector / Hybrid controls
- Goal: Allow choosing search mode and topK.
- Actions:
  - Add toggle/select for mode: `bm25`, `vector`, `hybrid`, `pipeline`.
  - Add numeric input for `topK`, checkbox for `summarize`, `rerankTopN`.
  - Map selection to API route: `/v1/search/bm25`, `/v1/search/vector`, `/v1/search/hybrid`, `/v1/search` (pipeline).
- Checkpoints:
  - Selecting different modes issues requests to correct endpoints (check `Network` tab).

## Phase 5 — Implement Results list and ResultItem component
- Goal: Render results from backend with metadata, scores, and optional summary.
- Actions:
  - Components: `ResultsList.tsx`, `ResultItem.tsx`.
  - Fields to display: `resumeId`, `snippet`, `score` (if present), `source`, `summary`.
  - Add copy/export buttons and view/full-resume modal.
- Checkpoints:
  - Results appear with 10 items (or fewer) matching API response.
  - Summaries (if present) render below each item.

## Phase 6 — Add Rerank UI + integration
- Goal: Allow re-ranking of shown candidates using `/v1/search/rerank`.
- Actions:
  - Add per-result checkbox and global “Rerank selected” button or “Rerank top N” control.
  - Call `POST /v1/search/rerank` with `{ query, candidates, topK }`.
  - Replace results order with returned ranked list.
- Checkpoints:
  - Request payload contains selected candidates JSON.
  - Response reorders UI list; show small toast "Re-ranked" and show `source` or `warning` if fallback occurred.

## Phase 7 — Add Summarize UI + integration
- Goal: Allow generating human-friendly summary for any candidate via `/v1/search/summarize`.
- Actions:
  - Add "Summarize" button on each `ResultItem`.
  - Call `POST /v1/search/summarize` with `{ query, candidate, style, maxTokens }`.
  - Display returned summary inline or in a modal.
- Checkpoints:
  - Summary request completes and text appears.
  - If summary is empty, show “Summary not available — fallback occurred”.

## Phase 8 — End-to-end pipeline UI + progress/timings
- Goal: Expose the pipeline options and show component timings (embeddingMs, bm25Ms, vectorMs, rerankMs, summarizeMs).
- Actions:
  - Add "Run pipeline" mode or option in search form.
  - Show a side panel with `componentTimings` returned by `/v1/search`.
  - Show spinner + progress stages (e.g., Embedding → BM25 → Vector → Rerank → Summarize).
- Checkpoints:
  - Timings appear and are plausible.

## Phase 9 — Styling, responsive layout, accessibility
- Goal: Make UI usable on desktop and mobile and accessible.
- Actions:
  - Pick a component library (Tailwind, Chakra, Material).
  - Ensure keyboard navigation, aria labels, contrast.
- Checkpoints:
  - Lighthouse accessibility score ≥ 80.

## Phase 10 — Add tests (unit + e2e)
- Goal: Add unit tests for components and e2e tests for flows.
- Actions:
  - Add `vitest` + `@testing-library/react` for unit tests.
  - Add Cypress or Playwright for end-to-end: test search → rerank → summarize flows (mock server or use dev server).
- Checkpoints:
  - Unit tests pass locally.
  - E2E happy path passes in CI or locally with test server.

## Phase 11 — Build & deploy
- Goal: Prepare production build and optionally serve via same Node backend or static host.
- Actions:
  - Add `npm run build` and production server config.
  - Option A: Serve static files from Express (`resume-search-rag/src/server.ts` static middleware).
  - Option B: Deploy to Netlify/Vercel and point API to deployed backend.
- Checkpoints:
  - `npm run build` produces `dist/`
  - Production site loads and calls backend correctly.

## Extras / Implementation notes
- State management: use local component state for search; use lightweight global store for user prefs (topK, baseUrl).
- Error handling & UX: show clear messages when backend returns fallback; display `warning` or `source` fields from responses.
- Dev tips: start with `bm25` mode to avoid embedding/LLM dependencies while iterating UI.

## Files/components to add early
- `frontend/src/components/SearchForm.tsx`
- `frontend/src/components/ResultsList.tsx`
- `frontend/src/components/ResultItem.tsx`
- `frontend/src/api/index.ts`
- `frontend/src/pages/SearchPage.tsx`

## Env keys
- `VITE_API_BASE_URL` → `http://localhost:3000` (dev)
- Add `VITE_DEFAULT_TOPK` optionally.

Document created: Frontend_Implementation_Steps.md and Frontend_Implementation_Steps.pdf in `docs/`.
