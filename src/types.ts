export interface BotProps {
  name?: string;
  instruction?: string;
  timeout?: number;
}

export interface Message {
  name?: string;
  role: "system" | "assistant" | "user";
  content: string;
}

export interface SessionData {
  conversationSummary?: string;
  timestamp?: number;
}

export interface UserPromptOptions {
  chatId?: string;
  userName?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  n?: number;
  stream?: boolean;
  presencePenalty?: number;
  frequencyPenalty?: number;
  userId?: string;
}
