import type {
  BotProps,
  Message,
  SessionData,
  UserPromptOptions,
} from "./types.ts";
import { openAI } from "./config.ts";

export class Bot {
  #RECENT_MESSAGES_LIMIT = 4;
  name?: string;
  instruction: string;
  sessions: Map<string, SessionData>;

  constructor(botProps?: BotProps) {
    this.name = botProps?.name;
    this.instruction = botProps?.instruction || "You are a friendly and helpful AI.";
    this.sessions = new Map<string, SessionData>();
  }

  #startSession(chatId: string) {
    !this.sessions.has(chatId) && this.sessions.set(chatId, {
      recentMessages: [],
      longTermMemory: [],
    });
  }

  #saveContext(chatId: string, context: Message[]) {
    // TODO: Save context in ChromaDB
    return [chatId, context];
  }

  async ask(userPrompt: string, options?: UserPromptOptions): Promise<string> {
    const { chatId, userName, model, temperature } = options || {};
    // Setup chat session if chatId is provided, and if it doesn't exist:
    chatId && this.#startSession(chatId);
    // Setup userMessage:
    const userMessage: Message = {
      name: userName,
      role: "user",
      content: userPrompt,
    };
    // Setup systemMessage:
    const systemMessage: Message = {
      name: this.name,
      role: "system",
      content: this.instruction,
    };
    // Setup recentMessages array, and add user messages to it
    const recentMessages: Message[] =
      chatId && this.sessions.get(chatId)!.recentMessages || [];
    recentMessages.push(userMessage);
    // Fetch assistant response
    try {
      const chatCompletion = await openAI.createChatCompletion({
        model: model || "gpt-3.5-turbo",
        temperature: temperature || 1,
        messages: [systemMessage, ...recentMessages],
      });
      const assistantMessage = chatCompletion.choices[0].message as Message;
      // Set assistant name
      assistantMessage.name = assistantMessage.name || this.name;
      // Add assistant message to recentMessages array
      recentMessages.push(assistantMessage);
      // Save the oldest interaction in longTermMemory if recentMessages array exceeds limit
      const removedMessages =
        recentMessages.length > this.#RECENT_MESSAGES_LIMIT &&
        recentMessages.splice(
          0,
          recentMessages.length - this.#RECENT_MESSAGES_LIMIT,
        );
      removedMessages && chatId && this.#saveContext(chatId, removedMessages);
      return assistantMessage.content;
    } catch (error) {
      return error.message;
    }
  }

  reset(chatId: string) {
    this.sessions.set(chatId, {
      recentMessages: [],
      longTermMemory: [],
    });
  }
}

export async function askAI(prompt: string, options?: UserPromptOptions): Promise<string> {
  const bot= new Bot();
  return await bot.ask(prompt, options);
}