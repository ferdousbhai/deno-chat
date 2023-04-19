import type {
  BotProps,
  Message,
  SessionData,
  UserPromptOptions,
} from "./types.ts";
import { openAI } from "./config.ts";

export class Bot {
  #CHAT_CONTEXT_LIMIT = 7; // Max number of messages to send to OpenAI in each request
  #systemMessage: Message;
  sessions: Map<string, SessionData>;

  constructor(botProps?: BotProps) {
    this.#systemMessage = {
      name: botProps?.name,
      role: "system",
      content: botProps?.instruction ||
      "You are a friendly and helpful AI.",
    };
    this.sessions = new Map<string, SessionData>();
  }

  #startSession(chatId: string) {
    !this.sessions.has(chatId) && this.sessions.set(chatId, {
      messages: []
    });
  }

  #saveConversation(chatId: string, messages: Message[]) {
    // Save chat in ChromaDB for future retrieval
    // #TODO: 
    return [chatId, messages]; // Placeholder
  }

  async ask(userPrompt: string, options?: UserPromptOptions): Promise<string> {
    const { chatId, userName, model, temperature, maxTokens, userId } = options || {};
    // Setup chat session
    chatId && this.#startSession(chatId);
    // Search long term memory
    //#TODO
    // Setup userMessage
    const userMessage: Message = {
      name: userName,
      role: "user",
      content: userPrompt,
    };
    // Add userMessage to chat session
    chatId && this.sessions.get(chatId)!.messages.push(userMessage);
    // Fetch assistant response
    try {
      const chatCompletion = await openAI.createChatCompletion({
        model: model || "gpt-3.5-turbo",
        temperature: temperature || 1,
        messages: [this.#systemMessage, ...chatId && this.sessions.get(chatId)?.messages.slice(-this.#CHAT_CONTEXT_LIMIT) || [userMessage]],
        maxTokens: maxTokens || 1000,
        user: userId,
      });
      const assistantMessage = chatCompletion.choices[0].message as Message;
      // Set assistant name if not provided by OpenAI
      assistantMessage.name = assistantMessage.name || this.#systemMessage.name;
      // Add assistant message to messages array
      chatId && this.sessions.get(chatId)?.messages.push(assistantMessage);
      return assistantMessage.content;
    } catch (error) {
      return error.message; 
    }
  }

  reset(chatId: string) {
    if (this.sessions.has(chatId)) {
      const messages = this.sessions.get(chatId)!.messages;
      messages && this.#saveConversation(chatId, messages);
      this.sessions.set(chatId, {
        messages: []
      });
    }
  }
}

export async function askAI(
  prompt: string,
  options?: UserPromptOptions,
): Promise<string> {
  const bot = new Bot();
  return await bot.ask(prompt, options);
}

// TODO
// Reset session after 30 minutes of inactivity
// keep timestamps as metadata
// keep top 5 results when searching for context
// embed after each session reset