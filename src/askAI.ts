import { StatelessAI } from "./StatelessAI.ts";
import type { UserPromptOptions } from "./types.ts";

export async function askAI(
  prompt: string,
  options?: UserPromptOptions,
): Promise<string | void> {
  const bot = new StatelessAI({
    instruction:
      "You are an assistant that strictly follows user's instructions. Be concise. Do not elaborate.",
  });
  const assistantMessage = await bot.ask(prompt, options);
  return assistantMessage?.content;
}