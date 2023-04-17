import type {
  BotProps,
  Message,
  SessionData,
  UserPromptOptions,
} from "./types.ts";
import { openAI } from "./config.ts";

export class Bot {
  session: Map<string, SessionData>;
  name?: string;
  instruction?: string;

  constructor(botProps?: BotProps) {
    this.name = botProps?.name;
    this.instruction = botProps?.instruction;
    this.session = new Map<string, SessionData>();
  }

  #start(chatId: string) {
    this.instruction
      ? this.session.set(chatId, {
        history: [{ role: "system", content: this.instruction }],
      })
      : this.session.set(chatId, { history: [] });
    this.session.get(chatId)!.history[0].name =
      (this.instruction && this.name) && this.name;
  }

  async ask(userPrompt: string, options?: UserPromptOptions): Promise<string> {
    const { chatId, userName, model, temperature } = options || {};
    const userMessage: Message = {
      role: "user",
      content: userPrompt,
    };
    userName && (userMessage.name = userName);
    chatId && !this.session.has(chatId) && this.#start(chatId);
    chatId && this.session.get(chatId)!.history.push(userMessage);
    try {
      const chatCompletion = await openAI.createChatCompletion({
        model: model || "gpt-3.5-turbo",
        temperature: temperature || 1,
        messages: chatId ? this.session.get(chatId)!.history : [userMessage],
      });
      const assistantMessage = chatCompletion.choices[0].message as Message;
      this.name && (assistantMessage.name = this.name);
      chatId && this.session.get(chatId)!.history.push(assistantMessage);
      return assistantMessage.content;
    } catch (error) {
      return error.message;
    }
  }

  reset(chatId: string) {
    this.#start(chatId);
  }
}
