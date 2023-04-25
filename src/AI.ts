import type {
  BotProps,
  Message,
  SessionData,
  UserPromptOptions,
} from "./types.ts";
import { StatelessAI } from "./StatelessAI.ts";
import { fetchChatCompletion, promptToMessages } from "./helperFunctions.ts";
import { summarizesConversation } from "./helperBots.ts";

export class AI extends StatelessAI {
  #chatSessions: Map<string, SessionData>;
  #timeout: number; // Time in milliseconds before a session is reset

  constructor(botProps?: BotProps) {
    super(botProps);
    this.#chatSessions = new Map<string, SessionData>();
    this.#timeout = botProps?.timeout || 30 * 60 * 1000; // 30 minutes
  }

  conversationSummary(chatId: string): string {
    if (!this.#chatSessions.has(chatId)) {
      throw new Error(
        `No chat session found with chatId: ${chatId}. Please start a new chat session.`,
      );
    }
    if (!this.#chatSessions.get(chatId)!.conversationSummary) {
      throw new Error(
        `No conversation summary found for chatId: ${chatId}.`,
      );
    }
    return this.#chatSessions.get(chatId)!.conversationSummary!;
  }

  // Add long and short term memory
  async #updateMemory(chatId: string, messages: Message[]) {
    // Summarize conversation:
    const previousSummary = this.#chatSessions.get(chatId)!.conversationSummary;
    const promptText = previousSummary
      ? `You are given a context and a conversation that follows. Write a paragraph progressively summarizing the context and the conversation. Start by repeating the context. Be concise.\n\nContext:\n${previousSummary}\n\nConversation:\n`
      : "Summarize the following conversation.";
    messages.push({ role: "system", content: promptText });
    this.#chatSessions.get(chatId)!.conversationSummary =
      (await summarizesConversation.ask(messages))?.content;
    // Update timestamp
    this.#chatSessions.get(chatId)!.timestamp = Date.now();
    // Save sesion in ChromaDB for future retrieval
    // TODO
  }

  reset(chatId: string) {
    // Reset session
    if (this.#chatSessions.has(chatId)) {
      this.#chatSessions.set(chatId, {});
    }
  }

  async ask(
    prompt: string | Message | Message[],
    options?: UserPromptOptions,
  ): Promise<Message | void> {
    const { chatId } = options || {};
    if (chatId) {
      // Setup chat session if not already started
      !this.#chatSessions.has(chatId) && this.#chatSessions.set(chatId, {});
      // Restart session if timeout reached
      const timestamp = this.#chatSessions.get(chatId)!.timestamp;
      timestamp && (Date.now() - timestamp > this.#timeout) &&
        this.reset(chatId);
    }
    // Inititize messages array with system message
    const messages: Message[] = [this.systemMessage()];
    // Add conversationSummary as system message if available
    const conversationSummary = chatId &&
      this.#chatSessions.get(chatId)!.conversationSummary;
    conversationSummary && messages.push({
      role: "system",
      content: conversationSummary,
    });
    // Add user message(s) to messages array
    const userMessages: Message[] = promptToMessages(prompt, options);
    messages.push(...userMessages);

    const assistantMessage = await fetchChatCompletion(messages, options);
    // Set assistant name if not provided by OpenAI
    assistantMessage.name = assistantMessage.name || this.systemMessage().name;
    // Update memory
    if (chatId) {
      await this.#updateMemory(chatId, [...userMessages, assistantMessage]);
    }
    return assistantMessage;
  }
}
