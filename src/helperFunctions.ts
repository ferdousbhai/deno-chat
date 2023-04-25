import { Message, UserPromptOptions } from "./types.ts";
import { openAI } from "./config.ts";

export function promptToMessages(
  prompt: string | Message | Message[],
  options: UserPromptOptions | undefined,
): Message[] {
  if (typeof prompt === "string") {
    return [{
      name: options?.userName,
      role: "user",
      content: prompt,
    }];
  } else if (Array.isArray(prompt)) {
    return prompt;
  } else {
    return [prompt];
  }
}

export async function fetchChatCompletion(
  messages: Message[],
  options?: UserPromptOptions,
): Promise<Message> {
  // Fetch response, update memory, and return response
  try {
    const chatCompletion = await openAI.createChatCompletion({
      model: options?.model || "gpt-3.5-turbo",
      temperature: options?.temperature || 1,
      messages: messages,
      maxTokens: options?.maxTokens,
      user: options?.userId,
    });
    const assistantMessage = chatCompletion.choices[0].message as Message;
    return assistantMessage;
  } catch (error) {
    return error.message;
  }
}
