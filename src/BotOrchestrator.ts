import { AI } from "./AI.ts";
import {
  checksVibe,
  decidesSearch,
  refusesToAnswer,
  takesBreak,
} from "./helperBots.ts";
import { BotProps, Message, UserPromptOptions } from "./types.ts";

export class BotOrchestrator extends AI {
  #chiefBot: AI;
  #breakStartTime: number | undefined; // Time in milliseconds the bot decided to take a break from responding to the user
  #breakDuration = 1 * 60 * 1000; // Time in milliseconds the bot will take a break from responding to the user
  #strikes = 0; // Number of times the bot has refused to answer the user's question

  constructor(botProps?: BotProps) {
    super(botProps);
    this.#chiefBot = new AI(botProps);
  }
  async ask(
    prompt: string | Message | Message[],
    options?: UserPromptOptions | undefined,
  ): Promise<Message | void> {
    // Return if the bot is taking a break
    if (this.#breakStartTime) {
      if (Date.now() - this.#breakStartTime < this.#breakDuration) return;
    }
    // Reset the bot's strikes
    this.#strikes = 0;
    // Check if the user asked politely
    const response = await checksVibe.ask(prompt, { temperature: 0 });
    const isPolite = response!.content.toLowerCase().includes("false") ? false : true;

    // Handle impolite users
    if (!isPolite) {
      this.#strikes++;
      if (this.#strikes == 3) {
        this.#breakStartTime = Date.now();
        return await takesBreak.ask(prompt);
      }
      return await refusesToAnswer.ask(prompt);
    }

    // If the user is poilte, query the AI
    return await this.#chiefBot.ask(prompt, options);
  }
}

console.log(
  await decidesSearch.ask("What's the latest episode of Law and order about?", {
    temperature: 0,
  }),
);
