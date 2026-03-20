import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  selectedCandidateId: string | null;
  isCandidateModalOpen: boolean;
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  // Candidate modal
  openCandidateModal: (id: string) => void;
  closeCandidateModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  selectedCandidateId: null,
  isCandidateModalOpen: false,

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (v) => set({ isSidebarOpen: v }),

  openCandidateModal: (id) => set({ selectedCandidateId: id, isCandidateModalOpen: true }),
  closeCandidateModal: () => set({ isCandidateModalOpen: false, selectedCandidateId: null }),
}));
