import { AppShell } from '@/components/layout/AppShell';
import { ChatTopbar } from '@/components/features/chat/ChatTopbar';
import { ChatMessages } from '@/components/features/chat/ChatMessages';
import { ChatInputBar } from '@/components/features/chat/ChatInputBar';
import { CandidateModal } from '@/components/features/candidate/CandidateModal';
import { useChat } from '@/hooks/use-chat';
import { useCandidateModal } from '@/hooks/use-candidate-modal';

export function ChatPage() {
  const { messages, search, isSearching } = useChat();
  const { isOpen, candidate, isLoading, closeModal } = useCandidateModal();

  return (
    <AppShell>
      <ChatTopbar />
      <ChatMessages messages={messages} onSuggestionSelect={search} />
      <ChatInputBar onSubmit={search} isLoading={isSearching} />

      <CandidateModal
        isOpen={isOpen}
        onClose={closeModal}
        candidate={candidate}
        isLoading={isLoading}
      />
    </AppShell>
  );
}
