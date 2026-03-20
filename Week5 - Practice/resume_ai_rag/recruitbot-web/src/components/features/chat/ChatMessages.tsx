import { useEffect, useRef } from 'react';
import { Message, MessageType } from '@/types/chat.types';
import { UserBubble } from './UserBubble';
import { BotBubble } from './BotBubble';
import { WelcomeMessage } from './WelcomeMessage';
import { SuggestionChips } from './SuggestionChips';

interface ChatMessagesProps {
  messages: Message[];
  onSuggestionSelect: (text: string) => void;
}

export function ChatMessages({ messages, onSuggestionSelect }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-8 py-8">
        <WelcomeMessage />
        <SuggestionChips onSelect={onSuggestionSelect} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
      {messages.map((msg) =>
        msg.type === MessageType.User ? (
          <UserBubble key={msg.id} content={msg.content} timestamp={msg.timestamp} />
        ) : (
          <BotBubble key={msg.id} content={msg.content} results={msg.results} isLoading={msg.isLoading} timestamp={msg.timestamp} />
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
}
