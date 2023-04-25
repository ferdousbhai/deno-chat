import type { BotProps, Message, UserPromptOptions } from "./types.ts";
import { fetchChatCompletion, promptToMessages } from "./helperFunctions.ts";

export class StatelessAI {
  #systemMessage: Message;

  constructor(botProps?: BotProps) {
    this.#systemMessage = {
      name: botProps?.name,
      content: botProps?.instruction ||
        "You are a friendly and helpful assistant.",
      role: "system",
    };
  }

  // Getters
  systemMessage() {
    return this.#systemMessage;
  }

  // query the AI
  async ask(
    prompt: string | Message | Message[],
    options?: UserPromptOptions,
  ): Promise<Message | void> {
    // Setup userMessage
    const userMessages: Message[] = promptToMessages(prompt, options);
    const assistantMessage = await fetchChatCompletion([
      this.#systemMessage,
      ...userMessages,
    ], options);
    // Set assistant name if not provided by OpenAI
    assistantMessage.name = assistantMessage.name || this.#systemMessage.name;
    return assistantMessage;
  }
}
