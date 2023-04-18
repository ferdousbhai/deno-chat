export interface BotProps {
  name?: string;
  instruction?: string;
}

export interface Message {
  name?: string;
  role: "system" | "assistant" | "user";
  content: string;
}

export interface SessionData {
  recentMessages: Message[];
  longTermMemory?: Message[];
}

export interface UserPromptOptions {
  chatId?: string;
  userName?: string;
  model?: string;
  temperature?: number;
}
