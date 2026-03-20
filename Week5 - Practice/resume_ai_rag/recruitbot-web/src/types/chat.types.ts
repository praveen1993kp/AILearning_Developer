import { SearchResult } from './search.types';

export enum MessageType {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  results?: SearchResult[];
  isLoading?: boolean;
  timestamp: Date;
}
