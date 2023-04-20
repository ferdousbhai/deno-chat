import type {
  BotProps,
  Message,
  SessionData,
  UserPromptOptions,
} from "./types.ts";
import { openAI } from "./config.ts";

export class AI {
  #messagesLimit = 7; // Max number of messages to keep in memory
  #timeout = 30 * 60 * 1000; // 30 minutes
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
    // Setup chat session if not already started
    !this.sessions.has(chatId) && this.sessions.set(chatId, {
      messages: [],
      timestamps: [],
    });
  }

  #saveConversation(chatId: string, messages: Message[]) {
    // Save chat in ChromaDB for future retrieval
    // #TODO:
    return [chatId, messages]; // Placeholder
  }

  async ask(userPrompt: string, options?: UserPromptOptions): Promise<string> {
    const { chatId, userName, model, temperature, maxTokens, userId } =
      options || {};
    // Setup userMessage
    const userMessage: Message = {
      name: userName,
      role: "user",
      content: userPrompt,
    };
    if (chatId) {
      // Setup chat session if not already started
      this.#startSession(chatId);
      // Reset session if timeout reached
      const lastTimestamp = this.sessions.get(chatId)!.timestamps.at(-1);
      lastTimestamp && (Date.now() - lastTimestamp > this.#timeout) &&
        this.reset(chatId);
      // Add userMessage & timestamp to chat session
      this.sessions.get(chatId)!.messages.push(userMessage);
      this.sessions.get(chatId)!.timestamps.push(Date.now());
      // Remove the oldest messages if message limit reached and save to db
      const messagesLength = this.sessions.get(chatId)!.messages.length;
      if (messagesLength > this.#messagesLimit) {
        const removedMessages = this.sessions.get(chatId)!.messages.splice(
          0,
          messagesLength - this.#messagesLimit,
        );
        this.#saveConversation(chatId, removedMessages);
      }
      // Search long term memory for context
      //#TODO
    }
    // Fetch assistant response
    try {
      const chatCompletion = await openAI.createChatCompletion({
        model: model || "gpt-3.5-turbo",
        temperature: temperature || 1,
        messages: [
          this.#systemMessage,
          ...chatId &&
              this.sessions.get(chatId)?.messages || [userMessage],
        ],
        maxTokens: maxTokens || 1000,
        user: userId,
      });
      const assistantMessage = chatCompletion.choices[0].message as Message;
      // Set assistant name if not provided by OpenAI
      assistantMessage.name = assistantMessage.name || this.#systemMessage.name;
      // Add assistant message and timestamp to chat session
      if (chatId) {
        this.sessions.get(chatId)!.messages.push(assistantMessage);
        this.sessions.get(chatId)!.timestamps.push(Date.now());
      }
      return assistantMessage.content;
    } catch (error) {
      return error.message;
    }
  }

  reset(chatId: string) {
    // Save chat in ChromaDB for future retrieval and reset session
    if (this.sessions.has(chatId)) {
      const messages = this.sessions.get(chatId)!.messages;
      messages && this.#saveConversation(chatId, messages);
      this.sessions.get(chatId)!.messages = [];
    }
  }

  log(chatId: string) {
    if (this.sessions.has(chatId)) {
      const messages = this.sessions.get(chatId)!.messages;
      for (const message of messages) {
        console.log(
          `${
            message.name ? message.name + " " : ""
          }(${message.role}): ${message.content}`,
        );
      }
    }
  }
}

export async function askAI(
  prompt: string,
  options?: UserPromptOptions,
): Promise<string> {
  const bot = new AI();
  return await bot.ask(prompt, options);
}

// TODO
// Embed on each session reset
