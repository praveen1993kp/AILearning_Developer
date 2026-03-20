import apiClient from './client';
import { CandidateProfile } from '@/types/candidate.types';
import { SearchResult } from '@/types/search.types';

// In-memory cache populated from search results
const candidateCache = new Map<string, CandidateProfile>();

export function cacheSearchResults(results: SearchResult[]): void {
  results.forEach((r) => {
    if (r.candidateId) {
      candidateCache.set(r.candidateId, {
        id: r.candidateId,
        resumeId: r.resumeId,
        name: r.name,
        email: r.email,
        phoneNumber: r.phoneNumber,
        experienceYears: r.experienceYears,
        summary: r.summary,
        rawContent: r.content,
      } as CandidateProfile);
    }
  });
}

export const candidateApi = {
  async getCandidate(id: string): Promise<CandidateProfile> {
    // Try dedicated endpoint first
    try {
      const response = await apiClient.get(`/v1/candidate/${id}`);
      return response.data as CandidateProfile;
    } catch {
      // Fall back to cache populated from search results
      const cached = candidateCache.get(id);
      if (cached) return cached;
      throw new Error(`Candidate ${id} not found`);
    }
  },

  clearCache(): void {
    candidateCache.clear();
  },
};
