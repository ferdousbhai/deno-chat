import { OpenAI } from "../deps.ts";
import { load } from "../deps.ts";

const env = await load();
const openAIKey = env["OPENAI_API_KEY"];

// Create OpenAI instance
if (!openAIKey) {
  throw new Error("Please set OPENAI_API_KEY as an environment variable.");
}
export const openAI = new OpenAI(openAIKey);
