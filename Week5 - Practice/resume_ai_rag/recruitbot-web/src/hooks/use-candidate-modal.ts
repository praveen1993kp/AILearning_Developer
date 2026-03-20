import { useCallback, useState } from 'react';
import { candidateApi } from '@/lib/api/candidate.api';
import { useUIStore } from '@/lib/stores/ui.store';
import { CandidateProfile } from '@/types/candidate.types';
import toast from 'react-hot-toast';

export function useCandidateModal() {
  const { isCandidateModalOpen, selectedCandidateId, openCandidateModal, closeCandidateModal } = useUIStore();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = useCallback(async (id: string) => {
    openCandidateModal(id);
    setIsLoading(true);
    try {
      const data = await candidateApi.getCandidate(id);
      setCandidate(data);
    } catch {
      toast.error('Could not load candidate profile');
    } finally {
      setIsLoading(false);
    }
  }, [openCandidateModal]);

  const closeModal = useCallback(() => {
    closeCandidateModal();
    setCandidate(null);
  }, [closeCandidateModal]);

  return { isOpen: isCandidateModalOpen, candidate, isLoading, selectedCandidateId, openModal, closeModal };
}
